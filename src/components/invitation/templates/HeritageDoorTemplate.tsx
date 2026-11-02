/* eslint-disable @next/next/no-img-element -- Artwork and customer photos use dynamic image URLs. */
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
  CalendarDays,
  Check,
  ChevronDown,
  MapPin,
  Palette,
  Phone,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  HEIRLOOM_PALETTES,
  HEIRLOOM_TEXT,
  heirloomColours,
  heirloomSettings,
  type HeirloomScene,
} from "../heirloom";
import { HeirloomSound } from "../heirloom-sound";
import { formatTime, mapLink } from "../format";
import { useCountdown } from "../hooks";
import type { TemplateProps } from "../types";
import { heritageArtwork } from "./heritage-art";
import styles from "./heritage-door.module.css";

const BACKGROUNDS = [
  "courtyard",
  "poruwa",
  "house",
  "ceremony",
  "night",
] as const;
const calendarText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

export default function HeritageDoorTemplate({ data, actions }: TemplateProps) {
  const saved = heirloomSettings(data.heirloom);
  const [settings, setSettings] = useState(saved);
  const [language, setLanguage] = useState(saved.language);
  const [opening, setOpening] = useState(false);
  const [walking, setWalking] = useState(false);
  const [opened, setOpened] = useState(false);
  const [scene, setScene] = useState<HeirloomScene>("courtyard");
  const [blurred, setBlurred] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicError, setMusicError] = useState(false);
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
  const invitation = useRef<HTMLElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const paletteButton = useRef<HTMLButtonElement>(null);
  const sheetClose = useRef<HTMLButtonElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const sound = useRef<HeirloomSound | null>(null);
  const soundRequest = useRef(0);
  const text = HEIRLOOM_TEXT[language];
  const colours = heirloomColours(settings);
  const countdown = useCountdown(data.weddingDate, data.weddingTime);
  const artwork = useMemo(
    () =>
      heritageArtwork({
        day: colours.background,
        bloom: colours.bloom,
        night: colours.main,
        acc: colours.accent,
        wood: colours.envelope,
      }),
    [
      colours.background,
      colours.bloom,
      colours.main,
      colours.accent,
      colours.envelope,
    ],
  );
  const gallery = data.gallery.length ? data.gallery : artwork.gallery;
  const story =
    language === "si" ? saved.storySi || saved.storyEn : saved.storyEn;
  const message =
    language === "si"
      ? saved.messageSi || data.greetingMessage
      : data.greetingMessage;
  const dress =
    language === "si" ? saved.dressSi || saved.dressEn : saved.dressEn;
  const timeline = saved.timeline.filter(
    (moment) => moment.titleEn || moment.titleSi,
  );
  const date = (value: string | null) =>
    value
      ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(
          language === "si" ? "si-LK" : "en-US",
          { day: "numeric", month: "long", year: "numeric" },
        )
      : text.datePending;

  // Follow the ZIP's five-second door opening, walk-through and scene arrival.
  useEffect(() => {
    if (!opening) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timers = [
      window.setTimeout(() => setWalking(true), reduced ? 10 : 1500),
      window.setTimeout(() => setScene("poruwa"), reduced ? 20 : 3300),
      window.setTimeout(() => setOpened(true), reduced ? 50 : 5000),
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
      soundRequest.current++;
      sound.current?.dispose();
      audio.current?.pause();
    },
    [],
  );

  // The section at the centre of the screen selects the background scene.
  useEffect(() => {
    if (!opened) return;
    invitation.current?.focus({ preventScroll: true });
    let frame = 0;
    const updateScene = () => {
      frame = 0;
      for (const section of invitation.current?.querySelectorAll<HTMLElement>(
        "[data-scene]",
      ) ?? []) {
        const bounds = section.getBoundingClientRect();
        if (
          bounds.top <= window.innerHeight / 2 &&
          bounds.bottom > window.innerHeight / 2
        ) {
          setScene(section.dataset.scene as HeirloomScene);
          setBlurred(section.dataset.dim === "true");
          break;
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScene);
    };
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    invitation.current
      ?.querySelectorAll("[data-reveal]")
      .forEach((element) => reveal.observe(element));
    updateScene();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      reveal.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [opened]);
  useEffect(() => {
    if (customizing) sheetClose.current?.focus();
  }, [customizing]);

  function stopSound() {
    soundRequest.current++;
    sound.current?.stop();
    audio.current?.pause();
  }
  async function startSound(withOpening: boolean) {
    const request = ++soundRequest.current;
    try {
      sound.current ??= new HeirloomSound();
      const playing = sound.current.start(
        withOpening,
        !saved.musicUrl,
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
      if (saved.musicUrl) {
        audio.current ??= new Audio(saved.musicUrl);
        audio.current.loop = true;
        audio.current.volume = 0.35;
        await Promise.all([playing, audio.current.play()]);
      } else {
        await playing;
      }
      if (request === soundRequest.current) setMusicError(false);
    } catch {
      if (request === soundRequest.current) {
        stopSound();
        setMusicError(true);
      }
    }
  }
  function openDoors() {
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
  function replayDoors() {
    stopSound();
    closeCustomizer();
    setOpening(false);
    setWalking(false);
    setOpened(false);
    setScene("courtyard");
    setBlurred(false);
    invitation.current
      ?.querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((element) => delete element.dataset.visible);
    window.scrollTo({ top: 0, behavior: "instant" });
    window.requestAnimationFrame(() => openButton.current?.focus());
  }
  async function submitRsvp(event: FormEvent) {
    event.preventDefault();
    if (actions.mode === "preview" || sending) return;
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
  function downloadCalendar() {
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
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedora//Grand Heirloom//EN",
      "BEGIN:VEVENT",
      `UID:${data.weddingDate}-${encodeURIComponent(data.brideName + data.groomName)}@wedora`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(new Date(start.getTime() + 6 * 3600000))}`,
      `SUMMARY:${calendarText(`${data.brideName} & ${data.groomName}`)}`,
      `LOCATION:${calendarText([data.venueName, data.venueAddress].filter(Boolean).join(", "))}`,
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

  return (
    <div
      className={`${styles.root} ${styles[settings.font]} ${opened ? styles.entered : ""} ${language === "si" ? styles.sinhala : ""}`}
      style={{ "--heritage-accent": colours.accent } as CSSProperties}
      lang={language}
    >
      <div
        className={`${styles.scenes} ${blurred ? styles.dimmed : ""}`}
        aria-hidden="true"
      >
        {BACKGROUNDS.map((key) => (
          <div
            key={key}
            className={`${styles.scene} ${scene === key ? styles.activeScene : ""} ${walking && !opened && key === "courtyard" ? styles.walkScene : ""}`}
            data-background={key}
            data-active={scene === key}
          >
            <img
              src={
                saved.scenePhotos[key] ||
                (key === "poruwa" ? data.coverPhoto : null) ||
                artwork[key]
              }
              alt=""
            />
          </div>
        ))}
      </div>
      <div className={styles.fireflies} aria-hidden="true">
        {Array.from({ length: 32 }, (_, index) => (
          <i
            key={index}
            style={
              {
                "--x": `${(index * 31 + 9) % 100}%`,
                "--y": `${(index * 43 + 7) % 100}%`,
                "--duration": `${12 + (index % 7)}s`,
                "--delay": `${-index * 1.6}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div
        className={`${styles.intro} ${opening ? styles.opening : ""} ${walking ? styles.walking : ""} ${opened ? styles.hidden : ""}`}
        aria-hidden={opened}
      >
        <div className={styles.facadeFrame}>
          <div className={styles.facade}>
            <img
              src={saved.scenePhotos.door || artwork.door}
              alt=""
              className={styles.facadeImage}
            />
            <div className={`${styles.door} ${styles.leftDoor}`}>
              <img src={artwork.leftDoor} alt="" />
            </div>
            <div className={`${styles.door} ${styles.rightDoor}`}>
              <img src={artwork.rightDoor} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.shade} />
        <button
          ref={openButton}
          type="button"
          className={styles.openButton}
          onClick={openDoors}
          disabled={opening}
          tabIndex={opened ? -1 : 0}
        >
          {text.open}
        </button>
      </div>
      <header className={styles.controls} aria-label="Invitation language">
        <button
          type="button"
          lang="en"
          aria-pressed={language === "en"}
          onClick={() => setLanguage("en")}
        >
          EN
        </button>
        <button
          type="button"
          lang="si"
          aria-pressed={language === "si"}
          onClick={() => setLanguage("si")}
        >
          සිං
        </button>
      </header>
      <button
        type="button"
        className={styles.musicButton}
        aria-label={soundEnabled ? text.muteSound : text.enableSound}
        aria-pressed={soundEnabled}
        onClick={toggleSound}
      >
        {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
      </button>
      {musicError && (
        <p className={styles.musicError} role="alert">
          {text.musicError}
        </p>
      )}
      {actions.mode === "demo" && (
        <button
          ref={paletteButton}
          type="button"
          className={styles.paletteButton}
          aria-label={text.customize}
          aria-expanded={customizing}
          onClick={() => setCustomizing(true)}
        >
          <Palette size={19} />
        </button>
      )}
      <main
        ref={invitation}
        className={styles.content}
        inert={!opened}
        aria-hidden={!opened}
        tabIndex={-1}
      >
        <section
          id="home"
          className={`${styles.section} ${styles.hero}`}
          data-scene="poruwa"
        >
          <p className={styles.tagline} data-reveal>
            {text.tagline}
          </p>
          <h1 data-reveal>
            {data.brideName} <span>&</span> {data.groomName}
          </h1>
          <p className={styles.lead} data-reveal>
            {message || text.request}
          </p>
          <p className={styles.date} data-reveal>
            {date(data.weddingDate)}
          </p>
          <a className={styles.discover} href="#families" data-reveal>
            {text.discover}
            <ChevronDown size={16} />
          </a>
        </section>
        <section id="families" className={styles.section} data-scene="house">
          <h2 data-reveal>{text.together}</h2>
          {data.brideParents && (
            <p className={styles.family} data-reveal>
              {data.brideParents}
            </p>
          )}
          {data.brideParents && data.groomParents && (
            <p className={styles.ampersand} data-reveal>
              &
            </p>
          )}
          {data.groomParents && (
            <p className={styles.family} data-reveal>
              {data.groomParents}
            </p>
          )}
          <p className={styles.familyNote} data-reveal>
            {text.familiesLine}
          </p>
        </section>
        {(data.eventsSchedule.length
          ? data.eventsSchedule
          : [
              {
                name: text.details,
                time: data.weddingTime || "",
                venue: data.venueName || "",
              },
            ]
        ).map((event, index) => {
          const eventMap =
            index === 0 && data.mapUrl && /^https?:\/\//i.test(data.mapUrl)
              ? data.mapUrl
              : mapLink(
                  null,
                  event.venue || data.venueName,
                  event.venue ? null : data.venueAddress,
                );
          return (
            <section
              key={index}
              id={index === 0 ? "details" : `event-${index}`}
              className={`${styles.section} ${index === 0 ? styles.ceremony : ""}`}
              data-scene={index === 0 ? "ceremony" : "night"}
            >
              <h2 data-reveal>{event.name}</h2>
              {event.description && (
                <p className={styles.lead} data-reveal>
                  {event.description}
                </p>
              )}
              <div className={styles.event} data-reveal>
                <h3>{event.name}</h3>
                <p>{date(data.weddingDate)}</p>
                <p>{formatTime(event.time)}</p>
                <p className={styles.venueName}>
                  {event.venue || data.venueName || text.venuePending}
                </p>
                {(!event.venue || event.venue === data.venueName) &&
                  data.venueAddress && (
                    <p className={styles.address}>{data.venueAddress}</p>
                  )}
                {dress && <p className={styles.dress}>{dress}</p>}
              </div>
              {eventMap && (
                <a
                  className={styles.glassButton}
                  href={eventMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal
                >
                  <MapPin size={15} />
                  {text.map}
                </a>
              )}
            </section>
          );
        })}
        <section
          id="save"
          className={`${styles.section} ${styles.centered}`}
          data-scene="night"
        >
          <h2 data-reveal>{text.keepDate}</h2>
          {data.weddingDate && (
            <>
              <div className={styles.clock} data-reveal>
                {Object.entries(countdown).map(([key, value]) => (
                  <div key={key}>
                    <strong>{String(value).padStart(2, "0")}</strong>
                    <small>
                      {text[key as "days" | "hours" | "minutes" | "seconds"]}
                    </small>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={styles.glassButton}
                onClick={downloadCalendar}
                data-reveal
              >
                <CalendarDays size={15} />
                {text.calendar}
              </button>
            </>
          )}
        </section>
        <section
          id="gallery"
          className={styles.section}
          data-scene="night"
          data-dim="true"
        >
          <h2 data-reveal>{text.momentsTitle}</h2>
          <div className={styles.arches}>
            {gallery.map((photo: string, index: number) => (
              <figure key={index} data-reveal>
                <img
                  src={photo}
                  alt={`${data.brideName} & ${data.groomName} · ${index + 1}`}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </section>
        {(story || timeline.length > 0) && (
          <section
            id="story"
            className={styles.section}
            data-scene="house"
            data-dim="true"
          >
            <h2 data-reveal>{text.story}</h2>
            {story && (
              <p className={styles.storyText} data-reveal>
                {story}
              </p>
            )}
            {timeline.length > 0 && (
              <ol className={styles.timeline}>
                {timeline.map((moment, index) => (
                  <li key={index} data-reveal>
                    <small>{moment.year}</small>
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
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
        <section id="seat" className={styles.section} data-scene="night">
          <h2 data-reveal>{text.seatTitle}</h2>
          <p className={styles.lead} data-reveal>
            {text.seatText}
          </p>
          {data.guestName && (
            <p className={styles.guestName} data-reveal>
              {text.dear}
              <strong>{data.guestName}</strong>
            </p>
          )}
        </section>
        <section
          id="rsvp"
          className={`${styles.section} ${styles.rsvp}`}
          data-scene="night"
        >
          <h2 data-reveal>{text.rsvp}</h2>
          <p className={styles.lead} data-reveal>
            {text.rsvpLead}
          </p>
          {data.rsvpDeadline && (
            <p className={styles.deadline} data-reveal>
              {text.deadline} {date(data.rsvpDeadline)}
            </p>
          )}
          {actions.mode !== "live" && (
            <p className={styles.modeNote} data-reveal>
              {actions.mode === "demo" ? text.demo : text.preview}
            </p>
          )}
          {submitted ? (
            <div className={styles.thanks} role="status">
              <Check size={28} />
              <h3>{text.thanks}</h3>
              <p>{text.sent}</p>
              <button
                type="button"
                className={styles.textButton}
                disabled={actions.mode === "preview"}
                onClick={() => setSubmitted(false)}
              >
                {text.edit}
              </button>
            </div>
          ) : (
            <form onSubmit={submitRsvp} className={styles.form} data-reveal>
              <fieldset disabled={actions.mode === "preview" || sending}>
                <fieldset className={styles.attendance}>
                  <legend>{text.attending}</legend>
                  <div className={styles.choices}>
                    <button
                      type="button"
                      aria-pressed={attending === true}
                      onClick={() => setAttending(true)}
                    >
                      {text.yes}
                    </button>
                    <button
                      type="button"
                      aria-pressed={attending === false}
                      onClick={() => setAttending(false)}
                    >
                      {text.no}
                    </button>
                  </div>
                </fieldset>
                {!actions.guestIdentified && (
                  <label>
                    {text.name}
                    <input
                      autoComplete="name"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </label>
                )}
                {attending !== false && (
                  <label>
                    {text.guests}
                    <input
                      type="number"
                      min={1}
                      max={20}
                      required
                      value={guests}
                      onChange={(event) =>
                        setGuests(Number(event.target.value))
                      }
                    />
                  </label>
                )}
                <button className={styles.sendButton} type="submit">
                  {sending ? text.sending : text.send}
                </button>
              </fieldset>
              {error && (
                <p role="alert" className={styles.error}>
                  {text[error]}
                </p>
              )}
            </form>
          )}
        </section>
        <footer
          className={`${styles.section} ${styles.footer}`}
          data-scene="night"
        >
          <p data-reveal>
            {data.brideName} & {data.groomName}
          </p>
          <small data-reveal>{date(data.weddingDate)}</small>
          <div className={styles.calls}>
            {data.bridePhone && (
              <a href={`tel:${data.bridePhone.replace(/[^+\d]/g, "")}`}>
                <Phone size={13} />
                {text.bride}
              </a>
            )}
            {data.groomPhone && (
              <a href={`tel:${data.groomPhone.replace(/[^+\d]/g, "")}`}>
                <Phone size={13} />
                {text.groom}
              </a>
            )}
          </div>
          <span className={styles.brand}>THE GRAND HEIRLOOM · WEDORA</span>
        </footer>
      </main>
      {customizing && actions.mode === "demo" && (
        <div className={styles.backdrop} onClick={closeCustomizer}>
          <aside
            className={styles.customizer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="heirloom-customizer-title"
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
            <div className={styles.customizerHeading}>
              <h2 id="heirloom-customizer-title">{text.customize}</h2>
              <button
                type="button"
                ref={sheetClose}
                aria-label={text.close}
                onClick={closeCustomizer}
              >
                <X size={20} />
              </button>
            </div>
            <p>{text.palette}</p>
            <div className={styles.swatches}>
              {HEIRLOOM_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  aria-pressed={settings.palette === palette.id}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      palette: palette.id,
                      main: "",
                      accent: "",
                      background: "",
                      envelope: "",
                      bloom: "",
                    })
                  }
                >
                  <span
                    style={{
                      background: `linear-gradient(135deg,${palette.background} 34%,${palette.bloom} 34% 56%,${palette.main} 56% 80%,${palette.accent} 80%)`,
                    }}
                  />
                  {palette.name}
                </button>
              ))}
            </div>
            <label>
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
            <button
              type="button"
              className={styles.replayButton}
              onClick={replayDoors}
            >
              {text.replay}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
