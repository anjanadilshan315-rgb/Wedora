import type { Metadata } from "next";
import StandardStudio from "@/components/standard-studio/StandardStudio";

export const metadata: Metadata = { title: "The Vow · Standard Invitation Studio | Forever", description: "A cinematic wedding invitation with an opening envelope, photos, music, multiple celebrations and thoughtful RSVP for up to 500 guests." };
export default function StandardInvitationPage() { return <StandardStudio />; }
