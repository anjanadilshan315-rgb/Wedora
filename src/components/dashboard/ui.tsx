"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/invitations";
import type { InvitationStatus } from "@/lib/types";

export const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm text-[#29221D] placeholder:text-[#A89E94] focus:ring-2 focus:ring-[#C59B48]/50 focus:border-[#C59B48] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

export const labelClass = "text-xs font-semibold text-[#7D736A] uppercase tracking-wide";

export const primaryButton =
  "inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C79848] to-[#9A6F24] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed";

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

export const ghostButton =
  "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EADBCA] text-xs font-semibold text-[#7D736A] hover:bg-[#F8F5F0] transition-colors disabled:opacity-50";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-3xl border border-[#EADBCA] shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ icon, title, action }: { icon?: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#F0E8DC] px-6 py-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-serif-luxury text-xl font-bold text-[#29221D]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: InvitationStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function Notice({ tone = "info", children, onClose }: { tone?: "info" | "success" | "error" | "warning"; children: React.ReactNode; onClose?: () => void }) {
  const styles = {
    info: "bg-[#FBF3E4] border-[#EADBCA] text-[#7A5A1E]",
    success: "bg-green-50 border-green-100 text-green-700",
    error: "bg-red-50 border-red-100 text-red-600",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? Info : AlertCircle;
  return (
    <div className={`flex items-start gap-2 p-3 rounded-xl border text-sm ${styles}`} role={tone === "error" ? "alert" : "status"}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100" aria-label="Dismiss">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[#A69B90] gap-3">
      <Loader2 className="w-7 h-7 animate-spin text-[#C59B48]" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#29221D]/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] flex flex-col`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E8DC]">
          <h3 className="font-serif-luxury text-xl font-bold text-[#29221D]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#A69B90] hover:bg-[#F8F5F0]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-[11px] text-red-600 mt-1">{message}</p> : null;
}
