"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Check, Download, Heart, Moon, MapPin, Music2, Pause, Play, Sparkles, Volume2, X } from "lucide-react";
import { standardAppearance } from "@/lib/standard-appearance";
import type { StandardInvitationDetails, StandardReply } from "@/lib/standard-invitation";
import { downloadInvitationVideo } from "@/lib/invitation-video";
import ShareInvitation from "@/components/basic-studio/ShareInvitation";
import { formatDateLong, formatTime } from "./format";
import vowStyles from "./StandardInvitation.module.css";
import solsticeStyles from "./solstice/Solstice.module.css";
import { SolsticeWelcome, SolsticeHero } from "./solstice/SolsticeCover";
import SolsticeGallery from "./solstice/SolsticeGallery";
import SolsticeFilmPlayer from "./solstice/SolsticeFilmPlayer";
import SolsticeCountdown from "./solstice/SolsticeCountdown";
import moonlitStyles from "./moonlit/Moonlit.module.css";
import { MoonlitWelcome, MoonlitHero } from "./moonlit/MoonlitCover";
import MoonlitGallery from "./moonlit/MoonlitGallery";
import MoonlitCountdown from "./moonlit/MoonlitCountdown";
import MoonlitAtmosphere from "./moonlit/MoonlitAtmosphere";
import saffronStyles from "./saffron/Saffron.module.css";
import { SaffronWelcome, SaffronHero, SaffronConfetti } from "./saffron/SaffronCover";
import SaffronGallery from "./saffron/SaffronGallery";
import SaffronCountdown from "./saffron/SaffronCountdown";
import MemoryGallery from "./MemoryGallery";

const demoPhotos = ["/assets/standard/couple.jpg", "/assets/standard/celebration.jpg", "/assets/standard/details.jpg", "/assets/standard/moments.jpg"];
const solsticePhotos = ["/assets/solstice/cover.jpg", "/assets/solstice/ceremony.jpg", "/assets/solstice/table.jpg", "/assets/solstice/together.jpg"];
const moonlitPhotos = ["/assets/moonlit/cover.jpg", "/assets/moonlit/celebration.jpg", "/assets/moonlit/memories.jpg", "/assets/moonlit/details.jpg"];
const saffronPhotos = ["/assets/saffron/cover.jpg", "/assets/saffron/celebration.jpg", "/assets/saffron/memories.jpg", "/assets/saffron/details.jpg"];
type ReplyInput = StandardReply & { name: string; attending: boolean };
function Countdown({ date, time, className }: { date: string; time: string; className: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const update = () => { const target = Date.parse(`${date}T${time || "00:00"}:00+05:30`); setLeft(Number.isFinite(target) ? Math.max(0, target - Date.now()) : null); };
    update(); const timer = setInterval(update, 1000); return () => clearInterval(timer);
  }, [date, time]);
  return <div className={className} aria-label="Time until the wedding">{left === 0 ? <p>Our forever begins today.</p> : [[Math.floor((left ?? 0) / 86400000), "days"], [Math.floor((left ?? 0) / 3600000) % 24, "hours"], [Math.floor((left ?? 0) / 60000) % 60, "minutes"], [Math.floor((left ?? 0) / 1000) % 60, "seconds"]].map(([n, label]) => <div key={label}><strong>{left === null ? "—" : String(n).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

export default function StandardInvitation({ details, preview = false, demo = false, guestName, initialReply, initialStatus, submitRsvp, sharePath }: {
  details: StandardInvitationDetails; preview?: boolean; demo?: boolean; guestName?: string | null;
  initialReply?: StandardReply | null; initialStatus?: string; submitRsvp?: (input: ReplyInput) => Promise<void>; sharePath?: string;
}) {
  const isSaffron = details.standardLayout === "saffron";
  const isSolstice = details.standardLayout === "solstice";
  const isMoonlit = details.standardLayout === "moonlit";
  const styles = isSaffron ? { ...solsticeStyles, ...saffronStyles } : isMoonlit ? { ...solsticeStyles, ...moonlitStyles } : isSolstice ? solsticeStyles : vowStyles;
  const Decoration = isSaffron ? ArrowUpRight : isMoonlit ? Moon : isSolstice ? Sparkles : Heart;
  const [opened, setOpened] = useState(preview);
  const [opening, setOpening] = useState(false);


  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(.5);
  const [name, setName] = useState(guestName || "");
  const [attending, setAttending] = useState(initialStatus !== "declined");
  const [reply, setReply] = useState<StandardReply>(initialReply ?? { headCount: 1, events: details.events.map((event) => event.id), dietary: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState<number | null>(null);
  const [film, setFilm] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLElement>(null);
  const seal = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uploadedPhotos = [details.couplePhoto, ...details.gallery].filter(Boolean);
  const photos = uploadedPhotos.length ? uploadedPhotos : demo ? isSaffron ? saffronPhotos : isMoonlit ? moonlitPhotos : isSolstice ? solsticePhotos : demoPhotos : [];
  const colours = standardAppearance(details);
  const theme = { "--paper": colours.paper, "--background": colours.background, "--ink": colours.ink, "--muted": colours.muted, "--line": colours.line, "--gold": colours.readableAccent, "--ornament": colours.accent, "--forest": colours.primary, "--primary-text": colours.primaryText, "--on-primary": colours.onPrimary, "--names-font": colours.font.family, "--heading-font": details.font === "script" ? "var(--font-cormorant), Georgia, serif" : colours.font.family } as CSSProperties;
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    if (!opened || !root.current) return;
    if (details.motionEnabled === false || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add(styles.visible); entry.target.removeAttribute("data-pending"); observer.unobserve(entry.target); } }), { threshold: .08 });
    const nodes = root.current.querySelectorAll(`.${styles.reveal}`);
    nodes.forEach((node) => { node.setAttribute("data-pending", "true"); observer.observe(node); });
    return () => { observer.disconnect(); nodes.forEach((node) => node.removeAttribute("data-pending")); };
  }, [opened, details.motionEnabled, isSolstice, isMoonlit, isSaffron, styles.reveal, styles.visible]);
  async function playMusic() {
    if (!audio.current) return;
    try { audio.current.volume = volume; await audio.current.play(); } catch { setError("Tap the music button to listen. If it still cannot play, the audio link may be unavailable."); }
  }
  function openEnvelope() {
    setOpening(true);
    if (details.musicUrl) void playMusic();
    timer.current = setTimeout(() => { setOpened(true); root.current?.focus({ preventScroll: true }); }, details.motionEnabled === false || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1100);
  }
  const coverPhoto = photos[0];
  return <article ref={root} tabIndex={-1} className={styles.invitation} style={theme} data-animation={details.animation} data-design={details.design} data-layout={details.standardLayout ?? "vow"} data-font={details.font ?? "classic"} data-motion={details.motionEnabled === false ? "off" : "on"}>
    {isSaffron && <SaffronConfetti enabled={opened && !film && details.motionEnabled !== false && details.animation !== "minimal"} />}
    {isMoonlit && <MoonlitAtmosphere enabled={opened && !film && details.motionEnabled !== false && details.animation !== "minimal"} />}
    {!opened && (isSaffron ? <SaffronWelcome details={details} photos={photos} guestName={guestName} opening={opening} onOpen={openEnvelope} /> : isMoonlit ? <MoonlitWelcome details={details} photos={photos} guestName={guestName} opening={opening} onOpen={openEnvelope} /> : isSolstice ? <SolsticeWelcome details={details} photos={photos} guestName={guestName} opening={opening} onOpen={openEnvelope} /> : <section className={`${styles.welcome} ${opening ? styles.opening : ""}`} aria-label="Personal wedding invitation">
      <div className={styles.welcomeTop}><Sparkles size={17} /><span>A MOMENT MADE FOR YOU</span></div>
      <p className={styles.script}>You’re invited</p>
      <h1>{details.brideName} <i>&amp;</i> {details.groomName}</h1>
      <p className={styles.welcomeMessage}>{details.welcomeMessage}</p>
      <div className={styles.envelope}><div className={styles.letter}><span>WITH LOVE, ALWAYS</span><p>{details.brideName[0]} <i>&amp;</i> {details.groomName[0]}</p><small>{formatDateLong(details.weddingDate)}</small></div><div className={styles.flap} /><div className={styles.pocket} /><button ref={seal} disabled={opening} type="button" onClick={openEnvelope} className={styles.seal} aria-label="Open your wedding invitation"><Heart size={22} strokeWidth={1} /></button></div>
      <p className={styles.recipient}>Especially for <strong>{guestName || "our favourite people"}</strong></p>
      <button type="button" className={styles.openButton} onClick={openEnvelope} disabled={opening}>{opening ? "A little magic is unfolding…" : "Open your invitation"}<ArrowUpRight size={15} /></button>
      <p className={styles.fine}>A celebration of love · {formatDateLong(details.weddingDate)}</p>
    </section>)}
    {opened && !isSolstice && !isMoonlit && !isSaffron && <div className={styles.heartRain} aria-hidden="true">{Array.from({ length: 60 }, (_, index) => <span key={index} style={{ "--i": index, "--x": `${(index * 37 + 7) % 97}%`, "--row": `${Math.floor(index / 10) * 16}%`, "--size": `${14 + (index % 4) * 5}px`, "--duration": `${8 + index % 6}s`, "--delay": `${-(index * 1.35)}s` } as CSSProperties}><Heart size="100%" strokeWidth={.8} fill={index % 3 === 0 ? "currentColor" : "none"} /></span>)}</div>}
    <div className={styles.content} hidden={!opened}>
      <nav className={styles.nav} aria-label="Invitation sections"><a href="#standard-home" className={styles.monogram}>{details.brideName[0]}<i>&amp;</i>{details.groomName[0]}<span>THE WEDDING</span></a><div><a href="#standard-story">Our story</a><a href="#standard-events">The celebration</a><a href="#standard-rsvp" className={styles.navRsvp}>RSVP <ArrowUpRight size={12} /></a></div></nav>
      {isSaffron ? <SaffronHero details={details} photos={photos} onMediaError={() => setError("The background video is unavailable. Please check the link.")} /> : isMoonlit ? <MoonlitHero details={details} photos={photos} onMediaError={() => setError("The background video is unavailable. Please check the link.")} /> : isSolstice ? <SolsticeHero details={details} photos={photos} onMediaError={() => setError("The background video is unavailable. Please check the video link.")} /> : <section id="standard-home" className={styles.hero}>
        <div className={styles.ambience} aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <span key={index} style={{ "--i": index } as CSSProperties}>✧</span>)}</div>
        <svg className={styles.botanical} viewBox="0 0 200 300" fill="none" aria-hidden="true"><path d="M35 290C90 220 150 130 153 15M86 224C33 216 18 188 24 163C64 163 87 190 86 224ZM113 174C155 180 186 153 185 128C145 124 117 144 113 174ZM135 117C90 114 77 88 83 67C115 68 136 90 135 117ZM150 61C176 59 190 40 183 20C160 24 147 40 150 61Z" stroke="currentColor" strokeWidth="1" /></svg>
        <div className={styles.heroCopy}><p className={styles.eyebrow}><span />TOGETHER IS A BEAUTIFUL PLACE TO BE</p><p className={styles.script}>We’re getting married</p><h1 className={styles.names}><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1><p className={styles.heroDescription}>Two hearts. One beautiful beginning.<br />And you, right there with us.</p><div className={styles.dateLine}><strong>{details.weddingDate ? new Date(`${details.weddingDate}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "Our date, coming soon"}</strong><span>{details.venueName} · Sri Lanka</span></div><a href="#standard-rsvp" className={styles.button}>Celebrate with us <ArrowUpRight size={15} /></a><p className={styles.heroFoot}><Heart size={12} />A day made sweeter with you in it</p></div>
        <div className={styles.heroVisual}><div className={styles.photoArch}>
          {details.backgroundVideoUrl ? <><video ref={video} src={details.backgroundVideoUrl} autoPlay muted loop playsInline poster={coverPhoto} onError={() => setError("The background video is unavailable. Please check the video link.")} /><button type="button" className={styles.backgroundControl} onClick={(event) => { if (!video.current) return; if (video.current.paused) { void video.current.play(); event.currentTarget.textContent = "Pause background"; } else { video.current.pause(); event.currentTarget.textContent = "Play background"; } }}>Pause background</button></> : coverPhoto ? <img src={coverPhoto} alt={`${details.brideName} and ${details.groomName}`} fetchPriority="high" /> : <div className={styles.photoPlaceholder}><Heart size={64} strokeWidth={.6} /><span>Your forever, captured.</span></div>}
          <span className={styles.photoCaption}>THE START OF SOMETHING BEAUTIFUL</span></div><div className={styles.photoOutline} /><span className={styles.verticalText}>A LOVE LIKE OURS · A DAY LIKE NO OTHER</span><div className={styles.dateCard}><span>SAVE THE DATE</span><strong>{details.weddingDate.split("-")[2] || "—"}</strong><p>{details.weddingDate ? new Date(`${details.weddingDate}T12:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "Coming soon"}</p><Heart size={14} /></div><span className={styles.flourish}>forever starts here</span></div>
      </section>}
      <div className={styles.ribbon}><span>LOVE, LAUGHTER &amp; HAPPILY EVER AFTER</span><Decoration size={12} /><span>{formatDateLong(details.weddingDate).toUpperCase()}</span><Decoration size={12} /><a href="#standard-story">OUR NEXT CHAPTER <ArrowDown size={12} /></a></div>
      <section id="standard-story" className={`${styles.story} ${styles.reveal}`}><div><p className={styles.eyebrow}>01 / A NOTE FROM OUR HEARTS</p><h2>{isSaffron ? <>A chance hello.<br /><em>Our favourite story.</em></> : isSolstice ? <>All the good things.<br /><em>All our favourite people.</em></> : <>Of all the moments,<br /><em>this one is ours.</em></>}</h2><span className={styles.smallFlourish}>with love</span></div><div><p className={styles.storyMessage}>{details.greetingMessage}</p><div className={styles.parents}><p>{details.brideParents}</p><Decoration size={14} strokeWidth={1} /><p>{details.groomParents}</p></div>{guestName && <p className={styles.personalNote}>Dear {guestName}, we saved a little piece of this day just for you.</p>}</div></section>
      {isSaffron ? <SaffronCountdown details={details} /> : isMoonlit ? <MoonlitCountdown details={details} /> : isSolstice ? <SolsticeCountdown details={details} photo={photos[3] || photos[0]} /> : <section className={`${styles.countdownBlock} ${styles.reveal}`}><p className={styles.eyebrow}>EVERY SECOND, A LITTLE CLOSER</p><h2>Counting down to <em>forever.</em></h2><Countdown date={details.weddingDate} time={details.weddingTime} className={styles.countdown} /><p>We can hardly wait to celebrate with you.</p></section>}
      {photos.length > 0 && <section className={`${styles.gallery} ${styles.reveal}`} aria-label="Couple photo slideshow"><div className={styles.sectionTop}><div><p className={styles.eyebrow}>02 / LITTLE MOMENTS, BIG LOVE</p><h2>{isSaffron ? <>The happy <em>collection.</em></> : isMoonlit ? <>A little <em>afterglow.</em></> : isSolstice ? <>A life well <em>loved.</em></> : <>Our kind of <em>magic.</em></>}</h2></div><Decoration className={styles.galleryHeart} size={28} strokeWidth={.7} aria-hidden="true" /></div>{isSaffron ? <SaffronGallery photos={photos} active={opened} motion={details.motionEnabled !== false && details.animation !== "minimal"} sample={demo && !uploadedPhotos.length} /> : isMoonlit ? <MoonlitGallery photos={photos} active={opened} motion={details.motionEnabled !== false && details.animation !== "minimal"} sample={demo && !uploadedPhotos.length} /> : isSolstice ? <SolsticeGallery photos={photos} active={opened} motion={details.motionEnabled !== false && details.animation !== "minimal"} sample={demo && !uploadedPhotos.length} /> : <MemoryGallery photos={photos} active={opened} motion={details.motionEnabled !== false && details.animation !== "minimal"} sample={demo && !uploadedPhotos.length} />}</section>}
      <section id="standard-events" className={`${styles.events} ${styles.reveal}`}><p className={styles.eyebrow}>03 / THE CELEBRATION</p><h2>A day to remember.<br /><em>Memories to keep.</em></h2><p className={styles.sectionIntro}>Come for the vows. Stay for the happy tears, the dancing, and everything in between.</p><div className={styles.eventGrid}>{details.events.map((event, index) => <article key={event.id} className={styles.eventCard}><div className={styles.eventTop}><span>CHAPTER {String(index + 1).padStart(2, "0")}</span><Decoration size={20} strokeWidth={.8} /></div><h3>{event.name}</h3><p className={styles.eventDate}>{formatDateLong(event.date)}</p><strong>{formatTime(event.time)} <small>· Sri Lanka time</small></strong><div className={styles.eventVenue}><MapPin size={16} /><div><p>{event.venue || "Venue to be announced"}</p><span>{event.address}</span></div></div><a href={index === 0 && details.mapUrl ? details.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address}`)}`} target="_blank" rel="noopener noreferrer">Find your way <ArrowUpRight size={14} /></a></article>)}</div></section>
      <section className={`${styles.filmSection} ${styles.reveal}`}><div><p className={styles.eyebrow}>A LITTLE LOVE, IN MOTION</p><h2>Press play on<br /><em>our next chapter.</em></h2><p>A keepsake of the day our forever begins.</p><button className={styles.lightButton} type="button" disabled={exporting !== null} onClick={async () => { setError(""); setExporting(0); try { await downloadInvitationVideo(demo && !uploadedPhotos.length ? { ...details, couplePhoto: photos[0] ?? "", gallery: photos.slice(1) } : details, setExporting); setNotice("Your invitation film has been downloaded."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Video export failed."); } finally { setExporting(null); } }}><Download size={15} />{exporting !== null ? `Creating your film… ${exporting}%` : "Download invitation film"}</button><small>12-second silent keepsake · Keep this tab visible while creating.</small></div><div className={styles.filmPreview}>{coverPhoto ? <img src={coverPhoto} alt="Wedding film cover" loading="lazy" /> : <Decoration size={50} strokeWidth={.6} />}<div className={styles.filmOverlay}><span>{details.brideName} &amp; {details.groomName}</span>{details.videoUrl || isSolstice || isMoonlit || isSaffron ? <button type="button" aria-label="Watch wedding invitation video" onClick={() => setFilm(true)}><Play size={22} /></button> : <Decoration size={30} strokeWidth={1} />}<small>THE WEDDING INVITATION</small></div></div></section>
      <section id="standard-rsvp" className={`${styles.rsvp} ${styles.reveal}`}><div><p className={styles.eyebrow}>04 / YOUR SEAT IS WAITING</p><h2>It wouldn’t be the same<br /><em>without you.</em></h2><p>Let us know if you can make it. We’ll take care of the little details.</p>{details.rsvpDeadline && <p className={styles.deadline}>Kindly reply by <strong>{formatDateLong(details.rsvpDeadline)}</strong></p>}<span className={styles.smallFlourish}>can’t wait to see you</span>{details.whatsapp && <a className={styles.contact} href={`https://wa.me/${details.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">A little question? Message us <ArrowUpRight size={13} /></a>}</div><form className={styles.rsvpForm} onSubmit={async (event) => { event.preventDefault(); if (preview || !submitRsvp || busy) return; setBusy(true); setError(""); try { await submitRsvp({ ...reply, name: guestName || name, attending, headCount: attending ? reply.headCount : 0, events: attending ? reply.events : [] }); setNotice("Your reply is safely with us. Thank you for being part of our story."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not send your reply."); } finally { setBusy(false); } }}>
        {initialStatus && initialStatus !== "pending" && <p className={styles.savedReply}><Check size={14} />Your reply: {initialStatus === "attending" ? "Joyfully attending" : "Unable to attend"}. You can update it below.</p>}
        <label>Your lovely name<input autoComplete="name" required maxLength={150} placeholder="Full name" value={guestName || name} readOnly={Boolean(guestName)} onChange={(event) => setName(event.target.value)} /></label><fieldset className={styles.attendance}><legend>Will you be celebrating with us?</legend><label><input name="standard-attendance" type="radio" checked={attending} onChange={() => setAttending(true)} />Joyfully accept</label><label><input name="standard-attendance" type="radio" checked={!attending} onChange={() => setAttending(false)} />Regretfully decline</label></fieldset>
        {attending && <><label>Number of guests, including you<select value={reply.headCount} onChange={(event) => setReply({ ...reply, headCount: Number(event.target.value) })}>{Array.from({ length: 10 }, (_, n) => <option key={n + 1} value={n + 1}>{n + 1} {n === 0 ? "guest" : "guests"}</option>)}</select></label><fieldset className={styles.eventChoices}><legend>I’ll be joining you for</legend>{details.events.map((event) => <label key={event.id}><input type="checkbox" checked={reply.events.includes(event.id)} onChange={(change) => setReply({ ...reply, events: change.target.checked ? [...reply.events, event.id] : reply.events.filter((id) => id !== event.id) })} />{event.name}</label>)}</fieldset><label>Dietary requirements <span>(optional)</span><input maxLength={250} placeholder="Anything we should know?" value={reply.dietary} onChange={(event) => setReply({ ...reply, dietary: event.target.value })} /></label></>}
        <label>A little note for the couple <span>(optional)</span><textarea maxLength={600} rows={3} placeholder="Send a little love…" value={reply.message} onChange={(event) => setReply({ ...reply, message: event.target.value })} /></label><button className={styles.button} disabled={preview || busy || !submitRsvp || (attending && !reply.events.length)}>{preview || !submitRsvp ? "RSVP opens after publishing" : busy ? "Sending your love…" : "Send my RSVP"}<ArrowUpRight size={15} /></button>
      </form></section>
      {sharePath && <section className={styles.share}><p className={styles.eyebrow}>GOOD THINGS ARE MEANT TO BE SHARED</p><h2>Pass a little <em>love along.</em></h2><ShareInvitation path={sharePath} title={`${details.brideName} & ${details.groomName} · Our wedding`} invitationStyle /></section>}
      <footer className={styles.footer}><Decoration size={22} strokeWidth={.8} /><p className={styles.footerNames}>{details.brideName} <i>&amp;</i> {details.groomName}</p><p>ONE DAY. OUR FAVOURITE PEOPLE. A LIFETIME OF LOVE.</p><span>{formatDateLong(details.weddingDate)} · {details.venueName}</span><button type="button" onClick={() => { setOpened(false); setOpening(false); setTimeout(() => seal.current?.focus(), 0); }}>Replay the little magic <Sparkles size={12} /></button></footer>
    </div>
    {(error || notice) && <div className={styles.toast}><p role={error ? "alert" : "status"}>{error || notice}</p><button type="button" aria-label="Dismiss message" onClick={() => { setError(""); setNotice(""); }}><X size={16} /></button></div>}
    {details.musicUrl && <div className={styles.music}><audio ref={audio} src={details.musicUrl} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setError("The music is unavailable. Please check the audio link."); }} /><button type="button" aria-label={playing ? "Pause music" : "Play music"} aria-pressed={playing} onClick={() => playing ? audio.current?.pause() : void playMusic()}>{playing ? <Pause size={16} /> : <Music2 size={16} />}</button><span>{playing ? "A little soundtrack to our love" : "Play our soundtrack"}</span><Volume2 size={14} /><input aria-label="Music volume" type="range" min="0" max="1" step=".05" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); if (audio.current) audio.current.volume = value; }} /></div>}
    {film && <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Wedding invitation film" onKeyDown={(event) => { if (event.key === "Escape") setFilm(false); if (event.key === "Tab") { event.preventDefault(); const targets = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button,video")); targets[(targets.indexOf(document.activeElement as HTMLElement) + (event.shiftKey ? targets.length - 1 : 1)) % targets.length]?.focus(); } }}><button type="button" autoFocus onClick={() => setFilm(false)} aria-label="Close film"><X /></button>{(isSolstice || isMoonlit || isSaffron) && !details.videoUrl ? <SolsticeFilmPlayer details={details} photos={photos} /> : <video src={details.videoUrl} controls autoPlay playsInline tabIndex={0} onError={() => setError("The invitation video is unavailable. Please check the link.")} />}</div>}
  </article>;
}
