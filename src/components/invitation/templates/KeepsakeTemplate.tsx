"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { formatDateLong, formatTime, mapLink, venueLine, weddingTimestamp } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import { KEEPSAKE_COLOUR_KEYS, KEEPSAKE_FRAMES, KEEPSAKE_GALLERY_LIMIT, KEEPSAKE_PALETTES, KEEPSAKE_THEMES, KEEPSAKE_THEME_COLOURS, keepsakeSettings, type KeepsakeSettings } from "../keepsake";
import type { TemplateProps } from "../types";
import "./keepsake.css";

const PETAL = "M0 0C13-17 15-45 0-70C-15-45-13-17 0 0Z";
const PHOTO_FRAMES: Record<KeepsakeSettings["photoFrame"], string> = {
  "floral-classic": "M60 40H340Q366 40 366 66V404Q366 430 340 430H60Q34 430 34 404V66Q34 40 60 40Z",
  "circular-floral": "M200 57a168 168 0 1 1 0 336a168 168 0 1 1 0-336Z",
  geometric: "M90 36H310L376 102V358L310 424H90L24 358V102Z",
  "elegant-arch": "M36 430V200a164 164 0 0 1 328 0v230Z",
  royal: "M34 430V176C34 91 95 48 150 48Q200-2 250 48C305 48 366 91 366 176V430Z",
  window: "M24 436V204a176 176 0 0 1 352 0v232Z",
  heart: "M200 424C165 390 24 285 24 166C24 52 153 25 200 122C247 25 376 52 376 166C376 285 235 390 200 424Z",
  "half-circle": "M24 36H176a188 188 0 0 1 0 376H24Z",
};

function PortraitFrameDecoration({ frame }: { frame: KeepsakeSettings["photoFrame"] }) {
  const floral = frame === "floral-classic" || frame === "circular-floral";
  return <g className="portrait-decoration" fill="none" stroke="var(--border-gold)" strokeWidth="1.4" aria-hidden="true">
    {floral && <>
      {frame === "circular-floral"
        ? <><circle cx="200" cy="225" r="180" strokeWidth=".7" /><path d="M42 307C-12 199 63 62 165 46M235 404C342 390 417 253 359 144" /></>
        : <><path d="M18 155V24H145M255 446H382V315" /><path d="M19 134Q-3 62 95 25M305 445Q403 408 381 336" /></>}
      {(frame === "circular-floral" ? [[49, 130, -35], [73, 87, -20], [112, 57, 0], [351, 320, 145], [327, 363, 160], [288, 393, 180]] : [[23, 95, -35], [42, 50, -15], [92, 28, 15], [377, 365, 145], [358, 410, 165], [308, 432, 195]]).map(([x, y, angle], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}>
        {Array.from({ length: 6 }, (_, petal) => <path key={petal} d={PETAL} transform={`rotate(${petal * 60}) scale(.23)`} fill="var(--accent)" fillOpacity=".35" strokeWidth="3" />)}
        <circle r="3.5" fill="var(--gold)" stroke="none" /><path d="M0 17Q-24 12-25-5Q-7-4 0 17ZM6 20Q27 16 26 0Q10 2 6 20Z" fill="var(--accent)" fillOpacity=".2" />
      </g>)}
    </>}
    {frame === "geometric" && <>
      <path d="M76 22H324L390 88V372L324 438H76L10 372V88Z" strokeWidth=".8" />
      <path d="M24 142L130 36M270 36L376 142M24 318L130 424M270 424L376 318" strokeOpacity=".65" />
      {[[200, 22], [390, 230], [200, 438], [10, 230]].map(([x, y]) => <path key={`${x}-${y}`} d="M0-8L5 0L0 8L-5 0Z" transform={`translate(${x} ${y})`} fill="var(--gold)" />)}
    </>}
    {frame === "elegant-arch" && <>
      <path d="M23 439V200a177 177 0 0 1 354 0v239ZM48 416H352" strokeWidth=".7" />
      <path d="M200 9L205 19L200 29L195 19ZM184 442H216M192 448H208" fill="var(--gold)" />
    </>}
    {frame === "royal" && <>
      <path d="M21 441V176C21 84 89 34 145 34Q200-21 255 34C311 34 379 84 379 176V441Z" strokeWidth=".8" />
      <path d="M151 39Q159 13 179 29L200 5L221 29Q241 13 249 39M175 38H225M200 12V32" strokeWidth="2" />
      <path d="M34 404Q8 378 17 353Q43 365 34 389M366 404Q392 378 383 353Q357 365 366 389M136 441Q168 421 200 444Q232 421 264 441M185 448L200 458L215 448" />
      <circle cx="200" cy="40" r="4" fill="var(--gold)" />
    </>}
  </g>;
}

function CouplePortrait({ photo, frame, names, initials, onFrameChange }: { photo: string | null; frame: KeepsakeSettings["photoFrame"]; names: string; initials: string; onFrameChange?: (frame: KeepsakeSettings["photoFrame"]) => void }) {
  const clipId = `${useId()}-portrait`;
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  return <figure className="couple-portrait" data-frame={frame}>
    <span className="portrait-orbit" aria-hidden="true" />
    <span className="portrait-heart portrait-heart-top" aria-hidden="true">♡</span>
    <svg className="portrait-window" viewBox="0 0 400 460" role="img" aria-label={photo && photo !== failedPhoto ? `${names}, together` : `Wedding monogram for ${names}`}>
      <defs><clipPath id={clipId}><path d={PHOTO_FRAMES[frame]} /></clipPath></defs>
      <g clipPath={`url(#${clipId})`}>
        <path d={PHOTO_FRAMES[frame]} fill="var(--ground-2)" />
        {photo && photo !== failedPhoto ? <image href={photo} x="0" y="0" width="400" height="460" preserveAspectRatio="xMidYMid slice" onError={() => setFailedPhoto(photo)} /> : <>
          <circle cx="200" cy="220" r="110" fill="none" stroke="var(--gold)" strokeOpacity=".3" />
          <text x="200" y="232" textAnchor="middle" className="portrait-initials">{initials}</text>
          <text x="200" y="270" textAnchor="middle" className="portrait-fallback">OUR FOREVER</text>
        </>}
      </g>
      <path d={PHOTO_FRAMES[frame]} fill="none" stroke="var(--border-gold)" strokeWidth="2" />
      <path d={PHOTO_FRAMES[frame]} transform="translate(200 230) scale(1.045) translate(-200 -230)" fill="none" stroke="var(--border-gold)" strokeWidth=".6" strokeOpacity=".6" />
      <PortraitFrameDecoration frame={frame} />
    </svg>
    <span className="portrait-heart portrait-heart-bottom" aria-hidden="true">♡</span>
    <figcaption><span className="eyebrow">Two hearts. One forever.</span><span className="portrait-signature">{names}</span></figcaption>
    {onFrameChange && <div className="portrait-frame-picker"><label htmlFor={`${clipId}-frame`}>Choose your photo frame</label><select id={`${clipId}-frame`} value={frame} onChange={(event) => onFrameChange(event.target.value as KeepsakeSettings["photoFrame"])}>{KEEPSAKE_FRAMES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>}
  </figure>;
}

const MEMORY_CAPTIONS = ["Where our story begins", "My favourite place is with you", "A little moment, a lifetime of love", "Together, always"];

function FramedMemory({ photo, index, names, initials }: { photo: string; index: number; names: string; initials: string }) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  return <figure className="memory" data-memory-frame={["arch", "oval", "rounded", "arch"][index]}>
    <div className="memory-frame">
      <span className="memory-corner memory-corner-top" aria-hidden="true"><Ornament lotus /></span>
      <div className="memory-photo">
        {failedPhoto === photo
          ? <div className="memory-fallback" role="img" aria-label={`Wedding monogram for ${names}`}><span>{initials}</span><small>Our forever</small></div>
          // Uploaded photos are served by the invitation API and may use different hosts.
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={photo} alt={`${names} — wedding memory ${index + 1}`} width={600} height={800} loading="lazy" decoding="async" onError={() => setFailedPhoto(photo)} />}
      </div>
      <span className="memory-corner memory-corner-bottom" aria-hidden="true"><Ornament lotus /></span>
    </div>
    <figcaption><span className="memory-number" aria-hidden="true">0{index + 1}</span><span>{MEMORY_CAPTIONS[index]}</span></figcaption>
  </figure>;
}

function Botanical({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 240 480" fill="none" aria-hidden="true">
    <path d="M28 478C134 355 72 212 194 12M77 397C24 325 24 275 17 239M99 304C168 275 195 235 224 191M125 170C89 119 98 69 104 45" stroke="currentColor" strokeWidth="1.2" />
    {[ [64, 419, -55], [83, 367, 35], [91, 308, -45], [97, 254, 42], [112, 201, -35], [142, 132, 45], [171, 62, 12], [44, 317, -50], [175, 246, 50], [110, 114, -20] ].map(([x, y, angle], i) =>
      <path key={i} d="M0 0C-34-12-40-50-17-78C9-59 20-25 0 0Z" transform={`translate(${x} ${y}) rotate(${angle})`} stroke="currentColor" strokeWidth=".9" fill="currentColor" fillOpacity=".08" />)}
    <g transform="translate(111 232)" stroke="currentColor" strokeWidth="1">
      {[0, 60, 120, 180, 240, 300].map((angle) => <path key={angle} d={PETAL} transform={`rotate(${angle}) scale(.48)`} fill="currentColor" fillOpacity=".12" />)}
      <circle r="7" fill="currentColor" fillOpacity=".25" />
    </g>
  </svg>;
}

function Ornament({ lotus = false }: { lotus?: boolean }) {
  if (lotus) return <svg viewBox="-72 -72 144 80" fill="none" stroke="currentColor" strokeWidth=".9" aria-hidden="true">
    {[-66, -44, 44, 66, -22, 22, 0, -32, 32, 0].map((angle, i) => <path key={i} d={PETAL} transform={`rotate(${angle}) scale(${i < 4 ? .85 : i < 7 ? 1.02 : .6})`} fill="currentColor" fillOpacity={i < 4 ? .05 : i < 7 ? .12 : .2} />)}
    <path d="M-34 4H34" strokeOpacity=".6" />
  </svg>;
  return <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" strokeWidth=".45" aria-hidden="true">
    <circle r="98" /><circle r="95" strokeOpacity=".5" />
    {[[24, 1.25, 0], [16, .95, 11.25], [12, .62, 0], [8, .34, 22.5]].map(([count, scale, offset], ring) =>
      Array.from({ length: count }, (_, i) => <path key={`${ring}-${i}`} d={PETAL} transform={`rotate(${offset + i * 360 / count}) scale(${scale})`} />))}
    <circle r="5" />
  </svg>;
}

export default function KeepsakeTemplate({ data, actions }: TemplateProps) {
  const settings = keepsakeSettings(data.keepsake);
  const { rsvp, wish, disabled } = useInvitationActions(data, actions);
  const countdown = useCountdown(data.weddingDate, data.weddingTime);
  const [cover, setCover] = useState<"closed" | "opening" | "open">("closed");
  const [animationRun, setAnimationRun] = useState(0);
  const openingPhase = useRef<"closed" | "opening" | "open">("closed");
  const openingRun = useRef(0);
  const openingTimer = useRef<number | null>(null);
  const mounted = useRef(false);
  const musicRequest = useRef(0);
  const wantsMusic = useRef(false);
  const [theme, setTheme] = useState(settings.theme);
  const [photoFrame, setPhotoFrame] = useState(settings.photoFrame);
  const [palette, setPalette] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const hero = useRef<HTMLElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const sealButton = useRef<HTMLButtonElement>(null);
  const skipButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const names = `${data.brideName} & ${data.groomName}`;
  const memories = data.gallery.filter((photo) => photo.trim()).slice(0, KEEPSAKE_GALLERY_LIMIT);
  const initials = `${data.brideName.trim()[0] || ""} & ${data.groomName.trim()[0] || ""}`.toUpperCase();
  const date = formatDateLong(data.weddingDate);
  const venue = venueLine(data.venueName, data.venueAddress);
  const maps = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const target = weddingTimestamp(data.weddingDate, data.weddingTime);
  const musicUrl = /^https:\/\//i.test(settings.musicUrl) || /^\/(?!\/)/.test(settings.musicUrl) ? settings.musicUrl : "";
  const activeTheme = actions.mode === "demo" ? palette !== null ? KEEPSAKE_PALETTES[palette].theme : theme : settings.theme;
  const selectedColors = actions.mode === "demo"
    ? palette !== null ? KEEPSAKE_PALETTES[palette] : theme !== settings.theme ? KEEPSAKE_THEME_COLOURS[theme] : settings
    : settings;
  const resolvedColors = { ...KEEPSAKE_THEME_COLOURS[activeTheme], ...Object.fromEntries(KEEPSAKE_COLOUR_KEYS
    .filter((key) => /^#[0-9a-f]{6}$/i.test(selectedColors[key]))
    .map((key) => [key, selectedColors[key]])) };
  const colors = Object.fromEntries(KEEPSAKE_COLOUR_KEYS
    .map((key) => [key === "paper2" ? "--paper-2" : `--${key}`, resolvedColors[key]])) as CSSProperties;

  const finishOpening = useCallback((expectedRun?: number) => {
    if (!mounted.current || (expectedRun !== undefined && expectedRun !== openingRun.current) || openingPhase.current === "open") return;
    if (openingTimer.current !== null) window.clearTimeout(openingTimer.current);
    openingTimer.current = null;
    openingPhase.current = "open";
    setCover("open");
  }, []);

  useEffect(() => {
    mounted.current = true;
    // Old session flags must not skip the cover on a later visit.
    try { sessionStorage.removeItem(`wedora.keepsake.opened:${location.pathname}`); } catch { /* Storage is optional. */ }
    return () => {
      mounted.current = false;
      if (openingTimer.current !== null) window.clearTimeout(openingTimer.current);
      openingTimer.current = null;
      musicRequest.current++;
      wantsMusic.current = false;
    };
  }, []);

  useEffect(() => {
    if (cover === "open") {
      hero.current?.focus({ preventScroll: true });
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (cover === "closed") sealButton.current?.focus({ preventScroll: true });
    else skipButton.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = previous; };
  }, [cover]);

  useEffect(() => {
    if (cover !== "opening") return;
    // transitionend opens the page as soon as the doors finish. This fallback
    // also works if the browser suppresses that event or motion is reduced.
    const run = openingRun.current;
    const timer = window.setTimeout(() => finishOpening(run), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 60 : 2500);
    openingTimer.current = timer;
    return () => {
      window.clearTimeout(timer);
      if (openingTimer.current === timer) openingTimer.current = null;
    };
  }, [cover, animationRun, finishOpening]);

  useEffect(() => {
    if (cover !== "open" || !root.current || typeof IntersectionObserver === "undefined") return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const container = root.current;
    container.classList.add("keepsake-motion");
    const items = root.current.querySelectorAll<HTMLElement>(
      ".card, .memories-heading, .memory, .memories-signature, .count > h2, .count-row > div, .day > h2, .timeline li, .venue-grid > div, .rsvp-lotus, .rsvp h2, .paper-card, .wishes, .share > h2, .share > .btn-row",
    );
    items.forEach((item, index) => {
      item.classList.add("keepsake-reveal");
      item.style.setProperty("--reveal-delay", `${index % 3 * 90}ms`);
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("keepsake-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -18px 0px" });
    items.forEach(item => observer.observe(item));
    const revealAll = () => {
      if (!preference.matches) return;
      observer.disconnect();
      items.forEach(item => item.classList.add("keepsake-visible"));
    };
    preference.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", revealAll);
      container.classList.remove("keepsake-motion");
      items.forEach(item => item.classList.remove("keepsake-reveal", "keepsake-visible"));
    };
  }, [cover, memories.length, animationRun]);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    const pauseWhenHidden = () => { if (document.hidden) element.pause(); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => { document.removeEventListener("visibilitychange", pauseWhenHidden); element.pause(); };
  }, [musicUrl, animationRun]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function toggleMusic() {
    const element = audio.current;
    if (!element) return;
    const request = ++musicRequest.current;
    if (element.paused) {
      wantsMusic.current = true;
      try {
        await element.play();
        if (!mounted.current || request !== musicRequest.current) element.pause();
      } catch {
        if (mounted.current && request === musicRequest.current && wantsMusic.current) {
          wantsMusic.current = false;
          setPlaying(false);
          setNotice("Could not play the music file.");
        }
      }
    } else {
      wantsMusic.current = false;
      element.pause();
    }
  }

  function startOpening() {
    // A synchronous guard also catches taps before React renders disabled=true.
    if (openingPhase.current !== "closed") return;
    openingPhase.current = "opening";
    setCover("opening");
    if (musicUrl && audio.current?.paused) void toggleMusic();
  }

  function replayOpening() {
    openingRun.current++;
    if (openingTimer.current !== null) window.clearTimeout(openingTimer.current);
    openingTimer.current = null;
    openingPhase.current = "closed";
    musicRequest.current++;
    wantsMusic.current = false;
    audio.current?.pause();
    if (audio.current) { try { audio.current.currentTime = 0; } catch { /* Metadata may not be loaded. */ } }
    setPlaying(false);
    setNotice("");
    setAnimationRun(openingRun.current);
    setCover("closed");
    window.scrollTo(0, 0);
  }

  function shareUrl() {
    const url = new URL(window.location.href);
    url.hash = "";
    url.searchParams.delete("code");
    url.searchParams.delete("guest");
    return url.toString();
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(shareUrl()); setNotice("Link copied"); }
    catch { setNotice("Could not copy the link. Please copy the page address."); }
  }

  function shareWhatsApp() {
    const message = `${names} are getting married.\n${date} at ${formatTime(data.weddingTime)}\n${venue}\n\nYou are warmly invited. See the invitation and reply here:\n${shareUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  const calendarDate = data.weddingDate?.replaceAll("-", "").slice(0, 8);
  const calendarTime = (data.weddingTime || "00:00").replaceAll(":", "").slice(0, 4);
  const end = target ? new Date(target + 4 * 60 * 60 * 1000) : null;
  const pad = (value: number) => String(value).padStart(2, "0");
  const calendarEnd = end ? `${end.getFullYear()}${pad(end.getMonth() + 1)}${pad(end.getDate())}T${pad(end.getHours())}${pad(end.getMinutes())}00` : "";
  const calendar = calendarDate && end ? `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `${names} wedding`, dates: `${calendarDate}T${calendarTime}00/${calendarEnd}`, location: venue, ctz: "Asia/Colombo" })}` : null;

  return <div ref={root} className={`keepsake ${cover === "open" ? "opened" : ""}`} data-theme={activeTheme} style={colors}>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Noto+Serif+Sinhala:wght@400;500;600&display=swap" />
    {cover !== "open" && <div key={`cover-${animationRun}`} className={`cover ${cover === "opening" ? "opening" : ""}`} role="dialog" aria-modal="true" aria-label="Open wedding invitation" onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); finishOpening(animationRun); }
      if (event.key === "Tab") { event.preventDefault(); (cover === "opening" ? skipButton : sealButton).current?.focus(); }
    }}>
      <div className="door door-l" /><div className="door door-r" onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === "transform" && cover === "opening") finishOpening(animationRun); }} />
      <div className="cover-content">
        <div className="cover-mandala cover-fade"><Ornament /></div>
        <p className="eyebrow cover-fade">A wedding invitation</p>
        {settings.sinhala && <p className="cover-si cover-fade" lang="si">{settings.sinhala}</p>}
        <p className="cover-names cover-fade">{names}</p>
        <button ref={sealButton} type="button" className="seal-btn" aria-label="Open the invitation" disabled={cover === "opening"} onClick={startOpening}>
          <span className="seal" aria-hidden="true">{["l", "r"].map((half) => <span className={`half ${half}`} key={half}><span className="face"><i>{initials}</i></span></span>)}</span>
        </button>
        <p className="cover-hint cover-fade">Tap the seal to open</p>
        <p className="cover-date cover-fade">{date}</p>
      </div>
      {cover === "opening" && <button ref={skipButton} type="button" className="skip-opening" onClick={() => finishOpening(animationRun)}>Skip animation <span aria-hidden="true">↗</span></button>}
    </div>}
    <div key={`scene-${animationRun}`} inert={cover !== "open"}>
      <header className="hero" id={`${id}-top`} tabIndex={-1} ref={hero}>
        <div className="keepsake-glints" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <span key={index} style={{ left: `${(index * 37 + 7) % 100}%`, top: `${(index * 29 + 11) % 100}%`, "--glint-delay": `${-index * 1.8}s`, "--glint-duration": `${18 + index % 5 * 3}s` } as CSSProperties} />)}</div>
        <div className="hero-topline"><span className="monogram">{initials}</span><span className="eyebrow">The wedding celebration</span><a href={`#${id}-rsvp`}>Kindly RSVP <span aria-hidden="true">↗</span></a></div>
        <div className="hero-arch" aria-hidden="true" />
        <div className="hero-mandala"><Ornament /></div>
        <Botanical className="botanical botanical-left" /><Botanical className="botanical botanical-right" />
        <div className="hero-layout"><div className="hero-inner">
          <div className="hero-lotus"><Ornament lotus /></div>
          {settings.sinhala && <p className="si" lang="si">{settings.sinhala}</p>}
          <p className="hero-pre">Together with their families</p>
          <h1 className="names"><span>{data.brideName}</span><span className="amp" aria-hidden="true">&amp;</span><span>{data.groomName}</span></h1>
          <p className="hero-announcement">joyfully invite you to celebrate their wedding</p>
          <div className="hero-details"><p className="hero-date">{date}</p><span className="detail-star" aria-hidden="true">✦</span><p className="hero-time">{formatTime(data.weddingTime)}</p></div>
          <p className="hero-venue">{data.venueName || "Venue to be announced"}</p>
          <a className="hero-reply" href={`#${id}-rsvp`}>Celebrate with us <span aria-hidden="true">↗</span></a>
        </div><CouplePortrait photo={data.coverPhoto} frame={actions.mode === "demo" ? photoFrame : settings.photoFrame} names={names} initials={initials} onFrameChange={actions.mode === "demo" ? setPhotoFrame : undefined} /></div>
        <a className="scroll-cue" href={`#${id}-invite`}>Our forever begins here<span aria-hidden="true">↓</span></a>
      </header>
      <main>
        <section className="invite" id={`${id}-invite`}><div className="card">
          <div className="card-lotus"><Ornament lotus /></div>
          <p className="eyebrow">With full hearts &amp; open arms</p>
          {settings.blessing && <p className="blessing">{settings.blessing}</p>}
          <h2>{settings.heading}</h2>
          {data.guestName && <p className="blessing">Dear {data.guestName},</p>}
          <p className="message">{data.greetingMessage || "Two hearts, one journey.\nWe joyfully invite you to share in our happiness as we begin our new life together.\nYour presence will make our day complete."}</p>
          <p className="signoff">With love,<br /><span>{names}</span></p>
        </div></section>
        {memories.length > 0 && <section className="memories" aria-labelledby={`${id}-memories-title`}>
          <div className="memories-border" aria-hidden="true" />
          <Botanical className="memories-botanical memories-botanical-left" />
          <Botanical className="memories-botanical memories-botanical-right" />
          <div className="wrap">
            <div className="memories-heading"><div className="memories-lotus"><Ornament lotus /></div><p className="eyebrow">Little moments. Endless love.</p><h2 id={`${id}-memories-title`}>A glimpse of <em>our forever</em></h2><p className="memories-note">Every photograph, another page in our love story.</p></div>
            <div className="memories-grid" data-count={memories.length}>{memories.map((photo, index) => <FramedMemory key={`${photo}-${index}`} photo={photo} index={index} names={names} initials={initials} />)}</div>
            <div className="memories-signature"><span aria-hidden="true" /><p>{names}</p><span aria-hidden="true" /></div>
          </div>
        </section>}
        <section className="count" aria-label="Wedding countdown"><p className="eyebrow">Every moment brings us closer</p><h2>Until we say <em>“I do”</em></h2>
          {target ? <div className="count-row" role="timer" aria-live="off">{Object.entries(countdown).map(([label, value]) => <div key={label}><b>{String(value).padStart(2, "0")}</b><span>{label}</span></div>)}</div> : <p>Date to be announced</p>}
        </section>
        {data.eventsSchedule.length > 0 && <section className="day"><p className="eyebrow">A day to remember</p><h2>Order of the <em>day</em></h2><ol className="timeline">{data.eventsSchedule.map((event, i) => <li key={i}><time>{formatTime(event.time)}</time><div><span className="event-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><h3>{event.name}</h3>{event.description && <p>{event.description}</p>}{event.venue && <p>{event.venue}</p>}</div></li>)}</ol></section>}
        <section className="venue"><div className="wrap venue-grid"><div>
          <p className="eyebrow">Meet us here</p><h2>The <em>celebration</em></h2><dl className="facts">
            <div><dt>When</dt><dd>{date}</dd><dd className="sub">{formatTime(data.weddingTime)}</dd></div>
            <div><dt>Where</dt><dd>{data.venueName || "Venue to be announced"}</dd><dd className="sub">{data.venueAddress}</dd></div>
            {settings.dress && <div><dt>Dress</dt><dd>{settings.dress}</dd></div>}
          </dl><div className="btn-row">{maps && <a className="btn solid" href={maps} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>}{calendar && <a className="btn line" href={calendar} target="_blank" rel="noopener noreferrer">Add to calendar</a>}</div>
        </div>{(data.venueName || data.venueAddress) && <div className="map-wrap"><iframe title="Map of the venue" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(venue)}&output=embed`} /></div>}</div></section>
        <section className="rsvp" id={`${id}-rsvp`}><div className="wrap narrow"><div className="rsvp-lotus"><Ornament lotus /></div><p className="eyebrow">A seat saved just for you</p><h2>Will you <em>join us?</em></h2><p className="rsvp-note">{data.rsvpDeadline ? `Please reply before ${formatDateLong(data.rsvpDeadline)}.` : "We look forward to celebrating with you."}</p>
          {actions.mode === "demo" && <p className="rsvp-note">This is a preview. Replies are for demonstration only.</p>}
          {disabled && <p className="rsvp-note">Replies are available when your invitation is live.</p>}
          <div className="paper-card">{rsvp.submitted ? <div className="thanks" role="status"><p className="thanks-title">Thank you</p><p>{rsvp.attend ? "We are delighted you will be there. See you at the wedding." : "We will miss you. Thank you for letting us know."}</p><button type="button" className="btn line" onClick={rsvp.edit}>Edit my reply</button></div> : <form onSubmit={rsvp.submit}>
            <fieldset disabled={disabled || rsvp.sending} className="reply-fields">
              {rsvp.askName && <div className="field"><label htmlFor={`${id}-name`}>Your full name</label><input id={`${id}-name`} autoComplete="name" required maxLength={80} value={rsvp.name} onChange={(e) => rsvp.setName(e.target.value)} /></div>}
              <fieldset className="field"><legend>Can you attend?</legend><div className="choice">{[true, false].map((attend) => <div key={String(attend)}><input id={`${id}-${attend}`} type="radio" name={`${id}-attendance`} required checked={rsvp.attend === attend} onChange={() => rsvp.setAttend(attend)} /><label htmlFor={`${id}-${attend}`}>{attend ? "Yes, with joy" : "Sadly, no"}</label></div>)}</div></fieldset>
              {rsvp.attend !== false && <div className="field"><label htmlFor={`${id}-count`}>Number of guests, including you</label><select id={`${id}-count`} value={rsvp.count} onChange={(e) => rsvp.setCount(Number(e.target.value))}>{Array.from({ length: 20 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></div>}
              {rsvp.error && <p className="err" role="alert">{rsvp.error}</p>}<button className="btn solid block" type="submit">{rsvp.sending ? "Sending…" : "Send my reply"}</button>
            </fieldset>
          </form>}</div>
          <form className="paper-card wish-card" onSubmit={wish.submit}><h3>A message for the couple</h3><fieldset disabled={disabled || wish.sending} className="reply-fields">
            {wish.askName && <div className="field"><label htmlFor={`${id}-wish-name`}>Your name</label><input id={`${id}-wish-name`} required maxLength={80} value={wish.name} onChange={(e) => wish.setName(e.target.value)} /></div>}
            <div className="field"><label htmlFor={`${id}-wish`}>Your message</label><textarea id={`${id}-wish`} required maxLength={300} rows={3} value={wish.text} onChange={(e) => wish.setText(e.target.value)} /></div>
            {wish.error && <p className="err" role="alert">{wish.error}</p>}{wish.sent && <p role="status">Your message has been sent. Thank you!</p>}<button className="btn line block" type="submit">{wish.sending ? "Sending…" : "Send message"}</button>
          </fieldset></form>
        </div></section>
        <section className="share"><p className="eyebrow">Happiness is better together</p><h2>Spread a little <em>love</em></h2><div className="btn-row center"><button className="btn wa" type="button" onClick={shareWhatsApp}>Share on WhatsApp <span aria-hidden="true">↗</span></button><button className="btn line" type="button" onClick={() => void copyLink()}>Copy invitation link</button></div></section>
      </main>
      <footer className="footer"><div className="footer-lotus"><Ornament lotus /></div><p className="eyebrow">The beginning of always</p><p className="footer-names">{names}</p><p className="footer-date">{date}</p>
        {actions.mode === "demo" && <div className="theme-preview"><button type="button" className="btn line replay-opening" onClick={replayOpening}>Replay opening animation</button><p>Find your perfect colour palette</p><div className="btn-row center theme-options">{KEEPSAKE_THEMES.map(({ value, label }) => <button type="button" key={value} data-colour-theme={value} aria-pressed={theme === value && palette === null} onClick={() => { setTheme(value); setPalette(null); }}>{label}</button>)}</div>
          <p className="preview-label">Wedding colour palettes</p><div className="btn-row center palette-options">{KEEPSAKE_PALETTES.map((value, i) => <button type="button" key={value.label} aria-pressed={palette === i} onClick={() => setPalette(i)}>{Array.from(new Set(KEEPSAKE_COLOUR_KEYS.map((key) => value[key]))).map((colour) => <span key={colour} className="palette-dot" style={{ background: colour }} />)}{value.label}</button>)}</div>
          <p className="preview-label">Choose a photo frame</p><div className="btn-row center frame-options">{KEEPSAKE_FRAMES.map((value) => <button type="button" key={value.value} aria-pressed={photoFrame === value.value} onClick={() => setPhotoFrame(value.value)}>{value.label}</button>)}</div>
        </div>}
        <Link className="manage" href="/dashboard">Couple login</Link>
      </footer>
      {musicUrl && <><audio ref={audio} src={musicUrl} loop preload="none" onPlay={() => { if (!wantsMusic.current) { audio.current?.pause(); return; } setPlaying(true); }} onPause={() => setPlaying(false)} onError={() => { if (!wantsMusic.current || !mounted.current) return; setPlaying(false); setNotice("Could not load the music file. You can still enjoy the invitation."); }} /><button type="button" className="music-btn" aria-pressed={playing} aria-label={playing ? "Pause music" : "Play music"} onClick={() => void toggleMusic()}><span className="bars" aria-hidden="true"><i /><i /><i /></span></button></>}
    </div>
    <div className={`toast ${notice ? "show" : ""}`} role="status">{notice}</div>
  </div>;
}
