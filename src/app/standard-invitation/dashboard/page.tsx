import type { Metadata } from "next";
import StandardStudio from "@/components/standard-studio/StandardStudio";

export const metadata: Metadata = { title: "Standard Guest Dashboard | Liora", robots: { index: false, follow: false } };
export default function StandardDashboardPage() { return <StandardStudio dashboard />; }
