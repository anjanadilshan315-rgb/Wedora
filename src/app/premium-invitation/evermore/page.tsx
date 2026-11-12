import type { Metadata } from "next";
import PremiumPreview from "@/components/premium/PremiumPreview";

export const metadata: Metadata = {
  title: "Evermore | A Little Film, A Lifetime of Love",
  description:
    "A cinematic wedding welcome, romantic arch stationery and a thoughtfully personal celebration, from the first hello to forever.",
};
export default function Page() {
  return <PremiumPreview initialTemplate="evermore" />;
}
