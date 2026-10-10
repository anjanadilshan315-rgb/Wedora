"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import AuthShell, { authInputClass, authLabelClass } from "@/components/AuthShell";
import { designFor } from "@/components/invitation/registry";
import { ApiError, errorMessage, getSession, register } from "@/lib/api";
import { continueAfterAuth, safeNext } from "@/lib/auth-redirect";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <RegisterContent />
    </Suspense>
  );
}

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "8+ characters" },
  { test: (p: string) => /[a-z]/.test(p), label: "lowercase" },
  { test: (p: string) => /[A-Z]/.test(p), label: "uppercase" },
  { test: (p: string) => /[0-9]/.test(p), label: "number" },
];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const template = searchParams.get("template");

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (getSession() && !template) router.replace(safeNext(next));
  }, [router, next, template]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});
    if (!PASSWORD_RULES.every((r) => r.test(form.password))) {
      setFieldErrors({ password: "Use at least 8 characters with upper case, lower case and a number." });
      return;
    }
    if (form.password !== form.confirm) {
      setFieldErrors({ confirm: "Passwords do not match." });
      return;
    }
    setIsLoading(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      await continueAfterAuth(router, template, next);
    } catch (error) {
      if (error instanceof ApiError && error.code === "VALIDATION_ERROR") setFieldErrors(error.fieldErrors());
      setErrorMsg(errorMessage(error));
      setIsLoading(false);
    }
  };

  const fieldError = (key: string) => fieldErrors[key] && <p className="text-[11px] text-red-600 mt-1">{fieldErrors[key]}</p>;
  const loginQuery = template ? `?template=${encodeURIComponent(template)}` : next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <AuthShell badge="Create Account">
      <div className="text-center space-y-1 mb-5">
        <h1 className="font-serif-luxury text-[28px] lg:text-[32px] font-semibold text-[#29221D] tracking-tight">Create Your Account</h1>
        <p className="text-xs text-[#7D736A]">
          {template ? (
            <>
              You selected <span className="font-semibold text-[#9A6F24]">{designFor(template).name}</span>. Create an account to add your wedding details.
            </>
          ) : (
            "Register to create and manage your wedding invitation."
          )}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-center" role="alert">
          <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3" noValidate={false}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className={authLabelClass}>
              <User className="w-3.5 h-3.5 text-[#B88737]" />
              <span>First Name</span>
            </label>
            <input id="firstName" required maxLength={100} autoComplete="given-name" value={form.firstName} onChange={set("firstName")} className={authInputClass} placeholder="Kaveen" />
            {fieldError("firstName")}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="lastName" className={authLabelClass}>
              <span>Last Name</span>
            </label>
            <input id="lastName" required maxLength={100} autoComplete="family-name" value={form.lastName} onChange={set("lastName")} className={authInputClass} placeholder="Perera" />
            {fieldError("lastName")}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className={authLabelClass}>
            <Mail className="w-3.5 h-3.5 text-[#B88737]" />
            <span>Email Address</span>
          </label>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={authInputClass} placeholder="you@example.com" />
          {fieldError("email")}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className={authLabelClass}>
            <Phone className="w-3.5 h-3.5 text-[#B88737]" />
            <span>Phone Number</span>
          </label>
          <input id="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={set("phone")} className={authInputClass} placeholder="+94 77 123 4567" />
          {fieldError("phone")}
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
              autoComplete="new-password"
              value={form.password}
              onChange={set("password")}
              className={`${authInputClass} pr-11`}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8277] hover:text-[#564C44]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {PASSWORD_RULES.map((rule) => (
              <span
                key={rule.label}
                className={`text-[10px] px-2 py-0.5 rounded-full border ${rule.test(form.password) ? "bg-green-50 border-green-200 text-green-700" : "bg-[#FCFAF7] border-[#EADBCA] text-[#A69B90]"}`}
              >
                {rule.label}
              </span>
            ))}
          </div>
          {fieldError("password")}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm" className={authLabelClass}>
            <Lock className="w-3.5 h-3.5 text-[#B88737]" />
            <span>Confirm Password</span>
          </label>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={set("confirm")}
            className={authInputClass}
            placeholder="Repeat your password"
          />
          {fieldError("confirm")}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-1 rounded-2xl font-semibold text-sm text-white shadow-[0_8px_20px_rgba(180,135,65,0.28)] flex items-center justify-center space-x-2 disabled:opacity-80"
          style={{ background: "linear-gradient(90deg, #C79848 0%, #B88737 50%, #A87428 100%)" }}
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </motion.button>
      </form>

      <p className="text-center text-xs text-[#7D736A] mt-4">
        Already have an account?{" "}
        <Link href={`/login${loginQuery}`} className="font-semibold text-[#9A6F24] hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
