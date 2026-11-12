import type { Metadata } from "next";
import type { ReactNode } from "react";

// Guest-facing metadata is deliberately unbranded and does not expose private names.
export const metadata: Metadata = {
  title: { absolute: "A personal wedding invitation" },
  description: "An invitation to a beautiful celebration. Open your personal invitation for the details.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: ReactNode }) { return children; }
