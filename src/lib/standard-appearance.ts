import { STANDARD_FONTS, type StandardInvitationDetails } from "./standard-invitation";

/** Standard's own palette collection; saved design codes stay compatible. */
export const STANDARD_PALETTES = [
  { code: "champagne", name: "Rosewater & Berry", primary: "#762847", background: "#fbeaf0", paper: "#fff8fb", gold: "#b98668" },
  { code: "sage", name: "Lilac & Plum", primary: "#654478", background: "#eee7f8", paper: "#faf7ff", gold: "#a28cbe" },
  { code: "midnight", name: "Midnight Romance", primary: "#45304f", background: "#181625", paper: "#242034", gold: "#dfb798" },
  { code: "rose", name: "Peach & Terracotta", primary: "#9b4b46", background: "#fbe9dd", paper: "#fff9f3", gold: "#ba825b" },
] as const;
function rgb(hex: string) { return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)); }
export function colorLuminance(hex: string) {
  const [r, g, b] = rgb(hex).map((n) => { const v = n / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * r + .7152 * g + .0722 * b;
}
function blend(a: string, b: string, ratio: number) {
  const other = rgb(b);
  return "#" + rgb(a).map((n, i) => Math.round(n * (1 - ratio) + other[i] * ratio).toString(16).padStart(2, "0")).join("");
}
export function standardAppearance(details: Pick<StandardInvitationDetails, "design" | "font" | "customColors">) {
  const preset = STANDARD_PALETTES.find((item) => item.code === details.design) ?? STANDARD_PALETTES[0];
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
  return { primary, accent, readableAccent, background, paper, ink,
    muted, line: blend(ink, paper, .84),
    onPrimary: colorLuminance(primary) > .179 ? "#000000" : "#ffffff",
    font: STANDARD_FONTS.find((font) => font.code === details.font) ?? STANDARD_FONTS[0],
  };
}
