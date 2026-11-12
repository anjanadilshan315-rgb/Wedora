import type { Metadata } from "next";
import StandardPreview from "@/components/standard-studio/StandardPreview";

export const metadata: Metadata = { title: "Solstice · A Wedding Adventure | Liora", description: "A sunlit Standard invitation with a folding wedding folio, panoramic photography, wedding and homecoming celebrations, and personal RSVP." };
export default function SolsticePreviewPage() { return <StandardPreview initialLayout="solstice" />; }
