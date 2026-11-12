import type { Metadata } from "next";
import PremiumPreview from "@/components/premium/PremiumPreview";
export const metadata: Metadata = { title: "Rosé Atelier | Premium Wedding Invitation", description: "A floral wax-sealed invitation, designed around your celebration." };
export default function Page() { return <PremiumPreview />; }
