import { STANDARD_LAYOUTS } from "./standard-invitation";
import { PREMIUM_TEMPLATES } from "./premium-invitation";

export interface ShowcaseTemplate {
  id: string;
  code: string;
  plan: "Standard" | "Premium";
  name: string;
  description: string;
  image: string;
  alt: string;
  previewHref: string;
  createHref: string;
  imageClass: string;
}

// These four designs are the individual Standard cards shown on Packages.
const standardArtwork = {
  vow: { image: "/assets/standard/couple.jpg", alt: "A romantic wedding celebration in The Vow collection", previewHref: "/standard-invitation/preview" },
  saffron: { image: "/assets/saffron/cover.jpg", alt: "Saffron's marigold wedding stationery and photo story", previewHref: "/standard-invitation/saffron" },
  solstice: { image: "/assets/solstice/cover.jpg", alt: "Solstice's sunlit coastal wedding celebration", previewHref: "/standard-invitation/solstice" },
  moonlit: { image: "/assets/moonlit/cover.jpg", alt: "Moonlit's cinematic evening wedding celebration", previewHref: "/standard-invitation/moonlit" },
};

const premiumArtwork = {
  rose: { image: "/assets/premium/rose-envelope.webp", alt: "Crimson floral envelope with a wax seal", previewHref: "/premium-invitation/preview", imageClass: "object-contain object-top p-5 pt-16" },
  aureline: { image: "/assets/aureline/journey.webp", alt: "Aureline's illustrated wedding journey", previewHref: "/premium-invitation/aureline", imageClass: "object-cover object-bottom" },
  walawwa: { image: "/assets/walawwa/courtyard-night.svg", alt: "Walawwa's lantern-lit heritage courtyard", previewHref: "/premium-invitation/walawwa", imageClass: "object-cover" },
  evermore: { image: "/assets/evermore/shoreline-vows.jpg", alt: "Evermore's romantic wedding photo story", previewHref: "/premium-invitation/evermore", imageClass: "object-cover" },
};

// Keep template names and descriptions connected to the existing plan catalogs.
export const STANDARD_SHOWCASE: ShowcaseTemplate[] = STANDARD_LAYOUTS.flatMap((template) => {
  // Garden and Editorial are variations inside The Vow collection, not separate package cards.
  if (template.code === "garden" || template.code === "editorial") return [];
  return [{
    ...template,
    ...standardArtwork[template.code],
    id: `standard-${template.code}`,
    plan: "Standard" as const,
    createHref: `/standard-invitation?layout=${template.code}`,
    imageClass: "object-cover",
  }];
}).sort((first, second) => {
  const order = ["vow", "saffron", "solstice", "moonlit"];
  return order.indexOf(first.code) - order.indexOf(second.code);
});

export const PREMIUM_SHOWCASE: ShowcaseTemplate[] = PREMIUM_TEMPLATES.map((template) => ({
  ...template,
  ...premiumArtwork[template.code],
  id: `premium-${template.code}`,
  plan: "Premium",
  createHref: `/premium-invitation?template=${template.code}`,
}));
