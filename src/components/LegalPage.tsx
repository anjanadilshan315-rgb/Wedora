import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export interface LegalSection {
  heading: string;
  body: React.ReactNode;
}

/** Shared layout for the privacy policy and terms pages. */
export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full">
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#29221D]">{title}</h1>
        <p className="text-xs text-[#A69B90] mt-2">Last updated: {updated}</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-serif-luxury text-2xl font-bold text-[#29221D] mb-2">{s.heading}</h2>
              <div className="text-sm text-[#5D534A] leading-relaxed space-y-2">{s.body}</div>
            </section>
          ))}
          <p className="text-sm text-[#5D534A]">
            Questions? <Link href="/contact" className="text-[#9A6F24] underline">Contact us</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
