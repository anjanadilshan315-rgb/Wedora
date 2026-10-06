
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Settings, LogOut, Search, Plus,
  MessageCircle, Copy, Check, CheckCircle2, Menu, X, Clock, XCircle, Home, Trash2
} from "lucide-react";
import Footer from "@/components/Footer";

// Dummy data for initial state
const initialGuests = [
  { id: 1, name: "Nimal Perera", phone: "94771234567", sent: false, rsvp: "pending", headcount: 0, wish: "" },
  { id: 2, name: "Saman Kumara", phone: "94779876543", sent: true, rsvp: "attending", headcount: 4, wish: "Congratulations on your big day!" },
  { id: 3, name: "Amali Silva", phone: "94712345678", sent: true, rsvp: "declined", headcount: 0, wish: "So sorry we can't make it, wishing you both the best." },
];

export default function GuestsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guests, setGuests] = useState(initialGuests);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", phone: "+94 " });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemoveGuest = (id: number) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.phone.includes(searchQuery)
  );

  // Constants that would normally come from the backend/context
  const slug = "kamal-nadeesha";
  const rsvpDeadline = "Nov 20, 2026";
  const baseUrl = "https://wedora.lk/invite";

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.name || !newGuest.phone) return;
    
    setGuests([
      { 
        id: Date.now(), 
        name: newGuest.name, 
        phone: newGuest.phone, 
        sent: false, 
        rsvp: "pending",
        headcount: 0,
        wish: ""
      },
      ...guests
    ]);
    setNewGuest({ name: "", phone: "+94 " });
    setShowAddForm(false);
  };

  const getGuestLink = (guestName: string) => {
    return `${baseUrl}/${slug}?guest=${encodeURIComponent(guestName)}`;
  };

  const handleCopy = (id: number, guestName: string) => {
    navigator.clipboard.writeText(getGuestLink(guestName));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Normally this custom text comes from backend/context saved in Settings
  const whatsappCustomText = "You are cordially invited to our wedding!";

  const handleSendWhatsApp = (id: number, guest: typeof guests[0]) => {
    // Mark as sent in UI
    setGuests(guests.map(g => g.id === id ? { ...g, sent: true } : g));
    
    // Generate message combining fixed structure and custom text
    const link = getGuestLink(guest.name);
    const message = `Dear ${guest.name},\n\n${whatsappCustomText}\n\nPlease view your personalized invitation and RSVP before ${rsvpDeadline}.\n\nView Invitation: ${link}`;
    
    // Open WhatsApp
    const cleanPhone = guest.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      
      {/* ══════════════════════════════════════ */}
      {/* LOGGED-IN NAVBAR                       */}
      {/* ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(180,140,80,0.10)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            <Link href="/" className="flex items-center space-x-2.5 shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C59B48]/40 bg-[#FBF3E4] flex items-center justify-center shrink-0">
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

            <nav className="hidden lg:flex items-center space-x-2">
              <Link href="/" className="px-4 py-2 text-sm font-medium rounded-lg text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4] flex items-center gap-2 transition-colors">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium rounded-lg text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4] flex items-center gap-2 transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link href="/dashboard/guests" className="px-4 py-2 text-sm font-semibold rounded-lg text-[#B88737] bg-[#FBF3E4] flex items-center gap-2">
                <Users className="w-4 h-4" /> Guests & RSVP
              </Link>
              <Link href="/dashboard/settings" className="px-4 py-2 text-sm font-medium rounded-lg text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4] flex items-center gap-2 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center gap-3 border-l border-[#EADBCA] pl-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#28211B]">Sasanka P.</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#EADBCA] flex items-center justify-center text-[#9A6F24] font-bold font-serif-luxury text-lg">
                  S
                </div>
                <button onClick={handleLogout} className="p-2 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
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
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium rounded-xl text-[#4A3F37] hover:bg-[#FBF3E4] flex items-center gap-2">
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium rounded-xl text-[#4A3F37] hover:bg-[#FBF3E4] flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/dashboard/guests" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-sm font-semibold rounded-xl text-[#B88737] bg-[#FBF3E4] flex items-center gap-2">
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
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#A69B90] hover:text-[#C59B48] text-xs font-semibold uppercase tracking-wider mb-2 transition-colors">
              <Home className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#29221D]">Guest List & RSVP</h1>
            <p className="text-sm text-[#7D736A] mt-1">Manage your receivers, generate unique links, and send invitations via WhatsApp.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A69B90]" />
              <input
                type="text"
                placeholder="Search receivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-xl border border-[#E0D8CC] bg-white text-xs text-[#29221D] placeholder:text-[#A69B90] focus:outline-none focus:ring-2 focus:ring-[#C59B48]/40 focus:border-[#C59B48]"
              />
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#C79848] to-[#9A6F24] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? "Cancel" : "Add Receiver"}
            </button>
          </div>
        </div>

        {/* Add Guest Form (Admin / Client Entry) */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }} 
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl border border-[#EADBCA] p-6 shadow-sm">
                <h3 className="font-serif-luxury text-xl font-bold text-[#29221D] mb-4">Add New Receiver</h3>
                <form onSubmit={handleAddGuest} className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full space-y-1.5">
                    <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Receiver Name</label>
                    <input 
                      type="text" 
                      value={newGuest.name} 
                      onChange={(e) => setNewGuest({...newGuest, name: e.target.value})} 
                      placeholder="e.g. Nimal Perera" 
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" 
                    />
                  </div>
                  <div className="w-full space-y-1.5">
                    <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={newGuest.phone} 
                      onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})} 
                      placeholder="e.g. 94771234567" 
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" 
                    />
                  </div>
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-[#29221D] text-white rounded-xl text-sm font-semibold whitespace-nowrap hover:bg-[#4A3F37] transition-colors">
                    Add to List
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest List Table */}
        <div className="bg-white rounded-3xl border border-[#EADBCA] shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCFAF7] border-b border-[#F0E8DC]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#7D736A] uppercase tracking-wider text-center w-12">#</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#7D736A] uppercase tracking-wider">Receiver Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#7D736A] uppercase tracking-wider">WhatsApp Number</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#7D736A] uppercase tracking-wider text-center">RSVP Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#7D736A] uppercase tracking-wider text-center">Headcount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#7D736A] uppercase tracking-wider text-center">Sent Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#7D736A] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {filteredGuests.map((guest, index) => (
                  <tr key={guest.id} className="hover:bg-[#FCFAF7]/50 transition-colors">
                    <td className="px-6 py-4 text-center font-medium text-[#A69B90]">{index + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#29221D]">{guest.name}</p>
                      {guest.wish && <p className="text-[11px] text-[#A69B90] mt-1 italic">"{guest.wish}"</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#7D736A]">{guest.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {guest.rsvp === "attending" && <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5"/> Attending</span>}
                      {guest.rsvp === "declined" && <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5"/> Declined</span>}
                      {guest.rsvp === "pending" && <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#9A6F24] bg-[#FBF3E4] px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5"/> Pending</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="font-bold text-[#29221D]">{guest.headcount > 0 ? guest.headcount : "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {guest.sent ? (
                        <div className="flex items-center justify-center gap-1.5 text-green-600 font-medium text-xs">
                          <Check className="w-4 h-4" /> Sent
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-[#A69B90] font-medium text-xs">
                          Not Sent
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleCopy(guest.id, guest.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EADBCA] text-xs font-semibold text-[#7D736A] hover:bg-[#F8F5F0] transition-colors"
                        >
                          {copiedId === guest.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === guest.id ? "Copied" : "Link"}
                        </button>
                        <button 
                          onClick={() => handleSendWhatsApp(guest.id, guest)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-[1.02] ${guest.sent ? 'bg-[#25D366]/80' : 'bg-[#25D366]'}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> 
                          {guest.sent ? "Send Again" : "Send"}
                        </button>
                        <button 
                          onClick={() => handleRemoveGuest(guest.id)}
                          className="p-1.5 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1" 
                          title="Remove Receiver"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredGuests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#7D736A]">
                      No receivers found. Try a different search or add a new receiver.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-[#F0E8DC]">
            {filteredGuests.map((guest, index) => (
              <div key={guest.id} className="p-4 bg-[#FCFAF7] flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-[#A69B90] mt-0.5">#{index + 1}</span>
                    <div>
                      <h3 className="font-bold text-[#29221D] text-base leading-none">{guest.name}</h3>
                      <p className="text-xs text-[#7D736A] mt-1">{guest.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleRemoveGuest(guest.id)}
                      className="p-2 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Remove Receiver"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleSendWhatsApp(guest.id, guest)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98] ${guest.sent ? 'bg-[#25D366]/80' : 'bg-[#25D366]'}`}
                    >
                      <MessageCircle className="w-4 h-4" /> 
                      {guest.sent ? "Resend" : "WhatsApp"}
                    </button>
                  </div>
                </div>

                {guest.wish && (
                  <div className="bg-white p-2.5 rounded-lg border border-[#F0E8DC]">
                    <p className="text-xs text-[#7D736A] italic">"{guest.wish}"</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {guest.rsvp === "attending" && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3"/> Attending ({guest.headcount})</span>}
                    {guest.rsvp === "declined" && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-full"><XCircle className="w-3 h-3"/> Declined</span>}
                    {guest.rsvp === "pending" && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9A6F24] bg-[#FBF3E4] px-2 py-0.5 rounded-full"><Clock className="w-3 h-3"/> Pending</span>}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-[#A69B90] uppercase">
                      {guest.sent ? <span className="text-green-600 flex items-center gap-1"><Check className="w-3 h-3"/> Sent</span> : "Not Sent"}
                    </span>
                    <button 
                      onClick={() => handleCopy(guest.id, guest.name)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#EADBCA] bg-white text-xs font-semibold text-[#7D736A] active:bg-[#F8F5F0]"
                    >
                      {copiedId === guest.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === guest.id ? "Copied" : "Link"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {guests.length === 0 && (
              <div className="p-8 text-center text-sm text-[#7D736A]">
                No receivers added yet. Click "Add Receiver" above.
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
