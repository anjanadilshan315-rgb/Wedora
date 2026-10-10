"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Sparkles, Gem, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      <SiteHeader active="About" />

      {/* ══════════════════════════════════════ */}
      {/* PAGE HEADER                            */}
      {/* ══════════════════════════════════════ */}
      <section className="py-16 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C59B48]" />
            <Heart className="w-4 h-4 fill-[#C59B48] text-[#C59B48]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C59B48]" />
          </div>
          <h2 className="font-script-romantic text-3xl sm:text-4xl text-[#C59B48] mb-2">Our Story</h2>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#29221D] mb-4">
            About Wedora
          </h1>
          <p className="text-sm sm:text-base text-[#7D736A] max-w-xl mx-auto leading-relaxed">
            We believe that your special day deserves an introduction that is just as memorable. 
            Wedora is dedicated to providing couples with stunning, personalised digital invitations.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* CONTENT                                */}
      {/* ══════════════════════════════════════ */}
      <section className="flex-1 max-w-5xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        
        {/* Mission Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-[#F0E8DC] p-8 sm:p-12 mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 opacity-5 pointer-events-none">
            <Image src="/assets/branch-corner.png" alt="" width={256} height={256} className="w-full h-auto object-cover" />
          </div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#29221D] mb-4">Crafting Beautiful Digital Experiences</h3>
              <p className="text-sm text-[#7D736A] leading-relaxed mb-4">
                Founded by ApexRow Solutions, Wedora was born from a desire to modernize how we share our most precious life events. Traditional paper invitations are beautiful, but they often lack the convenience, speed, and interactivity that today&apos;s couples need.
              </p>
              <p className="text-sm text-[#7D736A] leading-relaxed">
                We combine luxurious designs with cutting-edge web technology to give you a personalized website link for every guest, complete with automated RSVP tracking, location mapping, and easy WhatsApp integration.
              </p>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-[#FBF3E4]">
              <Image src="/assets/hero-1.jpg" alt="Wedding Couple" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <h3 className="font-serif-luxury text-center text-3xl font-bold text-[#29221D] mb-8">Why Choose Us?</h3>
        
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-[#FBF8F4] rounded-2xl p-6 text-center border border-[#F0E8DC] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center mb-4 text-[#C59B48] shadow-sm">
              <Gem className="w-6 h-6" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#29221D] mb-2">Premium Designs</h4>
            <p className="text-xs text-[#7D736A] leading-relaxed">
              Curated by professional designers, our templates radiate elegance and luxury, ensuring a perfect match for your wedding theme.
            </p>
          </div>

          <div className="bg-[#FBF8F4] rounded-2xl p-6 text-center border border-[#F0E8DC] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center mb-4 text-[#C59B48] shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#29221D] mb-2">Fully Personalized</h4>
            <p className="text-xs text-[#7D736A] leading-relaxed">
              Every guest gets a unique invitation link with their own name, providing that special personal touch of a physical card.
            </p>
          </div>

          <div className="bg-[#FBF8F4] rounded-2xl p-6 text-center border border-[#F0E8DC] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center mb-4 text-[#C59B48] shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#29221D] mb-2">Stress-Free RSVP</h4>
            <p className="text-xs text-[#7D736A] leading-relaxed">
              Track who&apos;s coming and total headcounts instantly from your own dashboard. Let us handle the complicated logistics.
            </p>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════ */}
      {/* FOOTER                                 */}
      {/* ══════════════════════════════════════ */}
      <Footer />
    </div>
  );
}

