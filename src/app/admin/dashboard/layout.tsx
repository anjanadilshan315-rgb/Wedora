"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus, Users, LogOut, Settings } from "lucide-react";
import Image from "next/image";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "User Registration", href: "/admin/dashboard/registration", icon: UserPlus },
    { name: "User Management", href: "/admin/dashboard/users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#EADBCA] shadow-sm flex flex-col fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-[#EADBCA]">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#C59B48]/40">
              <Image src="/assets/logo.svg" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-serif-luxury font-bold text-lg text-[#28211B]">Wedora Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            // Fix active state logic
            const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/admin/dashboard");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#FBF3E4] text-[#B88737] shadow-sm"
                    : "text-[#7D736A] hover:bg-gray-50 hover:text-[#4A3F37]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#EADBCA]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
