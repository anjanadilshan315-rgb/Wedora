/** Original Heritage Door illustrations from wedding-invitation-2.zip.
 * This file only draws SVG artwork; it does not run the ZIP page or its scripts.
 * Scene colours are supplied by the typed React invitation component.
 */
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
const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v || "");
const f1 = (n) => Math.round(n * 10) / 10;
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
const W = "#ffffff",
  K = "#000000";

/* ====================== SVG ILLUSTRATION KIT ====================== */
function blooms(cx, cy, rx, ry, n, cols, r0, r1, seed) {
  const r = RND(seed);
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = r() * 6.283,
      d = Math.sqrt(r()),
      x = cx + Math.cos(a) * rx * d,
      y = cy + Math.sin(a) * ry * d,
      rad = r0 + r() * (r1 - r0),
      c = cols[Math.floor(r() * cols.length)];
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="${c}"/><circle cx="${f1(x - rad * 0.22)}" cy="${f1(y - rad * 0.22)}" r="${f1(rad * 0.5)}" fill="#fff" opacity=".35"/>`;
  }
  return s;
}
function leafy(cx, cy, rx, ry, n, cols, seed) {
  const r = RND(seed);
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = r() * 6.283,
      d = Math.sqrt(r()),
      x = cx + Math.cos(a) * rx * d,
      y = cy + Math.sin(a) * ry * d,
      rot = r() * 180,
      L = 6 + r() * 9;
    s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(L)}" ry="${f1(L * 0.38)}" fill="${cols[i % cols.length]}" transform="rotate(${f1(rot)} ${f1(x)} ${f1(y)})"/>`;
  }
  return s;
}
function garland(x1, y1, x2, y2, sag, cols, n, seed, r0 = 3, r1 = 5.5) {
  const r = RND(seed);
  let s = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n,
      x = x1 + (x2 - x1) * t,
      y = y1 + (y2 - y1) * t + Math.sin(Math.PI * t) * sag + (r() - 0.5) * 4;
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r0 + r() * (r1 - r0))}" fill="${cols[i % cols.length]}"/>`;
  }
  return s;
}
function strand(x, y, len, cols, seed) {
  const r = RND(seed);
  let s = `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + len}" stroke="${cols[0]}" stroke-width="1" opacity=".55"/>`;
  for (let yy = y + 6; yy < y + len; yy += 7 + r() * 4)
    s += `<circle cx="${f1(x + (r() - 0.5) * 3)}" cy="${f1(yy)}" r="${f1(2 + r() * 2.2)}" fill="${cols[Math.floor(r() * cols.length)]}"/>`;
  return s;
}
function palm(x, y, h, c, lean, seed) {
  const r = RND(seed);
  let s = `<path d="M${x},${y} Q${x + lean / 2},${y - h / 2} ${x + lean},${y - h}" stroke="${c}" stroke-width="${f1(h * 0.04)}" fill="none" stroke-linecap="round"/>`;
  const tx = x + lean,
    ty = y - h;
  for (let i = 0; i < 10; i++) {
    const a = ((-170 + i * 36 + (r() - 0.5) * 12) * Math.PI) / 180,
      L = h * (0.34 + r() * 0.14),
      ex = tx + Math.cos(a) * L,
      ey = ty + Math.sin(a) * L * 0.55 + L * 0.38;
    s += `<path d="M${f1(tx)},${f1(ty)} Q${f1(tx + Math.cos(a) * L * 0.55)},${f1(ty + Math.sin(a) * L * 0.8 - L * 0.2)} ${f1(ex)},${f1(ey)}" stroke="${c}" stroke-width="${f1(h * 0.03)}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}
function urn(x, y, s, P) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30,0 Q-34,26 -14,34 H14 Q34,26 30,0Z" fill="${P.gold}"/><ellipse cx="0" cy="0" rx="30" ry="7" fill="${P.goldLt}"/><rect x="-10" y="34" width="20" height="6" fill="#a07a28"/></g>`;
}
function cluster(P, x, y, s, seed, cols) {
  return (
    urn(x, y + 6 * s, s * 0.9, P) +
    leafy(
      x,
      y - 4 * s,
      46 * s,
      22 * s,
      26,
      [P.leaf, P.leafDk, P.leafLt],
      seed,
    ) +
    blooms(
      x,
      y - 14 * s,
      40 * s,
      26 * s,
      Math.round(18 + 34 * s),
      cols,
      5 * s + 1,
      11 * s + 2,
      seed + 7,
    )
  );
}
function lantern(x, y, s, len, gl, P) {
  return `<line x1="${x}" y1="${y - len}" x2="${x}" y2="${y - 8 * s}" stroke="#241608" stroke-width="1.2"/><circle cx="${x}" cy="${y + 6 * s}" r="${f1(34 * s)}" fill="${gl}" opacity=".85"/>
  <path d="M${x - 9 * s},${y - 8 * s} h${18 * s} l${4 * s},${6 * s} l${-3 * s},${22 * s} h${-20 * s} l${-3 * s},${-22 * s}Z" fill="${P.goldLt}" stroke="#7a4f12" stroke-width="1"/><path d="M${x - 9 * s},${y - 8 * s} q${9 * s},${-9 * s} ${18 * s},0" fill="#7a4f12"/>`;
}
function pillar(x, y, w, h, k, P) {
  const id = (n) => k + "-" + n;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id("wood")})"/>`;
  for (let yy = y + 60; yy < y + h - 50; yy += 90)
    s += `<rect x="${x + w * 0.12}" y="${yy}" width="${w * 0.76}" height="26" rx="3" fill="${P.woodDk}" opacity=".55"/><rect x="${x + w * 0.22}" y="${yy + 6}" width="${w * 0.56}" height="14" rx="2" fill="${P.woodLt}" opacity=".55"/>`;
  s += `<polygon points="${x - 6},${y} ${x + w + 6},${y} ${x + w},${y + 36} ${x},${y + 36}" fill="${P.woodDk}"/><rect x="${x - 4}" y="${y + h - 20}" width="${w + 8}" height="20" fill="${P.stoneDk}"/>`;
  return s;
}
function defs(P, k) {
  const id = (n) => k + "-" + n;
  return `<defs>
<linearGradient id="${id("sky")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.skyTop}"/><stop offset=".5" stop-color="${P.skyBot}"/><stop offset="1" stop-color="${P.haze}"/></linearGradient>
<radialGradient id="${id("sun")}"><stop offset="0" stop-color="#fff1d6" stop-opacity=".95"/><stop offset="1" stop-color="#fff1d6" stop-opacity="0"/></radialGradient>
<pattern id="${id("tile")}" width="12" height="9" patternUnits="userSpaceOnUse"><rect width="12" height="9" fill="${P.roof}"/><path d="M0,9 Q6,2 12,9" fill="none" stroke="${P.roofDk}" stroke-width="1.4"/><path d="M0,3 H12" stroke="${P.roofDk}" stroke-width=".6" opacity=".6"/></pattern>
<linearGradient id="${id("wood")}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.woodDk}"/><stop offset=".45" stop-color="${P.woodLt}"/><stop offset="1" stop-color="${P.woodDk}"/></linearGradient>
<linearGradient id="${id("floor")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.floorLt}"/><stop offset="1" stop-color="${P.floorDk}"/></linearGradient>
<linearGradient id="${id("stone")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.stoneLt}"/><stop offset="1" stop-color="${P.stone}"/></linearGradient>
<linearGradient id="${id("wall")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.wallLt}"/><stop offset="1" stop-color="${P.wall}"/></linearGradient>
<radialGradient id="${id("glow")}"><stop offset="0" stop-color="${P.glow}" stop-opacity=".9"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/></radialGradient>
<filter id="${id("b6")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="${id("b3")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>`;
}
const SVG = (inner) =>
  `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

function palette(t) {
  const day = t.day,
    bloom = t.bloom,
    night = t.night,
    acc = t.acc,
    wood = t.wood;
  return {
    skyTop: mix(day, W, 0.25),
    skyBot: mix(day, W, 0.6),
    haze: mix(day, W, 0.82),
    wall: "#f2e6d3",
    wallLt: "#faf3e8",
    wallDk: "#d9c6a8",
    roof: "#b4532f",
    roofDk: "#7e3219",
    wood,
    woodLt: mix(wood, W, 0.25),
    woodDk: mix(wood, K, 0.38),
    floor: "#c06a42",
    floorLt: "#d8875c",
    floorDk: "#8f4528",
    stone: "#e4d5bd",
    stoneLt: "#f3e8d6",
    stoneDk: "#b9a687",
    leaf: "#5f8c46",
    leafDk: "#2f5a2d",
    leafLt: "#86ab62",
    petal: "#fbf6ef",
    bloom,
    bloom2: mix(bloom, W, 0.55),
    gold: "#d9a441",
    goldLt: "#f3d27a",
    n1: night,
    n2: mix(night, K, 0.55),
    n3: mix(night, K, 0.8),
    acc,
    glow: mix(acc, "#ffb347", 0.45),
  };
}

/* ---- Scene: courtyard path (seen through the doors) ---- */
function sCourtyard(P, k) {
  const id = (n) => k + "-" + n,
    hz = mix(P.leafDk, P.skyBot, 0.55),
    fl = [P.petal, P.bloom2, P.petal, P.bloom];
  let s = defs(P, k);
  s += `<rect width="400" height="800" fill="url(#${id("sky")})"/><ellipse cx="200" cy="390" rx="270" ry="140" fill="url(#${id("sun")})"/>
  <g filter="url(#${id("b6")})" fill="#fff" opacity=".6"><ellipse cx="90" cy="150" rx="70" ry="14"/><ellipse cx="300" cy="215" rx="90" ry="16"/><ellipse cx="180" cy="270" rx="60" ry="10"/></g>`;
  s +=
    palm(40, 370, 170, hz, 16, 1) +
    palm(112, 372, 115, hz, -8, 2) +
    palm(300, 372, 150, hz, -14, 3) +
    palm(366, 370, 190, hz, 10, 4);
  s += `<rect x="0" y="354" width="400" height="70" fill="${P.wall}"/><polygon points="0,324 400,324 400,358 0,358" fill="url(#${id("tile")})"/><rect x="0" y="354" width="400" height="6" fill="${P.woodDk}"/>
  <rect x="168" y="372" width="5" height="48" fill="${P.gold}"/><rect x="227" y="372" width="5" height="48" fill="${P.gold}"/>${blooms(200, 370, 40, 9, 46, [P.petal, P.bloom2, P.petal], 3, 6, 21)}<rect x="186" y="408" width="10" height="9" fill="${P.stoneDk}"/><rect x="204" y="408" width="10" height="9" fill="${P.stoneDk}"/>`;
  s += `<rect x="0" y="418" width="400" height="382" fill="${P.floorDk}"/><polygon points="0,418 178,418 -80,800 0,800" fill="${mix(P.floorDk, P.leafDk, 0.35)}"/><polygon points="400,418 222,418 480,800 400,800" fill="${mix(P.floorDk, P.leafDk, 0.35)}"/>
  <polygon points="178,418 222,418 480,800 -80,800" fill="url(#${id("stone")})"/>`;
  for (const t of [0.05, 0.12, 0.22, 0.36, 0.55, 0.8])
    s += `<line x1="${f1(178 - 258 * t)}" y1="${f1(418 + 382 * t)}" x2="${f1(222 + 258 * t)}" y2="${f1(418 + 382 * t)}" stroke="${P.stoneDk}" stroke-width="${f1(0.6 + t * 2)}" opacity=".45"/>`;
  for (const f of [-0.5, -0.25, 0, 0.25, 0.5])
    s += `<line x1="${200 + f * 44}" y1="418" x2="${200 + f * 560}" y2="800" stroke="${P.stoneDk}" stroke-width="1.2" opacity=".4"/>`;
  s +=
    cluster(P, 152, 452, 0.28, 51, fl) +
    cluster(P, 248, 452, 0.28, 52, fl) +
    cluster(P, 118, 540, 0.55, 53, fl) +
    cluster(P, 282, 540, 0.55, 54, fl) +
    cluster(P, 44, 690, 1.15, 55, fl) +
    cluster(P, 356, 690, 1.15, 56, fl);
  // foreground pavilions
  s += `<polygon points="0,40 152,200 152,238 0,126" fill="url(#${id("tile")})"/><polygon points="400,40 248,200 248,238 400,126" fill="url(#${id("tile")})"/>
  <polygon points="0,126 152,238 152,258 0,148" fill="${P.woodDk}"/><polygon points="400,126 248,238 248,258 400,148" fill="${P.woodDk}"/>`;
  s +=
    pillar(0, 150, 56, 650, k, P) +
    pillar(344, 150, 56, 650, k, P) +
    pillar(126, 258, 16, 250, k, {
      ...P,
      woodDk: mix(P.woodDk, P.skyBot, 0.3),
    }) +
    pillar(258, 258, 16, 250, k, {
      ...P,
      woodDk: mix(P.woodDk, P.skyBot, 0.3),
    });
  s += `<rect width="400" height="800" fill="url(#${id("vig")})"/>`;
  return SVG(
    s.replace(
      "</defs>",
      `<radialGradient id="${id("vig")}" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>`,
    ),
  );
}

/* ---- Scene: poruwa mandapa (hero) and ceremony (with couple) ---- */
function figure(x, y, type, P) {
  if (type === "groom")
    return `<g><path d="M${x - 21},${y - 102} q21,-9 42,0 l7,102 h-56z" fill="#f3e6c8" stroke="#8f6f42" stroke-width="1"/><path d="M${x - 20},${y - 94} l40,26" stroke="${P.gold}" stroke-width="3.5"/><rect x="${x - 22}" y="${y - 48}" width="44" height="5" fill="${P.gold}"/>
   <circle cx="${x}" cy="${y - 120}" r="12.5" fill="#b9825c"/><path d="M${x - 12},${y - 124} Q${x},${y - 146} ${x + 12},${y - 124}Z" fill="#1d1512"/><path d="M${x - 14},${y - 128} h28 l-4,-17 h-20z" fill="#2b3f8f"/><rect x="${x - 14}" y="${y - 130}" width="28" height="3" fill="${P.gold}"/></g>`;
  return `<g><path d="M${x - 19},${y - 100} q19,-9 38,0 l11,100 h-60z" fill="#f1e3c6" stroke="#8f6f42" stroke-width="1"/><path d="M${x - 17},${y - 98} L${x + 19},${y - 32}" stroke="${P.gold}" stroke-width="3.5"/><rect x="${x - 30}" y="${y - 8}" width="60" height="8" fill="${P.gold}" opacity=".85"/>
   <circle cx="${x}" cy="${y - 118}" r="11.5" fill="#cf9a72"/><path d="M${x - 12},${y - 120} Q${x},${y - 140} ${x + 12},${y - 120} Q${x + 6},${y - 128} ${x},${y - 128} Q${x - 6},${y - 128} ${x - 12},${y - 120}Z" fill="#1d1512"/><circle cx="${x}" cy="${y - 136}" r="7" fill="#1d1512"/><path d="M${x - 12},${y - 126} Q${x},${y - 136} ${x + 12},${y - 126}" stroke="${P.goldLt}" stroke-width="2" fill="none"/></g>`;
}
function sMandapa(P, k, couple) {
  const id = (n) => k + "-" + n,
    hz = mix(P.leafDk, P.skyBot, 0.5),
    flw = couple
      ? [P.petal, P.bloom, P.bloom2, P.petal, P.bloom2]
      : [P.petal, P.petal, P.bloom2, P.bloom, P.petal];
  let s = defs(P, k);
  s += `<rect width="400" height="800" fill="url(#${id("sky")})"/><ellipse cx="200" cy="340" rx="280" ry="150" fill="url(#${id("sun")})"/>
  <g filter="url(#${id("b6")})" fill="#fff" opacity=".55"><ellipse cx="100" cy="120" rx="80" ry="14"/><ellipse cx="310" cy="170" rx="90" ry="16"/></g>`;
  s +=
    palm(24, 470, 250, hz, 14, 5) +
    palm(382, 480, 280, hz, -12, 6) +
    palm(86, 470, 150, hz, -6, 7);
  s += `<polygon points="296,0 400,0 400,160 352,112" fill="url(#${id("tile")})"/><polygon points="296,0 400,0 400,20 296,20" fill="${P.woodDk}" opacity=".0"/><polygon points="0,0 80,0 0,90" fill="url(#${id("tile")})"/>`;
  s += `<rect x="0" y="380" width="400" height="300" fill="${P.wallLt}" opacity=".55"/>`;
  // floor + steps
  s += `<rect x="0" y="640" width="400" height="160" fill="url(#${id("stone")})"/>`;
  [
    [720, 760, 50, 350],
    [680, 720, 70, 330],
    [640, 680, 90, 310],
  ].forEach(([a, b, x1, x2], i) => {
    s += `<rect x="${x1}" y="${a}" width="${x2 - x1}" height="${b - a}" fill="${i % 2 ? P.stoneLt : P.stone}"/><rect x="${x1}" y="${a}" width="${x2 - x1}" height="7" fill="#fff" opacity=".55"/><rect x="${x1}" y="${b - 4}" width="${x2 - x1}" height="4" fill="${P.stoneDk}" opacity=".5"/>`;
  });
  s += `<rect x="0" y="758" width="400" height="42" fill="${P.stone}" opacity=".8"/>`;
  // chairs / couple
  if (couple) {
    s += `<ellipse cx="200" cy="642" rx="95" ry="9" fill="#000" opacity=".22"/><g transform="translate(200 640) scale(1.5) translate(-200 -640)">${figure(180, 640, "groom", P)}${figure(224, 640, "bride", P)}<circle cx="202" cy="582" r="5" fill="#cf9a72"/></g>`;
  } else
    s += [158, 222]
      .map(
        (x) =>
          `<g><rect x="${x}" y="596" width="30" height="40" rx="4" fill="#d8c19a"/><rect x="${x + 2}" y="610" width="26" height="14" fill="#c4a874"/><rect x="${x + 3}" y="636" width="4" height="8" fill="${P.woodDk}"/><rect x="${x + 23}" y="636" width="4" height="8" fill="${P.woodDk}"/></g>`,
      )
      .join("");
  // columns
  for (const x of [158, 236])
    s += `<rect x="${x}" y="330" width="8" height="310" fill="${P.stoneLt}" opacity=".85"/><rect x="${x}" y="330" width="8" height="310" fill="${P.gold}" opacity=".25"/>`;
  for (const x of [104, 284])
    s += `<rect x="${x}" y="288" width="14" height="352" fill="${P.stoneLt}"/><rect x="${x}" y="288" width="14" height="352" fill="url(#${id("wood")})" opacity=".18"/><rect x="${x - 3}" y="626" width="20" height="14" fill="${P.stoneDk}"/><rect x="${x - 3}" y="286" width="20" height="8" fill="${P.gold}"/>`;
  // canopy
  s += `<rect x="92" y="276" width="216" height="18" rx="3" fill="${P.goldLt}"/><rect x="92" y="290" width="216" height="5" fill="${P.gold}"/>`;
  s +=
    leafy(200, 268, 128, 22, 60, [P.leaf, P.leafLt, P.leafDk], 31) +
    blooms(200, 272, 124, 34, couple ? 190 : 160, flw, 6, 13, 32) +
    blooms(200, 262, 100, 16, 40, [P.petal, P.bloom2], 4, 8, 33);
  const r = RND(36);
  for (let i = 0; i < 17; i++)
    s += strand(
      100 + i * 12.5,
      294,
      36 + r() * 70,
      [P.petal, P.bloom2, P.petal],
      40 + i,
    );
  s += garland(
    110,
    308,
    290,
    308,
    34,
    [P.petal, P.bloom2, P.leaf, P.petal],
    34,
    37,
  );
  s += cluster(P, 52, 664, 1, 38, flw) + cluster(P, 350, 664, 1, 39, flw);
  s += `<g><rect x="76" y="590" width="4" height="46" fill="${P.gold}"/><ellipse cx="78" cy="590" rx="11" ry="4" fill="${P.goldLt}"/><circle cx="78" cy="582" r="14" fill="url(#${id("glow")})"/><ellipse cx="78" cy="582" rx="3" ry="5" fill="#ffd66b"/>
  <rect x="320" y="590" width="4" height="46" fill="${P.gold}"/><ellipse cx="322" cy="590" rx="11" ry="4" fill="${P.goldLt}"/><circle cx="322" cy="582" r="14" fill="url(#${id("glow")})"/><ellipse cx="322" cy="582" rx="3" ry="5" fill="#ffd66b"/></g>`;
  s += `<rect y="560" width="400" height="240" fill="url(#${id("fade")})"/>`;
  return SVG(
    s.replace(
      "</defs>",
      `<linearGradient id="${id("fade")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.haze}" stop-opacity="0"/><stop offset="1" stop-color="${P.haze}" stop-opacity="${couple ? 0.0 : 0.55}"/></linearGradient></defs>`,
    ),
  );
}

/* ---- Scene: heritage house with carved pillars ---- */
function sHouse(P, k) {
  const id = (n) => k + "-" + n;
  let s = defs(P, k);
  s += `<rect width="400" height="800" fill="url(#${id("wall")})"/><rect x="64" y="100" width="272" height="530" fill="${P.wallDk}" opacity=".14"/>
  <path d="M120,630 V300 Q200,190 280,300 V630" fill="none" stroke="${P.wallDk}" stroke-width="3" opacity=".5"/><path d="M138,630 V310 Q200,225 262,310 V630" fill="${P.skyBot}" opacity=".35"/>
  <rect width="400" height="76" fill="url(#${id("tile")})"/><rect y="76" width="400" height="24" fill="${P.woodDk}"/>`;
  for (let i = 0; i < 17; i++)
    s += `<rect x="${i * 25 + 4}" y="100" width="10" height="14" fill="${P.woodDk}"/>`;
  s += `<polygon points="0,630 400,630 400,800 0,800" fill="url(#${id("floor")})"/>`;
  for (const t of [0.18, 0.4, 0.66, 0.92])
    s += `<line x1="0" y1="${f1(630 + 170 * t)}" x2="400" y2="${f1(630 + 170 * t)}" stroke="${P.floorDk}" stroke-width="1.4" opacity=".5"/>`;
  for (let i = -3; i <= 3; i++)
    s += `<line x1="${200 + i * 40}" y1="630" x2="${200 + i * 80}" y2="800" stroke="${P.floorDk}" stroke-width="1.2" opacity=".4"/>`;
  s += pillar(0, 100, 66, 540, k, P) + pillar(334, 100, 66, 540, k, P);
  s += `<g opacity=".2" fill="#fff"><polygon points="90,100 170,100 270,630 150,630"/><polygon points="200,100 240,100 320,630 270,630"/></g>`;
  s +=
    cluster(P, 84, 668, 1.2, 61, [P.petal, P.bloom2, P.petal]) +
    [0, 1, 2, 3, 4, 5]
      .map((i) =>
        strand(24 + i * 20, 430, 50 + i * 14, [P.petal, P.bloom2], 62 + i),
      )
      .join("");
  s += `<g><rect x="346" y="500" width="6" height="150" fill="${P.gold}"/><ellipse cx="349" cy="500" rx="20" ry="6" fill="${P.goldLt}"/><circle cx="349" cy="486" r="26" fill="url(#${id("glow")})"/><ellipse cx="349" cy="488" rx="4" ry="9" fill="#ffd66b"/><ellipse cx="349" cy="650" rx="22" ry="7" fill="${P.gold}"/></g>`;
  return SVG(s);
}

/* ---- Scene: night courtyard ---- */
function sNight(P, k) {
  const id = (n) => k + "-" + n,
    g = `url(#${id("glow")})`,
    sil = mix(P.n1, K, 0.72);
  let s = defs(P, k);
  s = s.replace(
    "</defs>",
    `<linearGradient id="${id("nsky")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.n3}"/><stop offset=".35" stop-color="${P.n1}"/><stop offset=".62" stop-color="${mix(P.n1, P.glow, 0.4)}"/></linearGradient>
  <radialGradient id="${id("hall")}" cx=".5" cy=".55" r=".62"><stop offset="0" stop-color="#fff0cf"/><stop offset=".5" stop-color="${P.glow}"/><stop offset="1" stop-color="${mix(P.glow, "#2a1206", 0.72)}"/></radialGradient>
  <linearGradient id="${id("nfloor")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(P.floorLt, P.glow, 0.45)}"/><stop offset="1" stop-color="${mix(P.floorDk, K, 0.3)}"/></linearGradient>
  <radialGradient id="${id("vig")}" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs>`,
  );
  s += `<rect width="400" height="800" fill="url(#${id("nsky")})"/><ellipse cx="200" cy="420" rx="250" ry="120" fill="${P.glow}" opacity=".25" filter="url(#${id("b6")})"/>`;
  s +=
    palm(30, 410, 210, sil, 14, 41) +
    palm(96, 410, 150, sil, -10, 42) +
    palm(318, 410, 170, sil, 12, 43) +
    palm(380, 410, 215, sil, -14, 44);
  s += `<polygon points="52,298 348,298 394,394 6,394" fill="url(#${id("tile")})"/><polygon points="52,298 348,298 394,394 6,394" fill="${mix(P.n1, K, 0.3)}" opacity=".5"/><rect x="6" y="394" width="388" height="14" fill="${P.woodDk}"/>`;
  s += `<rect x="30" y="408" width="340" height="252" fill="url(#${id("hall")})"/>`;
  for (let i = 0; i < 3; i++)
    s += `<path d="M${64 + i * 100},566 V478 Q${114 + i * 100},436 ${164 + i * 100},478 V566Z" fill="#fff6e0" opacity=".38"/><path d="M${64 + i * 100},566 V478 Q${114 + i * 100},436 ${164 + i * 100},478 V566Z" fill="none" stroke="${P.woodDk}" stroke-width="2" opacity=".5"/>`;
  for (const x of [22, 126, 252, 356])
    s += `<rect x="${x}" y="408" width="22" height="254" fill="url(#${id("wood")})"/>`;
  s += `<rect x="0" y="658" width="400" height="142" fill="url(#${id("nfloor")})"/><ellipse cx="200" cy="702" rx="170" ry="26" fill="${P.glow}" opacity=".4" filter="url(#${id("b6")})"/>`;
  for (const x of [72, 328])
    s += `<g><path d="M${x - 34},720 H${x + 34} L${x + 42},768 H${x - 42}Z" fill="#fbf6ef"/><ellipse cx="${x}" cy="720" rx="34" ry="7" fill="#fff"/>${blooms(x, 700, 22, 16, 22, [P.petal, P.bloom2, P.petal], 4, 8, x)}<circle cx="${x}" cy="684" r="16" fill="${g}" opacity=".6"/></g>`;
  s +=
    leafy(36, 52, 130, 74, 120, [P.leaf, P.leafDk, P.leafLt], 45) +
    blooms(66, 108, 64, 28, 20, [P.petal, P.bloom2], 4, 8, 46) +
    leafy(372, 40, 118, 64, 100, [P.leaf, P.leafDk, P.leafLt], 47) +
    blooms(344, 92, 52, 24, 14, [P.petal, P.bloom2], 4, 8, 48);
  for (let i = 0; i < 24; i++) {
    const x = i * 17,
      y = 70 + Math.sin(i * 0.55) * 12 + i * 0.5;
    s += `<circle cx="${x}" cy="${f1(y)}" r="9" fill="#fff1b8" opacity=".28"/><circle cx="${x}" cy="${f1(y)}" r="2.6" fill="#fff6cf"/>`;
  }
  s +=
    lantern(46, 176, 1, 100, g, P) +
    lantern(128, 128, 0.8, 60, g, P) +
    lantern(346, 170, 1, 92, g, P) +
    lantern(268, 112, 0.7, 52, g, P);
  s += `<rect width="400" height="800" fill="url(#${id("vig")})"/>`;
  return SVG(s);
}

/* ---- Door facade (cut-out opening) + door panels ---- */
function sDoor(P) {
  const k = "dr",
    id = (n) => k + "-" + n,
    g = `url(#${id("glow")})`,
    fl = [P.petal, P.bloom2, P.petal];
  let s = defs(P, k);
  s += `<path fill-rule="evenodd" d="M0,0H400V800H0Z M95,175H305V600H95Z" fill="url(#${id("wall")})"/>`;
  s += `<rect width="400" height="92" fill="url(#${id("tile")})"/><rect y="92" width="400" height="20" fill="${P.woodDk}"/>`;
  for (let i = 0; i < 16; i++)
    s += `<rect x="${i * 25 + 4}" y="112" width="10" height="13" fill="${P.woodDk}"/>`;
  const gp = [P.leaf, P.leafDk, P.leafLt];
  for (let i = 0; i < 7; i++)
    s += `<path d="M0,${50 + i * 8} Q${50 + i * 10},${6 + i * 14} ${100 + i * 8},${70 + i * 14}" stroke="${gp[i % 3]}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>`;
  s += pillar(16, 126, 46, 515, k, P) + pillar(338, 126, 46, 515, k, P);
  s += `<path fill-rule="evenodd" d="M80,160H320V622H80Z M95,175H305V600H95Z" fill="url(#${id("wood")})"/><rect x="70" y="138" width="260" height="22" rx="3" fill="${P.woodDk}"/>`;
  for (let i = 0; i < 13; i++)
    s += `<circle cx="${86 + i * 19}" cy="149" r="3.4" fill="${P.gold}" opacity=".8"/>`;
  s += `<rect y="626" width="400" height="16" fill="${P.stoneDk}"/><rect y="642" width="400" height="92" fill="url(#${id("floor")})"/>`;
  for (let i = -5; i <= 5; i++)
    s += `<line x1="${200 + i * 30}" y1="642" x2="${200 + i * 58}" y2="734" stroke="${P.floorDk}" stroke-width="1" opacity=".45"/>`;
  s += `<rect y="734" width="400" height="66" fill="url(#${id("stone")})"/><rect y="734" width="400" height="5" fill="#fff" opacity=".6"/><line x1="0" y1="756" x2="400" y2="756" stroke="${P.stoneDk}" stroke-width="2"/><line x1="0" y1="780" x2="400" y2="780" stroke="${P.stoneDk}" stroke-width="2"/>`;
  s += `<ellipse cx="200" cy="650" rx="120" ry="22" fill="${P.glow}" opacity=".35" filter="url(#${id("b6")})"/><rect x="150" y="646" width="100" height="14" rx="3" fill="${P.woodLt}"/>`;
  for (const [x, sd] of [
    [72, 1],
    [328, 2],
  ])
    s +=
      cluster(P, x, 590, 1.15, 70 + sd, fl) +
      strand(x - 26, 420, 70, fl, 71) +
      strand(x - 12, 410, 96, fl, 72) +
      strand(x + 4, 418, 80, fl, 73) +
      strand(x + 18, 408, 60, fl, 74) +
      blooms(x, 470, 26, 40, 36, fl, 4, 9, 75 + sd);
  s += `<rect width="400" height="800" fill="url(#${id("vig")})"/>`;
  s = s.replace(
    "</defs>",
    `<radialGradient id="${id("vig")}" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></radialGradient></defs>`,
  );
  return SVG(s);
}
function sDoorPanel(P, side) {
  const k = "dp" + side,
    id = (n) => k + "-" + n,
    rl = side === "L",
    ringX = rl ? 88 : 12;
  let s = `<defs><linearGradient id="${id("w")}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.woodLt}"/><stop offset="1" stop-color="${P.wood}"/></linearGradient></defs>
  <rect width="100" height="405" fill="url(#${id("w")})"/><rect x="2" y="2" width="96" height="401" fill="none" stroke="${P.woodDk}" stroke-width="3"/>
  <rect x="9" y="9" width="82" height="238" rx="3" fill="${P.wood}" stroke="${P.woodDk}" stroke-width="2"/><rect x="15" y="15" width="70" height="226" rx="2" fill="none" stroke="${P.woodLt}" stroke-width="1.5" opacity=".7"/>
  <path d="M22,230 V80 Q50,30 78,80 V230Z" fill="${P.woodDk}" opacity=".22" stroke="${P.woodLt}" stroke-width="1.5"/>
  <circle cx="50" cy="96" r="15" fill="none" stroke="${P.woodLt}" stroke-width="1.6"/>`;
  for (let i = 0; i < 8; i++)
    s += `<ellipse cx="50" cy="${96 - 9}" rx="3.6" ry="8" fill="${P.woodLt}" opacity=".75" transform="rotate(${i * 45} 50 96)"/>`;
  s += `<path d="M50,125 V222 M50,150 q-16,-8 -20,-24 M50,150 q16,-8 20,-24 M50,185 q-16,-8 -20,-24 M50,185 q16,-8 20,-24" stroke="${P.woodLt}" stroke-width="2.2" fill="none" opacity=".8"/>
  <rect x="9" y="256" width="82" height="140" rx="3" fill="${P.wood}" stroke="${P.woodDk}" stroke-width="2"/><rect x="15" y="262" width="70" height="128" fill="none" stroke="${P.woodLt}" stroke-width="1.4" opacity=".7"/>
  <path d="M50,276 L78,326 L50,376 L22,326Z" fill="${P.woodDk}" opacity=".25" stroke="${P.woodLt}" stroke-width="1.4"/><circle cx="50" cy="326" r="8" fill="none" stroke="${P.woodLt}" stroke-width="1.4"/>
  <circle cx="${ringX}" cy="205" r="11" fill="${P.gold}" stroke="#7a4f12" stroke-width="1.5"/><circle cx="${ringX}" cy="219" r="9" fill="none" stroke="${P.goldLt}" stroke-width="2.4"/>`;
  return `<svg viewBox="0 0 100 405" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

/* ---- Cartoon Kandyan couple for the "moments" arches ---- */
function cartoon(P, v) {
  const sk = ["#c68a5e", "#b97a50", "#c98f64"][v],
    sf = ["#d9a077", "#cf9468", "#d6a074"][v],
    out = ["#2b3f8f", "#f4eee2", "#1f2f73"][v],
    sar = ["#f7f1e4", "#f4eee2", "#e8e056"][v],
    sar2 = ["#ffffff", "#e9dcc4", "#f3d96a"][v],
    hat = v !== 1;
  const bouq =
    v === 2
      ? `<g><circle cx="150" cy="352" r="34" fill="${P.leaf}"/>${blooms(150, 342, 30, 22, 22, ["#f08a2a", "#f5c342", "#e8553a"], 6, 10, v + 9)}</g>`
      : "";
  return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="400" fill="#fbf4e8"/><circle cx="150" cy="170" r="150" fill="${mix(P.bloom, W, 0.85)}" opacity=".7"/>
  <path d="M30,400 Q36,292 104,278 Q172,292 178,400Z" fill="${out}"/><path d="M84,282 L104,332 L124,282" stroke="${P.gold}" stroke-width="5" fill="none"/><circle cx="104" cy="350" r="3" fill="${P.gold}"/><circle cx="104" cy="372" r="3" fill="${P.gold}"/>
  <rect x="94" y="244" width="20" height="38" fill="${sk}"/><ellipse cx="104" cy="205" rx="42" ry="48" fill="${sk}"/><circle cx="62" cy="208" r="8" fill="${sk}"/><circle cx="146" cy="208" r="8" fill="${sk}"/>
  <path d="M62,200 Q60,150 104,148 Q148,150 146,200 Q140,170 104,168 Q68,170 62,200Z" fill="#1d1512"/><path d="M64,216 Q68,264 104,266 Q140,264 144,216 Q134,242 104,242 Q74,242 64,216Z" fill="#1d1512"/>
  <circle cx="88" cy="206" r="4.5" fill="#1d1512"/><circle cx="120" cy="206" r="4.5" fill="#1d1512"/><circle cx="89.5" cy="204.5" r="1.4" fill="#fff"/><circle cx="121.5" cy="204.5" r="1.4" fill="#fff"/>
  <path d="M80,194 Q88,189 96,193 M112,193 Q120,189 128,194" stroke="#1d1512" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M90,229 Q104,242 118,229Z" fill="#fff"/>
  ${hat ? `<path d="M62,170 Q104,84 146,170Z" fill="${out}"/><path d="M64,166 Q104,150 144,166" stroke="${P.gold}" stroke-width="5" fill="none"/><circle cx="104" cy="104" r="7" fill="${P.gold}"/><path d="M74,160 Q104,118 134,160" stroke="${P.gold}" stroke-width="2" fill="none"/>` : ""}
  <path d="M146,400 Q150,302 206,290 Q262,302 268,400Z" fill="${sar}"/><path d="M172,294 Q216,344 266,334 L268,400 L212,400Z" fill="${sar2}" opacity=".9"/><path d="M172,294 Q216,344 266,334" stroke="${P.gold}" stroke-width="5" fill="none"/>
  <rect x="196" y="256" width="20" height="38" fill="${sf}"/><ellipse cx="206" cy="226" rx="37" ry="42" fill="${sf}"/><circle cx="168" cy="252" r="4" fill="${P.gold}"/><circle cx="244" cy="252" r="4" fill="${P.gold}"/>
  <path d="M169,226 Q166,172 206,170 Q246,172 243,226 Q237,192 206,190 Q176,192 169,226Z" fill="#1d1512"/><circle cx="206" cy="160" r="19" fill="#1d1512"/><path d="M172,198 Q206,172 240,198" stroke="${P.gold}" stroke-width="5" fill="none"/>
  <circle cx="206" cy="206" r="3" fill="#c0392b"/><circle cx="192" cy="226" r="4" fill="#1d1512"/><circle cx="220" cy="226" r="4" fill="#1d1512"/><circle cx="193.4" cy="224.6" r="1.3" fill="#fff"/><circle cx="221.4" cy="224.6" r="1.3" fill="#fff"/>
  <path d="M180,216 Q192,210 202,215 M210,215 Q220,210 232,216" stroke="#1d1512" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M196,244 Q206,254 216,244Z" fill="#fff" stroke="#c0392b" stroke-width="1"/>
  <path d="M184,286 Q206,312 228,286" stroke="${P.gold}" stroke-width="3.5" fill="none"/>${bouq}</svg>`;
}

/**
 * Return isolated SVG image URLs, so illustration IDs never clash with the page.
 * @param {{day: string, bloom: string, night: string, acc: string, wood: string}} theme
 */
export function heritageArtwork(theme) {
  const P = palette(theme);
  const image = (svg) =>
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  return {
    courtyard: image(sCourtyard(P, "courtyard")),
    poruwa: image(sMandapa(P, "poruwa", false)),
    ceremony: image(sMandapa(P, "ceremony", true)),
    house: image(sHouse(P, "house")),
    night: image(sNight(P, "night")),
    door: image(sDoor(P)),
    leftDoor: image(sDoorPanel(P, "L")),
    rightDoor: image(sDoorPanel(P, "R")),
    gallery: [0, 1, 2].map((index) => image(cartoon(P, index))),
  };
}
