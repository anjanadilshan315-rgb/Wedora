"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  Wand2,
  Share2,
  Users,
  HeadphonesIcon,
  Heart,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { TEMPLATE_DESIGNS } from "@/components/invitation/registry";

/* ─────────────────────────────────────────── */
/*  HERO SLIDES DATA                           */
/* ─────────────────────────────────────────── */
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

/* ─────────────────────────────────────────── */
/*  SITE ATTRIBUTES                            */
/* ─────────────────────────────────────────── */
const attributes = [
  {
    icon: <LayoutTemplate className="w-7 h-7" />,
    title: "Elegant Templates",
    desc: "Modern & traditional designs",
  },
  {
    icon: <Wand2 className="w-7 h-7" />,
    title: "Easy Customization",
    desc: "Make it uniquely yours",
  },
  {
    icon: <Share2 className="w-7 h-7" />,
    title: "Instant Sharing",
    desc: "Share with loved ones instantly",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "RSVP & Headcount",
    desc: "Track your guest list effortlessly",
  },
  {
    icon: <HeadphonesIcon className="w-7 h-7" />,
    title: "24/7 Support",
    desc: "We're always here to help",
  },
];

/* ─────────────────────────────────────────── */
/*  SLIDE TRANSITION VARIANTS                  */
/* ─────────────────────────────────────────── */
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
export default function HomePage() {
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
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      {/* Preload hero images */}
      <div className="hidden">
        {heroSlides.map((slide) => (
          <Image key={slide.image} src={slide.image} alt="" fill priority />
        ))}
      </div>

      <SiteHeader active="Home" fixed />

      {/* ══════════════════════════════════════ */}
      {/* HERO SLIDER                            */}
      {/* ══════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════ */}
      {/* SITE ATTRIBUTES STRIP                 */}
      {/* ══════════════════════════════════════ */}
      <section className="bg-white border-y border-[#EDE3D6] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-[#EDE3D6]">
            {attributes.map((attr, i) => (
              <motion.div
                key={attr.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex flex-col items-center text-center px-4 py-2"
              >
                <div className="w-12 h-12 rounded-full bg-[#FBF3E4] flex items-center justify-center text-[#B88737] mb-3 shadow-sm">
                  {attr.icon}
                </div>
                <p className="font-semibold text-sm text-[#29221D] leading-snug">{attr.title}</p>
                <p className="text-xs text-[#7D736A] mt-0.5">{attr.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* POPULAR TEMPLATES SECTION             */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-1">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#C59B48]" />
              <Heart className="w-3 h-3 fill-[#C59B48] text-[#C59B48]" />
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#C59B48]" />
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#29221D]">
              Popular Invitation Templates
            </h2>
            <p className="text-sm text-[#7D736A] mt-1">Choose from our most loved designs</p>
          </div>
          <Link href="/templates">
            <button className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] transition-colors whitespace-nowrap">
              <span>View All Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* Template cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {TEMPLATE_DESIGNS.slice(0, 4).map((tpl, i) => (
            <Link key={tpl.code} href={`/invite/${tpl.demoSlug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`relative group rounded-3xl overflow-hidden bg-gradient-to-br ${tpl.gradient} aspect-[4/3] sm:aspect-square md:aspect-[4/5] cursor-pointer border border-[#EADBCA] shadow-sm transition-all md:hover:shadow-md md:hover:-translate-y-1`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div
                    className="w-16 h-16 rounded-full border-4 flex items-center justify-center mb-4 bg-white/40 backdrop-blur-sm"
                    style={{ borderColor: tpl.accent }}
                  >
                    <Heart className="w-7 h-7" style={{ fill: tpl.accent, color: tpl.accent }} />
                  </div>
                  <p className="font-serif-luxury text-2xl font-bold" style={{ color: tpl.accent }}>
                    {tpl.name}
                  </p>
                  <p className="text-xs mt-2 font-semibold tracking-widest uppercase opacity-70" style={{ color: tpl.accent }}>
                    {tpl.style}
                  </p>

                  <div className="mt-8 px-6 py-2.5 rounded-full bg-white/80 text-sm font-semibold border border-[#C59B48]/30 shadow-sm" style={{ color: tpl.accent }}>
                    View Live Preview
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* FOOTER                                 */}
      {/* ══════════════════════════════════════ */}
      <Footer />
    </div>
  );
}

