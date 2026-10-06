"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Heart, Calendar, MapPin, Save, Phone,
  Camera, Clock, Plus, Trash2, ImageIcon, ImagePlus, MessageCircle, Lock
} from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });

  // Form State
  const [form, setForm] = useState({
    brideName: "Nadeesha Silva",
    groomName: "Kamal Perera",
    bridePhone: "077 111 2222",
    groomPhone: "077 333 4444",
    date: "2026-12-12",
    rsvpDeadline: "2026-11-20",
    venueName: "Shangri-La Hotel",
    venueLocation: "1 Galle Face, Colombo",
    whatsappCustomText: "You are cordially invited to our wedding!",
  });

  // Dynamic Events
  const [events, setEvents] = useState([
    { id: 1, name: "Poruwa Ceremony", time: "09:00" },
    { id: 2, name: "Reception", time: "12:30" },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddEvent = () => {
    setEvents([...events, { id: Date.now(), name: "", time: "" }]);
  };

  const handleRemoveEvent = (id: number) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const handleEventChange = (id: number, field: "name" | "time", value: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, [field]: value } : ev));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      alert("Wedding details saved successfully!");
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match!");
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      alert("Password updated successfully!");
      setPasswordForm({ current: "", new: "", confirm: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pb-12">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#EADBCA]">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#7D736A] hover:text-[#9A6F24] transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#C79848] to-[#9A6F24] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <div className="mb-8">
            <h1 className="font-serif-luxury text-3xl font-bold text-[#29221D]">Wedding Details</h1>
            <p className="text-sm text-[#7D736A] mt-1">Configure all the details that will appear on your invitation template.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* ========================================= */}
            {/* SECTION 1: THE COUPLE                     */}
            {/* ========================================= */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-[#F0E8DC] pb-4">
                <Heart className="w-5 h-5 text-[#C59B48]" />
                <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">The Couple</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Bride's Name</label>
                    <input type="text" name="brideName" value={form.brideName} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#C59B48]"/> Bride's Phone</label>
                    <input type="text" name="bridePhone" value={form.bridePhone} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Groom's Name</label>
                    <input type="text" name="groomName" value={form.groomName} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#C59B48]"/> Groom's Phone</label>
                    <input type="text" name="groomPhone" value={form.groomPhone} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================= */}
            {/* SECTION 2: MAIN EVENT & RSVP DEADLINE     */}
            {/* ========================================= */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-[#F0E8DC] pb-4">
                <MapPin className="w-5 h-5 text-[#C59B48]" />
                <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">Venue & Dates</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Wedding Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide text-red-700">RSVP Deadline Date</label>
                  <input type="date" name="rsvpDeadline" value={form.rsvpDeadline} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-sm text-[#29221D] focus:ring-2 focus:ring-red-400/50 focus:outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Main Venue Name</label>
                  <input type="text" name="venueName" value={form.venueName} onChange={handleInputChange} placeholder="e.g. Shangri-La Hotel" className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Venue Location / Address</label>
                  <input type="text" name="venueLocation" value={form.venueLocation} onChange={handleInputChange} placeholder="e.g. 1 Galle Face, Colombo" className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                </div>
              </div>
            </div>

            {/* ========================================= */}
            {/* SECTION 3: WHATSAPP GREETING TEMPLATE     */}
            {/* ========================================= */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-[#F0E8DC] pb-4">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">WhatsApp Greeting Template</h2>
              </div>
              <p className="text-xs text-[#7D736A] mb-4">
                This is the template used when you click "Send" in your Guest List. The name, deadline, and link are generated automatically so they can't be accidentally broken. You can edit the personal message inside the box.
              </p>
              
              <div className="bg-[#FCFAF7] border border-[#EADBCA] rounded-xl p-4 sm:p-5 font-mono text-sm leading-relaxed text-[#7D736A] space-y-3">
                <p>Dear <span className="font-bold text-[#9A6F24]">[Guest Name]</span>,</p>
                
                <textarea 
                  name="whatsappCustomText"
                  value={form.whatsappCustomText}
                  onChange={(e) => setForm({ ...form, whatsappCustomText: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[#DFD3C3] bg-white text-sm text-[#29221D] font-sans focus:border-[#C59B48] focus:ring-0 focus:outline-none resize-none transition-colors"
                  placeholder="Type your personal invitation message here..."
                />

                <p>Please view your personalized invitation and RSVP before <span className="font-bold text-[#9A6F24]">[Deadline]</span>.</p>
                <p>View Invitation: <span className="font-bold text-[#9A6F24] text-[12px] sm:text-sm break-all">[Unique Link]</span></p>
              </div>
            </div>

            {/* ========================================= */}
            {/* SECTION 3: EVENTS SCHEDULE                */}
            {/* ========================================= */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-[#F0E8DC] pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#C59B48]" />
                  <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">Events Schedule</h2>
                </div>
                <button type="button" onClick={handleAddEvent} className="flex items-center gap-1.5 text-xs font-semibold text-[#C59B48] hover:text-[#9A6F24] bg-[#FBF3E4] px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Event
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {events.map((ev, index) => (
                    <motion.div 
                      key={ev.id}
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 bg-[#FCFAF7] border border-[#F0E8DC] p-3 rounded-xl"
                    >
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-semibold text-[#A69B90] uppercase tracking-wider ml-1">Event Name</label>
                        <input type="text" value={ev.name} onChange={(e) => handleEventChange(ev.id, "name", e.target.value)} placeholder="e.g. Poruwa Ceremony" className="w-full px-3 py-2 rounded-lg border border-[#DFD3C3] text-sm focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                      </div>
                      <div className="w-32 space-y-1">
                        <label className="text-[10px] font-semibold text-[#A69B90] uppercase tracking-wider ml-1">Time</label>
                        <input type="time" value={ev.time} onChange={(e) => handleEventChange(ev.id, "time", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#DFD3C3] text-sm focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" />
                      </div>
                      <div className="pt-5">
                        <button type="button" onClick={() => handleRemoveEvent(ev.id)} className="p-2 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {events.length === 0 && (
                  <p className="text-sm text-center text-[#A69B90] py-4">No events added yet. Add your ceremony, reception, etc.</p>
                )}
              </div>
            </div>

            {/* ========================================= */}
            {/* SECTION 4: PHOTO GALLERY (5 PHOTOS)       */}
            {/* ========================================= */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm mb-12">
              <div className="flex items-center gap-2 mb-6 border-b border-[#F0E8DC] pb-4">
                <Camera className="w-5 h-5 text-[#C59B48]" />
                <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">Photo Gallery</h2>
              </div>
              <p className="text-xs text-[#7D736A] mb-4">Upload up to 5 photos of the couple to be displayed in the template's gallery section.</p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="aspect-square bg-[#FCFAF7] border-2 border-dashed border-[#DFD3C3] rounded-2xl flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:border-[#C59B48] hover:bg-[#FBF3E4] transition-all group">
                    <ImagePlus className="w-6 h-6 text-[#A69B90] group-hover:text-[#C59B48] mb-2" />
                    <span className="text-[10px] font-semibold text-[#A69B90] group-hover:text-[#9A6F24]">Upload Photo {num}</span>
                  </div>
                ))}
              </div>
            </div>

          </form>

          {/* ========================================= */}
          {/* SECTION 5: SECURITY & PASSWORD            */}
          {/* ========================================= */}
          <form onSubmit={handlePasswordUpdate} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm mb-12 mt-6">
            <div className="flex items-center gap-2 mb-6 border-b border-[#F0E8DC] pb-4">
              <Lock className="w-5 h-5 text-[#C59B48]" />
              <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">Security & Password</h2>
            </div>
            <p className="text-xs text-[#7D736A] mb-6">Change your account password to keep your invitation details secure.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Current Password</label>
                <input 
                  type="password" required 
                  value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">New Password</label>
                <input 
                  type="password" required minLength={6}
                  value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Confirm New Password</label>
                <input 
                  type="password" required minLength={6}
                  value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] focus:ring-2 focus:ring-[#C59B48]/50 focus:outline-none" 
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                type="submit" disabled={isUpdatingPassword}
                className="px-5 py-2.5 bg-[#29221D] text-white rounded-xl text-sm font-semibold hover:bg-[#4A3F37] transition-colors"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>

        </motion.div>
      </main>
    </div>
  );
}

