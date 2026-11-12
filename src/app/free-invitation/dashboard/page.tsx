import type { Metadata } from "next";
import FreeStudio from "@/components/free-studio/FreeStudio";

export const metadata: Metadata = { title: "Your Free Invitation & Guest Replies | Liora", robots: { index: false, follow: false } };
export default function FreeInvitationDashboard() { return <FreeStudio dashboard />; }
