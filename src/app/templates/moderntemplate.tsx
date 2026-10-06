'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Calendar, MapPin, Clock, Send, 
  Camera, CheckCircle2, MessageSquareHeart 
} from 'lucide-react';

interface WeddingProps {
  receiverName?: string;
  groomName: string;
  brideName: string;
  weddingDate: string; // "YYYY-MM-DD"
  venue: string;
  mapUrl?: string;
}

export default function ModernLongTemplate({
  receiverName = "ගෞරවනීය අමුත්තා",
  groomName = "සජීව",
  brideName = "ආදිශා",
  weddingDate = "2027-05-28",
  venue = "Grand Monarch, Colombo",
  mapUrl = "https://maps.google.com"
}: WeddingProps) {

  // 1. Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(weddingDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  // 2. Wishes State
  const [wishes, setWishes] = useState<string[]>([
    "සුබ මංගලම් දෙපළටම! ආදරයෙන් පිරි යුග දිවියකට ආසිරි!",
  ]);
  const [newWish, setNewWish] = useState("");

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWish.trim()) {
      setWishes([newWish, ...wishes]);
      setNewWish("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-amber-100 pb-16">
      
      {/* 1. HERO SECTION (Receiver Name & Couple Name) */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative bg-gradient-to-b from-[#0F2F24] to-[#1E4D3E] text-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-lg"
        >
          {/* Receiver Tag */}
          <div className="inline-block px-4 py-1.5 rounded-full border border-amber-300/40 bg-white/10 backdrop-blur-md text-amber-200 text-sm mb-6">
            ආරාධනාවයි: <span className="font-semibold text-white">{receiverName}</span> වෙත
          </div>

          <p className="tracking-widest uppercase text-xs text-amber-300/90 mb-2">Save The Date</p>
          <h1 className="text-4xl md:text-6xl font-serif font-normal text-amber-100 tracking-wide">
            {groomName} <span className="text-amber-400 font-sans text-3xl">&</span> {brideName}
          </h1>
          <p className="mt-4 text-stone-200 text-sm md:text-base">අපගේ ප්‍රේමයේ නව ඇරඹුම සැමරීමට ඔබ සැමට ගෞරවයෙන් ඇරයුම් කරමු.</p>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-amber-300/80">
            <Heart className="w-5 h-5 fill-amber-300/20" />
            <span className="text-sm tracking-wider">{weddingDate}</span>
          </div>
        </motion.div>
      </section>

      {/* 2. COUNTDOWN TIMER */}
      <section className="py-12 px-4 max-w-md mx-auto -mt-10 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-stone-100 grid grid-cols-4 gap-2 text-center"
        >
          {Object.entries(timeLeft).map(([key, val]) => (
            <div key={key} className="bg-stone-50 rounded-xl p-3 border border-stone-100">
              <span className="text-2xl font-bold text-[#1E4D3E] block">{val}</span>
              <span className="text-[11px] text-stone-500 uppercase tracking-wider">{key}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 3. DATE & VENUE SECTION */}
      <section className="py-12 px-6 max-w-md mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-serif text-[#1E4D3E]">දිනය සහ ස්ථානය</h2>
          <div className="flex items-center justify-center gap-2 text-stone-600">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span>{weddingDate} | පෙරවරු 9.00 සිට</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-stone-600">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>{venue}</span>
          </div>
          <a 
            href={mapUrl} 
            target="_blank" 
            rel="noreferrer"
            className="inline-block mt-3 px-5 py-2.5 rounded-full bg-[#1E4D3E] text-white text-sm font-medium shadow-sm hover:bg-[#163a2f] transition"
          >
            Google Map හරහා බලන්න
          </a>
        </motion.div>
      </section>

      {/* 4. EVENT SCHEDULE (TIMELINE) */}
      <section className="py-12 px-6 max-w-md mx-auto">
        <h2 className="text-2xl font-serif text-[#1E4D3E] text-center mb-8">දවසේ කාලසටහන</h2>
        <div className="relative border-l-2 border-amber-300 ml-4 space-y-8">
          {[
            { time: "09:30 AM", title: "පෝරුවේ චාරිත්‍ර", desc: "සාම්ප්‍රදායික චාරිත්‍ර ආරම්භය" },
            { time: "11:30 AM", title: "ඡායාරූප සැසිය", desc: "නෑදෑ හිතවතුන් සමඟ සුහද කතාබහ" },
            { time: "01:00 PM", title: "මංගල භෝජන සංග්‍රහය", desc: "දිවා ආහාරය සහ සංගීතය" },
            { time: "03:30 PM", title: "සමුගැනීම", desc: "අභිනව යුවළ පිටත්වීම" },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-6"
            >
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white" />
              <div className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {item.time}
              </div>
              <h3 className="font-semibold text-stone-800 mt-0.5">{item.title}</h3>
              <p className="text-sm text-stone-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. PHOTO GALLERY */}
      <section className="py-12 px-6 max-w-md mx-auto">
        <h2 className="text-2xl font-serif text-[#1E4D3E] text-center mb-6 flex items-center justify-center gap-2">
          <Camera className="w-5 h-5 text-amber-600" /> අපේ මතකයන්
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-xl overflow-hidden aspect-[4/5] bg-stone-200 border border-stone-200">
              <img 
                src={`https://picsum.photos/400/500?random=${n}`} 
                alt="Couple moment" 
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 6. RSVP FORM SECTION */}
      <section className="py-12 px-6 max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-md border border-stone-100 p-6"
        >
          <div className="text-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#1E4D3E] mx-auto mb-1" />
            <h2 className="text-2xl font-serif text-[#1E4D3E]">RSVP Confirmation</h2>
            <p className="text-xs text-stone-500">කරුණාකර ඔබ පැමිණෙන්නේදැයි තහවුරු කරන්න</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("RSVP එක සාර්ථකව ලැබුණා!"); }} className="space-y-4">
            <input 
              type="text" 
              defaultValue={receiverName} 
              placeholder="ඔබගේ නම" 
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1E4D3E]"
            />
            <select className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1E4D3E]">
              <option value="yes">පැමිණෙනවා (Will Attend)</option>
              <option value="no">පැමිණීමට නොහැක (Regretfully Decline)</option>
            </select>
            <input 
              type="number" 
              min="1" 
              defaultValue="1" 
              placeholder="පැමිණෙන සංඛ්‍යාව" 
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1E4D3E]"
            />
            <button 
              type="submit" 
              className="w-full py-3 bg-[#1E4D3E] text-white font-medium rounded-xl text-sm shadow hover:bg-[#163a2f] transition"
            >
              තහවුරු කරන්න (Confirm RSVP)
            </button>
          </form>
        </motion.div>
      </section>

      {/* 7. WISHES / GUESTBOOK SECTION */}
      <section className="py-12 px-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <MessageSquareHeart className="w-8 h-8 text-amber-600 mx-auto mb-1" />
          <h2 className="text-2xl font-serif text-[#1E4D3E]">සුබපැතුම් එක් කරන්න</h2>
          <p className="text-xs text-stone-500">අලුත් යුවළට ආශිර්වාද එක් කරන්න</p>
        </div>

        <form onSubmit={handleWishSubmit} className="flex gap-2 mb-6">
          <input 
            type="text"
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            placeholder="ඔබේ සුබපැතුම ලියන්න..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1E4D3E]"
          />
          <button type="submit" className="px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm hover:bg-amber-700">
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-3">
          {wishes.map((w, idx) => (
            <div key={idx} className="p-3 bg-white rounded-xl border border-stone-100 shadow-sm text-sm text-stone-600">
              “{w}”
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
