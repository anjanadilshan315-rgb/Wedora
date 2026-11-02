"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Cormorant_Garamond, Josefin_Sans, Playfair_Display } from "next/font/google";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Heart,
  Home,
  Mail,
  MapPin,
  Music2,
  Palette,
  Send,
  VolumeX,
  X,
} from "lucide-react";
import { formatDateLong, formatTime, mapLink } from "../format";
import { useCountdown, useInvitationActions } from "../hooks";
import { sunsetColours, sunsetSettings, sunsetStyle, type SunsetSettings } from "../sunset";
import SunsetEditor from "../SunsetEditor";
import { SunsetSound } from "../sunset-sound";
import type { TemplateProps } from "../types";
import { coupleSVG, mandala, mapSVG, portrait, sFilm, villageRow } from "./sunset-art";
import SunsetPetals, { type SunsetPetalMode } from "./SunsetPetals";
import "./sunset-journey.css";

const modernFont = Josefin_Sans({
  variable: "--font-sunset-modern",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});
const headingFont = Playfair_Display({
  variable: "--font-sunset-heading",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});
const serifFont = Cormorant_Garamond({
  variable: "--font-sunset-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
type IntroStage = "cover" | "film" | "transition" | "invitation";

/** Only trusted, original SVG drawing functions reach this component. */
function Artwork({
  svg,
  className = "",
  label,
}: {
  svg: string;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function Ornament() {
  return (
    <div className="orn" aria-hidden="true">
      <i />
    </div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={`rv ${className}`} style={{ "--d": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

export default function SunsetJourneyTemplate({ data, actions }: TemplateProps) {
  // Saved invitations read their settings from the API. Demo choices stay local.
  const [demoSettings, setDemoSettings] = useState<SunsetSettings | null>(null);
  const [guestDemo, setGuestDemo] = useState(false);
  const settings =
    actions.mode === "demo" && demoSettings ? demoSettings : sunsetSettings(data.sunset);
  const colours = sunsetColours(settings);
  const art = useMemo(
    () => ({
      mandala: mandala(settings.gold),
      village: villageRow(settings.gold),
      film: sFilm(colours),
      couple: coupleSVG(colours),
      gallery: Array.from({ length: 6 }, (_, index) => portrait(colours, index)),
      map: mapSVG(),
    }),
    [settings.gold, colours.main, colours.sky],
  );

  const [stage, setStage] = useState<IntroStage>("cover");
  const [toss, setToss] = useState(false);
  const [filmTitle, setFilmTitle] = useState(false);
  const [flash, setFlash] = useState(false);
  const [petalMode, setPetalMode] = useState<SunsetPetalMode>("off");
  const [burstKey, setBurstKey] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [message, setMessage] = useState("");
  const [sharedLink, setSharedLink] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const customizerButton = useRef<HTMLButtonElement>(null);
  const sound = useRef<SunsetSound | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stageRef = useRef<IntroStage>("cover");
  const audioOperation = useRef(0);
  const countdown = useCountdown(data.weddingDate, data.weddingTime);
  const { disabled, rsvp } = useInvitationActions(data, {
    ...actions,
    submitRsvp: (input) =>
      actions.submitRsvp({ ...input, headCount: input.attending ? input.headCount : 0 }),
  });
  const mapUrl = mapLink(data.mapUrl, data.venueName, data.venueAddress);
  const fullDate = formatDateLong(data.weddingDate);
  const date = data.weddingDate ? new Date(`${data.weddingDate}T00:00:00`) : null;
  const names = (
    <>
      {data.brideName} <em>&amp;</em> {data.groomName}
    </>
  );

  const later = (milliseconds: number, callback: () => void) => {
    timers.current.push(setTimeout(callback, milliseconds));
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (actions.mode !== "demo") return;
    const query = new URLSearchParams(location.search);
    setGuestDemo(query.get("v") === "1");
    let saved: unknown;
    try {
      saved = JSON.parse(localStorage.getItem("wedora.sunset-demo") || "null");
    } catch {
      /* Storage is optional. */
    }
    if (query.has("m"))
      saved = {
        main: `#${query.get("m")}`,
        gold: `#${query.get("g")}`,
        paper: `#${query.get("p")}`,
        sky: `#${query.get("s")}`,
        font: query.get("f"),
      };
    if (saved && typeof saved === "object" && (query.has("m") || query.get("v") !== "1"))
      setDemoSettings(sunsetSettings({ ...sunsetSettings(data.sunset), ...saved }));
  }, [actions.mode]);

  useEffect(() => {
    if (actions.mode === "demo" && demoSettings && !guestDemo) {
      try {
        localStorage.setItem("wedora.sunset-demo", JSON.stringify(demoSettings));
      } catch {
        /* Private browsing can disable storage. */
      }
    }
  }, [actions.mode, demoSettings, guestDemo]);

  useEffect(() => {
    if (stage === "invitation" && !customizing) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [stage, customizing]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      audioOperation.current++;
      sound.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) {
        audioOperation.current++;
        sound.current?.pause();
        setMusicOn(false);
      }
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  // Start the ZIP's scroll reveals only after its intro has finished.
  useEffect(() => {
    if (stage !== "invitation" || !root.current) return;
    main.current?.focus({ preventScroll: true });
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            reveal.unobserve(entry.target);
          }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    root.current.querySelectorAll(".rv,.tl").forEach((element) => reveal.observe(element));
    const navigation = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px" },
    );
    root.current
      .querySelectorAll("main > section[id]")
      .forEach((element) => navigation.observe(element));
    return () => {
      reveal.disconnect();
      navigation.disconnect();
    };
  }, [stage]);

  async function startMusic() {
    const operation = ++audioOperation.current;
    sound.current ??= new SunsetSound();
    const playing = await sound.current.play(settings.musicUrl);
    if (operation !== audioOperation.current) return;
    setMusicOn(playing);
    if (!playing)
      setMessage("Audio could not play. Check your music URL or try the music button again.");
  }

  function toggleMusic() {
    if (musicOn) {
      audioOperation.current++;
      sound.current?.pause();
      setMusicOn(false);
    } else void startMusic();
  }

  // Keep the timing from the uploaded design: car, toss, petals, title, reveal.
  function finishIntro() {
    if (stageRef.current === "transition" || stageRef.current === "invitation") return;
    clearTimers();
    stageRef.current = "transition";
    setStage("transition");
    setPetalMode("fill");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    later(reduceMotion ? 0 : 900, () => setFlash(!reduceMotion));
    later(reduceMotion ? 20 : 1900, () => {
      video.current?.pause();
      stageRef.current = "invitation";
      setStage("invitation");
      setPetalMode("off");
      window.scrollTo(0, 0);
      later(500, () => setFlash(false));
      later(4500, () => setPetalMode("drift"));
    });
  }

  function openInvitation() {
    if (stageRef.current !== "cover") return;
    stageRef.current = "film";
    setStage("film");
    void startMusic();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return finishIntro();
    if (settings.filmVideoUrl) {
      void video.current
        ?.play()
        .catch(() =>
          setMessage("The intro video could not play. Use Skip to open the invitation."),
        );
      later(30000, finishIntro);
    } else {
      later(2400, () => setToss(true));
      later(3700, () => {
        setBurstKey((value) => value + 1);
        setPetalMode("rain");
      });
      later(4600, () => setFilmTitle(true));
      later(7600, finishIntro);
    }
  }

  function replayIntro() {
    clearTimers();
    audioOperation.current++;
    sound.current?.pause();
    setMusicOn(false);
    dialog.current?.close();
    stageRef.current = "cover";
    setStage("cover");
    setToss(false);
    setFilmTitle(false);
    setFlash(false);
    setPetalMode("off");
    if (video.current) {
      video.current.pause();
      video.current.currentTime = 0;
    }
    window.scrollTo(0, 0);
    later(0, () => root.current?.querySelector<HTMLButtonElement>("#openBtn")?.focus());
  }

  async function copyGuestLink() {
    const link = new URL(location.href);
    link.search = new URLSearchParams({
      m: settings.main.slice(1),
      g: settings.gold.slice(1),
      p: settings.paper.slice(1),
      s: settings.sky.slice(1),
      f: settings.font,
      v: "1",
    }).toString();
    setSharedLink(link.href);
    try {
      await navigator.clipboard.writeText(link.href);
      setMessage("Guest preview link copied.");
    } catch {
      setMessage("Copy the guest preview link shown in the design panel.");
    }
  }

  function saveCalendar() {
    if (!data.weddingDate) return;
    const escape = (value: string) =>
      value
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    const events = data.eventsSchedule.length
      ? data.eventsSchedule
      : [{ name: "Wedding", time: data.weddingTime || "09:00" }];
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedora//Sunset Journey//EN"];
    events.forEach((event, index) => {
      const time = /^\d{2}:\d{2}/.exec(event.time)?.[0] || data.weddingTime || "09:00";
      lines.push(
        "BEGIN:VEVENT",
        `UID:${data.weddingDate}-${index}-${encodeURIComponent(data.brideName + data.groomName)}@wedora`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${(settings.eventDates[index] || data.weddingDate!).replace(/-/g, "")}T${time.replace(":", "")}00`,
        "DURATION:PT3H",
        `SUMMARY:${escape(`${data.brideName} & ${data.groomName} — ${event.name}`)}`,
        `LOCATION:${escape(event.venue || [data.venueName, data.venueAddress].filter(Boolean).join(", "))}`,
        "END:VEVENT",
      );
    });
    lines.push("END:VCALENDAR");
    const url = URL.createObjectURL(
      new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "wedding.ics";
    anchor.click();
    later(1000, () => URL.revokeObjectURL(url));
  }

  return (
    <div
      ref={root}
      style={sunsetStyle(settings)}
      className={`sunsetInvitation mode-${actions.mode} ${modernFont.variable} ${headingFont.variable} ${serifFont.variable} ${stage === "invitation" ? "entered" : "lock"}`}
    >
      <div
        id="cover"
        className={`fixcol ${stage !== "cover" ? "gone" : ""}`}
        inert={stage !== "cover"}
        aria-hidden={stage !== "cover"}
      >
        <div className="drape" />
        <Artwork className="mandala" svg={art.mandala} />
        <div className="cv-txt">
          <p className="eyebrow">The wedding of</p>
          <Ornament />
          <h1 className="names" id="cvNames">
            {names}
          </h1>
          <p className="cv-date">{fullDate}</p>
          <button type="button" className="openbtn" id="openBtn" onClick={openInvitation}>
            <Mail /> Open invitation
          </button>
        </div>
        <Artwork className="village" svg={art.village} />
      </div>

      <div
        id="film"
        className={`fixcol ${stage === "film" || stage === "transition" ? "on play" : ""} ${toss ? "toss" : ""}`}
        inert={stage !== "film"}
        aria-hidden={stage !== "film"}
      >
        <div className="pz" id="filmPz">
          {settings.filmVideoUrl ? (
            <video
              ref={video}
              src={settings.filmVideoUrl}
              muted
              playsInline
              preload="none"
              onEnded={finishIntro}
              onError={() =>
                setMessage("Intro video unavailable. Use Skip to open the invitation.")
              }
            />
          ) : (
            <Artwork svg={art.film} label="A couple in a vintage car at sunset" />
          )}
        </div>
        <div className="vig" />
        <div className={`film-title ${filmTitle ? "on" : ""}`}>
          <small>With the blessings of our families</small>
          <div className="names">{names}</div>
        </div>
        <button type="button" className="skip" id="skip" onClick={finishIntro}>
          SKIP
        </button>
      </div>
      <div id="flash" className={flash ? "on" : ""} aria-hidden="true" />
      <SunsetPetals mode={petalMode} burstKey={burstKey} />

      <button
        type="button"
        className="round"
        id="music"
        aria-label={musicOn ? "Mute music" : "Play music"}
        aria-pressed={musicOn}
        onClick={toggleMusic}
      >
        {musicOn ? <Music2 /> : <VolumeX />}
      </button>
      {actions.mode === "demo" && !guestDemo && (
        <button
          ref={customizerButton}
          type="button"
          className="round"
          id="custFab"
          aria-label="Colours and fonts"
          aria-haspopup="dialog"
          aria-expanded={customizing}
          onClick={() => {
            dialog.current?.showModal();
            setCustomizing(true);
          }}
        >
          <Palette />
          <span className="control-label">Colours &amp; Fonts</span>
        </button>
      )}

      <main
        ref={main}
        className="col"
        id="main"
        tabIndex={-1}
        inert={stage !== "invitation"}
        aria-hidden={stage !== "invitation"}
      >
        <section id="home">
          <Reveal>
            <p className="blessing">Sri Suba Mangalam!</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow invited">You are invited to the wedding of</p>
          </Reveal>
          <Reveal delay={0.15}>
            <Ornament />
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="names" id="hNames">
              {names}
            </h2>
          </Reveal>
          {data.guestName && (
            <Reveal>
              <p className="sm">Dear {data.guestName},</p>
            </Reveal>
          )}
          <Reveal delay={0.3}>
            <div className="parents">
              <div>
                <small>Daughter of</small>
                <b>{data.brideParents}</b>
              </div>
              <div>
                <small>Son of</small>
                <b>{data.groomParents}</b>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="datebar">
              <span>{date?.toLocaleDateString("en-US", { month: "long" })}</span>
              <b>{date?.getDate() ?? "—"}</b>
              <span>{date?.getFullYear()}</span>
            </div>
          </Reveal>
          <Reveal className="art" delay={0.5}>
            {data.coverPhoto ? (
              <img src={data.coverPhoto} alt={`${data.brideName} and ${data.groomName}`} />
            ) : (
              <Artwork svg={art.couple} label="Illustrated wedding couple" />
            )}
          </Reveal>
          <Reveal delay={0.6}>
            <Artwork className="vrow" svg={art.village} />
          </Reveal>
          <a className="scroll" href="#story">
            Scroll down <i>⌄</i>
          </a>
        </section>

        <section id="story">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2>Together Forever</h2>
            <Ornament />
          </Reveal>
          {data.greetingMessage && (
            <Reveal>
              <p className="lead invitation-message">{data.greetingMessage}</p>
            </Reveal>
          )}
          <Reveal delay={0.15}>
            <p className="lead">{settings.story}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="bigdate">{fullDate}</p>
            <p className="sm">{settings.familiesLine}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="venue-cap">{data.venueName}</p>
            <p className="venue-sub">{data.venueAddress}</p>
          </Reveal>
          {settings.timeline.length > 0 && (
            <>
              <Reveal>
                <p className="eyebrow jt">A journey together</p>
              </Reveal>
              <div className="tl rv" id="tl">
                {settings.timeline.map((moment, index) => (
                  <div className="it" key={index}>
                    <span className="yr">{moment.year}</span>
                    <h4>{moment.title}</h4>
                    <p>{moment.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section id="countdown">
          <Reveal>
            <p className="eyebrow">The big day awaits</p>
            <h2>Counting Down</h2>
            <Ornament />
          </Reveal>
          <Reveal delay={0.15}>
            <div className="cd">
              {Object.entries(countdown).map(([label, value]) => (
                <div key={label}>
                  <b>{String(value).padStart(2, "0")}</b>
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="events">
          <Reveal>
            <p className="eyebrow">Celebrate with us</p>
            <h2>Wedding Events</h2>
            <Ornament />
          </Reveal>
          <div className="evs">
            {data.eventsSchedule.map((event, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="evc">
                  <div className="ico">
                    {index === 0 ? <CalendarDays /> : index === 1 ? <Heart /> : <Music2 />}
                  </div>
                  <h4>{event.name}</h4>
                  <p>
                    <CalendarDays />
                    {formatDateLong(settings.eventDates[index] || data.weddingDate)}
                  </p>
                  <p>
                    <Clock3 />
                    {formatTime(event.time)}
                  </p>
                  <p>
                    <MapPin />
                    {event.venue || data.venueName}
                  </p>
                  {event.description && <p>{event.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <button
              type="button"
              className="savebar"
              onClick={saveCalendar}
              disabled={!data.weddingDate}
            >
              <span className="ico">
                <CalendarDays />
              </span>
              <span>
                <b>Save the Date</b>
                <small>Add this wedding to your calendar</small>
              </span>
              <ChevronRight />
            </button>
          </Reveal>
        </section>

        <section id="gallery">
          <Reveal>
            <p className="eyebrow">Captured moments</p>
            <h2>Our Gallery</h2>
            <div className="reddot" />
          </Reveal>
          <div className="grid" id="grid">
            {Array.from({ length: Math.max(6, data.gallery.length) }, (_, index) => (
              <Reveal key={index} className={`tile ${"abcdef"[index % 6]}`}>
                {data.gallery.length ? (
                  <img
                    src={data.gallery[index % data.gallery.length]}
                    alt={`Wedding memory ${index + 1}`}
                    loading="lazy"
                  />
                ) : (
                  <Artwork
                    svg={art.gallery[index % 6]}
                    label={`Illustrated wedding memory ${index + 1}`}
                  />
                )}
              </Reveal>
            ))}
          </div>
        </section>

        <section id="venue">
          <Reveal>
            <p className="eyebrow">The setting</p>
            <h2>Wedding Venue</h2>
            <Ornament />
          </Reveal>
          <Reveal delay={0.15}>
            <div className="pinring">
              <MapPin />
            </div>
            <p className="venue-sub">Venue</p>
            <p className="venue-cap">{data.venueName}</p>
            <p className="sm">{data.venueAddress}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mapc">
              <Artwork svg={art.map} label="Illustrated location map" />
              <span className="pin">
                <MapPin />
              </span>
              {mapUrl && (
                <a className="open" href={mapUrl} target="_blank" rel="noopener noreferrer">
                  Open in Maps ↗
                </a>
              )}
            </div>
          </Reveal>
          {mapUrl && (
            <Reveal delay={0.3}>
              <a className="outline" href={mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin />
                View on map
              </a>
            </Reveal>
          )}
        </section>

        <section id="rsvp">
          <Reveal>
            <p className="eyebrow">Kindly reply</p>
            <h2>Will You Join Us?</h2>
            <Ornament />
            <p className="lead">
              Kindly assure your presence. Please let us know if you will be joining us.
            </p>
            {data.rsvpDeadline && (
              <p className="sm">Kindly respond by {formatDateLong(data.rsvpDeadline)}</p>
            )}
          </Reveal>
          <Reveal delay={0.25}>
            {rsvp.submitted ? (
              <div className="thanks visible" role="status">
                <div className="ico">
                  <Heart />
                </div>
                <h3>With heartfelt thanks</h3>
                <p className="lead">
                  {rsvp.attend
                    ? "We can't wait to celebrate with you."
                    : "We will miss you and send our warmest wishes."}
                </p>
                <button type="button" className="outline" onClick={rsvp.edit}>
                  Change response
                </button>
              </div>
            ) : (
              <form onSubmit={rsvp.submit}>
                {rsvp.askName && (
                  <>
                    <label htmlFor="sunset-guest-name">Full name</label>
                    <input
                      id="sunset-guest-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      maxLength={150}
                      required
                      value={rsvp.name}
                      disabled={disabled}
                      onChange={(event) => rsvp.setName(event.target.value)}
                    />
                  </>
                )}
                <p className="form-label">Will you be attending?</p>
                <div className="opts">
                  <button
                    type="button"
                    className={rsvp.attend === true ? "on" : ""}
                    aria-pressed={rsvp.attend === true}
                    disabled={disabled}
                    onClick={() => rsvp.setAttend(true)}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    className={rsvp.attend === false ? "on" : ""}
                    aria-pressed={rsvp.attend === false}
                    disabled={disabled}
                    onClick={() => rsvp.setAttend(false)}
                  >
                    Regretfully Decline
                  </button>
                </div>
                {rsvp.attend === true && (
                  <>
                    <p className="form-label">Number of guests</p>
                    <div className="step">
                      <button
                        type="button"
                        aria-label="Remove one guest"
                        disabled={disabled}
                        onClick={rsvp.decrement}
                      >
                        −
                      </button>
                      <b>{rsvp.count}</b>
                      <button
                        type="button"
                        aria-label="Add one guest"
                        disabled={disabled}
                        onClick={rsvp.increment}
                      >
                        +
                      </button>
                    </div>
                  </>
                )}
                {rsvp.error && (
                  <p className="response-error" role="alert">
                    {rsvp.error}
                  </p>
                )}
                <button
                  className="outline"
                  type="submit"
                  disabled={disabled || rsvp.attend === null || rsvp.sending}
                >
                  <Send />
                  {disabled ? "RSVP disabled in preview" : rsvp.sending ? "Sending…" : "Send RSVP"}
                </button>
              </form>
            )}
          </Reveal>
        </section>

        <footer>
          <div className="names">{names}</div>
          <p>{fullDate}</p>
          <small>With love &amp; gratitude</small>
        </footer>
      </main>

      <nav className="nav" aria-label="Invitation sections" inert={stage !== "invitation"}>
        {(
          [
            ["home", "Home", Home],
            ["story", "Story", Heart],
            ["events", "Events", CalendarDays],
            ["venue", "Venue", MapPin],
            ["rsvp", "RSVP", Mail],
          ] as const
        ).map(([id, label, Icon]) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? "on" : ""}
            aria-current={activeSection === id ? "location" : undefined}
          >
            <Icon />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      {actions.mode === "demo" && !guestDemo && (
        <dialog
          ref={dialog}
          className="sheet"
          aria-labelledby="sunset-customizer-title"
          onClose={() => {
            setCustomizing(false);
            customizerButton.current?.focus();
          }}
        >
          <div className="sh-head">
            <h2 id="sunset-customizer-title">Colours &amp; Fonts</h2>
            <button
              type="button"
              autoFocus
              aria-label="Close design options"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </div>
          <SunsetEditor settings={settings} onChange={setDemoSettings} demo />
          <div className="acts">
            <button type="button" onClick={replayIntro}>
              Replay intro
            </button>
            <button type="button" onClick={copyGuestLink}>
              Copy guest link
            </button>
            <button type="button" onClick={() => dialog.current?.close()}>
              View invitation
            </button>
          </div>
          {sharedLink && (
            <label className="share-label">
              Guest preview link
              <input readOnly value={sharedLink} onFocus={(event) => event.target.select()} />
            </label>
          )}
        </dialog>
      )}
      {message && (
        <div className="toast show" role="status">
          <span>{message}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
