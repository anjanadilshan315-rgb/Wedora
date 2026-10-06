"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Menu, X, Heart, Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

const navLinks = ["Home", "Templates", "About", "Contact"];

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dummy form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Real implementation would send to a PHP endpoint
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      {/* ══════════════════════════════════════ */}
      {/* NAVBAR                                 */}
      {/* ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(180,140,80,0.10)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            <Link href="/" className="flex items-center space-x-2.5 shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C59B48]/40">
                <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover" />
              </div>
              <div className="leading-none">
                <p className="font-serif-luxury text-[17px] font-bold text-[#28211B] tracking-tight">Open Invitation</p>
                <p className="text-[9px] text-[#B88737] tracking-[0.15em] uppercase font-medium">by ApexRow Solutions</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link}
                  href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    link === "Contact"
                      ? "text-[#B88737] bg-[#FBF3E4]"
                      : "text-[#4A3F37] hover:text-[#B88737] hover:bg-[#FBF3E4]"
                  }`}
                >
                  {link}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center">
              <Link href="/login">
                <button className="flex items-center space-x-1.5 px-5 py-2 rounded-full border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] transition-colors">
                  <User className="w-3.5 h-3.5" /><span>Login</span>
                </button>
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#4A3F37]">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white border-t border-[#F0E8DC] px-4 pb-4"
            >
              <nav className="flex flex-col space-y-1 pt-3">
                {navLinks.map((link, i) => (
                  <Link
                    key={link}
                    href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                      link === "Contact" ? "text-[#B88737] bg-[#FBF3E4]" : "text-[#4A3F37] hover:bg-[#FBF3E4]"
                    }`}
                  >
                    {link}
                  </Link>
                ))}
                <div className="pt-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold">
                      Login
                    </button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

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
          <h2 className="font-script-romantic text-3xl sm:text-4xl text-[#C59B48] mb-2">Get in Touch</h2>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#29221D] mb-4">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-[#7D736A] max-w-xl mx-auto leading-relaxed">
            Have questions about our digital wedding invitations? Our team at ApexRow Solutions is here to help make your special day perfect.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* CONTENT                                */}
      {/* ══════════════════════════════════════ */}
      <section className="flex-1 max-w-5xl mx-auto px-4 pb-20 sm:px-6 lg:px-8 w-full">
        
        <div className="grid md:grid-cols-5 gap-8 lg:gap-12 items-start">
          
          {/* Contact Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#F0E8DC] p-8">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#29221D] mb-6">Contact Info</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#FBF8F4] border border-[#F0E8DC] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#C59B48]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#A69B90] font-semibold mb-1">WhatsApp / Call</p>
                    <p className="text-sm font-semibold text-[#29221D]">+94 77 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#FBF8F4] border border-[#F0E8DC] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#C59B48]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#A69B90] font-semibold mb-1">Email</p>
                    <p className="text-sm font-semibold text-[#29221D]">hello@openinvitation.lk</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#FBF8F4] border border-[#F0E8DC] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#C59B48]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#A69B90] font-semibold mb-1">Office Location</p>
                    <p className="text-sm font-semibold text-[#29221D]">ApexRow Solutions</p>
                    <p className="text-xs text-[#7D736A] mt-1">123 Business Road, Colombo 03, Sri Lanka</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="mt-8 pt-6 border-t border-[#F0E8DC]">
                <p className="text-xs text-[#7D736A] mb-3">Prefer an instant reply?</p>
                <a
                  href="https://wa.me/94XXXXXXXXX?text=Hi!+I+have+a+question+about+Open+Invitation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(90deg,#C79848,#9A6F24)" }}
                >
                  <MessageCircle className="w-4 h-4" /> Message on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#F0E8DC] p-8">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#29221D] mb-2">Send us a Message</h3>
              <p className="text-sm text-[#7D736A] mb-8">Fill out the form below and we will get back to you shortly.</p>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-green-500 ml-1" />
                  </div>
                  <h4 className="font-serif-luxury text-2xl font-bold text-[#29221D] mb-2">Message Sent!</h4>
                  <p className="text-sm text-[#7D736A]">Thank you for reaching out. We will contact you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#483E36] tracking-wide">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Kamal Perera"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50 focus:border-[#C59B48] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#483E36] tracking-wide">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50 focus:border-[#C59B48] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#483E36] tracking-wide">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you today?"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50 focus:border-[#C59B48] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(90deg,#C79848,#9A6F24)" }}
                  >
                    Send Message <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* FOOTER                                 */}
      {/* ══════════════════════════════════════ */}
      <footer className="bg-white border-t border-[#EDE3D6] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A69B90]">
          <p>© {new Date().getFullYear()} Open Invitation. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Designed with</span>
            <Heart className="w-3 h-3 text-[#C59B48] fill-[#C59B48]" />
            <span>by</span>
            <a href="#" className="font-semibold text-[#8F6626] hover:underline">ApexRow Solutions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
