import React from 'react';
import { Wifi, Snowflake, Sun, Zap, Gamepad2, Car } from 'lucide-react';
import { cn } from '../lib/utils';

interface AmenityBadgeProps {
  type: 'wifi' | 'ac' | 'outdoorSeating' | 'powerOutlets' | 'boardGames' | 'parking';
  available: boolean;
}

const amenityConfig = {
  wifi: { icon: Wifi, label: 'Free WiFi' },
  ac: { icon: Snowflake, label: 'AC' },
  outdoorSeating: { icon: Sun, label: 'Outdoor' },
  powerOutlets: { icon: Zap, label: 'Power' },
  boardGames: { icon: Gamepad2, label: 'Games' },
  parking: { icon: Car, label: 'Parking' },
};

export const AmenityBadge: React.FC<AmenityBadgeProps> = ({ type, available }) => {
  const { icon: Icon, label } = amenityConfig[type];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-1.5',
        'rounded-2xl border w-[72px] h-[72px] text-center',
        'transition-all duration-200',
        available
          // ── available: logo blue fill, white content ──
          ? 'bg-[#0b4e9d] border-[#0b4e9d] shadow-[0_4px_14px_rgba(11,78,157,0.28)]'
          // ── unavailable: ghost / white ──
          : 'bg-white border-[#E0E5EF] text-[#C0C8C8]'
      )}
    >
      {/* Available: white pulse dot — Unavailable: faint blue dot */}
      <span
        className={cn(
          'absolute top-2 right-2 w-1.5 h-1.5 rounded-full',
          available ? 'bg-white/50' : 'bg-[#0b4e9d]/20'
        )}
      />

      <Icon
        className={cn('w-5 h-5', available ? 'text-white' : 'text-[#C0CAD8]')}
        strokeWidth={available ? 2 : 1.5}
      />

      <span
        className={cn(
          'text-[9.5px] font-bold leading-none uppercase tracking-wider',
          available ? 'text-white/85' : 'text-[#B8C4D4]'
        )}
      >
        {label}
      </span>

      {/* Unavailable: diagonal strike-through in logo blue */}
      {!available && (
        <span className="absolute inset-0 flex items-center justify-center
                         rounded-2xl pointer-events-none overflow-hidden">
          <span className="absolute w-[calc(100%-14px)] h-px rotate-[-38deg]
                           bg-[#0b4e9d]/18 rounded-full" />
        </span>
      )}
    </div>
  );
};
