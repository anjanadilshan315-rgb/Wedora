import type { Metadata } from "next";
import FreeStudio from "@/components/free-studio/FreeStudio";

export const metadata: Metadata = { title: "Free Invitation Studio | Liora", description: "Choose a free wedding design, save your draft and publish a beautiful invitation with a central RSVP inbox." };
export default function FreeInvitationPage() { return <FreeStudio />; }
