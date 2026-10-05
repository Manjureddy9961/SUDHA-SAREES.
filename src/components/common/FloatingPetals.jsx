import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function FloatingPetals({ count = 18, color = 'gold' }) {
  const shouldReduceMotion = useReducedMotion();

  // Generate deterministic particles so there is no layout jump
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const isPetal = i % 2 === 0;
      const size = isPetal ? 12 + (i % 10) : 4 + (i % 6);
      const startX = (i * (100 / count)) + (i % 5);
      const duration = 9 + (i % 7) * 2;
      const delay = (i * 0.7) % 6;
      const rotation = (i * 47) % 360;

      return {
        id: i,
        isPetal,
        size,
        startX: `${startX}%`,
        duration,
        delay,
        rotation,
      };
    });
  }, [count]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{
            top: '-5%',
            left: p.startX,
            opacity: 0,
            scale: 0.6,
            rotate: p.rotation,
          }}
          animate={{
            top: '105%',
            left: `calc(${p.startX} + ${(p.id % 2 === 0 ? 1 : -1) * 35}px)`,
            opacity: [0, 0.75, 0.85, 0.4, 0],
            scale: [0.6, 1, 0.9, 0.7],
            rotate: p.rotation + 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {p.isPetal ? (
            /* Rose/Maroon flower petal */
            <svg
              width={p.size}
              height={p.size * 1.4}
              viewBox="0 0 24 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_2px_4px_rgba(201,162,75,0.3)]"
            >
              <path
                d="M12,0 C19,8 24,18 20,27 C16,35 6,35 2,27 C-2,19 4,7 12,0 Z"
                fill={p.id % 4 === 0 ? '#C9A24B' : p.id % 3 === 0 ? '#9B2C4D' : '#F7E1E7'}
                opacity={p.id % 4 === 0 ? '0.6' : '0.45'}
              />
            </svg>
          ) : (
            /* Gold sparkling bead/star */
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
              className="rounded-full bg-brand-gold-light/60 shadow-[0_0_8px_#DFC06C]"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
