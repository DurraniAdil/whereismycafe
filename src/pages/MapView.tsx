import React, { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, ZoomControl, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import { getAllCafes } from '../lib/getCafes';
import { defaultIcon, activeIcon, blurredIcon } from '../lib/mapIcons';
import type { Cafe } from '../types/cafe';
import { X, MapPin, Star, Navigation, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

const CITY_CENTER: [number, number] = [19.8762, 75.3433];
const DEFAULT_ZOOM = 13;

// ── Haversine distance (km) ──────────────────────────────────
const haversine = (
    lat1: number, lon1: number,
    lat2: number, lon2: number
): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDist = (km: number) =>
    km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

// ── User location marker (blue pulsing dot) ──────────────────
const userDotIcon = L.divIcon({
    className: '',
    html: `<div style="
    width:18px; height:18px; border-radius:50%;
    background:#0b4e9d;
    border:3px solid white;
    box-shadow:0 0 0 4px rgba(11,78,157,0.25),
               0 2px 8px rgba(11,78,157,0.4);
  "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

// ── Helpers ──────────────────────────────────────────────────
const MapClickDismiss: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
    useMapEvents({ click: onDismiss });
    return null;
};

const MapFixer: React.FC = () => {
    const map = useMapEvents({});
    React.useEffect(() => {
        const t = setTimeout(() => map.invalidateSize(), 200);
        return () => clearTimeout(t);
    }, [map]);
    return null;
};

const MapController = forwardRef<L.Map>((_, ref) => {
    const map = useMap();
    useImperativeHandle(ref, () => map, [map]);
    return null;
});

// ── Preview card ─────────────────────────────────────────────
const CafePreviewCard: React.FC<{
    cafe: Cafe;
    distKm: number | null;
    onClose: () => void;
    onNavigate: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}> = ({ cafe, distKm, onClose, onNavigate, onNext, onPrev }) => {
    const priceLabel =
        cafe.priceForTwo <= 150 ? '₹' :
            cafe.priceForTwo <= 300 ? '₹₹' :
                cafe.priceForTwo <= 500 ? '₹₹₹' : '₹₹₹₹';

    return (
        <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-[1000]
                 px-4 pb-20 md:pb-6 pointer-events-none"
        >
            <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl
                      border border-[#EAEEE8] overflow-hidden max-w-sm mx-auto">

                {/* Image */}
                {cafe.photos?.[0] && (
                    <div className="relative h-36 overflow-hidden">
                        <img src={cafe.photos[0]} alt={cafe.name}
                            className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {onPrev && (
                            <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                                bg-black/40 backdrop-blur-sm shadow-md border border-white/20
                                flex items-center justify-center text-white hover:bg-black/60 transition-all z-10">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        {onNext && (
                            <button onClick={(e) => { e.stopPropagation(); onNext(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                                bg-black/40 backdrop-blur-sm shadow-md border border-white/20
                                flex items-center justify-center text-white hover:bg-black/60 transition-all z-10">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}

                        <button onClick={onClose}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full
                         bg-black/30 backdrop-blur-sm border border-white/20
                         flex items-center justify-center text-white
                         hover:bg-black/50 transition-all">
                            <X className="w-3.5 h-3.5" />
                        </button>

                        {cafe.rating > 0 && (
                            <div className="absolute bottom-3 left-3 flex items-center gap-1
                              bg-white/90 rounded-full px-2.5 py-1">
                                <Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" />
                                <span className="text-[12px] font-bold text-[#1E2020]"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    {cafe.rating.toFixed(1)}
                                </span>
                            </div>
                        )}

                        {/* Price + distance badges */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                            {distKm !== null && (
                                <div className="flex items-center gap-1 bg-[#0b4e9d]/90 backdrop-blur-sm
                                border border-white/20 rounded-full px-2.5 py-1">
                                    <Navigation className="w-2.5 h-2.5 text-white" />
                                    <span className="text-[11px] font-bold text-white">
                                        {formatDist(distKm)}
                                    </span>
                                </div>
                            )}
                            <div className="bg-black/30 backdrop-blur-sm border border-white/20
                              rounded-full px-2.5 py-1">
                                <span className="text-[12px] font-bold text-white"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    {priceLabel}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="px-4 py-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-bold italic text-[#1E2020] truncate leading-snug"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {cafe.name}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3 h-3 text-[#A8B0A0] flex-shrink-0" />
                            <span className="text-[11px] text-[#A8B0A0] font-semibold uppercase
                               tracking-wider truncate">
                                {cafe.area.replace(', Aurangabad', '')}
                            </span>
                        </div>

                        <div className="flex gap-1.5 mt-2 flex-wrap">
                            {cafe.vibes.slice(0, 2).map(v => (
                                <span key={v}
                                    className="text-[10px] font-bold text-[#5A6A58]
                             bg-[#EEF2E8] px-2.5 py-0.5 rounded-full
                             uppercase tracking-wider">
                                    {v}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button onClick={onNavigate}
                        className="flex-shrink-0 bg-[#1E2020] text-white text-xs font-bold
                       tracking-wider uppercase px-4 py-3 rounded-2xl
                       hover:bg-[#2E3030] active:scale-95 transition-all">
                        View
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ── Main ─────────────────────────────────────────────────────
export const MapView: React.FC = () => {
    const navigate = useNavigate();
    const [allCafes, setAllCafes] = useState<Cafe[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAllCafes()
            .then(setAllCafes)
            .catch(err => setError(err.message || 'Failed to load map data'));
    }, []);

    const mapRef = useRef<L.Map | null>(null);

    const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
    const [vibeFilter, setVibeFilter] = useState('');
    const [showZoneMenu, setShowZoneMenu] = useState(false);
    const [locating, setLocating] = useState(false);
    const [locError, setLocError] = useState<string | null>(null);
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [showNearbyMode, setShowNearbyMode] = useState(false);
    const [nearbyRadius, setNearbyRadius] = useState(2); // default 2km

    const filteredCafes = useMemo(() => {
        let cafes = allCafes.filter(c =>
            (!vibeFilter || c.vibes.includes(vibeFilter as any)) &&
            c.latitude && c.longitude
        );

        if (showNearbyMode && userPos) {
            cafes = cafes
                .map(c => ({
                    ...c,
                    distance: haversine(userPos[0], userPos[1], c.latitude!, c.longitude!)
                }))
                .filter(c => c.distance <= nearbyRadius)
                .sort((a, b) => a.distance - b.distance);
        }

        return cafes;
    }, [allCafes, vibeFilter, showNearbyMode, userPos, nearbyRadius]);

    const nearestThreeIds = useMemo(() => {
        if (!userPos || !showNearbyMode) return new Set<string>();
        return new Set(
            allCafes
                .filter(c => c.latitude && c.longitude)
                .map(c => ({
                    id: c.id,
                    distance: haversine(userPos[0], userPos[1], c.latitude!, c.longitude!)
                }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 3)
                .map(c => c.id)
        );
    }, [allCafes, userPos, showNearbyMode]);

    const uniqueZones = useMemo(() => {
        const zones = allCafes.map(c => c.zone).filter(Boolean) as string[];
        return Array.from(new Set(zones)).sort();
    }, [allCafes]);

    const handleZoneClick = (zone: string) => {
        const cafesInZone = filteredCafes.filter(c => c.zone === zone);
        if (cafesInZone.length > 0 && mapRef.current) {
            const avgLat = cafesInZone.reduce((sum, c) => sum + (c.latitude || 0), 0) / cafesInZone.length;
            const avgLon = cafesInZone.reduce((sum, c) => sum + (c.longitude || 0), 0) / cafesInZone.length;
            mapRef.current.flyTo([avgLat - 0.002, avgLon], 15, { animate: true, duration: 1.2 });
        }
    };

    // Distance from user to selected café (null if no user pos)
    const selectedDist = useMemo(() => {
        if (!userPos || !selectedCafe?.latitude || !selectedCafe?.longitude) return null;
        return haversine(userPos[0], userPos[1], selectedCafe.latitude, selectedCafe.longitude);
    }, [userPos, selectedCafe]);

    const handleCafeSelect = (cafe: Cafe) => {
        setSelectedCafe(cafe);
        if (mapRef.current && cafe.latitude && cafe.longitude) {
            const map = mapRef.current;
            const isMobile = window.innerWidth < 768;
            // Offset in pixels to push the marker above the preview card
            const pixelOffset = isMobile ? 160 : 100;

            // Convert the cafe's lat/lng to a pixel point, shift it up, then convert back
            const targetPoint = map.latLngToContainerPoint([cafe.latitude, cafe.longitude]);
            const offsetPoint = L.point(targetPoint.x, targetPoint.y + pixelOffset);
            const offsetLatLng = map.containerPointToLatLng(offsetPoint);

            map.panTo(offsetLatLng, { animate: true, duration: 0.4 });
        }
    };

    const flyToUser = () => {
        if (!navigator.geolocation) {
            setLocError('Geolocation not supported on this device.');
            return;
        }

        setLocating(true);
        setLocError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserPos(coords);
                mapRef.current?.flyTo(coords, 15, { animate: true, duration: 1.2 });
                setLocating(false);
            },
            (err) => {
                setLocating(false);
                if (err.code === err.PERMISSION_DENIED)
                    setLocError('Location access denied. Enable it in browser settings.');
                else if (err.code === err.POSITION_UNAVAILABLE)
                    setLocError('Could not determine your location.');
                else
                    setLocError('Location request timed out.');
            },
            { timeout: 8000, maximumAge: 30000 }
        );
    };

    const toggleNearbyMode = () => {
        if (!showNearbyMode) {
            if (!userPos) {
                flyToUser();
            }
            setShowNearbyMode(true);
        } else {
            setShowNearbyMode(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-[#F8F6F1]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="relative z-[1001] bg-[#1E2020] px-4 pt-4 pb-3
                      flex-shrink-0 border-b border-[#2A2A2A]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em]
                          text-[#6A7268] mb-0.5">
                            Dilli Door Nahin...
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-[22px] font-bold text-white leading-none tracking-tight"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                Explore
                            </h1>
                            <p className="text-[18px] font-normal italic text-[#6A7268] leading-none"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                the map.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    setShowZoneMenu(!showZoneMenu);
                                } else {
                                    navigate('/');
                                }
                            }}>
                            <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Menu"
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#3A3A3A]
                         hover:scale-105 transition-transform flex-shrink-0" />
                        </button>

                        <AnimatePresence>
                            {showZoneMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="absolute top-12 right-0 w-56 bg-[#1E2020] border border-[#2A2A2A] rounded-2xl shadow-2xl py-2 z-[1002]"
                                >
                                    <button
                                        onClick={() => {
                                            mapRef.current?.flyTo(CITY_CENTER, DEFAULT_ZOOM, { animate: true, duration: 1.2 });
                                            setShowZoneMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-white hover:bg-[#2A2A2A] transition-colors uppercase tracking-wider border-b border-[#2A2A2A]/50">
                                        City Center
                                    </button>
                                    {uniqueZones.map(zone => (
                                        <button
                                            key={zone}
                                            onClick={() => {
                                                handleZoneClick(zone);
                                                setShowZoneMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#A8B0A0] hover:text-white hover:bg-[#2A2A2A] transition-colors uppercase tracking-wider">
                                            {zone}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Zone selector (Desktop only) */}
                <div className="hidden md:flex justify-center flex-wrap gap-2.5 mt-4 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`
                        .flex.justify-center::-webkit-scrollbar { display: none; }
                    `}</style>
                    <button
                        onClick={() => mapRef.current?.flyTo(CITY_CENTER, DEFAULT_ZOOM, { animate: true, duration: 1.2 })}
                        className="whitespace-nowrap flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors
                                 bg-[#3A3A3A] text-white border border-[#4A4A4A] hover:bg-[#4A4A4A]">
                        City Center
                    </button>
                    {uniqueZones.map(zone => (
                        <button
                            key={zone}
                            onClick={() => handleZoneClick(zone)}
                            className="whitespace-nowrap flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors
                                     bg-[#2A2A2A] text-[#A8B0A0] border border-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white">
                            {zone}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Map ─────────────────────────────────────────────── */}
            <div className="flex-1 relative min-h-0 w-full z-0">
                <MapContainer
                    center={CITY_CENTER}
                    zoom={DEFAULT_ZOOM}
                    zoomControl={false}
                    className="w-full h-full"
                    style={{ height: '100%', width: '100%' }}
                >
                    <MapController ref={mapRef} />
                    <MapFixer />
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <ZoomControl position="topright" />
                    <MapClickDismiss onDismiss={() => setSelectedCafe(null)} />

                    {/* Café markers */}
                    {filteredCafes.map(cafe =>
                        cafe.latitude && cafe.longitude ? (
                            <Marker
                                key={cafe.id}
                                position={[cafe.latitude, cafe.longitude]}
                                icon={
                                    selectedCafe
                                        ? selectedCafe.id === cafe.id
                                            ? activeIcon
                                            : blurredIcon
                                        : nearestThreeIds.has(cafe.id)
                                            ? activeIcon // Highlight nearest 3
                                            : defaultIcon
                                }
                                eventHandlers={{ click: () => handleCafeSelect(cafe) }}
                            />
                        ) : null
                    )}

                    {/* Nearby radius circle */}
                    {showNearbyMode && userPos && (
                        <Circle
                            center={userPos}
                            radius={nearbyRadius * 1000}
                            pathOptions={{
                                color: '#0b4e9d',
                                fillColor: '#0b4e9d',
                                fillOpacity: 0.1,
                                weight: 2,
                                dashArray: '5, 10'
                            }}
                        />
                    )}

                    {/* User position — dot + accuracy ring */}
                    {userPos && (
                        <>
                            <Marker position={userPos} icon={userDotIcon} />
                            <Circle
                                center={userPos}
                                radius={120}
                                pathOptions={{
                                    color: '#0b4e9d',
                                    fillColor: '#0b4e9d',
                                    fillOpacity: 0.08,
                                    weight: 1.5,
                                    opacity: 0.35,
                                }}
                            />
                        </>
                    )}
                </MapContainer>

                {/* ── Control Buttons ─────────────────────────────── */}
                <div className="absolute bottom-28 md:bottom-6 right-4 z-[1000] flex flex-col-reverse items-center gap-3">

                    {/* Fly to User Button */}
                    <button
                        onClick={flyToUser}
                        disabled={locating}
                        title="Find my location"
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center
                          transition-all active:scale-95
                          shadow-[0_4px_16px_rgba(0,0,0,0.22)] border-2
                          ${locating
                                ? 'bg-white border-[#E8EBE4] text-[#C0C8B8] cursor-not-allowed'
                                : userPos
                                    ? 'bg-[#0b4e9d] border-[#0b4e9d] text-white shadow-[0_4px_16px_rgba(11,78,157,0.4)] hover:bg-[#0a3d7a]'
                                    : 'bg-white border-[#E0E5D8] text-[#1E2020] hover:border-[#0b4e9d]/40 hover:text-[#0b4e9d]'
                            }`}
                    >
                        <Navigation
                            className={`w-[18px] h-[18px] transition-transform
                            ${locating ? 'animate-pulse' : ''}
                            ${userPos && !locating ? '-rotate-12' : ''}`}
                        />
                    </button>

                    {/* Eye Mode + Vertical Slider */}
                    <div className="flex flex-col-reverse items-center gap-3">
                        {/* Eye Toggle Button */}
                        <button
                            onClick={toggleNearbyMode}
                            title="Search nearby"
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center
                            flex-shrink-0 transition-all active:scale-95
                            shadow-[0_4px_16px_rgba(0,0,0,0.22)] border-2
                            ${showNearbyMode
                                    ? 'bg-[#1E2020] border-[#1E2020] text-white'
                                    : 'bg-white border-[#E0E5D8] text-[#1E2020] hover:border-[#0b4e9d]/40'
                                }`}
                        >
                            {showNearbyMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>

                        {/* Vertical Radius Slider */}
                        <AnimatePresence>
                            {showNearbyMode && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="bg-white/95 backdrop-blur-md border-2 border-[#E0E5D8] rounded-2xl p-3 shadow-xl flex flex-col items-center gap-3"
                                >
                                    <span className="text-[10px] font-bold text-[#1E2020] uppercase tracking-wider whitespace-nowrap orientation-vertical"
                                        style={{ writingMode: 'vertical-lr', rotate: '180deg' }}>
                                        Radius: {nearbyRadius}km
                                    </span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="1"
                                        value={nearbyRadius}
                                        onChange={(e) => setNearbyRadius(parseInt(e.target.value))}
                                        className="h-24 w-1.5 bg-[#E8EBE4] rounded-lg cursor-pointer accent-[#0b4e9d]"
                                        style={{ WebkitAppearance: 'slider-vertical' } as any}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Error toast */}
                <AnimatePresence>
                    {locError && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            onAnimationComplete={() => {
                                setTimeout(() => setLocError(null), 4000);
                            }}
                            className="absolute bottom-20 md:bottom-6 left-4 right-20 z-[1000]
                         max-w-xs bg-[#1E2020] text-white text-[12px] font-semibold
                         px-4 py-3 rounded-2xl shadow-xl leading-snug"
                        >
                            {locError}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Preview card ──────────────────────────────────── */}
            <AnimatePresence>
                {selectedCafe && (
                    <CafePreviewCard
                        cafe={selectedCafe}
                        distKm={selectedDist}
                        onClose={() => setSelectedCafe(null)}
                        onNavigate={() => navigate(`/cafes/${selectedCafe.id}`)}
                        onNext={() => {
                            const idx = filteredCafes.findIndex(c => c.id === selectedCafe.id);
                            if (idx !== -1 && filteredCafes.length > 1) {
                                const nextIdx = (idx + 1) % filteredCafes.length;
                                handleCafeSelect(filteredCafes[nextIdx]);
                            }
                        }}
                        onPrev={() => {
                            const idx = filteredCafes.findIndex(c => c.id === selectedCafe.id);
                            if (idx !== -1 && filteredCafes.length > 1) {
                                const prevIdx = idx === 0 ? filteredCafes.length - 1 : idx - 1;
                                handleCafeSelect(filteredCafes[prevIdx]);
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
