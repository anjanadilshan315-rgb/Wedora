import Image from "next/image";

/** A circular brand frame that keeps the complete Forever artwork visible. */
export default function BrandLogo({
  className = "",
  preload = false,
}: {
  className?: string;
  preload?: boolean;
}) {
  return (
    <span className={`relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C59B48]/55 bg-white shadow-[0_3px_16px_rgba(180,135,65,0.14)] ${className}`}>
      <Image
        src="/assets/logo.svg"
        alt="Forever — Online Wedding Invitation Website"
        width={1672}
        height={941}
        unoptimized
        preload={preload}
        className="h-auto w-[88%] object-contain"
      />
    </span>
  );
}
