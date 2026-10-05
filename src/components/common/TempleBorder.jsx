import React from 'react';

export default function TempleBorder({
  className = '',
  variant = 'gold', // 'gold', 'maroon', 'ivory'
  flip = false
}) {
  const strokeColor = {
    gold: '#C9A24B',
    maroon: '#7B1E3A',
    ivory: '#FAF3EA'
  }[variant] || '#C9A24B';

  const fillColor = {
    gold: '#C9A24B',
    maroon: '#7B1E3A',
    ivory: '#FAF3EA'
  }[variant] || '#C9A24B';

  return (
    <div
      className={`w-full overflow-hidden flex items-center justify-center opacity-85 select-none ${
        flip ? 'rotate-180' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full max-w-7xl h-5 md:h-6"
        viewBox="0 0 1200 24"
        preserveAspectRatio="repeat-x"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id={`temple-pattern-${variant}`} width="40" height="24" patternUnits="userSpaceOnUse">
          {/* Temple kumbham pinnacle triangle */}
          <path d="M20,2 L32,16 L8,16 Z" fill={fillColor} fillOpacity="0.2" stroke={strokeColor} strokeWidth="1" />
          <path d="M20,6 L27,15 L13,15 Z" fill={fillColor} fillOpacity="0.4" />
          {/* Decorative crest point */}
          <circle cx="20" cy="2" r="1.5" fill={fillColor} />
          {/* Base zari line */}
          <line x1="0" y1="18" x2="40" y2="18" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="0" y1="21" x2="40" y2="21" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="1.5, 2.5" />
          {/* Small diamond between temples */}
          <polygon points="0,17 3,14 6,17 3,20" fill={fillColor} />
          <polygon points="37,17 40,14 43,17 40,20" fill={fillColor} />
        </pattern>
        <rect width="1200" height="24" fill={`url(#temple-pattern-${variant})`} />
      </svg>
    </div>
  );
}
