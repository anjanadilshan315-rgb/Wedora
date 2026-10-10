"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut, Menu, Sparkles, User, X } from "lucide-react";
import { logout } from "@/lib/api";
import { useSession } from "@/lib/use-session";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export type NavLabel = (typeof NAV_LINKS)[number]["label"];

interface SiteHeaderProps {
  active?: NavLabel;
  /** Home page uses a fixed header that gains a shadow on scroll. */
  fixed?: boolean;
}

export default function SiteHeader({ active, fixed = false }: SiteHeaderProps) {
  const { session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!fixed) return;
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [fixed]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const firstName = session?.user.firstName ?? "";

  return (
    <header
      className={`${fixed ? "fixed top-0 left-0 right-0" : "sticky top-0"} z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        !fixed || scrolled ? "shadow-[0_2px_20px_rgba(180,140,80,0.10)]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">
          <Link href="/" className="flex items-center space-x-2.5 shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C59B48]/40">
              <Image src="/assets/logo.svg" alt="Wedora Logo" fill className="object-cover" />
            </div>
            <div className="leading-none">
              <p className="font-serif-luxury text-[17px] font-bold text-[#28211B] tracking-tight">Wedora</p>
              <p className="text-[9px] text-[#B88737] tracking-[0.15em] uppercase font-medium">by ApexRow Solutions</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  link.label === active ? "text-[#B88737] bg-[#FBF3E4]" : "text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center gap-3 border-l border-[#EADBCA] pl-4">
                  <p className="text-sm font-semibold text-[#28211B]">{firstName}</p>
                  <div className="w-9 h-9 rounded-full bg-[#EADBCA] flex items-center justify-center text-[#9A6F24] font-bold font-serif-luxury text-lg uppercase">
                    {firstName.charAt(0) || "U"}
                  </div>
                  <button onClick={handleLogout} className="p-2 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-[0_4px_14px_rgba(180,135,65,0.3)] transition-all hover:shadow-[0_6px_20px_rgba(180,135,65,0.4)]"
                  style={{ background: "linear-gradient(90deg,#C79848,#A87428)" }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#4A3F37]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    link.label === active ? "text-[#B88737] bg-[#FBF3E4]" : "text-[#4A3F37] hover:bg-[#FBF3E4]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" /> Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm flex items-center justify-center"
                      style={{ background: "linear-gradient(90deg,#C79848,#A87428)" }}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
