"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Heart, MapPin } from "lucide-react";
import { formatDateLong, formatTime, mapLink } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import type { TemplateProps } from "../types";
import styles from "./ModernTemplate.module.css";

interface ModernTemplateProps extends TemplateProps {
  freePlan?: boolean;
  localReplies?: boolean;
  whatsapp?: string;
}

/** One small Art Deco drawing is reused in all four cover corners. */
function DecoCorner({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1">
        <path d="M8 152V8H152M18 122V18H122M28 92V28H92" />
        <path d="M8 68L68 8M18 88L88 18M28 108L108 28" opacity=".5" />
        <path d="M42 42H64V64H42ZM53 34L72 53L53 72L34 53Z" />
        <path d="M8 142L18 132L28 142L18 152ZM142 8L152 18L142 28L132 18Z" />
      </g>
      <circle cx="53" cy="53" r="4" fill="currentColor" />
    </svg>
  );
}

/** Layout lives here; colours, spacing and mobile rules live in the CSS file. */
export default function ModernTemplate({ data, actions, freePlan = false, localReplies = false, whatsapp = "" }: ModernTemplateProps) {
  const timeLeft = useCountdown(data.weddingDate, data.weddingTime);
  const { disabled, wishes, wish, rsvp } = useInvitationActions(data, actions);
  const [shareMessage, setShareMessage] = useState("");
  const map = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const heroPhoto = data.coverPhoto || data.gallery[0];
  const guestName = data.guestName || "our favourite people";
  const groomInitial = Array.from(data.groomName.trim())[0] || "G";
  const brideInitial = Array.from(data.brideName.trim())[0] || "B";
  const initials = `${groomInitial}${brideInitial}`;
  const weddingDate = data.weddingDate ? new Date(`${data.weddingDate.slice(0, 10)}T12:00:00`) : null;
  const hasDate = weddingDate && !Number.isNaN(weddingDate.getTime());
  const whatsappNumber = whatsapp.replace(/\D/g, "");
  const replyText = `Hi! I'm ${rsvp.name || data.guestName || "your guest"}. ${rsvp.attend ? "Yes, I will attend" : "Sorry, I cannot attend"} ${data.groomName} & ${data.brideName}'s wedding.`;
  const replyLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(replyText)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Invitation link copied.");
    } catch {
      setShareMessage("Copy the invitation link from your browser's address bar.");
    }
  }

  return (
    <div className={styles.invitation}>
      {/* 1. This typographic cover also works without uploaded photos. */}
      <header className={styles.hero}>
        <div className={styles.cornerArtwork}>
          <DecoCorner className={styles.cornerTopLeft} />
          <DecoCorner className={styles.cornerTopRight} />
          <DecoCorner className={styles.cornerBottomLeft} />
          <DecoCorner className={styles.cornerBottomRight} />
        </div>
        <div className={styles.halo} aria-hidden="true" />
        <div className={styles.edition}><span>A celebration of love</span><span>Modern Luxe / Liora</span></div>
        <div className={styles.heroContent}>
          <div className={styles.monogram} aria-hidden="true"><span>{initials}</span></div>
          <p className={styles.eyebrow}>Together with our families</p>
          <h1 className={styles.names}><span>{data.groomName}</span><em>&</em><span>{data.brideName}</span></h1>
          <div className={styles.goldRule} aria-hidden="true" />
          <p className={styles.heroDate}>{formatDateLong(data.weddingDate)}</p>
          <p className={styles.heroVenue}>{data.venueName || "A beautiful beginning awaits"}</p>
          <a href="#modern-details" className={styles.discover}>The invitation <ArrowDown size={14} /></a>
        </div>
        <div className={styles.heroBottom}><span>Two hearts. One beautiful beginning.</span><Heart size={14} strokeWidth={1} aria-hidden="true" /></div>
      </header>

      {/* 2. Personal greeting and optional photo use the existing invitation data. */}
      <section id="modern-details" className={`${styles.section} ${styles.introduction}`}>
        <div className={styles.loveSeal} aria-hidden="true">
          <Heart size={22} strokeWidth={1} />
        </div>
        <p className={styles.eyebrow}>An invitation, especially for you</p>
        <h2>Dear {guestName},</h2>
        <p className={styles.greeting}>{data.greetingMessage || "With full hearts, we invite you to celebrate our wedding and the beginning of our forever."}</p>
        <p className={styles.signature}>Your presence would mean the world to us.</p>
        {(data.groomParents || data.brideParents) && <div className={styles.families}>
          {data.groomParents && <p><span>Groom’s family</span>{data.groomParents}</p>}
          {data.brideParents && <p><span>Bride’s family</span>{data.brideParents}</p>}
        </div>}
        {heroPhoto && <figure className={styles.coverPhoto}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroPhoto} alt={`${data.groomName} and ${data.brideName}`} />
          <figcaption>A little moment. A lifetime of love.</figcaption>
        </figure>}
      </section>

      {data.weddingDate && <section className={styles.countdown} aria-label="Wedding countdown">
        <p className={styles.eyebrow}>Every moment brings us closer</p>
        <div className={styles.countdownGrid}>
          {Object.entries(timeLeft).map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}
        </div>
      </section>}

      {/* 3. These two cards stack on smaller screens. */}
      <section className={styles.section}>
        <p className={styles.eyebrow}>The finer details</p>
        <h2>A day to <em>remember.</em></h2>
        <div className={styles.detailsGrid}>
          <article className={styles.detailCard}>
            <p className={styles.cardNumber}>01 / The date</p>
            {hasDate && <div className={styles.calendarDate} aria-hidden="true">
              <span>{weddingDate.toLocaleDateString("en-GB", { month: "long" })}</span>
              <strong>{String(weddingDate.getDate()).padStart(2, "0")}</strong>
              <span>{weddingDate.getFullYear()}</span>
            </div>}
            <h3>{formatDateLong(data.weddingDate)}</h3>
            <p>{formatTime(data.weddingTime) || "Time to be announced"}</p>
            <span className={styles.cardNote}>The beginning of our next chapter</span>
          </article>
          <article className={styles.detailCard}>
            <p className={styles.cardNumber}>02 / The setting</p>
            <div className={styles.venueEmblem} aria-hidden="true">
              <MapPin size={32} strokeWidth={1} />
              <span>A place for beautiful memories</span>
            </div>
            <h3>{data.venueName || "Venue to be announced"}</h3>
            {data.venueAddress && <p>{data.venueAddress}</p>}
            {map && <a className={styles.textLink} href={map} target="_blank" rel="noopener noreferrer"><MapPin size={14} /> Get directions <ArrowUpRight size={14} /></a>}
          </article>
        </div>
      </section>

      <div className={styles.loveNote}>
        <div className={styles.rings} aria-hidden="true"><span /><span /></div>
        <p>One day. One promise.<br /><em>A lifetime of us.</em></p>
        <span className={styles.eyebrow}>And you, beside us.</span>
      </div>

      {data.eventsSchedule.length > 0 && <section className={`${styles.section} ${styles.schedule}`}>
        <p className={styles.eyebrow}>From the first hello to the last dance</p>
        <h2>The celebration <em>unfolds.</em></h2>
        <ol className={styles.timeline}>{data.eventsSchedule.map((event, index) => <li key={`${event.name}-${index}`}>
          <span>{formatTime(event.time)}</span><div><h3>{event.name}</h3>{(event.description || event.venue) && <p>{event.description || event.venue}</p>}</div>
        </li>)}</ol>
      </section>}

      {data.gallery.length > 0 && <section className={styles.section}>
        <p className={styles.eyebrow}>Our story, in little moments</p>
        <h2>Better <em>together.</em></h2>
        <div className={styles.gallery}>{data.gallery.map((photo, index) => <div key={`${photo}-${index}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt={`${data.groomName} and ${data.brideName}, memory ${index + 1}`} loading="lazy" />
        </div>)}</div>
      </section>}

      {/* 4. Shared hooks keep real replies, demo mode and previews consistent. */}
      <section className={`${styles.section} ${styles.rsvpSection}`}>
        <div className={styles.rsvpIntro}>
          <p className={styles.eyebrow}>A place reserved for you</p>
          <h2>Be part of<br /><em>our forever.</em></h2>
          <p>We would love to celebrate with you.</p>
          <p>{data.rsvpDeadline ? `Kindly reply by ${formatDateLong(data.rsvpDeadline)}.` : "Kindly let us know if you can join us."}</p>
          {localReplies && <p className={styles.notice}>Your reply is saved on this device only. Please also tell the couple{whatsappNumber ? " using WhatsApp after replying" : " directly"}.</p>}
          {actions.mode === "demo" && <p className={styles.notice}>Sample invitation. Replies here are for demonstration only.</p>}
        </div>
        <div className={styles.rsvpCard}>
          {rsvp.submitted ? <div className={styles.confirmation} role="status">
            <Check size={30} aria-hidden="true" />
            <h3>Thank you, {rsvp.name || data.guestName || "friend"}.</h3>
            <p>{localReplies ? "Your answer is saved on this device." : rsvp.attend ? "We can’t wait to celebrate with you." : "We will miss you. Thank you for letting us know."}</p>
            {whatsappNumber && <a className={styles.textLink} href={replyLink} target="_blank" rel="noopener noreferrer">Tell the couple on WhatsApp <ArrowUpRight size={14} /></a>}
            <button type="button" className={styles.editButton} onClick={rsvp.edit}>Change my response</button>
          </div> : <form onSubmit={rsvp.submit} className={styles.form}>
            <h3>Kindly RSVP</h3>
            {rsvp.askName ? (
              <label>
                Your name
                <input
                  autoComplete="name"
                  value={rsvp.name}
                  onChange={(event) => rsvp.setName(event.target.value)}
                  disabled={disabled || rsvp.sending}
                  maxLength={150}
                  required
                  placeholder="Your full name"
                />
              </label>
            ) : <p>{data.guestName}</p>}
            <fieldset disabled={disabled || rsvp.sending}>
              <legend>Will you be joining us?</legend>
              <div className={styles.choices}>
                <button
                  type="button"
                  aria-pressed={rsvp.attend === true}
                  onClick={() => rsvp.setAttend(true)}
                >
                  Joyfully accept
                </button>
                <button
                  type="button"
                  aria-pressed={rsvp.attend === false}
                  onClick={() => rsvp.setAttend(false)}
                >
                  Sadly decline
                </button>
              </div>
            </fieldset>
            {rsvp.attend === true && !freePlan && <div className={styles.guestCount}>
              <span>Number of guests</span>
              <button type="button" aria-label="Remove one guest" disabled={disabled || rsvp.sending || rsvp.count <= 1} onClick={rsvp.decrement}>−</button>
              <span aria-live="polite">{rsvp.count}</span>
              <button type="button" aria-label="Add one guest" disabled={disabled || rsvp.sending || rsvp.count >= 20} onClick={rsvp.increment}>+</button>
            </div>}
            {rsvp.error && <p className={styles.error} role="alert">{rsvp.error}</p>}
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={disabled || rsvp.attend === null || rsvp.sending}
            >
              {disabled ? "RSVP disabled in preview" : rsvp.sending ? "Sending…" : "Send my response"}
              <ArrowUpRight size={16} />
            </button>
          </form>}
        </div>
      </section>

      {!freePlan && <section className={styles.section}>
        <p className={styles.eyebrow}>Words we will treasure</p>
        <h2>A little <em>love note.</em></h2>
        <form onSubmit={wish.submit} className={styles.form}>
          {wish.askName && <label>Your name<input value={wish.name} onChange={(event) => wish.setName(event.target.value)} maxLength={150} disabled={disabled || wish.sending} required autoComplete="name" /></label>}
          <label>Your wishes<textarea value={wish.text} onChange={(event) => wish.setText(event.target.value)} maxLength={1000} disabled={disabled || wish.sending} required rows={3} placeholder="Leave a message for the couple…" /></label>
          <button className={styles.primaryButton} type="submit" disabled={disabled || wish.sending || !wish.text.trim()}>{disabled ? "Wishes disabled in preview" : wish.sending ? "Sending…" : "Send with love"}<Heart size={16} /></button>
          {wish.error && <p className={styles.error} role="alert">{wish.error}</p>}
          {wish.sent && !wish.error && <p role="status">Thank you for your lovely wishes.</p>}
        </form>
        <div className={styles.wishes}>{wishes.map((item) => <blockquote key={item.id}><p>“{item.message}”</p><cite>{item.name}</cite></blockquote>)}</div>
      </section>}

      <footer className={styles.footer}>
        <Heart size={18} strokeWidth={1} aria-hidden="true" />
        <p className={styles.footerNames}>{data.groomName} & {data.brideName}</p>
        <p>With love, always.</p>
        {freePlan && <>
          {actions.mode === "live" && <><button type="button" onClick={copyLink} className={styles.shareButton}>Copy invitation link <ArrowUpRight size={14} /></button><p role="status">{shareMessage}</p></>}
          <Link href="/packages" className={styles.brand}>Made with Liora · Free Plan</Link>
        </>}
      </footer>
    </div>
  );
}
