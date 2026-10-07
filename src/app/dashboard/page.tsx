"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Settings,
  Users,
  LayoutDashboard,
  Heart,
  Edit,
  Link as LinkIcon,
  Copy,
  Calendar,
  MapPin,
  Clock,
  Menu,
  X,
  CreditCard,
  Eye,
  Home
} from "lucide-react";
import Footer from "@/components/Footer";

/* ─────────────────────────────────────────── */
/*  DASHBOARD PAGE                             */
/* ─────────────────────────────────────────── */
export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Data State
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSlug, setUserSlug] = useState<string>("");

  const [guests, setGuests] = useState<any[]>([]);

  const [userFirstName, setUserFirstName] = useState("User");
  const [templateName, setTemplateName] = useState("Assigned Template");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        let userId = 1; // fallback
        let userTemplateId = "";
        
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            userId = parsed.id;
            if (parsed.firstName) setUserFirstName(parsed.firstName);
            if (parsed.templateId) userTemplateId = parsed.templateId;
            else if (parsed.template_id) userTemplateId = parsed.template_id;
            
            if (parsed.inviteSlug) setUserSlug(parsed.inviteSlug);
            else if (parsed.invite_slug) setUserSlug(parsed.invite_slug); // fallback
          } catch (e) {}
        }
        
        const response = await fetch(`http://localhost:3001/api/event?userId=${userId}`);
        const json = await response.json();
        if (json.success && json.data) {
          setEventDetails(json.data);
        }

        const guestsRes = await fetch(`http://localhost:3001/api/guests?userId=${userId}`);
        const guestsJson = await guestsRes.json();
        if (guestsJson.success) {
          setGuests(guestsJson.data);
        }

        // Fetch template name
        if (userTemplateId) {
          const tplRes = await fetch(`http://localhost:3001/api/templates`);
          const tplJson = await tplRes.json();
          if (tplJson.success) {
            const template = tplJson.data.find((t: any) => t.template_id === userTemplateId);
            if (template) setTemplateName(template.name);
          }
        }

      } catch (err) {
        console.error("Failed to fetch event details", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const inviteLink = "wedora.lk/invite";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const groomFirst = eventDetails?.groom_name?.split(' ')[0] || "Groom";
  const brideFirst = eventDetails?.bride_name?.split(' ')[0] || "Bride";
  const dateFormatted = eventDetails?.wedding_date 
    ? new Date(eventDetails.wedding_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
    : "TBD";
  const timeFormatted = eventDetails?.events_schedule?.length > 0 
    ? `Starts at ${eventDetails.events_schedule[0].time}`
    : "Time TBD";

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      
      {/* ══════════════════════════════════════ */}
      {/* LOGGED-IN NAVBAR                       */}
      {/* ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(180,140,80,0.10)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C59B48]/40 shrink-0">
                <Image src="/assets/logo.svg" alt="Logo" fill className="object-cover" />
              </div>
              <div className="leading-none">
                <p className="font-serif-luxury text-[17px] font-bold text-[#28211B] tracking-tight">
                  Wedora
                </p>
                <p className="text-[9px] text-[#B88737] tracking-[0.15em] uppercase font-medium">
                  by ApexRow Solutions
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link href="/" className="px-4 py-2 text-sm font-medium rounded-lg text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4] flex items-center gap-2 transition-colors">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold rounded-lg text-[#B88737] bg-[#FBF3E4] flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link href="/dashboard/guests" className="px-4 py-2 text-sm font-medium rounded-lg text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4] flex items-center gap-2 transition-colors">
                <Users className="w-4 h-4" /> Guests & RSVP
              </Link>
              <Link href="/dashboard/settings" className="px-4 py-2 text-sm font-medium rounded-lg text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4] flex items-center gap-2 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </nav>

            {/* User Profile Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center gap-3 border-l border-[#EADBCA] pl-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#28211B]">{userFirstName}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#EADBCA] flex items-center justify-center text-[#9A6F24] font-bold font-serif-luxury text-lg uppercase">
                  {userFirstName.charAt(0) || "U"}
                </div>
                <button onClick={handleLogout} className="p-2 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Hamburger */}
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
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium rounded-xl text-[#4A3F37] hover:bg-[#FBF3E4] flex items-center gap-2">
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-sm font-semibold rounded-xl text-[#B88737] bg-[#FBF3E4] flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/dashboard/guests" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium rounded-xl text-[#4A3F37] hover:bg-[#FBF3E4] flex items-center gap-2">
                  <Users className="w-4 h-4" /> Guests & RSVP
                </Link>
                <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium rounded-xl text-[#4A3F37] hover:bg-[#FBF3E4] flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        
        {/* ══════════════════════════════════════ */}
        {/* WELCOME HEADER                         */}
        {/* ══════════════════════════════════════ */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#29221D]">
            Welcome back!
          </h1>
          <p className="text-sm text-[#7D736A] mt-1">Here is the overview of your wedding invitation.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* ══════════════════════════════════════ */}
          {/* LEFT COLUMN: Main Stats & Details      */}
          {/* ══════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            
            {/* INVITATION LINK CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl border border-[#EADBCA] p-6 sm:p-8 shadow-sm relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FBF3E4] rounded-full opacity-50 blur-3xl" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-[11px] text-[#A69B90] font-medium">
                      Setup in progress
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#29221D]">
                    {groomFirst} & {brideFirst}'s Wedding
                  </h2>
                  <p className="text-xs text-[#A69B90] mt-1">Template: {templateName}</p>
                </div>
              </div>
            </motion.div>

            {/* RSVP STATS CARDS */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            >
              {[
                { label: "Invited", value: guests.length.toString(), color: "text-[#4A3F37]", bg: "bg-[#F8F5F0]" },
                { label: "Accepted", value: guests.filter(g => g.rsvp === 'attending').length.toString(), color: "text-green-600", bg: "bg-green-50" },
                { label: "Declined", value: guests.filter(g => g.rsvp === 'declined').length.toString(), color: "text-red-500", bg: "bg-red-50" },
                { label: "Pending", value: guests.filter(g => g.rsvp === 'pending').length.toString(), color: "text-[#B88737]", bg: "bg-[#FBF3E4]" },
                { label: "Total Heads", value: guests.reduce((sum, g) => sum + (parseInt(g.headcount) || 0), 0).toString(), color: "text-[#29221D]", bg: "bg-[#F0E8DC]/50" },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} border border-black/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center`}>
                  <p className={`text-2xl sm:text-3xl font-serif-luxury font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-[#7D736A] uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* WEDDING DETAILS PREVIEW */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-3xl border border-[#EADBCA] overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#F0E8DC] px-6 py-4 bg-[#FCFAF7]">
                <h3 className="font-serif-luxury font-bold text-lg text-[#29221D]">Wedding Details</h3>
                <Link href="/dashboard/settings" className="flex items-center gap-1.5 text-xs font-semibold text-[#B88737] hover:text-[#9A6F24] transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit Details
                </Link>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FBF3E4] flex items-center justify-center text-[#B88737] shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#A69B90] font-semibold uppercase tracking-wider">The Couple</p>
                    <p className="text-sm font-medium text-[#29221D] mt-0.5">{eventDetails?.groom_name || "Groom Name"}</p>
                    <p className="text-sm font-medium text-[#29221D]">{eventDetails?.bride_name || "Bride Name"}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FBF3E4] flex items-center justify-center text-[#B88737] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#A69B90] font-semibold uppercase tracking-wider">Date & Time</p>
                    <p className="text-sm font-medium text-[#29221D] mt-0.5">{dateFormatted}</p>
                    <p className="text-sm font-medium text-[#7D736A]">{timeFormatted}</p>
                  </div>
                </div>

                <div className="flex gap-3 md:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-[#FBF3E4] flex items-center justify-center text-[#B88737] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#A69B90] font-semibold uppercase tracking-wider">Venue</p>
                    <p className="text-sm font-medium text-[#29221D] mt-0.5">{eventDetails?.venue_name || "Venue Name TBD"}</p>
                    <p className="text-sm font-medium text-[#7D736A]">{eventDetails?.venue_address || "Venue Address TBD"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ══════════════════════════════════════ */}
          {/* RIGHT COLUMN: Quick Actions & Preview  */}
          {/* ══════════════════════════════════════ */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* LIVE PREVIEW CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-3xl border border-[#EADBCA] p-6 shadow-sm flex flex-col items-center text-center"
            >
              <div className="w-full aspect-[4/5] bg-gray-50 rounded-2xl border border-[#EADBCA] shadow-inner overflow-hidden relative mb-5">
                {userSlug ? (
                  <iframe 
                    src={`/invite/${userSlug}`} 
                    className="absolute top-0 left-0 pointer-events-none" 
                    style={{ width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: 'top left', border: 'none' }}
                    title="Template Preview"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#F9EDF0] to-[#F0D6DF]">
                    <Heart className="w-6 h-6 text-[#C59B48] mb-3" />
                    <p className="font-serif-luxury text-xl font-bold text-[#C59B48]">Setup Pending</p>
                  </div>
                )}
              </div>
              
              <Link href={userSlug ? `/invite/${userSlug}` : "#"} onClick={(e) => { if (!userSlug) { e.preventDefault(); alert("Preview not available: Invite slug missing."); } }} target="_blank" className="w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]" style={{ background: "linear-gradient(90deg,#C79848,#B88737)" }}>
                <Eye className="w-4 h-4" /> Preview Invitation
              </Link>
            </motion.div>

            {/* QUICK ACTIONS */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white rounded-3xl border border-[#EADBCA] p-6 shadow-sm"
            >
              <h3 className="font-serif-luxury font-bold text-lg text-[#29221D] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/dashboard/guests" className="w-full flex items-center justify-between p-3 rounded-xl border border-[#F0E8DC] active:bg-[#FBF3E4] md:hover:border-[#C59B48] md:hover:bg-[#FBF3E4] transition-all group">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#A69B90] group-hover:text-[#B88737]" />
                    <span className="text-sm font-semibold text-[#4A3F37] group-hover:text-[#9A6F24]">Manage Guest List</span>
                  </div>
                  <span className="text-[#C59B48]">→</span>
                </Link>

                <Link href="/dashboard/settings" className="w-full flex items-center justify-between p-3 rounded-xl border border-[#F0E8DC] active:bg-[#FBF3E4] md:hover:border-[#C59B48] md:hover:bg-[#FBF3E4] transition-all group">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-[#A69B90] group-hover:text-[#B88737]" />
                    <span className="text-sm font-semibold text-[#4A3F37] group-hover:text-[#9A6F24]">Account Settings</span>
                  </div>
                  <span className="text-[#C59B48]">→</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Dummy Check icon component since we hit a small import missing earlier
function Check(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

