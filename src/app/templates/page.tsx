"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Heart, Loader2, MessageCircle, Search, Wand2 } from "lucide-react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { TEMPLATE_DESIGNS } from "@/components/invitation/registry";
import { api, ApiError, errorMessage, getSession } from "@/lib/api";
import { createInvitationDraft } from "@/lib/invitations";
import type { Template } from "@/lib/types";

/* Update this to your real WhatsApp number */
const ADMIN_WHATSAPP = "94757115645";

function buildWhatsAppLink(templateName: string) {
  const msg = encodeURIComponent(
    `Hi! I visited Wedora and I'm interested in the "${templateName}" template. Could you please provide more details?`,
  );
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`;
}

interface TemplateCard {
  code: string;
  name: string;
  style: string;
  description: string | null;
  price: number | null;
  gradient: string;
  accent: string;
  previewUrl: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [apiTemplates, setApiTemplates] = useState<Template[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [startingCode, setStartingCode] = useState<string | null>(null);
  const [startError, setStartError] = useState("");

  useEffect(() => {
    api<Template[]>("/public/templates", { auth: false })
      .then(({ data }) => setApiTemplates(data))
      .catch((error) => setLoadError(errorMessage(error, "Could not load templates.")));
  }, []);

  /** Active templates from the API, styled with the local design registry. */
  const templates: TemplateCard[] = useMemo(() => {
    const source = apiTemplates
      ? apiTemplates.filter((t) => TEMPLATE_DESIGNS.some((d) => d.code === t.code))
      : TEMPLATE_DESIGNS.map((d) => ({ code: d.code, name: d.name, description: null, price: null, demoSlug: d.demoSlug }));
    return source.map((t) => {
      const design = TEMPLATE_DESIGNS.find((d) => d.code === t.code)!;
      return {
        code: t.code,
        name: t.name,
        style: design.style,
        description: t.description,
        price: t.price,
        gradient: design.gradient,
        accent: design.accent,
        previewUrl: `/invite/${t.demoSlug ?? design.demoSlug}`,
      };
    });
  }, [apiTemplates]);

  const filtered = templates.filter((t) =>
    [t.name, t.style, t.description ?? ""].some((v) => v.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const startWithTemplate = async (code: string) => {
    setStartError("");
    if (!getSession()) {
      router.push(`/register?template=${encodeURIComponent(code)}`);
      return;
    }
    setStartingCode(code);
    try {
      const id = await createInvitationDraft(code);
      router.push(`/dashboard/invitations/${id}/edit`);
    } catch (error) {
      setStartError(error instanceof ApiError ? errorMessage(error) : (error as Error).message);
      setStartingCode(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      <SiteHeader active="Templates" />

      {/* PAGE HEADER */}
      <section className="py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col items-center justify-center mb-6">
            <Link href="/" className="inline-flex items-center gap-1 text-[#A69B90] hover:text-[#C59B48] text-xs font-semibold uppercase tracking-wider transition-colors">
              <Heart className="w-3.5 h-3.5 opacity-50" /> Back to Home
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-3 mb-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C59B48]" />
            <Heart className="w-3.5 h-3.5 fill-[#C59B48] text-[#C59B48]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C59B48]" />
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#29221D] mb-3">Invitation Templates</h1>
          <p className="text-sm text-[#7D736A] max-w-md mx-auto">
            Explore the live previews, pick your favourite and fill in your wedding details — we&apos;ll take it from there.
          </p>
        </motion.div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-16 lg:top-[70px] z-40 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#EDE3D6] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-3">
          <div className="relative w-full sm:w-56 ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A69B90]" />
            <input
              type="text"
              placeholder="Search templates…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-full border border-[#E0D8CC] bg-white text-xs text-[#29221D] placeholder:text-[#A69B90] focus:outline-none focus:ring-2 focus:ring-[#C59B48]/40 focus:border-[#C59B48]"
            />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#7D736A]">
            Showing <span className="font-semibold text-[#29221D]">{filtered.length}</span> template{filtered.length !== 1 ? "s" : ""}
          </p>
          <a
            href={buildWhatsAppLink("a template")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#B88737] hover:text-[#9A6F24] transition-colors hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Chat with us
          </a>
        </div>

        {(loadError || startError) && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {startError || `${loadError} You can still browse the previews.`}
          </div>
        )}

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filtered.map((tpl, i) => (
                <motion.div
                  key={tpl.code}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="group relative rounded-3xl overflow-hidden bg-white shadow-sm border border-[#EADBCA] transition-all flex flex-col hover:shadow-md"
                >
                  <div className={`relative aspect-[4/3] sm:aspect-square md:aspect-[4/5] bg-gradient-to-br ${tpl.gradient} flex-shrink-0 border-b border-[#F0E8DC]`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-14 h-14 rounded-full border-[3px] flex items-center justify-center mb-3 bg-white/40 backdrop-blur-sm" style={{ borderColor: tpl.accent }}>
                        <Heart className="w-6 h-6" style={{ fill: tpl.accent, color: tpl.accent }} />
                      </div>
                      <p className="text-xl font-serif-luxury font-bold" style={{ color: tpl.accent }}>{tpl.name}</p>
                      <p className="text-xs mt-1 font-semibold opacity-70 tracking-widest uppercase" style={{ color: tpl.accent }}>{tpl.style}</p>
                      {tpl.description && <p className="text-[11px] mt-3 text-[#5D534A] line-clamp-3">{tpl.description}</p>}
                      {tpl.price !== null && (
                        <p className="mt-3 text-sm font-bold" style={{ color: tpl.accent }}>
                          LKR {tpl.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 bg-white">
                    <Link
                      href={tpl.previewUrl}
                      target="_blank"
                      className="flex items-center justify-center w-full py-3 rounded-xl border border-[#C59B48] text-[#9A6F24] text-sm font-semibold hover:bg-[#FBF3E4] active:bg-[#F0E8DC] transition-colors"
                    >
                      View Live Preview
                    </Link>
                    <button
                      onClick={() => startWithTemplate(tpl.code)}
                      disabled={startingCode !== null || (!apiTemplates && !loadError)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold shadow-sm md:hover:shadow-md transition-all active:scale-[0.98] md:hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                      style={{ background: "linear-gradient(90deg,#C79848,#9A6F24)" }}
                    >
                      {startingCode === tpl.code ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                      Use This Template
                    </button>
                    <a
                      href={buildWhatsAppLink(tpl.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#9A6F24] hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Ask on WhatsApp
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <Heart className="w-10 h-10 mx-auto mb-4 text-[#E0D8CC]" />
              <p className="text-[#9E9E9E] font-medium">No templates found</p>
              <p className="text-xs text-[#C0B8B0] mt-1">Try a different search term</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
}
