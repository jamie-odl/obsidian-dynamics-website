(function (global) {
  var PALETTE = {
    "qr-scan": { stroke: "#fb923c", glow: "251, 146, 60" },
    radar: { stroke: "#22d3ee", glow: "34, 211, 238" },
    map: { stroke: "#38bdf8", glow: "56, 189, 248" },
    field: { stroke: "#f97316", glow: "249, 115, 22" },
    gateway: { stroke: "#f97316", glow: "249, 115, 22" },
    portal: { stroke: "#a78bfa", glow: "167, 139, 250" },
    sync: { stroke: "#2dd4bf", glow: "45, 212, 191" },
    ota: { stroke: "#818cf8", glow: "129, 140, 248" },
    mail: { stroke: "#e2e8f0", glow: "226, 232, 240" },
    file: { stroke: "#cbd5e1", glow: "203, 213, 225" },
    shield: { stroke: "#4ade80", glow: "74, 222, 128" },
    construction: { stroke: "#fb923c", glow: "251, 146, 60" },
    logistics: { stroke: "#fbbf24", glow: "251, 191, 36" },
    utilities: { stroke: "#38bdf8", glow: "56, 189, 248" },
    facilities: { stroke: "#818cf8", glow: "129, 140, 248" },
    events: { stroke: "#e879f9", glow: "232, 121, 249" },
    agriculture: { stroke: "#4ade80", glow: "74, 222, 128" },
    mining: { stroke: "#fdba74", glow: "253, 186, 116" },
    healthcare: { stroke: "#f472b6", glow: "244, 114, 182" },
    cloud: { stroke: "#94a3b8", glow: "148, 163, 184" },
    telemetry: { stroke: "#60a5fa", glow: "96, 165, 250" },
    cellular: { stroke: "#2dd4bf", glow: "45, 212, 191" },
    layers: { stroke: "#fb923c", glow: "251, 146, 60" },
    lifecycle: { stroke: "#fbbf24", glow: "251, 191, 36" },
    mobile: { stroke: "#c084fc", glow: "192, 132, 252" },
  };

  var PATHS = {
    "qr-scan":
      '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
    radar:
      '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/>',
    map:
      '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    field:
      '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    portal:
      '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    gateway:
      '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
    sync:
      '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    ota:
      '<path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/>',
    mail:
      '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
    file:
      '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    shield:
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    construction:
      '<path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/>',
    logistics:
      '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    utilities:
      '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    facilities:
      '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
    events:
      '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    agriculture:
      '<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>',
    mining:
      '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    healthcare:
      '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    cloud:
      '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    telemetry:
      '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
    cellular:
      '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>',
    layers:
      '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    lifecycle:
      '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    mobile:
      '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  };

  var SIZE = { default: 36, feature: 32, vertical: 28, card: 40 };

  function strokeWidthFor(variant) {
    return variant === "feature" || variant === "vertical" ? 2 : 1.75;
  }

  function svg(name, size, variant) {
    var path = PATHS[name];
    if (!path) return "";
    var strokeWidth = strokeWidthFor(variant);
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
      strokeWidth +
      '" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      path +
      "</svg>"
    );
  }

  function iconBox(name, variant, extraClass) {
    var palette = PALETTE[name];
    var path = PATHS[name];
    if (!palette || !path) return "";
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
      svg(name, size, variant) +
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
