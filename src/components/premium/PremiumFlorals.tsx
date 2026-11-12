import { useId } from "react";

/** Original vector botanicals, inspired by the reference's burgundy floral stationery. */
export default function PremiumFlorals({ className }: { className?: string }) {
  const id = useId().replaceAll(":", "");
  return <svg className={className} viewBox="0 0 400 500" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-rose`}><stop stopColor="var(--forest)" /><stop offset=".7" stopColor="var(--forest)" stopOpacity=".65" /><stop offset="1" stopColor="var(--ornament)" stopOpacity=".6" /></radialGradient>
      <g id={`${id}-bloom`}>
        {Array.from({ length: 14 }, (_, n) => <ellipse key={n} cx="0" cy="-32" rx="23" ry="40" transform={`rotate(${n * 360 / 14})`} fill={`url(#${id}-rose)`} stroke="var(--paper)" strokeOpacity=".18" strokeWidth=".6" />)}
        {Array.from({ length: 10 }, (_, n) => <ellipse key={n} cx="0" cy="-18" rx="15" ry="25" transform={`rotate(${n * 36 + 12})`} fill="var(--forest)" fillOpacity=".8" stroke="var(--paper)" strokeOpacity=".3" strokeWidth=".7" />)}
        <circle r="13" fill="var(--forest)" /><path d="M-9 1Q0-16 8 1Q5 12-4 6Q-10 0 0-5Q7-6 5 1" stroke="var(--ornament)" strokeWidth="1.5" />
      </g>
    </defs>
    <g stroke="var(--ornament)" strokeOpacity=".65" strokeWidth="1.1">
      <path d="M393 11Q236 140 219 291T94 489M365 43Q237 91 80 105M302 107Q348 243 393 304M218 275Q123 229 15 267" />
      {Array.from({ length: 12 }, (_, n) => <g key={n} transform={`translate(${360 - n * 22},${40 + n * 31}) rotate(${n % 2 ? -65 : 35})`}><path d="M0 0Q-42-58-14-84Q23-53 0 0Z" fill="var(--forest)" fillOpacity=".16" /><path d="M0 0L-14-76" /></g>)}
    </g>
    <use href={`#${id}-bloom`} transform="translate(305 125) rotate(20) scale(1.1)" />
    <use href={`#${id}-bloom`} transform="translate(337 272) rotate(-30) scale(.76)" />
    <use href={`#${id}-bloom`} transform="translate(185 65) rotate(-10) scale(.63)" />
    <use href={`#${id}-bloom`} transform="translate(160 330) rotate(40) scale(.48)" />
    <g fill="var(--ornament)" opacity=".65">{Array.from({ length: 18 }, (_, n) => <circle key={n} cx={240 + Math.cos(n * 2.4) * (45 + n * 3)} cy={200 + Math.sin(n * 2.4) * (45 + n * 3)} r={n % 3 + 1} />)}</g>
  </svg>;
}
