"use client";

import {
  ENVELOPE_PALETTES,
  envelopeColours,
  type EnvelopeSettings,
} from "./envelope";
import { inputClass, labelClass } from "@/components/dashboard/ui";

interface Props {
  settings: EnvelopeSettings;
  onChange: (settings: EnvelopeSettings) => void;
  disabled: boolean;
  musicError?: string;
}

/** A separate editor for Floral Envelope. Existing Heritage Door controls stay intact. */
export default function EnvelopeEditor({
  settings,
  onChange,
  disabled,
  musicError,
}: Props) {
  const colours = envelopeColours(settings);
  const update = (key: keyof EnvelopeSettings, value: string) =>
    onChange({ ...settings, [key]: value });
  return (
    <fieldset
      disabled={disabled}
      className="space-y-5 rounded-2xl border border-[#dfc5bb] bg-[#fff8f5] p-5"
    >
      <legend className="px-2 font-serif-luxury text-2xl text-[#7a1414]">
        Floral Envelope · The Grand Heirloom
      </legend>
      <p className="text-sm leading-6 text-[#78615a]">
        Personalise the floral wax-seal invitation. Cover and gallery photos are
        uploaded in the next step. Empty photo slots use the original
        illustrated couple artwork.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="envelope-language" className={labelClass}>
          Opening language
          <select
            id="envelope-language"
            className={`${inputClass} mt-2`}
            value={settings.language}
            onChange={(event) => update("language", event.target.value)}
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
          </select>
        </label>
        <label htmlFor="envelope-font" className={labelClass}>
          Font style
          <select
            id="envelope-font"
            className={`${inputClass} mt-2`}
            value={settings.font}
            onChange={(event) => update("font", event.target.value)}
          >
            <option value="classic">Classic</option>
            <option value="romantic">Romantic</option>
            <option value="modern">Modern</option>
          </select>
        </label>
      </div>
      <label htmlFor="envelope-palette" className={`${labelClass} block`}>
        Colour theme
        <select
          id="envelope-palette"
          className={`${inputClass} mt-2`}
          value={settings.palette}
          onChange={(event) =>
            onChange({
              ...settings,
              palette: event.target.value,
              main: "",
              accent: "",
              background: "",
              envelope: "",
            })
          }
        >
          {ENVELOPE_PALETTES.map((palette) => (
            <option key={palette.id} value={palette.id}>
              {palette.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            ["main", "Main colour"],
            ["accent", "Gold / accent"],
            ["background", "Background"],
            ["envelope", "Envelope"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} htmlFor={`envelope-${key}`} className={labelClass}>
            {label}
            <input
              id={`envelope-${key}`}
              type="color"
              className="mt-2 h-11 w-full rounded-lg border border-[#dfc5bb] bg-white p-1"
              value={colours[key]}
              onChange={(event) => update(key, event.target.value)}
            />
            <span className="mt-1 block text-[10px] uppercase text-[#78615a]">
              {colours[key]}
            </span>
          </label>
        ))}
      </div>
      <button
        type="button"
        className="text-xs font-semibold text-[#7a1414] underline"
        onClick={() =>
          onChange({
            ...settings,
            main: "",
            accent: "",
            background: "",
            envelope: "",
          })
        }
      >
        Use theme colours
      </button>
      {(
        [
          ["messageSi", "Sinhala invitation message"],
          ["storyEn", "Love story — English (optional)"],
          ["storySi", "ආදර කතාව — සිංහල (optional)"],
          ["dressEn", "Dress note — English (optional)"],
          ["dressSi", "ඇඳුම් පැළඳුම් — සිංහල (optional)"],
        ] as const
      ).map(([key, label]) => (
        <label
          key={key}
          htmlFor={`envelope-${key}`}
          className={`${labelClass} block`}
        >
          {label}
          <textarea
            id={`envelope-${key}`}
            className={`${inputClass} mt-2 resize-y`}
            rows={3}
            maxLength={key.startsWith("story") ? 4000 : 2000}
            value={settings[key]}
            onChange={(event) => update(key, event.target.value)}
          />
        </label>
      ))}
      <div className="space-y-3">
        <p className={labelClass}>Love story timeline</p>
        {settings.timeline.map((moment, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-[#dfc5bb] bg-white/70 p-4"
          >
            {(
              [
                ["year", "Year / date"],
                ["titleEn", "Title — English"],
                ["titleSi", "Title — Sinhala"],
                ["descriptionEn", "Description — English"],
                ["descriptionSi", "Description — Sinhala"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className={`${labelClass} block`}>
                {label}
                <input
                  className={`${inputClass} mt-1`}
                  maxLength={
                    key === "year" ? 30 : key.startsWith("title") ? 100 : 1000
                  }
                  value={moment[key]}
                  onChange={(event) =>
                    onChange({
                      ...settings,
                      timeline: settings.timeline.map((row, rowIndex) =>
                        rowIndex === index
                          ? { ...row, [key]: event.target.value }
                          : row,
                      ),
                    })
                  }
                />
              </label>
            ))}
            <button
              type="button"
              className="text-xs text-red-700 underline"
              onClick={() =>
                onChange({
                  ...settings,
                  timeline: settings.timeline.filter(
                    (_, rowIndex) => rowIndex !== index,
                  ),
                })
              }
            >
              Remove moment
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-xs font-semibold text-[#7a1414] underline"
          disabled={disabled || settings.timeline.length >= 10}
          onClick={() =>
            onChange({
              ...settings,
              timeline: [
                ...settings.timeline,
                {
                  year: "",
                  titleEn: "",
                  titleSi: "",
                  descriptionEn: "",
                  descriptionSi: "",
                },
              ],
            })
          }
        >
          Add a story moment
        </button>
      </div>
      <label htmlFor="envelope-music" className={`${labelClass} block`}>
        Background music URL (optional)
        <input
          id="envelope-music"
          className={`${inputClass} mt-2`}
          maxLength={1000}
          value={settings.musicUrl}
          onChange={(event) => update("musicUrl", event.target.value)}
          placeholder="https://example.com/wedding.mp3"
          aria-invalid={Boolean(musicError)}
        />
        <span className="mt-2 block text-xs font-normal leading-5 text-[#78615a]">
          Leave empty for the built-in melody. Wax-crack, paper-rustle and chime
          effects start when a guest opens the envelope. Use HTTPS audio or a
          local path such as /audio/wedding.mp3 for your own song.
        </span>
        {musicError && (
          <span className="mt-1 block text-xs text-red-600" role="alert">
            {musicError}
          </span>
        )}
      </label>
      <p className="text-xs leading-5 text-[#78615a]">
        Use the normal invitation message below for English. Enter events and
        venue names in your preferred language or in both languages. Empty story
        and timeline fields hide the story section.
      </p>
    </fieldset>
  );
}
