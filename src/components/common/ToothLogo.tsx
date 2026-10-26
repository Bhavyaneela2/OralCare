import React from 'react';

interface ToothLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  lightText?: boolean;
}

export const ToothLogo: React.FC<ToothLogoProps> = ({
  className = '',
  size = 36,
  showText = true,
  lightText = false
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 shadow-md shadow-sky-500/20 text-white flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5 drop-shadow-sm"
        >
          {/* Aesthetic Modern Tooth Path */}
          <path d="M7 3C4.2 3 2 5.2 2 8c0 3.3 1.5 6.5 2.5 10 .8 2.8 2.5 4 4.5 4 1.8 0 2.5-1.5 3-3 .5 1.5 1.2 3 3 3 2 0 3.7-1.2 4.5-4 1-3.5 2.5-6.7 2.5-10 0-2.8-2.2-5-5-5-2.2 0-3.5 1.2-5 1.2S9.2 3 7 3z" />
          <path d="M9 10c.8.6 1.8 1 3 1s2.2-.4 3-1" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-base leading-tight">
            <span className={lightText ? 'text-white' : 'text-slate-900'}>ORALCARE</span>
            <span className="text-teal-500 font-semibold text-xs px-1.5 py-0.5 bg-teal-500/10 rounded-md border border-teal-500/20">
              DentalNLP-X
            </span>
          </div>
          <span className={`text-[10px] font-medium tracking-wide ${lightText ? 'text-slate-400' : 'text-slate-500'}`}>
            Smarter Dental Care. Healthier Smiles.
          </span>
        </div>
      )}
    </div>
  );
};
