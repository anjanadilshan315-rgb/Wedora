"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, User } from "lucide-react";

/** Split-screen artwork layout shared by the login and registration pages. */
export default function AuthShell({ badge, children }: { badge: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen lg:h-screen w-full overflow-x-hidden lg:overflow-hidden bg-[#FAF7F2] flex flex-col lg:flex-row">
      {/* LEFT — artwork (desktop) */}
      <div className="hidden lg:flex relative w-[44%] h-full flex-col items-center justify-center overflow-hidden">
        <Image src="/assets/bg-artwork.png" alt="Wedding Ambient Background" fill priority className="object-cover object-left" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FAF7F2] to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-10"
        >
          <Link href="/" aria-label="Wedora home">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative w-52 h-52 xl:w-64 xl:h-64 mb-5 rounded-full p-[3px] shadow-[0_12px_35px_rgba(180,135,65,0.35)]"
              style={{ background: "linear-gradient(135deg, #ECC880 0%, #FDF4D8 30%, #C99B4B 60%, #9B6F23 100%)" }}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FBF8F4] border-[2px] border-[#FFF8E7]">
                <Image src="/assets/logo.svg" alt="Wedora Logo" fill priority className="object-cover scale-105" />
              </div>
            </motion.div>
          </Link>

          <div className="space-y-1">
            <h2 className="font-serif-luxury text-[28px] xl:text-[33px] font-semibold text-[#28211B] tracking-wide">Your Special Moments,</h2>
            <p className="font-script-romantic text-[40px] xl:text-[48px] text-[#B88737] leading-none pt-1">Our Invitation</p>
          </div>
          <p className="mt-4 text-xs text-[#5D534A] leading-relaxed max-w-[300px]">
            Create beautiful wedding invitations, share with your loved ones and celebrate together.
          </p>
        </motion.div>
      </div>

      {/* Golden curved divider (desktop) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-20">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="goldLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DFBB73" />
              <stop offset="20%" stopColor="#FBF0CC" />
              <stop offset="50%" stopColor="#C89A48" />
              <stop offset="75%" stopColor="#E9C985" />
              <stop offset="100%" stopColor="#966D23" />
            </linearGradient>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path d="M 430 0 Q 490 500 425 1000" fill="none" stroke="url(#goldLine)" strokeWidth="3.5" filter="url(#glow)" />
        </svg>
      </div>

      {/* Mobile header strip */}
      <div className="flex lg:hidden relative w-full shrink-0 overflow-hidden" style={{ height: "38vw", maxHeight: "180px" }}>
        <Image src="/assets/bg-artwork.png" alt="Wedding Background" fill priority className="object-cover object-left-bottom" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
        <Link href="/" className="absolute inset-0 flex items-center justify-center" aria-label="Wedora home">
          <div
            className="relative w-20 h-20 rounded-full p-[2px] shadow-lg"
            style={{ background: "linear-gradient(135deg, #ECC880 0%, #FDF4D8 30%, #C99B4B 60%, #9B6F23 100%)" }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden border-[2px] border-[#FFF8E7]">
              <Image src="/assets/logo.svg" alt="Logo" fill className="object-cover scale-105" />
            </div>
          </div>
        </Link>
      </div>

      <div className="flex lg:hidden flex-col items-center text-center px-4 pb-2 shrink-0">
        <h2 className="font-serif-luxury text-xl font-semibold text-[#28211B]">Your Special Moments,</h2>
        <p className="font-script-romantic text-3xl text-[#B88737] leading-tight">Our Invitation</p>
      </div>

      {/* RIGHT — form card */}
      <div className="relative flex-1 lg:h-full flex flex-col z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-28 sm:w-40 lg:w-52 pointer-events-none z-0 select-none">
          <Image src="/assets/branch-corner.png" alt="" width={220} height={220} className="w-full h-auto object-contain translate-x-2 -translate-y-1" />
        </div>
        <div className="absolute bottom-0 right-0 w-36 sm:w-52 lg:w-64 pointer-events-none z-0 select-none">
          <Image src="/assets/flower-corner.png" alt="" width={280} height={280} className="w-full h-auto object-contain translate-x-2 translate-y-2" />
        </div>

        <div className="relative z-10 flex justify-end px-4 pt-3 lg:px-8 lg:pt-5 shrink-0">
          <div className="flex items-center space-x-2 text-xs font-medium text-[#8F6626]">
            <span className="w-6 h-6 rounded-full bg-[#F3E5CD] flex items-center justify-center text-[#B88737] shadow-sm">
              <User className="w-3.5 h-3.5" />
            </span>
            <span className="tracking-wide">{badge}</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-4 lg:px-10 lg:overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            className="w-full max-w-[440px] bg-white/95 backdrop-blur-md rounded-[26px] border border-[#EADBCA] px-7 py-6 lg:px-9 lg:py-8 shadow-[0_18px_50px_rgba(180,140,80,0.13)] my-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C59B48]" />
              <Heart className="w-3 h-3 fill-[#C59B48] text-[#C59B48]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C59B48]" />
            </div>
            {children}
            <div className="flex items-center justify-center space-x-3 mt-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C59B48]" />
              <Heart className="w-3 h-3 fill-[#C59B48] text-[#C59B48]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C59B48]" />
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-center py-2 shrink-0">
          <p className="text-[10px] text-[#A69B90]">© {new Date().getFullYear()} Wedding Invitation Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  "w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#2C231E] placeholder:text-[#A89E94] focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50 focus:border-[#C59B48] transition-all";

export const authLabelClass = "flex items-center space-x-1.5 text-xs font-semibold text-[#483E36] tracking-wide";
