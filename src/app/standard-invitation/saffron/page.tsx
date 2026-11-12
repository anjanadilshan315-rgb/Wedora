import type { Metadata } from "next";
import StandardPreview from "@/components/standard-studio/StandardPreview";

export const metadata: Metadata = {
  title: "Saffron | A day for the good things",
  description: "An editorial Standard wedding invitation with marigold stationery, a sliding envelope, photo journal, RSVP and a downloadable invitation film.",
};
export default function SaffronPreviewPage() {
  return <StandardPreview initialLayout="saffron" />;
}
