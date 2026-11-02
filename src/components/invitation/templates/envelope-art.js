/** Original floral illustrations from wedding-invitation (1).zip. No DOM code is executed. */
const hex2rgb = (h) => {
  h = h.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgb2hex = (a) =>
  "#" +
  a
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
function mix(a, b, t) {
  const x = hex2rgb(a),
    y = hex2rgb(b);
  return rgb2hex(x.map((v, i) => v + (y[i] - v) * t));
}
const lum = (h) => {
  const [r, g, b] = hex2rgb(h).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const rgbs = (h) => hex2rgb(h).join(",");

export function envelopeArtwork(colours) {
  const CP = colours.main,
    CA = colours.accent,
    CE = colours.envelope,
    W = "#ffffff",
    K = "#000000";
  const PINK = [
      mix(CP, W, 0.55),
      mix(CP, W, 0.72),
      mix(CP, W, 0.42),
      mix(CP, W, 0.82),
    ],
    WINE = [
      mix(CP, K, 0.1),
      mix(CP, W, 0.14),
      mix(CP, K, 0.28),
      mix(CP, W, 0.3),
    ],
    PEACH = [mix(CE, W, 0.5), mix(CE, W, 0.65), mix(CE, W, 0.35)],
    LEAF = [
      CE,
      mix(CE, W, 0.18),
      mix(CE, CA, 0.45),
      mix(CE, K, 0.2),
      mix(CE, CA, 0.2),
      mix(CE, K, 0.35),
    ],
    DK = mix(CP, K, 0.75),
    RIBBON = mix(CP, W, 0.6);
  function placeholder(i) {
    const W = "#ffffff",
      K = "#000000",
      pal = [
        [mix(CA, W, 0.3), mix(CP, K, 0.2)],
        [mix(CE, W, 0.45), mix(CP, K, 0.4)],
        [mix(CA, CE, 0.4), mix(CP, K, 0.1)],
        [mix(CP, W, 0.55), mix(CP, K, 0.5)],
        [mix(CE, W, 0.3), mix(CP, K, 0.3)],
        [mix(CA, W, 0.5), mix(CE, K, 0.45)],
      ][i % 6];
    const x = 190 + (i % 3) * 20;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></linearGradient>
  <radialGradient id="s" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="#fff3d6" stop-opacity=".9"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0"/></radialGradient></defs>
  <rect width="400" height="520" fill="url(#g)"/><circle cx="200" cy="210" r="190" fill="url(#s)"/>
  <g fill="${pal[1]}" opacity=".35"><rect x="30" y="250" width="40" height="270"/><rect x="330" y="230" width="46" height="290"/><path d="M30 250a20 20 0 0 1 40 0zM330 230a23 23 0 0 1 46 0z"/><rect x="85" y="310" width="30" height="210"/><rect x="290" y="300" width="30" height="220"/></g>
  <g fill="${DK}"><circle cx="${x - 34}" cy="285" r="22"/><path d="M${x - 72} 520c-4-70 6-190 38-190s42 120 38 190z"/><circle cx="${x + 34}" cy="262" r="24"/><path d="M${x - 2} 520c-6-90 8-210 36-210s44 120 40 210z"/></g>
  <path d="M${x - 34} 273c-26 6-30 40-26 70" stroke="${DK}" stroke-width="9" fill="none" opacity=".8"/></svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function flower(cx, cy, r, c, layers = 4) {
    let g = `<g transform="translate(${cx} ${cy})">`;
    for (let l = 0; l < layers; l++) {
      const n = 14 - l * 2,
        rr = r * (1 - l * 0.2),
        col = c[l % c.length],
        rot = l * 13;
      for (let k = 0; k < n; k++)
        g += `<ellipse cx="0" cy="${-rr * 0.55}" rx="${rr * 0.2}" ry="${rr * 0.5}" fill="${col}" opacity="${0.9 - l * 0.05}" transform="rotate(${(k * 360) / n + rot})"/>`;
    }
    return (
      g +
      `<circle r="${r * 0.14}" fill="#e8b86a"/><circle r="${r * 0.07}" fill="#8c3b16"/></g>`
    );
  }
  function leafG(x, y, s, rot, col) {
    return `<path d="M0,0C8,-8 10,-26 0,-44C-10,-26 -8,-8 0,0Z" fill="${col}" opacity=".85" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"/>`;
  }
  function stem(x, y, len, rot, col) {
    let s = `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0,0 Q4,${-len / 2} 0,${-len}" stroke="${col}" stroke-width="1.4" fill="none"/>`;
    for (let i = 1; i < 7; i++) {
      const yy = (-len * i) / 7;
      s += `<ellipse cx="7" cy="${yy}" rx="9" ry="3.500" fill="${col}" opacity=".7" transform="rotate(-30 7 ${yy})"/><ellipse cx="-7" cy="${yy - 5}" rx="9" ry="3.500" fill="${col}" opacity=".7" transform="rotate(30 -7 ${yy - 5})"/>`;
    }
    return s + "</g>";
  }
  function floralScene() {
    let s = "";
    s +=
      `<g class="sway">` +
      stem(40, 520, 260, 10, "#a9b3a0") +
      stem(70, 560, 220, 22, "#b9a98f") +
      stem(30, 300, 150, -8, "#a9b3a0") +
      `</g>`;
    s += `<g class="sway b">`;
    [
      [360, 70, LEAF[0]],
      [330, 40, LEAF[1]],
      [300, 120, LEAF[2]],
      [380, 150, LEAF[3]],
      [270, 70, LEAF[4]],
    ].forEach(
      (a, i) =>
        (s += leafG(
          a[0],
          a[1],
          1.1 + i * 0.05,
          [30, -40, 70, -80, 110][i],
          a[2],
        )),
    );
    s +=
      flower(350, 70, 56, WINE) +
      flower(300, 128, 36, PEACH, 3) +
      flower(385, 150, 32, PINK, 3);
    s += `</g><g class="sway">`;
    s +=
      flower(60, 690, 52, WINE) +
      flower(120, 730, 40, PINK) +
      flower(30, 610, 30, PEACH, 3) +
      flower(180, 770, 28, WINE, 3);
    [
      [90, 640, LEAF[1], -20],
      [150, 700, LEAF[0], 60],
      [20, 730, LEAF[2], -60],
    ].forEach((a) => (s += leafG(a[0], a[1], 1.1, a[3], a[2])));
    s +=
      `</g><g class="sway b">` +
      flower(340, 700, 50, PINK) +
      flower(390, 640, 34, WINE, 3) +
      flower(285, 760, 34, PEACH, 3) +
      leafG(300, 690, 1.2, 40, LEAF[0]) +
      leafG(375, 720, 1, -50, LEAF[1]) +
      `</g>`;
    s += `<path d="M0,770 Q80,730 140,790" stroke="${RIBBON}" stroke-width="12" fill="none" opacity=".35"/>`;
    return s;
  }

  function sketch(kind) {
    const arches = `<path d="M60 150V86a14 14 0 0 1 28 0v64M112 150V86a14 14 0 0 1 28 0v64M164 150V86a14 14 0 0 1 28 0v64M216 150V86a14 14 0 0 1 28 0v64"/>`;
    const body =
      kind === "church"
        ? `<path d="M50 150V72L150 22l100 50v78z"/><path d="M50 72h200M130 150V96a20 20 0 0 1 40 0v54M122 48h56"/><path d="M150 8v14M143 14h14"/><circle cx="150" cy="60" r="9"/><path d="M20 150v-70l20-12 10 12M280 150v-70l-20-12-10 12"/>`
        : `<path d="M30 150V70h240v80z"/><path d="M30 70l120-40 120 40"/>${arches}<path d="M30 100h240M30 125h240" stroke-dasharray="2 4"/><path d="M144 30h12v-12h-12z"/>`;
    const trees = `<g><path d="M8 150c-10-20-6-50 6-70 12 20 16 50 6 70z"/><path d="M292 150c-10-20-6-50 6-70 12 20 16 50 6 70z"/></g>`;
    return `<svg class="sketch" viewBox="0 0 312 170" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" opacity=".75">${body}${trees}<path d="M0 150h312" stroke-width="1.4"/><path d="M0 158h312M0 164h312" opacity=".35"/></svg>`;
  }
  function mapSVG(i) {
    const r = i
      ? [
          [0, 110, 300, 50],
          [120, 0, 160, 150],
        ]
      : [
          [0, 60, 300, 90],
          [190, 0, 100, 150],
        ];
    return `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><rect width="300" height="150" fill="#ede7e1"/>
  <path d="M0 125 Q70 90 140 108 T300 80" stroke="#cfe0ea" stroke-width="22" fill="none"/>
  <g stroke="#fff" fill="none" stroke-linecap="round"><path d="M-10 ${40 + i * 15}H310" stroke-width="9"/><path d="M${90 + i * 30} -10V160" stroke-width="9"/><path d="M0 ${20 + i * 20} L300 ${120 - i * 10}" stroke-width="5"/><path d="M${210 - i * 20} -10 L${170 + i * 20} 160" stroke-width="5"/></g>
  <g stroke="#e0d6cd" fill="none"><path d="M-10 ${40 + i * 15}H310M${90 + i * 30} -10V160" stroke-width="1"/></g>
  <g fill="#dbe8d2"><rect x="${10 + i * 40}" y="${75 + i * 5}" width="50" height="30" rx="6"/><rect x="${220 - i * 50}" y="8" width="60" height="24" rx="6"/></g>
  <g fill="#e6dcd3"><rect x="130" y="${100 - i * 10}" width="30" height="20"/><rect x="40" y="10" width="34" height="18"/></g></svg>`;
  }

  const image = (svg) => {
    // Inline HTML SVGs need an XML namespace when used as standalone images.
    const standalone = svg.includes("xmlns=") ? svg : svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(standalone);
  };
  let front =
    '<svg class="env-front" viewBox="0 0 300 204" preserveAspectRatio="none">\n        <defs>\n          <filter id="paper" x="0" y="0" width="100%" height="100%">\n            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="4" result="n"/>\n            <feColorMatrix in="n" type="matrix" values="0 0 0 0 .1  0 0 0 0 .08  0 0 0 0 .08  0 0 0 .5 0" result="g"/>\n            <feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/>\n            <feBlend in="SourceGraphic" in2="gi" mode="multiply"/>\n          </filter>\n          <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop id="tg0" offset="0" stop-color="#b94c26"/><stop id="tg1" offset="1" stop-color="#8f3418"/></linearGradient>\n          <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop id="b0" offset="0" stop-color="#a73f1e"/><stop id="b1" offset="1" stop-color="#8a3016"/></linearGradient>\n        </defs>\n        <g filter="url(#paper)">\n          <polygon points="0,0 150,110 0,204" fill="url(#tg)"/>\n          <polygon points="300,0 150,110 300,204" fill="url(#tg)"/>\n          <polygon points="0,204 150,110 300,204" fill="url(#bg2)"/>\n        </g>\n        <g fill="none" stroke="rgba(0,0,0,.18)" stroke-width=".8"><path d="M0,204 L150,110 L300,204"/><path d="M0,0 L150,110 M300,0 L150,110"/></g>\n        <g id="envFlowers"></g>\n      </svg>';
  front = front.replace(
    '<g id="envFlowers"></g>',
    "<g>" +
      flower(36, 34, 22, WINE, 3) +
      flower(268, 176, 24, WINE, 3) +
      flower(252, 150, 13, PEACH, 2) +
      leafG(48, 52, 0.55, -110, mix(CE, K, 0.5)) +
      leafG(256, 160, 0.5, 60, mix(CE, K, 0.5)) +
      "</g>",
  );
  front = front
    .replace("#b94c26", mix(CE, W, 0.12))
    .replace("#8f3418", mix(CE, K, 0.12))
    .replace("#a73f1e", mix(CE, W, 0.05))
    .replace("#8a3016", mix(CE, K, 0.15));
  const defs = front.match(/<defs>[\s\S]*?<\/defs>/)[0];
  const flap =
    '<svg viewBox="0 0 300 110" preserveAspectRatio="none" width="100%" height="100%">\n          <polygon points="0,0 300,0 150,110" fill="url(#tg)" filter="url(#paper)"/>\n          <path id="scallop" fill="none" stroke="rgba(255,225,200,.65)" stroke-width="1.2" stroke-dasharray="2.5 3" d="M10,3 L150,100 L290,3"/>\n          <path d="M0,0 L150,110 L300,0" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1"/>\n        </svg>'.replace(
      ">",
      ">" + defs,
    );
  const lining =
    '<svg viewBox="0 0 300 110" preserveAspectRatio="none" width="100%" height="100%">\n          <polygon id="flapIn" points="0,0 300,0 150,110" fill="#5e170b"/>\n          <polygon points="0,0 300,0 150,110" fill="url(#lining)" opacity=".5"/>\n          <defs><pattern id="lining" width="14" height="14" patternUnits="userSpaceOnUse"><path id="liningPath" d="M7,1 L13,7 L7,13 L1,7Z" fill="none" stroke="#e8c07d" stroke-width=".5"/></pattern></defs>\n        </svg>'
      .replace("#5e170b", mix(CE, K, 0.55))
      .replace("#e8c07d", mix(CA, W, 0.3));
  return {
    florals: image(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">' +
        floralScene() +
        "</svg>",
    ),
    front: image(front),
    flap: image(flap),
    lining: image(lining),
    photos: Array.from({ length: 8 }, (_, i) => placeholder(i)),
    sketch: image(sketch("villa").replace("currentColor", CP)),
    maps: [0, 1].map((i) => image(mapSVG(i))),
  };
}
export function envelopeTheme(colours) {
  const P = colours.main,
    A = colours.accent,
    B = colours.background,
    E = colours.envelope,
    W = "#ffffff",
    K = "#000000",
    rose = mix(B, P, 0.14),
    ink = mix(P, "#1c1010", 0.5),
    Al = mix(A, W, 0.3);
  return {
    "--wine": P,
    "--wine-d": mix(P, K, 0.32),
    "--wine-l": mix(P, W, 0.12),
    "--gold": A,
    "--gold-l": Al,
    "--blush": B,
    "--rose": rose,
    "--terra": E,
    "--terra-d": mix(E, K, 0.12),
    "--terra-l": mix(E, W, 0.12),
    "--onp": mix(B, A, 0.12),
    "--bodybg": mix(B, P, 0.1),
    "--bghi": mix(B, W, 0.6),
    "--field": mix(B, W, 0.6),
    "--ink": ink,
    "--soft": mix(ink, B, 0.38),
    "--seal1": mix(P, W, 0.2),
    "--seal2": mix(P, K, 0.32),
    "--wine-rgb": hex2rgb(P).join(","),
    "--gold-rgb": hex2rgb(A).join(","),
    "--goldl-rgb": hex2rgb(Al).join(","),
    "--blush-rgb": hex2rgb(B).join(","),
    "--rose-rgb": hex2rgb(rose).join(","),
  };
}
