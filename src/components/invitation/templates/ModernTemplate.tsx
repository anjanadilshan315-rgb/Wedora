"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Camera, CheckCircle2, Clock, Heart, MapPin, MessageSquareHeart, Send } from "lucide-react";
import { formatDateLong, formatTime, mapLink, venueLine } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import type { TemplateProps } from "../types";

/* Emerald & Amber — "Modern Luxe" (tpl_modern) */

export default function ModernTemplate({ data, actions }: TemplateProps) {
  const timeLeft = useCountdown(data.weddingDate, data.weddingTime);
  const { disabled, wishes, wish, rsvp } = useInvitationActions(data, actions);
  const map = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const heroPhoto = data.coverPhoto ?? data.gallery[0] ?? null;
  const dear = data.guestName ?? "Guest";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-amber-100 pb-16">
      {/* 1. HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative bg-gradient-to-b from-[#0F2F24] to-[#1E4D3E] text-white overflow-hidden">
        {heroPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroPhoto} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="z-10 max-w-lg">
          <div className="inline-block px-4 py-1.5 rounded-full border border-amber-300/40 bg-white/10 backdrop-blur-md text-amber-200 text-sm mb-6">
            ආරාධනාවයි: <span className="font-semibold text-white">{dear}</span> වෙත
          </div>
          <p className="tracking-widest uppercase text-xs text-amber-300/90 mb-2">Save The Date</p>
          <h1 className="text-4xl md:text-6xl font-serif-luxury font-normal text-amber-100 tracking-wide break-words">
            {data.groomName} <span className="text-amber-400 font-sans text-3xl">&</span> {data.brideName}
          </h1>
          <p className="mt-4 text-stone-200 text-sm md:text-base">
            {data.greetingMessage ?? "අපගේ ප්‍රේමයේ නව ඇරඹුම සැමරීමට ඔබ සැමට ගෞරවයෙන් ඇරයුම් කරමු."}
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-amber-300/80">
            <Heart className="w-5 h-5 fill-amber-300/20" />
            <span className="text-sm tracking-wider">{formatDateLong(data.weddingDate)}</span>
          </div>
        </motion.div>
      </section>

      {/* 2. COUNTDOWN */}
      {data.weddingDate && (
        <section className="py-12 px-4 max-w-md mx-auto -mt-10 relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-stone-100 grid grid-cols-4 gap-2 text-center"
          >
            {Object.entries(timeLeft).map(([key, val]) => (
              <div key={key} className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                <span className="text-2xl font-bold text-[#1E4D3E] block">{val}</span>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider">{key}</span>
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 3. DATE & VENUE */}
      <section className="py-12 px-6 max-w-md mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
          <h2 className="text-2xl font-serif-luxury text-[#1E4D3E]">දිනය සහ ස්ථානය</h2>
          <div className="flex items-center justify-center gap-2 text-stone-600">
            <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              {formatDateLong(data.weddingDate)}
              {data.weddingTime ? ` | ${formatTime(data.weddingTime)}` : ""}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-stone-600">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{venueLine(data.venueName, data.venueAddress)}</span>
          </div>
          {(data.groomParents || data.brideParents) && (
            <p className="text-sm text-stone-500 italic">
              {[data.groomParents, data.brideParents].filter(Boolean).join(" · ")}
            </p>
          )}
          {map && (
            <a
              href={map}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 px-5 py-2.5 rounded-full bg-[#1E4D3E] text-white text-sm font-medium shadow-sm hover:bg-[#163a2f] transition"
            >
              Google Map හරහා බලන්න
            </a>
          )}
        </motion.div>
      </section>

      {/* 4. SCHEDULE */}
      {data.eventsSchedule.length > 0 && (
        <section className="py-12 px-6 max-w-md mx-auto">
          <h2 className="text-2xl font-serif-luxury text-[#1E4D3E] text-center mb-8">දවසේ කාලසටහන</h2>
          <div className="relative border-l-2 border-amber-300 ml-4 space-y-8">
            {data.eventsSchedule.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white" />
                <div className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formatTime(item.time)}
                </div>
                <h3 className="font-semibold text-stone-800 mt-0.5">{item.name}</h3>
                {(item.description || item.venue) && <p className="text-sm text-stone-500">{item.description ?? item.venue}</p>}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 5. GALLERY */}
      {data.gallery.length > 0 && (
        <section className="py-12 px-6 max-w-md mx-auto">
          <h2 className="text-2xl font-serif-luxury text-[#1E4D3E] text-center mb-6 flex items-center justify-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" /> අපේ මතකයන්
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {data.gallery.map((src, i) => (
              <div key={src + i} className="rounded-xl overflow-hidden aspect-[4/5] bg-stone-200 border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Couple moment" className="w-full h-full object-cover hover:scale-105 transition duration-300" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. RSVP */}
      <section className="py-12 px-6 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-md border border-stone-100 p-6">
          <div className="text-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#1E4D3E] mx-auto mb-1" />
            <h2 className="text-2xl font-serif-luxury text-[#1E4D3E]">RSVP Confirmation</h2>
            <p className="text-xs text-stone-500">
              කරුණාකර ඔබ පැමිණෙන්නේදැයි තහවුරු කරන්න
              {data.rsvpDeadline ? ` (${formatDateLong(data.rsvpDeadline)} ට පෙර)` : ""}
            </p>
          </div>

          {rsvp.submitted ? (
            <div className="text-center py-4">
              <p className="font-semibold text-[#1E4D3E]">ස්තූතියි! Thank you, {rsvp.name || dear}.</p>
              <p className="text-xs text-stone-500 mt-1">
                {rsvp.attend ? `පැමිණෙන සංඛ්‍යාව: ${rsvp.count}` : "Your response has been recorded."}
              </p>
              <button type="button" onClick={rsvp.edit} className="mt-3 text-xs underline text-[#1E4D3E]">
                Change my response
              </button>
            </div>
          ) : (
            <form onSubmit={rsvp.submit} className="space-y-4">
              {rsvp.askName ? (
                <input
                  type="text"
                  value={rsvp.name}
                  onChange={(e) => rsvp.setName(e.target.value)}
                  disabled={disabled}
                  maxLength={150}
                  placeholder="ඔබගේ නම (Your name)"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1E4D3E]"
                />
              ) : (
                <p className="text-center text-sm font-semibold text-[#1E4D3E]">{dear}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => rsvp.setAttend(true)}
                  className={`py-2.5 rounded-xl text-sm border ${rsvp.attend === true ? "bg-[#1E4D3E] text-white border-[#1E4D3E]" : "border-stone-200"}`}
                >
                  පැමිණෙනවා
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => rsvp.setAttend(false)}
                  className={`py-2.5 rounded-xl text-sm border ${rsvp.attend === false ? "bg-stone-700 text-white border-stone-700" : "border-stone-200"}`}
                >
                  පැමිණීමට නොහැක
                </button>
              </div>
              {rsvp.attend === true && (
                <div className="flex items-center justify-center gap-4">
                  <button type="button" onClick={rsvp.decrement} className="w-9 h-9 rounded-full border border-stone-200 font-bold">-</button>
                  <span className="text-xl font-bold text-[#1E4D3E] w-8 text-center">{rsvp.count}</span>
                  <button type="button" onClick={rsvp.increment} className="w-9 h-9 rounded-full border border-stone-200 font-bold">+</button>
                </div>
              )}
              {rsvp.error && <p className="text-xs text-red-600 text-center">{rsvp.error}</p>}
              <button
                type="submit"
                disabled={disabled || rsvp.attend === null || rsvp.sending}
                className="w-full py-3 bg-[#1E4D3E] text-white font-medium rounded-xl text-sm shadow hover:bg-[#163a2f] transition disabled:opacity-50"
              >
                {disabled ? "RSVP disabled in preview" : rsvp.sending ? "Sending…" : "තහවුරු කරන්න (Confirm RSVP)"}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* 7. WISHES */}
      <section className="py-12 px-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <MessageSquareHeart className="w-8 h-8 text-amber-600 mx-auto mb-1" />
          <h2 className="text-2xl font-serif-luxury text-[#1E4D3E]">සුබපැතුම් එක් කරන්න</h2>
          <p className="text-xs text-stone-500">අලුත් යුවළට ආශිර්වාද එක් කරන්න</p>
        </div>

        <form onSubmit={wish.submit} className="space-y-2 mb-6">
          {wish.askName && (
            <input
              type="text"
              value={wish.name}
              onChange={(e) => wish.setName(e.target.value)}
              disabled={disabled}
              maxLength={150}
              placeholder="ඔබගේ නම (Your name)"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1E4D3E]"
            />
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={wish.text}
              onChange={(e) => wish.setText(e.target.value)}
              disabled={disabled}
              maxLength={1000}
              placeholder="ඔබේ සුබපැතුම ලියන්න..."
              className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1E4D3E]"
            />
            <button type="submit" disabled={disabled || wish.sending || !wish.text.trim()} className="px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm hover:bg-amber-700 disabled:opacity-60" aria-label="Send wish">
              <Send className="w-4 h-4" />
            </button>
          </div>
          {wish.error && <p className="text-xs text-red-600">{wish.error}</p>}
          {wish.sent && !wish.error && <p className="text-xs text-[#1E4D3E]">ස්තූතියි! Thank you for your wishes.</p>}
        </form>

        <div className="space-y-3">
          {wishes.map((w) => (
            <div key={w.id} className="p-3 bg-white rounded-xl border border-stone-100 shadow-sm text-sm text-stone-600">
              <p className="break-words">&ldquo;{w.message}&rdquo;</p>
              <p className="text-xs font-semibold text-[#1E4D3E] mt-1">— {w.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
