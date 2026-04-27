import React from "react";

export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ashoka Chakra - Blue (#2563EB) */}
      <circle cx="18" cy="18" r="14" stroke="#2563EB" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2" fill="#2563EB" />
      {/* 24 Spokes */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="18"
            y1="18"
            x2={18 + 14 * Math.cos(angle)}
            y2={18 + 14 * Math.sin(angle)}
            stroke="#2563EB"
            strokeWidth="0.7"
          />
        );
      })}
      {/* Pulse Line - Amber (#F59E0B) */}
      <path
        d="M6 18H12L15 14L21 22L24 18H30"
        stroke="#F59E0B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 2px rgba(245, 158, 11, 0.4))" }}
      />
    </svg>
  );
}
