"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flower2, Heart, MapPin } from "lucide-react";
import { formatDateBanner, formatDateLong, formatTime, mapLink, venueLine } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import type { TemplateProps } from "../types";

/* Blush & Lavender watercolor — "Floral Garden" (tpl_floral) */

function Petals({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="38" r="22" fill="#F4C7D3" fillOpacity="0.55" />
      <circle cx="38" cy="62" r="22" fill="#D9C6EE" fillOpacity="0.5" />
      <circle cx="82" cy="62" r="22" fill="#F9D9C4" fillOpacity="0.55" />
      <circle cx="60" cy="84" r="22" fill="#F4C7D3" fillOpacity="0.45" />
      <circle cx="60" cy="61" r="10" fill="#E8B04B" fillOpacity="0.7" />
    </svg>
  );
}

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function FloralTemplate({ data, actions }: TemplateProps) {
  const timeLeft = useCountdown(data.weddingDate, data.weddingTime);
  const { disabled, wishes, wish, rsvp } = useInvitationActions(data, actions);
  const map = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const heroPhoto = data.coverPhoto ?? data.gallery[0] ?? null;
  const dear = data.guestName ?? "Guest";

  const input = "w-full px-4 py-3 rounded-2xl border border-[#EBD5DE] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E7A6BA]/40";

  return (
    <div className="min-h-screen bg-[#FBF2F5] font-sans text-[#5B4651]">
      <div className="max-w-md mx-auto bg-[#FFFAFC] min-h-screen shadow-2xl relative overflow-hidden">
        {/* HERO */}
        <section className="relative pt-16 pb-12 px-6 text-center overflow-hidden">
          <Petals className="absolute -top-8 -left-8 w-40 h-40" />
          <Petals className="absolute -top-6 -right-10 w-32 h-32 rotate-45" />
          <motion.div initial="hidden" animate="visible" variants={fade} className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C17F98] font-semibold mb-3">Together with their families</p>
            <h1 className="font-script-romantic text-6xl text-[#B5577A] leading-tight break-words">
              {data.groomName}
              <span className="block text-3xl text-[#9B86B8]">and</span>
              {data.brideName}
            </h1>
            <p className="mt-5 text-sm italic font-serif-luxury text-[#7A6470] px-4">
              Dear {dear}, {data.greetingMessage ?? "you are invited to join us as we begin our forever."}
            </p>

            <div className="mt-8 mx-auto w-60 aspect-[4/5] rounded-[48%] overflow-hidden border-[6px] border-white shadow-[0_10px_40px_rgba(181,87,122,0.25)] bg-[#F4E3EA] flex items-center justify-center">
              {heroPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroPhoto} alt={`${data.groomName} & ${data.brideName}`} className="w-full h-full object-cover" />
              ) : (
                <Flower2 className="w-14 h-14 text-[#E7A6BA]" />
              )}
            </div>

            <p className="mt-8 font-serif-luxury text-2xl text-[#B5577A] tracking-wide">{formatDateBanner(data.weddingDate)}</p>
            {data.weddingTime && <p className="text-xs uppercase tracking-[0.2em] mt-1">at {formatTime(data.weddingTime)}</p>}
          </motion.div>
          <Petals className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-36 h-36 opacity-60" />
        </section>

        {/* COUNTDOWN */}
        {data.weddingDate && (
          <section className="py-8 text-center">
            <div className="flex justify-center gap-3">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="w-16 py-3 rounded-full bg-white border border-[#F0DCE4] shadow-sm">
                  <p className="font-serif-luxury text-2xl font-bold text-[#B5577A] leading-none">{value.toString().padStart(2, "0")}</p>
                  <p className="text-[8px] uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DETAILS */}
        <section className="py-10 px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="bg-white rounded-[2rem] p-7 shadow-sm border border-[#F3E2E9]">
            <h2 className="font-serif-luxury text-3xl text-[#B5577A] mb-4">The Celebration</h2>
            <p className="text-sm font-semibold">{formatDateLong(data.weddingDate)}</p>
            {data.weddingTime && <p className="text-sm">{formatTime(data.weddingTime)} onwards</p>}
            <div className="flex items-start justify-center gap-2 mt-4 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 text-[#C17F98] shrink-0" />
              <span>{venueLine(data.venueName, data.venueAddress)}</span>
            </div>
            {(data.groomParents || data.brideParents) && (
              <p className="text-xs italic mt-4 text-[#8E7782]">{[data.groomParents, data.brideParents].filter(Boolean).join(" & ")}</p>
            )}
            {map && (
              <a href={map} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 px-6 py-2.5 rounded-full bg-[#E7A6BA] text-white text-xs font-semibold tracking-wider uppercase shadow">
                Get Directions
              </a>
            )}
          </motion.div>
        </section>

        {/* SCHEDULE */}
        {data.eventsSchedule.length > 0 && (
          <section className="py-8 px-8">
            <h2 className="font-serif-luxury text-3xl text-center text-[#B5577A] mb-6">Order of the Day</h2>
            <ol className="space-y-3">
              {data.eventsSchedule.map((item, i) => (
                <li key={i} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-3 border border-[#F3E2E9]">
                  <span className="text-xs font-bold text-[#9B86B8] w-16 shrink-0">{formatTime(item.time)}</span>
                  <span className="text-sm">
                    {item.name}
                    {item.venue && <span className="block text-xs opacity-70">{item.venue}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* GALLERY */}
        {data.gallery.length > 0 && (
          <section className="py-10 px-6">
            <h2 className="font-serif-luxury text-3xl text-center text-[#B5577A] mb-6">Our Moments</h2>
            <div className="columns-2 gap-3 space-y-3">
              {data.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src + i} src={src} alt="Our moments" loading="lazy" className="w-full rounded-3xl border-4 border-white shadow-sm break-inside-avoid" />
              ))}
            </div>
          </section>
        )}

        {/* RSVP */}
        <section className="py-12 px-8 bg-gradient-to-b from-[#FBEAF0] to-[#F1EAF8] text-center">
          <h2 className="font-serif-luxury text-3xl text-[#B5577A] mb-1">Kindly Reply</h2>
          {data.rsvpDeadline && <p className="text-xs mb-6">by {formatDateLong(data.rsvpDeadline)}</p>}
          {rsvp.submitted ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm mt-4">
              <Heart className="w-8 h-8 mx-auto text-[#E7A6BA] fill-[#E7A6BA]" />
              <p className="font-serif-luxury text-xl mt-2">Thank you!</p>
              <p className="text-xs mt-1">{rsvp.attend ? `See you there — ${rsvp.count} guest${rsvp.count > 1 ? "s" : ""}.` : "We will miss you."}</p>
              <button type="button" onClick={rsvp.edit} className="mt-3 text-xs underline text-[#B5577A]">Change my response</button>
            </div>
          ) : (
            <form onSubmit={rsvp.submit} className="space-y-4 mt-4 text-left">
              {rsvp.askName ? (
                <input className={input} placeholder="Your name" value={rsvp.name} maxLength={150} disabled={disabled} onChange={(e) => rsvp.setName(e.target.value)} />
              ) : (
                <p className="text-center font-serif-luxury text-xl">{dear}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" disabled={disabled} onClick={() => rsvp.setAttend(true)} className={`py-3 rounded-2xl text-xs font-semibold ${rsvp.attend === true ? "bg-[#B5577A] text-white" : "bg-white border border-[#EBD5DE]"}`}>
                  Joyfully accept
                </button>
                <button type="button" disabled={disabled} onClick={() => rsvp.setAttend(false)} className={`py-3 rounded-2xl text-xs font-semibold ${rsvp.attend === false ? "bg-[#9B86B8] text-white" : "bg-white border border-[#EBD5DE]"}`}>
                  Regretfully decline
                </button>
              </div>
              {rsvp.attend === true && (
                <div className="flex items-center justify-center gap-4">
                  <button type="button" onClick={rsvp.decrement} className="w-9 h-9 rounded-full bg-white border border-[#EBD5DE]">-</button>
                  <span className="font-serif-luxury text-2xl w-8 text-center">{rsvp.count}</span>
                  <button type="button" onClick={rsvp.increment} className="w-9 h-9 rounded-full bg-white border border-[#EBD5DE]">+</button>
                </div>
              )}
              {rsvp.error && <p className="text-xs text-red-600 text-center">{rsvp.error}</p>}
              <button type="submit" disabled={disabled || rsvp.attend === null || rsvp.sending} className="w-full py-3 rounded-2xl bg-[#B5577A] text-white text-xs font-bold uppercase tracking-widest disabled:opacity-50">
                {disabled ? "RSVP disabled in preview" : rsvp.sending ? "Sending…" : "Send RSVP"}
              </button>
            </form>
          )}
        </section>

        {/* WISHES */}
        <section className="py-12 px-8">
          <h2 className="font-serif-luxury text-3xl text-center text-[#B5577A] mb-6">Wishes for the Couple</h2>
          <form onSubmit={wish.submit} className="space-y-3">
            {wish.askName && <input className={input} placeholder="Your name" value={wish.name} maxLength={150} disabled={disabled} onChange={(e) => wish.setName(e.target.value)} />}
            <textarea className={`${input} resize-none`} rows={3} placeholder={disabled ? "Wishes are disabled in preview" : "Write a sweet note…"} value={wish.text} maxLength={1000} disabled={disabled} onChange={(e) => wish.setText(e.target.value)} />
            <button type="submit" disabled={disabled || wish.sending || !wish.text.trim()} className="w-full py-3 rounded-2xl bg-[#E7A6BA] text-white text-xs font-bold uppercase tracking-widest disabled:opacity-50">
              {wish.sending ? "Sending…" : "Send Wish"}
            </button>
            {wish.error && <p className="text-xs text-red-600">{wish.error}</p>}
            {wish.sent && !wish.error && <p className="text-xs text-[#B5577A]">Thank you for your lovely wishes!</p>}
          </form>
          <div className="mt-6 space-y-3">
            {wishes.map((w) => (
              <div key={w.id} className="bg-white rounded-3xl p-4 border border-[#F3E2E9] text-sm">
                <p className="italic break-words">&ldquo;{w.message}&rdquo;</p>
                <p className="text-xs font-semibold text-[#B5577A] mt-2">— {w.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
