"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Menu, X, Heart, Sparkles, Gem, ShieldCheck } from "lucide-react";

const navLinks = ["Home", "Templates", "About", "Contact"];

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      {/* ══════════════════════════════════════ */}
      {/* NAVBAR                                 */}
      {/* ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(180,140,80,0.10)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            <Link href="/" className="flex items-center space-x-2.5 shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C59B48]/40">
                <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover" />
              </div>
              <div className="leading-none">
                <p className="font-serif-luxury text-[17px] font-bold text-[#28211B] tracking-tight">Open Invitation</p>
                <p className="text-[9px] text-[#B88737] tracking-[0.15em] uppercase font-medium">by ApexRow Solutions</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link}
                  href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    link === "About"
                      ? "text-[#B88737] bg-[#FBF3E4]"
                      : "text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4]"
                  }`}
                >
                  {link}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center">
              <Link href="/login">
                <button className="flex items-center space-x-1.5 px-5 py-2 rounded-full border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] transition-colors">
                  <User className="w-3.5 h-3.5" /><span>Login</span>
                </button>
              </Link>
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
                      link === "About" ? "text-[#B88737] bg-[#FBF3E4]" : "text-[#4A3F37] hover:bg-[#FBF3E4]"
                    }`}
                  >
                    {link}
                  </Link>
                ))}
                <div className="pt-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold">
                      Login
                    </button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════════════════════════════════════ */}
      {/* PAGE HEADER                            */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C59B48]" />
            <Heart className="w-4 h-4 fill-[#C59B48] text-[#C59B48]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C59B48]" />
          </div>
          <h2 className="font-script-romantic text-3xl sm:text-4xl text-[#C59B48] mb-2">Our Story</h2>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#29221D] mb-4">
            About Open Invitation
          </h1>
          <p className="text-sm sm:text-base text-[#7D736A] max-w-xl mx-auto leading-relaxed">
            We believe that your special day deserves an introduction that is just as memorable. 
            Open Invitation is dedicated to providing couples with stunning, personalised digital invitations.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* CONTENT                                */}
      {/* ══════════════════════════════════════ */}
      <section className="flex-1 max-w-5xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        
        {/* Mission Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-[#F0E8DC] p-8 sm:p-12 mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 opacity-5 pointer-events-none">
            <Image src="/assets/branch-corner.png" alt="" width={256} height={256} className="w-full h-auto object-cover" />
          </div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#29221D] mb-4">Crafting Beautiful Digital Experiences</h3>
              <p className="text-sm text-[#7D736A] leading-relaxed mb-4">
                Founded by ApexRow Solutions, Open Invitation was born from a desire to modernize how we share our most precious life events. Traditional paper invitations are beautiful, but they often lack the convenience, speed, and interactivity that today's couples need.
              </p>
              <p className="text-sm text-[#7D736A] leading-relaxed">
                We combine luxurious designs with cutting-edge web technology to give you a personalized website link for every guest, complete with automated RSVP tracking, location mapping, and easy WhatsApp integration.
              </p>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-[#FBF3E4]">
              <Image src="/assets/hero-1.jpg" alt="Wedding Couple" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <h3 className="font-serif-luxury text-center text-3xl font-bold text-[#29221D] mb-8">Why Choose Us?</h3>
        
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-[#FBF8F4] rounded-2xl p-6 text-center border border-[#F0E8DC] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center mb-4 text-[#C59B48] shadow-sm">
              <Gem className="w-6 h-6" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#29221D] mb-2">Premium Designs</h4>
            <p className="text-xs text-[#7D736A] leading-relaxed">
              Curated by professional designers, our templates radiate elegance and luxury, ensuring a perfect match for your wedding theme.
            </p>
          </div>

          <div className="bg-[#FBF8F4] rounded-2xl p-6 text-center border border-[#F0E8DC] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center mb-4 text-[#C59B48] shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#29221D] mb-2">Fully Personalized</h4>
            <p className="text-xs text-[#7D736A] leading-relaxed">
              Every guest gets a unique invitation link with their own name, providing that special personal touch of a physical card.
            </p>
          </div>

          <div className="bg-[#FBF8F4] rounded-2xl p-6 text-center border border-[#F0E8DC] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center mb-4 text-[#C59B48] shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#29221D] mb-2">Stress-Free RSVP</h4>
            <p className="text-xs text-[#7D736A] leading-relaxed">
              Track who's coming and total headcounts instantly from your own dashboard. Let us handle the complicated logistics.
            </p>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════ */}
      {/* FOOTER                                 */}
      {/* ══════════════════════════════════════ */}
      <footer className="bg-white border-t border-[#EDE3D6] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A69B90]">
          <p>© {new Date().getFullYear()} Open Invitation. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Designed with</span>
            <Heart className="w-3 h-3 text-[#C59B48] fill-[#C59B48]" />
            <span>by</span>
            <a href="#" className="font-semibold text-[#8F6626] hover:underline">ApexRow Solutions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
