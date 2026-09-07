import React from 'react';
import { getBrandLogoUrl } from '@/lib/brandLogos';

export default function BrandLogo({ name, className = "h-8 w-auto text-fb-bg-light/80 fill-current" }) {
  // Normalize brand name for matching
  const normalized = (name || '').toLowerCase().trim();

  // If a real verified PNG logo exists, use it directly!
  const realLogoUrl = getBrandLogoUrl(normalized);
  if (realLogoUrl) {
    return (
      <img
        src={realLogoUrl}
        alt={name || 'Brand Logo'}
        className="max-h-full max-w-full w-auto h-auto object-contain brightness-0 invert opacity-90 transition-all duration-300 pointer-events-none"
      />
    );
  }

  // Return stylized SVG path layouts for the top brands
  switch (normalized) {
    case "mcdonald's":
    case "mcdonalds":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 21c-1.1-3.6-2.5-7.5-4-10.5C6.5 13.5 5.1 17.4 4 21H1V3h3v13.5C5.5 13.5 7 9.5 8.5 6 10 9.5 11.5 13.5 13 16.5V3h3v18h-4z" />
          <path d="M23 21c-1.1-3.6-2.5-7.5-4-10.5-1.5 3-2.9 6.9-4 10.5h-3V3h3v13.5c1.5-3 3-7 4.5-10.5 1.5 3.5 3 7.5 4.5 10.5V3h3v18h-4z" className="hidden" />
          {/* Stylized M Golden Arches */}
          <path d="M2 20c2-5 4.5-11 7-16h2c2.5 5 5 11 7 16h-3.5c-1-3-2.5-7-3.5-10-1 3-2.5 7-3.5 10H2zm11 0c2-5 4.5-11 7-16h2c2.5 5 5 11 7 16h-3.5c-1-3-2.5-7-3.5-10-1 3-2.5 7-3.5 10H13z" />
        </svg>
      );
    case "carrefour":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Stylized Carrefour C logo with diamond visual */}
          <path d="M12 2L2 12l10 10 10-10L12 2zm-2 15c-2.8 0-5-2.2-5-5s2.2-5 5-5c1.2 0 2.3.4 3.1 1.1l-1.8 1.8c-.4-.3-.8-.5-1.3-.5-1.7 0-3 1.3-3 3s1.3 3 3 3c.5 0 .9-.2 1.3-.5l1.8 1.8c-.8.7-1.9 1.1-3.1 1.1z" />
          <path d="M17 12l3-3v6l-3-3z" />
        </svg>
      );
    case "spinneys":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Circular leafy logo */}
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 6c-2.2 0-4 1.8-4 4s4 8 4 8 4-5.8 4-8-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
      );
    case "othaim market":
    case "othaim":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Stylized dual leaf corporate symbol */}
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.5c0 .8-.7 1.5-1.5 1.5S10 17.3 10 16.5V11h3v5.5zm0-7.5h-3V7h3v2z" />
        </svg>
      );
    case "el ezaby pharmacy":
    case "el ezaby":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Caduceus / medical cross with snake */}
          <path d="M19 10.5h-5.5V5h-3v5.5H5v3h5.5V19h3v-5.5H19v-3z" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-3.3 0-6-2.7-6-6 0-1.8.8-3.4 2.1-4.5l1.4 1.4C8.6 11.6 8 12.7 8 14c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.3-.6-2.4-1.5-3.1l1.4-1.4c1.3 1.1 2.1 2.7 2.1 4.5 0 3.3-2.7 6-6 6z" />
        </svg>
      );
    case "papa john's":
    case "papa johns":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Arched banner badge */}
          <path d="M12 2C6.5 2 2 4.5 2 7.5S6.5 13 12 13s10-2.5 10-5.5S17.5 2 12 2zm0 8.5c-3.3 0-6-1.1-6-2.5s2.7-2.5 6-2.5 6 1.1 6 2.5-2.7 2.5-6 2.5z" />
          <path d="M4 14.5c0 2.5 3.6 4.5 8 4.5s8-2 8-4.5v-1h-2v1c0 1.2-2.7 2.5-6 2.5s-6-1.3-6-2.5v-1H4v1z" />
        </svg>
      );
    case "bazooka":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Modern bold typography badge with star */}
          <path d="M12 2L9 9H2l5.5 4.5L5 21l7-5 7 5-2.5-7.5L22 9h-7l-3-7zm0 4.5l1.5 3.5h3.5l-2.8 2.3 1 3.2-3.2-2-3.2 2 1-3.2-2.8-2.3H10.5L12 6.5z" />
        </svg>
      );
    case "burger republic":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Badge shield with burger layers inside */}
          <path d="M12 2C6.5 2 2 4 2 8.5v7c0 4.5 10 6.5 10 6.5s10-2 10-6.5v-7C22 4 17.5 2 12 2zm0 4.5c3.3 0 6 .9 6 2s-2.7 2-6 2-6-.9-6-2 2.7-2 6-2zm0 6.5c3.3 0 6 .5 6 1.5s-2.7 1.5-6 1.5-6-.5-6-1.5 2.7-1.5 6-1.5zm0 4.5c3.3 0 6 .5 6 1.5s-2.7 1.5-6 1.5-6-.5-6-1.5 2.7-1.5 6-1.5z" />
        </svg>
      );
    case "cilantro":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Sleek cup/leaf logo */}
          <path d="M2 21h20v-2H2v2zm14-11c0-3.3-2.7-6-6-6S4 6.7 4 10v4c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4v-4zm-2 4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-4c0-2.2 1.8-4 4-4s4 1.8 4 4v4zm4-3v2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2v2h2v2z" />
        </svg>
      );
    case "tbs":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* The Bakery Shop circular typography seal */}
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 8h5c1.1 0 2 .9 2 2s-.9 2-2 2h-2v4H9V8zm2 2v2h3v-2h-3z" />
          <path d="M13 12h2c1.1 0 2 .9 2 2s-.9 2-2 2h-4v-4h2z" className="hidden" />
          <text x="12" y="15" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor" fontFamily="monospace">TBS</text>
        </svg>
      );
    case "hunger station":
    case "hungerstation":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Delivery heart/bowl shape */}
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case "sultan":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Royal crown icon */}
          <path d="M2 19h20v2H2v-2zm3-3l-2-9 6 4 3-6 3 6 6-4-2 9H5z" />
        </svg>
      );
    case "shashlik":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Skewer / grill visual */}
          <path d="M11 2h2v3h-2V2zm0 5h2v6h-2V7zm0 8h2v7h-2v-7zm-4-4h10v2H7v-2z" />
        </svg>
      );
    case "al koftageya":
    case "alkoftageya":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Skewer and flame layout */}
          <path d="M12 2c1.1 0 2 .9 2 2v2c1.5 0 3 1.2 3 2.8 0 1-.5 1.8-1.2 2.4l1.2 5.8H7l1.2-5.8C7.5 10.6 7 9.8 7 8.8 7 7.2 8.5 6 10 6V4c0-1.1.9-2 2-2zm0 13c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" />
        </svg>
      );
    case "nine two nine":
    case "929":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          {/* Modern bold typography mark "929" */}
          <path d="M6 7c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v10H6V7zm10 0c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4h8V7zm-8 7v1h8v-1H8z" />
        </svg>
      );
    default:
      // Fallback custom text badge logo
      return (
        <div className="flex items-center space-x-1.5 px-3 py-1.5 border border-fb-bg-light/10 rounded bg-fb-teal-light/20">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-fb-bg-light/95 uppercase">{name}</span>
        </div>
      );
  }
}
