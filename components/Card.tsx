
import React from 'react';

interface CardProps {
  label: string;
  icon: string;
  onClick: () => void;
  color: string;
}

const Card: React.FC<CardProps> = ({ label, icon, onClick, color }) => {
  const cardStyle = {
    backgroundColor: color,
    '--tw-ring-color': color,
    color: 'white',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
