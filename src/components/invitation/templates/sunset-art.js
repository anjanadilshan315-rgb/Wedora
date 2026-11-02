/** Original vector illustrations from wedding-invitation-3.zip.
 * Kept separate from the React page: these functions only draw SVG artwork.
 * Text entered by customers is rendered by React, never interpolated here.
 */
const hex2rgb = (h) => {
  h = h.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
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
const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v || "");
const f1 = (n) => Math.round(n * 10) / 10,
  W = "#ffffff",
  K = "#000000";
const RND = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
function mandala(c) {
  const ring = (r, n, pw, ph, fill) => {
    let o = "";
    for (let i = 0; i < n; i++)
      o += `<path d="M0,${-r} Q${pw},${-r - ph * 0.5} 0,${-r - ph} Q${-pw},${-r - ph * 0.5} 0,${-r}Z" transform="rotate(${f1((i * 360) / n)})" ${fill ? `fill="${c}" fill-opacity=".16"` : ""}/>`;
    return o;
  };
  let dots = "";
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 6.283;
    dots += `<circle cx="${f1(Math.cos(a) * 136)}" cy="${f1(Math.sin(a) * 136)}" r="1.5" fill="${c}"/>`;
  }
  return `<svg viewBox="-160 -160 320 320" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${c}" stroke-width=".9" opacity=".85">
   <circle r="14"/><circle r="20" stroke-dasharray="2 3"/>${ring(22, 12, 7, 22, 1)}<circle r="48"/>${ring(50, 18, 8, 26, 0)}<circle r="80" stroke-dasharray="1 4"/>${ring(82, 24, 9, 30, 1)}<circle r="116"/>${ring(118, 30, 8, 18, 0)}<circle r="154" stroke-dasharray="3 4"/>${dots}</g></svg>`;
}
function villageRow(c) {
  const m = [
    (x) =>
      `<g transform="translate(${x} 0)"><path d="M0,52 q-6,-14 0,-26 q6,12 0,26 M0,52 q-14,-6 -16,-20 q12,4 16,20 M0,52 q14,-6 16,-20 q-12,4 -16,20"/></g>`, // lotus
    (x) =>
      `<g transform="translate(${x} 0)"><rect x="-14" y="36" width="28" height="16"/><path d="M-19,36 L0,22 L19,36Z" fill="${c}" fill-opacity=".25"/><rect x="-4" y="42" width="8" height="10"/></g>`, // hut
    (x) =>
      `<g transform="translate(${x} 0)"><path d="M0,52 V28 M-16,30 Q0,10 16,30 Z" /><path d="M-16,30 Q-8,36 0,30 Q8,36 16,30"/></g>`, // parasol
    (x) =>
      `<g transform="translate(${x} 0)"><path d="M-10,52 Q-14,40 -6,36 H6 Q14,40 10,52Z" fill="${c}" fill-opacity=".25"/><path d="M-6,36 q0,-6 6,-6 q6,0 6,6"/></g>`, // pot
    (x) =>
      `<g transform="translate(${x} 0)"><path d="M-16,52 Q-16,30 0,26 Q16,30 16,52Z" fill="${c}" fill-opacity=".2"/><path d="M0,26 V12 M-3,16 h6"/><path d="M-20,52 H20"/></g>`, // dagoba
  ];
  let s = "";
  for (let i = 0; i < 9; i++) s += m[[0, 1, 2, 3, 4, 2, 1, 3, 0][i]](22 + i * 44.5);
  return `<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${s}<path d="M0,54 H400" opacity=".5"/></g></svg>`;
}
function blobs(cx, cy, rx, ry, n, cols, r0, r1, seed) {
  const r = RND(seed);
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = r() * 6.283,
      d = Math.sqrt(r());
    s += `<circle cx="${f1(cx + Math.cos(a) * rx * d)}" cy="${f1(cy + Math.sin(a) * ry * d)}" r="${f1(r0 + r() * (r1 - r0))}" fill="${cols[Math.floor(r() * cols.length)]}"/>`;
  }
  return s;
}

/* ---- Film scene: couple in a vintage car at sunset ---- */
function sFilm(P) {
  const skyTop = mix(P.sky, "#6a2410", 0.42),
    skyLow = mix(P.sky, "#ffe29a", 0.62),
    cloudHi = mix(P.sky, "#ff9db8", 0.45),
    cloudLo = mix(P.sky, "#7a2a2a", 0.2);
  const mtn1 = mix(P.sky, "#6a5a9a", 0.55),
    mtn2 = mix("#3d6a55", P.sky, 0.22),
    mtn3 = mix("#244a38", P.sky, 0.1),
    leaf = ["#2c5a2f", "#3d7a3a", "#1f4526"],
    rim = mix(P.sky, "#ffe08a", 0.4);
  let s = `<defs>
  <linearGradient id="fk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyTop}"/><stop offset=".3" stop-color="${P.sky}"/><stop offset=".52" stop-color="${skyLow}"/><stop offset="1" stop-color="${mix(P.sky, "#fff2c4", 0.5)}"/></linearGradient>
  <radialGradient id="fsun"><stop offset="0" stop-color="#fffbe0"/><stop offset=".25" stop-color="#ffe9a0" stop-opacity=".9"/><stop offset="1" stop-color="${skyLow}" stop-opacity="0"/></radialGradient>
  <linearGradient id="fcl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cloudLo}"/><stop offset="1" stop-color="${cloudHi}"/></linearGradient>
  <linearGradient id="froad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix("#8a8296", P.sky, 0.2)}"/><stop offset="1" stop-color="${mix("#5a5666", P.sky, 0.12)}"/></linearGradient>
  <linearGradient id="fhood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf3e0"/><stop offset=".5" stop-color="#e6d8b8"/><stop offset="1" stop-color="#b9a780"/></linearGradient>
  <linearGradient id="fchr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#b9bcc6"/><stop offset="1" stop-color="#7f838f"/></linearGradient>
  <radialGradient id="flamp"><stop offset="0" stop-color="#fff9e0"/><stop offset=".6" stop-color="#e8d9a4"/><stop offset="1" stop-color="#9c8d5c"/></radialGradient>
  <filter id="fb5" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter><filter id="fb2"><feGaussianBlur stdDeviation="1.6"/></filter></defs>
  <rect width="400" height="800" fill="url(#fk)"/>
  <g id="sunG"><circle cx="110" cy="330" r="230" fill="url(#fsun)"/><circle cx="110" cy="330" r="34" fill="#fffbe6"/></g>
  <g id="clouds" filter="url(#fb5)" opacity=".95"><ellipse cx="260" cy="120" rx="150" ry="26" fill="url(#fcl)"/><ellipse cx="90" cy="190" rx="110" ry="22" fill="url(#fcl)"/><ellipse cx="330" cy="230" rx="110" ry="20" fill="url(#fcl)"/><ellipse cx="190" cy="285" rx="130" ry="16" fill="url(#fcl)"/><ellipse cx="40" cy="95" rx="90" ry="18" fill="url(#fcl)"/></g>
  <path d="M0,440 L50,392 L108,420 L170,372 L236,410 L300,362 L360,398 L400,380 V500 H0Z" fill="${mtn1}" opacity=".85"/>
  <path d="M0,470 Q70,420 140,452 T270,440 T400,452 V540 H0Z" fill="${mtn2}"/>
  <ellipse cx="170" cy="480" rx="130" ry="7" fill="${rim}" opacity=".7" filter="url(#fb2)"/>
  <path d="M0,500 Q90,462 190,492 T400,486 V600 H0Z" fill="${mtn3}"/>
  <g>${`<path d="M30,640 Q34,480 46,330" stroke="#3a2418" stroke-width="22" fill="none"/>`}${blobs(60, 300, 92, 86, 46, leaf, 24, 40, 11)}${blobs(94, 286, 50, 50, 14, [rim, mix(rim, "#2c5a2f", 0.4)], 14, 26, 12)}</g>
  <g>${`<path d="M356,640 Q352,520 346,430" stroke="#3a2418" stroke-width="14" fill="none"/>`}${blobs(350, 400, 56, 50, 26, leaf, 16, 28, 13)}${blobs(322, 394, 26, 28, 8, [rim], 10, 18, 14)}</g>
  <polygon points="172,548 228,548 470,800 -70,800" fill="url(#froad)"/><polygon points="196,548 204,548 236,800 164,800" fill="#f2d26a" opacity=".16"/>
  <ellipse cx="200" cy="600" rx="70" ry="30" fill="${rim}" opacity=".25" filter="url(#fb5)"/>`;
  for (let i = 0; i < 9; i++) {
    const t = i / 8,
      y = 552 + t * t * 190,
      xl = 168 - t * t * 190 * 1.02 - t * 10,
      xr = 232 + t * t * 190 * 1.02 + t * 10,
      h = 7 + t * 34,
      w = 5 + t * 12;
    s += `<g fill="#d9cfbc"><rect x="${f1(xl - w / 2)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}"/><rect x="${f1(xl - w * 0.8)}" y="${f1(y - h - 3)}" width="${f1(w * 1.6)}" height="${f1(4 + t * 3)}"/><rect x="${f1(xr - w / 2)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}"/><rect x="${f1(xr - w * 0.8)}" y="${f1(y - h - 3)}" width="${f1(w * 1.6)}" height="${f1(4 + t * 3)}"/></g>`;
  }
  s += `<path d="M168,548 L-30,730 M232,548 L430,730" stroke="#e8dfcc" stroke-width="4" opacity=".9"/>`;
  // ---- car + couple ----
  s += `<g id="car">
   <rect x="62" y="522" width="276" height="70" fill="#a8b0c0" opacity=".14"/>
   <!-- bride -->
   <path d="M92,596 Q92,536 112,522 H170 Q190,536 190,596Z" fill="#fffdf8"/><circle cx="98" cy="540" r="18" fill="#fffdf8" stroke="#e6dcc8"/><circle cx="184" cy="540" r="18" fill="#fffdf8" stroke="#e6dcc8"/>
   <rect x="131" y="504" width="20" height="24" fill="#d39c76"/><ellipse cx="141" cy="474" rx="25" ry="29" fill="#dba67f"/>
   <path d="M116,478 Q112,438 141,436 Q170,438 166,478 Q162,454 141,452 Q120,454 116,478Z" fill="#1e1511"/><path d="M116,474 Q112,520 124,540" stroke="#1e1511" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M166,474 Q170,520 158,540" stroke="#1e1511" stroke-width="9" fill="none" stroke-linecap="round"/>
   <path d="M126,449 Q141,440 156,449" stroke="#e8c56a" stroke-width="3" fill="none"/><circle cx="141" cy="452" r="3.5" fill="#e8c56a"/><path d="M141,450 V440" stroke="#e8c56a" stroke-width="1.6"/>
   <path d="M130,478 Q135,481 140,478 M144,478 Q149,481 154,478" stroke="#3a2418" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M134,490 Q141,495 148,490" stroke="#b5524a" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="124" cy="487" r="5" fill="#e88a80" opacity=".4"/><circle cx="158" cy="487" r="5" fill="#e88a80" opacity=".4"/>
   <path d="M122,520 Q141,540 160,520" stroke="#e8c56a" stroke-width="3" fill="none"/><path d="M126,528 Q141,552 156,528" stroke="#e8c56a" stroke-width="2" fill="none"/>
   <!-- groom -->
   <path d="M214,596 Q214,540 232,524 H292 Q310,540 310,596Z" fill="#fffdf8"/><path d="M252,524 L262,552 L272,524" fill="none" stroke="#e1d6c0" stroke-width="2"/>
   <rect x="252" y="502" width="20" height="26" fill="#c68f66"/><ellipse cx="262" cy="472" rx="25" ry="29" fill="#cf9570"/>
   <path d="M237,470 Q236,436 262,434 Q288,436 287,470 Q282,450 262,449 Q242,450 237,470Z" fill="#1a110d"/><path d="M240,480 Q242,504 262,506 Q282,504 284,480 Q276,494 262,494 Q248,494 240,480Z" fill="#2a1c16" opacity=".85"/>
   <path d="M250,474 Q255,471 259,474 M266,474 Q271,471 275,474" stroke="#2a1c16" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M254,486 Q262,492 270,486Z" fill="#fff"/>
   <ellipse cx="262" cy="574" rx="34" ry="11" fill="none" stroke="#3a2a22" stroke-width="5"/><path d="M262,574 V566 M262,574 L242,578 M262,574 L282,578" stroke="#3a2a22" stroke-width="2.4"/>
   <circle cx="238" cy="574" r="5.500" fill="#cf9570"/><circle cx="286" cy="574" r="5.500" fill="#cf9570"/>
   <g id="bouquet"><g transform="translate(150 574)">${blobs(0, -4, 15, 12, 12, ["#fffdf8", "#f4ecdc", "#ffffff"], 5, 8, 31)}<path d="M-8,6 L-4,20 M8,6 L4,20" stroke="#3d7a3a" stroke-width="2"/><path d="M-12,4 Q-18,10 -14,16" stroke="#e8c56a" stroke-width="2" fill="none"/></g></g>
   <g id="armsDown"><path d="M104,556 Q112,576 140,578" stroke="#fffdf8" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M178,556 Q168,576 156,578" stroke="#fffdf8" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="138" cy="578" r="6" fill="#dba67f"/><circle cx="158" cy="578" r="6" fill="#dba67f"/></g>
   <g id="armsUp"><path d="M102,544 Q86,490 92,430" stroke="#fffdf8" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M180,544 Q198,488 190,424" stroke="#fffdf8" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="92" cy="420" r="7.500" fill="#dba67f"/><circle cx="190" cy="414" r="7.500" fill="#dba67f"/></g>
   <path d="M62,592 L88,520 H312 L338,592" fill="none" stroke="url(#fchr)" stroke-width="6" stroke-linejoin="round"/><path d="M92,590 L110,524 M308,590 L290,524" stroke="#fff" stroke-width="1.500" opacity=".5"/>
   <path d="M20,800 Q16,690 70,650 Q130,614 200,610 Q270,614 330,650 Q384,690 380,800Z" fill="url(#fhood)"/>
   <ellipse cx="150" cy="654" rx="96" ry="18" fill="#fff" opacity=".5" filter="url(#fb2)"/><path d="M200,612 V686" stroke="#a89a78" stroke-width="2" opacity=".6"/><path d="M70,652 Q60,720 40,790 M330,652 Q340,720 360,790" stroke="#b9ab8b" stroke-width="2" fill="none"/>
   <rect x="160" y="688" width="80" height="96" rx="10" fill="#2a2a30" stroke="url(#fchr)" stroke-width="4"/>${[...Array(9)].map((_, i) => `<line x1="${168 + i * 8}" y1="694" x2="${168 + i * 8}" y2="778" stroke="#c9ccd6" stroke-width="2.4"/>`).join("")}
   <path d="M194,688 L200,668 L206,688Z" fill="url(#fchr)"/>
   <circle cx="86" cy="702" r="27" fill="url(#fchr)"/><circle cx="86" cy="702" r="21" fill="url(#flamp)"/><circle cx="78" cy="694" r="6" fill="#fff" opacity=".8"/>
   <circle cx="314" cy="702" r="27" fill="url(#fchr)"/><circle cx="314" cy="702" r="21" fill="url(#flamp)"/><circle cx="306" cy="694" r="6" fill="#fff" opacity=".8"/>
   <rect x="36" y="782" width="328" height="16" rx="8" fill="url(#fchr)"/>
  </g>
  <g id="bouquetFly" transform-origin="150 574"><g transform="translate(150 480)">${blobs(0, 0, 16, 13, 13, ["#fffdf8", "#f4ecdc", "#ffffff"], 5, 8, 32)}<path d="M-6,8 L-3,22 M6,8 L3,22" stroke="#3d7a3a" stroke-width="2"/></g></g>`;
  return `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

/* ---- Cartoon couple (white outfits) for the first page ---- */
function coupleSVG(P) {
  const skF = "#dba67f",
    skM = "#c89268",
    hair = "#1e1511",
    ol = "#cfc4b2",
    gold = "#d9b765",
    arch = mix(P.main, W, 0.86);
  return `<svg viewBox="0 0 300 430" xmlns="http://www.w3.org/2000/svg"><path d="M30,410 V150 Q30,28 150,28 Q270,28 270,150 V410Z" fill="${arch}" opacity=".55"/><ellipse cx="150" cy="412" rx="108" ry="9" fill="#000" opacity=".12"/>
  <g stroke="${ol}" stroke-width="1" stroke-linejoin="round">
   <path d="M92,200 Q66,330 48,404 Q116,420 188,404 Q170,330 150,200Z" fill="#fffdfa"/><path d="M70,330 Q118,346 172,330 M60,372 Q118,390 184,372 M92,260 Q84,310 76,348" fill="none" stroke="#e7dfd0"/>
   <path d="M96,150 Q92,200 96,216 H152 Q154,200 150,150Z" fill="#fffdfa"/><path d="M100,150 L160,300 L132,314 L96,190Z" fill="#f7efdc"/><path d="M100,150 L160,300" stroke="${gold}" stroke-width="3.5" fill="none"/>
   <circle cx="90" cy="164" r="18" fill="#fffdfa"/><circle cx="156" cy="164" r="18" fill="#fffdfa"/>
   <rect x="113" y="128" width="18" height="26" fill="${skF}" stroke="none"/><ellipse cx="122" cy="106" rx="25" ry="29" fill="${skF}"/>
   <path d="M96,110 Q92,70 122,68 Q152,70 148,110 Q144,86 122,84 Q100,86 96,110Z" fill="${hair}" stroke="none"/><circle cx="96" cy="76" r="14" fill="${hair}" stroke="none"/><circle cx="92" cy="72" r="5" fill="${gold}" stroke="none"/>
   <path d="M108,84 Q122,74 136,84" stroke="${gold}" stroke-width="3" fill="none"/><path d="M110,112 Q116,108 121,112" stroke="#3a2418" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M130,112 Q135,108 140,112" stroke="#3a2418" stroke-width="1.8" fill="none" stroke-linecap="round"/>
   <path d="M114,124 Q122,130 130,124" stroke="#b5524a" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="106" cy="120" r="5" fill="#e88a80" opacity=".4" stroke="none"/><circle cx="138" cy="120" r="5" fill="#e88a80" opacity=".4" stroke="none"/>
   <path d="M104,158 Q122,178 140,158 M108,168 Q122,190 136,168" stroke="${gold}" stroke-width="2.4" fill="none"/>
   <path d="M170,234 Q196,300 192,372 Q222,378 252,372 Q252,300 242,234Z" fill="#fffdfa"/>
   <path d="M168,150 Q205,136 244,150 L254,300 H160Z" fill="#fffdfa"/><path d="M196,142 L206,168 L216,142" fill="none" stroke="#e1d6c0"/>${[170, 196, 222].map((y) => `<circle cx="206" cy="${y}" r="2.2" fill="${gold}" stroke="none"/>`).join("")}
   <path d="M158,296 H258 L268,402 H150Z" fill="#fffdfa"/><path d="M190,300 L186,400 M224,300 L226,400" stroke="#e7dfd0" fill="none"/><ellipse cx="180" cy="406" rx="18" ry="6" fill="#8a5a38" stroke="none"/><ellipse cx="238" cy="406" rx="18" ry="6" fill="#8a5a38" stroke="none"/>
   <path d="M168,160 Q150,200 150,226" stroke="#fffdfa" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="150" cy="230" r="7" fill="${skM}" stroke="none"/>
   <rect x="198" y="122" width="18" height="26" fill="${skM}" stroke="none"/><ellipse cx="207" cy="100" rx="24" ry="28" fill="${skM}"/>
   <path d="M184,100 Q182,66 207,64 Q232,66 230,100 Q226,80 207,79 Q188,80 184,100Z" fill="${hair}" stroke="none"/><path d="M186,108 Q190,130 207,132 Q224,130 228,108 Q220,120 207,120 Q194,120 186,108Z" fill="${hair}" opacity=".7" stroke="none"/>
   <path d="M193,104 Q198,100 203,104 M211,104 Q216,100 221,104" stroke="#2a1c16" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M198,116 Q207,122 216,116Z" fill="#fff"/>
   <path d="M118,212 Q132,236 128,262" stroke="#fffdfa" stroke-width="2" fill="none" stroke="none"/>
   <g>${blobs(126, 252, 16, 14, 13, ["#fffdf8", "#f6efe0", "#ffffff"], 6, 10, 41)}${blobs(130, 282, 9, 16, 8, ["#fffdf8", "#e8f0e0"], 4, 7, 42)}<path d="M118,262 Q116,300 122,320 M134,262 Q138,300 132,322" stroke="#5a8a50" stroke-width="2" fill="none"/></g>
  </g></svg>`;
}
/* ---- Gallery placeholders ---- */
function portrait(P, i) {
  const bgs = [
    [mix("#7fb3d9", "#ffffff", 0.3), "#5f9a5a", "#3e7a45"],
    [mix(P.sky, "#fff0b0", 0.5), "#8a9a4a", "#5f7a3a"],
    ["#efe6d8", "#e3d6c2", "#d6c7ad"],
    [mix("#a9bcd6", "#ffffff", 0.3), "#6a8a6a", "#46684c"],
  ][i % 4];
  const out = [
    ["#f6f1e6", "#f8f4ec"],
    ["#3f4a38", "#f4efe4"],
    ["#e8dcc4", "#fbf7f0"],
    ["#d8c8a8", "#ffffff"],
  ][i % 4];
  return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bgs[0]}"/><stop offset=".6" stop-color="${mix(bgs[0], "#fff", 0.4)}"/></linearGradient></defs>
  <rect width="300" height="400" fill="url(#pg${i})"/><path d="M0,230 Q90,180 180,225 T300,210 V400 H0Z" fill="${bgs[1]}" opacity=".75"/><path d="M0,280 Q110,240 200,280 T300,262 V400 H0Z" fill="${bgs[2]}"/>
  ${blobs(150, 200, 150, 60, 18, ["#ffffff"], 6, 14, i + 3).replace(/fill="#ffffff"/g, 'fill="#ffffff" opacity=".25"')}
  <path d="M20,400 Q24,300 100,288 Q150,296 156,400Z" fill="${out[0]}"/><path d="M144,400 Q150,296 206,286 Q280,298 284,400Z" fill="${out[1]}"/>
  <rect x="86" y="248" width="18" height="30" fill="#c68f66"/><ellipse cx="96" cy="222" rx="30" ry="34" fill="#cf9570"/><path d="M66,220 Q64,176 96,174 Q128,176 126,220 Q120,196 96,194 Q72,196 66,220Z" fill="#1a110d"/><path d="M70,230 Q74,256 96,258 Q118,256 122,230 Q112,246 96,246 Q80,246 70,230Z" fill="#2a1c16" opacity=".8"/>
  <path d="M84,222 Q89,218 94,222 M100,222 Q105,218 110,222" stroke="#2a1c16" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M88,236 Q96,242 104,236Z" fill="#fff"/>
  <rect x="190" y="250" width="16" height="30" fill="#dba67f"/><ellipse cx="198" cy="226" rx="28" ry="32" fill="#e0aa84"/><path d="M170,226 Q166,184 198,182 Q232,184 228,226 Q220,200 198,200 Q178,202 170,226Z" fill="#1e1511"/><path d="M172,226 Q170,262 184,276" stroke="#1e1511" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M186,228 Q191,224 196,228 M202,228 Q207,224 212,228" stroke="#3a2418" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M190,242 Q198,248 206,242" stroke="#b5524a" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`;
}
function mapSVG() {
  return `<svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="170" fill="#ece6da"/>
  <path d="M170,140 Q200,110 250,130 T300,120 V170 H150Z" fill="#cfe0ea"/><path d="M20,30 Q80,10 120,40 T200,30 V0 H0V30Z" fill="#dbe6cf"/><rect x="210" y="20" width="60" height="30" rx="8" fill="#dbe6cf"/>
  <g stroke="#fff" fill="none" stroke-linecap="round"><path d="M-10,90 Q80,60 160,90 T310,70" stroke-width="9"/><path d="M120,-10 Q110,60 140,100 T130,180" stroke-width="8"/><path d="M0,140 L300,40" stroke-width="5"/><path d="M60,0 L100,180" stroke-width="4"/></g>
  <g fill="#7a8a7a" font-family="system-ui,sans-serif" font-size="7" opacity=".8"><text x="150" y="82">Nuwara Eliya</text><text x="30" y="118">Golf Club</text><text x="215" y="150">Gregory Lake</text></g></svg>`;
}

/* ============================ THEME ============================ */

export { mandala, villageRow, sFilm, coupleSVG, portrait, mapSVG, mix, hex2rgb };
