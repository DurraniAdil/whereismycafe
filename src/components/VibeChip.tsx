import React from 'react';
import { cn } from '../lib/utils';

interface VibeChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

// Idle state — each vibe has its own subtle categorical tint
const IDLE: Record<string, string> = {
  Study: 'bg-[#EEF2E8] text-[#4A6741] border-[#D4DEC8] hover:border-[#4A6741]/40',
  Chill: 'bg-[#EEF0F8] text-[#4A5A82] border-[#C8CEEA] hover:border-[#4A5A82]/40',
  Date: 'bg-[#FCEEF0] text-[#9B3A4A] border-[#F0CDD2] hover:border-[#9B3A4A]/40',
  Party: 'bg-[#FEF4E8] text-[#8A5A1A] border-[#F0DFC0] hover:border-[#8A5A1A]/40',
  Work: 'bg-[#EAF0FB] text-[#0b4e9d] border-[#C8D8F0] hover:border-[#0b4e9d]/40',
  ALL: 'bg-[#F4F4F2] text-[#6A7268] border-[#E0E4DC] hover:border-[#6A7268]/40',
};

// Active state — brand blue for ALL + most vibes; categorical for Date/Party
const ACTIVE: Record<string, string> = {
  Study: 'bg-[#0b4e9d] text-white border-[#0b4e9d] shadow-[0_3px_10px_rgba(11,78,157,0.30)]',
  Chill: 'bg-[#EEF0F8] text-[#4A5A82] border-[#C8CEEA] hover:border-[#4A5A82]/40',
  Date: 'bg-[#C0392B] text-white border-[#C0392B] shadow-[0_3px_10px_rgba(192,57,43,0.30)]',
  Party: 'bg-[#D4A017] text-white border-[#D4A017] shadow-[0_3px_10px_rgba(212,160,23,0.30)]',
  Work: 'bg-[#0b4e9d] text-white border-[#0b4e9d] shadow-[0_3px_10px_rgba(11,78,157,0.30)]',
  ALL: 'bg-[#0b4e9d] text-white border-[#0b4e9d] shadow-[0_3px_10px_rgba(11,78,157,0.30)]',
};

export const VibeChip: React.FC<VibeChipProps> = ({
  label,
  isActive,
  onClick,
  className,
}) => {
  const key = Object.keys(IDLE).find(k => label.includes(k)) ?? 'ALL';
  const colors = isActive ? ACTIVE[key] : IDLE[key];

  return (
    <button
      onClick={onClick}
      className={cn(
        // base
        'inline-flex items-center px-3 py-1 rounded-full',
        'text-[11px] font-black uppercase tracking-[0.12em]',
        'border whitespace-nowrap select-none',
        'transition-all duration-200 active:scale-95 cursor-pointer',
        colors,
        className
      )}
    >
      {label}
    </button>
  );
};
