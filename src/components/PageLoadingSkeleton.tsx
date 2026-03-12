import React from 'react';
import { motion } from 'motion/react';

interface LoadingSkeletonProps {
  type?: 'home' | 'detail' | 'search' | 'vibes';
}

export const PageLoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'home' }) => {
  return (
    <div className="min-h-screen bg-[#F8F6F1] animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Shimmer effect wrapper */}
        <div className="space-y-8 animate-pulse">
          
          {/* Header Skeleton */}
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-10 w-48 bg-[#E8EDF8] rounded-2xl" />
              <div className="h-4 w-32 bg-[#E8EDF8]/60 rounded-lg" />
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E8EDF8]" />
          </div>

          {/* Type-Specific Skeletons */}
          {type === 'home' || type === 'search' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-4 h-[420px] shadow-sm flex flex-col gap-4">
                  <div className="w-full h-64 bg-[#F0F2EC] rounded-[2rem]" />
                  <div className="px-2 space-y-3">
                    <div className="h-6 w-2/3 bg-[#F0F2EC] rounded-lg" />
                    <div className="h-4 w-1/3 bg-[#F0F2EC] rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : type === 'detail' ? (
            <div className="space-y-6">
              <div className="h-[40vh] bg-[#E8EDF8] rounded-[3rem] w-full" />
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
                <div className="space-y-6">
                  <div className="h-8 w-2/3 bg-[#E8EDF8] rounded-xl" />
                  <div className="h-32 bg-[#E8EDF8]/40 rounded-3xl" />
                  <div className="h-64 bg-[#E8EDF8]/40 rounded-3xl" />
                </div>
                <div className="space-y-4">
                  <div className="h-48 bg-white rounded-3xl border border-[#EAEEE8]" />
                  <div className="h-64 bg-white rounded-3xl border border-[#EAEEE8]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
                <div className="h-64 bg-white rounded-[3rem] shadow-sm" />
                <div className="space-y-4">
                    <div className="h-8 w-1/3 bg-[#E8EDF8] rounded-xl" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-[#F0F2EC] rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Tailwind CSS for Shimmer Animation (if needed, though animate-pulse is built-in) */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .bg-shimmer {
          background: linear-gradient(90deg, #F0F2EC 25%, #E8EDF8 50%, #F0F2EC 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};
