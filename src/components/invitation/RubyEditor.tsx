"use client";

import { inputClass, labelClass, secondaryButton } from "@/components/dashboard/ui";
import { DEFAULT_RUBY, RUBY_COLOURS, RUBY_FONTS, RUBY_PALETTES, rubyStyle, type RubySettings } from "./ruby";

export default function RubyEditor({ settings, onChange, disabled, previewOnly = false }: {
  settings: RubySettings;
  onChange: (settings: RubySettings) => void;
  disabled: boolean;
  previewOnly?: boolean;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-[#EADBCA] bg-[#FFFBF5] p-5">
      <div>
        <h3 className="font-serif-luxury text-2xl">Ruby Heart Romance design</h3>
        <p className="mt-1 text-xs text-[#7D736A]">{previewOnly ? "Try colours and fonts here to see the invitation change instantly. These changes are for this demo; save your final design in your invitation editor." : "Choose a palette or your own colours, then pick a font style. Save this step to apply your design to the invitation."}</p>
      </div>
      <fieldset disabled={disabled}>
        <legend className={labelClass}>Colour palettes</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {RUBY_PALETTES.map((palette) => (
            <button key={palette.id} type="button" className={secondaryButton}
              aria-pressed={RUBY_COLOURS.every(([key]) => settings[key].toLowerCase() === palette[key].toLowerCase())}
              onClick={() => onChange({ ...settings, ...Object.fromEntries(RUBY_COLOURS.map(([key]) => [key, palette[key]])) })}>
              {[palette.deep, palette.accent, palette.gold].map((colour, i) => <span key={i} aria-hidden="true" className="h-4 w-4 rounded-full border border-black/10" style={{ background: colour }} />)}
              {palette.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {RUBY_COLOURS.map(([key, label]) => <div key={key}>
          <label htmlFor={`ruby-${key}`} className={labelClass}>{label}</label>
          <input id={`ruby-${key}`} type="color" className="mt-1 h-10 w-full cursor-pointer disabled:cursor-default" disabled={disabled} value={settings[key]} onChange={(event) => onChange({ ...settings, [key]: event.target.value })} />
          <p className="mt-1 text-[11px] uppercase text-[#7D736A]">{settings[key]}</p>
        </div>)}
      </div>
      <div>
        <label htmlFor="ruby-font" className={labelClass}>Font style</label>
        <select id="ruby-font" className={inputClass} disabled={disabled} value={settings.font} onChange={(event) => onChange({ ...settings, font: event.target.value as RubySettings["font"] })}>
          {RUBY_FONTS.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
        </select>
      </div>
      <div aria-label="Design preview" style={rubyStyle(settings)} className="overflow-hidden rounded-2xl border border-[var(--ruby-border)] bg-[var(--ruby-background)] text-center text-[var(--ruby-text)]">
        <div className="bg-[var(--ruby-deep)] px-4 py-6 text-[var(--ruby-cover-text)]">
          <p className="text-[10px] uppercase tracking-[.25em]">The wedding of</p>
          <p className="mt-3 break-words text-4xl" style={{ fontFamily: "var(--ruby-names-font)" }}>Bride &amp; Groom</p>
          <span aria-hidden="true" className="mt-2 block text-2xl text-[var(--ruby-gold)]">♡</span>
        </div>
        <div className="p-5"><p className="text-3xl text-[var(--ruby-accent)]" style={{ fontFamily: "var(--ruby-heading-font)" }}>Our celebration</p><p className="mt-2 rounded-xl bg-[var(--ruby-surface)] p-3 text-xs">Together with our families, we invite you to celebrate with us.</p></div>
      </div>
      <button type="button" className={secondaryButton} disabled={disabled} onClick={() => onChange({ ...DEFAULT_RUBY })}>Reset to Ruby &amp; Blush</button>
    </div>
  );
}
