import type { Metadata } from "next";
import BasicStudio from "@/components/basic-studio/BasicStudio";

export const metadata: Metadata = { title: "Basic Invitation Studio | Forever", description: "Create a personal wedding invitation with photos, music, venue directions and RSVP for up to 100 guests." };
export default function BasicInvitationPage() { return <BasicStudio />; }
