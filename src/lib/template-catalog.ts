/** Shared by the server, package page, gallery and editor. Add designs here. */
export const TEMPLATE_CATALOG = [
  { code: "tpl_classic", name: "Classic Elegance", style: "Sage & Gold", gradient: "from-[#FBF3E4] to-[#EDE0CC]", accent: "#C59B48", demoSlug: "demo-template", plan: "paid", description: "An elegant sage and gold invitation." },
  { code: "tpl_royal", name: "Royal Kandyan", style: "Traditional & Gold", gradient: "from-[#FDFBF7] to-[#EBE5DA]", accent: "#A67C00", demoSlug: "demo-kandyan", plan: "free", description: "Traditional Kandyan details and warm gold accents." },
  { code: "tpl_modern", name: "Modern Luxe", style: "Emerald & Gold Arch", gradient: "from-[#F5F6EF] to-[#E9EDE3]", accent: "#315A46", demoSlug: "demo-modern", plan: "free", description: "The Lotus Arch layout in elegant emerald and gold." },
  { code: "tpl_floral", name: "Floral Garden", style: "Blush Watercolor", gradient: "from-[#FBEAF0] to-[#EFE6F7]", accent: "#B5577A", demoSlug: "demo-floral", plan: "free", description: "Soft watercolor florals in blush and lavender." },
  { code: "tpl_minimal", name: "Minimal White", style: "Modern Editorial", gradient: "from-[#FFFFFF] to-[#EDEDED]", accent: "#262626", demoSlug: "demo-minimal", plan: "paid", description: "A clean editorial design with understated typography." },
  { code: "tpl_golden_hour", name: "Ruby Heart Romance", style: "Ruby, Blush & Gold Editorial", gradient: "from-[#64142D] to-[#F5DCE0]", accent: "#8C1D40", demoSlug: "demo-golden-hour", plan: "paid", description: "A dramatic ruby-red design with falling hearts and warm gold accents." },
  { code: "tpl_free_arch", name: "Lotus Arch", style: "Botanical Arch · Three Colours", gradient: "from-[#FAF7F1] to-[#F2EBE4]", accent: "#8E2F59", demoSlug: "demo-free-arch", plan: "free", description: "Botanical stationery in Lotus, Jade or Ocean colours." },
] as const;

export const FREE_TEMPLATES = TEMPLATE_CATALOG.filter((template) => template.plan === "free");
export type FreeTemplateCode = (typeof FREE_TEMPLATES)[number]["code"];
export const FREE_PLAN = { guestLimit: 10, invitationLimit: 1, watermark: true } as const;

export function isFreeTemplate(code: unknown): code is FreeTemplateCode {
  return FREE_TEMPLATES.some((template) => template.code === code);
}
