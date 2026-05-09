// Abstract hero illustration matching the Figma feel — phone mockup with a doctor card.
// Pure SVG so it scales, has no external asset, and stays small.
export default function HeroIllustration() {
  return (
    <svg
      className="hero__art"
      viewBox="0 0 480 540"
      role="img"
      aria-label="Illustration of an online doctor consultation"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft circle backdrop */}
      <circle cx="280" cy="240" r="220" fill="rgba(255,255,255,0.18)" />
      <circle cx="280" cy="240" r="170" fill="rgba(255,255,255,0.12)" />

      {/* Phone */}
      <g transform="translate(160 60)">
        <rect x="0" y="0" width="220" height="420" rx="32" fill="#FFFFFF" stroke="#0F4A45" strokeWidth="2" />
        <rect x="14" y="14" width="192" height="32" rx="8" fill="#E8F8F6" />
        <circle cx="30" cy="30" r="6" fill="#2EC4B6" />
        <rect x="46" y="22" width="100" height="6" rx="3" fill="#1FA89C" />
        <rect x="46" y="32" width="60" height="5" rx="2" fill="#7B8A95" />

        {/* Doctor card */}
        <rect x="14" y="60" width="192" height="240" rx="14" fill="#2EC4B6" />
        <circle cx="110" cy="142" r="46" fill="#FFFFFF" />
        {/* Doctor head */}
        <circle cx="110" cy="135" r="22" fill="#F5D6BC" />
        {/* Stethoscope head */}
        <circle cx="98" cy="158" r="6" fill="#1FA89C" />
        <circle cx="122" cy="158" r="6" fill="#1FA89C" />
        <path d="M98 158 q12 18 24 0" stroke="#1FA89C" strokeWidth="2" fill="none" />
        {/* White coat */}
        <path d="M76 168 q34 28 68 0 v50 H76 z" fill="#FFFFFF" />
        <path d="M104 168 v50 M116 168 v50" stroke="#E6ECEF" strokeWidth="2" />
        {/* Name lines */}
        <rect x="40" y="208" width="140" height="8" rx="4" fill="#FFFFFF" opacity="0.92" />
        <rect x="60" y="222" width="100" height="6" rx="3" fill="#FFFFFF" opacity="0.7" />

        <rect x="40" y="248" width="140" height="36" rx="18" fill="#FFFFFF" />
        <rect x="74" y="262" width="72" height="8" rx="4" fill="#2EC4B6" />

        {/* Lower content */}
        <rect x="14" y="316" width="192" height="14" rx="6" fill="#E6ECEF" />
        <rect x="14" y="338" width="120" height="10" rx="5" fill="#E6ECEF" />
        <rect x="14" y="356" width="160" height="10" rx="5" fill="#E6ECEF" />
        <rect x="14" y="380" width="192" height="32" rx="10" fill="#1FA89C" />
        <rect x="80" y="392" width="60" height="8" rx="4" fill="#FFFFFF" />
      </g>

      {/* Floating stickers */}
      <g transform="translate(60 100)">
        <rect width="120" height="44" rx="22" fill="#FFFFFF" />
        <circle cx="22" cy="22" r="10" fill="#2EC4B6" />
        <rect x="40" y="14" width="60" height="6" rx="3" fill="#1B2B36" />
        <rect x="40" y="26" width="40" height="5" rx="2" fill="#7B8A95" />
      </g>
      <g transform="translate(380 360)">
        <rect width="100" height="40" rx="20" fill="#FFFFFF" />
        <rect x="16" y="14" width="68" height="6" rx="3" fill="#1B2B36" />
        <rect x="16" y="26" width="44" height="5" rx="2" fill="#7B8A95" />
      </g>
    </svg>
  );
}
