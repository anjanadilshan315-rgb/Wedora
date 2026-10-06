"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#181818] text-white overflow-hidden pt-20 font-sans mt-auto">
      
      {/* Top Decorative Border */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center opacity-70 mt-8">
        <div className="h-[1px] w-full max-w-[40%] bg-gradient-to-r from-transparent to-[#C59B48]"></div>
        <div className="w-2.5 h-2.5 bg-[#C59B48] rotate-45 mx-2 shadow-[0_0_8px_rgba(197,155,72,0.6)]"></div>
        <div className="h-[1px] w-full max-w-[40%] bg-gradient-to-l from-transparent to-[#C59B48]"></div>
      </div>

      {/* Geometric Mountain Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 flex items-end">
        <svg
          className="w-full h-[80%] min-h-[300px]"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <polygon points="0,100 0,60 25,30 50,70 80,20 100,40 100,100" fill="#C59B48" />
          <polygon points="0,100 15,40 40,80 75,10 100,50 100,100" fill="#C59B48" />
          <polygon points="0,100 35,50 65,90 90,30 100,40 100,100" fill="#C59B48" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Logo and About */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              {/* Abstract Green Triangles Logo */}
              <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 65 L40 25 L50 45 Z" fill="#2ECA8B" />
                <path d="M40 65 L65 25 L75 45 Z" fill="#2ECA8B" />
                <path d="M65 65 L90 25 L100 45 Z" fill="#2ECA8B" />
              </svg>
              <div>
                <p className="font-bold text-2xl tracking-tight leading-none text-white">ApexRow</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold mt-1">
                  Solutions
                </p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
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
            <h3 className="text-white font-semibold flex items-center gap-3 mb-6 text-sm">
              Contact us <span className="w-6 h-[1.5px] bg-[#C59B48]"></span>
            </h3>
            <div className="space-y-5">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C59B48] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-[#181818] fill-current" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">WhatsApp</p>
                  <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer" className="text-[#C59B48] text-xs transition-colors hover:underline">
                    +94 77 123 4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-[#C59B48]/40 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-[#C59B48]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Instagram</p>
                  <a href="https://instagram.com/apexrowsolutions" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C59B48] text-xs transition-colors">
                    @apexrowsolutions
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-[#C59B48]/40 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-[#C59B48]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Facebook</p>
                  <a href="https://facebook.com/apexrowsolutions" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C59B48] text-xs transition-colors">
                    ApexRow Solutions
                  </a>
                </div>
              </div>

              {/* TikTok Custom SVG */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-[#C59B48]/40 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-[#C59B48]" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.25-.97 4.41-2.5 6.01-1.63 1.66-4.04 2.51-6.38 2.14-2.81-.42-5.32-2.39-6.44-4.99-1.1-2.61-.64-5.75 1.14-7.91 1.76-2.11 4.54-3.13 7.21-2.86v4.06c-1.16-.1-2.34.12-3.34.72-.94.57-1.65 1.5-1.89 2.58-.2 1.01-.02 2.1.51 2.97.55.93 1.57 1.56 2.66 1.72 1.57.25 3.23-.42 4.16-1.74.8-1.12 1.09-2.57 1.04-3.95-.09-5.11-.05-10.23-.05-15.35h-.03z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">TikTok</p>
                  <a href="https://tiktok.com/@apexrowsolutions" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C59B48] text-xs transition-colors">
                    @apexrowsolutions
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-gray-800 bg-[#121212] py-4">
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
