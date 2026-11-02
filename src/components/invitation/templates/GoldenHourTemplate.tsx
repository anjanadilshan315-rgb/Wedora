"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Heart, MapPin, Sparkles } from "lucide-react";
import { formatDateBanner, formatDateLong, formatTime, mapLink, venueLine } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import type { TemplateProps } from "../types";
import { rubySettings, rubyStyle, type RubySettings } from "../ruby";
import RubyCustomizer from "../RubyCustomizer";
import styles from "./ruby.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75 } },
};

/** Slow heart-shaped petals drift behind the invitation without blocking taps. */
function FallingHearts() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || prefersReducedMotion) return null;

  const hearts = Array.from({ length: 18 }, (_, index) => ({
    left: `${(index * 37 + 9) % 100}%`,
    size: 24 + ((index * 11) % 25),
    duration: 18 + ((index * 7) % 13),
    delay: (index % 9) * 1.6,
    drift: index % 2 === 0 ? 30 + (index % 4) * 8 : -30 - (index % 4) * 8,
    color: "var(--ruby-accent)",
  }));

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((heart, index) => (
        <motion.span
          key={index}
          className="absolute top-[-5vh] select-none font-serif"
          style={{ left: heart.left, fontSize: heart.size, color: heart.color }}
          initial={{ y: "-5vh", x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: ["-5vh", "108vh"],
            x: [0, heart.drift, -heart.drift / 2],
            opacity: [0, 0.34, 0.26, 0],
            rotate: [0, 35, -20, 45],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.4,
          }}
        >
          ♡
        </motion.span>
      ))}
    </div>
  );
}

/** Responsive, animated invitation using the warm palette from the supplied card. */
export default function GoldenHourTemplate({ data, actions }: TemplateProps) {
  const [demoSettings, setDemoSettings] = useState<RubySettings | null>(null);
  const settings = actions.mode === "demo" && demoSettings ? demoSettings : rubySettings(data.ruby);
  const countdown = useCountdown(data.weddingDate, data.weddingTime);
  const { disabled, wishes, wish, rsvp } = useInvitationActions(data, actions);
  const map = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const photo = data.coverPhoto ?? data.gallery[0] ?? null;
  const guest = data.guestName ?? "Dear Guest";

  const field = "w-full rounded-xl border border-[var(--ruby-border)] bg-[var(--ruby-surface)]/85 px-4 py-3 text-sm text-[var(--ruby-text)] placeholder:text-[var(--ruby-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ruby-accent)]/30";
  const eyebrow = "text-[10px] font-semibold uppercase tracking-[.32em] text-[var(--ruby-muted)]";
  const heading = "mt-2 font-serif-luxury text-3xl text-[var(--ruby-accent)] sm:text-4xl";
  const card = "rounded-2xl border border-[var(--ruby-border)]/80 bg-[var(--ruby-surface)]/80 p-5 shadow-[0_18px_50px_-35px_rgba(90,25,48,.35)] backdrop-blur-sm sm:p-7";

  return (
    <>
    <main style={rubyStyle(settings)} className={`${styles.invitation} relative min-h-screen overflow-hidden bg-[var(--ruby-background)] text-[var(--ruby-text)]`}>
      <FallingHearts />
      {/* Soft moving light pools add depth to the background. */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute -left-24 top-16 z-0 h-72 w-72 rounded-full bg-[var(--ruby-blush)]/35 blur-3xl" animate={{ x: [0, 30, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div aria-hidden="true" className="pointer-events-none absolute -right-24 top-[38rem] z-0 h-80 w-80 rounded-full bg-[var(--ruby-blush)]/25 blur-3xl" animate={{ x: [0, -24, 0], y: [0, 30, 0] }} transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        {/* Cover / hero */}
        <section className="relative isolate grid min-h-[90vh] items-center gap-10 overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-[var(--ruby-deep)] via-[var(--ruby-accent)] to-[var(--ruby-accent)] px-5 py-20 text-center text-[var(--ruby-cover-text)] shadow-[0_35px_90px_-45px_rgba(100,20,45,.8)] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_at_80%_15%,rgba(235,173,133,.24),transparent_42%)] md:grid-cols-[1.1fr_.9fr] md:px-10 md:text-left lg:gap-16 lg:px-14 lg:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute right-[12%] top-12 hidden h-48 w-48 rounded-full opacity-40 md:block" style={{ background: "repeating-conic-gradient(from 0deg, var(--ruby-gold) 0 1deg, transparent 1deg 12deg)", maskImage: "radial-gradient(circle, transparent 28%, #000 29%, #000 31%, transparent 32%, transparent 46%, #000 47%, #000 48%, transparent 49%, transparent 70%, #000 71%, #000 72%, transparent 73%)" }} />

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 order-2 md:order-1">
            <p className="text-[10px] font-semibold uppercase tracking-[.32em] text-[var(--ruby-cover-text)]">The wedding of</p>
            <Sparkles className="mx-auto my-5 h-5 w-5 text-[var(--ruby-gold)] md:mx-0" strokeWidth={1.3} />
            <p className="font-serif-luxury text-xl italic text-[var(--ruby-cover-text)]">ශ්‍රී සුභ මංගලම්!</p>
            <h1 className="mt-4 break-words font-serif-luxury text-5xl leading-tight text-[var(--ruby-cover-text)] sm:text-6xl lg:text-7xl">
              {data.brideName}
              <span className="my-1 block font-script-romantic text-4xl text-[var(--ruby-gold)]">&amp;</span>
              {data.groomName}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-[var(--ruby-cover-text)] md:mx-0">{data.greetingMessage ?? `Dearest ${guest}, joyfully join us as we begin our forever.`}</p>

            {(data.brideParents || data.groomParents) && <div className="mx-auto mt-7 grid max-w-md grid-cols-2 gap-5 text-sm text-[var(--ruby-cover-text)] md:mx-0">
              <p>{data.brideParents && <><span className="mb-1 block text-[9px] uppercase tracking-[.2em] text-[var(--ruby-gold)]">Daughter of</span>{data.brideParents}</>}</p>
              <p>{data.groomParents && <><span className="mb-1 block text-[9px] uppercase tracking-[.2em] text-[var(--ruby-gold)]">Son of</span>{data.groomParents}</>}</p>
            </div>}

            <div className="mx-auto mt-8 inline-flex items-center gap-4 rounded-full border border-[var(--ruby-gold)]/50 bg-[var(--ruby-cover-text)]/10 px-5 py-3 shadow-sm backdrop-blur md:mx-0">
              <CalendarDays className="h-5 w-5 text-[var(--ruby-gold)]" strokeWidth={1.4} />
              <span><span className="block text-[9px] uppercase tracking-[.2em] text-[var(--ruby-cover-text)]">Save the date</span><span className="font-serif-luxury text-sm text-[var(--ruby-cover-text)]">{formatDateBanner(data.weddingDate)}</span></span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }} className="relative order-1 mx-auto w-full max-w-sm md:order-2">
            <div className="absolute -inset-5 rounded-[48%] bg-gradient-to-b from-[var(--ruby-gold)]/45 via-transparent to-[var(--ruby-deep)]/35 blur-xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[48%] rounded-b-[2rem] bg-gradient-to-br from-[var(--ruby-gold)] via-[var(--ruby-blush)] to-[var(--ruby-accent)] shadow-[0_30px_80px_-35px_rgba(35,4,15,.8)]">
              {photo ? <img src={photo} alt={`${data.brideName} and ${data.groomName}`} className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" /> : <div className="grid h-full place-items-center"><Heart className="h-16 w-16 text-[var(--ruby-button-text)]/80" strokeWidth={1} /></div>}
              <div className="pointer-events-none absolute inset-3 rounded-t-[48%] rounded-b-[1.5rem] border border-white/55" />
            </div>
            <motion.span aria-hidden="true" className="absolute -left-5 top-1/4 text-3xl text-[var(--ruby-gold)]" animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity }}>✦</motion.span>
            <motion.span aria-hidden="true" className="absolute -right-4 bottom-1/4 text-2xl text-[var(--ruby-blush)]" animate={{ y: [0, 9, 0], rotate: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity }}>♡</motion.span>
          </motion.div>
          <a href="#countdown" className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[.3em] text-[var(--ruby-cover-text)] transition-colors hover:text-[var(--ruby-button-text)]">Scroll to explore ↓</a>
        </section>

        {/* Countdown */}
        {data.weddingDate && <motion.section id="countdown" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={fadeUp} className="mx-auto max-w-3xl py-12 text-center sm:py-16">
          <p className={eyebrow}>The big day awaits</p>
          <h2 className={heading}>Counting down</h2>
          <div className="mt-7 grid grid-cols-4 gap-2 sm:gap-4">{Object.entries(countdown).map(([label, value]) => <div key={label} className="rounded-2xl border border-[var(--ruby-border)] bg-[var(--ruby-surface)]/85 py-4 shadow-sm sm:py-5"><strong className="block font-serif-luxury text-2xl text-[var(--ruby-accent)] sm:text-4xl">{String(value).padStart(2, "0")}</strong><span className="mt-1 block text-[8px] uppercase tracking-[.2em] text-[var(--ruby-muted)] sm:text-[10px]">{label}</span></div>)}</div>
        </motion.section>}

        {/* When, where and event timeline */}
        <motion.section id="celebration" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} variants={fadeUp} className="grid gap-8 py-12 md:grid-cols-2 md:items-center md:py-16">
          <div className="text-center md:text-left">
            <p className={eyebrow}>Celebrate with us</p>
            <h2 className={heading}>A day to remember</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--ruby-muted)] md:mx-0">We would be honoured to celebrate this joyful beginning together with you.</p>
            <div className={`${card} mt-6 text-center`}>
              <CalendarDays className="mx-auto h-6 w-6 text-[var(--ruby-accent)]" strokeWidth={1.3} />
              <p className="mt-3 font-serif-luxury text-xl text-[var(--ruby-accent)]">{formatDateLong(data.weddingDate)}</p>
              {data.weddingTime && <p className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--ruby-muted)]"><Clock3 className="h-4 w-4 text-[var(--ruby-accent)]" />{formatTime(data.weddingTime)}</p>}
              <p className="mt-4 flex items-start justify-center gap-2 text-sm leading-6 text-[var(--ruby-muted)]"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--ruby-accent)]" />{venueLine(data.venueName, data.venueAddress)}</p>
              {map && <a href={map} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full bg-[var(--ruby-accent)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[var(--ruby-button-text)] transition-colors hover:bg-[var(--ruby-deep)]">View on map</a>}
            </div>
          </div>
          {data.eventsSchedule.length > 0 && <div className={`${card} relative`}>
            <p className={eyebrow}>Celebrate with us</p><h3 className="mt-2 font-serif-luxury text-2xl text-[var(--ruby-accent)]">Wedding events</h3>
            <ol className="mt-6 space-y-5 border-l border-[var(--ruby-accent)]/45 pl-5">{data.eventsSchedule.map((event, index) => <motion.li key={`${event.name}-${index}`} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="relative"><span className="absolute -left-[1.62rem] top-1 h-3 w-3 rounded-full border-2 border-[var(--ruby-surface)] bg-[var(--ruby-accent)] shadow-[0_0_0_1px_var(--ruby-accent)]" /><span className="text-xs font-semibold tracking-wide text-[var(--ruby-accent)]">{formatTime(event.time)}</span><p className="mt-1 text-sm">{event.name}</p>{event.venue && <p className="mt-1 text-xs text-[var(--ruby-muted)]">{event.venue}</p>}</motion.li>)}</ol>
          </div>}
        </motion.section>

        {/* Photo gallery */}
        {data.gallery.length > 0 && <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={fadeUp} className="py-12 text-center sm:py-16">
          <p className={eyebrow}>Little moments, a lifetime of love</p><h2 className={heading}>Our gallery</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">{data.gallery.map((src, index) => <motion.div key={`${src}-${index}`} whileHover={{ y: -5, rotate: index % 2 ? 1 : -1 }} transition={{ duration: .25 }} className={`overflow-hidden rounded-2xl bg-[var(--ruby-blush)] shadow-lg ${index === 0 ? "row-span-2" : ""}`}><img src={src} alt={`Wedding memory ${index + 1}`} loading="lazy" className={`w-full object-cover ${index === 0 ? "h-full min-h-64" : "h-48 sm:h-56"}`} /></motion.div>)}</div>
        </motion.section>}

        {/* RSVP */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} variants={fadeUp} className="relative my-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--ruby-blush)] via-[var(--ruby-surface)] to-[var(--ruby-blush)] px-5 py-12 text-center sm:px-10 sm:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[var(--ruby-accent)]/20" />
          <div className="relative mx-auto max-w-md">
            <p className={eyebrow}>Kindly reply{data.rsvpDeadline ? ` by ${formatDateLong(data.rsvpDeadline)}` : ""}</p><h2 className={heading}>Will you join us?</h2>
            {rsvp.submitted ? <div className={`${card} mt-7`}><Heart className="mx-auto h-8 w-8 text-[var(--ruby-accent)]" /><p className="mt-3 font-serif-luxury text-xl text-[var(--ruby-accent)]">Thank you!</p><p className="mt-2 text-sm">{rsvp.attend ? rsvp.count > 1 ? `We look forward to welcoming your party of ${rsvp.count}.` : "We look forward to celebrating with you." : "We will miss you and send our warmest wishes."}</p><button type="button" onClick={rsvp.edit} className="mt-4 text-xs text-[var(--ruby-accent)] underline">Change response</button></div> : <form onSubmit={rsvp.submit} className="mt-7 space-y-3 text-left">
              {rsvp.askName && <input className={field} placeholder="Your name" value={rsvp.name} maxLength={150} disabled={disabled} onChange={(event) => rsvp.setName(event.target.value)} />}
              <div className="grid grid-cols-2 gap-2"><button type="button" disabled={disabled} onClick={() => rsvp.setAttend(true)} className={`rounded-xl border px-2 py-3 text-xs transition-colors ${rsvp.attend === true ? "border-[var(--ruby-accent)] bg-[var(--ruby-accent)] text-[var(--ruby-button-text)]" : "border-[var(--ruby-border)] bg-[var(--ruby-surface)]/85"}`}>Joyfully accept</button><button type="button" disabled={disabled} onClick={() => rsvp.setAttend(false)} className={`rounded-xl border px-2 py-3 text-xs transition-colors ${rsvp.attend === false ? "border-[var(--ruby-accent)] bg-[var(--ruby-accent)] text-[var(--ruby-button-text)]" : "border-[var(--ruby-border)] bg-[var(--ruby-surface)]/85"}`}>Regretfully decline</button></div>
              {rsvp.attend === true && <div className="flex items-center justify-center gap-5"><button type="button" aria-label="Remove one guest" onClick={rsvp.decrement} className="h-9 w-9 rounded-full border border-[var(--ruby-border)] bg-[var(--ruby-surface)]/70">−</button><span className="font-serif-luxury text-lg">{rsvp.count} guest{rsvp.count === 1 ? "" : "s"}</span><button type="button" aria-label="Add one guest" onClick={rsvp.increment} className="h-9 w-9 rounded-full border border-[var(--ruby-border)] bg-[var(--ruby-surface)]/70">+</button></div>}
              {rsvp.error && <p role="alert" className="text-center text-xs text-red-700">{rsvp.error}</p>}
              <button type="submit" disabled={disabled || rsvp.attend === null || rsvp.sending} className="w-full rounded-full bg-[var(--ruby-accent)] py-3 text-xs font-semibold uppercase tracking-[.2em] text-[var(--ruby-button-text)] transition-colors hover:bg-[var(--ruby-deep)] disabled:opacity-50">{disabled ? "RSVP disabled in preview" : rsvp.sending ? "Sending…" : "Send RSVP"}</button>
            </form>}
          </div>
        </motion.section>

        {/* Wishes */}
        <section className="mx-auto max-w-2xl py-10 sm:py-14">
          <div className="text-center"><p className={eyebrow}>A note from the heart</p><h2 className={heading}>Send your wishes</h2></div>
          <form onSubmit={wish.submit} className="mt-6 space-y-3">{wish.askName && <input className={field} placeholder="Your name" value={wish.name} maxLength={150} disabled={disabled} onChange={(event) => wish.setName(event.target.value)} />}<textarea className={`${field} resize-none`} rows={3} placeholder={disabled ? "Wishes are disabled in preview" : "Write a message for the couple"} value={wish.text} maxLength={1000} disabled={disabled} onChange={(event) => wish.setText(event.target.value)} /><button type="submit" disabled={disabled || wish.sending || !wish.text.trim()} className="w-full rounded-full border border-[var(--ruby-accent)] py-3 text-xs font-semibold uppercase tracking-[.2em] text-[var(--ruby-accent)] transition-colors hover:bg-[var(--ruby-accent)]/10 disabled:opacity-50">{wish.sending ? "Sending…" : "Send a wish"}</button>{wish.error && <p role="alert" className="text-xs text-red-700">{wish.error}</p>}{wish.sent && <p className="text-center text-sm text-[var(--ruby-accent)]">Thank you for your lovely wish.</p>}</form>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{wishes.map((item) => <blockquote key={item.id} className={`${card} text-sm`}><p className="italic">“{item.message}”</p><footer className="mt-3 text-right text-xs text-[var(--ruby-muted)]">— {item.name}</footer></blockquote>)}</div>
        </section>

        <footer className="border-t border-[var(--ruby-border)] py-9 text-center"><p className="font-script-romantic text-4xl text-[var(--ruby-accent)]">{data.brideName} &amp; {data.groomName}</p><p className="mt-2 text-[9px] uppercase tracking-[.25em] text-[var(--ruby-muted)]">With love &amp; blessings · {formatDateBanner(data.weddingDate)}</p></footer>
      </div>
    </main>
    {actions.mode === "demo" && <RubyCustomizer settings={settings} onChange={setDemoSettings} />}
    </>
  );
}
