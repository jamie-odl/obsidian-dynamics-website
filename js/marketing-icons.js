(function (global) {
  var PALETTE = {
    "qr-scan": { stroke: "#fb923c", glow: "251, 146, 60" },
    radar: { stroke: "#22d3ee", glow: "34, 211, 238" },
    field: { stroke: "#f97316", glow: "249, 115, 22" },
    portal: { stroke: "#a78bfa", glow: "167, 139, 250" },
    gateway: { stroke: "#f97316", glow: "249, 115, 22" },
    shield: { stroke: "#4ade80", glow: "74, 222, 128" },
    construction: { stroke: "#fb923c", glow: "251, 146, 60" },
    logistics: { stroke: "#fbbf24", glow: "251, 191, 36" },
    utilities: { stroke: "#38bdf8", glow: "56, 189, 248" },
    facilities: { stroke: "#818cf8", glow: "129, 140, 248" },
  };

  var PATHS = {
    "qr-scan":
      '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
    radar:
      '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/>',
    field:
      '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    portal:
      '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    gateway:
      '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
    shield:
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    construction:
      '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><path d="M14 15v-3a6 6 0 0 0-6-6"/>',
    logistics:
      '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    utilities:
      '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    facilities:
      '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  };

  var SIZE = { default: 36, feature: 32, vertical: 28, card: 40 };

  function svg(name, size) {
    var path = PATHS[name];
    if (!path) return "";
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      path +
      "</svg>"
    );
  }

  function iconBox(name, variant, extraClass) {
    var palette = PALETTE[name];
    if (!palette) return "";
    variant = variant || "default";
    var size = SIZE[variant] || SIZE.default;
    var cls = "mkt-icon-box mkt-icon-box--" + variant + (extraClass ? " " + extraClass : "");
    return (
      '<span class="' +
      cls +
      '" data-icon="' +
      name +
      '" style="--mkt-icon-stroke:' +
      palette.stroke +
      ";--mkt-icon-glow:" +
      palette.glow +
      '">' +
      svg(name, size) +
      "</span>"
    );
  }

  function enhanceIcons(root) {
    (root || document).querySelectorAll("[data-mkt-icon]").forEach(function (el) {
      var name = el.getAttribute("data-mkt-icon");
      var variant = el.getAttribute("data-mkt-icon-variant") || "default";
      var extra = el.getAttribute("data-mkt-icon-class") || "";
      el.outerHTML = iconBox(name, variant, extra);
    });
  }

  global.MktIcons = { iconBox: iconBox, enhanceIcons: enhanceIcons };
})(window);
