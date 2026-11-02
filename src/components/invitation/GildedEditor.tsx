"use client";

import { inputClass, labelClass, secondaryButton } from "@/components/dashboard/ui";
import {
  DEFAULT_GILDED,
  GILDED_COLOURS,
  GILDED_FONTS,
  GILDED_PALETTES,
  type GildedSettings,
} from "./gilded";

export default function GildedEditor({
  settings,
  onChange,
  disabled = false,
  demo = false,
  eventNames = [],
  mediaError,
}: {
  settings: GildedSettings;
  onChange: (settings: GildedSettings) => void;
  disabled?: boolean;
  demo?: boolean;
  eventNames?: string[];
  mediaError?: string;
}) {
  const update = <Key extends keyof GildedSettings>(key: Key, value: GildedSettings[Key]) =>
    onChange({ ...settings, [key]: value });
  return (
    <fieldset
      disabled={disabled}
      className="gilded-editor space-y-5 rounded-2xl border border-[#EADBCA] bg-white p-5 text-[#42332f]"
    >
      <legend className="px-2 font-serif-luxury text-2xl">The Gilded Celebration design</legend>
      <p className="text-xs leading-5">
        {demo
          ? "Try colours and fonts here. Save your final design in your invitation editor."
          : "Choose colours and fonts, then save this step to update your invitation."}
      </p>
      <div className="flex flex-wrap gap-2">
        {GILDED_PALETTES.map((palette) => (
          <button
            key={palette.name}
            type="button"
            className={secondaryButton}
            aria-pressed={GILDED_COLOURS.every(
              ([key]) => settings[key].toLowerCase() === palette[key],
            )}
            onClick={() =>
              onChange({
                ...settings,
                wine: palette.wine,
                gold: palette.gold,
                ivory: palette.ivory,
                ink: palette.ink,
                muted: palette.muted,
              })
            }
          >
            <span
              aria-hidden="true"
              className="h-4 w-4 shrink-0 rounded-full"
              style={{ background: palette.wine }}
            />
            {palette.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {GILDED_COLOURS.map(([key, label]) => (
          <label key={key} className={`${labelClass} block`} htmlFor={`gilded-${key}`}>
            {label}
            <input
              id={`gilded-${key}`}
              type="color"
              className="mt-2 h-10 w-full"
              value={settings[key]}
              onChange={(event) => update(key, event.target.value)}
            />
            <span className="mt-1 block text-xs uppercase">{settings[key]}</span>
          </label>
        ))}
      </div>
      <label className={`${labelClass} block`} htmlFor="gilded-font">
        Font style
        <select
          id="gilded-font"
          className={`${inputClass} mt-2`}
          value={settings.font}
          onChange={(event) => update("font", event.target.value as GildedSettings["font"])}
        >
          {GILDED_FONTS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
      {!demo && (
        <>
          {(
            [
              ["storyHeading", "Story heading"],
              ["storyText", "Our love story"],
              ["quote", "Wedding quote"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className={`${labelClass} block`} htmlFor={`gilded-${key}`}>
              {label}
              <textarea
                id={`gilded-${key}`}
                rows={key === "storyText" ? 4 : 2}
                maxLength={key === "storyText" ? 4000 : 500}
                className={`${inputClass} mt-2`}
                value={settings[key]}
                onChange={(event) => update(key, event.target.value)}
              />
            </label>
          ))}
          {eventNames.map((name, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-[#EADBCA] p-3">
              <p className={labelClass}>{name || `Event ${index + 1}`}</p>
              <label className={`${labelClass} block`}>
                Date (optional)
                <input
                  type="date"
                  id={`gilded-event-date-${index}`}
                  className={`${inputClass} mt-1`}
                  value={settings.eventDates[index] || ""}
                  onChange={(event) => {
                    const dates = Array.from({ length: eventNames.length }, (_, i) => settings.eventDates[i] || "");
                    dates[index] = event.target.value;
                    update("eventDates", dates);
                  }}
                />
              </label>
              <label className={`${labelClass} block`}>
                Google Maps link (optional)
                <input
                  type="url"
                  id={`gilded-event-map-${index}`}
                  className={`${inputClass} mt-1`}
                  placeholder="https://maps.google.com/..."
                  value={settings.eventMaps[index] || ""}
                  onChange={(event) => {
                    const maps = Array.from({ length: eventNames.length }, (_, i) => settings.eventMaps[i] || "");
                    maps[index] = event.target.value;
                    update("eventMaps", maps);
                  }}
                />
              </label>
            </div>
          ))}
          <label className={`${labelClass} block`} htmlFor="gilded-musicUrl">
            Music URL (optional)
            <input
              id="gilded-musicUrl"
              className={`${inputClass} mt-2`}
              value={settings.musicUrl}
              maxLength={1000}
              placeholder="https://example.com/wedding.mp3"
              onChange={(event) => update("musicUrl", event.target.value)}
            />
            <span className="mt-2 block text-xs font-normal">
              Use HTTPS or a local path such as /audio/wedding.mp3. Leave empty for a gentle
              built-in melody.
            </span>
          </label>
          {mediaError && (
            <p className="text-xs text-red-700" role="alert">
              {mediaError}
            </p>
          )}
          <p className="text-xs">
            Upload your cover and gallery photos in the Photos step. Empty event dates use your
            wedding date.
          </p>
        </>
      )}
      <button
        type="button"
        className={secondaryButton}
        onClick={() =>
          onChange({
            ...settings,
            wine: DEFAULT_GILDED.wine,
            gold: DEFAULT_GILDED.gold,
            ivory: DEFAULT_GILDED.ivory,
            ink: DEFAULT_GILDED.ink,
            muted: DEFAULT_GILDED.muted,
            font: DEFAULT_GILDED.font,
          })
        }
      >
        Reset original design
      </button>
    </fieldset>
  );
}
