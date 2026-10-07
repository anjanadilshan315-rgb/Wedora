"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, User, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserViewEditPage() {
  const params = useParams();
  const userId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>({
    first_name: "", last_name: "", phone: "", email: "", template_id: "", invite_slug: ""
  });
  const [event, setEvent] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User
        const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`);
        const json = await response.json();
        if (json.success && json.data) {
          setUser(json.data.user);
          setEvent(json.data.event);
        }

        // Fetch Templates
        const tplResponse = await fetch('http://localhost:3001/api/templates');
        const tplJson = await tplResponse.json();
        if (tplJson.success) {
          setTemplates(tplJson.data);
        }

      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, event })
      });
      const json = await response.json();
      if (json.success) {
        alert("User details updated successfully!");
      } else {
        alert("Failed to update user.");
      }
    } catch (err) {
      alert("Error saving user details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading user details...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/users" className="p-2 bg-white rounded-xl border border-[#EADBCA] text-[#7D736A] hover:text-[#9A6F24] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif-luxury text-3xl font-bold text-[#29221D]">Edit User</h1>
            <p className="text-sm text-[#7D736A] mt-1">Update basic account settings for {user.first_name} {user.last_name}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#29221D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:bg-[#4A3F37] transition-all"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Account Settings */}
        <form className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F0E8DC] pb-4">
            <User className="w-5 h-5 text-[#C59B48]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">Account Info</h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">First Name</label>
              <input type="text" name="first_name" value={user.first_name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Last Name</label>
              <input type="text" name="last_name" value={user.last_name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Email Address (Read-only)</label>
            <input type="email" value={user.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-[#EADBCA] bg-gray-50 text-sm text-gray-500 cursor-not-allowed" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Phone Number</label>
            <input type="text" name="phone" value={user.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Template ID</label>
            <select name="template_id" value={user.template_id} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50">
              {templates.length > 0 ? templates.map(t => (
                <option key={t.template_id} value={t.template_id}>{t.name} ({t.template_id})</option>
              )) : (
                <option value={user.template_id}>{user.template_id}</option>
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#7D736A] uppercase tracking-wide">Invite Slug</label>
            <input type="text" name="invite_slug" value={user.invite_slug} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" />
          </div>
        </form>

        {/* Wedding Event Preview (Now Editable on Admin Side) */}
        <div className="bg-[#FCFAF7] p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-inner space-y-6 h-fit">
          <div className="flex items-center gap-2 border-b border-[#F0E8DC] pb-4">
            <Calendar className="w-5 h-5 text-[#C59B48]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">Wedding Details</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">Bride Name</label>
                <input type="text" value={event?.bride_name || ''} onChange={e => setEvent({...(event || {}), bride_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" placeholder="E.g. Sarah" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">Groom Name</label>
                <input type="text" value={event?.groom_name || ''} onChange={e => setEvent({...(event || {}), groom_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" placeholder="E.g. Michael" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">Bride Phone</label>
                <input type="text" value={event?.bride_phone || ''} onChange={e => setEvent({...(event || {}), bride_phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">Groom Phone</label>
                <input type="text" value={event?.groom_phone || ''} onChange={e => setEvent({...(event || {}), groom_phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">Wedding Date</label>
              <input type="date" value={event?.wedding_date ? new Date(event.wedding_date).toISOString().split('T')[0] : ''} onChange={e => setEvent({...(event || {}), wedding_date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">Venue Name</label>
              <input type="text" value={event?.venue_name || ''} onChange={e => setEvent({...(event || {}), venue_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" placeholder="E.g. Grand Plaza Hotel" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">Venue Address</label>
              <input type="text" value={event?.venue_address || ''} onChange={e => setEvent({...(event || {}), venue_address: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" placeholder="E.g. 123 Main St" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">RSVP Deadline</label>
              <input type="date" value={event?.rsvp_deadline ? new Date(event.rsvp_deadline).toISOString().split('T')[0] : ''} onChange={e => setEvent({...(event || {}), rsvp_deadline: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5">WhatsApp Greeting</label>
              <textarea value={event?.whatsapp_greeting || ''} onChange={e => setEvent({...(event || {}), whatsapp_greeting: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" rows={3} placeholder="Greeting message..." />
            </div>
            
            <div className="pt-2 border-t border-[#F0E8DC]">
              <label className="block text-xs font-semibold text-[#7D736A] uppercase tracking-wide mb-1.5 flex justify-between">
                <span>Events Schedule (JSON)</span>
              </label>
              <textarea 
                value={typeof event?.events_schedule === 'string' ? event.events_schedule : JSON.stringify(event?.events_schedule || [], null, 2)} 
                onChange={e => setEvent({...(event || {}), events_schedule: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50" 
                rows={4} 
              />
            </div>

            <div className="pt-1">
              <p className="text-xs text-[#A69B90] italic">If the user hasn't set these yet, filling them out will create the record.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
