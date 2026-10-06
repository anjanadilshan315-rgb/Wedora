 "use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, User, Menu, X, SlidersHorizontal, MessageCircle, LayoutDashboard, LogOut } from "lucide-react";
import Footer from "@/components/Footer";

/* ─────────────────────────────────────────── */
/*  ADMIN WHATSAPP NUMBER                      */
/*  Update this to your real WhatsApp number   */
/* ─────────────────────────────────────────── */
const ADMIN_WHATSAPP = "+94757115645"; // e.g. "94771234567"

function buildWhatsAppLink(templateName: string) {
  const msg = encodeURIComponent(
    `Hi! I visited Wedora and I'm interested in the "${templateName}" template. Could you please provide more details?`
  );
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`;
}

/* ─────────────────────────────────────────── */
/*  NAV LINKS (Packages removed)               */
/* ─────────────────────────────────────────── */
const navLinks = ["Home", "Templates", "About", "Contact"];

/* ─────────────────────────────────────────── */
/*  FILTER TABS                                */
/* ─────────────────────────────────────────── */
/* ─────────────────────────────────────────── */
/*  TEMPLATE DATA                              */
/* ─────────────────────────────────────────── */
const templates = [
  { 
    id: 1,  
    name: "Classic Elegance",  
    style: "Platinum Mode",  
    gradient: "from-[#FBF3E4] to-[#EDE0CC]",           
    accent: "#C59B48",
    previewUrl: "/invite/demo-template"
  },
  { 
    id: 2,  
    name: "Royal Kandyan",  
    style: "Traditional & Gold",  
    gradient: "from-[#FDFBF7] to-[#EBE5DA]",           
    accent: "#A67C00",
    previewUrl: "/invite/demo-kandyan"
  }
];

/* ═══════════════════════════════════════════ */
/*  TEMPLATES CONTENT                          */
/* ═══════════════════════════════════════════ */
function TemplatesContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setIsLoggedIn(true);
    }
  }, []);

  const filtered = templates.filter((t) => {
    return t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           t.style.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">

      {/* ══════════════════════════════════════ */}
      {/* NAVBAR                                 */}
      {/* ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(180,140,80,0.10)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">

            <Link href="/" className="flex items-center space-x-2.5 shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C59B48]/40">
                <Image src="/assets/logo.svg" alt="Logo" fill className="object-cover" />
              </div>
              <div className="leading-none">
                <p className="font-serif-luxury text-[17px] font-bold text-[#28211B] tracking-tight">Wedora</p>
                <p className="text-[9px] text-[#B88737] tracking-[0.15em] uppercase font-medium">by ApexRow Solutions</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link}
                  href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    link === "Templates"
                      ? "text-[#B88737] bg-[#FBF3E4]"
                      : "text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4]"
                  }`}
                >
                  {link}
                </Link>
              ))}
            </nav>

            {/* Login / Dashboard */}
            <div className="hidden lg:flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] transition-colors">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </button>
                  </Link>
                  <div className="flex items-center gap-3 border-l border-[#EADBCA] pl-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#28211B]">Sasanka P.</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#EADBCA] flex items-center justify-center text-[#9A6F24] font-bold font-serif-luxury text-lg">
                      S
                    </div>
                    <button onClick={() => { localStorage.removeItem("user"); window.location.reload(); }} className="p-2 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1" title="Logout">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <button className="flex items-center space-x-1.5 px-5 py-2 rounded-full border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] transition-colors">
                    <User className="w-3.5 h-3.5" /><span>Login</span>
                  </button>
                </Link>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#4A3F37]">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white border-t border-[#F0E8DC] px-4 pb-4"
            >
              <nav className="flex flex-col space-y-1 pt-3">
                {navLinks.map((link, i) => (
                  <Link
                    key={link}
                    href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                      link === "Templates" ? "text-[#B88737] bg-[#FBF3E4]" : "text-[#4A3F37] hover:bg-[#FBF3E4]"
                    }`}
                  >
                    {link}
                  </Link>
                ))}
                <div className="flex gap-2 pt-2">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" className="flex-1">
                        <button className="w-full py-2.5 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold flex items-center justify-center gap-2">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </button>
                      </Link>
                      <button 
                        onClick={() => { localStorage.removeItem("user"); window.location.reload(); }}
                        className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="flex-1">
                      <button className="w-full py-2.5 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold flex items-center justify-center gap-2">
                        <User className="w-4 h-4" /> Login
                      </button>
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════════════════════════════════════ */}
      {/* PAGE HEADER                            */}
      {/* ══════════════════════════════════════ */}
      <section className="py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col items-center justify-center mb-6">
            <Link href="/" className="inline-flex items-center gap-1 text-[#A69B90] hover:text-[#C59B48] text-xs font-semibold uppercase tracking-wider transition-colors">
              <Heart className="w-3.5 h-3.5 opacity-50" /> Back to Home
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-3 mb-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C59B48]" />
            <Heart className="w-3.5 h-3.5 fill-[#C59B48] text-[#C59B48]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C59B48]" />
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#29221D] mb-3">
            Invitation Templates
          </h1>
          <p className="text-sm text-[#7D736A] max-w-md mx-auto">
            Browse our curated collection. Explore live previews and contact us on WhatsApp to set up your perfect invitation.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* FILTERS BAR                            */}
      {/* ══════════════════════════════════════ */}
      <section className="sticky top-[70px] z-40 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#EDE3D6] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-3">
          <div className="relative w-full sm:w-56 ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A69B90]" />
            <input
              type="text"
              placeholder="Search templates…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-full border border-[#E0D8CC] bg-white text-xs text-[#29221D] placeholder:text-[#A69B90] focus:outline-none focus:ring-2 focus:ring-[#C59B48]/40 focus:border-[#C59B48]"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* TEMPLATES GRID                         */}
      {/* ══════════════════════════════════════ */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#7D736A]">
            Showing <span className="font-semibold text-[#29221D]">{filtered.length}</span> template{filtered.length !== 1 ? "s" : ""}
          </p>
          {/* WhatsApp general enquiry */}
          <a
            href={buildWhatsAppLink("a template")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#B88737] hover:text-[#9A6F24] transition-colors hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Chat with us
          </a>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={searchQuery}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filtered.map((tpl, i) => (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="group relative rounded-3xl overflow-hidden bg-white shadow-sm border border-[#EADBCA] transition-all flex flex-col hover:shadow-md"
                >
                  {/* Template visual */}
                  <div className={`relative aspect-[4/3] sm:aspect-square md:aspect-[4/5] bg-gradient-to-br ${tpl.gradient} flex-shrink-0 border-b border-[#F0E8DC]`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-14 h-14 rounded-full border-[3px] flex items-center justify-center mb-3 bg-white/40 backdrop-blur-sm" style={{ borderColor: tpl.accent }}>
                        <Heart className="w-6 h-6" style={{ fill: tpl.accent, color: tpl.accent }} />
                      </div>
                      <p className="text-xl font-serif-luxury font-bold" style={{ color: tpl.accent }}>{tpl.name}</p>
                      <p className="text-xs mt-1 font-semibold opacity-70 tracking-widest uppercase" style={{ color: tpl.accent }}>{tpl.style}</p>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-5 flex flex-col gap-3 bg-white">
                    <Link href={tpl.previewUrl} target="_blank">
                      <button className="flex items-center justify-center w-full py-3 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] active:bg-[#F0E8DC] transition-colors">
                        View Live Preview
                      </button>
                    </Link>

                    {/* WhatsApp CTA button */}
                    <a
                      href={buildWhatsAppLink(tpl.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold shadow-sm md:hover:shadow-md transition-all active:scale-[0.98] md:hover:scale-[1.02]"
                      style={{ background: "linear-gradient(90deg,#C79848,#9A6F24)" }}
                    >
                      <MessageCircle className="w-4 h-4" /> Get This Template
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <Heart className="w-10 h-10 mx-auto mb-4 text-[#E0D8CC]" />
              <p className="text-[#9E9E9E] font-medium">No templates found</p>
              <p className="text-xs text-[#C0B8B0] mt-1">Try a different filter or search term</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <p className="font-serif-luxury text-2xl text-[#C59B48] animate-pulse">Loading templates...</p>
      </div>
    }>
      <TemplatesContent />
    </Suspense>
  );
}

