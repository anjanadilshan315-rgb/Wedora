"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Heart, MapPin, Send } from "lucide-react";
import { formatDateLong, formatTime } from "../format";
import { useInvitationActions } from "../hooks";
import type { TemplateProps } from "../types";
import type { FreeTheme } from "@/lib/free-invitation";
import styles from "./FreeArchTemplate.module.css";

interface FreeArchProps extends TemplateProps {
  theme?: FreeTheme;
  whatsapp?: string;
  localReplies?: boolean;
}

/** Small vector illustrations stay sharp without adding image downloads. */
function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 360" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M97 350C68 264 132 176 99 37M94 302C57 262 38 228 28 184M93 266C127 238 151 206 161 163M103 210C75 181 55 148 52 111M108 167C133 144 145 110 145 79M105 114C83 90 78 59 81 28" />
        <path d="M29 190C8 171 12 144 17 133C35 144 43 166 29 190ZM43 231C17 222 9 201 10 188C34 190 48 207 43 231ZM68 274C42 275 22 257 18 245C42 240 62 248 68 274ZM94 302C112 278 138 277 151 280C145 301 122 315 94 302ZM120 243C122 216 143 203 158 201C162 224 147 244 120 243ZM151 193C143 167 154 147 166 138C180 156 176 180 151 193ZM102 208C77 209 59 192 55 177C79 172 97 184 102 208ZM62 149C38 136 34 112 38 99C61 107 71 126 62 149ZM112 159C109 133 127 112 141 108C148 131 136 151 112 159ZM138 113C126 91 130 66 141 53C159 70 158 95 138 113ZM93 86C68 74 63 48 68 35C90 42 101 63 93 86ZM100 55C88 33 95 10 104 3C119 24 116 43 100 55Z" />
        <path d="M28 184L17 143M66 272L28 250M99 302L139 285M121 240L151 210M152 189L164 148M103 205L64 184M61 144L42 108M114 154L136 118M138 107L142 64M92 81L72 44" opacity=".6" />
      </g>
    </svg>
  );
}

/** The same invitation layout is reused for all three Free Plan colours. */
export default function FreeArchTemplate({ data, actions, theme = "lotus", whatsapp = "", localReplies = false }: FreeArchProps) {
  const { rsvp, disabled } = useInvitationActions(data, actions);
  const [shareMessage, setShareMessage] = useState("");
  const dateText = formatDateLong(data.weddingDate);
  const preview = actions.mode !== "live";
  const date = data.weddingDate ? new Date(`${data.weddingDate.slice(0, 10)}T12:00:00`) : null;
  const hasDate = date && !Number.isNaN(date.getTime());
  const month = hasDate ? date.toLocaleDateString("en-GB", { month: "long" }) : "Our special day";
  const day = hasDate ? date.getDate().toString().padStart(2, "0") : "—";
  const year = hasDate ? date.getFullYear() : "";
  const weekday = hasDate ? date.toLocaleDateString("en-GB", { weekday: "long" }) : "Date to be announced";
  const replyText = `Hi! I'm ${rsvp.name || data.guestName || "your guest"}. ${rsvp.attend ? "Yes, I will attend" : "Sorry, I cannot attend"} ${data.brideName} & ${data.groomName}'s wedding.`;
  const replyLink = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(replyText)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Invitation link copied.");
    } catch {
      setShareMessage("Copy the invitation link from your browser's address bar.");
    }
  }

  function shareOnWhatsApp() {
    const message = `You are invited to ${data.brideName} & ${data.groomName}'s wedding. ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className={`${styles.invitation} ${styles[theme]}`}>
      {/* 1. A stationery-inspired cover with vector botanical artwork. */}
      <header className={styles.hero}>
        <div className={styles.coverTop} aria-hidden="true"><span>THE WEDDING EDITION</span><span>{year || "WITH LOVE"}</span></div>
        <BotanicalSprig className={styles.botanicalLeft} />
        <BotanicalSprig className={styles.botanicalRight} />
        <div className={styles.arch}>
          <div className={styles.seal} aria-hidden="true"><Heart size={22} strokeWidth={1} /><span>Liora</span></div>
          <p className={styles.eyebrow}>A celebration of love</p>
          {data.guestName && <p className={styles.guest}>Dear {data.guestName},</p>}
          <h1 className={styles.names}>
            <span>{data.brideName}</span><span className={styles.amp}>&amp;</span><span>{data.groomName}</span>
          </h1>
          <p className={styles.heroInvitation}>Together with our families,<br />we invite you to our wedding.</p>
          <div className={styles.rule} />
          <p className={styles.date}>{month} <span>{day}</span> {year}</p>
          <p className={styles.heroVenue}>{data.venueName || "A beautiful day awaits"}</p>
          <a href="#free-rsvp" className={styles.coverRsvp}>Kindly RSVP <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <a href="#free-message" className={styles.scrollCue}><span>THE INVITATION</span><ArrowDown size={16} aria-hidden="true" /></a>
      </header>

      {/* 2. Editable couple and family details come from the existing data type. */}
      <section id="free-message" className={`${styles.section} ${styles.messageSection}`} aria-label="Our invitation">
        <p className={styles.eyebrow}>With full hearts &amp; open arms</p>
        <span className={styles.quoteMark} aria-hidden="true">“</span>
        <p className={styles.message}>{data.greetingMessage || "We would love you to join us as we begin our forever."}</p>
        <div className={styles.ornament} aria-hidden="true"><span /><Heart size={14} strokeWidth={1} /><span /></div>
        <p className={styles.messageClosing}>Your presence would mean the world to us.</p>
      </section>
      <section className={`${styles.section} ${styles.alternate}`}>
        <p className={styles.eyebrow}>Two hearts. One beautiful beginning.</p>
        <h2>Meet the <em>happy couple</em></h2>
        <div className={styles.couple}>
          {[{ name: data.brideName, role: "The bride", family: data.brideParents }, { name: data.groomName, role: "The groom", family: data.groomParents }].map((person) => (
            <article className={styles.person} key={person.role}>
              <div className={styles.monogram} aria-hidden="true">{Array.from(person.name)[0]}</div>
              <p className={styles.personRole}>{person.role}</p>
              <h3>{person.name}</h3>
              {person.family && <p className={styles.muted}>{person.family}</p>}
            </article>
          ))}
        </div>
      </section>

      <div className={styles.detailsGrid}>
      <section className={`${styles.section} ${styles.dateSection}`}>
        <p className={styles.eyebrow}>01 / When</p>
        <h2>A date with <em>forever</em></h2>
        <div className={styles.dateCard}>
          <p className={styles.calendarMonth}>{month} {year}</p>
          <p className={styles.largeDate}>{day}</p>
          <div className={styles.calendarBottom}><span>{weekday}</span><span>{formatTime(data.weddingTime) || "Time to be announced"}</span></div>
          <span className={styles.srOnly}>{dateText}</span>
        </div>
      </section>
      <section className={`${styles.section} ${styles.venueSection}`}>
        <p className={styles.eyebrow}>02 / Where</p>
        <h2>A place to <em>celebrate</em></h2>
        <div className={styles.venueCard}>
          <div className={styles.venueIllustration} aria-hidden="true"><BotanicalSprig /><MapPin size={30} strokeWidth={1} /></div>
          <h3>{data.venueName || "Venue to be announced"}</h3>
          {data.venueAddress && <p className={styles.muted}>{data.venueAddress}</p>}
          <p className={styles.venueNote}>We can’t wait to see you there.</p>
        </div>
      </section>
      </div>

      {/* 3. Use the shared RSVP hook; preview mode never sends a real reply. */}
      <section id="free-rsvp" className={`${styles.section} ${styles.rsvpSection}`}>
        <div className={styles.rsvpIntro}>
        <p className={styles.eyebrow}>The celebration is better with you</p>
        <h2>We saved you<br /><em>a little place.</em></h2>
        <p className={styles.rsvpLead}>Will you join us as we begin our next chapter?</p>
        <p className={styles.muted}>{data.rsvpDeadline ? `Kindly reply by ${formatDateLong(data.rsvpDeadline)}.` : "Please let us know if you can come."}</p>
        {localReplies && <p className={styles.notice}>Your reply is saved on this device only. Please also tell the couple{whatsapp ? " using the WhatsApp button after replying" : " directly"}.</p>}
        {actions.mode === "demo" && <p className={styles.notice}>Sample invitation. Replies here are for demonstration only.</p>}
        </div>
        {rsvp.submitted ? (
          <div className={styles.card} role="status">
            <div className={styles.replyCheck}><Check size={24} strokeWidth={1.3} aria-hidden="true" /></div>
            <h3>{rsvp.attend ? "We look forward to celebrating!" : "Thank you for letting us know."}</h3>
            <p className={styles.muted}>{localReplies ? "Your answer is saved on this device." : "Your reply has been recorded."}</p>
            <div className={styles.actions}>
              {whatsapp && <a className={styles.button} href={replyLink} target="_blank" rel="noopener noreferrer">Tell the couple on WhatsApp</a>}
              <button className={styles.outlineButton} type="button" onClick={rsvp.edit}>Change my reply</button>
            </div>
          </div>
        ) : (
          <form className={`${styles.card} ${styles.form}`} onSubmit={rsvp.submit}>
            <p className={styles.formHeading}>A note to the happy couple</p>
            <fieldset disabled={disabled || rsvp.sending}>
              {rsvp.askName && <label className={styles.field}>Your name<input required autoComplete="name" maxLength={150} value={rsvp.name} onChange={(event) => rsvp.setName(event.target.value)} /></label>}
              <fieldset className={styles.choices}>
                <legend>Can you attend?</legend>
                {[{ value: true, label: "Yes, I will be there" }, { value: false, label: "Sorry, I cannot make it" }].map((choice) => (
                  <label className={styles.choice} key={choice.label}>
                    <input required type="radio" name="free-attendance" checked={rsvp.attend === choice.value} onChange={() => rsvp.setAttend(choice.value)} />
                    <span>{choice.label}</span>
                  </label>
                ))}
              </fieldset>
              {rsvp.error && <p role="alert" className={styles.error}>{rsvp.error}</p>}
              <button type="submit" className={styles.button} disabled={disabled || rsvp.attend === null || rsvp.sending}>{disabled ? "Replies disabled in preview" : rsvp.sending ? "Saving reply…" : "Send reply"}<Send size={15} aria-hidden="true" /></button>
            </fieldset>
          </form>
        )}
      </section>

      {!preview && <section className={`${styles.section} ${styles.shareSection}`}>
        <p className={styles.eyebrow}>Spread a little happiness</p>
        <h2>Love is meant <em>to be shared.</em></h2>
        <p className={styles.muted}>A little link to a very special day.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={shareOnWhatsApp}>Share on WhatsApp</button>
          <button type="button" className={styles.outlineButton} onClick={copyLink}>Copy link</button>
        </div>
        <p role="status" className={styles.notice}>{shareMessage}</p>
      </section>}
      <footer className={styles.footer}>
        <BotanicalSprig className={styles.footerSprig} />
        <p className={styles.eyebrow}>And so our forever begins</p>
        <p className={styles.footerNames}>{data.brideName} &amp; {data.groomName}</p>
        <p>Thank you for celebrating with us.</p>
        <Link href="/packages" className={styles.watermark}>Made with Liora · Free Plan</Link>
      </footer>
    </main>
  );
}
