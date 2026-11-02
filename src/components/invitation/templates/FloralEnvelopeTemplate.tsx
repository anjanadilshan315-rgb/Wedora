/* eslint-disable @next/next/no-img-element -- Local wedding photography, SVG artwork, and customer photos. */
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  Cinzel_Decorative,
  Cinzel,
  Pinyon_Script,
  Josefin_Sans,
} from "next/font/google";
import {
  CalendarDays,
  Check,
  Heart,
  Home,
  Images,
  Mail,
  MapPin,
  Music2,
  Palette,
  Phone,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  ENVELOPE_PALETTES,
  ENVELOPE_TEXT,
  envelopeColours,
  envelopeSettings,
} from "../envelope";
import { EnvelopeSound } from "../envelope-sound";
import { ENVELOPE_PHOTOS } from "../envelope-photos";
import { formatTime, mapLink } from "../format";
import { useCountdown } from "../hooks";
import type { TemplateProps } from "../types";
import { envelopeArtwork, envelopeTheme } from "./envelope-art";
import "./floral-envelope.css";
import "./floral-envelope-luxe.css";

const decorative = Cinzel_Decorative({
  variable: "--font-envelope-deco",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const capitals = Cinzel({
  variable: "--font-envelope-cap",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const script = Pinyon_Script({
  variable: "--font-envelope-script",
  subsets: ["latin"],
  weight: "400",
});
const modern = Josefin_Sans({
  variable: "--font-envelope-modern",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});
function Ornament() {
  return (
    <div className="orn" aria-hidden="true">
      <i />
    </div>
  );
}

export default function FloralEnvelopeTemplate({
  data,
  actions,
}: TemplateProps) {
  const saved = envelopeSettings(data.floralEnvelope);
  const [settings, setSettings] = useState(saved);
  const [language, setLanguage] = useState(saved.language);
  const [opening, setOpening] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [opened, setOpened] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundError, setSoundError] = useState(false);
  const [active, setActive] = useState("home");
  const [name, setName] = useState(data.guestName ?? "");
  const [attending, setAttending] = useState<boolean | null>(
    actions.rsvp?.status === "attending"
      ? true
      : actions.rsvp?.status === "declined"
        ? false
        : null,
  );
  const [guests, setGuests] = useState(
    Math.max(1, actions.rsvp?.headCount ?? 1),
  );
  const [submitted, setSubmitted] = useState(
    Boolean(actions.rsvp && actions.rsvp.status !== "pending"),
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<
    "nameRequired" | "attendRequired" | "submitError" | null
  >(null);
  const page = useRef<HTMLElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const paletteButton = useRef<HTMLButtonElement>(null);
  const sheetClose = useRef<HTMLButtonElement>(null);
  const sound = useRef<EnvelopeSound | null>(null);
  const song = useRef<HTMLAudioElement | null>(null);
  const audioRequest = useRef(0);
  const text = ENVELOPE_TEXT[language];
  const colours = envelopeColours(settings);
  const art = useMemo(
    () => envelopeArtwork(colours),
    [colours.main, colours.accent, colours.background, colours.envelope],
  );
  const countdown = useCountdown(data.weddingDate, data.weddingTime);
  const initials = `${data.brideName.charAt(0)} & ${data.groomName.charAt(0)}`;
  const gallery = data.gallery.length ? data.gallery : ENVELOPE_PHOTOS.gallery;
  const heroPhoto = data.coverPhoto || data.gallery[0] || ENVELOPE_PHOTOS.hero;
  const story =
    language === "si" ? saved.storySi || saved.storyEn : saved.storyEn;
  const message =
    language === "si"
      ? saved.messageSi || data.greetingMessage
      : data.greetingMessage;
  const dress =
    language === "si" ? saved.dressSi || saved.dressEn : saved.dressEn;
  const date = (value: string | null) =>
    value
      ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(
          language === "si" ? "si-LK" : "en-US",
          { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        )
      : text.datePending;
  const venues = [
    ...new Set(
      [
        data.venueName,
        ...data.eventsSchedule.map((event) => event.venue),
      ].filter((value): value is string => Boolean(value)),
    ),
  ];
  const navigation = [
    { id: "home", label: text.home, icon: Home },
    { id: "details", label: text.navDetails, icon: CalendarDays },
    { id: "rsvp", label: text.navRsvp, icon: Mail },
    { id: "gallery", label: text.navGallery, icon: Images },
    { id: "location", label: text.navLocation, icon: MapPin },
  ];
  const fontStyle =
    settings.font === "classic"
      ? {
          "--f-deco": "var(--font-envelope-deco),serif",
          "--f-cap": "var(--font-envelope-cap),serif",
          "--f-script": "var(--font-envelope-script),cursive",
          "--f-body": "var(--font-cormorant),serif",
        }
      : settings.font === "romantic"
        ? {
            "--f-deco": "var(--font-heritage-classic),serif",
            "--f-cap": "var(--font-cormorant),serif",
            "--f-script": "var(--font-great-vibes),cursive",
            "--f-body": "var(--font-cormorant),serif",
          }
        : {
            "--f-deco": "var(--font-envelope-modern),sans-serif",
            "--f-cap": "var(--font-envelope-modern),sans-serif",
            "--f-script": "var(--font-great-vibes),cursive",
            "--f-body": "var(--font-heritage-body),sans-serif",
          };

  // Keep the original envelope timing: flap, rising card, zoom, then reveal.
  useEffect(() => {
    if (!opening) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timers = [
      window.setTimeout(() => setZooming(true), reduced ? 20 : 2400),
      window.setTimeout(() => setOpened(true), reduced ? 50 : 3300),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [opening]);
  useEffect(() => {
    if (opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [opened]);
  useEffect(
    () => () => {
      audioRequest.current++;
      sound.current?.dispose();
      song.current?.pause();
    },
    [],
  );
  useEffect(() => {
    if (!opened) return;
    page.current?.focus({ preventScroll: true });
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    page.current
      ?.querySelectorAll(".reveal")
      .forEach((element) => reveal.observe(element));
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-40% 0px -45% 0px" },
    );
    page.current
      ?.querySelectorAll("section[id]")
      .forEach((section) => spy.observe(section));
    return () => {
      reveal.disconnect();
      spy.disconnect();
    };
  }, [opened]);
  useEffect(() => {
    if (customizing) sheetClose.current?.focus();
  }, [customizing]);

  function stopSound() {
    audioRequest.current++;
    sound.current?.stop();
    song.current?.pause();
  }
  async function startSound(withOpening: boolean) {
    const request = ++audioRequest.current;
    try {
      sound.current ??= new EnvelopeSound();
      const playing = sound.current.start(
        withOpening,
        !saved.musicUrl,
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
      if (saved.musicUrl) {
        song.current ??= new Audio(saved.musicUrl);
        song.current.loop = true;
        song.current.volume = 0.35;
        await Promise.all([playing, song.current.play()]);
      } else await playing;
      if (request === audioRequest.current) setSoundError(false);
    } catch {
      if (request === audioRequest.current) {
        stopSound();
        setSoundError(true);
      }
    }
  }
  function openEnvelope() {
    if (opening) return;
    setOpening(true);
    if (soundEnabled) void startSound(true);
  }
  function toggleSound() {
    if (soundEnabled) {
      setSoundEnabled(false);
      stopSound();
    } else {
      setSoundEnabled(true);
      if (opening || opened) void startSound(false);
    }
  }
  function closeCustomizer() {
    setCustomizing(false);
    paletteButton.current?.focus();
  }
  function replay() {
    stopSound();
    closeCustomizer();
    setOpening(false);
    setZooming(false);
    setOpened(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    window.requestAnimationFrame(() => openButton.current?.focus());
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending || actions.mode === "preview") return;
    if (!name.trim()) {
      setError("nameRequired");
      return;
    }
    if (attending === null) {
      setError("attendRequired");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await actions.submitRsvp({
        name: name.trim(),
        attending,
        headCount: attending ? guests : 0,
      });
      setSubmitted(true);
    } catch {
      setError("submitError");
    } finally {
      setSending(false);
    }
  }
  function calendar() {
    if (!data.weddingDate) return;
    const start = new Date(
      `${data.weddingDate.slice(0, 10)}T${data.weddingTime || "00:00"}`,
    );
    if (Number.isNaN(start.getTime())) return;
    const stamp = (value: Date) =>
      value
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const escape = (value: string) =>
      value
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, "\\n")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,");
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedora//Floral Envelope//EN",
      "BEGIN:VEVENT",
      `UID:${data.weddingDate}-${encodeURIComponent(data.brideName + data.groomName)}@wedora`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(new Date(start.getTime() + 6 * 3600000))}`,
      `SUMMARY:${escape(data.brideName + " & " + data.groomName)}`,
      `LOCATION:${escape([data.venueName, data.venueAddress].filter(Boolean).join(", "))}`,
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/calendar;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding.ics";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const languages = (
    <div className="langs">
      <button
        type="button"
        lang="en"
        className={language === "en" ? "on" : ""}
        aria-pressed={language === "en"}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        lang="si"
        className={language === "si" ? "on" : ""}
        aria-pressed={language === "si"}
        onClick={() => setLanguage("si")}
      >
        සිං
      </button>
    </div>
  );

  return (
    <div
      className={`envelopeRoot ${decorative.variable} ${capitals.variable} ${script.variable} ${modern.variable} ${language === "si" ? "si" : ""} ${opened ? "entered" : ""}`}
      lang={language}
      style={{ ...envelopeTheme(colours), ...fontStyle } as CSSProperties}
    >
      <div
        id="intro"
        className={`${zooming ? "zoom" : ""} ${opened ? "done" : ""}`}
        aria-hidden={opened}
        inert={opened}
      >
        <img className="florals" src={art.florals} alt="" />
        <div className="intro-controls">
          {languages}
          <button
            className="sound-toggle"
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? text.muteSound : text.enableSound}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
        <div className="invited">{text.invited}</div>
        <p className="intro-dedication">
          {data.brideName} <em>&</em> {data.groomName}
        </p>
        <div className="stage">
          <button
            ref={openButton}
            type="button"
            className={`env ${opening ? "open" : ""}`}
            onClick={openEnvelope}
            disabled={opening}
            aria-label={text.open}
          >
            <span
              className="env-back"
              style={{ background: "var(--terra-d)" }}
            />
            <span className="env-card">
              <span className="t1">{text.together}</span>
              <span className="names">
                <span className="n1">{data.brideName}</span>
                <i>&</i>
                <span className="n2">{data.groomName}</span>
              </span>
              <span className="t2">{date(data.weddingDate)}</span>
            </span>
            <img className="env-front" src={art.front} alt="" />
            <span className="flap">
              <span className="outside">
                <img src={art.flap} alt="" />
              </span>
              <span className="inside">
                <img src={art.lining} alt="" />
              </span>
            </span>
            <span className="seal">{initials}</span>
          </button>
        </div>
        <button
          type="button"
          className="tap"
          onClick={openEnvelope}
          disabled={opening}
        >
          {text.open}
        </button>
        <p className="intro-date">{date(data.weddingDate)}</p>
      </div>
      <div inert={!opened} aria-hidden={!opened}>
        <div id="leaves" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => (
            <span
              className="envelope-leaf"
              key={index}
              style={{
                left: `${(index * 29 + 9) % 100}%`,
                animationDelay: `${-index * 1.7}s`,
                animationDuration: `${14 + (index % 6)}s`,
              }}
            >
              ❧
            </span>
          ))}
        </div>
        <header className="bar">
          {languages}
          <div className="mono">{initials}</div>
          <a className="header-rsvp" href="#rsvp">{text.navRsvp} <Mail size={14} /></a>
        </header>
        <main className="app" ref={page} tabIndex={-1}>
          <section id="home">
            <div className="hero-visual">
            <div className="arch reveal in">
              <img
                src={heroPhoto}
                alt={`${data.brideName} & ${data.groomName}`}
                fetchPriority="high"
              />
            </div>
            <span className="portrait-seal" aria-hidden="true">{initials}</span>
            <p className="portrait-caption">{text.sealed}</p>
            </div>
            <div className="hero-copy">
            <p className="together cap reveal">{text.together}</p>
            <h1 className="couple-names">
              <span className="name reveal">{data.brideName}</span>
              <span className="and reveal">&</span>
              <span className="name reveal">{data.groomName}</span>
            </h1>
            <p className="request cap reveal">{message || text.request}</p>
            <Ornament />
            <p className="when cap reveal">{date(data.weddingDate)}</p>
            {data.venueName && <p className="hero-venue reveal">{data.venueName}</p>}
            <a className="btn hero-reply reveal" href="#rsvp"><Mail size={15} />{text.navRsvp}</a>
            <div className="parents reveal">
              {data.brideParents && (
                <div>
                  {text.daughter}
                  <br />
                  {data.brideParents}
                </div>
              )}
              {data.brideParents && data.groomParents && <em>&</em>}
              {data.groomParents && (
                <div>
                  {text.son}
                  <br />
                  {data.groomParents}
                </div>
              )}
            </div>
            {data.guestName && (
              <p className="guest-note reveal">
                {text.dear}
                <strong>{data.guestName}</strong>
              </p>
            )}
            <div className="scrollhint" />
            </div>
          </section>
          {data.weddingDate && (
            <section id="married">
              <p className="getting reveal">{text.getting}</p>
              <h2 className="married reveal">{text.married}</h2>
              <Ornament />
              <div className="cd reveal">
                {Object.entries(countdown).map(([key, value]) => (
                  <div key={key}>
                    <b>{String(value).padStart(2, "0")}</b>
                    <small>
                      {text[key as "days" | "hours" | "minutes" | "seconds"]}
                    </small>
                  </div>
                ))}
              </div>
              <p className="until cap reveal">
                {text.until} {date(data.weddingDate)}
              </p>
            </section>
          )}
          {(story || saved.timeline.length > 0) && (
            <section id="story">
              <p className="eyebrow reveal">{text.storyEyebrow}</p>
              <h2 className="reveal">{text.story}</h2>
              <Ornament />
              <p className="lead reveal">{story || text.storyLead}</p>
              <div className="story-arch reveal zoom">
                <img
                  src={data.gallery[1] || data.coverPhoto || ENVELOPE_PHOTOS.story}
                  alt={`${data.brideName} & ${data.groomName}`}
                  loading="lazy"
                />
              </div>
              <div className="tl">
                {saved.timeline.map((moment, index) => (
                  <article className="it reveal" key={index}>
                    <span className="yr">{moment.year}</span>
                    <h3>
                      {language === "si"
                        ? moment.titleSi || moment.titleEn
                        : moment.titleEn || moment.titleSi}
                    </h3>
                    <p>
                      {language === "si"
                        ? moment.descriptionSi || moment.descriptionEn
                        : moment.descriptionEn}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
          <section id="details">
            <p className="eyebrow reveal">{date(data.weddingDate)}</p>
            <h2 className="reveal">{text.details}</h2>
            <Ornament />
            <div className="event-grid">
              {data.eventsSchedule.map((event, index) => (
                <article
                  className={`card ${index % 2 ? "round" : "arch-top"} reveal`}
                  key={index}
                >
                  <span className="event-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="ic">{index % 2 ? <Music2 /> : <Heart />}</div>
                  <h3>{event.name}</h3>
                  <p className="tm">{formatTime(event.time)}</p>
                  {event.venue && <p>{event.venue}</p>}
                  {event.description && <p>{event.description}</p>}
                </article>
              ))}
            </div>
            {dress && (
              <p className="lead reveal">
                {text.dress}: {dress}
              </p>
            )}
          </section>
          <section id="gallery">
            <p className="eyebrow reveal">{text.moments}</p>
            <h2 className="reveal">{text.gallery}</h2>
            <Ornament />
            <div className="grid">
              {gallery.map((photo: string, index: number) => (
                <figure
                  className={`tile photo-frame frame-${["celebration", "detail", "portrait", "keepsake"][index % 4]} reveal zoom`}
                  key={index}
                >
                  <div className="photo-mat">
                    <img
                    src={photo}
                    alt={`${data.brideName} & ${data.groomName} · ${index + 1}`}
                    loading="lazy"
                  />
                  </div>
                  <figcaption className="frame-caption">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{initials}</span>
                    <Heart size={12} aria-hidden="true" />
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
          <section id="location">
            <p className="eyebrow reveal">{text.locationEyebrow}</p>
            <h2 className="reveal">{text.location}</h2>
            <Ornament />
            {(venues.length ? venues : [text.venuePending]).map(
              (venue, index) => {
                const url =
                  index === 0 &&
                  data.mapUrl &&
                  /^https?:\/\//i.test(data.mapUrl)
                    ? data.mapUrl
                    : mapLink(
                        null,
                        venue === text.venuePending ? null : venue,
                        index === 0 ? data.venueAddress : null,
                      );
                return (
                  <div className="venue-entry reveal" key={index}>
                    <img className="sketch" src={art.sketch} alt="" />
                    <div className="venue">
                      <MapPin className="pin" />
                      <h3>{venue}</h3>
                      {index === 0 && data.venueAddress && (
                        <p>{data.venueAddress}</p>
                      )}
                      <div className="map" aria-hidden="true">
                        <img src={art.maps[index % 2]} alt="" />
                        <MapPin className="map-pin" />
                      </div>
                      {url && (
                        <a
                          className="btn"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin size={15} />
                          {text.map}
                        </a>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </section>
          <section id="rsvp">
            <p className="eyebrow reveal">{text.rsvpEyebrow}</p>
            <h2 className="reveal">{text.rsvp}</h2>
            <Ornament />
            <p className="lead reveal">{text.rsvpLead}</p>
            {data.rsvpDeadline && (
              <p className="reply-note reveal">
                {text.deadline}: {date(data.rsvpDeadline)}
              </p>
            )}
            {actions.mode !== "live" && (
              <p className="reply-note reveal">
                {actions.mode === "demo" ? text.demo : text.preview}
              </p>
            )}
            {submitted ? (
              <div
                className="thanks in"
                role="status"
                style={{ display: "block" }}
              >
                <Heart className="heart" />
                <h3>{text.thanks}</h3>
                <p>{text.sent}</p>
                <button
                  type="button"
                  className="reply-edit"
                  disabled={actions.mode === "preview"}
                  onClick={() => setSubmitted(false)}
                >
                  {text.edit}
                </button>
              </div>
            ) : (
              <form className="reveal" onSubmit={submit}>
                <fieldset disabled={actions.mode === "preview" || sending}>
                  {!actions.guestIdentified && (
                    <label>
                      {text.name}
                      <input
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </label>
                  )}
                  <fieldset className="attendance">
                    <legend>{text.attending}</legend>
                    <div className="choice">
                      <button
                        type="button"
                        className={attending === true ? "on" : ""}
                        aria-pressed={attending === true}
                        onClick={() => setAttending(true)}
                      >
                        {text.yes}
                      </button>
                      <button
                        type="button"
                        className={attending === false ? "on" : ""}
                        aria-pressed={attending === false}
                        onClick={() => setAttending(false)}
                      >
                        {text.no}
                      </button>
                    </div>
                  </fieldset>
                  {attending !== false && (
                    <div>
                      <p className="guest-label">{text.guests}</p>
                      <div className="step">
                        <button
                          type="button"
                          aria-label={text.countLess}
                          disabled={guests <= 1}
                          onClick={() => setGuests(guests - 1)}
                        >
                          −
                        </button>
                        <b aria-live="polite">{guests}</b>
                        <button
                          type="button"
                          aria-label={text.countMore}
                          disabled={guests >= 20}
                          onClick={() => setGuests(guests + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                  <button className="btn" type="submit">
                    <Mail size={15} />
                    {sending ? text.sending : text.send}
                  </button>
                </fieldset>
                {error && (
                  <p className="form-error" role="alert">
                    {text[error]}
                  </p>
                )}
              </form>
            )}
            <div className="sp" />
            <div className="std reveal zoom">
              <p className="k">{text.save}</p>
              <p className="dt">
                {data.weddingDate?.split("-").reverse().join(" . ")}
              </p>
              <p className="sl">{text.sealed}</p>
              <p className="m">{initials}</p>
              <p className="nm">
                {data.brideName} & {data.groomName}
              </p>
              <div className="couple-calls">
                {data.bridePhone && (
                  <a
                    className="btn ghost"
                    href={`tel:${data.bridePhone.replace(/[^+\d]/g, "")}`}
                  >
                    <Phone size={14} />
                    {text.bride}
                  </a>
                )}
                {data.groomPhone && (
                  <a
                    className="btn ghost"
                    href={`tel:${data.groomPhone.replace(/[^+\d]/g, "")}`}
                  >
                    <Phone size={14} />
                    {text.groom}
                  </a>
                )}
              </div>
            </div>
            {data.weddingDate && (
              <button
                type="button"
                className="btn calbtn reveal"
                onClick={calendar}
              >
                <CalendarDays size={15} />
                {text.calendar}
              </button>
            )}
          </section>
          <footer className="foot">
            {text.foot}
            <small>
              {data.brideName} & {data.groomName}
            </small>
          </footer>
        </main>
        <button
          className="music"
          type="button"
          aria-label={soundEnabled ? text.muteSound : text.enableSound}
          aria-pressed={soundEnabled}
          onClick={toggleSound}
        >
          {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
        {soundError && (
          <p className="audio-error" role="alert">
            {text.musicError}
          </p>
        )}
        {actions.mode === "demo" && (
          <button
            ref={paletteButton}
            className="cust-fab"
            type="button"
            aria-label={text.customize}
            onClick={() => setCustomizing(true)}
          >
            <Palette size={19} />
          </button>
        )}
        <nav className="nav" aria-label={text.invitationLabel}>
          {navigation.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`${id === "rsvp" ? "mid" : ""} ${active === id ? "on" : ""}`}
              aria-current={active === id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                page.current
                  ?.querySelector(`#${id}`)
                  ?.scrollIntoView({
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "instant"
                      : "smooth",
                  });
              }}
            >
              <span className={id === "rsvp" ? "c" : ""}>
                <Icon />
              </span>
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
      {customizing && actions.mode === "demo" && (
        <div className="envelope-backdrop" onClick={closeCustomizer}>
          <aside
            className="sheet open"
            role="dialog"
            aria-modal="true"
            aria-labelledby="envelope-design-title"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeCustomizer();
              if (event.key === "Tab") {
                const controls =
                  event.currentTarget.querySelectorAll<HTMLElement>(
                    "button, select",
                  );
                const first = controls[0],
                  last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className="sh-head">
              <h2 id="envelope-design-title">{text.customize}</h2>
              <button
                ref={sheetClose}
                type="button"
                aria-label={text.close}
                onClick={closeCustomizer}
              >
                <X size={20} />
              </button>
            </div>
            <p className="sh-lab">{text.palette}</p>
            <div className="sw-row">
              {ENVELOPE_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  className={`sw ${settings.palette === palette.id ? "on" : ""}`}
                  aria-pressed={settings.palette === palette.id}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      palette: palette.id,
                      main: "",
                      accent: "",
                      background: "",
                      envelope: "",
                    })
                  }
                >
                  <i
                    style={{
                      background: `linear-gradient(135deg,${palette.main} 50%,${palette.accent} 50% 75%,${palette.background} 75%)`,
                    }}
                  />
                  {palette.name}
                </button>
              ))}
            </div>
            <label className="sh-lab">
              {text.font}
              <select
                value={settings.font}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    font: event.target.value as typeof settings.font,
                  })
                }
              >
                {(["classic", "romantic", "modern"] as const).map((font) => (
                  <option key={font} value={font}>
                    {text[font]}
                  </option>
                ))}
              </select>
            </label>
            <div className="acts">
              <button className="btn" type="button" onClick={replay}>
                {text.replay}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
