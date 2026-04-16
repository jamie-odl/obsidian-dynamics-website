# Asset Reference Integrity Test
# Run before deploying to catch broken or stale asset references.
# Usage: powershell -File test-assets.ps1

$ErrorCount = 0
$root = $PSScriptRoot

# All HTML files in the project root
$htmlFiles = Get-ChildItem -Path $root -Filter "*.html"

# --- Test 1: No hashed asset filenames in HTML ---
# Hashed filenames look like: name.8hexchars.ext  (e.g. styles.45362ce3.css, main.0493868f.js)
$hashPattern = "(?:href|src)=[`"']((?:css|js|img)/[^`"']+\.[0-9a-f]{6,12}\.[a-z]+)[`"']"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $found = [regex]::Matches($content, $hashPattern)
    foreach ($m in $found) {
        Write-Host "FAIL: $($file.Name) references hashed asset: $($m.Groups[1].Value)" -ForegroundColor Red
        $ErrorCount++
    }
}

# --- Test 2: All referenced CSS/JS files exist on disk ---
$refPattern = "(?:href|src)=[`"']((?:css|js)/[^`"']+)[`"']"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $refs = [regex]::Matches($content, $refPattern)
    foreach ($ref in $refs) {
        $assetPath = Join-Path $root ($ref.Groups[1].Value -replace '/', '\')
        if (-not (Test-Path $assetPath)) {
            Write-Host "FAIL: $($file.Name) references missing file: $($ref.Groups[1].Value)" -ForegroundColor Red
            $ErrorCount++
        }
    }
}

# --- Test 3: Ensure canonical assets are referenced (not alternates) ---
$expectedCSS = "css/styles.css"
$expectedJS  = "js/main.js"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw

    if ($content -match 'rel="stylesheet"' -and $content -notmatch [regex]::Escape($expectedCSS)) {
        Write-Host "FAIL: $($file.Name) does not reference $expectedCSS" -ForegroundColor Red
        $ErrorCount++
    }
    if ($content -match '<script\s+src=' -and $content -notmatch [regex]::Escape($expectedJS)) {
        Write-Host "FAIL: $($file.Name) does not reference $expectedJS" -ForegroundColor Red
        $ErrorCount++
    }
}

# --- Summary ---
if ($ErrorCount -eq 0) {
    Write-Host "`nPASS: All asset references are correct." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nFAILED: $ErrorCount issue(s) found." -ForegroundColor Red
    exit 1
}
