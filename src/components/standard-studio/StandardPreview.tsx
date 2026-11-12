"use client";

import Link from "next/link";
import { useState } from "react";
import StandardInvitation from "@/components/invitation/StandardInvitation";
import { standardPalettes } from "@/lib/standard-appearance";
import { standardSample, STANDARD_LAYOUTS, STANDARD_FONTS, type StandardInvitationDetails } from "@/lib/standard-invitation";

export default function StandardPreview({ initialLayout = "vow" }: { initialLayout?: StandardInvitationDetails["standardLayout"] }) {
  const [details, setDetails] = useState<StandardInvitationDetails>({ ...standardSample(initialLayout), standardLayout: initialLayout });
  const control = "min-h-9 max-w-36 rounded-md border border-[#dbd4c0] bg-[#fffdf7] px-2 text-[10px] outline-offset-2 focus:outline-[#806b40]";
  return <main><div className="relative z-20 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-[#e1d9c5] bg-[#f5efdf] px-4 py-3 text-center text-[10px] text-[#4c5948]"><span className="text-[9px] uppercase tracking-widest">Standard Collection · Sample</span><div className="flex flex-wrap justify-center gap-2"><select className={control} aria-label="Preview design" value={details.standardLayout ?? "vow"} onChange={(event) => setDetails({ ...details, standardLayout: event.target.value as StandardInvitationDetails["standardLayout"], customColors: undefined })}>{STANDARD_LAYOUTS.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select><select className={control} aria-label="Preview colour theme" value={details.design} onChange={(event) => setDetails({ ...details, design: event.target.value as StandardInvitationDetails["design"] })}>{standardPalettes(details.standardLayout).map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select><select className={control} aria-label="Preview font" value={details.font ?? "classic"} onChange={(event) => setDetails({ ...details, font: event.target.value as StandardInvitationDetails["font"] })}>{STANDARD_FONTS.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></div><Link href={`/standard-invitation?layout=${details.standardLayout ?? "vow"}&design=${details.design}&font=${details.font ?? "classic"}`} className="py-2 font-semibold underline underline-offset-4">Make it yours →</Link></div><StandardInvitation details={details} demo preview={false} guestName="Alex & Jamie" /></main>;
}
