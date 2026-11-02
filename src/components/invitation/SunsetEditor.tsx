"use client";

import { inputClass, labelClass, secondaryButton } from "@/components/dashboard/ui";
import {
  DEFAULT_SUNSET,
  SUNSET_COLOURS,
  SUNSET_FONTS,
  SUNSET_PALETTES,
  type SunsetSettings,
} from "./sunset";

interface SunsetEditorProps {
  settings: SunsetSettings;
  onChange: (settings: SunsetSettings) => void;
  disabled?: boolean;
  demo?: boolean;
  mediaError?: string;
  eventNames?: string[];
}

/** The demo and dashboard share the same colour and font controls. */
export default function SunsetEditor({
  settings,
  onChange,
  disabled = false,
  demo = false,
  mediaError,
  eventNames = [],
}: SunsetEditorProps) {
  const update = <Key extends keyof SunsetSettings>(key: Key, value: SunsetSettings[Key]) =>
    onChange({ ...settings, [key]: value });

  return (
    <fieldset
      disabled={disabled}
      className="sunset-design-editor space-y-5 rounded-2xl border border-[#EADBCA] bg-[#FFFBF5] p-5 text-[#33474a]"
    >
      <legend className="px-2 font-serif-luxury text-2xl">Sunset Journey design</legend>
      <p className="text-xs leading-5 text-[#756b62]">
        {demo
          ? "Try the original colours and fonts. Changes update this preview instantly."
          : "Personalise the vintage-car invitation. Save this step to apply the design to your invitation."}
      </p>
      <div>
        <p className={labelClass}>Colour themes</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUNSET_PALETTES.map((palette) => (
            <button
              key={palette.name}
              type="button"
              className={secondaryButton}
              aria-pressed={SUNSET_COLOURS.every(
                ([key]) => settings[key].toLowerCase() === palette[key],
              )}
              onClick={() =>
                onChange({
                  ...settings,
                  main: palette.main,
                  gold: palette.gold,
                  paper: palette.paper,
                  sky: palette.sky,
                })
              }
            >
              <span
                aria-hidden="true"
                className="h-5 w-5 shrink-0 rounded-full border border-black/10"
                style={{
                  background: `linear-gradient(135deg,${palette.main} 40%,${palette.gold} 40% 65%,${palette.sky} 65%)`,
                }}
              />
              {palette.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {SUNSET_COLOURS.map(([key, label]) => (
          <label key={key} htmlFor={`sunset-${key}`} className={labelClass}>
            {label}
            <input
              id={`sunset-${key}`}
              type="color"
              className="mt-2 h-10 w-full cursor-pointer"
              value={settings[key]}
              onChange={(event) => update(key, event.target.value)}
            />
            <span className="mt-1 block text-xs uppercase">{settings[key]}</span>
          </label>
        ))}
      </div>
      <label htmlFor="sunset-font" className={`${labelClass} block`}>
        Font style
        <select
          id="sunset-font"
          className={`${inputClass} mt-2`}
          value={settings.font}
          onChange={(event) => update("font", event.target.value as SunsetSettings["font"])}
        >
          {SUNSET_FONTS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
      {!demo && (
        <>
          {eventNames.length > 0 && (
            <div className="space-y-3">
              <h4 className={labelClass}>Event dates (optional)</h4>
              <p className="text-xs">
                Leave empty to use your wedding date. Match these to the events below.
              </p>
              {eventNames.map((name, index) => (
                <label key={index} className={`${labelClass} block`}>
                  {name || `Event ${index + 1}`} date
                  <input
                    type="date"
                    className={`${inputClass} mt-1`}
                    value={settings.eventDates[index] || ""}
                    onChange={(event) => {
                      const dates = [...settings.eventDates];
                      dates[index] = event.target.value;
                      update("eventDates", dates);
                    }}
                  />
                </label>
              ))}
            </div>
          )}
          <label htmlFor="sunset-story" className={`${labelClass} block`}>
            Our story
            <textarea
              id="sunset-story"
              rows={4}
              maxLength={2000}
              className={`${inputClass} mt-2`}
              value={settings.story}
              onChange={(event) => update("story", event.target.value)}
            />
          </label>
          <label htmlFor="sunset-families" className={`${labelClass} block`}>
            Family invitation wording
            <textarea
              id="sunset-families"
              rows={2}
              maxLength={2000}
              className={`${inputClass} mt-2`}
              value={settings.familiesLine}
              onChange={(event) => update("familiesLine", event.target.value)}
            />
          </label>
          <div className="space-y-3">
            <h4 className={labelClass}>Your journey timeline</h4>
            {settings.timeline.map((moment, index) => (
              <div key={index} className="space-y-2 rounded-xl border border-[#EADBCA] p-3">
                {(
                  [
                    ["year", "Year"],
                    ["title", "Title"],
                    ["description", "Description"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className={`${labelClass} block`}>
                    {label} {index + 1}
                    <input
                      className={`${inputClass} mt-1`}
                      maxLength={key === "year" ? 20 : key === "title" ? 150 : 1000}
                      value={moment[key]}
                      onChange={(event) =>
                        update(
                          "timeline",
                          settings.timeline.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, [key]: event.target.value } : item,
                          ),
                        )
                      }
                    />
                  </label>
                ))}
                <button
                  type="button"
                  className={secondaryButton}
                  onClick={() =>
                    update(
                      "timeline",
                      settings.timeline.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  Remove moment {index + 1}
                </button>
              </div>
            ))}
            <button
              type="button"
              className={secondaryButton}
              disabled={disabled || settings.timeline.length >= 10}
              onClick={() =>
                update("timeline", [...settings.timeline, { year: "", title: "", description: "" }])
              }
            >
              Add story moment
            </button>
          </div>
          {(
            [
              [
                "musicUrl",
                "Background music URL (optional)",
                "Leave empty to use the original built-in melody.",
              ],
              [
                "filmVideoUrl",
                "Intro video URL (optional)",
                "Leave empty to use the original animated car and bouquet scene.",
              ],
            ] as const
          ).map(([key, label, help]) => (
            <label key={key} htmlFor={`sunset-${key}`} className={`${labelClass} block`}>
              {label}
              <input
                id={`sunset-${key}`}
                type="text"
                maxLength={1000}
                className={`${inputClass} mt-2`}
                value={settings[key]}
                onChange={(event) => update(key, event.target.value)}
                placeholder={
                  key === "musicUrl"
                    ? "https://example.com/wedding.mp3"
                    : "https://example.com/intro.mp4"
                }
              />
              <span className="mt-2 block text-xs font-normal leading-5">
                {help} Use an HTTPS URL or a local path starting with /.
              </span>
            </label>
          ))}
          {mediaError && (
            <p role="alert" className="text-xs text-red-700">
              {mediaError}
            </p>
          )}
          <p className="text-xs leading-5">
            Upload your couple and gallery photos in the Photos step. Empty slots use the ZIP&apos;s
            original illustrations.
          </p>
        </>
      )}
      <button
        type="button"
        className={secondaryButton}
        onClick={() =>
          onChange({
            ...settings,
            main: DEFAULT_SUNSET.main,
            gold: DEFAULT_SUNSET.gold,
            paper: DEFAULT_SUNSET.paper,
            sky: DEFAULT_SUNSET.sky,
            font: DEFAULT_SUNSET.font,
          })
        }
      >
        Reset colours &amp; font
      </button>
    </fieldset>
  );
}
