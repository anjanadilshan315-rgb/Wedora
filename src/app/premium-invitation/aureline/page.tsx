import type { Metadata } from "next";
import PremiumPreview from "@/components/premium/PremiumPreview";

export const metadata: Metadata = {
  title: "Aureline | The Premium Wedding Journey",
  description: "A mandala invitation, cinematic vintage-car opening, porcelain-blue stationery and a thoughtfully personalized celebration.",
};
export default function Page() { return <PremiumPreview initialTemplate="aureline" />; }
