"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutTemplate } from "lucide-react";

const heroSlides = [
  {
    image: "/assets/hero-1.jpg",
    tag: "CREATE YOUR PERFECT DAY",
    heading1: "Beautiful Wedding Invitations",
    heading2: "for Your Special Moments",
    desc: "Design, customize and share your wedding invitations with ease. Make your big day even more special with our elegant templates.",
  },
  {
    image: "/assets/hero-2.jpg",
    tag: "SHARE THE LOVE",
    heading1: "Design, Customize & Share",
    heading2: "with the Ones You Love",
    desc: "Choose from dozens of premium invitation templates. Add your personal touch and send instantly to all your loved ones.",
  },
  {
    image: "/assets/hero-3.jpg",
    tag: "CELEBRATE TOGETHER",
    heading1: "Your Perfect Day Deserves",
    heading2: "a Perfect Invitation",
    desc: "Track RSVPs, count your guests, and manage everything in one place. Let us take care of the details so you can focus on love.",
  },
];


const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 1.04 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ═══════════════════════════════════════════ */
/*  HOMEPAGE                                   */
/* ═══════════════════════════════════════════ */
export default function HomeBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  /* Auto-play */
  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % heroSlides.length);
  }, []);

  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + heroSlides.length) % heroSlides.length);
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  useEffect(() => {
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden mt-16 lg:mt-[70px]">

        {/* Slide images */}
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={`img-${current}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.heading1}
              fill
              priority
              className="object-cover object-center"
            />
            {/* Dark + warm gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide text content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                className="max-w-xl"
              >
                {/* Tag line */}
                <motion.div variants={textItemVariants} className="flex items-center space-x-3 mb-3">
                  <span className="h-px w-8 bg-[#C59B48]" />
                  <span className="text-[#E8C97A] text-xs tracking-[0.2em] font-semibold uppercase">
                    {slide.tag}
                  </span>
                  <span className="h-px w-8 bg-[#C59B48]" />
                </motion.div>

                {/* Heading */}
                <motion.h1
                  variants={textItemVariants}
                  className="font-serif-luxury text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-tight"
                >
                  {slide.heading1}
                </motion.h1>
                <motion.p
                  variants={textItemVariants}
                  className="font-script-romantic text-3xl sm:text-4xl lg:text-[44px] text-[#E8C97A] leading-none mt-1"
                >
                  {slide.heading2}
                </motion.p>

                {/* Description */}
                <motion.p
                  variants={textItemVariants}
                  className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-md"
                >
                  {slide.desc}
                </motion.p>

                {/* CTA Button */}
                <motion.div variants={textItemVariants} className="mt-7">
                  <Link href="/templates">
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(197,155,72,0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center space-x-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm shadow-[0_6px_22px_rgba(197,155,72,0.4)] transition-all"
                      style={{ background: "linear-gradient(90deg,#C79848,#B88737,#A87428)" }}
                    >
                      <LayoutTemplate className="w-4 h-4" />
                      <span>Browse Templates</span>
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => { setDirection(1); next(); }}
          aria-label="Next slide"
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-6 h-2.5 bg-[#C59B48]" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>
  );
}
