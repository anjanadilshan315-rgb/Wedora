"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, LayoutDashboard, LayoutTemplate, LogOut, Menu, Settings, X } from "lucide-react";
import Footer from "@/components/Footer";
import { Spinner } from "@/components/dashboard/ui";
import { logout } from "@/lib/api";
import { useSession } from "@/lib/use-session";

const NAV = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: false },
  { href: "/templates", label: "New Invitation", icon: LayoutTemplate, exact: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: true },
];

/** Every /dashboard page requires a logged-in customer. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, ready } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (ready && !session && !loggingOut) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, session, loggingOut, router, pathname]);

  if (!ready || !session) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <Spinner />
      </div>
    );
  }

  // The preview page renders the invitation full screen.
  if (pathname.endsWith("/preview")) return <>{children}</>;

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || (pathname.startsWith(`${item.href}/`) && !pathname.startsWith("/dashboard/settings"));

  const handleLogout = async () => {
    setLoggingOut(true);
    router.replace("/");
    await logout();
  };

  const firstName = session.user.firstName;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(180,140,80,0.10)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            <Link href="/" className="flex items-center space-x-2.5 shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C59B48]/40 shrink-0">
                <Image src="/assets/logo.svg" alt="Logo" fill className="object-cover" />
              </div>
              <div className="leading-none">
                <p className="font-serif-luxury text-[17px] font-bold text-[#28211B] tracking-tight">Wedora</p>
                <p className="text-[9px] text-[#B88737] tracking-[0.15em] uppercase font-medium">by ApexRow Solutions</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                    isActive(item) ? "font-semibold text-[#B88737] bg-[#FBF3E4]" : "font-medium text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4]"
                  }`}
                >
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3 border-l border-[#EADBCA] pl-4">
              <p className="text-sm font-semibold text-[#28211B]">{firstName}</p>
              <div className="w-9 h-9 rounded-full bg-[#EADBCA] flex items-center justify-center text-[#9A6F24] font-bold font-serif-luxury text-lg uppercase">
                {firstName.charAt(0) || "U"}
              </div>
              <button onClick={handleLogout} className="p-2 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#4A3F37]" aria-label="Toggle menu">
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
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 text-sm rounded-xl flex items-center gap-2 ${
                      isActive(item) ? "font-semibold text-[#B88737] bg-[#FBF3E4]" : "font-medium text-[#4A3F37] hover:bg-[#FBF3E4]"
                    }`}
                  >
                    <item.icon className="w-4 h-4" /> {item.label}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-[#F0E8DC]">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">{children}</main>
      <Footer />
    </div>
  );
}
