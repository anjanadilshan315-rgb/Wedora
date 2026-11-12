"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, CalendarDays, Download, Heart, Image, MapPin, Music2, Pause, Play, Volume2, X } from "lucide-react";
import { EVERMORE_PHOTOS, type PremiumDetails, type PremiumReply, type PublicPremiumInvitation } from "@/lib/premium-invitation";
import { standardAppearance } from "@/lib/standard-appearance";
import { downloadInvitationVideo } from "@/lib/invitation-video";
import ShareInvitation from "@/components/basic-studio/ShareInvitation";
import { formatDateLong, formatTime } from "../invitation/format";
import SolsticeFilmPlayer from "../invitation/solstice/SolsticeFilmPlayer";
import PremiumFallingPetals from "./PremiumFallingPetals";
import PremiumWelcome from "./PremiumWelcome";
import PremiumGallery from "./PremiumGallery";
import baseStyles from "./PremiumInvitation.module.css";
import aurelineStyles from "./aureline/Aureline.module.css";
import AurelineWelcome from "./aureline/AurelineWelcome";
import AurelineHero from "./aureline/AurelineHero";
import AurelineGallery from "./aureline/AurelineGallery";
import AurelineAtmosphere from "./aureline/AurelineAtmosphere";
import walawwaStyles from "./walawwa/Walawwa.module.css";
import WalawwaWelcome from "./walawwa/WalawwaWelcome";
import WalawwaWorld from "./walawwa/WalawwaWorld";
import WalawwaHero from "./walawwa/WalawwaHero";
import WalawwaEvents from "./walawwa/WalawwaEvents";
import WalawwaGallery from "./walawwa/WalawwaGallery";
import evermoreStyles from "./evermore/Evermore.module.css";
import EvermoreWelcome from "./evermore/EvermoreWelcome";
import EvermoreHero from "./evermore/EvermoreHero";
import EvermoreFamilies from "./evermore/EvermoreFamilies";
import EvermoreGallery from "./evermore/EvermoreGallery";
import EvermoreEvents from "./evermore/EvermoreEvents";
import EvermoreAtmosphere from "./evermore/EvermoreAtmosphere";

type ReplyInput = PremiumReply & { name: string; attending: boolean };
const SAMPLE_PHOTOS = ["/assets/saffron/memories.jpg", "/assets/standard/celebration.jpg", "/assets/moonlit/details.jpg", "/assets/saffron/details.jpg"];

function WeddingClock({ date, time, className }: { date: string; time: string; className: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = Date.parse(`${date}T${time || "00:00"}:00+05:30`);
    const update = () => setLeft(Number.isFinite(target) ? Math.max(0, target - Date.now()) : null);
    update(); const timer = setInterval(update, 1000); return () => clearInterval(timer);
  }, [date, time]);
  return <div className={className} aria-label="Wedding countdown">{left === 0 ? <p>Our forever begins today.</p> : [[Math.floor((left ?? 0) / 86400000), "Days"], [Math.floor((left ?? 0) / 3600000) % 24, "Hours"], [Math.floor((left ?? 0) / 60000) % 60, "Minutes"], [Math.floor((left ?? 0) / 1000) % 60, "Seconds"]].map(([n, label]) => <div key={label}><strong>{left === null ? "—" : String(n).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

export default function PremiumInvitation({ details, demo = false, preview = false, embedded = false, guest, sharePath, submitRsvp }: {
  details: PremiumDetails; demo?: boolean; preview?: boolean; embedded?: boolean; guest?: PublicPremiumInvitation["guest"];
  sharePath?: string; submitRsvp?: (input: ReplyInput) => Promise<void>;
}) {
  const isAureline = details.premiumTemplate === "aureline";
  const isWalawwa = details.premiumTemplate === "walawwa";
  const isEvermore = details.premiumTemplate === "evermore";
  const styles = isEvermore ? { ...baseStyles, ...evermoreStyles } : isWalawwa ? { ...baseStyles, ...walawwaStyles } : isAureline ? { ...baseStyles, ...aurelineStyles } : baseStyles;
  const Gallery = isAureline ? AurelineGallery : PremiumGallery;
  const samplePhotos = isEvermore ? EVERMORE_PHOTOS : isWalawwa ? ["/assets/walawwa/estate-embrace.jpg", "/assets/walawwa/tropical-vows.jpg", "/assets/walawwa/garden-monochrome.jpg", "/assets/walawwa/heritage-garden.jpg", "/assets/walawwa/white-blossoms.jpg", "/assets/walawwa/flower-field.jpg"] : isAureline ? ["/assets/aureline/journey.webp", "/assets/aureline/couple.webp", "/assets/solstice/cover.jpg", "/assets/solstice/ceremony.jpg"] : SAMPLE_PHOTOS;
  const [opened, setOpened] = useState(preview);
  const [opening, setOpening] = useState(false);
  const [film, setFilm] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [backgroundPaused, setBackgroundPaused] = useState(false);
  const [volume, setVolume] = useState(.5);
  const [name, setName] = useState(guest?.name ?? "");
  const [attending, setAttending] = useState(guest?.status !== "declined");
  const [reply, setReply] = useState<PremiumReply>(guest?.reply ?? { headCount: 1, events: details.events.map((e) => e.id), dietary: "", message: "", answers: {} });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState<number | null>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colours = standardAppearance(details);
  const theme = { "--forest": colours.primary, "--primary-text": colours.primaryText, "--on-primary": colours.onPrimary, "--paper": colours.paper, "--background": colours.background, "--ink": colours.ink, "--muted": colours.muted, "--line": colours.line, "--ornament": colours.accent, "--gold": colours.readableAccent, "--accent": colours.readableAccent, "--names-font": colours.font.family, "--heading-scale": details.headingScale, "--tracking": `${details.letterSpacing}em` } as CSSProperties;
  const photos = [details.couplePhoto, ...details.gallery, ...details.galleries.flatMap((gallery) => gallery.photos)].filter(Boolean);
  const cover = photos[0] || (demo ? samplePhotos[0] : "");
  const motion = details.motionEnabled !== false && details.animation !== "minimal";
  const filmDetails = { ...details, standardLayout: "vow" as const, customSlug: "", premiumFilm: true, aurelineFilm: isAureline, walawwaFilm: isWalawwa, evermoreFilm: isEvermore, couplePhoto: cover, gallery: photos.length ? photos.slice(1) : demo ? samplePhotos.slice(1) : [] };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function playMusic() {
    if (!audio.current) return;
    try { audio.current.volume = volume; await audio.current.play(); }
    catch { setError("Tap the music control to listen. Please check with the couple if the song is unavailable."); }
  }
  function openInvitation() {
    if (opening) return;
    setOpening(true);
    if (details.musicUrl) void playMusic();
    timer.current = setTimeout(() => {
      setOpened(true);
      root.current?.focus({ preventScroll: true });
      if (!embedded) root.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }, motion && !matchMedia("(prefers-reduced-motion: reduce)").matches ? (isEvermore ? 900 : isWalawwa ? 3300 : isAureline ? 3600 : 1200) : 0);
  }

  return <article ref={root} tabIndex={-1} className={styles.invitation} style={theme} data-template={details.premiumTemplate ?? "rose"} data-embedded={embedded} data-layout={details.premiumLayout} data-opening-style={details.opening} data-animation={details.animation} data-motion={motion ? "on" : "off"}>
    {isWalawwa && <WalawwaWorld opened={opened} motion={motion && !film} videoUrl={details.backgroundVideoUrl} onError={() => setError("The background video is unavailable.")} />}
    {!isEvermore && !isWalawwa && motion && !film && (isAureline ? <AurelineAtmosphere /> : opened ? <PremiumFallingPetals /> : <div className={styles.petals} aria-hidden="true">{Array.from({ length: 30 }, (_, n) => <i key={n} style={{ "--x": `${(n * 37 + 5) % 98}%`, "--y": `${(n * 23) % 97}%`, "--delay": `${-n * 1.4}s`, "--duration": `${12 + n % 6}s` } as CSSProperties} />)}</div>)}
    {isEvermore && motion && !film && <EvermoreAtmosphere opened={opened} />}
    {!opened ? isEvermore ? <EvermoreWelcome details={details} guestName={guest?.name} opening={opening} motion={motion} onOpen={openInvitation} /> : isWalawwa ? <WalawwaWelcome details={details} guestName={guest?.name} opening={opening} onOpen={openInvitation} onSkip={() => { if (timer.current) clearTimeout(timer.current); setOpened(true); root.current?.focus({ preventScroll: true }); if (!embedded) root.current?.scrollIntoView({ block: "start", behavior: "instant" }); }} /> : isAureline ? <AurelineWelcome details={details} guestName={guest?.name} opening={opening} onOpen={openInvitation} onSkip={() => { if (timer.current) clearTimeout(timer.current); setOpened(true); root.current?.focus({ preventScroll: true }); if (!embedded) root.current?.scrollIntoView({ block: "start", behavior: "instant" }); }} /> : <PremiumWelcome details={details} guestName={guest?.name} opening={opening} onOpen={openInvitation} /> : <>
      <header className={styles.topbar}><a href="#premium-home" className={styles.monogram}>{details.brideName[0]}<i>&amp;</i>{details.groomName[0]}</a><span>{formatDateLong(details.weddingDate)}</span><a href="#premium-rsvp">KINDLY REPLY <ArrowUpRight size={12} /></a></header>
      <main className={styles.interior}>
        {isEvermore ? <EvermoreHero details={details} motion={motion} /> : isWalawwa ? <WalawwaHero details={details} /> : isAureline ? <AurelineHero details={details} photo={details.couplePhoto} onError={() => setError("The background video is unavailable.")} /> : <section className={styles.hero} id="premium-home">

          <div className={styles.heroLetter}>
            <span className={styles.eyebrow}>TOGETHER WITH OUR FAMILIES</span>
            <h1><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1>
            <p>REQUEST THE HONOUR OF YOUR PRESENCE<br />AT THE CELEBRATION OF THEIR MARRIAGE</p>
            <span className={styles.flourish}>❦</span>
            <strong>{formatDateLong(details.weddingDate)}</strong><span className={styles.heroTime}>{formatTime(details.weddingTime)}</span>
            <p className={styles.heroVenue}>{details.venueName}<span>{details.venueAddress}</span></p>
            <a className={styles.primaryButton} href="#premium-rsvp">A seat, saved for you <ArrowUpRight size={14} /></a>
          </div>
          {(cover || details.backgroundVideoUrl) && <div className={styles.heroPortrait}>
            {details.backgroundVideoUrl ? <video ref={video} src={details.backgroundVideoUrl} poster={cover} autoPlay muted playsInline loop onError={() => setError("The background video is unavailable.")} /> : <img src={cover} alt={`${details.brideName} and ${details.groomName}`} fetchPriority="high" />}
            <span className={styles.photoNote}>THE BEGINNING OF OUR ALWAYS.</span>
            {details.backgroundVideoUrl && <button type="button" className={styles.videoControl} aria-label={backgroundPaused ? "Play background video" : "Pause background video"} onClick={() => { if (!video.current) return; if (backgroundPaused) void video.current.play().then(() => setBackgroundPaused(false)).catch(() => setError("Tap again to play the background video.")); else { video.current.pause(); setBackgroundPaused(true); } }}>{backgroundPaused ? <Play size={16} /> : <Pause size={16} />}</button>}
          </div>}
        </section>}
        {isEvermore && <EvermoreGallery title={details.galleries[0]?.title || "Once upon a little forever."} photos={details.galleries[0]?.photos.length ? details.galleries[0].photos : demo ? samplePhotos.slice(0,3) : photos.slice(0,3)} motion={motion} story />}
        {isEvermore ? <EvermoreFamilies details={details} photo={cover} guestName={guest?.name} /> : <section className={styles.story} id="premium-story"><span className={styles.eyebrow}>A LOVE LETTER TO OUR FAVOURITE PEOPLE</span><h2>{isWalawwa ? <>Together with <em>our families.</em></> : isAureline ? <>Together, <em>forever.</em></> : <>Every road led<br /><em>to this moment.</em></>}</h2><p>{details.greetingMessage}</p><div className={styles.families}><span>{details.brideParents}</span><Heart size={15} strokeWidth={1} /><span>{details.groomParents}</span></div>{guest?.name && <p className={styles.personalNote}>Dear {guest.name}, our day would be a little less beautiful without you.</p>}</section>}
        <section className={styles.countdown}><span className={styles.eyebrow}>UNTIL OUR FOREVER BEGINS</span><h2>{isEvermore ? <>Wait for the <em>magic.</em></> : isWalawwa ? <>The day we become <em>forever.</em></> : isAureline ? <>Counting down to <em>our day.</em></> : <>With every passing <em>heartbeat.</em></>}</h2><WeddingClock date={details.weddingDate} time={details.weddingTime} className={styles.clock} /></section>
        {isEvermore ? <EvermoreEvents details={details} /> : isWalawwa ? <WalawwaEvents details={details} /> : <section className={styles.events} id="premium-events"><div className={styles.sectionHeading}><span>THE ORDER OF OUR DAY</span><h2>A celebration in <em>chapters.</em></h2><i /></div><div className={styles.eventGrid}>{details.events.map((event, n) => <article key={event.id} className={styles.eventCard}><span className={styles.eventNumber}>0{n + 1}</span><CalendarDays size={26} strokeWidth={.8} /><h3>{event.name}</h3><p>{formatDateLong(event.date)}<strong>{formatTime(event.time)}</strong></p><span className={styles.eventLine} /><h4>{event.venue}</h4><p>{event.address}</p><a href={details.mapUrl && n === 0 ? details.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address}`)}`} target="_blank" rel="noopener noreferrer"><MapPin size={13} /> Find your way <ArrowUpRight size={12} /></a></article>)}</div></section>}
        <div id="premium-gallery">{details.galleries.map((gallery, n) => {
          if (isEvermore && n === 0) return null;
          const galleryPhotos = gallery.photos.length ? gallery.photos : !demo ? [] : isWalawwa ? samplePhotos.slice(n === 0 ? 0 : 3, n === 0 ? 3 : 6) : isAureline || isEvermore ? samplePhotos : n === 0 ? [samplePhotos[0], samplePhotos[1]] : [samplePhotos[2], samplePhotos[3]];
          return isEvermore ? <EvermoreGallery key={gallery.id} title={gallery.title} photos={galleryPhotos} motion={motion} /> : isWalawwa ? <WalawwaGallery key={gallery.id} title={gallery.title} photos={galleryPhotos} motion={motion} variant={n === 0 ? "arch" : "album"} /> : <Gallery key={gallery.id} title={gallery.title} photos={galleryPhotos} motion={motion} />;
        })}</div>
        <section className={styles.filmSection}><div><span className={styles.eyebrow}>SOME MOMENTS DESERVE TO MOVE</span><h2>Our story,<br /><em>in motion.</em></h2><p>A little keepsake of a very big love.</p><button type="button" className={styles.secondaryButton} disabled={exporting !== null} onClick={async () => { setExporting(0); setError(""); try { await downloadInvitationVideo(filmDetails, setExporting); setNotice("Your invitation film has been downloaded."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Video export failed."); } finally { setExporting(null); } }}><Download size={14} />{exporting !== null ? `Creating your film… ${exporting}%` : "Keep our invitation film"}</button><small>12-second silent keepsake · Keep this tab visible during export.</small></div><button type="button" className={styles.filmCover} aria-label="Watch wedding invitation video" onClick={() => setFilm(true)}>{cover && <img src={cover} alt="Our wedding film" loading="lazy" />}<span><Play size={24} strokeWidth={1} /></span><small>{details.brideName} &amp; {details.groomName}<i>THE WEDDING FILM</i></small></button></section>
        <section className={styles.rsvp} id="premium-rsvp"><div className={styles.sectionHeading}><span>KINDLY REPLY</span><h2>Will you join <em>us?</em></h2><p>Your presence is the greatest gift.<br />We have saved a little place in our story for you.</p>{details.rsvpDeadline && <small>PLEASE REPLY BY {formatDateLong(details.rsvpDeadline)}</small>}</div>
          {guest?.table && <p className={styles.seatNote}>Your place is waiting at <strong>{guest.table}</strong>.</p>}
          <form className={styles.rsvpForm} onSubmit={async (event) => { event.preventDefault(); if (!submitRsvp || busy) return; setBusy(true); setError(""); setNotice(""); try { await submitRsvp({ ...reply, name, attending }); setNotice("Thank you. Your reply has been saved with love."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); } finally { setBusy(false); } }}>
            <label>Your full name<input required maxLength={150} value={name} readOnly={Boolean(guest)} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
            <fieldset><legend>Will you be celebrating with us?</legend><label><input type="radio" name="premium-attendance" checked={attending} onChange={() => setAttending(true)} /> Joyfully accept</label><label><input type="radio" name="premium-attendance" checked={!attending} onChange={() => setAttending(false)} /> Regretfully decline</label></fieldset>
            {attending && <><label>Number of guests, including you<select value={reply.headCount || 1} onChange={(e) => setReply({ ...reply, headCount: Number(e.target.value) })}>{Array.from({ length: 10 }, (_, n) => <option key={n} value={n + 1}>{n + 1} {n === 0 ? "guest" : "guests"}</option>)}</select></label><fieldset><legend>We would love to see you at</legend>{details.events.map((event) => <label key={event.id}><input type="checkbox" checked={reply.events.includes(event.id)} onChange={(e) => setReply({ ...reply, events: e.target.checked ? [...reply.events, event.id] : reply.events.filter((id) => id !== event.id) })} />{event.name}</label>)}</fieldset><label>Dietary requirements<input maxLength={250} value={reply.dietary} onChange={(e) => setReply({ ...reply, dietary: e.target.value })} /></label>{details.questions.map((question) => <label key={question.id}>{question.label}{question.required && " *"}{question.type === "select" ? <select required={question.required} value={reply.answers[question.id] ?? ""} onChange={(e) => setReply({ ...reply, answers: { ...reply.answers, [question.id]: e.target.value } })}><option value="">Choose an option</option>{question.options.map((option) => <option key={option}>{option}</option>)}</select> : <input required={question.required} maxLength={500} value={reply.answers[question.id] ?? ""} onChange={(e) => setReply({ ...reply, answers: { ...reply.answers, [question.id]: e.target.value } })} />}</label>)}</>}
            <label>A little note for the couple<textarea rows={3} maxLength={600} value={reply.message} onChange={(e) => setReply({ ...reply, message: e.target.value })} /></label>
            <button className={styles.primaryButton} disabled={!submitRsvp || busy}>{busy ? "Saving your lovely reply…" : submitRsvp ? "Send with love" : "RSVP opens after publishing"}<ArrowUpRight size={14} /></button>
          </form>
        </section>
        {isEvermore && <section className={styles.wishes}><span>BEST WISHES</span><h2>Leave us a little <em>love.</em></h2><p>Your presence is our greatest gift. A few words for our next chapter would mean the world to us.</p><a href="#premium-rsvp">Send your wishes with your reply <ArrowUpRight size={13} /></a></section>}
        {(sharePath || details.whatsapp) && <section className={styles.share}><h2>Love is better <em>together.</em></h2>{sharePath && <ShareInvitation path={sharePath} title={`${details.brideName} & ${details.groomName} · Wedding invitation`} invitationStyle />}{details.whatsapp && <a className={styles.secondaryButton} href={`https://wa.me/${details.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">A note to the couple <ArrowUpRight size={13} /></a>}</section>}
        <footer className={styles.footer}><span>WITH LOVE, ALWAYS</span><strong>{details.brideName} <i>&amp;</i> {details.groomName}</strong><p>{formatDateLong(details.weddingDate)}</p><button type="button" onClick={() => { setOpened(false); setOpening(false); root.current?.scrollIntoView({ block: "start" }); }}>{isEvermore ? "Watch our beginning again" : isWalawwa ? "Open the doors again" : "Open the envelope again"}</button></footer>
      </main>
      <nav className={styles.bottomNav} aria-label="Invitation sections"><a href="#premium-home"><Heart size={16} /><span>Our day</span></a><a href="#premium-events"><CalendarDays size={16} /><span>Details</span></a><a className={styles.navReply} href="#premium-rsvp"><span>{details.brideName[0]}<i>&amp;</i>{details.groomName[0]}</span></a><a href="#premium-gallery"><Image size={16} /><span>Memories</span></a><a href="#premium-rsvp"><ArrowUpRight size={16} /><span>Reply</span></a></nav>
    </>}
    {error && <p role="alert" className={styles.feedback}>{error}<button type="button" aria-label="Dismiss error" onClick={() => setError("")}><X size={14} /></button></p>}
    {notice && <p role="status" className={styles.feedback}>{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={14} /></button></p>}
    {details.musicUrl && <><audio ref={audio} src={details.musicUrl} loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError("The music is unavailable. Please check with the couple.")} /><div className={styles.music}><button type="button" aria-label={playing ? "Pause music" : "Play music"} onClick={() => { if (playing) audio.current?.pause(); else void playMusic(); }}>{playing ? <Pause size={16} /> : <Music2 size={16} />}</button><Volume2 size={13} /><input type="range" aria-label="Music volume" min="0" max="1" step=".05" value={volume} onChange={(e) => { const value = Number(e.target.value); setVolume(value); if (audio.current) audio.current.volume = value; }} /></div></>}
    {film && <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Wedding invitation film" onKeyDown={(e) => { if (e.key === "Escape") setFilm(false); if (e.key === "Tab") { e.preventDefault(); const targets = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button,video")); targets[(targets.indexOf(document.activeElement as HTMLElement) + (e.shiftKey ? targets.length - 1 : 1)) % targets.length]?.focus(); } }}><button type="button" autoFocus aria-label="Close film" onClick={() => setFilm(false)}><X /></button>{details.videoUrl ? <video src={details.videoUrl} controls autoPlay playsInline tabIndex={0} onError={() => setError("The wedding video is unavailable.")} /> : <SolsticeFilmPlayer details={filmDetails} photos={photos.length ? photos : demo ? samplePhotos : []} />}</div>}
  </article>;
}
