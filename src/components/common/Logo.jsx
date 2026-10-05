import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({
  variant = 'dark', // 'dark' (for light backgrounds) or 'light' (for dark/maroon backgrounds)
  size = 'md', // 'sm', 'md', 'lg', 'hero'
  showWordmark = true,
  animateDraw = false
}) {
  const isLight = variant === 'light';

  // Sizing definitions
  const dimensions = {
    sm: { icon: 34, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 46, text: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 60, text: 'text-3xl', sub: 'text-xs' },
    hero: { icon: 84, text: 'text-4xl md:text-5xl', sub: 'text-sm' }
  }[size] || { icon: 46, text: 'text-2xl', sub: 'text-[11px]' };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.8, ease: "easeInOut" },
        opacity: { duration: 0.4 }
      }
    }
  };

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* SVG Monogram "S" with Pallu drape curve & Lotus motif */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 group-hover:scale-105"
        >
          <defs>
            {/* Royal Gold metallic gradient */}
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="40%" stopColor="#E2BD68" />
              <stop offset="70%" stopColor="#C9A24B" />
              <stop offset="100%" stopColor="#926F1E" />
            </linearGradient>

            {/* Deep Maroon gradient background medallion */}
            <radialGradient id="logoMaroon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9B2C4D" />
              <stop offset="75%" stopColor="#7B1E3A" />
              <stop offset="100%" stopColor="#4A0E1F" />
            </radialGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#C9A24B" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Outer Royal Circular Medallion */}
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="url(#logoMaroon)"
            stroke="url(#logoGold)"
            strokeWidth="2.5"
          />

          {/* Decorative filigree dotted halo ring */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#logoGold)"
            strokeWidth="0.9"
            strokeDasharray="2.5 3"
            opacity="0.85"
          />

          {/* Traditional Pallu / Drape Ribbon sweeping through */}
          <path
            d="M26,38 C32,25 68,20 74,38 C79,53 45,55 35,66 C26,75 36,83 50,83 C66,83 72,70 72,70"
            fill="none"
            stroke="url(#logoGold)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Sacred Lotus Blossom Motif on Top */}
          <path
            d="M50,15 C52,20 54,22 59,22 C55,24 53,26 50,30 C47,26 45,24 41,22 C46,22 48,20 50,15 Z"
            fill="url(#logoGold)"
            filter="url(#goldGlow)"
          />

          {/* Elegant Monogram 'S' with fluid pallu curve */}
          {animateDraw ? (
            <motion.path
              d="M65,33 C62,26 53,24 45,27 C35,31 34,42 45,47 C57,53 60,63 52,71 C45,78 32,77 26,69 C24,66 25,62 29,62 C32,62 34,65 37,67 C42,69 48,68 51,63 C54,58 50,53 40,48 C29,43 27,31 36,23 C46,14 62,17 68,26 C70,29 69,34 65,33 Z"
              fill="url(#logoGold)"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              filter="url(#goldGlow)"
            />
          ) : (
            <path
              d="M65,33 C62,26 53,24 45,27 C35,31 34,42 45,47 C57,53 60,63 52,71 C45,78 32,77 26,69 C24,66 25,62 29,62 C32,62 34,65 37,67 C42,69 48,68 51,63 C54,58 50,53 40,48 C29,43 27,31 36,23 C46,14 62,17 68,26 C70,29 69,34 65,33 Z"
              fill="url(#logoGold)"
              filter="url(#goldGlow)"
            />
          )}

          {/* Zari Gold Bead Accent */}
          <circle cx="50" cy="74" r="2.4" fill="url(#logoGold)" />
        </svg>
      </div>

      {/* Script-Style Elegant Brand Typography */}
      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-serif font-bold tracking-wider leading-none ${dimensions.text} ${
              isLight ? 'text-brand-ivory' : 'text-brand-maroon-dark'
            }`}
          >
            Sudha{' '}
            <span
              className={
                isLight
                  ? 'text-brand-gold-light'
                  : 'text-brand-maroon font-normal italic'
              }
            >
              Sarees
            </span>
          </span>
          <span
            className={`tracking-[0.28em] uppercase font-sans font-medium mt-1 ${dimensions.sub} ${
              isLight ? 'text-brand-gold-light/80' : 'text-brand-gold-dark'
            }`}
          >
            Rayachoty &bull; Handlooms
          </span>
        </div>
      )}
    </div>
  );
}
