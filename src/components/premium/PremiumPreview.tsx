"use client";
import Link from "next/link";
import { useState } from "react";
import { premiumSample, premiumOpeningOptions, PREMIUM_TEMPLATES, type PremiumDetails } from "@/lib/premium-invitation";
import PremiumInvitation from "./PremiumInvitation";

export default function PremiumPreview({ initialTemplate = "rose" }: { initialTemplate?: PremiumDetails["premiumTemplate"] }) {
  const [details, setDetails] = useState(() => premiumSample(initialTemplate));
  const [version, setVersion] = useState(0);
  const openings = premiumOpeningOptions(details.premiumTemplate);
  return <main>
    <div className="flex flex-wrap items-center justify-center gap-4 border-b border-[#cedbe0] bg-[#f6f9fa] px-4 py-3 text-[10px] text-[#4f626a]">
      <span className="uppercase tracking-[.16em]">Premium Collection · Preview</span>
      <select aria-label="Preview Premium template" value={details.premiumTemplate ?? "rose"} onChange={(e) => { setDetails(premiumSample(e.target.value)); setVersion((n) => n + 1); }} className="rounded border border-[#cedbe0] bg-white p-2">
        {PREMIUM_TEMPLATES.map((t) => <option key={t.code} value={t.code}>{t.name}</option>)}
      </select>
      <select aria-label="Preview opening animation" value={details.opening} onChange={(e) => { setDetails({ ...details, opening: e.target.value as PremiumDetails["opening"] }); setVersion((n) => n + 1); }} className="rounded border border-[#cedbe0] bg-white p-2">
        {openings.map(({code, label}) => <option key={code} value={code}>{label}</option>)}
      </select>
      <Link href={`/premium-invitation?template=${details.premiumTemplate ?? "rose"}`} className="font-semibold underline underline-offset-4">Make it yours →</Link>
    </div>
    <PremiumInvitation key={version} details={details} demo guest={{ name: "Alex & Jamie", status: "pending", reply: null, table: "" }} />
  </main>;
}
