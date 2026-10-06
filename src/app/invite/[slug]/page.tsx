"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Camera, Utensils, Music, GlassWater, PartyPopper, Heart, ArrowLeft } from "lucide-react";

/* ─────────────────────────────────────────── */
/*  SAGE & GOLD MODERN TEMPLATE                */
/* ─────────────────────────────────────────── */

// Custom Leaf SVG component to mimic the floral accents in the design
function FloralAccent({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <svg 
      className={className} 
      style={style}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M20,80 C20,50 50,20 80,20 C80,50 50,80 20,80 Z" 
        fill="#8FA08D" 
        fillOpacity="0.4" 
      />
      <path 
        d="M10,60 C10,40 40,10 60,10 C60,40 40,60 10,60 Z" 
        fill="#A3B19B" 
        fillOpacity="0.5" 
      />
      <path 
        d="M40,90 C40,70 70,40 90,40 C90,70 70,90 40,90 Z" 
        fill="#C59B48" 
        fillOpacity="0.3" 
      />
    </svg>
  );
}

interface TemplateProps {
  receiverName: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingDateLong: string;
  weddingTime: string;
  venue: string;
  mapUrl: string;
}

function SageTemplate({ 
  receiverName, groomName, brideName, weddingDate, weddingDateLong, weddingTime, venue, mapUrl 
}: TemplateProps) {
  
  // -- State --
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Wishes State
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState<{id: number, name: string, text: string}[]>([]);

  // RSVP State
  const [rsvpAttend, setRsvpAttend] = useState<boolean | null>(null);
  const [rsvpCount, setRsvpCount] = useState<number>(1);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // -- Countdown Logic --
  useEffect(() => {
    const target = new Date("Nov 28, 2026 16:30:00").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    setWishes([{ id: Date.now(), name: receiverName, text: wishText }, ...wishes]);
    setWishText("");
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  // -- Timeline Data --
  const timeline = [
    { time: "04:00 PM", event: "Welcome Drinks & Guest Arrival", icon: <GlassWater className="w-3.5 h-3.5" /> },
    { time: "04:30 PM", event: "Wedding Ceremony", icon: <Heart className="w-3.5 h-3.5" /> },
    { time: "05:30 PM", event: "Cocktails & Photos", icon: <Camera className="w-3.5 h-3.5" /> },
    { time: "07:00 PM", event: "Dinner & Reception", icon: <Utensils className="w-3.5 h-3.5" /> },
    { time: "08:30 PM", event: "After Party & Dancing", icon: <Music className="w-3.5 h-3.5" /> },
  ];

  // Colors
  const SAGE = "#8FA08D";
  const CREAM = "#F8F5EE";
  const GOLD = "#C59B48";
  const DARK = "#4A433E";

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans text-[#4A433E]">
      <div className="max-w-md mx-auto bg-[#F8F5EE] min-h-screen shadow-2xl relative overflow-hidden">
        
        {/* ════════════════════════════════════════════════════ */}
        {/* 1. HERO SECTION                                      */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="relative pt-16 pb-6 text-center" style={{ background: `linear-gradient(to bottom, ${SAGE} 0%, ${SAGE} 55%, ${CREAM} 100%)` }}>
          
          {/* Decorative Floral Accents */}
          <FloralAccent className="absolute -top-4 -left-4 w-32 h-32 rotate-[-45deg]" />
          <FloralAccent className="absolute top-10 -right-8 w-24 h-24 rotate-[90deg]" />

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 px-6">
            <p className="font-script-romantic text-2xl text-white mb-2">The Wedding of</p>
            <h1 className="font-serif-luxury text-[2.75rem] text-[#D4AF37] leading-none mb-4 uppercase tracking-wider">
              {groomName}
              <span className="block text-3xl text-white my-1">&</span>
              {brideName}
            </h1>
            
            <p className="text-[10px] text-white/90 font-medium tracking-wide mb-8 px-4 leading-relaxed">
              Dearest {receiverName},<br/>You are warmly invited to celebrate with us.
            </p>

            {/* Circular Image Frame */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-[3px] border-[#D4AF37] scale-105" />
              {/* Optional: leaf wreath overlay could go here */}
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/50 bg-[#8FA08D]">
                <img 
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" 
                  alt="Couple" 
                  className="w-full h-full object-cover"
                />
              </div>
              <FloralAccent className="absolute -bottom-6 -left-4 w-20 h-20 rotate-[-120deg]" />
              <FloralAccent className="absolute -top-4 -right-4 w-16 h-16 rotate-[45deg]" />
            </div>

            <p className="text-white tracking-[0.2em] uppercase text-[10px] font-bold mb-1">Save The Date</p>
            <p className="font-serif-luxury text-lg text-white font-bold">{weddingDate}</p>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 2. DAY COUNT DOWN                                    */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="bg-[#F8F5EE] pb-10 pt-2 text-center relative z-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[#4A433E] tracking-[0.15em] uppercase text-[10px] font-bold mb-4">Day Count Down</p>
            
            <div className="flex justify-center items-center gap-1.5">
              {Object.entries(timeLeft).map(([label, value], i) => (
                <React.Fragment key={label}>
                  <div className="w-14 h-16 bg-gradient-to-b from-[#C59B48] to-[#B38936] rounded-md flex flex-col items-center justify-center shadow-md border border-[#D4AF37]/50">
                    <span className="font-serif-luxury text-2xl font-bold text-white leading-none mb-1">{value.toString().padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-widest text-white/90 font-semibold">{label}</span>
                  </div>
                  {i < 3 && <span className="text-[#C59B48] font-bold text-xl px-0.5 mb-2">:</span>}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 3. WHEN & WHERE                                      */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="bg-[#F8F5EE] py-10 text-center relative border-t border-[#8FA08D]/20">
          <FloralAccent className="absolute top-2 -left-8 w-24 h-24 rotate-[120deg] opacity-60" />
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 px-6">
            <p className="text-[10px] text-[#4A433E] tracking-[0.15em] uppercase mb-1 font-bold">The Event Details</p>
            <h2 className="font-serif-luxury text-[2rem] text-[#4A433E] mb-6 leading-none">When & Where</h2>
            
            <p className="text-[11px] text-[#4A433E] font-bold uppercase tracking-wider mb-0.5">Date:</p>
            <p className="text-[11px] text-[#4A433E] mb-4">{weddingDateLong}<br/>& Time: Starting at {weddingTime}</p>
            
            <p className="text-[11px] text-[#4A433E] font-bold uppercase tracking-wider mb-0.5">Venue:</p>
            <p className="text-[11px] text-[#4A433E] mb-6">{venue}</p>
            
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-[#C59B48] to-[#B38936] text-white text-[10px] font-bold px-8 py-2.5 rounded-full tracking-widest uppercase shadow-md active:scale-95 transition-transform"
            >
              View on Map
            </a>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 4. EVENT SCHEDULE                                    */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="bg-[#F8F5EE] py-10 text-center relative border-t border-[#8FA08D]/20">
          <FloralAccent className="absolute top-10 -right-10 w-32 h-32 rotate-[-45deg] opacity-60" />
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
            <h2 className="font-serif-luxury text-[2rem] text-[#4A433E] mb-10">Event Schedule</h2>
            
            <div className="max-w-[280px] mx-auto relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#C59B48]/20 via-[#C59B48] to-[#C59B48]/20 -translate-x-1/2" />
              
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center justify-between mb-8 relative">
                  <div className="w-[42%] text-right pr-3">
                    <p className="text-[10px] font-bold text-[#4A433E]">{item.time}</p>
                  </div>
                  
                  <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#C59B48] to-[#B38936] text-white flex items-center justify-center z-10 shadow-md border-2 border-[#F8F5EE]">
                    {item.icon}
                  </div>
                  
                  <div className="w-[42%] text-left pl-3">
                    <p className="text-[9px] font-bold text-[#4A433E] leading-snug pr-2">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <FloralAccent className="absolute bottom-0 -left-6 w-24 h-24 rotate-[60deg] opacity-60" />
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 5. OUR JOURNEY (PHOTO GALLERY)                       */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="bg-[#F8F5EE] py-10 text-center relative border-t border-[#8FA08D]/20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-serif-luxury text-[2rem] text-[#4A433E] mb-6">Our Journey</h2>
            
            <div className="grid grid-cols-3 gap-1.5 px-6 max-w-sm mx-auto">
              <div className="col-span-1 aspect-square bg-[#8FA08D]/20 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 aspect-square bg-[#8FA08D]/20 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 aspect-square bg-[#8FA08D]/20 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
              
              <div className="col-span-2 aspect-[4/3] bg-[#8FA08D]/20 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 aspect-[2/3] bg-[#8FA08D]/20 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1583939000148-73599b533d3c?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
            </div>

            <button className="mt-8 border border-[#C59B48] text-[#C59B48] text-[10px] font-bold px-8 py-2 rounded-full tracking-widest uppercase hover:bg-[#C59B48] hover:text-white transition-colors">
              View More
            </button>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 6. SHARE YOUR WISHES                                 */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="bg-[#F8F5EE] py-10 text-center relative border-t border-[#8FA08D]/20">
          <FloralAccent className="absolute top-6 -right-6 w-24 h-24 rotate-[180deg] opacity-60" />
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 px-6">
            <p className="text-[10px] text-[#4A433E] tracking-[0.15em] uppercase mb-1 font-bold">Bless the Couple</p>
            <h2 className="font-serif-luxury text-[2rem] text-[#4A433E] mb-6 leading-none">Share Your Wishes</h2>
            
            <form onSubmit={handleWishSubmit} className="flex mb-8 shadow-sm rounded-md overflow-hidden border border-[#8FA08D]/20">
              <input 
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                className="flex-1 text-[11px] px-4 py-3 bg-white text-[#4A433E] placeholder:text-[#4A433E]/50 focus:outline-none" 
                placeholder="Write your wish here..." 
              />
              <button 
                type="submit"
                disabled={!wishText.trim()}
                className="bg-gradient-to-r from-[#C59B48] to-[#B38936] text-white text-[10px] font-bold px-4 py-3 uppercase tracking-wider disabled:opacity-70"
              >
                Send Wish
              </button>
            </form>

            <div className="flex flex-wrap gap-3 justify-center">
              {wishes.map((w) => (
                <div key={w.id} className="bg-[#E4EAE1] p-3 rounded-md text-[10px] text-[#4A433E] max-w-[140px] text-center border border-[#8FA08D]/30 shadow-sm relative">
                  {/* Subtle decorative quote lines mimicking scroll paper */}
                  <div className="absolute left-1 top-1 bottom-1 w-[2px] bg-[#C59B48]/30 rounded-full" />
                  <div className="absolute right-1 top-1 bottom-1 w-[2px] bg-[#C59B48]/30 rounded-full" />
                  
                  <p className="mb-2 italic leading-relaxed px-2">"{w.text}"</p>
                  <p className="font-bold text-[9px]">- {w.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 7. RSVP SECTION                                      */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="bg-[#8FA08D] py-12 px-8 text-center relative border-t-4 border-[#C59B48]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[10px] text-[#F8F5EE] tracking-[0.15em] uppercase mb-1 font-bold">RSVP Section</p>
            <h2 className="font-serif-luxury text-[2rem] text-white mb-8 leading-none">Will You Be Attending?</h2>

            {rsvpSubmitted ? (
              <div className="bg-[#F8F5EE]/10 p-6 rounded-md border border-white/20">
                <Heart className="w-10 h-10 text-[#C59B48] mx-auto mb-3 fill-[#C59B48]" />
                <p className="font-serif-luxury text-xl font-bold text-white mb-1">Thank You!</p>
                <p className="text-xs text-white/90">Your response has been recorded.</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-6 text-left">
                <div className="text-center mb-2">
                  <p className="text-white/80 text-xs">RSVP for</p>
                  <p className="text-white font-serif-luxury font-bold text-xl">{receiverName}</p>
                </div>
                
                <div>
                  <label className="text-[10px] text-white mb-2 block font-medium uppercase tracking-widest text-center">Can you make it?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvpAttend(true)}
                      className={`py-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${rsvpAttend === true ? 'bg-[#C59B48] text-white border-2 border-[#C59B48]' : 'bg-transparent text-white border-2 border-white/40 hover:bg-white/10'}`}
                    >
                      Yes, I'll attend
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpAttend(false)}
                      className={`py-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${rsvpAttend === false ? 'bg-white/20 text-white border-2 border-white/40' : 'bg-transparent text-white border-2 border-white/40 hover:bg-white/10'}`}
                    >
                      No, I can't
                    </button>
                  </div>
                </div>

                {rsvpAttend === true && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="text-[10px] text-white mb-2 block font-medium uppercase tracking-widest text-center mt-2">Number of Guests</label>
                    <div className="flex items-center justify-center gap-4 bg-white/10 p-3 rounded-md border border-white/20">
                      <button type="button" onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))} className="w-8 h-8 rounded bg-white/20 text-white font-bold hover:bg-white/30 transition-colors">-</button>
                      <span className="text-white font-serif-luxury text-2xl w-8 text-center">{rsvpCount}</span>
                      <button type="button" onClick={() => setRsvpCount(rsvpCount + 1)} className="w-8 h-8 rounded bg-white/20 text-white font-bold hover:bg-white/30 transition-colors">+</button>
                    </div>
                  </motion.div>
                )}
                
                <button 
                  type="submit"
                  disabled={rsvpAttend === null}
                  className="w-full bg-gradient-to-r from-[#C59B48] to-[#B38936] text-white font-bold text-[10px] tracking-widest uppercase py-3.5 rounded-md mt-6 shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                >
                  Submit RSVP
                </button>
              </form>
            )}
          </motion.div>
        </section>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  KANDYAN & GOLD TRADITIONAL TEMPLATE        */
/* ─────────────────────────────────────────── */
function KandyanTemplate({ 
  receiverName, groomName, brideName, weddingDate, weddingDateLong, weddingTime, venue, mapUrl 
}: TemplateProps) {
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState<{id: number, name: string, text: string}[]>([]);
  const [rsvpAttend, setRsvpAttend] = useState<boolean | null>(null);
  const [rsvpCount, setRsvpCount] = useState<number>(1);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    const target = new Date("Nov 28, 2026 09:15:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) return clearInterval(interval);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    setWishes([{ id: Date.now(), name: receiverName, text: wishText }, ...wishes]);
    setWishText("");
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  const timeline = [
    { time: "09:15 AM", event: "Welcome of Guest with Magul Bera & Kandyan Dancers" },
    { time: "09:45 AM", event: "Arrival of the Bride & Groom" },
    { time: "10:18 AM", event: "Auspicious 'Poruwa' Ceremony (Nekatha)" },
    { time: "11:30 AM", event: "Traditional Oil Lamp & Cake Cutting" },
    { time: "12:30 PM", event: "Royal Feast & Lunch" },
    { time: "02:30 PM", event: "'Going Out' Procession" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#EBE5DA] min-h-screen font-sans text-[#2D241A] py-0 sm:py-8">
      <div className="max-w-md mx-auto bg-[#FDFBF7] min-h-screen shadow-2xl relative overflow-hidden border-x-4 border-t-4 border-[#A67C00]/20">
        
        {/* ════════════════════════════════════════════════════ */}
        {/* 1. HERO SECTION                                      */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="relative pt-16 pb-10 text-center px-6">
          {/* Top Decorative Border Mockup */}
          <div className="absolute top-4 left-4 right-4 h-24 border-t-2 border-l-2 border-r-2 border-[#A67C00] rounded-t-xl opacity-60" />
          <div className="absolute top-3 left-3 right-3 h-24 border-t border-l border-r border-[#A67C00] rounded-t-xl opacity-30" />
          
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10">
            <p className="font-script-romantic text-2xl text-[#2D241A] mb-3 mt-4">The Wedding of</p>
            <h1 className="font-serif-luxury text-[2.75rem] text-[#A67C00] leading-none mb-6 uppercase tracking-widest font-bold">
              {groomName}
              <span className="block text-2xl text-[#2D241A] my-2 font-script-romantic normal-case">&</span>
              {brideName}
            </h1>
            
            <p className="text-[11px] text-[#2D241A] font-medium tracking-wide mb-8 px-4 leading-relaxed font-serif-luxury text-lg italic">
              Dearest {receiverName},<br/>You are warmly invited to<br/>celebrate with us...
            </p>

            {/* Archway Image Frame */}
            <div className="relative w-56 mx-auto mb-10 mt-6">
              <div className="aspect-[3/4] w-full rounded-t-full border-[3px] border-[#A67C00] p-1.5 mx-auto">
                <div className="w-full h-full rounded-t-full overflow-hidden bg-[#F0E6D2]">
                  <img 
                    src="https://images.unsplash.com/photo-1583939000148-73599b533d3c?auto=format&fit=crop&q=80" 
                    alt="Couple" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Fake intricate floral bases */}
              <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-[#A67C00]/20 rounded-full blur-sm" />
              <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-[#A67C00]/20 rounded-full blur-sm" />
            </div>

            <p className="text-[#2D241A] tracking-[0.15em] uppercase text-sm mb-1 font-serif-luxury">SAVE THE DATE</p>
            <p className="font-serif-luxury text-2xl text-[#2D241A] uppercase">{weddingDate}</p>
            
            <div className="flex justify-center items-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-[#A67C00] opacity-50" />
              <div className="w-12 h-px bg-[#A67C00] opacity-50" />
              <div className="w-2 h-2 rounded-full bg-[#A67C00] opacity-50" />
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 2. WHEN & WHERE (MOONSTONE ARCH)                     */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="py-10 text-center relative px-6 bg-[#FDFBF7]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {/* Fake Arch Design */}
            <div className="relative w-64 h-32 mx-auto overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[14px] border-double border-[#A67C00]/40 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-[2px] border-dashed border-[#A67C00]/60 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-[8px] border-[#A67C00]/20" />
                </div>
              </div>
              <div className="absolute bottom-0 w-full text-center">
                <h2 className="font-serif-luxury text-[1.75rem] text-[#2D241A] font-bold bg-[#FDFBF7] px-4 mx-auto inline-block">When & Where</h2>
              </div>
            </div>

            <p className="text-[#A67C00] font-bold text-xs uppercase tracking-widest mb-1">Date</p>
            <p className="text-[11px] text-[#2D241A] font-bold mb-4">{weddingDateLong}</p>
            
            <p className="text-[#A67C00] font-bold text-xs uppercase tracking-widest mb-1">Venue</p>
            <p className="text-[11px] text-[#2D241A] font-bold mb-5 max-w-[200px] mx-auto">{venue}</p>
            
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-[#C59B48] to-[#A67C00] text-white text-[9px] font-bold px-6 py-2 rounded-full tracking-widest uppercase shadow-md mb-6"
            >
              View on Map
            </a>
            
            <p className="text-[9px] text-[#2D241A] font-bold italic tracking-wide">
              Celebrating under Auspicious Times<br/>('Nekatha')
            </p>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 3. DAY COUNT DOWN                                    */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="pb-10 pt-2 text-center relative border-b border-[#A67C00]/20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[#2D241A] tracking-[0.15em] uppercase text-xs font-serif-luxury font-bold mb-4">Day Countdown</p>
            
            <div className="flex justify-center items-center gap-3 text-[#2D241A] font-serif-luxury text-[2rem]">
              {Object.entries(timeLeft).map(([label, value], i) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center w-12">
                    <span className="leading-none mb-1">{value.toString().padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-widest text-[#2D241A] font-sans font-bold">{label}</span>
                  </div>
                  {i < 3 && <span className="pb-4 opacity-50">:</span>}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
          {/* Bottom Decorative Border Mockup */}
          <div className="absolute bottom-2 left-4 right-4 h-12 border-b border-l border-r border-[#A67C00] rounded-b-xl opacity-30" />
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 4. EVENT SCHEDULE (NEKATH PATHRAYA)                  */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="bg-[#F6F1E5] py-12 px-6 text-center border-b border-[#A67C00]/20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-serif-luxury text-2xl text-[#2D241A] font-bold mb-1">Event Schedule</h2>
            <p className="font-serif-luxury text-lg text-[#2D241A] mb-8 font-bold">නැකැත් පත්‍රය</p>
            
            <div className="max-w-[280px] mx-auto space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center text-left">
                  <div className="w-20 shrink-0 text-[#2D241A] font-serif-luxury font-bold text-xs">
                    {item.time}
                  </div>
                  
                  <div className="w-8 shrink-0 flex justify-center text-[#A67C00]">
                    <div className="w-4 h-4 rounded-full border-2 border-[#A67C00] flex items-center justify-center opacity-60">
                       <div className="w-1.5 h-1.5 bg-[#A67C00] rounded-full" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-[10px] text-[#2D241A] font-bold leading-tight pl-2">
                    {item.event}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 5. OUR STORY (GALLERY)                               */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="py-12 text-center bg-[#FDFBF7]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-serif-luxury text-2xl text-[#2D241A] font-bold mb-6">Our Story</h2>
            
            <div className="grid grid-cols-3 gap-1.5 px-6 max-w-sm mx-auto">
              <div className="col-span-1 aspect-square bg-[#A67C00]/10 overflow-hidden rounded-sm">
                <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 aspect-square bg-[#A67C00]/10 overflow-hidden rounded-sm">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 aspect-square bg-[#A67C00]/10 overflow-hidden rounded-sm">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
              
              <div className="col-span-1 aspect-[3/4] bg-[#A67C00]/10 overflow-hidden rounded-sm">
                <img src="https://images.unsplash.com/photo-1583939000148-73599b533d3c?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 aspect-[3/2] bg-[#A67C00]/10 overflow-hidden rounded-sm">
                <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80" alt="Journey" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 6. BLESS THE COUPLE                                  */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="bg-[#F6F1E5] py-12 px-8 text-center border-y border-[#A67C00]/20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-serif-luxury text-2xl text-[#2D241A] font-bold mb-1">Bless the Couple</h2>
            <p className="font-serif-luxury text-lg text-[#2D241A] mb-6 font-bold">ප්‍රාර්ථනා</p>
            
            <form onSubmit={handleWishSubmit} className="mb-6">
              <textarea 
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                className="w-full text-xs px-4 py-3 bg-white border border-[#A67C00]/30 rounded-md text-[#2D241A] placeholder:text-[#2D241A]/40 focus:outline-none mb-3 resize-none shadow-inner" 
                placeholder="Write your wish here..."
                rows={2}
              />
              <button 
                type="submit"
                disabled={!wishText.trim()}
                className="bg-[#D3B473] text-[#2D241A] text-[10px] font-bold px-6 py-2 rounded uppercase tracking-wider disabled:opacity-70 mx-auto block shadow-sm border border-[#C59B48]"
              >
                Send Wish
              </button>
            </form>

            <div className="space-y-2 text-left max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {wishes.map((w) => (
                <div key={w.id} className="bg-[#EBE5DA] p-3 rounded text-[10px] text-[#2D241A] border border-[#A67C00]/20 flex justify-between items-center shadow-sm">
                  <p className="italic font-medium truncate flex-1 pr-2">"{w.text}"</p>
                  <p className="font-bold shrink-0 opacity-70">- {w.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* 7. RSVP SECTION                                      */}
        {/* ════════════════════════════════════════════════════ */}
        <section className="py-12 px-8 text-center bg-[#FDFBF7] relative">
          <div className="absolute bottom-4 left-4 right-4 h-16 border-b-2 border-l-2 border-r-2 border-[#A67C00] rounded-b-xl opacity-60" />
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
            <h2 className="font-serif-luxury text-2xl text-[#2D241A] mb-8 font-bold">Kindly RSVP</h2>

            {rsvpSubmitted ? (
              <div className="bg-[#A67C00]/10 p-6 rounded-md border border-[#A67C00]/30 mb-8">
                <p className="font-serif-luxury text-xl font-bold text-[#2D241A] mb-1">Thank You!</p>
                <p className="text-xs text-[#2D241A]/80">Your response has been recorded.</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-5 text-left mb-8">
                <div className="text-center mb-4">
                  <p className="text-[#2D241A]/60 text-[10px] uppercase tracking-widest font-bold">RSVP for</p>
                  <p className="text-[#2D241A] font-serif-luxury font-bold text-xl">{receiverName}</p>
                </div>

                <div>
                  <label className="text-[10px] text-[#2D241A] mb-2 block font-bold text-center">WILL YOU ATTEND?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvpAttend(true)}
                      className={`py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border border-[#A67C00]/40 shadow-sm ${rsvpAttend === true ? 'bg-[#C59B48] text-white border-[#C59B48]' : 'bg-white text-[#2D241A] hover:bg-[#F6F1E5]'}`}
                    >
                      Yes, I'll attend
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpAttend(false)}
                      className={`py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border border-[#A67C00]/40 shadow-sm ${rsvpAttend === false ? 'bg-[#2D241A] text-white border-[#2D241A]' : 'bg-white text-[#2D241A] hover:bg-[#F6F1E5]'}`}
                    >
                      No, I can't
                    </button>
                  </div>
                </div>

                {rsvpAttend === true && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                    <label className="text-[10px] text-[#2D241A] mb-2 block font-bold text-center">NUMBER OF GUESTS</label>
                    <div className="flex items-center justify-center gap-4 bg-white py-2 rounded border border-[#A67C00]/40 shadow-sm max-w-[200px] mx-auto">
                      <button type="button" onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))} className="w-8 h-8 rounded text-[#A67C00] font-bold hover:bg-[#F6F1E5] transition-colors">-</button>
                      <span className="text-[#2D241A] font-serif-luxury font-bold text-2xl w-8 text-center leading-none">{rsvpCount}</span>
                      <button type="button" onClick={() => setRsvpCount(rsvpCount + 1)} className="w-8 h-8 rounded text-[#A67C00] font-bold hover:bg-[#F6F1E5] transition-colors">+</button>
                    </div>
                  </motion.div>
                )}
                
                <button 
                  type="submit"
                  disabled={rsvpAttend === null}
                  className="w-full bg-[#C59B48] text-white font-bold text-[11px] tracking-widest uppercase py-3 rounded mt-4 shadow-md active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                >
                  Submit RSVP
                </button>
              </form>
            )}
          </motion.div>
        </section>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  PAGE WRAPPER (DATA FETCHING MOCK)          */
/* ─────────────────────────────────────────── */
function InvitePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("guest") ?? "Guest Name";
  const slug = params.slug as string;
  
  const mockWeddingData = {
    groomName: "Kaveen",
    brideName: "Ishara",
    weddingDate: "28TH NOVEMBER 2026",
    weddingDateLong: "Saturday, November 28th, 2026",
    weddingTime: "4:30 PM",
    venue: "The Grand Ballroom, Kingsbury Hotel, Colombo",
    mapUrl: "https://maps.google.com/?q=Kingsbury+Hotel+Colombo"
  };

  // If slug contains 'kandyan' or 'template2', render the traditional template
  if (slug === 'template2' || slug === 'demo-kandyan') {
    return (
      <KandyanTemplate 
        receiverName={guestName}
        groomName={mockWeddingData.groomName}
        brideName={mockWeddingData.brideName}
        weddingDate={mockWeddingData.weddingDate}
        weddingDateLong={mockWeddingData.weddingDateLong}
        weddingTime={mockWeddingData.weddingTime}
        venue={mockWeddingData.venue}
        mapUrl={mockWeddingData.mapUrl}
      />
    );
  }

  // Default to Sage Template
  return (
    <SageTemplate 
      receiverName={guestName}
      groomName={mockWeddingData.groomName}
      brideName={mockWeddingData.brideName}
      weddingDate={mockWeddingData.weddingDate}
      weddingDateLong={mockWeddingData.weddingDateLong}
      weddingTime={mockWeddingData.weddingTime}
      venue={mockWeddingData.venue}
      mapUrl={mockWeddingData.mapUrl}
    />
  );
}

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isKandyan = slug === 'template2' || slug === 'demo-kandyan';

  return (
    <>
      <button 
        onClick={() => router.back()} 
        className="fixed top-4 left-4 z-[999] bg-white/80 backdrop-blur-md text-[#2D241A] rounded-full p-2.5 shadow-md border border-[#EADBCA] hover:bg-white hover:scale-105 transition-all"
        title="Go Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <Suspense fallback={
        <div className={`min-h-screen flex items-center justify-center ${isKandyan ? 'bg-[#FDFBF7]' : 'bg-[#F8F5EE]'}`}>
          <div className="w-8 h-8 rounded-full border-2 border-[#C59B48] animate-ping" />
        </div>
      }>
        <InvitePageContent />
      </Suspense>
    </>
  );
}

