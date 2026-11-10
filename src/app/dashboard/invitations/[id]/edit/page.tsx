"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  MapPin,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  FieldError,
  Notice,
  Spinner,
  StatusBadge,
  inputClass,
  labelClass,
  primaryButton,
  secondaryButton,
} from "@/components/dashboard/ui";
import { formatDateLong, formatTime } from "@/components/invitation/format";
import { TEMPLATE_DESIGNS, designFor } from "@/components/invitation/registry";
import { api, ApiError, errorMessage } from "@/lib/api";
import type { Invitation, PhotoCategory, Photos, Template } from "@/lib/types";

const STEPS = [
  { title: "Template", icon: LayoutTemplate },
  { title: "The Couple", icon: Heart },
  { title: "Event & Venue", icon: MapPin },
  { title: "Message & Schedule", icon: Clock },
  { title: "Photos", icon: Camera },
  { title: "Review & Submit", icon: Send },
];

const MAX_PHOTO_MB = 5;
const MAX_GALLERY = 20;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface EventRow {
  key: number;
  name: string;
  time: string;
  venue: string;
}

interface FormState {
  templateId: number;
  groomName: string;
  brideName: string;
  groomPhone: string;
  bridePhone: string;
  groomParents: string;
  brideParents: string;
  weddingDate: string;
  weddingTime: string;
  rsvpDeadline: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  greetingMessage: string;
  events: EventRow[];
}

let rowKey = 0;

function toForm(inv: Invitation): FormState {
  return {
    templateId: inv.template.id,
    groomName: inv.groomName ?? "",
    brideName: inv.brideName ?? "",
    groomPhone: inv.groomPhone ?? "",
    bridePhone: inv.bridePhone ?? "",
    groomParents: inv.groomParents ?? "",
    brideParents: inv.brideParents ?? "",
    weddingDate: inv.weddingDate ?? "",
    weddingTime: inv.weddingTime ?? "",
    rsvpDeadline: inv.rsvpDeadline ?? "",
    venueName: inv.venueName ?? "",
    venueAddress: inv.venueAddress ?? "",
    mapUrl: inv.mapUrl ?? "",
    greetingMessage: inv.greetingMessage ?? "",
    events: inv.eventsSchedule.map((e) => ({ key: ++rowKey, name: e.name, time: e.time, venue: e.venue ?? "" })),
  };
}

const orNull = (value: string) => (value.trim() === "" ? null : value.trim());

/** Fields saved by each step. */
function payloadFor(step: number, form: FormState): Record<string, unknown> {
  switch (step) {
    case 1:
      return { templateId: form.templateId };
    case 2:
      return {
        groomName: form.groomName,
        brideName: form.brideName,
        groomPhone: form.groomPhone.trim(),
        bridePhone: form.bridePhone.trim(),
        groomParents: form.groomParents,
        brideParents: form.brideParents,
      };
    case 3:
      return {
        weddingDate: orNull(form.weddingDate),
        weddingTime: orNull(form.weddingTime),
        rsvpDeadline: orNull(form.rsvpDeadline),
        venueName: form.venueName,
        venueAddress: form.venueAddress,
        mapUrl: form.mapUrl.trim(),
      };
    case 4:
      return {
        greetingMessage: form.greetingMessage,
        eventsSchedule: form.events
          .filter((e) => e.name.trim() || e.time.trim())
          .map((e) => ({ name: e.name.trim(), time: e.time.trim(), ...(e.venue.trim() ? { venue: e.venue.trim() } : {}) })),
      };
    default:
      return {};
  }
}

/** Client-side checks before saving a step. */
function validateStep(step: number, form: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 2) {
    if (!form.groomName.trim()) errors.groomName = "Groom's name is required";
    if (!form.brideName.trim()) errors.brideName = "Bride's name is required";
  }
  if (step === 3) {
    if (!form.weddingDate) errors.weddingDate = "Wedding date is required";
    if (!form.venueName.trim()) errors.venueName = "Venue name is required";
    if (form.rsvpDeadline && form.weddingDate && form.rsvpDeadline > form.weddingDate) {
      errors.rsvpDeadline = "RSVP deadline should be before the wedding date";
    }
    if (form.mapUrl.trim() && !/^https?:\/\//i.test(form.mapUrl.trim())) errors.mapUrl = "Paste a full link starting with https://";
  }
  if (step === 4) {
    form.events.forEach((e, i) => {
      if ((e.time.trim() || e.venue.trim()) && !e.name.trim()) errors[`eventsSchedule.${i}.name`] = "Event name is required";
    });
  }
  return errors;
}

/* ───────────────────────────── Photo widgets ───────────────────────────── */

function checkFiles(files: File[]): string | null {
  for (const f of files) {
    if (!IMAGE_TYPES.includes(f.type)) return `"${f.name}" is not a JPEG, PNG or WebP image.`;
    if (f.size > MAX_PHOTO_MB * 1024 * 1024) return `"${f.name}" is larger than ${MAX_PHOTO_MB} MB.`;
  }
  return null;
}

function SinglePhoto({
  label,
  hint,
  photo,
  busy,
  disabled,
  onUpload,
  onDelete,
}: {
  label: string;
  hint: string;
  photo: Photos["cover"];
  busy: boolean;
  disabled: boolean;
  onUpload: (files: File[]) => void;
  onDelete: (id: number) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <p className={labelClass}>{label}</p>
      <div className="relative aspect-[4/5] bg-[#FCFAF7] border-2 border-dashed border-[#DFD3C3] rounded-2xl overflow-hidden flex items-center justify-center">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.url} alt={label} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <button type="button" disabled={disabled || busy} onClick={() => input.current?.click()} className="flex flex-col items-center gap-2 text-[#A69B90] hover:text-[#9A6F24] p-4">
            <ImagePlus className="w-7 h-7" />
            <span className="text-[11px] font-semibold">Upload photo</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#C59B48]" />
          </div>
        )}
      </div>
      <p className="text-[10px] text-[#A69B90]">{hint}</p>
      {photo && !disabled && (
        <div className="flex gap-2">
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="flex-1 text-xs font-semibold text-[#9A6F24] border border-[#EADBCA] rounded-lg py-1.5 hover:bg-[#FBF3E4]">
            Replace
          </button>
          <button type="button" disabled={busy} onClick={() => onDelete(photo.id)} className="px-3 text-red-500 border border-red-100 rounded-lg hover:bg-red-50" aria-label={`Remove ${label}`}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onUpload(files);
        }}
      />
    </div>
  );
}

/* ───────────────────────────── Page ───────────────────────────── */

export default function EditInvitationPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState<FormState | null>(null);
  const [step, setStep] = useState(1);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedNotice, setSavedNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<PhotoCategory | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const galleryInput = useRef<HTMLInputElement>(null);

  const validId = Number.isInteger(id) && id > 0;

  useEffect(() => {
    if (!validId) return;
    let active = true;
    Promise.all([api<Invitation>(`/customer/invitations/${id}`), api<Template[]>("/public/templates", { auth: false })])
      .then(([inv, tpl]) => {
        if (!active) return;
        setInvitation(inv.data);
        setTemplates(tpl.data);
        setForm(toForm(inv.data));
        setStep(Math.min(Math.max(inv.data.currentStep, 1), STEPS.length));
      })
      .catch((e) => {
        if (active) setLoadError(e instanceof ApiError && e.status === 404 ? "This invitation was not found." : errorMessage(e));
      });
    return () => {
      active = false;
    };
  }, [id, validId]);

  const editable = invitation?.status === "draft" || invitation?.status === "pending";

  const missing = useMemo(() => {
    if (!form) return [];
    const list: { label: string; step: number }[] = [];
    if (!form.groomName.trim()) list.push({ label: "Groom's name", step: 2 });
    if (!form.brideName.trim()) list.push({ label: "Bride's name", step: 2 });
    if (!form.weddingDate) list.push({ label: "Wedding date", step: 3 });
    if (!form.venueName.trim()) list.push({ label: "Venue name", step: 3 });
    return list;
  }, [form]);

  if (loadError || !validId) {
    return (
      <div className="max-w-xl mx-auto">
        <Notice tone="error">{loadError || "This invitation was not found."}</Notice>
        <Link href="/dashboard" className={`${secondaryButton} mt-4`}>
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
      </div>
    );
  }
  if (!invitation || !form) return <Spinner label="Loading your invitation…" />;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm({ ...form, [key]: value });
    setFieldErrors((f) => ({ ...f, [key]: "" }));
  };
  const bind = (key: keyof FormState) => ({
    value: form[key] as string,
    disabled: !editable,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(key, e.target.value as never),
  });

  /** Saves the current step. Returns false when validation fails. */
  const saveStep = async (nextStep: number): Promise<boolean> => {
    if (!editable) {
      setStep(nextStep);
      return true;
    }
    const errors = validateStep(step, form);
    if (Object.keys(errors).length && nextStep > step) {
      setFieldErrors(errors);
      return false;
    }
    setSaving(true);
    setError("");
    setSavedNotice("");
    try {
      const payload = { ...payloadFor(step, form), currentStep: Math.max(nextStep, invitation.currentStep) };
      const { data } = await api<Invitation>(`/customer/invitations/${id}`, { method: "PATCH", body: payload });
      setInvitation({ ...data, guestStats: invitation.guestStats });
      setFieldErrors({});
      return true;
    } catch (e) {
      if (e instanceof ApiError && e.code === "VALIDATION_ERROR") setFieldErrors(e.fieldErrors());
      setError(errorMessage(e));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goTo = async (target: number) => {
    if (target === step) return;
    if (await saveStep(target)) {
      setStep(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const saveOnly = async () => {
    if (await saveStep(step)) setSavedNotice("Your changes have been saved.");
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      await api<Invitation>(`/customer/invitations/${id}/submit`, { method: "POST" });
      setSubmitted(true);
    } catch (e) {
      if (e instanceof ApiError && e.code === "VALIDATION_ERROR") setFieldErrors(e.fieldErrors());
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  // ---- photos
  const upload = async (category: PhotoCategory, files: File[]) => {
    setPhotoError("");
    const problem = checkFiles(files);
    if (problem) return setPhotoError(problem);
    if (category === "gallery" && invitation.photos.gallery.length + files.length > MAX_GALLERY) {
      return setPhotoError(`The gallery can hold up to ${MAX_GALLERY} photos.`);
    }
    setUploading(category);
    try {
      // The API accepts up to 10 files per request.
      let photos = invitation.photos;
      for (let i = 0; i < files.length; i += 10) {
        const body = new FormData();
        body.append("category", category);
        files.slice(i, i + 10).forEach((f) => body.append("photos", f));
        photos = (await api<Photos>(`/customer/invitations/${id}/photos`, { method: "POST", form: body })).data;
      }
      setInvitation({ ...invitation, photos });
    } catch (e) {
      setPhotoError(
        e instanceof ApiError && e.code === "UPLOADS_DISABLED"
          ? "Photo uploads are temporarily unavailable. You can continue and add photos later."
          : errorMessage(e),
      );
    } finally {
      setUploading(null);
    }
  };

  const removePhoto = async (photoId: number, category: PhotoCategory) => {
    setPhotoError("");
    setUploading(category);
    try {
      const { data } = await api<Photos>(`/customer/invitations/${id}/photos/${photoId}`, { method: "DELETE" });
      setInvitation({ ...invitation, photos: data });
    } catch (e) {
      setPhotoError(errorMessage(e));
    } finally {
      setUploading(null);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-xl mx-auto p-10 text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto text-green-500 mb-4" />
        <h1 className="font-serif-luxury text-3xl font-bold text-[#29221D]">Submitted!</h1>
        <p className="text-sm text-[#7D736A] mt-2">
          Thank you. Our team will review your invitation and contact you to complete the payment. Once it is confirmed you can add your guests and send the
          invitation by email.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button onClick={() => router.push("/dashboard")} className={primaryButton}>
            Go to dashboard
          </button>
          <Link href={`/dashboard/invitations/${id}/preview`} target="_blank" className={secondaryButton}>
            <Eye className="w-4 h-4" /> Preview
          </Link>
        </div>
      </Card>
    );
  }

  const design = designFor(templates.find((t) => t.id === form.templateId)?.code ?? invitation.template.code);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#A69B90] hover:text-[#C59B48] text-xs font-semibold uppercase tracking-wider mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif-luxury text-3xl font-bold text-[#29221D]">Wedding Details</h1>
            <StatusBadge status={invitation.status} />
          </div>
          <p className="text-sm text-[#7D736A] mt-1">Fill in each step — everything is saved as you go.</p>
        </div>
        <Link href={`/dashboard/invitations/${id}/preview`} target="_blank" className={secondaryButton}>
          <Eye className="w-4 h-4" /> Preview
        </Link>
      </div>

      {!editable && (
        <div className="mb-6">
          <Notice tone="info">
            This invitation is {invitation.status} and can no longer be edited here. Please <Link href="/contact" className="underline">contact us</Link> for
            changes.
          </Notice>
        </div>
      )}
      {invitation.status === "pending" && (
        <div className="mb-6">
          <Notice tone="warning">Already submitted — changes you save here are visible to our team right away.</Notice>
        </div>
      )}

      {/* Stepper */}
      <ol className="grid grid-cols-6 gap-1 sm:gap-2 mb-8">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => goTo(n)}
                disabled={saving}
                className="w-full flex flex-col items-center gap-1.5 group"
                aria-current={current ? "step" : undefined}
              >
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                    current ? "bg-[#C59B48] border-[#C59B48] text-white" : done ? "bg-[#FBF3E4] border-[#C59B48] text-[#9A6F24]" : "bg-white border-[#EADBCA] text-[#A69B90]"
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </span>
                <span className={`hidden sm:block text-[10px] font-semibold uppercase tracking-wide text-center ${current ? "text-[#9A6F24]" : "text-[#A69B90]"}`}>
                  {s.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {error && (
        <div className="mb-4">
          <Notice tone="error" onClose={() => setError("")}>
            {error}
          </Notice>
        </div>
      )}
      {savedNotice && (
        <div className="mb-4">
          <Notice tone="success" onClose={() => setSavedNotice("")}>
            {savedNotice}
          </Notice>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          <Card>
            <CardHeader icon={React.createElement(STEPS[step - 1].icon, { className: "w-5 h-5 text-[#C59B48]" })} title={`${step}. ${STEPS[step - 1].title}`} />
            <div className="p-6 sm:p-8">
              {/* STEP 1 — TEMPLATE */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates
                    .filter((t) => TEMPLATE_DESIGNS.some((d) => d.code === t.code))
                    .map((t) => {
                      const d = designFor(t.code);
                      const selected = form.templateId === t.id;
                      return (
                        <div
                          key={t.id}
                          className={`rounded-2xl border-2 overflow-hidden transition-all ${selected ? "border-[#C59B48] shadow-md" : "border-[#F0E8DC]"}`}
                        >
                          <button type="button" disabled={!editable} onClick={() => update("templateId", t.id)} className={`w-full aspect-[4/3] bg-gradient-to-br ${d.gradient} flex flex-col items-center justify-center p-4 text-center`}>
                            <Heart className="w-7 h-7 mb-2" style={{ fill: d.accent, color: d.accent }} />
                            <p className="font-serif-luxury text-lg font-bold" style={{ color: d.accent }}>{t.name}</p>
                            <p className="text-[10px] uppercase tracking-widest opacity-70" style={{ color: d.accent }}>{d.style}</p>
                          </button>
                          <div className="flex items-center justify-between px-3 py-2 bg-white">
                            <span className={`text-xs font-semibold ${selected ? "text-[#9A6F24]" : "text-[#A69B90]"}`}>{selected ? "✓ Selected" : "Select"}</span>
                            <Link href={`/invite/${d.demoSlug}`} target="_blank" className="text-xs text-[#9A6F24] hover:underline">
                              Live preview
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* STEP 2 — COUPLE */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(["groom", "bride"] as const).map((who) => (
                    <div key={who} className="space-y-4">
                      <p className="font-serif-luxury text-lg font-bold text-[#29221D] capitalize">{who}</p>
                      <div className="space-y-1.5">
                        <label className={labelClass}>{who === "groom" ? "Groom's" : "Bride's"} name *</label>
                        <input {...bind(`${who}Name`)} maxLength={150} className={inputClass} placeholder={who === "groom" ? "e.g. Kaveen Perera" : "e.g. Ishara Silva"} />
                        <FieldError message={fieldErrors[`${who}Name`]} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Phone</label>
                        <input {...bind(`${who}Phone`)} type="tel" className={inputClass} placeholder="+94 77 123 4567" />
                        <FieldError message={fieldErrors[`${who}Phone`]} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Parents (optional)</label>
                        <input {...bind(`${who}Parents`)} maxLength={255} className={inputClass} placeholder="e.g. Mr. & Mrs. Perera" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3 — EVENT */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Wedding date *</label>
                      <input {...bind("weddingDate")} type="date" className={inputClass} />
                      <FieldError message={fieldErrors.weddingDate} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Start time</label>
                      <input {...bind("weddingTime")} type="time" className={inputClass} />
                      <FieldError message={fieldErrors.weddingTime} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>RSVP deadline</label>
                      <input {...bind("rsvpDeadline")} type="date" max={form.weddingDate || undefined} className={inputClass} />
                      <FieldError message={fieldErrors.rsvpDeadline} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Venue name *</label>
                      <input {...bind("venueName")} maxLength={255} className={inputClass} placeholder="e.g. Shangri-La Hotel" />
                      <FieldError message={fieldErrors.venueName} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Venue address</label>
                      <input {...bind("venueAddress")} maxLength={500} className={inputClass} placeholder="e.g. 1 Galle Face, Colombo" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Google Maps link</label>
                    <input {...bind("mapUrl")} type="url" maxLength={1000} className={inputClass} placeholder="https://maps.app.goo.gl/…" />
                    <p className="text-[11px] text-[#A69B90]">Optional. Leave empty and we will link the venue name and address.</p>
                    <FieldError message={fieldErrors.mapUrl} />
                  </div>
                </div>
              )}

              {/* STEP 4 — MESSAGE & SCHEDULE */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Invitation message</label>
                    <textarea {...bind("greetingMessage")} rows={3} maxLength={2000} className={`${inputClass} resize-none`} placeholder="Together with our families, we joyfully invite you to celebrate our wedding." />
                    <FieldError message={fieldErrors.greetingMessage} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className={labelClass}>Events schedule</p>
                      {editable && (
                        <button
                          type="button"
                          onClick={() => update("events", [...form.events, { key: ++rowKey, name: "", time: "", venue: "" }])}
                          disabled={form.events.length >= 20}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#C59B48] hover:text-[#9A6F24] bg-[#FBF3E4] px-3 py-1.5 rounded-lg"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Event
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {form.events.map((ev, index) => (
                        <div key={ev.key} className="grid grid-cols-1 sm:grid-cols-[1fr_8rem_1fr_auto] gap-3 items-start bg-[#FCFAF7] border border-[#F0E8DC] p-3 rounded-xl">
                          <div>
                            <input
                              value={ev.name}
                              disabled={!editable}
                              maxLength={100}
                              onChange={(e) => update("events", form.events.map((x) => (x.key === ev.key ? { ...x, name: e.target.value } : x)))}
                              placeholder="e.g. Poruwa Ceremony"
                              className={inputClass}
                            />
                            <FieldError message={fieldErrors[`eventsSchedule.${index}.name`]} />
                          </div>
                          <input
                            type="time"
                            value={ev.time}
                            disabled={!editable}
                            onChange={(e) => update("events", form.events.map((x) => (x.key === ev.key ? { ...x, time: e.target.value } : x)))}
                            className={inputClass}
                          />
                          <input
                            value={ev.venue}
                            disabled={!editable}
                            maxLength={255}
                            onChange={(e) => update("events", form.events.map((x) => (x.key === ev.key ? { ...x, venue: e.target.value } : x)))}
                            placeholder="Place (optional)"
                            className={inputClass}
                          />
                          {editable && (
                            <button
                              type="button"
                              onClick={() => update("events", form.events.filter((x) => x.key !== ev.key))}
                              className="p-2.5 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg justify-self-end"
                              aria-label="Remove event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {form.events.length === 0 && <p className="text-sm text-center text-[#A69B90] py-4">No events added yet. Add your ceremony, reception, etc.</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5 — PHOTOS */}
              {step === 5 && (
                <div className="space-y-8">
                  {photoError && (
                    <Notice tone="error" onClose={() => setPhotoError("")}>
                      {photoError}
                    </Notice>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <SinglePhoto label="Cover photo" hint="Main photo at the top of the invitation." photo={invitation.photos.cover} busy={uploading === "cover"} disabled={!editable} onUpload={(f) => upload("cover", f)} onDelete={(pid) => removePhoto(pid, "cover")} />
                    <SinglePhoto label="Groom" hint="Optional portrait." photo={invitation.photos.groom} busy={uploading === "groom"} disabled={!editable} onUpload={(f) => upload("groom", f)} onDelete={(pid) => removePhoto(pid, "groom")} />
                    <SinglePhoto label="Bride" hint="Optional portrait." photo={invitation.photos.bride} busy={uploading === "bride"} disabled={!editable} onUpload={(f) => upload("bride", f)} onDelete={(pid) => removePhoto(pid, "bride")} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className={labelClass}>
                        Gallery ({invitation.photos.gallery.length}/{MAX_GALLERY})
                      </p>
                      {editable && (
                        <button
                          type="button"
                          disabled={uploading !== null || invitation.photos.gallery.length >= MAX_GALLERY}
                          onClick={() => galleryInput.current?.click()}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#C59B48] hover:text-[#9A6F24] bg-[#FBF3E4] px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          {uploading === "gallery" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Add photos
                        </button>
                      )}
                      <input
                        ref={galleryInput}
                        type="file"
                        multiple
                        accept={IMAGE_TYPES.join(",")}
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          e.target.value = "";
                          if (files.length) upload("gallery", files);
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {invitation.photos.gallery.map((p) => (
                        <div key={p.id} className="relative aspect-square rounded-2xl overflow-hidden border border-[#EADBCA] group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.url} alt="Gallery" className="w-full h-full object-cover" />
                          {editable && (
                            <button
                              type="button"
                              onClick={() => removePhoto(p.id, "gallery")}
                              disabled={uploading !== null}
                              className="absolute top-1.5 right-1.5 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm"
                              aria-label="Remove photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      {invitation.photos.gallery.length === 0 && (
                        <p className="col-span-full text-sm text-[#A69B90] py-6 text-center border-2 border-dashed border-[#EADBCA] rounded-2xl">
                          Add photos of the two of you for the gallery section.
                        </p>
                      )}
                    </div>
                    <p className="text-[11px] text-[#A69B90] mt-2">JPEG, PNG or WebP, up to {MAX_PHOTO_MB} MB each. Photos are saved immediately.</p>
                  </div>
                </div>
              )}

              {/* STEP 6 — REVIEW */}
              {step === 6 && (
                <div className="space-y-6">
                  {missing.length > 0 ? (
                    <Notice tone="warning">
                      Please complete:{" "}
                      {missing.map((m, i) => (
                        <React.Fragment key={m.label}>
                          {i > 0 && ", "}
                          <button type="button" className="underline font-semibold" onClick={() => goTo(m.step)}>
                            {m.label}
                          </button>
                        </React.Fragment>
                      ))}
                    </Notice>
                  ) : (
                    invitation.status === "draft" && <Notice tone="success">Everything looks good. Submit when you are ready!</Notice>
                  )}

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {[
                      ["Template", design.name, 1],
                      ["Couple", `${form.groomName || "—"} & ${form.brideName || "—"}`, 2],
                      ["Parents", [form.groomParents, form.brideParents].filter(Boolean).join(" · ") || "—", 2],
                      ["Phones", [form.groomPhone, form.bridePhone].filter(Boolean).join(" · ") || "—", 2],
                      ["Date & time", `${formatDateLong(form.weddingDate || null)}${form.weddingTime ? ` · ${formatTime(form.weddingTime)}` : ""}`, 3],
                      ["RSVP by", form.rsvpDeadline ? formatDateLong(form.rsvpDeadline) : "—", 3],
                      ["Venue", [form.venueName, form.venueAddress].filter(Boolean).join(", ") || "—", 3],
                      ["Message", form.greetingMessage || "—", 4],
                      ["Schedule", form.events.length ? form.events.map((e) => `${formatTime(e.time)} ${e.name}`.trim()).join(" · ") : "—", 4],
                      [
                        "Photos",
                        `${invitation.photos.cover ? "Cover ✓" : "No cover"} · ${invitation.photos.gallery.length} gallery photo${invitation.photos.gallery.length === 1 ? "" : "s"}`,
                        5,
                      ],
                    ].map(([label, value, s]) => (
                      <div key={label as string} className="border-b border-[#F0E8DC] pb-3">
                        <dt className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#A69B90]">
                          {label}
                          <button type="button" onClick={() => goTo(s as number)} className="text-[#9A6F24] normal-case tracking-normal font-semibold hover:underline">
                            Edit
                          </button>
                        </dt>
                        <dd className="mt-1 text-[#29221D] break-words">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F0E8DC] px-6 py-4 bg-[#FCFAF7] rounded-b-3xl">
              <button type="button" onClick={() => goTo(step - 1)} disabled={step === 1 || saving} className={`${secondaryButton} ${step === 1 ? "invisible" : ""}`}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex flex-col sm:flex-row gap-2">
                {editable && step < 6 && step !== 5 && (
                  <button type="button" onClick={saveOnly} disabled={saving} className={secondaryButton}>
                    <Save className="w-4 h-4" /> Save
                  </button>
                )}
                {step < 6 ? (
                  <button type="button" onClick={() => goTo(step + 1)} disabled={saving || uploading !== null} className={primaryButton}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : invitation.status === "draft" ? (
                  <button type="button" onClick={submit} disabled={saving || missing.length > 0} className={primaryButton}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit Invitation
                  </button>
                ) : (
                  <Link href="/dashboard" className={primaryButton}>
                    <Calendar className="w-4 h-4" /> Done
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
