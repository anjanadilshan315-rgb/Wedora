
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, User, Heart } from "lucide-react";

// Update this to match your actual XAMPP folder path
const API_BASE_URL = "http://localhost/wedding-invitation/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // ==============================================================
      // ⚠️ DUMMY LOGIN LOGIC (For Frontend UI Testing)
      // ==============================================================
      // Simulating a network request delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email && password) {
        // Force a successful login with any credentials
        localStorage.setItem("user", JSON.stringify({ email, role: "client" }));
        router.push("/dashboard"); // Redirect to the dashboard
      } else {
        setErrorMsg("Please enter email and password");
      }

      /* 
      // ==============================================================
      // REAL PHP BACKEND LOGIC (Uncomment when backend is ready)
      // ==============================================================
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setErrorMsg(data.message || "Invalid email or password");
      }
      */
      
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Could not connect to server. Is XAMPP running?");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#FAF7F2] flex flex-col lg:flex-row">

      {/* ============================================================== */}
      {/* LEFT SIDE — full height column with artwork + content (DESKTOP) */}
      {/* ============================================================== */}
      <div className="hidden lg:flex relative w-[44%] h-full flex-col items-center justify-center overflow-hidden">

        {/* Background artwork — object-left so the flowers (top-left + bottom of image) show */}
        <Image
          src="/assets/bg-artwork.png"
          alt="Wedding Ambient Background"
          fill
          priority
          className="object-cover object-left"
        />

        {/* Subtle right-edge fade so it blends into the curve */}
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FAF7F2] to-transparent pointer-events-none" />

        {/* Content: Logo + Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-10"
        >
          {/* Gold-rimmed circular logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative w-52 h-52 xl:w-64 xl:h-64 mb-5 rounded-full p-[3px] shadow-[0_12px_35px_rgba(180,135,65,0.35)]"
            style={{
              background:
                "linear-gradient(135deg, #ECC880 0%, #FDF4D8 30%, #C99B4B 60%, #9B6F23 100%)",
            }}
          >
            <div className="relative 
            w-full h-full rounded-full overflow-hidden bg-[#FBF8F4] border-[2px] border-[#FFF8E7]">
              <Image
                src="/assets/logo.jpg"
                alt="Wedding Invitation Website Logo"
                fill
                priority
                className="object-cover scale-105"
              />
            </div>
          </motion.div>

          <div className="space-y-1">
            <h2 className="font-serif-luxury text-[28px] xl:text-[33px] font-semibold text-[#28211B] tracking-wide">
              Your Special Moments,
            </h2>
            <p className="font-script-romantic text-[40px] xl:text-[48px] text-[#B88737] leading-none pt-1">
              Our Invitation
            </p>
          </div>

          <p className="mt-4 text-xs text-[#5D534A] leading-relaxed max-w-[300px]">
            Create beautiful wedding invitations, share with your loved ones and
            celebrate together.
          </p>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* GOLDEN CURVED DIVIDER — drawn on top of both sides (DESKTOP)   */}
      {/* ============================================================== */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="goldLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DFBB73" />
              <stop offset="20%" stopColor="#FBF0CC" />
              <stop offset="50%" stopColor="#C89A48" />
              <stop offset="75%" stopColor="#E9C985" />
              <stop offset="100%" stopColor="#966D23" />
            </linearGradient>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M 430 0 Q 490 500 425 1000"
            fill="none"
            stroke="url(#goldLine)"
            strokeWidth="3.5"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HEADER — compact artwork strip (no wasted space)         */}
      {/* ============================================================== */}
      <div className="flex lg:hidden relative w-full shrink-0 overflow-hidden" style={{ height: "38vw", maxHeight: "180px" }}>
        <Image
          src="/assets/bg-artwork.png"
          alt="Wedding Background"
          fill
          priority
          className="object-cover object-left-bottom"
        />
        {/* Fade bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FAF7F2] to-transparent" />

        {/* Compact logo centred over the strip */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-20 h-20 rounded-full p-[2px] shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #ECC880 0%, #FDF4D8 30%, #C99B4B 60%, #9B6F23 100%)",
            }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden border-[2px] border-[#FFF8E7]">
              <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover scale-105" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE BRANDING TEXT — appears just below the strip             */}
      {/* ============================================================== */}
      <div className="flex lg:hidden flex-col items-center text-center px-4 pb-2 shrink-0">
        <h2 className="font-serif-luxury text-xl font-semibold text-[#28211B]">
          Your Special Moments,
        </h2>
        <p className="font-script-romantic text-3xl text-[#B88737] leading-tight">
          Our Invitation
        </p>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE — login card + corner florals                        */}
      {/* ============================================================== */}
      <div className="relative flex-1 h-full lg:min-h-screen flex flex-col z-10 overflow-hidden">

        {/* Top-right branch */}
        <div className="absolute top-0 right-0 w-28 sm:w-40 lg:w-52 pointer-events-none z-0 select-none">
          <Image
            src="/assets/branch-corner.png"
            alt="Branch Accent"
            width={220}
            height={220}
            className="w-full h-auto object-contain translate-x-2 -translate-y-1"
          />
        </div>

        {/* Bottom-right flowers */}
        <div className="absolute bottom-0 right-0 w-36 sm:w-52 lg:w-64 pointer-events-none z-0 select-none">
          <Image
            src="/assets/flower-corner.png"
            alt="Flower Accent"
            width={280}
            height={280}
            className="w-full h-auto object-contain translate-x-2 translate-y-2"
          />
        </div>

        {/* Customer Login badge */}
        <div className="relative z-10 flex justify-end px-4 pt-3 lg:px-8 lg:pt-5 shrink-0">
          <div className="flex items-center space-x-2 text-xs font-medium text-[#8F6626]">
            <span className="w-6 h-6 rounded-full bg-[#F3E5CD] flex items-center justify-center text-[#B88737] shadow-sm">
              <User className="w-3.5 h-3.5" />
            </span>
            <span className="tracking-wide">Customer Login</span>
          </div>
        </div>

        {/* Login card — centred in remaining space */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-2 lg:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            className="w-full max-w-[440px] bg-white/95 backdrop-blur-md rounded-[26px] border border-[#EADBCA] px-7 py-6 lg:px-9 lg:py-8 shadow-[0_18px_50px_rgba(180,140,80,0.13)]"
          >
            {/* ♥ ornament */}
            <div className="flex items-center justify-center space-x-3 mb-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C59B48]" />
              <Heart className="w-3 h-3 fill-[#C59B48] text-[#C59B48]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C59B48]" />
            </div>

            {/* Title */}
            <div className="text-center space-y-1 mb-5">
              <h1 className="font-serif-luxury text-[28px] lg:text-[32px] font-semibold text-[#29221D] tracking-tight">
                Customer Login
              </h1>
              <p className="text-xs text-[#7D736A]">
                Welcome back! Please login to your account.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-center">
                <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-[#483E36] tracking-wide">
                  <Mail className="w-3.5 h-3.5 text-[#B88737]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#2C231E] placeholder:text-[#A89E94] focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50 focus:border-[#C59B48] transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-[#483E36] tracking-wide">
                  <Lock className="w-3.5 h-3.5 text-[#B88737]" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#2C231E] placeholder:text-[#A89E94] focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50 focus:border-[#C59B48] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8277] hover:text-[#564C44] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me / Forgot password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer select-none text-[#5B5047]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D6C7B5] accent-[#B88737] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#8F6626] hover:text-[#B88737] hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl font-semibold text-sm text-white shadow-[0_8px_20px_rgba(180,135,65,0.28)] flex items-center justify-center space-x-2"
                style={{
                  background:
                    "linear-gradient(90deg, #C79848 0%, #B88737 50%, #A87428 100%)",
                }}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Admin-only registration notice */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EADBCA]" />
              </div>
              <span className="relative px-3 bg-white text-[11px] text-[#827870]">
                New to Open Invitation?
              </span>
            </div>

            {/* Contact Admin via WhatsApp */}
            <a
              href="https://wa.me/94XXXXXXXXX?text=Hi!+I%27d+like+to+create+a+wedding+invitation."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                className="w-full py-2.5 rounded-2xl border border-[#C79848] text-[#9A6F24] font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all hover:bg-[#FBF3E4]"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span>Contact Us on WhatsApp</span>
              </motion.button>
            </a>

            {/* ♥ ornament */}
            <div className="flex items-center justify-center space-x-3 mt-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C59B48]" />
              <Heart className="w-3 h-3 fill-[#C59B48] text-[#C59B48]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C59B48]" />
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center py-2 shrink-0">
          <p className="text-[10px] text-[#A69B90]">
            © {new Date().getFullYear()} Wedding Invitation Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
