import type { Metadata } from "next";
import PremiumPreview from "@/components/premium/PremiumPreview";

export const metadata: Metadata = {
  title: "Walawwa | A Premium Heritage Wedding Invitation",
  description: "Open carved timber doors into a floral ceremony, an evening of lanterns and a celebration made personal.",
};
export default function Page() { return <PremiumPreview initialTemplate="walawwa" />; }
