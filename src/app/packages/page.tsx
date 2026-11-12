import EvermorePackageCard from "@/components/premium/evermore/EvermorePackageCard";
import WalawwaPackageCard from "@/components/premium/walawwa/WalawwaPackageCard";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Crown,
  Gem,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { FREE_TEMPLATES, FREE_PLAN } from "@/lib/template-catalog";
import { BASIC_PLAN, BASIC_TEMPLATES } from "@/lib/basic-invitation";
import { STANDARD_PLAN } from "@/lib/standard-invitation";

export const metadata: Metadata = {
  title: "Wedding Invitation Packages | Liora",
  description:
    "Compare Liora Free, Basic, Standard and Premium digital wedding invitation packages.",
};

// Add each plan's own features here. Higher plans automatically include lower plans.
const packagePlans = [
  {
    name: "Free",
    subtitle: "A lovely way to get started",
    description: "Share the essential details of your special day with a simple digital invitation.",
    icon: Heart,
    accent: "from-[#FCF8F0] to-white",
    ownFeatures: [
      "Normal wedding invitation template",
      "Basic bride and groom details",
      "Wedding date and time",
      "Wedding venue details",
      "Couple names display",
      "Basic invitation preview",
      `${FREE_TEMPLATES.length} free invitation designs`,
      "Share invitation link",
      "Central RSVP inbox (Yes / No)",
      "System watermark",
      `Up to ${FREE_PLAN.guestLimit} guests per invitation`,
    ],
    buttonText: "Get started free",
    href: "/free-invitation",
    highlighted: false,
  },
  {
    name: "Basic",
    subtitle: "More ways to make it yours",
    description: "Add personal touches and useful tools to make sharing and planning easier.",
    icon: Star,
    accent: "from-[#FBF3E4] to-white",
    ownFeatures: [
      "Premium-looking static templates",
      "Multiple invitation designs",
      "Couple photo upload",
      "Background music",
      "Custom wedding message",
      "Google Maps venue location",
      "RSVP with guest name",
      "Guest list management",
      "WhatsApp sharing",
      "Email invitation sharing",
      "QR code invitation",
      "Guest count tracking",
      "No watermark",
      "Up to 100 guests",
    ],
    buttonText: "Create Basic invitation",
    href: "/basic-invitation",
    highlighted: false,
  },
  {
    name: "Standard",
    subtitle: "Bring your invitation to life",
    description: "Create a memorable, animated experience with more ways to celebrate together.",
    icon: Sparkles,
    accent: "from-[#F7EBDD] to-white",
    ownFeatures: [
      "Animated wedding invitation",
      "Wedding invitation video",
      "Couple photo slideshow",
      "Animated text effects",
      "Background music with controls",
      "Video background support",
      "Countdown timer",
      "Animated opening envelope",
      "Multiple animation styles",
      "Personalized welcome screen",
      "Wedding event schedule",
      "Multiple events (Homecoming / Wedding)",
      "Advanced RSVP",
      "Guest attendance tracking",
      "Custom invitation URL",
      "Up to 500 guests",
      "Downloadable invitation video",
    ],
    buttonText: "Create Standard invitation",
    href: "/standard-invitation",
    highlighted: true,
  },
  {
    name: "Premium",
    subtitle: "A celebration, designed around you",
    description: "Enjoy a bespoke invitation and advanced guest tools, tailored to your vision.",
    icon: Crown,
    accent: "from-[#29221D] to-[#51402F]",
    ownFeatures: [
      "Full custom invitation design",
      "Custom color combinations",
      "Custom fonts and typography",
      "Custom animation effects",
      "Custom video background",
      "Personalized invitation layout",
      "Custom opening animation",
      "Upload your own wedding video",
      "Multiple photo galleries",
      "Custom music upload",
      "Unlimited guest invitations*",
      "Advanced guest management",
      "Individual guest invitation links",
      "Guest seating management",
      "Custom RSVP questions",
      "Guest analytics dashboard",
      "Invitation password protection",
      "Priority customer support",
      "No platform branding",
    ],
    buttonText: "Create Premium invitation",
    href: "/premium-invitation",
    highlighted: false,
  },
];

function getInquiryLink(packageName: string) {
  const message = encodeURIComponent(
    `Hi Liora! I'd like to know more about the ${packageName} wedding invitation package.`,
  );
  return `https://wa.me/94757115645?text=${message}`;
}

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      <SiteHeader active="Packages" />

      <main>
        <section className="relative overflow-hidden border-b border-[#EDE3D6] bg-white px-4 py-16 text-center sm:py-20">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#FBF3E4] blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#F7EBDD] blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <div className="mb-4 flex items-center justify-center gap-3 text-[#B88737]">
              <span className="h-px w-10 bg-[#C59B48]" />
              <Heart className="h-4 w-4 fill-current" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">Made for your day</span>
              <Heart className="h-4 w-4 fill-current" />
              <span className="h-px w-10 bg-[#C59B48]" />
            </div>
            <h1 className="font-serif-luxury text-4xl font-semibold leading-tight text-[#29221D] sm:text-5xl lg:text-6xl">
              Find your <span className="text-[#B88737]">Liora plan</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#7D736A] sm:text-base">
              Start with the essentials or create a fully tailored celebration. Compare what is included in each plan and choose what feels right for you.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="font-serif-luxury text-3xl font-semibold text-[#29221D] sm:text-4xl">Four ways to celebrate</h2>
            <p className="mt-2 text-sm text-[#7D736A]">Paid plan pricing and setup can be discussed with our team.</p>
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-2">
            {packagePlans.map((plan, index) => {
              const Icon = plan.icon;
              const premium = plan.name === "Premium";
              const buttonHref = plan.href === "whatsapp" ? getInquiryLink(plan.name) : plan.href;

              return (
                <article
                  key={plan.name}
                  className={`relative flex flex-col overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-6 shadow-sm transition-transform hover:-translate-y-1 sm:p-8 ${plan.accent} ${plan.highlighted ? "border-[#C59B48] shadow-[0_18px_55px_rgba(154,111,36,0.14)]" : "border-[#EADBCA]"}`}
                >
                  {plan.highlighted && (
                    <span className="absolute right-5 top-5 rounded-full bg-[#B88737] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                      Most popular
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${premium ? "bg-white/10 text-[#E8C97A]" : "bg-[#FBF3E4] text-[#B88737]"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="pr-20 sm:pr-24">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${premium ? "text-[#E8C97A]" : "text-[#B88737]"}`}>{plan.subtitle}</p>
                      <h3 className={`mt-1 font-serif-luxury text-3xl font-semibold ${premium ? "text-white" : "text-[#29221D]"}`}>{plan.name} Plan</h3>
                    </div>
                  </div>
                  <p className={`mt-4 min-h-12 text-sm leading-6 ${premium ? "text-white/75" : "text-[#7D736A]"}`}>{plan.description}</p>

                  <div className={`my-5 h-px ${premium ? "bg-white/15" : "bg-[#F0E8DC]"}`} />

                  <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.14em] ${premium ? "text-[#E8C97A]" : "text-[#9A6F24]"}`}>
                    {index === 0
                      ? `${plan.ownFeatures.length} features included`
                      : plan.name === "Premium"
                        ? `Includes Standard Plan features (excluding custom URL) + ${plan.ownFeatures.length} new features`
                        : `Includes all ${packagePlans[index - 1].name} Plan features + ${plan.ownFeatures.length} new features`}
                  </p>
                  <ul className="grid flex-1 content-start gap-x-5 gap-y-3 sm:grid-cols-2">
                    {plan.ownFeatures.map((feature, featureIndex) => (
                      <li key={`${feature}-${featureIndex}`} className={`flex gap-2.5 text-xs leading-5 sm:text-[13px] ${premium ? "text-white/85" : "text-[#4A3F37]"}`}>
                        <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${premium ? "text-[#E8C97A]" : "text-[#B88737]"}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.name === "Free" && (
                    <div className="mt-5 rounded-2xl bg-[#FFF7F9] p-4 text-xs leading-6 text-[#7F5A6B]">
                      <p>One invitation per free account, with a saved draft, a permanent share link and a private RSVP inbox. Invite up to {FREE_PLAN.guestLimit} guests. Choose your design below.</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">{FREE_TEMPLATES.map((template) => <Link key={template.code} href={`/free-invitation?template=${template.code}`} className="rounded-xl border border-[#EAD9DF] bg-white px-3 py-3 font-semibold text-[#8E2F59] hover:bg-[#FAF1F4]">{template.name} →</Link>)}</div>
                    </div>
                  )}
                  {plan.name === "Basic" && (
                    <div className="mt-5 rounded-2xl bg-[#FBF3E4] p-4 text-xs leading-6 text-[#7D6542]">
                      <p>Personalize your Basic wedding invitation with your couple photo, background music and wedding details. Invite up to {BASIC_PLAN.guestLimit} guests with no watermark.</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {BASIC_TEMPLATES.map((template) => <Link key={template.code} href={`/basic-invitation?template=${template.code}${template.code === "botanical" ? "&design=sage" : ""}`} className="rounded-xl border border-[#E6D5B5] bg-white px-3 py-3 text-[#8A6329] hover:bg-[#FFF9EF]">
                          <span className="block font-semibold">{template.name} →</span>
                          <span className="mt-1 block text-[11px] font-normal leading-5 text-[#7D736A]">{template.description}</span>
                        </Link>)}
                      </div>
                    </div>
                  )}
                  {plan.name === "Standard" && (
                    <div className="mt-5 overflow-hidden rounded-xl border border-[#D8CEB4] bg-[#762847] text-[#FFF4F8]">
                      <div className="relative grid grid-cols-[1fr_88px] items-center gap-4 overflow-hidden px-4 py-4 sm:grid-cols-[1fr_108px]">
                        <div className="relative z-10"><p className="text-[7px] uppercase tracking-[.2em] text-[#F0C6B8]">The Standard Collection</p><h4 className="mt-1 font-serif-luxury text-3xl">The Vow</h4><p className="mt-1 font-serif-luxury text-base italic text-[#F0C6B8]">Your love, in motion.</p><p className="mt-2 text-[10px] leading-5 text-[#F4DDE5]">6 designs. Your colours. Your signature style.</p></div>
                        <div className="relative h-28 overflow-hidden rounded-t-full border border-[#BDA16A]/60 sm:h-32">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/standard/couple.jpg" alt="A romantic wedding celebration in The Vow collection" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/15 px-4 py-3 text-[10px] leading-5"><p className="text-[#F4DDE5]">4 animation styles · {STANDARD_PLAN.guestLimit} guests</p><Link href="/standard-invitation/preview" className="inline-flex items-center gap-2 font-semibold text-[#FFE1CD]">Explore the designs <ArrowRight size={12} /></Link></div>
                    </div>
                  )}
                  {plan.name === "Standard" && <div className="mt-3 grid grid-cols-[1fr_100px] overflow-hidden rounded-xl border border-[#39372F] bg-[#F8F3E6] text-[#302C28]"><div className="p-4"><p className="text-[7px] uppercase tracking-[.2em] text-[#93421F]">New · For the good things</p><h4 className="mt-1 text-3xl font-semibold tracking-tight">Saffron</h4><p className="mt-2 text-[10px] leading-5">Marigold stationery, a sliding letter and your own photo journal.</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px]"><Link href="/standard-invitation/saffron" className="inline-flex items-center gap-2 font-semibold">Experience Saffron <ArrowRight size={12} /></Link><Link href="/standard-invitation?layout=saffron" className="underline underline-offset-4">Make it yours</Link></div></div><div className="relative min-h-36 border-l-8 border-[#ECC04B]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/saffron/cover.jpg" alt="Saffron, the editorial Standard invitation" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></div></div>}
                  {plan.name === "Standard" && <div className="mt-3 overflow-hidden rounded-xl border border-[#AEC4BB] bg-[#145C61] text-[#FFFCF3]"><div className="grid grid-cols-[1fr_105px] items-stretch"><div className="p-4"><p className="text-[7px] uppercase tracking-[.2em] text-[#F1CD9A]">New · A sunlit celebration</p><h4 className="mt-1 font-serif-luxury text-3xl">Solstice</h4><p className="mt-1 text-[10px] leading-5 text-[#DBE7DB]">Coastal colours, a folding wedding folio and your next great adventure.</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#F1CD9A]"><Link href="/standard-invitation/solstice" className="inline-flex items-center gap-2 font-semibold">Experience Solstice <ArrowRight size={12} /></Link><Link href="/standard-invitation?layout=solstice" className="underline underline-offset-4">Make it yours</Link></div></div><div className="relative min-h-36">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/solstice/cover.jpg" alt="The new Solstice wedding invitation" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></div></div></div>}
                  {plan.name === "Standard" && <div className="mt-3 grid grid-cols-[1fr_95px] overflow-hidden rounded-xl border border-[#7183A1] bg-[#131F36] text-[#EDF2FF]"><div className="p-4"><p className="text-[7px] uppercase tracking-[.2em] text-[#BFCFE6]">New · An evening to remember</p><h4 className="mt-1 font-serif-luxury text-3xl">Moonlit</h4><p className="mt-1 text-[10px] leading-5 text-[#CDDAEE]">Pearl, midnight, and a thousand little forevers.</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px]"><Link href="/standard-invitation/moonlit" className="inline-flex items-center gap-2 font-semibold">Experience Moonlit <ArrowRight size={12} /></Link><Link href="/standard-invitation?layout=moonlit" className="underline underline-offset-4">Make it yours</Link></div></div><div className="relative min-h-36">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/moonlit/cover.jpg" alt="Moonlit, the new cinematic Standard invitation" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></div></div>}
                  {premium && <div className="mt-5 overflow-hidden rounded-2xl border border-[#B8C9CE] bg-[#EDF4F7] text-[#614136]"><div className="grid grid-cols-[1fr_115px] items-stretch"><div className="p-5"><p className="text-[7px] uppercase tracking-[.2em] text-[#5B7581]">New · A wedding journey</p><h4 className="mt-2 font-serif-luxury text-3xl">Aureline</h4><p className="mt-2 text-[10px] leading-5">A mandala beginning. A cinematic drive. Your own beautiful tradition.</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px]"><Link href="/premium-invitation/aureline" className="inline-flex items-center gap-2 font-semibold">Experience Aureline <ArrowRight size={12} /></Link><Link href="/premium-invitation?template=aureline" className="underline underline-offset-4">Make it yours</Link></div></div><div className="relative min-h-48"><Image src="/assets/aureline/journey.webp" alt="Aureline's illustrated vintage-car wedding journey" fill sizes="115px" className="object-cover object-bottom" /></div></div></div>}
                  {premium && <WalawwaPackageCard />}
                  {premium && <EvermorePackageCard />}
                  {premium && <div className="mt-5 overflow-hidden rounded-2xl border border-[#CFB7AA] bg-[#F7E9EC] text-[#65283B]"><div className="grid grid-cols-[1fr_110px] items-center gap-4 p-5"><div><p className="text-[7px] uppercase tracking-[.2em] text-[#8A5C65]">The Premium Atelier</p><h4 className="mt-2 font-serif-luxury text-3xl">Rosé Atelier</h4><p className="mt-2 text-[10px] leading-5">Floral stationery. A wax-sealed beginning. Every detail, yours.</p></div><div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl bg-cover bg-center" style={{ backgroundImage: "url(/assets/premium/rose-floral-paper.webp)" }}><Image src="/assets/premium/rose-envelope.webp" width={180} height={120} alt="Embossed crimson floral envelope with a red wax seal" className="relative w-full -rotate-6 drop-shadow-lg" /></div></div><div className="flex flex-wrap justify-between gap-3 border-t border-[#DCC4C9] px-5 py-4 text-[10px]"><Link href="/premium-invitation/preview" className="inline-flex items-center gap-2 font-semibold">Experience Rosé Atelier <ArrowRight size={12} /></Link><Link href="/premium-invitation" className="underline underline-offset-4">Make it yours</Link></div></div>}
                  {premium && <p className="mt-4 text-[11px] leading-5 text-white/60">*Unlimited guest invitations under fair use. Media uploads have separate storage limits. Priority support requests can be saved in your studio; response times are arranged with the team.</p>}

                  <a
                    href={buttonHref}
                    target={plan.href === "whatsapp" ? "_blank" : undefined}
                    rel={plan.href === "whatsapp" ? "noopener noreferrer" : undefined}
                    className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-colors ${premium ? "bg-[#E8C97A] text-[#29221D] hover:bg-[#F1DFAE]" : plan.highlighted ? "bg-[#B88737] text-white hover:bg-[#9A6F24]" : "border border-[#C59B48] text-[#9A6F24] hover:bg-[#FBF3E4]"}`}
                  >
                    {plan.href === "whatsapp" ? <MessageCircle className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    {plan.buttonText}
                  </a>
                </article>
              );
            })}
          </div>

          <p className="mt-7 text-center text-xs leading-5 text-[#8A7F74]">
            Features are shown as described for each plan. Contact Liora to confirm current availability, pricing and any usage limits.
          </p>
        </section>

        <section className="border-y border-[#EDE3D6] bg-white px-4 py-12 sm:py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B88737]">Need a hand choosing?</p>
              <h2 className="mt-2 font-serif-luxury text-3xl font-semibold text-[#29221D]">Let’s plan your invitation</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#7D736A]">Tell us about your celebration and our team can help you find a package that fits.</p>
            </div>
            <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#29221D] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#4A3F37]">
              Talk to our team <Gem className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
