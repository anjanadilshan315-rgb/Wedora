"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { DM_Sans } from "next/font/google";
import { Palette, X } from "lucide-react";
import { formatDateLong, formatTime, mapLink } from "../format";
import { useCountdown } from "../hooks";
import { GILDED_COLOURS, gildedSettings, gildedStyle, type GildedSettings } from "../gilded";
import GildedEditor from "../GildedEditor";
import { SunsetSound } from "../sunset-sound";
import type { TemplateProps } from "../types";
import "./gilded-celebration.css";
import GildedBackground from "./GildedBackground";
import GildedBotanical from "./GildedBotanical";

const bodyFont = DM_Sans({
  variable: "--font-gilded-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const captions = ["Our Journey", "Beautiful Moments", "Forever Memories"];

export default function GildedCelebrationTemplate({ data, actions }: TemplateProps) {
  const [demoSettings, setDemoSettings] = useState<GildedSettings | null>(null);
  const settings =
    actions.mode === "demo" && demoSettings ? demoSettings : gildedSettings(data.gilded);
  const [opened, setOpened] = useState(false);
  const [guestDemo, setGuestDemo] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [qrFailed, setQrFailed] = useState(false);
  const [shareName, setShareName] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [name, setName] = useState(data.guestName || "");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState(
    actions.rsvp && actions.rsvp.status !== "pending"
      ? actions.rsvp.status === "attending"
        ? "yes"
        : "no"
      : "",
  );
  const [count, setCount] = useState(Math.max(1, Math.min(5, actions.rsvp?.headCount || 1)));
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(
    Boolean(actions.rsvp && actions.rsvp.status !== "pending"),
  );
  const [sending, setSending] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const sentNote = useRef("");
  const dialog = useRef<HTMLDialogElement>(null);
  const customizerButton = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const sound = useRef<SunsetSound | null>(null);
  const audioOperation = useRef(0);
  const countdown = useCountdown(data.weddingDate, data.weddingTime);
  const disabled = actions.mode === "preview";
  const photoInitials = `${data.brideName.charAt(0)}${data.groomName.charAt(0)}`;
  const couple = `${data.brideName} & ${data.groomName}`;
  const heroPhoto = data.coverPhoto || data.gallery[0] || null;
  const storyPhoto = data.coverPhoto || data.gallery[1] || null;

  // Reveal each section once as it enters the screen. Content stays visible
  // when reduced motion is requested or IntersectionObserver is unavailable.
  useEffect(() => {
    if (!opened || !root.current || typeof IntersectionObserver === "undefined") return;
    const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return;
    const container = root.current;
    const items = container.querySelectorAll<HTMLElement>(
      ".section-head, .story-art, .story-copy, .gallery figure, .event-card, .quote-section, .rsvp-form, .share-panel",
    );
    items.forEach((item, index) => {
      item.classList.add("gilded-reveal");
      item.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 100}ms`);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("gilded-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    items.forEach((item) => observer.observe(item));
    const revealAll = () => {
      if (!motionPreference.matches) return;
      observer.disconnect();
      items.forEach((item) => item.classList.add("gilded-visible"));
    };
    motionPreference.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", revealAll);
      items.forEach((item) => item.classList.remove("gilded-reveal", "gilded-visible"));
    };
  }, [opened]);

  useEffect(() => {
    const url = new URL(location.href);
    // The public QR never contains guest names, email addresses or invite codes.
    setPublicUrl(`${url.origin}${url.pathname}`);
    try {
      if (sessionStorage.getItem(`wedora.gilded.opened:${url.pathname}`) === "yes") setOpened(true);
    } catch {
      /* Storage is optional. */
    }
    if (actions.mode !== "demo") return;
    setGuestDemo(url.searchParams.get("v") === "1");
    const queryDesign: Record<string, string> = {};
    for (const [key] of GILDED_COLOURS)
      if (url.searchParams.has(key)) queryDesign[key] = `#${url.searchParams.get(key)}`;
    if (url.searchParams.has("font")) queryDesign.font = url.searchParams.get("font") || "classic";
    let saved: unknown;
    try {
      saved = JSON.parse(localStorage.getItem("wedora.gilded.demo") || "null");
    } catch {
      /* Ignore unavailable storage. */
    }
    if (Object.keys(queryDesign).length)
      setDemoSettings(gildedSettings({ ...gildedSettings(data.gilded), ...queryDesign }));
    else if (saved && typeof saved === "object" && url.searchParams.get("v") !== "1")
      setDemoSettings(gildedSettings({ ...gildedSettings(data.gilded), ...saved }));
  }, [actions.mode]);

  useEffect(() => {
    if (actions.mode === "demo" && demoSettings && !guestDemo) {
      try {
        localStorage.setItem("wedora.gilded.demo", JSON.stringify(demoSettings));
      } catch {
        /* Ignore unavailable storage. */
      }
    }
  }, [actions.mode, demoSettings, guestDemo]);

  useEffect(() => {
    if (opened && !customizing) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [opened, customizing]);

  useEffect(() => {
    return () => {
      audioOperation.current++;
      sound.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) {
        audioOperation.current++;
        sound.current?.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  function openInvitation() {
    setOpened(true);
    try {
      sessionStorage.setItem(`wedora.gilded.opened:${location.pathname}`, "yes");
    } catch {
      /* Opening also works without storage. */
    }
    requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
  }

  async function toggleMusic() {
    const operation = ++audioOperation.current;
    setMusicError("");
    if (playing) {
      sound.current?.pause();
      setPlaying(false);
      return;
    }
    sound.current ??= new SunsetSound();
    const success = await sound.current.play(settings.musicUrl);
    if (operation !== audioOperation.current) return;
    setPlaying(success);
    if (!success) setMusicError("Music could not play. Please check the music link and try again.");
  }

  async function submitRsvp(event: FormEvent) {
    event.preventDefault();
    if (disabled || sending) return;
    setRsvpError("");
    if (
      data.rsvpDeadline &&
      Date.now() > new Date(`${data.rsvpDeadline}T23:59:59+05:30`).getTime()
    ) {
      setRsvpError("The RSVP deadline has passed. Please contact the couple.");
      return;
    }
    const guestName = (actions.guestIdentified ? data.guestName || "" : name).trim();
    if (
      !guestName ||
      !email.trim() ||
      !attendance ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 5
    ) {
      setRsvpError("Please enter your name, email and attendance response.");
      return;
    }
    setSending(true);
    try {
      // Save an optional wish first. Retrying RSVP will not send it twice.
      const wish = note.trim();
      if (wish && wish !== sentNote.current) {
        await actions.submitWish(guestName, wish);
        sentNote.current = wish;
      }
      // The existing API stores zero guests for declined invitations itself.
      await actions.submitRsvp({
        name: guestName,
        email: email.trim(),
        attending: attendance === "yes",
        headCount: count,
      });
      setSubmitted(true);
    } catch {
      setRsvpError("We could not send your response. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function guestLink() {
    const url = new URL(publicUrl || location.href);
    url.search = "";
    url.hash = "";
    if (shareName.trim()) url.searchParams.set("guest", shareName.trim().slice(0, 150));
    if (actions.mode === "demo") {
      for (const [key] of GILDED_COLOURS) url.searchParams.set(key, settings[key].slice(1));
      url.searchParams.set("font", settings.font);
      url.searchParams.set("v", "1");
    }
    return url.href;
  }

  async function copyGuestLink() {
    const url = guestLink();
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Guest link copied!");
    } catch {
      setShareStatus(`Copy this guest link: ${url}`);
    }
  }

  function shareReminder() {
    const deadline = data.rsvpDeadline
      ? ` Please RSVP by ${formatDateLong(data.rsvpDeadline)}.`
      : "";
    const text = `Reminder: You're invited to ${couple}'s wedding on ${formatDateLong(data.weddingDate)}!${deadline} ${guestLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      ref={root}
      className={`gildedInvitation mode-${actions.mode} ${opened ? "gilded-opened" : ""} ${bodyFont.variable}`}
      style={gildedStyle(settings)}
    >
      <GildedBackground />
      <div className={`opening ${opened ? "hide" : ""}`} inert={opened} aria-hidden={opened}>
        <div className="envelope">
          <GildedBotanical className="opening-botanical" />
          <div className="seal">F</div>
          <p className="opening-kicker">THE GILDED CELEBRATION</p>
          <h1>You&apos;re Invited</h1>
          <div className="opening-rule" aria-hidden="true" />
          <p className="opening-couple">{couple}</p>
          <p className="opening-date">{formatDateLong(data.weddingDate)}</p>
          <button type="button" className="btn" onClick={openInvitation}>
            Open Invitation ✧
          </button>
        </div>
      </div>
      <div className="gilded-content" inert={!opened}>
        <header className="nav">
          <a className="brand" href="#home">
            <span className="brand-word">
              Forever<span>✧</span>
            </span>
            <small>A celebration of love</small>
          </a>
          <nav aria-label="Invitation sections">
            <a href="#story">Our Story</a>
            {data.gallery.length > 0 && <a href="#gallery">Gallery</a>}
            <a href="#events">Events</a>
            <a href="#rsvp">RSVP</a>
          </nav>
          <button type="button" className="music" aria-pressed={playing} onClick={toggleMusic}>
            ♫ Music {playing ? "On" : "Off"}
          </button>
        </header>
        {musicError && (
          <p className="music-error" role="status">
            {musicError}
          </p>
        )}
        <main ref={main} tabIndex={-1}>
          <section id="home" className="hero">
            <GildedBotanical className="hero-botanical" />
            <div className="hero-copy">
              <div className="hero-edition">
                <span aria-hidden="true">✧</span> THE WEDDING CELEBRATION
              </div>
              <p className="eyebrow">TOGETHER WITH THEIR FAMILIES</p>
              <h1>
                <span>{data.brideName}</span> <em>&amp;</em> <span>{data.groomName}</span>
              </h1>
              <p className="hero-sub">JOYFULLY INVITE YOU TO CELEBRATE THEIR WEDDING</p>
              <div className="gold-rule" />
              <div className="hero-details">
                <p className="date">{formatDateLong(data.weddingDate)}</p>
                <p className="location">{data.venueAddress}</p>
              </div>
              <div className="countdown">
                {Object.entries(countdown).map(([label, value]) => (
                  <div key={label}>
                    <strong>{String(value).padStart(2, "0")}</strong>
                    <small>{label.toUpperCase()}</small>
                  </div>
                ))}
              </div>
              <a href="#events" className="btn outline">
                Explore Our Celebration ↓
              </a>
              {data.guestName && (
                <p className="guest-greeting">A special invitation for {data.guestName}</p>
              )}
            </div>
            <aside className="hero-portrait" aria-label="The couple">
              <div className="portrait-border" aria-hidden="true" />
              <div className="portrait-window">
                {heroPhoto ? (
                  <img src={heroPhoto} alt={couple} fetchPriority="high" />
                ) : (
                  <div className="portrait-monogram">{photoInitials}</div>
                )}
                <div className="portrait-caption">
                  <span>THE BEGINNING OF</span>
                  <p>our forever.</p>
                </div>
              </div>
              <div className="portrait-footnote">
                <span>WITH LOVE &amp; GRATITUDE</span>
                <span>✧</span>
              </div>
            </aside>
          </section>

          <section id="story" className="section story">
            <div className="section-head">
              <span className="eyebrow">A BEAUTIFUL BEGINNING</span>
              <h2>Our Love Story</h2>
              <span className="flourish" aria-hidden="true">
                ✦ ❧ ✦
              </span>
            </div>
            <div className="story-grid">
              <div className="story-art">
                <div className="story-photo">
                  {storyPhoto ? (
                    <img src={storyPhoto} alt={couple} />
                  ) : (
                    <span>{photoInitials}</span>
                  )}
                </div>
              </div>
              <div className="story-copy">
                <p className="eyebrow">A JOURNEY OF TWO HEARTS</p>
                <h3>{settings.storyHeading}</h3>
                <p>{settings.storyText}</p>
                {data.greetingMessage && (
                  <p className="invitation-message">{data.greetingMessage}</p>
                )}
                <p className="signature">With love, {couple}</p>
              </div>
            </div>
          </section>

          {data.gallery.length > 0 && (
            <section id="gallery" className="section gallery">
              <div className="section-head">
                <span className="eyebrow">MEMORIES IN BLOOM</span>
                <h2>Captured Moments</h2>
                <span className="flourish" aria-hidden="true">
                  ✦ ❧ ✦
                </span>
                <p>Our favourite moments, before forever begins.</p>
              </div>
              <div className="gallery-grid">
                {data.gallery.map((photo, index) => (
                  <figure key={`${photo}-${index}`}>
                    <img
                      src={photo}
                      alt={`${couple} — wedding memory ${index + 1}`}
                      loading="lazy"
                    />
                    <figcaption>{captions[index % captions.length]}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <section id="events" className="section events">
            <div className="section-head">
              <span className="eyebrow">THE CELEBRATION</span>
              <h2>Wedding Events</h2>
              <span className="flourish" aria-hidden="true">
                ✦ ❧ ✦
              </span>
              <p>We would be honoured to celebrate with you.</p>
            </div>
            <div className="event-grid">
              {data.eventsSchedule.map((event, index) => {
                const map =
                  settings.eventMaps[index] ||
                  mapLink(
                    null,
                    event.venue || data.venueName,
                    event.venue ? null : data.venueAddress,
                  );
                return (
                  <article className="event-card" key={index}>
                    <span className="event-number">{String(index + 1).padStart(2, "0")}</span>
                    <div className="icon" aria-hidden="true">
                      {["✧", "♕", "❀"][index % 3]}
                    </div>
                    <h3>{event.name}</h3>
                    <p>{formatDateLong(settings.eventDates[index] || data.weddingDate)}</p>
                    <p className="time">{formatTime(event.time)}</p>
                    <p>{event.venue || data.venueName}</p>
                    {event.description && <p>{event.description}</p>}
                    {map && (
                      <a href={map} target="_blank" rel="noopener noreferrer">
                        View Location ↗
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="quote-section">
            <span className="flourish" aria-hidden="true">
              ✧
            </span>
            <blockquote>“{settings.quote}”</blockquote>
            <p>{formatDateLong(data.weddingDate)}</p>
          </section>

          <section id="rsvp" className="section rsvp">
            <div className="section-head">
              <span className="eyebrow">THE PLEASURE OF YOUR COMPANY</span>
              <h2>Kindly RSVP</h2>
              <span className="flourish" aria-hidden="true">
                ✦ ❧ ✦
              </span>
              <p>
                We hope you can join us.
                {data.rsvpDeadline && ` Please reply by ${formatDateLong(data.rsvpDeadline)}.`}
              </p>
            </div>
            {submitted ? (
              <div className="reply-success" role="status">
                <h3>Thank you for your reply!</h3>
                <p>
                  {attendance === "no"
                    ? "We will miss you and send our warmest wishes."
                    : "We look forward to celebrating with you."}
                </p>
                <button
                  type="button"
                  className="btn outline"
                  disabled={disabled}
                  onClick={() => setSubmitted(false)}
                >
                  Change response
                </button>
              </div>
            ) : (
              <form className="rsvp-form" onSubmit={submitRsvp}>
                <label htmlFor="gilded-guest-name">
                  Full name
                  <input
                    id="gilded-guest-name"
                    autoComplete="name"
                    required
                    maxLength={150}
                    value={actions.guestIdentified ? data.guestName || "" : name}
                    disabled={disabled || actions.guestIdentified}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                  />
                </label>
                <label htmlFor="gilded-guest-email">
                  Email address
                  <input
                    id="gilded-guest-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    disabled={disabled}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <label htmlFor="gilded-attendance">
                  Will you attend?
                  <select
                    id="gilded-attendance"
                    required
                    disabled={disabled}
                    value={attendance}
                    onChange={(event) => setAttendance(event.target.value)}
                  >
                    <option value="">Select a response</option>
                    <option value="yes">Joyfully accepts</option>
                    <option value="no">Regretfully declines</option>
                  </select>
                </label>
                {attendance !== "no" && (
                  <label htmlFor="gilded-guest-count">
                    Number of guests (including you)
                    <input
                      id="gilded-guest-count"
                      type="number"
                      min={1}
                      max={5}
                      value={count}
                      required
                      disabled={disabled}
                      onChange={(event) => setCount(Number(event.target.value))}
                    />
                  </label>
                )}
                <label className="wide" htmlFor="gilded-guest-note">
                  A note for the couple
                  <textarea
                    id="gilded-guest-note"
                    rows={4}
                    maxLength={500}
                    value={note}
                    disabled={disabled}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Share your wishes..."
                  />
                </label>
                <button className="btn wide" type="submit" disabled={disabled || sending}>
                  {disabled ? "RSVP disabled in preview" : sending ? "Sending…" : "Send RSVP"}
                </button>
                {rsvpError && (
                  <p className="form-status response-error wide" role="alert">
                    {rsvpError}
                  </p>
                )}
              </form>
            )}
            {actions.mode === "demo" && (
              <p className="note">Demo preview: this reply is not sent to the couple.</p>
            )}
          </section>

          <section id="share" className="section share">
            <div className="section-head">
              <span className="eyebrow">SPREAD THE JOY</span>
              <h2>Share the Invitation</h2>
              <span className="flourish" aria-hidden="true">
                ✦ ❧ ✦
              </span>
            </div>
            <div className="share-panel">
              <div className="qr">
                {publicUrl && !qrFailed ? (
                  <img
                    alt="QR code for the public invitation"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=185x185&data=${encodeURIComponent(publicUrl)}`}
                    loading="lazy"
                    onError={() => setQrFailed(true)}
                  />
                ) : (
                  <a href={publicUrl || "#home"}>Open invitation</a>
                )}
              </div>
              <div>
                <h3>A celebration to remember</h3>
                <p>Share this invitation with your loved ones or copy a personalized guest link.</p>
                <label htmlFor="gilded-share-name">
                  Guest name
                  <input
                    id="gilded-share-name"
                    value={shareName}
                    maxLength={150}
                    onChange={(event) => setShareName(event.target.value)}
                    placeholder="Guest name"
                  />
                </label>
                <div className="share-actions">
                  <button type="button" className="btn" onClick={copyGuestLink}>
                    Copy Guest Link
                  </button>
                  <button type="button" className="btn outline" onClick={shareReminder}>
                    Share Reminder
                  </button>
                </div>
                <p className="form-status share-status" role="status">
                  {shareStatus}
                </p>
              </div>
            </div>
          </section>
        </main>
        <footer>
          <div className="footer-brand">
            Forever<span>✧</span>
          </div>
          <p>THE GILDED CELEBRATION</p>
          <p>Made with love · {couple}</p>
          {actions.mode === "demo" && (
            <small>Demo invitation · All names, dates and venues are examples.</small>
          )}
        </footer>
      </div>
      {actions.mode === "demo" && !guestDemo && (
        <button
          ref={customizerButton}
          type="button"
          className="design-button"
          aria-haspopup="dialog"
          aria-expanded={customizing}
          onClick={() => {
            dialog.current?.showModal();
            setCustomizing(true);
          }}
        >
          <Palette size={18} /> Colours &amp; Fonts
        </button>
      )}
      {actions.mode === "demo" && !guestDemo && (
        <dialog
          ref={dialog}
          className="design-dialog"
          aria-labelledby="gilded-dialog-title"
          onClose={() => {
            setCustomizing(false);
            customizerButton.current?.focus();
          }}
        >
          <div className="design-dialog-heading">
            <h2 id="gilded-dialog-title">Colours &amp; Fonts</h2>
            <button
              type="button"
              autoFocus
              aria-label="Close design options"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </div>
          <GildedEditor settings={settings} onChange={setDemoSettings} demo />
          <button type="button" className="btn" onClick={() => dialog.current?.close()}>
            View invitation
          </button>
        </dialog>
      )}
    </div>
  );
}
