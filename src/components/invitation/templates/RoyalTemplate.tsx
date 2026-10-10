"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { formatDateBanner, formatDateLong, formatTime, mapLink, venueLine } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import type { TemplateProps } from "../types";

/* Kandyan & Gold — "Royal Kandyan" (tpl_royal) */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function RoyalTemplate({ data, actions }: TemplateProps) {
  const timeLeft = useCountdown(data.weddingDate, data.weddingTime);
  const { disabled, wishes, wish, rsvp } = useInvitationActions(data, actions);
  const map = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const heroPhoto = data.coverPhoto ?? data.gallery[0] ?? null;
  const dear = data.guestName ?? "Guest";

  return (
    <div className="bg-[#EBE5DA] min-h-screen font-sans text-[#2D241A] py-0 sm:py-8">
      <div className="max-w-md mx-auto bg-[#FDFBF7] min-h-screen shadow-2xl relative overflow-hidden border-x-4 border-t-4 border-[#A67C00]/20">
        {/* 1. HERO */}
        <section className="relative pt-16 pb-10 text-center px-6">
          <div className="absolute top-4 left-4 right-4 h-24 border-t-2 border-l-2 border-r-2 border-[#A67C00] rounded-t-xl opacity-60" />
          <div className="absolute top-3 left-3 right-3 h-24 border-t border-l border-r border-[#A67C00] rounded-t-xl opacity-30" />

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10">
            <p className="font-script-romantic text-2xl mb-3 mt-4">The Wedding of</p>
            <h1 className="font-serif-luxury text-[2.75rem] text-[#A67C00] leading-none mb-6 uppercase tracking-widest font-bold break-words">
              {data.groomName}
              <span className="block text-2xl text-[#2D241A] my-2 font-script-romantic normal-case">&</span>
              {data.brideName}
            </h1>

            <p className="font-medium tracking-wide mb-8 px-4 leading-relaxed font-serif-luxury text-lg italic">
              Dearest {dear},<br />
              {data.greetingMessage ?? "You are warmly invited to celebrate with us..."}
            </p>

            <div className="relative w-56 mx-auto mb-10 mt-6">
              <div className="aspect-[3/4] w-full rounded-t-full border-[3px] border-[#A67C00] p-1.5 mx-auto">
                <div className="w-full h-full rounded-t-full overflow-hidden bg-[#F0E6D2] flex items-center justify-center">
                  {heroPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroPhoto} alt={`${data.groomName} & ${data.brideName}`} className="w-full h-full object-cover" />
                  ) : (
                    <Heart className="w-12 h-12 text-[#A67C00]/50" />
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-[#A67C00]/20 rounded-full blur-sm" />
              <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-[#A67C00]/20 rounded-full blur-sm" />
            </div>

            <p className="tracking-[0.15em] uppercase text-sm mb-1 font-serif-luxury">SAVE THE DATE</p>
            <p className="font-serif-luxury text-2xl uppercase">{formatDateBanner(data.weddingDate)}</p>

            {(data.groomParents || data.brideParents) && (
              <p className="text-[10px] italic mt-4 opacity-80">
                With the blessings of {[data.groomParents, data.brideParents].filter(Boolean).join(" and ")}
              </p>
            )}

            <div className="flex justify-center items-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-[#A67C00] opacity-50" />
              <div className="w-12 h-px bg-[#A67C00] opacity-50" />
              <div className="w-2 h-2 rounded-full bg-[#A67C00] opacity-50" />
            </div>
          </motion.div>
        </section>

        {/* 2. WHEN & WHERE */}
        <section className="py-10 text-center relative px-6 bg-[#FDFBF7]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="relative w-64 h-32 mx-auto overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[14px] border-double border-[#A67C00]/40 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-[2px] border-dashed border-[#A67C00]/60 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-[8px] border-[#A67C00]/20" />
                </div>
              </div>
              <div className="absolute bottom-0 w-full text-center">
                <h2 className="font-serif-luxury text-[1.75rem] font-bold bg-[#FDFBF7] px-4 mx-auto inline-block">When & Where</h2>
              </div>
            </div>

            <p className="text-[#A67C00] font-bold text-xs uppercase tracking-widest mb-1">Date</p>
            <p className="text-[11px] font-bold mb-1">{formatDateLong(data.weddingDate)}</p>
            {data.weddingTime && <p className="text-[11px] font-bold mb-4">From {formatTime(data.weddingTime)}</p>}

            <p className="text-[#A67C00] font-bold text-xs uppercase tracking-widest mb-1 mt-4">Venue</p>
            <p className="text-[11px] font-bold mb-5 max-w-[220px] mx-auto">{venueLine(data.venueName, data.venueAddress)}</p>

            {map && (
              <a
                href={map}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#C59B48] to-[#A67C00] text-white text-[9px] font-bold px-6 py-2 rounded-full tracking-widest uppercase shadow-md mb-6"
              >
                View on Map
              </a>
            )}

            <p className="text-[9px] font-bold italic tracking-wide">
              Celebrating under Auspicious Times
              <br />(&lsquo;Nekatha&rsquo;)
            </p>
          </motion.div>
        </section>

        {/* 3. COUNTDOWN */}
        {data.weddingDate && (
          <section className="pb-10 pt-2 text-center relative border-b border-[#A67C00]/20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="tracking-[0.15em] uppercase text-xs font-serif-luxury font-bold mb-4">Day Countdown</p>
              <div className="flex justify-center items-center gap-3 font-serif-luxury text-[2rem]">
                {Object.entries(timeLeft).map(([label, value], i) => (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center w-12">
                      <span className="leading-none mb-1">{value.toString().padStart(2, "0")}</span>
                      <span className="text-[8px] uppercase tracking-widest font-sans font-bold">{label}</span>
                    </div>
                    {i < 3 && <span className="pb-4 opacity-50">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
            <div className="absolute bottom-2 left-4 right-4 h-12 border-b border-l border-r border-[#A67C00] rounded-b-xl opacity-30" />
          </section>
        )}

        {/* 4. SCHEDULE */}
        {data.eventsSchedule.length > 0 && (
          <section className="bg-[#F6F1E5] py-12 px-6 text-center border-b border-[#A67C00]/20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-serif-luxury text-2xl font-bold mb-1">Event Schedule</h2>
              <p className="font-serif-luxury text-lg mb-8 font-bold">නැකැත් පත්‍රය</p>
              <div className="max-w-[280px] mx-auto space-y-6">
                {data.eventsSchedule.map((item, index) => (
                  <div key={index} className="flex items-center text-left">
                    <div className="w-20 shrink-0 font-serif-luxury font-bold text-xs">{formatTime(item.time)}</div>
                    <div className="w-8 shrink-0 flex justify-center text-[#A67C00]">
                      <div className="w-4 h-4 rounded-full border-2 border-[#A67C00] flex items-center justify-center opacity-60">
                        <div className="w-1.5 h-1.5 bg-[#A67C00] rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 text-[10px] font-bold leading-tight pl-2">
                      {item.name}
                      {item.venue && <span className="block font-normal opacity-70">{item.venue}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* 5. GALLERY */}
        {data.gallery.length > 0 && (
          <section id="gallery" className="py-12 text-center bg-[#FDFBF7]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-serif-luxury text-2xl font-bold mb-6">Our Story</h2>
              <div className="grid grid-cols-3 gap-1.5 px-6 max-w-sm mx-auto">
                {data.gallery.map((src, i) => (
                  <div
                    key={src + i}
                    className={`bg-[#A67C00]/10 overflow-hidden rounded-sm ${i % 5 === 3 ? "aspect-[3/4]" : i % 5 === 4 ? "col-span-2 aspect-[3/2]" : "aspect-square"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Our story" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* 6. WISHES */}
        <section className="bg-[#F6F1E5] py-12 px-8 text-center border-y border-[#A67C00]/20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-serif-luxury text-2xl font-bold mb-1">Bless the Couple</h2>
            <p className="font-serif-luxury text-lg mb-6 font-bold">ප්‍රාර්ථනා</p>

            <form onSubmit={wish.submit} className="mb-6 space-y-3">
              {wish.askName && (
                <input
                  value={wish.name}
                  onChange={(e) => wish.setName(e.target.value)}
                  disabled={disabled}
                  maxLength={150}
                  placeholder="Your name"
                  className="w-full text-xs px-4 py-3 bg-white border border-[#A67C00]/30 rounded-md focus:outline-none"
                />
              )}
              <textarea
                value={wish.text}
                onChange={(e) => wish.setText(e.target.value)}
                disabled={disabled}
                maxLength={1000}
                className="w-full text-xs px-4 py-3 bg-white border border-[#A67C00]/30 rounded-md placeholder:text-[#2D241A]/40 focus:outline-none resize-none shadow-inner"
                placeholder={disabled ? "Wishes are disabled in preview" : "Write your wish here..."}
                rows={2}
              />
              <button
                type="submit"
                disabled={disabled || wish.sending || !wish.text.trim()}
                className="bg-[#D3B473] text-[#2D241A] text-[10px] font-bold px-6 py-2 rounded uppercase tracking-wider disabled:opacity-70 mx-auto block shadow-sm border border-[#C59B48]"
              >
                {wish.sending ? "Sending…" : "Send Wish"}
              </button>
              {wish.error && <p className="text-[10px] text-red-700">{wish.error}</p>}
              {wish.sent && !wish.error && <p className="text-[10px] text-[#A67C00]">Thank you for your blessings!</p>}
            </form>

            <div className="space-y-2 text-left max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {wishes.map((w) => (
                <div key={w.id} className="bg-[#EBE5DA] p-3 rounded text-[10px] border border-[#A67C00]/20 flex justify-between items-start gap-2 shadow-sm">
                  <p className="italic font-medium flex-1 break-words">&ldquo;{w.message}&rdquo;</p>
                  <p className="font-bold shrink-0 opacity-70">- {w.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 7. RSVP */}
        <section className="py-12 px-8 text-center bg-[#FDFBF7] relative">
          <div className="absolute bottom-4 left-4 right-4 h-16 border-b-2 border-l-2 border-r-2 border-[#A67C00] rounded-b-xl opacity-60" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
            <h2 className="font-serif-luxury text-2xl mb-2 font-bold">Kindly RSVP</h2>
            {data.rsvpDeadline && <p className="text-[10px] mb-6 opacity-70">Please respond by {formatDateLong(data.rsvpDeadline)}</p>}

            {rsvp.submitted ? (
              <div className="bg-[#A67C00]/10 p-6 rounded-md border border-[#A67C00]/30 mb-8 mt-6">
                <p className="font-serif-luxury text-xl font-bold mb-1">Thank You!</p>
                <p className="text-xs opacity-80">
                  {rsvp.attend ? `We look forward to seeing you (${rsvp.count} guest${rsvp.count > 1 ? "s" : ""}).` : "Your response has been recorded."}
                </p>
                <button type="button" onClick={rsvp.edit} className="mt-3 text-[10px] underline text-[#A67C00]">
                  Change my response
                </button>
              </div>
            ) : (
              <form onSubmit={rsvp.submit} className="space-y-5 text-left mb-8 mt-6">
                {rsvp.askName ? (
                  <input
                    value={rsvp.name}
                    onChange={(e) => rsvp.setName(e.target.value)}
                    disabled={disabled}
                    maxLength={150}
                    placeholder="Your name"
                    className="w-full text-xs px-4 py-2.5 rounded bg-white border border-[#A67C00]/40 focus:outline-none"
                  />
                ) : (
                  <div className="text-center mb-4">
                    <p className="opacity-60 text-[10px] uppercase tracking-widest font-bold">RSVP for</p>
                    <p className="font-serif-luxury font-bold text-xl">{dear}</p>
                  </div>
                )}

                <div>
                  <label className="text-[10px] mb-2 block font-bold text-center">WILL YOU ATTEND?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => rsvp.setAttend(true)}
                      className={`py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border border-[#A67C00]/40 shadow-sm ${rsvp.attend === true ? "bg-[#C59B48] text-white border-[#C59B48]" : "bg-white hover:bg-[#F6F1E5]"}`}
                    >
                      Yes, I&apos;ll attend
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => rsvp.setAttend(false)}
                      className={`py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border border-[#A67C00]/40 shadow-sm ${rsvp.attend === false ? "bg-[#2D241A] text-white border-[#2D241A]" : "bg-white hover:bg-[#F6F1E5]"}`}
                    >
                      No, I can&apos;t
                    </button>
                  </div>
                </div>

                {rsvp.attend === true && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                    <label className="text-[10px] mb-2 block font-bold text-center">NUMBER OF GUESTS</label>
                    <div className="flex items-center justify-center gap-4 bg-white py-2 rounded border border-[#A67C00]/40 shadow-sm max-w-[200px] mx-auto">
                      <button type="button" onClick={rsvp.decrement} className="w-8 h-8 rounded text-[#A67C00] font-bold hover:bg-[#F6F1E5]">-</button>
                      <span className="font-serif-luxury font-bold text-2xl w-8 text-center leading-none">{rsvp.count}</span>
                      <button type="button" onClick={rsvp.increment} className="w-8 h-8 rounded text-[#A67C00] font-bold hover:bg-[#F6F1E5]">+</button>
                    </div>
                  </motion.div>
                )}

                {rsvp.error && <p className="text-[11px] text-center text-red-700">{rsvp.error}</p>}

                <button
                  type="submit"
                  disabled={disabled || rsvp.attend === null || rsvp.sending}
                  className="w-full bg-[#C59B48] text-white font-bold text-[11px] tracking-widest uppercase py-3 rounded mt-4 shadow-md active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                >
                  {disabled ? "RSVP disabled in preview" : rsvp.sending ? "Sending…" : "Submit RSVP"}
                </button>
              </form>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
