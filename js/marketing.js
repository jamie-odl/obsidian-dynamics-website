(function () {

  const SITE = {

    name: "Obsidian",

    tagline: "Track what matters.",

    url: "https://www.obsidiandynamics.co.uk",

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



  function navHtml(className) {
    return NAV.map(function (item) {
      const current = activePath(item.href) ? ' aria-current="page"' : "";
      const cls = className ? ' class="' + className + '"' : "";
      return "<a href=\"" + item.href + "\"" + cls + current + ">" + item.label + "</a>";
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

      navHtml("") +

      "</nav>" +

      '<div class="mkt-header__actions">' +

      '<div class="mkt-mobile-nav">' +

      '<button type="button" class="mkt-mobile-nav__toggle" id="mktNavToggle" aria-expanded="false" aria-controls="mkt-mobile-menu" aria-label="Open menu">' +

      '<span class="mkt-mobile-nav__bars" aria-hidden="true"><span></span><span></span><span></span></span>' +

      '<span class="mkt-mobile-nav__label">Menu</span></button>' +

      '<div class="mkt-mobile-nav__backdrop" id="mktNavBackdrop" hidden aria-hidden="true"></div>' +

      '<nav class="mkt-mobile-nav__panel" id="mkt-mobile-menu" aria-label="Mobile" hidden>' +

      navHtml("mkt-mobile-nav__link") +

      '<a href="/sign-in" class="mkt-mobile-nav__link">Sign in</a>' +

      '<a href="/contact?intent=pilot" class="mkt-btn-primary mkt-mobile-nav__cta">Request pilot</a>' +

      "</nav></div>" +

      '<a href="/sign-in" class="mkt-btn-primary mkt-btn-sm">Sign in</a>' +

      '<a href="/contact?intent=pilot" class="mkt-btn-primary mkt-btn-sm">Request pilot</a>' +

      "</div></div></header>"

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



  function setMobileNavOpen(open) {

    var toggle = document.getElementById("mktNavToggle");

    var panel = document.getElementById("mkt-mobile-menu");

    var backdrop = document.getElementById("mktNavBackdrop");

    if (!toggle || !panel) return;

    toggle.setAttribute("aria-expanded", open ? "true" : "false");

    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    panel.hidden = !open;

    if (backdrop) backdrop.hidden = !open;

    document.body.classList.toggle("mkt-nav-open", open);

  }



  function bindMobileNav() {

    var toggle = document.getElementById("mktNavToggle");

    var panel = document.getElementById("mkt-mobile-menu");

    var backdrop = document.getElementById("mktNavBackdrop");

    if (!toggle || !panel) return;



    toggle.addEventListener("click", function () {

      setMobileNavOpen(toggle.getAttribute("aria-expanded") !== "true");

    });



    if (backdrop) {

      backdrop.addEventListener("click", function () {

        setMobileNavOpen(false);

      });

    }



    panel.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        setMobileNavOpen(false);

      });

    });



    document.addEventListener("keydown", function (event) {

      if (event.key === "Escape") setMobileNavOpen(false);

    });

  }



  function bindStickyCta() {

    if (!document.querySelector(".mkt-hero")) return;

    var bar = document.createElement("div");

    bar.className = "mkt-sticky-cta";

    bar.setAttribute("role", "region");

    bar.setAttribute("aria-label", "Quick actions");

    bar.hidden = true;

    bar.innerHTML =

      '<a href="/contact?intent=pilot" class="mkt-btn-primary mkt-sticky-cta__btn">Request pilot</a>' +

      '<a href="/demo" class="mkt-btn-outline mkt-sticky-cta__btn">Demo</a>';

    document.querySelector(".mkt").appendChild(bar);



    var mq = window.matchMedia("(max-width: 768px)");

    function onScroll() {

      if (!mq.matches) {

        bar.hidden = true;

        return;

      }

      bar.hidden = window.scrollY <= 420;

    }

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    mq.addEventListener("change", onScroll);

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

          website: form.website ? form.website.value : "",

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

            if (status)

              status.textContent = "Thanks — we received your message and will reply within 1–2 business days.";

            return;

          }

          if (status) {

            status.textContent =

              res.status === 429

                ? "Too many messages. Please wait and try again."

                : "We could not send your message. Please try again or email us directly.";

          }

        } catch (_) {

          if (status) status.textContent = "Network error. Please try again shortly, or use the contact form.";

        } finally {

          if (submit) submit.disabled = false;

        }

      });

    });

  }



  function ensureMetaTags() {

    var title = document.title || "Obsidian Dynamics";

    var descEl = document.querySelector('meta[name="description"]');

    var desc = descEl && descEl.getAttribute("content");

    if (!desc) return;

    var canonEl = document.querySelector('link[rel="canonical"]');

    var url = (canonEl && canonEl.getAttribute("href")) || SITE.url + window.location.pathname.replace(/\.html$/, "");

    var image = "https://www.obsidiandynamics.co.uk/img/marketing/hero.jpg";

    function upsert(attr, value, content) {

      var tag = document.querySelector('meta[' + attr + '="' + value + '"]');

      if (!tag) {

        tag = document.createElement("meta");

        tag.setAttribute(attr, value);

        document.head.appendChild(tag);

      }

      if (!tag.getAttribute("content")) tag.setAttribute("content", content);

    }

    upsert("property", "og:site_name", "Obsidian Dynamics");

    upsert("property", "og:locale", "en_GB");

    upsert("property", "og:title", title);

    upsert("property", "og:description", desc);

    upsert("property", "og:url", url);

    upsert("property", "og:type", "website");

    upsert("property", "og:image", image);

    upsert("name", "twitter:card", "summary_large_image");

    upsert("name", "twitter:title", title);

    upsert("name", "twitter:description", desc);

    upsert("name", "twitter:image", image);

  }



  document.addEventListener("DOMContentLoaded", function () {

    var header = document.getElementById("mkt-header");

    var footer = document.getElementById("mkt-footer");

    if (header) header.innerHTML = headerHtml();

    if (footer) footer.innerHTML = footerHtml();

    if (window.MktIcons) window.MktIcons.enhanceIcons();

    bindMobileNav();

    bindContactForms();

    bindStickyCta();

    ensureMetaTags();

  });

})();

