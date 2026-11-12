/** Original, editable mandala geometry and ceremonial procession. No bitmap text. */
export function AurelineMandala({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 600 600" fill="none" aria-hidden="true">
    <g transform="translate(300 300)" stroke="currentColor" strokeWidth=".9">
      {[30, 48, 70, 100, 138, 184, 228, 257, 278].map((r) => <circle key={r} r={r} />)}
      {Array.from({ length: 24 }, (_, n) => <g key={n} transform={`rotate(${n * 15})`}>
        <path d="M0-48Q-19-75 0-99Q19-75 0-48ZM0-101Q-38-139 0-181Q38-139 0-101ZM0-185Q-30-216 0-255Q30-216 0-185Z" />
        <path d="M0-103Q-12-140 0-163Q12-140 0-103ZM0-186Q-13-220 0-242Q13-220 0-186Z" opacity=".7" />
        <path d="M-13-260L0-291L13-260" />
        <circle cy="-270" r="3" />
      </g>)}
      <circle r="16" />
      <path d="M0-13Q20 0 0 13Q-20 0 0-13Z" />
    </g>
  </svg>;
}

export function AurelineProcession({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 1000 85" fill="none" aria-hidden="true">
    <path d="M0 77H1000M0 82H1000" stroke="currentColor" strokeWidth=".6" />
    {Array.from({ length: 10 }, (_, n) => <g key={n} transform={`translate(${n * 100 + 12},10)`} stroke="currentColor" strokeWidth="1.2">
      <path d="M8 48V33Q8 17 28 17H43Q57 17 59 29Q72 25 75 37L77 52Q78 60 70 60H65V51H57V67H48V51H24V67H15V50Z" fill="currentColor" fillOpacity=".08" />
      <path d="M18 19V38H49V19M21 21H46M24 25V34M30 25V34M36 25V34M42 25V34M57 31Q44 20 48 43Q52 51 58 44" />
      <circle cx="66" cy="35" r="1.4" fill="currentColor" />
      <path d="M30 16V7M24 11L30 1L36 11M2 47L8 39" />
    </g>)}
  </svg>;
}
