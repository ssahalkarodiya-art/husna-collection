import React from 'react';

interface HusnaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const HusnaLogo: React.FC<HusnaLogoProps> = ({
  className = '',
  size = 44,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Medallion Emblem matching the uploaded sign */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
      >
        <defs>
          {/* Metallic Gold Gradients */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA73" />
            <stop offset="25%" stopColor="#F8E5B9" />
            <stop offset="50%" stopColor="#C99E52" />
            <stop offset="75%" stopColor="#E5C583" />
            <stop offset="100%" stopColor="#A87932" />
          </linearGradient>

          <linearGradient id="goldRim" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B3873B" />
            <stop offset="30%" stopColor="#F3DCAC" />
            <stop offset="60%" stopColor="#C89D51" />
            <stop offset="100%" stopColor="#ECCF97" />
          </linearGradient>

          <radialGradient id="discBackground" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#25221F" />
            <stop offset="60%" stopColor="#141311" />
            <stop offset="100%" stopColor="#0B0A09" />
          </radialGradient>

          {/* Paths for Circular Text */}
          {/* Top arc for "HUSNA" */}
          <path
            id="topTextPath"
            d="M 38 120 A 82 82 0 0 1 202 120"
            fill="none"
          />
          {/* Bottom arc for "ABAYA" */}
          <path
            id="bottomTextPath"
            d="M 204 120 A 84 84 0 0 1 36 120"
            fill="none"
          />
        </defs>

        {/* Outer Gold Rim */}
        <circle cx="120" cy="120" r="116" stroke="url(#goldRim)" strokeWidth="3" />

        {/* Black Disc Base */}
        <circle cx="120" cy="120" r="113" fill="url(#discBackground)" />

        {/* Inner Gold Thin Ring */}
        <circle cx="120" cy="120" r="105" stroke="url(#goldGradient)" strokeWidth="1.5" />

        {/* Inner Boundary Ring around Central Silhouette */}
        <circle cx="120" cy="120" r="72" stroke="url(#goldGradient)" strokeWidth="1.8" />

        {/* TOP CURVED TEXT: HUSNA */}
        <text
          fill="url(#goldGradient)"
          fontSize="22"
          fontFamily="'Playfair Display', serif"
          fontWeight="600"
          letterSpacing="0.28em"
        >
          <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
            HUSNA
          </textPath>
        </text>

        {/* BOTTOM CURVED TEXT: ABAYA */}
        <text
          fill="url(#goldGradient)"
          fontSize="21"
          fontFamily="'Playfair Display', serif"
          fontWeight="600"
          letterSpacing="0.28em"
        >
          <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
            ABAYA
          </textPath>
        </text>

        {/* CENTER SILHOUETTE: Woman in elegant hijab & abaya drape */}
        <g id="modest-silhouette" transform="translate(120, 120)">
          {/* Hijab Silhouette Outer Shape */}
          <path
            d="M -16 -46 
               C -24 -36, -30 -18, -32 4 
               C -33 16, -38 28, -44 38 
               C -41 38, -36 33, -33 26 
               C -30 38, -25 44, -14 45 
               C -4 46, 8 46, 18 43 
               C 28 39, 32 30, 36 18 
               C 38 7, 36 -12, 30 -28 
               C 25 -40, 14 -47, -2 -48 
               C -8 -48, -13 -47, -16 -46 Z"
            fill="#121110"
            stroke="url(#goldGradient)"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Gentle Face Profile / Modest Visor Opening */}
          <path
            d="M -9 -34 
               C -4 -38, 4 -38, 9 -32 
               C 13 -26, 12 -12, 7 -4 
               C 2 3, -7 4, -10 -2 
               C -13 -8, -13 -28, -9 -34 Z"
            fill="url(#goldGradient)"
            opacity="0.95"
          />

          {/* Elegant draped scarf fold lines */}
          <path
            d="M -9 -2 
               C -18 10, -23 24, -28 38"
            stroke="url(#goldGradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 6 -2 
               C 14 12, 19 26, 25 36"
            stroke="url(#goldGradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M -15 15 
               C -8 24, 4 25, 14 20"
            stroke="url(#goldGradient)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M -11 -34 
               C -18 -22, -19 -6, -21 12"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Accompanying Wordmark if requested */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif text-[20px] font-semibold text-[#171411] tracking-tight leading-none">
            HUSNA
          </span>
          <span className="text-[9px] font-semibold tracking-[0.25em] text-[#5c6149] uppercase mt-0.5">
            ABAYA &bull; ATELIER
          </span>
        </div>
      )}
    </div>
  );
};
