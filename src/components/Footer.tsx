"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, Camera, MessageCircle, Music2, UsersRound } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative mt-auto overflow-hidden bg-[#111916] bg-cover bg-center pt-20 font-sans text-white"
      style={{ backgroundImage: "url('/assets/footer-mountain-background.svg')" }}
    >
      
      {/* Top Decorative Border */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center opacity-70 mt-8">
        <div className="h-[1px] w-full max-w-[40%] bg-gradient-to-r from-transparent to-[#C59B48]"></div>
        <div className="w-2.5 h-2.5 bg-[#C59B48] rotate-45 mx-2 shadow-[0_0_8px_rgba(197,155,72,0.6)]"></div>
        <div className="h-[1px] w-full max-w-[40%] bg-gradient-to-l from-transparent to-[#C59B48]"></div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#101816]/10 to-[#101816]/55" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Logo and About */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" aria-label="ApexRow Solutions home" className="mb-5 inline-flex rounded-xl transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2BC68B]">
              <Image
                src="/assets/apexrow-solutions.svg"
                alt="ApexRow Solutions"
                width={260}
                height={250}
                priority={false}
                className="h-auto w-[190px] sm:w-[220px]"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-300">
              Beautiful digital wedding invitations, designed and delivered for your special day.
            </p>
          </div>

          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-3"></div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-3 mb-6 text-sm">
              Quick links <span className="w-6 h-[1.5px] bg-[#C59B48]"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/templates" className="text-gray-400 hover:text-white transition-colors text-sm">Invitation designs</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#C59B48]">We are here to help</p>
              <h3 className="mt-2 font-serif-luxury text-2xl text-white">Let&apos;s talk</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4 shadow-[0_20px_50px_-35px_rgba(0,0,0,.8)] backdrop-blur-md sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2BC68B]/15 text-[#55D9A4]">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">WhatsApp support</p>
                  <p className="mt-0.5 text-xs text-gray-400">Let&apos;s plan something beautiful</p>
                </div>
              </div>
              <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-between rounded-xl bg-[#2BC68B] px-4 py-3 text-sm font-semibold text-[#102019] transition-colors hover:bg-[#55D9A4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <span>+94 77 123 4567</span><ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <a aria-label="Instagram: @apexrowsolutions" href="https://instagram.com/apexrowsolutions" target="_blank" rel="noopener noreferrer" className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0C1210]/55 px-2 py-3 text-gray-300 transition-all hover:border-[#C59B48]/60 hover:bg-white/[.08] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B48]">
                <Camera className="h-5 w-5 text-[#D7B96E] transition-transform group-hover:-translate-y-0.5" /><span className="text-[10px] font-medium">Instagram</span>
              </a>
              <a aria-label="Facebook: ApexRow Solutions" href="https://facebook.com/apexrowsolutions" target="_blank" rel="noopener noreferrer" className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0C1210]/55 px-2 py-3 text-gray-300 transition-all hover:border-[#C59B48]/60 hover:bg-white/[.08] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B48]">
                <UsersRound className="h-5 w-5 text-[#D7B96E] transition-transform group-hover:-translate-y-0.5" /><span className="text-[10px] font-medium">Facebook</span>
              </a>
              <a aria-label="TikTok: @apexrowsolutions" href="https://tiktok.com/@apexrowsolutions" target="_blank" rel="noopener noreferrer" className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0C1210]/55 px-2 py-3 text-gray-300 transition-all hover:border-[#C59B48]/60 hover:bg-white/[.08] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B48]">
                <Music2 className="h-5 w-5 text-[#D7B96E] transition-transform group-hover:-translate-y-0.5" /><span className="text-[10px] font-medium">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 bg-[#0C1210]/75 py-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} ApexRow Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-[#C59B48] text-xs transition-colors">Privacy policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-[#C59B48] text-xs transition-colors">Terms of service</Link>
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C59B48]/50 text-[#C59B48] hover:bg-[#C59B48]/10 text-xs transition-all ml-2"
            >
              Back to top <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
