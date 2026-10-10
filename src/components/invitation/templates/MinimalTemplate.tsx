"use client";

import React from "react";
import { motion } from "framer-motion";
import { formatDateLong, formatTime, mapLink, venueLine } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import type { TemplateProps } from "../types";

/* Black & white editorial — "Minimal White" (tpl_minimal) */

const fade = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } };

function dateParts(date: string | null) {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    year: String(d.getFullYear()),
  };
}

export default function MinimalTemplate({ data, actions }: TemplateProps) {
  const timeLeft = useCountdown(data.weddingDate, data.weddingTime);
  const { disabled, wishes, wish, rsvp } = useInvitationActions(data, actions);
  const map = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const heroPhoto = data.coverPhoto ?? data.gallery[0] ?? null;
  const parts = dateParts(data.weddingDate);
  const dear = data.guestName ?? "Guest";

  const line = "w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-neutral-900";
  const label = "text-[10px] uppercase tracking-[0.35em] text-neutral-400";

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* HERO */}
        <section className="px-8 pt-20 pb-12 text-center">
          <motion.div initial="hidden" animate="visible" variants={fade}>
            <p className={label}>For {dear}</p>
            <h1 className="mt-6 font-serif-luxury text-5xl font-light tracking-tight leading-[1.05] break-words">
              {data.groomName}
              <span className="block text-2xl text-neutral-400 my-2">&amp;</span>
              {data.brideName}
            </h1>
            {data.greetingMessage && <p className="mt-6 text-sm text-neutral-500 leading-relaxed">{data.greetingMessage}</p>}
            {parts && (
              <p className="mt-8 font-serif-luxury text-3xl tracking-[0.3em]">
                {parts.day}.{parts.month}.{parts.year}
              </p>
            )}
          </motion.div>
        </section>

        {heroPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroPhoto} alt={`${data.groomName} & ${data.brideName}`} className="w-full aspect-[4/5] object-cover grayscale-[20%]" />
        )}

        {/* COUNTDOWN */}
        {data.weddingDate && (
          <section className="px-8 py-12 grid grid-cols-4 text-center border-b border-neutral-100">
            {Object.entries(timeLeft).map(([key, value]) => (
              <div key={key}>
                <p className="font-serif-luxury text-3xl font-light">{value}</p>
                <p className={`${label} mt-1 tracking-[0.2em]`}>{key}</p>
              </div>
            ))}
          </section>
        )}

        {/* DETAILS */}
        <section className="px-8 py-14 text-center space-y-8">
          <div>
            <p className={label}>When</p>
            <p className="mt-2 text-sm">{formatDateLong(data.weddingDate)}</p>
            {data.weddingTime && <p className="text-sm">{formatTime(data.weddingTime)}</p>}
          </div>
          <div>
            <p className={label}>Where</p>
            <p className="mt-2 text-sm">{venueLine(data.venueName, data.venueAddress)}</p>
            {map && (
              <a href={map} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[11px] uppercase tracking-[0.3em] border-b border-neutral-900 pb-0.5">
                Map
              </a>
            )}
          </div>
          {(data.groomParents || data.brideParents) && (
            <div>
              <p className={label}>Families</p>
              <p className="mt-2 text-sm">{[data.groomParents, data.brideParents].filter(Boolean).join(" · ")}</p>
            </div>
          )}
        </section>

        {/* SCHEDULE */}
        {data.eventsSchedule.length > 0 && (
          <section className="px-8 py-12 border-t border-neutral-100">
            <p className={`${label} text-center mb-8`}>Schedule</p>
            <div className="divide-y divide-neutral-100">
              {data.eventsSchedule.map((item, i) => (
                <div key={i} className="flex justify-between gap-6 py-4 text-sm">
                  <span className="text-neutral-400 shrink-0">{formatTime(item.time)}</span>
                  <span className="text-right">
                    {item.name}
                    {item.venue && <span className="block text-xs text-neutral-400">{item.venue}</span>}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY */}
        {data.gallery.length > 0 && (
          <section className="py-12 border-t border-neutral-100">
            <p className={`${label} text-center mb-8`}>Gallery</p>
            <div className="grid grid-cols-2 gap-px bg-neutral-100">
              {data.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src + i} src={src} alt="Gallery" loading="lazy" className={`w-full object-cover bg-white ${i % 3 === 0 ? "col-span-2 aspect-[3/2]" : "aspect-square"}`} />
              ))}
            </div>
          </section>
        )}

        {/* RSVP */}
        <section className="px-8 py-14 border-t border-neutral-100">
          <p className={`${label} text-center`}>RSVP</p>
          {data.rsvpDeadline && <p className="text-center text-xs text-neutral-400 mt-2">by {formatDateLong(data.rsvpDeadline)}</p>}
          {rsvp.submitted ? (
            <div className="text-center mt-8">
              <p className="font-serif-luxury text-2xl">Thank you.</p>
              <p className="text-xs text-neutral-500 mt-2">{rsvp.attend ? `Attending · ${rsvp.count}` : "Not attending"}</p>
              <button type="button" onClick={rsvp.edit} className="mt-4 text-[11px] uppercase tracking-[0.3em] border-b border-neutral-900">Change</button>
            </div>
          ) : (
            <form onSubmit={rsvp.submit} className="mt-8 space-y-6">
              {rsvp.askName ? (
                <input className={line} placeholder="Your name" value={rsvp.name} maxLength={150} disabled={disabled} onChange={(e) => rsvp.setName(e.target.value)} />
              ) : (
                <p className="text-center font-serif-luxury text-xl">{dear}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" disabled={disabled} onClick={() => rsvp.setAttend(true)} className={`py-3 text-[11px] uppercase tracking-[0.25em] border ${rsvp.attend === true ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300"}`}>Accept</button>
                <button type="button" disabled={disabled} onClick={() => rsvp.setAttend(false)} className={`py-3 text-[11px] uppercase tracking-[0.25em] border ${rsvp.attend === false ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300"}`}>Decline</button>
              </div>
              {rsvp.attend === true && (
                <div className="flex items-center justify-center gap-6">
                  <button type="button" onClick={rsvp.decrement} className="w-8 h-8 border border-neutral-300">-</button>
                  <span className="font-serif-luxury text-2xl w-6 text-center">{rsvp.count}</span>
                  <button type="button" onClick={rsvp.increment} className="w-8 h-8 border border-neutral-300">+</button>
                </div>
              )}
              {rsvp.error && <p className="text-xs text-red-600 text-center">{rsvp.error}</p>}
              <button type="submit" disabled={disabled || rsvp.attend === null || rsvp.sending} className="w-full py-3.5 bg-neutral-900 text-white text-[11px] uppercase tracking-[0.3em] disabled:opacity-40">
                {disabled ? "Disabled in preview" : rsvp.sending ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </section>

        {/* WISHES */}
        <section className="px-8 py-14 border-t border-neutral-100">
          <p className={`${label} text-center mb-8`}>Wishes</p>
          <form onSubmit={wish.submit} className="space-y-4">
            {wish.askName && <input className={line} placeholder="Your name" value={wish.name} maxLength={150} disabled={disabled} onChange={(e) => wish.setName(e.target.value)} />}
            <textarea className={`${line} resize-none`} rows={2} placeholder={disabled ? "Disabled in preview" : "Leave a note for the couple"} value={wish.text} maxLength={1000} disabled={disabled} onChange={(e) => wish.setText(e.target.value)} />
            <button type="submit" disabled={disabled || wish.sending || !wish.text.trim()} className="text-[11px] uppercase tracking-[0.3em] border-b border-neutral-900 disabled:opacity-40">
              {wish.sending ? "Sending…" : "Post"}
            </button>
            {wish.error && <p className="text-xs text-red-600">{wish.error}</p>}
            {wish.sent && !wish.error && <p className="text-xs text-neutral-500">Thank you.</p>}
          </form>
          <div className="mt-8 space-y-6">
            {wishes.map((w) => (
              <blockquote key={w.id} className="text-sm">
                <p className="font-serif-luxury text-lg leading-snug break-words">&ldquo;{w.message}&rdquo;</p>
                <footer className={`${label} mt-2 tracking-[0.2em]`}>{w.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
