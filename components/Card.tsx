
import React from 'react';

interface CardProps {
  label: string;
  icon: string;
  onClick: () => void;
  color: string;
}

// Determine whether white or near-black text yields sufficient WCAG contrast
// (>= 4.5:1) against a given background color. CSS text-shadow is NOT
// recognized by contrast-checking tools (axe/Lighthouse) or by real users
// with low vision, so we can't rely on it - the text color itself must have
// adequate contrast against the solid background color.
const getAccessibleTextColor = (bgColor: string): string => {
  const hex = bgColor.replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  // Relative luminance (WCAG formula)
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  // Contrast ratio of luminance L against white (1.0) and black (0.0):
  const contrastWithWhite = (1.05) / (luminance + 0.05);
  const contrastWithBlack = (luminance + 0.05) / 0.05;
  // Prefer white text unless black text gives meaningfully better contrast
  // and white fails the 4.5:1 minimum.
  return contrastWithWhite >= 4.5 || contrastWithWhite >= contrastWithBlack ? '#ffffff' : '#0f172a';
};

const Card: React.FC<CardProps> = ({ label, icon, onClick, color }) => {
  const textColor = getAccessibleTextColor(color);
  const isDarkText = textColor === '#0f172a';
  const cardStyle = {
    backgroundColor: color,
    '--tw-ring-color': color,
    color: textColor,
    // Shadow direction flips for dark-on-light text so it still reads as a
    // subtle depth cue rather than muddying contrast further.
    textShadow: isDarkText ? '0 1px 1px rgba(255,255,255,0.5)' : '0 1px 2px rgba(0,0,0,0.3)',
    borderColor: isDarkText ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)',
    borderWidth: '1px',
  } as React.CSSProperties;

  // Dynamically adjust font size based on icon length to fit text-based icons like "100k"
  const getIconSizeClass = (text: string) => {
    if (text.length <= 2) return 'text-3xl sm:text-4xl'; // Slightly smaller base icon
    if (text.length <= 3) return 'text-2xl sm:text-3xl';
    return 'text-xl sm:text-2xl';
  };

  return (
    <button
      onClick={onClick}
      // Removed aspect-square to allow cards to fit vertically better
      // Added h-full to ensure they fill the grid cell vertically
      // Added min-h to ensure touch target size
      className="flex flex-col items-center justify-center p-2 rounded-xl shadow-md hover:shadow-xl focus:outline-none focus:ring-4 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 w-full h-full min-h-[6rem]"
      style={cardStyle}
    >
      <div 
        className={`${getIconSizeClass(icon)} mb-1 filter drop-shadow-sm select-none leading-normal font-bold`} 
        role="img" 
        aria-label={label}
      >
        {icon}
      </div>
      <span className="text-xs sm:text-sm font-bold text-center break-normal leading-tight w-full line-clamp-3">
        {label}
      </span>
    </button>
  );
};

export default Card;
