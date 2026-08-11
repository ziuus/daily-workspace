import React from 'react';

export default function DailyLogo({ className = "w-7 h-7" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dailyGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-text)" />
        </linearGradient>
        <linearGradient id="dailyAccent" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent-text)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      
      {/* Outer Sleek Rounded Square Container */}
      <rect 
        x="2" 
        y="2" 
        width="28" 
        height="28" 
        rx="8" 
        fill="url(#dailyGrad)" 
        fillOpacity="0.15" 
        stroke="url(#dailyGrad)" 
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
      
      {/* Geometric 'D' Monogram */}
      <path 
        d="M10 9C10 8.44772 10.4477 8 11 8H16C19.866 8 23 11.134 23 15C23 18.866 19.866 22 16 22H11C10.4477 22 10 21.5523 10 21V9Z" 
        stroke="url(#dailyGrad)" 
        strokeWidth="2.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Internal Horizon / Pulse Wave Segment */}
      <path 
        d="M14 15H17" 
        stroke="url(#dailyAccent)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />

      {/* Live Intelligence Glow Dot */}
      <circle 
        cx="19" 
        cy="12" 
        r="1.5" 
        fill="var(--accent)" 
      />
    </svg>
  );
}
