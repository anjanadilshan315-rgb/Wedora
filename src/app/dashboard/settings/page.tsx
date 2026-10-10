"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Lock, Save, User } from "lucide-react";
import { Card, CardHeader, FieldError, Notice, inputClass, labelClass, primaryButton } from "@/components/dashboard/ui";
import { api, ApiError, errorMessage, getSession, setSession, updateSessionUser, type Customer, type Tokens } from "@/lib/api";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileNotice, setProfileNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordNotice, setPasswordNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    api<Customer>("/customer/me")
      .then(({ data }) => setProfile({ firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone }))
      .catch((e) => setProfileNotice({ tone: "error", text: errorMessage(e) }));
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileErrors({});
    setProfileNotice(null);
    try {
      const { data } = await api<Customer>("/customer/me", {
        method: "PATCH",
        body: {
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
        },
      });
      updateSessionUser(data);
      setProfileNotice({ tone: "success", text: "Your profile has been updated." });
    } catch (err) {
      if (err instanceof ApiError && err.code === "VALIDATION_ERROR") setProfileErrors(err.fieldErrors());
      else if (err instanceof ApiError && err.code === "EMAIL_TAKEN") setProfileErrors({ email: err.message });
      else setProfileNotice({ tone: "error", text: errorMessage(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordNotice(null);
    if (passwords.next !== passwords.confirm) {
      setPasswordErrors({ confirm: "New passwords do not match." });
      return;
    }
    setSavingPassword(true);
    try {
      const { data } = await api<{ tokens: Tokens }>("/customer/me/password", {
        method: "PATCH",
        body: { currentPassword: passwords.current, newPassword: passwords.next },
      });
      const session = getSession();
      if (session) setSession({ ...session, tokens: data.tokens });
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordNotice({ tone: "success", text: "Password changed. You have been signed out of your other devices." });
    } catch (err) {
      if (err instanceof ApiError && err.code === "VALIDATION_ERROR") {
        const f = err.fieldErrors();
        setPasswordErrors({ current: f.currentPassword, next: f.newPassword });
      } else if (err instanceof ApiError && err.code === "INVALID_CURRENT_PASSWORD") {
        setPasswordErrors({ current: err.message });
      } else {
        setPasswordNotice({ tone: "error", text: errorMessage(err) });
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const field = (key: keyof typeof profile, label: string, type = "text") => (
    <div className="space-y-1.5">
      <label className={labelClass} htmlFor={key}>
        {label}
      </label>
      <input id={key} type={type} required value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} className={inputClass} />
      <FieldError message={profileErrors[key]} />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#A69B90] hover:text-[#C59B48] text-xs font-semibold uppercase tracking-wider mb-2">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
        <div>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#29221D]">Account Settings</h1>
          <p className="text-sm text-[#7D736A] mt-1">
            Manage your profile and password. Wedding details are edited from each invitation on your <Link href="/dashboard" className="underline">dashboard</Link>.
          </p>
        </div>

        <Card>
          <CardHeader icon={<User className="w-5 h-5 text-[#C59B48]" />} title="Profile" />
          <form onSubmit={saveProfile} className="p-6 sm:p-8 space-y-5">
            {profileNotice && (
              <Notice tone={profileNotice.tone} onClose={() => setProfileNotice(null)}>
                {profileNotice.text}
              </Notice>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field("firstName", "First name")}
              {field("lastName", "Last name")}
              {field("email", "Email", "email")}
              {field("phone", "Phone", "tel")}
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={savingProfile} className={primaryButton}>
                {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
              </button>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader icon={<Lock className="w-5 h-5 text-[#C59B48]" />} title="Security & Password" />
          <form onSubmit={changePassword} className="p-6 sm:p-8 space-y-5">
            {passwordNotice && (
              <Notice tone={passwordNotice.tone} onClose={() => setPasswordNotice(null)}>
                {passwordNotice.text}
              </Notice>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className={labelClass}>Current password</label>
                <input type="password" required autoComplete="current-password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className={inputClass} />
                <FieldError message={passwordErrors.current} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>New password</label>
                <input type="password" required minLength={8} autoComplete="new-password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} className={inputClass} />
                <FieldError message={passwordErrors.next} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Confirm new password</label>
                <input type="password" required minLength={8} autoComplete="new-password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className={inputClass} />
                <FieldError message={passwordErrors.confirm} />
              </div>
            </div>
            <p className="text-[11px] text-[#A69B90]">At least 8 characters with upper case, lower case and a number.</p>
            <div className="flex justify-end">
              <button type="submit" disabled={savingPassword} className="px-5 py-2.5 bg-[#29221D] text-white rounded-xl text-sm font-semibold hover:bg-[#4A3F37] transition-colors disabled:opacity-60 flex items-center gap-2">
                {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
