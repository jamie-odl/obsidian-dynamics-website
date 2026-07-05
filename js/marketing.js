(function () {
  const SITE = {
    name: "Obsidian",
    tagline: "Track what matters.",
    url: "https://www.weareobsidian.co.uk",
    email: "jamie@obsidiandynamics.co.uk",
    company: "Obsidian Dynamics Limited",
    address: "Lytchett House, 13 Freeland Park, Wareham Road, Poole, Dorset BH16 6FA, United Kingdom",
    ico: "ZC141175",
    year: 2026,
    legalUpdated: "28 June 2026",
  };

  const NAV = [
    { href: "/demo", label: "Demo" },
    { href: "/pilot", label: "Pilot" },
    { href: "/construction", label: "Construction" },
    { href: "/logistics", label: "Logistics" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/about", label: "About" },
  ];

  function activePath(href) {
    const path = window.location.pathname.replace(/\.html$/, "") || "/";
    if (href.startsWith("/#")) return false;
    const bare = href.replace(/\.html$/, "");
    return path === bare || path.startsWith(bare + "/");
  }

  function navHtml() {
    return NAV.map(function (item) {
      const cls = activePath(item.href) ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + cls + ">" + item.label + "</a>";
    }).join("");
  }

  function headerHtml() {
    return (
      '<header class="mkt-header">' +
      '<div class="mkt-container mkt-header__inner">' +
      '<a href="/" class="mkt-logo">' +
      '<div class="mkt-logo__title">OBSIDIAN</div>' +
      '<div class="mkt-logo__tag">' +
      SITE.tagline +
      "</div></a>" +
      '<nav class="mkt-nav" aria-label="Primary">' +
      navHtml() +
      "</nav>" +
      '<div class="mkt-header__actions">' +
      '<button type="button" class="mkt-mobile-nav__toggle" id="mktNavToggle" aria-expanded="false" aria-controls="mktMobileNav" aria-label="Open menu">' +
      '<span></span><span></span><span></span></button>' +
      '<a href="/sign-in" class="mkt-btn-outline mkt-btn-sm">Sign in</a>' +
      '<a href="/contact?intent=pilot" class="mkt-btn-primary mkt-btn-sm">Request pilot</a>' +
      "</div></div>" +
      '<nav class="mkt-mobile-nav" id="mktMobileNav" aria-label="Mobile" hidden>' +
      navHtml() +
      '<a href="/sign-in" class="mkt-btn-outline mkt-btn-sm">Sign in</a>' +
      '<a href="/contact?intent=pilot" class="mkt-btn-primary mkt-btn-sm">Request pilot</a>' +
      "</nav></header>"
    );
  }

  function footerHtml() {
    return (
      '<footer class="mkt-footer">' +
      '<div class="mkt-container">' +
      '<div class="mkt-footer__grid">' +
      '<div><div class="mkt-logo__title mkt-display">OBSIDIAN</div>' +
      '<p class="mkt-footer__blurb">Obsidian Node — asset tracking for sites that work outdoors.</p></div>' +
      '<div><h4>PRODUCT</h4><ul>' +
      '<li><a href="/demo">Live demo</a></li>' +
      '<li><a href="/pilot">Pilot programme</a></li>' +
      '<li><a href="/portal">Asset portal</a></li>' +
      '<li><a href="/admin">Operations</a></li>' +
      '<li><a href="/construction">Construction</a></li>' +
      '<li><a href="/logistics">Logistics</a></li>' +
      "</ul></div>" +
      '<div><h4>COMPANY</h4><ul>' +
      '<li><a href="/about">About</a></li>' +
      '<li><a href="/contact">Contact</a></li>' +
      '<li><a href="/privacy">Privacy</a></li>' +
      '<li><a href="/terms">Terms</a></li>' +
      "</ul>" +
      '<p class="mkt-footer__address">' +
      SITE.address +
      "</p></div></div>" +
      '<div class="mkt-footer__legal"><p>ICO ref ' +
      SITE.ico +
      " · © " +
      SITE.year +
      " " +
      SITE.company +
      "</p></div></div></footer>"
    );
  }

  function bindMobileNav() {
    var toggle = document.getElementById("mktNavToggle");
    var panel = document.getElementById("mktMobileNav");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
      document.body.classList.toggle("mkt-nav-open", !open);
    });
  }

  function bindContactForms() {
    document.querySelectorAll("[data-contact-form]").forEach(function (form) {
      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        var status = form.querySelector("[data-form-status]");
        var submit = form.querySelector('[type="submit"]');
        var intent = form.getAttribute("data-intent") || "general";
        var payload = {
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          organisation: form.organisation ? form.organisation.value.trim() : "",
          message: form.message.value.trim(),
          intent: intent,
          website: "",
        };
        if (submit) submit.disabled = true;
        if (status) status.textContent = "Sending…";
        try {
          var res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            form.reset();
            if (status) status.textContent = "Thanks — we received your message and will reply within 1–2 business days.";
            return;
          }
          if (status) {
            status.textContent =
              res.status === 429
                ? "Too many messages. Please wait and try again."
                : "We could not send your message. Please try again or email us directly.";
          }
        } catch (_) {
          if (status) status.textContent = "Network error. Please email " + SITE.email + ".";
        } finally {
          if (submit) submit.disabled = false;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("mkt-header");
    var footer = document.getElementById("mkt-footer");
    if (header) header.innerHTML = headerHtml();
    if (footer) footer.innerHTML = footerHtml();
    bindMobileNav();
    bindContactForms();
  });
})();
