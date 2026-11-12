import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EvermorePackageCard() {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#D9CCD9] bg-[#F2EDF5] text-[#635078]">
      <div className="grid grid-cols-[1fr_105px]">
        <div className="p-5">
          <p className="text-[7px] uppercase tracking-[.2em] text-[#855F51]">
            New · A little film, a lifetime of love
          </p>
          <h4 className="mt-2 font-serif-luxury text-3xl">Evermore</h4>
          <p className="mt-2 text-[10px] leading-5">
            A cinematic beginning. A romantic photo story. Your own beautiful
            forever.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px]">
            <Link
              href="/premium-invitation/evermore"
              className="inline-flex items-center gap-2 font-semibold"
            >
              Experience Evermore <ArrowRight size={12} />
            </Link>
            <Link
              href="/premium-invitation?template=evermore"
              className="underline underline-offset-4"
            >
              Make it yours
            </Link>
          </div>
        </div>
        <div className="relative min-h-48">
          <Image
            src="/assets/evermore/shoreline-vows.jpg"
            alt="Evermore's romantic wedding photo story"
            fill
            sizes="105px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
