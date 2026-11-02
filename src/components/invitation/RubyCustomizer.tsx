"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, X } from "lucide-react";
import RubyEditor from "./RubyEditor";
import { rubyStyle, type RubySettings } from "./ruby";
import styles from "./templates/ruby.module.css";

/** Allow visitors browsing the sample invitation to try its design directly. */
export default function RubyCustomizer({ settings, onChange }: {
  settings: RubySettings;
  onChange: (settings: RubySettings) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" aria-expanded={open}
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-semibold shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ ...rubyStyle(settings), background: settings.accent, color: "var(--ruby-button-text)" }}
        onClick={() => { dialog.current?.showModal(); setOpen(true); }}>
        <Palette className="h-5 w-5" /> Colours &amp; Fonts
      </button>
      <dialog ref={dialog} aria-labelledby="ruby-customizer-title" className={styles.customizer}
        onClose={() => { setOpen(false); trigger.current?.focus(); }}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#EADBCA] bg-[#FFFBF5] px-5 py-4">
          <h2 id="ruby-customizer-title" className="text-base font-semibold text-[#4E2731]">Colours &amp; Fonts</h2>
          <button type="button" autoFocus aria-label="Close colour options" className="rounded-full p-2 text-[#4E2731] hover:bg-[#F5EBDD]" onClick={() => dialog.current?.close()}><X className="h-5 w-5" /></button>
        </div>
        <RubyEditor settings={settings} onChange={onChange} disabled={false} previewOnly />
        <div className="p-4 pt-0">
          <button type="button" className="w-full rounded-xl bg-[#4E2731] px-5 py-3 text-sm font-semibold text-white" onClick={() => dialog.current?.close()}>View invitation</button>
        </div>
      </dialog>
    </>
  );
}
