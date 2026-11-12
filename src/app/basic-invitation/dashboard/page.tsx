import type { Metadata } from "next";
import BasicStudio from "@/components/basic-studio/BasicStudio";

export const metadata: Metadata = { title: "Basic Guest Dashboard | Liora", robots: { index: false, follow: false } };
export default function BasicDashboardPage() { return <BasicStudio dashboard />; }
