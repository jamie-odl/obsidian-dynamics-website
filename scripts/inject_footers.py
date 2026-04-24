"""One-off: add empty footer before main.js for pages missing <footer> (idempotent)."""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
SNIPPET = '\n<footer class="footer" role="contentinfo"><div class="container"></div></footer>\n'
for path in sorted(root.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    if "class=\"footer\"" in text or "class='footer'" in text:
        continue
    if "js/main.js" not in text:
        continue
    if '<footer class="footer"' in text:
        continue
    needle = '<script src="js/main.js"></script>'
    if needle not in text:
        print("skip (no main.js pattern):", path.name)
        continue
    text2 = text.replace(needle, SNIPPET + needle, 1)
    if text2 == text:
        print("no change:", path.name)
        continue
    path.write_text(text2, encoding="utf-8")
    print("injected:", path.name)
