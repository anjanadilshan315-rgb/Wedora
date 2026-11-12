import type { Metadata } from "next";
import StandardPreview from "@/components/standard-studio/StandardPreview";

export const metadata: Metadata = {
  title: "Moonlit · An Evening to Remember | Liora",
  description: "A cinematic Standard wedding invitation in pearl and midnight, with a lunar envelope, constellation motion, personal RSVP and a downloadable film.",
};
export default function MoonlitPreviewPage() { return <StandardPreview initialLayout="moonlit" />; }
