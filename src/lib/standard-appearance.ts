import { STANDARD_FONTS, type StandardInvitationDetails } from "./standard-invitation";

/** Standard's own palette collection; saved design codes stay compatible. */
export const STANDARD_PALETTES = [
  { code: "champagne", name: "Rosewater & Berry", primary: "#762847", background: "#fbeaf0", paper: "#fff8fb", gold: "#b98668" },
  { code: "sage", name: "Lilac & Plum", primary: "#654478", background: "#eee7f8", paper: "#faf7ff", gold: "#a28cbe" },
  { code: "midnight", name: "Midnight Romance", primary: "#45304f", background: "#181625", paper: "#242034", gold: "#dfb798" },
  { code: "rose", name: "Peach & Terracotta", primary: "#9b4b46", background: "#fbe9dd", paper: "#fff9f3", gold: "#ba825b" },
] as const;
export const SOLSTICE_PALETTES = [
  { code: "champagne", name: "Lagoon & Papaya", primary: "#145c61", background: "#f2ecdf", paper: "#fffcf3", gold: "#cc633c" },
  { code: "sage", name: "Dune & Ink", primary: "#303d40", background: "#e9dfcc", paper: "#fbf7ed", gold: "#b76227" },
  { code: "midnight", name: "Ocean Afterglow", primary: "#16455d", background: "#102b36", paper: "#183e49", gold: "#f1c76b" },
  { code: "rose", name: "Sea Glass & Saffron", primary: "#326f66", background: "#e3eee6", paper: "#f7fcf5", gold: "#ac6c17" },
] as const;
export const MOONLIT_PALETTES = [
  { code: "champagne", name: "Velvet & Opal", primary: "#655c91", background: "#17142c", paper: "#211e3a", gold: "#e5c7a5" },
  { code: "sage", name: "Deep Lagoon & Opal", primary: "#376f79", background: "#0c202b", paper: "#14303b", gold: "#b9e4db" },
  { code: "midnight", name: "Graphite & Copper", primary: "#434957", background: "#151820", paper: "#232731", gold: "#d5ad88" },
  { code: "rose", name: "Dusk & Iris", primary: "#4e5f87", background: "#181d31", paper: "#232d48", gold: "#cad6f1" },
] as const;
export const SAFFRON_PALETTES = [
  { code: "champagne", name: "Marigold & Oat", primary: "#ecc04b", background: "#eee9db", paper: "#fffdf5", gold: "#a64b20" },
  { code: "sage", name: "Cobalt & Butter", primary: "#304abc", background: "#f5efce", paper: "#fffbed", gold: "#8f431d" },
  { code: "midnight", name: "Ink & Citron", primary: "#d9dd75", background: "#232723", paper: "#303630", gold: "#f2ca88" },
  { code: "rose", name: "Persimmon & Linen", primary: "#d86634", background: "#f3e4d7", paper: "#fff8ef", gold: "#783b28" },
] as const;
export function standardPalettes(layout?: StandardInvitationDetails["standardLayout"]) {
  if (layout === "saffron") return SAFFRON_PALETTES;
  if (layout === "moonlit") return MOONLIT_PALETTES;
  return layout === "solstice" ? SOLSTICE_PALETTES : STANDARD_PALETTES;
}
function rgb(hex: string) { return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)); }
export function colorLuminance(hex: string) {
  const [r, g, b] = rgb(hex).map((n) => { const v = n / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * r + .7152 * g + .0722 * b;
}
function blend(a: string, b: string, ratio: number) {
  const other = rgb(b);
  return "#" + rgb(a).map((n, i) => Math.round(n * (1 - ratio) + other[i] * ratio).toString(16).padStart(2, "0")).join("");
}
export function standardAppearance(details: Pick<StandardInvitationDetails, "design" | "font" | "customColors" | "standardLayout">) {
  const palettes = standardPalettes(details.standardLayout);
  const preset = palettes.find((item) => item.code === details.design) ?? palettes[0];
  const primary = details.customColors?.primary ?? preset.primary;
  const background = details.customColors?.background ?? preset.background;
  const dark = colorLuminance(background) < .18;
  const paper = details.customColors ? blend(background, "#ffffff", dark ? .035 : .58) : preset.paper;
  const contrast = (a: string, b: string) => { const x = colorLuminance(a), y = colorLuminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const highContrastInk = colorLuminance(paper) > .179 ? "#000000" : "#ffffff";
  let ink = dark ? "#f8f0e1" : "#302c28";
  if (contrast(ink, paper) < 4.5) ink = highContrastInk;
  let muted = blend(ink, paper, .27);
  for (let i = 0; i < 12 && contrast(muted, paper) < 4.5; i++) muted = blend(muted, highContrastInk, .2);
  if (contrast(muted, paper) < 4.5) muted = highContrastInk;
  const accent = details.customColors?.accent ?? preset.gold;
  // Keep small accent text legible even when a customer picks pale gold on ivory.
  let readableAccent = accent;
  for (let i = 0; i < 12; i++) {
    const a = colorLuminance(readableAccent), b = colorLuminance(paper);
    if ((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5) break;
    readableAccent = blend(readableAccent, highContrastInk, .16);
  }
  if (contrast(readableAccent, paper) < 4.5) readableAccent = highContrastInk;
  return { primary, primaryText: contrast(primary, paper) >= 4.5 ? primary : ink, accent, readableAccent, background, paper, ink,
    muted, line: blend(ink, paper, .84),
    onPrimary: colorLuminance(primary) > .179 ? "#000000" : "#ffffff",
    font: STANDARD_FONTS.find((font) => font.code === details.font) ?? STANDARD_FONTS[0],
  };
}
