import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WalawwaPackageCard() {
  return <div className="mt-4 overflow-hidden rounded-2xl border border-[#A47B48] bg-[#2D1B12] text-[#FFF2D7]">
    <div className="grid grid-cols-[1fr_105px]">
      <div className="p-5"><p className="text-[7px] uppercase tracking-[.2em] text-[#DBB77C]">New · A heritage celebration</p><h4 className="mt-2 font-serif-luxury text-3xl">Walawwa</h4><p className="mt-2 text-[10px] leading-5 text-[#EFDBC0]">Carved doors. A sunlit ceremony. A courtyard full of little lights.</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px]"><Link href="/premium-invitation/walawwa" className="inline-flex items-center gap-2 font-semibold">Experience Walawwa <ArrowRight size={12} /></Link><Link href="/premium-invitation?template=walawwa" className="underline underline-offset-4">Make it yours</Link></div></div>
      <div className="relative min-h-48 border-l border-[#D5B67C]/30"><Image src="/assets/walawwa/courtyard-night.svg" alt="Walawwa's illustrated lantern-lit heritage courtyard" fill sizes="105px" className="object-cover" /></div>
    </div><p className="border-t border-[#D5B67C]/20 px-5 py-3 text-[8px] tracking-wide text-[#DBB77C]">Day-to-night scenery · Personal guest links · All Premium features</p>
  </div>;
}
