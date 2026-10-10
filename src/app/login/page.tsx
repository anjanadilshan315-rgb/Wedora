"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, LogIn, Mail, UserPlus } from "lucide-react";
import AuthShell, { authInputClass, authLabelClass } from "@/components/AuthShell";
import { errorMessage, getSession, login } from "@/lib/api";
import { continueAfterAuth, safeNext } from "@/lib/auth-redirect";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const template = searchParams.get("template");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (getSession() && !template) router.replace(safeNext(next));
  }, [router, next, template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      await login(email.trim(), password);
      await continueAfterAuth(router, template, next);
    } catch (error) {
      setErrorMsg(errorMessage(error, "Invalid email or password"));
      setIsLoading(false);
    }
  };

  const registerQuery = template ? `?template=${encodeURIComponent(template)}` : next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <AuthShell badge="Customer Login">
      <div className="text-center space-y-1 mb-5">
        <h1 className="font-serif-luxury text-[28px] lg:text-[32px] font-semibold text-[#29221D] tracking-tight">Customer Login</h1>
        <p className="text-xs text-[#7D736A]">
          {template ? "Log in to start your invitation with the selected template." : "Welcome back! Please login to your account."}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-center" role="alert">
          <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <label htmlFor="email" className={authLabelClass}>
            <Mail className="w-3.5 h-3.5 text-[#B88737]" />
            <span>Email Address</span>
          </label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={authInputClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className={authLabelClass}>
            <Lock className="w-3.5 h-3.5 text-[#B88737]" />
            <span>Password</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`${authInputClass} pr-11`}
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

        <div className="flex items-center justify-end text-xs">
          <Link href="/contact" className="font-medium text-[#8F6626] hover:text-[#B88737] hover:underline transition-colors">
            Forgot password? Contact us
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-2xl font-semibold text-sm text-white shadow-[0_8px_20px_rgba(180,135,65,0.28)] flex items-center justify-center space-x-2 disabled:opacity-80"
          style={{ background: "linear-gradient(90deg, #C79848 0%, #B88737 50%, #A87428 100%)" }}
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

      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#EADBCA]" />
        </div>
        <span className="relative px-3 bg-white text-[11px] text-[#827870]">New to Wedora?</span>
      </div>

      <Link
        href={`/register${registerQuery}`}
        className="w-full py-2.5 rounded-2xl border border-[#C79848] text-[#9A6F24] font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all hover:bg-[#FBF3E4]"
      >
        <UserPlus className="w-4 h-4" />
        <span>Create an account</span>
      </Link>
    </AuthShell>
  );
}
