import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Montserrat, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const heritageBody = Jost({ variable: "--font-heritage-body", subsets: ["latin"], weight: ["300", "400", "500"] });
const heritageClassic = Playfair_Display({ variable: "--font-heritage-classic", subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Wedding Invitation | Customer Login",
  description: "Create beautiful wedding invitations, share with your loved ones and celebrate together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${montserrat.variable} ${heritageBody.variable} ${heritageClassic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans bg-[#FBF8F4] text-[#2C231E]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
