"use client";

import {
  HEIRLOOM_PALETTES,
  HEIRLOOM_SCENES,
  heirloomColours,
  type HeirloomSettings,
} from "./heirloom";
import { inputClass, labelClass } from "@/components/dashboard/ui";

interface Props {
  settings: HeirloomSettings;
  onChange: (settings: HeirloomSettings) => void;
  disabled: boolean;
  musicError?: string;
  sceneError?: string;
}

/** Small, plain form controls; the parent editor handles saving to the API. */
export default function HeirloomEditor({
  settings,
  onChange,
  disabled,
  musicError,
  sceneError,
}: Props) {
  const colours = heirloomColours(settings);
  function update(key: keyof HeirloomSettings, value: string) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <fieldset
      disabled={disabled}
      className="space-y-5 rounded-2xl border border-[#dfc5bb] bg-[#fff8f5] p-5"
    >
      <legend className="px-2 font-serif-luxury text-2xl text-[#7a1414]">
        The Grand Heirloom
      </legend>
      <p className="text-sm leading-6 text-[#78615a]">
        Personalise your Heritage Door invitation: illustrated wedding scenes,
        carved doors, colours, photos and sound. Guests can switch between
        Sinhala and English.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass} htmlFor="heirloom-language">
          Opening language
          <select
            id="heirloom-language"
            className={`${inputClass} mt-2`}
            value={settings.language}
            onChange={(event) => update("language", event.target.value)}
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
          </select>
        </label>
        <label className={labelClass} htmlFor="heirloom-font">
          Font style
          <select
            id="heirloom-font"
            className={`${inputClass} mt-2`}
            value={settings.font}
            onChange={(event) => update("font", event.target.value)}
          >
            <option value="classic">Elegant</option>
            <option value="romantic">Calligraphy</option>
            <option value="modern">Classic</option>
          </select>
        </label>
      </div>
      <label className={`${labelClass} block`} htmlFor="heirloom-palette">
        Colour theme
        <select
          id="heirloom-palette"
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
              bloom: "",
            })
          }
        >
          {HEIRLOOM_PALETTES.map((palette) => (
            <option key={palette.id} value={palette.id}>
              {palette.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(
          [
            ["main", "Night sky"],
            ["accent", "Gold / accent"],
            ["background", "Day sky"],
            ["envelope", "Door wood"],
            ["bloom", "Flowers"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className={labelClass} htmlFor={`heirloom-${key}`}>
            {label}
            <input
              type="color"
              id={`heirloom-${key}`}
              value={colours[key]}
              onChange={(event) => update(key, event.target.value)}
              className="mt-2 h-11 w-full cursor-pointer rounded-lg border border-[#dfc5bb] bg-white p-1"
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
            bloom: "",
          })
        }
      >
        Use theme colours
      </button>
      <fieldset className="space-y-3 rounded-xl border border-[#dfc5bb] p-4">
        <legend className={labelClass}>Scene photos (optional)</legend>
        {sceneError && <p role="alert" className="text-xs text-red-600">{sceneError}</p>}
        <p className="text-xs leading-5 text-[#78615a]">
          Leave empty to use the exact illustrations from the uploaded Heritage
          Door design. Use portrait HTTPS images or files in public, such as
          /images/courtyard.jpg. Cover and gallery uploads are available in the
          Photos step.
        </p>
        {HEIRLOOM_SCENES.map((scene) => (
          <label
            key={scene}
            className={`${labelClass} block`}
            htmlFor={`heirloom-scene-${scene}`}
          >
            <span className="capitalize">{scene}</span>
            <input
              id={`heirloom-scene-${scene}`}
              className={`${inputClass} mt-1`}
              value={settings.scenePhotos[scene] || ""}
              maxLength={1000}
              placeholder={`https://example.com/${scene}.jpg`}
              onChange={(event) =>
                onChange({
                  ...settings,
                  scenePhotos: {
                    ...settings.scenePhotos,
                    [scene]: event.target.value,
                  },
                })
              }
            />
          </label>
        ))}
      </fieldset>
      {(
        [
          ["messageSi", "Sinhala invitation message", 3],
          ["storyEn", "Your love story — English (optional)", 4],
          ["storySi", "ඔබගේ ආදර කතාව — සිංහල (optional)", 4],
          ["dressEn", "Dress note — English (optional)", 2],
          ["dressSi", "ඇඳුම් පැළඳුම් — සිංහල (optional)", 2],
        ] as const
      ).map(([key, label, rows]) => (
        <label
          key={key}
          htmlFor={`heirloom-${key}`}
          className={`${labelClass} block`}
        >
          {label}
          <textarea
            id={`heirloom-${key}`}
            lang={key.endsWith("Si") ? "si" : "en"}
            className={`${inputClass} mt-2 resize-y`}
            rows={rows}
            maxLength={key.startsWith("story") ? 4000 : 2000}
            value={settings[key]}
            onChange={(event) => update(key, event.target.value)}
          />
        </label>
      ))}
      <div className="space-y-4">
        <p className={labelClass}>Love story timeline (optional)</p>
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
                  value={moment[key]}
                  maxLength={
                    key === "year" ? 30 : key.startsWith("title") ? 100 : 1000
                  }
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
              className="text-xs font-semibold text-red-700 underline"
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
          className="text-xs font-semibold text-[#7a1414] underline disabled:opacity-50"
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
      <label htmlFor="heirloom-music" className={`${labelClass} block`}>
        Background music URL (optional)
        <input
          id="heirloom-music"
          type="text"
          className={`${inputClass} mt-2`}
          maxLength={1000}
          placeholder="https://example.com/wedding.mp3"
          value={settings.musicUrl}
          onChange={(event) => update("musicUrl", event.target.value)}
          aria-invalid={Boolean(musicError)}
          aria-describedby="heirloom-music-hint"
        />
        <span
          id="heirloom-music-hint"
          className="mt-2 block text-xs font-normal leading-5 text-[#78615a]"
        >
          Leave empty for the built-in melody. A direct HTTPS audio URL or
          /audio/wedding.mp3 replaces the melody with your song. Door opening,
          footsteps and welcome chimes start when the guest opens the
          invitation. Sound can be muted before and after opening.
        </span>
        {musicError && (
          <span className="mt-1 block text-xs text-red-600" role="alert">
            {musicError}
          </span>
        )}
      </label>
      <p className="text-xs leading-5 text-[#78615a]">
        Use the invitation message below for English wording. Add event names
        and venue details in your preferred language, or include both languages.
        The story section appears once you add your story. Photos are managed in
        the next step.
      </p>
    </fieldset>
  );
}
