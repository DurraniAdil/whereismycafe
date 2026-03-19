import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import CircularGallery from './CircularGallery';

interface PhotoGalleryProps {
  photos: string[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [mode, setMode] = useState<'grid' | 'immersive'>('grid');

  /* ─── convert photos → circular gallery format ─── */
  const galleryItems = useMemo(
    () =>
      photos.map((photo, i) => ({
        image: photo,
        text: `#${i + 1}`,
      })),
    [photos]
  );

  return (
    <div className="space-y-4">

      {/* ─── Toggle UI ─── */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-600">
          Gallery
        </p>

        <button
          onClick={() =>
            setMode((prev) => (prev === 'grid' ? 'immersive' : 'grid'))
          }
          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          {mode === 'grid' ? '✨ immersive' : '▦ grid'}
        </button>
      </div>

      {/* ─── GRID MODE (your original) ─── */}
      {mode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-xl cursor-pointer hover:opacity-90 transition-opacity ${index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* ─── IMMERSIVE MODE (NEW 🔥) ─── */}
      {mode === 'immersive' && (
        <div className="h-[500px] relative rounded-2xl overflow-hidden">
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.08}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>
      )}

      {/* ─── LIGHTBOX ─── */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <X className="w-8 h-8" />
          </button>

          <img
            src={selectedPhoto}
            alt="Full screen view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};