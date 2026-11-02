import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Crown, ExternalLink, Flower2, Heart, MessageCircle, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { INVITATION_PACKAGES } from "@/components/invitation/packages";
import { TEMPLATE_DESIGNS } from "@/components/invitation/registry";

const WHATSAPP_NUMBER = "94757115645";

function packageLink(packageName: string) {
  const message = encodeURIComponent(`Hi Wedora! I'd like to know more about the ${packageName} invitation package.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#29221d]">
      <SiteHeader active="Packages" />

      <main>
        <section className="relative overflow-hidden border-b border-[#e9dfd2] bg-[#f4eee5]">
          <div className="pointer-events-none absolute -right-20 -top-32 h-[28rem] w-[28rem] rounded-full border border-[#c59b48]/20" />
          <div className="pointer-events-none absolute -right-8 -top-20 h-[24rem] w-[24rem] rounded-full border border-[#c59b48]/20" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-12">
            <div>
              <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-[#9a6f24]"><Sparkles className="h-4 w-4" /> Wedora invitation collections</p>
              <h1 className="max-w-3xl font-serif-luxury text-5xl font-medium leading-[.98] tracking-tight sm:text-7xl">Make every detail<br /><span className="italic text-[#9a6f24]">feel like yours.</span></h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#766a5e] sm:text-base">Three considered ways to share your wedding day. Each package is built around Wedora&apos;s existing invitation designs and guest features.</p>
              <a href="#packages" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#29221d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#493b30]">Explore packages <ArrowDown className="h-4 w-4" /></a>
            </div>
            <div className="relative mx-auto w-full max-w-sm lg:mr-4">
              <div className="absolute inset-5 rotate-[-7deg] rounded-[2rem] border border-[#c59b48]/40 bg-white/40" />
              <div className="relative rounded-[2rem] border border-[#e5d8c6] bg-[#fbfaf7] p-8 text-center shadow-[0_24px_70px_rgba(71,51,31,.12)] sm:p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#9a6f24]">A day to remember</p>
                <div className="mx-auto my-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#c59b48]/50 text-[#a77e37]"><Heart className="h-5 w-5" /></div>
                <p className="font-serif-luxury text-3xl italic text-[#463a30]">Your names, your story</p>
                <div className="mx-auto my-6 h-px w-16 bg-[#c59b48]/60" />
                <p className="text-[10px] uppercase tracking-[.22em] text-[#9c9083]">Invitation · Celebration · Together</p>
                <p className="mt-6 text-xs text-[#766a5e]">Digital invitations designed around the moments that matter.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="packages" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#a77e37]">Choose your experience</p><h2 className="mt-2 font-serif-luxury text-4xl font-medium sm:text-5xl">Three ways to celebrate</h2></div>
            <p className="max-w-sm text-sm leading-6 text-[#766a5e]">Every celebration is different. Tell us what you have in mind and we&apos;ll help you choose the right fit.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
            {INVITATION_PACKAGES.map((item) => {
              const includedDesigns = item.templateCodes.map((code) => TEMPLATE_DESIGNS.find((template) => template.code === code)).filter((template) => template !== undefined);
              const includedPackage = item.includesPackageId ? INVITATION_PACKAGES.find((packageItem) => packageItem.id === item.includesPackageId) : undefined;
              const isBespoke = item.id === "signature";
              const PackageIcon = item.id === "essential" ? Flower2 : item.id === "celebration" ? Sparkles : Crown;
              return (
                <article id={item.id} key={item.id} className={`group relative isolate scroll-mt-28 flex flex-col overflow-hidden rounded-[1.7rem] border p-6 transition duration-300 hover:-translate-y-1 sm:p-7 ${item.featured ? "border-[#a77e37] bg-[#2d2822] text-white shadow-[0_22px_55px_rgba(45,40,34,.18)] hover:shadow-[0_28px_65px_rgba(45,40,34,.24)] lg:-translate-y-3" : "border-[#e8dfd4] bg-white text-[#29221d] shadow-[0_10px_35px_rgba(71,51,31,.05)] hover:border-[#d2b67b] hover:shadow-[0_22px_50px_rgba(71,51,31,.12)]"}`}>
                  <div aria-hidden="true" className={`pointer-events-none absolute -right-16 -top-20 -z-10 h-52 w-52 rounded-full border ${item.featured ? "border-[#d9b96f]/15" : "border-[#c59b48]/15"}`} />
                  <div aria-hidden="true" className={`pointer-events-none absolute -right-10 -top-14 -z-10 h-40 w-40 rounded-full border ${item.featured ? "border-[#d9b96f]/10" : "border-[#c59b48]/10"}`} />
                  {item.featured && <span className="mb-5 inline-flex self-start rounded-full bg-[#c59b48] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-[#29221d]">Most popular</span>}
                  {isBespoke && <span className="mb-5 inline-flex self-start items-center gap-1.5 rounded-full border border-[#b9975b]/50 bg-white/70 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-[#80602b]"><Crown className="h-3 w-3" /> Premium invitation collection</span>}
                  <div className="flex items-start justify-between gap-3"><div><p className={`text-[10px] font-semibold uppercase tracking-[.21em] ${item.featured ? "text-[#d9b96f]" : "text-[#9a6f24]"}`}>{item.eyebrow}</p><h3 className="mt-2 font-serif-luxury text-4xl">{item.name}</h3></div><span className={`flex h-12 w-12 items-center justify-center rounded-full border ${item.featured ? "border-[#d9b96f]/30 bg-white/10 text-[#e2c477]" : "border-[#c59b48]/25 bg-[#f7f0e5] text-[#a77e37]"}`}><PackageIcon className="h-5 w-5" /></span></div>
                  <p className={`mt-3 min-h-12 text-sm leading-6 ${item.featured ? "text-white/65" : "text-[#766a5e]"}`}>{item.description}</p>
                  {item.id === "essential" && <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full border border-[#c59b48]/35 bg-[#fbf6eb] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.12em] text-[#8e6b32]">One wedding</span><span className="rounded-full border border-[#c59b48]/35 bg-[#fbf6eb] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.12em] text-[#8e6b32]">{item.highlights.length} included features</span></div>}
                  {isBespoke && <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#c6aa76]/45 bg-[linear-gradient(135deg,#fffdf8,#f4ead7)] p-4"><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#876734]">Heritage Door invitation</p><p className="mt-1 max-w-[13rem] font-serif-luxury text-lg leading-snug text-[#463925]">A heritage doorway to your celebration</p></div><div aria-label="Heritage day sky, flowers, night sky and gold palette" className="flex shrink-0 -space-x-2">{["#f6d9bd", "#f2b8bd", "#1c3f8f", "#e6c58f"].map((color) => <span key={color} className="h-6 w-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />)}</div></div>}
                  {includedDesigns.length > 0 && <div className={`my-6 border-y py-4 ${item.featured ? "border-white/15" : "border-[#eee6dc]"}`}>
                    <p className={`text-[9px] font-semibold uppercase tracking-[.2em] ${item.featured ? "text-white/45" : "text-[#9c9083]"}`}>{item.id === "essential" ? "Choose one ready-made design" : isBespoke ? "Your exclusive invitation designs" : "Package sample designs"} <span className="normal-case tracking-normal">· select to preview</span></p>
                    <div className={`mt-3 grid gap-2 ${includedDesigns.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                      {includedDesigns.map((design) => (
                        <Link key={design.code} href={`/invite/${design.demoSlug}`} className={`group flex min-w-0 flex-col rounded-xl border px-3 py-3 transition ${item.featured ? "border-white/10 bg-white/[.06] text-white/85 hover:border-[#d9b96f]/60 hover:bg-white/10" : "border-[#eee6dc] bg-[#fcfaf7] text-[#574a3d] hover:border-[#c59b48]/60 hover:bg-[#f7f0e5]"}`}>
                          <span className="min-w-0"><span className={`block whitespace-normal break-words text-[11px] font-semibold leading-4 ${item.featured ? "text-white" : "text-[#3f342a]"}`}>{design.name}</span><span className={`mt-1 block line-clamp-1 text-[9px] leading-4 ${item.featured ? "text-white/55" : "text-[#968a7e]"}`}>{design.style}</span></span>
                          <span className="mt-2 flex items-center justify-between border-t border-current/10 pt-2 text-[9px] font-semibold text-[#d9b96f]">View sample <ExternalLink className="h-3 w-3" /></span>
                        </Link>
                      ))}
                    </div>
                  </div>}
                  <p className={`mb-3 text-[9px] font-semibold uppercase tracking-[.2em] ${item.featured ? "text-white/45" : "text-[#9c9083]"}`}>{includedPackage ? `Everything in ${includedPackage.name}, plus` : "Your package includes"}</p>
                  <ul className="space-y-3">{item.highlights.map((highlight) => <li key={highlight} className={`flex gap-2.5 text-xs leading-5 ${item.featured ? "text-white/80" : "text-[#51473e]"}`}><Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${item.featured ? "text-[#d9b96f]" : "text-[#9a6f24]"}`} />{highlight}</li>)}</ul>
                  <div className={`mt-auto pt-7`}><p className={`mb-3 text-[10px] leading-5 ${item.featured ? "text-white/50" : "text-[#94887c]"}`}>{item.note}</p><a href={packageLink(item.name)} target="_blank" rel="noopener noreferrer" className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs font-semibold transition ${item.featured ? "bg-[#c59b48] text-[#29221d] hover:bg-[#d7b663]" : "bg-[#29221d] text-white hover:bg-[#493b30]"}`}><MessageCircle className="h-4 w-4" /> Ask about {item.name}<ArrowRight className="h-3.5 w-3.5" /></a><p className={`mt-3 text-center text-[9px] ${item.featured ? "text-white/35" : "text-[#b0a69a]"}`}>Package pricing shared on request</p></div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-[#e9dfd2] bg-[#f4eee5]">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-3 sm:px-8 lg:px-12">
            {[{ n: "01", title: "Choose a package", text: "Pick the invitation experience that suits your celebration." }, { n: "02", title: "Select a design", text: "Choose from the existing Wedora styles included with your package." }, { n: "03", title: "Share the joy", text: "Add your details, then send your invitation link to guests." }].map((step) => <div key={step.n} className="flex gap-4"><span className="font-serif-luxury text-3xl italic text-[#b88737]">{step.n}</span><div><h3 className="text-sm font-semibold">{step.title}</h3><p className="mt-1 text-xs leading-5 text-[#766a5e]">{step.text}</p></div></div>)}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3eadb] text-[#9a6f24]"><Heart className="h-5 w-5" /></div><h2 className="mt-5 font-serif-luxury text-4xl">Still deciding?</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#766a5e]">Browse every existing invitation style, or message our team and we&apos;ll help you find a package that feels right.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/templates" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8c7ad] px-5 py-3 text-xs font-semibold text-[#574a3d] transition hover:bg-white">Browse existing designs <ArrowRight className="h-3.5 w-3.5" /></Link><a href={packageLink("Wedora packages")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#29221d] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#493b30]"><MessageCircle className="h-4 w-4" /> Talk to our team</a></div></section>
      </main>

      <Footer />
    </div>
  );
}
