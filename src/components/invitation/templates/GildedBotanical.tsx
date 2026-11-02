/** Small line drawing that follows the invitation's selected gold colour. */
export default function GildedBotanical({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`gilded-botanical ${className}`}
      viewBox="0 0 200 300"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M31 285C63 222 45 167 107 101C132 74 143 42 150 13" />
        <path d="M58 225C19 207 17 180 20 159C46 169 61 190 58 225ZM64 193C98 183 112 158 109 138C83 146 66 164 64 193ZM83 137C49 126 44 102 47 82C71 89 86 108 83 137ZM110 98C144 98 165 80 170 60C144 61 123 74 110 98ZM139 49C114 41 108 21 114 6C134 14 143 29 139 49Z" />
        <path d="M45 253C71 240 84 218 83 203M97 115C100 87 90 72 83 57" />
        <path d="M88 58C69 53 69 35 81 31C85 16 101 23 101 35C117 40 109 57 97 56C95 65 87 66 88 58Z" />
        <circle cx="92" cy="44" r="4" />
        <path d="M88 207C78 195 85 184 95 188C104 175 116 186 111 196C123 208 108 218 100 210C93 221 82 217 88 207Z" />
        <circle cx="101" cy="200" r="3" />
        <circle cx="162" cy="31" r="2" />
        <circle cx="38" cy="133" r="2" />
        <circle cx="125" cy="127" r="2" />
      </g>
    </svg>
  );
}
