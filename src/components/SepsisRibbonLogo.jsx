import React from 'react';

export default function SepsisRibbonLogo({ size = 36, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      width={size} 
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="logoRedTop" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stop-color="#ef4444" />
          <stop offset="40%" stop-color="#dc2626" />
          <stop offset="100%" stop-color="#991b1b" />
        </linearGradient>

        <linearGradient id="logoRedFlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b91c1c" />
          <stop offset="45%" stop-color="#ef4444" />
          <stop offset="85%" stop-color="#dc2626" />
          <stop offset="100%" stop-color="#7f1d1d" />
        </linearGradient>

        <linearGradient id="logoBlackLoop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#475569" />
          <stop offset="50%" stop-color="#334155" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>

        <linearGradient id="logoBlackTail" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#64748b" />
          <stop offset="60%" stop-color="#334155" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>

        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#logoShadow)" transform="translate(48, 20) scale(0.84)">
        {/* Black Right Loop (Under) */}
        <path d="M 235 60 C 275 60, 315 95, 315 155 C 315 205, 275 250, 240 285 L 170 345 L 135 320 C 175 275, 260 190, 260 150 C 260 115, 235 95, 205 95 C 185 95, 170 105, 160 118 Z" fill="url(#logoBlackLoop)" />

        {/* Black Tail */}
        <path d="M 240 285 L 170 345 L 115 385 L 105 320 L 175 270 Z" fill="url(#logoBlackTail)" />

        {/* Red Main Loop (Front) */}
        <path d="M 195 55 C 245 55, 275 80, 285 105 L 245 130 C 235 100, 215 90, 195 90 C 160 90, 135 125, 135 175 C 135 220, 165 260, 210 295 L 285 355 L 255 385 C 205 340, 95 245, 95 165 C 95 95, 140 55, 195 55 Z" fill="url(#logoRedTop)" />

        {/* Inner Light Reflection */}
        <path d="M 195 55 C 245 55, 275 80, 285 105 C 275 90, 240 70, 195 70 C 150 70, 115 105, 110 165 C 108 145, 120 100, 150 75 C 165 62, 180 55, 195 55 Z" fill="#fca5a5" opacity="0.4" />

        {/* Flowing Lower Red Wave Ribbon */}
        <path d="M 245 320 C 285 350, 360 405, 410 445 C 435 465, 440 485, 435 505 C 425 535, 385 570, 320 610 L 320 545 C 365 515, 395 490, 395 475 C 395 460, 360 435, 310 395 L 245 345 Z" fill="url(#logoRedFlow)" />

        {/* Shading Fold */}
        <path d="M 410 445 C 435 465, 440 485, 435 505 C 425 535, 385 570, 320 610 L 320 595 C 375 560, 410 528, 418 502 C 422 488, 418 472, 400 455 Z" fill="#450a0a" opacity="0.55" />
      </g>
    </svg>
  );
}
