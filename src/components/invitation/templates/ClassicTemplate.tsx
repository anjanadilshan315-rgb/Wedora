"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, GlassWater, Heart, Music, Utensils } from "lucide-react";
import { formatDateBanner, formatDateLong, formatTime, mapLink, venueLine } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import type { TemplateProps } from "../types";

/* Sage & Gold — "Classic Elegance" (tpl_classic) */

function FloralAccent({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20,80 C20,50 50,20 80,20 C80,50 50,80 20,80 Z" fill="#8FA08D" fillOpacity="0.4" />
      <path d="M10,60 C10,40 40,10 60,10 C60,40 40,60 10,60 Z" fill="#A3B19B" fillOpacity="0.5" />
      <path d="M40,90 C40,70 70,40 90,40 C90,70 70,90 40,90 Z" fill="#C59B48" fillOpacity="0.3" />
    </svg>
  );
}

const ICONS = [GlassWater, Heart, Camera, Utensils, Music];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ClassicTemplate({ data, actions }: TemplateProps) {
  const timeLeft = useCountdown(data.weddingDate, data.weddingTime);
  const { disabled, wishes, wish, rsvp } = useInvitationActions(data, actions);
  const map = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const heroPhoto = data.coverPhoto ?? data.gallery[0] ?? null;
  const dear = data.guestName ?? "Guest";

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans text-[#4A433E]">
      <div className="max-w-md mx-auto bg-[#F8F5EE] min-h-screen shadow-2xl relative overflow-hidden">
        {/* 1. HERO */}
        <section
          className="relative pt-16 pb-6 text-center"
          style={{ background: "linear-gradient(to bottom, #8FA08D 0%, #8FA08D 55%, #F8F5EE 100%)" }}
        >
          <FloralAccent className="absolute -top-4 -left-4 w-32 h-32 rotate-[-45deg]" />
          <FloralAccent className="absolute top-10 -right-8 w-24 h-24 rotate-[90deg]" />

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 px-6">
            <p className="font-script-romantic text-2xl text-white mb-2">The Wedding of</p>
            <h1 className="font-serif-luxury text-[2.75rem] text-[#D4AF37] leading-none mb-4 uppercase tracking-wider break-words">
              {data.groomName}
              <span className="block text-3xl text-white my-1">&</span>
              {data.brideName}
            </h1>

            <p className="text-[10px] text-white/90 font-medium tracking-wide mb-8 px-4 leading-relaxed">
              Dearest {dear},<br />
              {data.greetingMessage ?? "You are warmly invited to celebrate with us."}
            </p>

            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-[3px] border-[#D4AF37] scale-105" />
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/50 bg-[#8FA08D] flex items-center justify-center">
                {heroPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroPhoto} alt={`${data.groomName} & ${data.brideName}`} className="w-full h-full object-cover" />
                ) : (
                  <Heart className="w-12 h-12 text-white/70" />
                )}
              </div>
              <FloralAccent className="absolute -bottom-6 -left-4 w-20 h-20 rotate-[-120deg]" />
              <FloralAccent className="absolute -top-4 -right-4 w-16 h-16 rotate-[45deg]" />
            </div>

            <p className="text-white tracking-[0.2em] uppercase text-[10px] font-bold mb-1">Save The Date</p>
            <p className="font-serif-luxury text-lg text-white font-bold">{formatDateBanner(data.weddingDate)}</p>
          </motion.div>
        </section>

        {/* 2. COUNTDOWN */}
        {data.weddingDate && (
          <section className="bg-[#F8F5EE] pb-10 pt-2 text-center relative z-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="text-[#4A433E] tracking-[0.15em] uppercase text-[10px] font-bold mb-4">Day Count Down</p>
              <div className="flex justify-center items-center gap-1.5">
                {Object.entries(timeLeft).map(([label, value], i) => (
                  <React.Fragment key={label}>
                    <div className="w-14 h-16 bg-gradient-to-b from-[#C59B48] to-[#B38936] rounded-md flex flex-col items-center justify-center shadow-md border border-[#D4AF37]/50">
                      <span className="font-serif-luxury text-2xl font-bold text-white leading-none mb-1">
                        {value.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[8px] uppercase tracking-widest text-white/90 font-semibold">{label}</span>
                    </div>
                    {i < 3 && <span className="text-[#C59B48] font-bold text-xl px-0.5 mb-2">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* 3. WHEN & WHERE */}
        <section className="bg-[#F8F5EE] py-10 text-center relative border-t border-[#8FA08D]/20">
          <FloralAccent className="absolute top-2 -left-8 w-24 h-24 rotate-[120deg] opacity-60" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 px-6">
            <p className="text-[10px] text-[#4A433E] tracking-[0.15em] uppercase mb-1 font-bold">The Event Details</p>
            <h2 className="font-serif-luxury text-[2rem] text-[#4A433E] mb-6 leading-none">When & Where</h2>

            <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5">Date:</p>
            <p className="text-[11px] mb-4">
              {formatDateLong(data.weddingDate)}
              {data.weddingTime && (
                <>
                  <br />& Time: Starting at {formatTime(data.weddingTime)}
                </>
              )}
            </p>

            <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5">Venue:</p>
            <p className="text-[11px] mb-6">{venueLine(data.venueName, data.venueAddress)}</p>

            {(data.groomParents || data.brideParents) && (
              <p className="text-[10px] italic mb-6 leading-relaxed">
                With the blessings of {[data.groomParents, data.brideParents].filter(Boolean).join(" and ")}
              </p>
            )}

            {map && (
              <a
                href={map}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#C59B48] to-[#B38936] text-white text-[10px] font-bold px-8 py-2.5 rounded-full tracking-widest uppercase shadow-md active:scale-95 transition-transform"
              >
                View on Map
              </a>
            )}
          </motion.div>
        </section>

        {/* 4. SCHEDULE */}
        {data.eventsSchedule.length > 0 && (
          <section className="bg-[#F8F5EE] py-10 text-center relative border-t border-[#8FA08D]/20">
            <FloralAccent className="absolute top-10 -right-10 w-32 h-32 rotate-[-45deg] opacity-60" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
              <h2 className="font-serif-luxury text-[2rem] text-[#4A433E] mb-10">Event Schedule</h2>
              <div className="max-w-[280px] mx-auto relative">
                <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#C59B48]/20 via-[#C59B48] to-[#C59B48]/20 -translate-x-1/2" />
                {data.eventsSchedule.map((item, index) => {
                  const Icon = ICONS[index % ICONS.length];
                  return (
                    <div key={index} className="flex items-center justify-between mb-8 relative">
                      <div className="w-[42%] text-right pr-3">
                        <p className="text-[10px] font-bold">{formatTime(item.time)}</p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#C59B48] to-[#B38936] text-white flex items-center justify-center z-10 shadow-md border-2 border-[#F8F5EE]">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-[42%] text-left pl-3">
                        <p className="text-[9px] font-bold leading-snug pr-2">{item.name}</p>
                        {item.venue && <p className="text-[8px] opacity-70">{item.venue}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
            <FloralAccent className="absolute bottom-0 -left-6 w-24 h-24 rotate-[60deg] opacity-60" />
          </section>
        )}

        {/* 5. GALLERY */}
        {data.gallery.length > 0 && (
          <section id="gallery" className="bg-[#F8F5EE] py-10 text-center relative border-t border-[#8FA08D]/20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-serif-luxury text-[2rem] text-[#4A433E] mb-6">Our Journey</h2>
              <div className="grid grid-cols-3 gap-1.5 px-6 max-w-sm mx-auto">
                {data.gallery.map((src, i) => (
                  <div
                    key={src + i}
                    className={`bg-[#8FA08D]/20 overflow-hidden ${i % 5 === 3 ? "col-span-2 aspect-[4/3]" : i % 5 === 4 ? "aspect-[2/3]" : "aspect-square"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Our journey" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* 6. WISHES */}
        <section className="bg-[#F8F5EE] py-10 text-center relative border-t border-[#8FA08D]/20">
          <FloralAccent className="absolute top-6 -right-6 w-24 h-24 rotate-[180deg] opacity-60" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 px-6">
            <p className="text-[10px] tracking-[0.15em] uppercase mb-1 font-bold">Bless the Couple</p>
            <h2 className="font-serif-luxury text-[2rem] mb-6 leading-none">Share Your Wishes</h2>

            <form onSubmit={wish.submit} className="mb-3 space-y-2">
              {wish.askName && (
                <input
                  value={wish.name}
                  onChange={(e) => wish.setName(e.target.value)}
                  disabled={disabled}
                  maxLength={150}
                  className="w-full text-[11px] px-4 py-3 bg-white rounded-md border border-[#8FA08D]/20 focus:outline-none"
                  placeholder="Your name"
                />
              )}
              <div className="flex shadow-sm rounded-md overflow-hidden border border-[#8FA08D]/20">
                <input
                  value={wish.text}
                  onChange={(e) => wish.setText(e.target.value)}
                  disabled={disabled}
                  maxLength={1000}
                  className="flex-1 min-w-0 text-[11px] px-4 py-3 bg-white placeholder:text-[#4A433E]/50 focus:outline-none"
                  placeholder={disabled ? "Wishes are disabled in preview" : "Write your wish here..."}
                />
                <button
                  type="submit"
                  disabled={disabled || wish.sending || !wish.text.trim()}
                  className="bg-gradient-to-r from-[#C59B48] to-[#B38936] text-white text-[10px] font-bold px-4 py-3 uppercase tracking-wider disabled:opacity-70"
                >
                  {wish.sending ? "Sending…" : "Send Wish"}
                </button>
              </div>
            </form>
            {wish.error && <p className="text-[10px] text-red-600 mb-3">{wish.error}</p>}
            {wish.sent && !wish.error && <p className="text-[10px] text-[#6B7D69] mb-3">Thank you for your wishes!</p>}

            <div className="flex flex-wrap gap-3 justify-center mt-5">
              {wishes.map((w) => (
                <div key={w.id} className="bg-[#E4EAE1] p-3 rounded-md text-[10px] max-w-[140px] text-center border border-[#8FA08D]/30 shadow-sm relative">
                  <div className="absolute left-1 top-1 bottom-1 w-[2px] bg-[#C59B48]/30 rounded-full" />
                  <div className="absolute right-1 top-1 bottom-1 w-[2px] bg-[#C59B48]/30 rounded-full" />
                  <p className="mb-2 italic leading-relaxed px-2 break-words">&ldquo;{w.message}&rdquo;</p>
                  <p className="font-bold text-[9px]">- {w.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 7. RSVP */}
        <section className="bg-[#8FA08D] py-12 px-8 text-center relative border-t-4 border-[#C59B48]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[10px] text-[#F8F5EE] tracking-[0.15em] uppercase mb-1 font-bold">RSVP Section</p>
            <h2 className="font-serif-luxury text-[2rem] text-white mb-2 leading-none">Will You Be Attending?</h2>
            {data.rsvpDeadline && (
              <p className="text-[10px] text-white/80 mb-6">Kindly respond by {formatDateLong(data.rsvpDeadline)}</p>
            )}

            {rsvp.submitted ? (
              <div className="bg-[#F8F5EE]/10 p-6 rounded-md border border-white/20 mt-6">
                <Heart className="w-10 h-10 text-[#C59B48] mx-auto mb-3 fill-[#C59B48]" />
                <p className="font-serif-luxury text-xl font-bold text-white mb-1">Thank You!</p>
                <p className="text-xs text-white/90">
                  {rsvp.attend ? `We look forward to seeing you (${rsvp.count} guest${rsvp.count > 1 ? "s" : ""}).` : "Your response has been recorded."}
                </p>
                <button type="button" onClick={rsvp.edit} className="mt-3 text-[10px] text-white underline">
                  Change my response
                </button>
              </div>
            ) : (
              <form onSubmit={rsvp.submit} className="space-y-6 text-left mt-6">
                {rsvp.askName ? (
                  <input
                    value={rsvp.name}
                    onChange={(e) => rsvp.setName(e.target.value)}
                    disabled={disabled}
                    maxLength={150}
                    placeholder="Your name"
                    className="w-full text-xs px-4 py-3 rounded-md bg-white/90 text-[#4A433E] focus:outline-none"
                  />
                ) : (
                  <div className="text-center mb-2">
                    <p className="text-white/80 text-xs">RSVP for</p>
                    <p className="text-white font-serif-luxury font-bold text-xl">{dear}</p>
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-white mb-2 block font-medium uppercase tracking-widest text-center">Can you make it?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => rsvp.setAttend(true)}
                      className={`py-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${rsvp.attend === true ? "bg-[#C59B48] text-white border-2 border-[#C59B48]" : "bg-transparent text-white border-2 border-white/40 hover:bg-white/10"}`}
                    >
                      Yes, I&apos;ll attend
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => rsvp.setAttend(false)}
                      className={`py-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${rsvp.attend === false ? "bg-white/20 text-white border-2 border-white/40" : "bg-transparent text-white border-2 border-white/40 hover:bg-white/10"}`}
                    >
                      No, I can&apos;t
                    </button>
                  </div>
                </div>

                {rsvp.attend === true && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <label className="text-[10px] text-white mb-2 block font-medium uppercase tracking-widest text-center mt-2">Number of Guests</label>
                    <div className="flex items-center justify-center gap-4 bg-white/10 p-3 rounded-md border border-white/20">
                      <button type="button" onClick={rsvp.decrement} className="w-8 h-8 rounded bg-white/20 text-white font-bold hover:bg-white/30">-</button>
                      <span className="text-white font-serif-luxury text-2xl w-8 text-center">{rsvp.count}</span>
                      <button type="button" onClick={rsvp.increment} className="w-8 h-8 rounded bg-white/20 text-white font-bold hover:bg-white/30">+</button>
                    </div>
                  </motion.div>
                )}

                {rsvp.error && <p className="text-[11px] text-center text-red-100 bg-red-900/30 rounded p-2">{rsvp.error}</p>}

                <button
                  type="submit"
                  disabled={disabled || rsvp.attend === null || rsvp.sending}
                  className="w-full bg-gradient-to-r from-[#C59B48] to-[#B38936] text-white font-bold text-[10px] tracking-widest uppercase py-3.5 rounded-md mt-6 shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
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
