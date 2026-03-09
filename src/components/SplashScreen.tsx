import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const finishLoading = () => {
        if (!isVisible) return;
        setIsVisible(false);
        setTimeout(onComplete, 500);
    };

    useEffect(() => {
        const fallbackTimer = setTimeout(finishLoading, 3000);
        return () => clearTimeout(fallbackTimer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed inset-0 z-[100] bg-[#FFFFFF] flex items-center justify-center overflow-hidden"
                >
                    <video
                        ref={videoRef}
                        src={`${import.meta.env.BASE_URL}media/loading-screen.mp4`}
                        autoPlay
                        muted
                        playsInline
                        onEnded={finishLoading}
                        onError={finishLoading}
                        className="w-auto h-auto max-w-full max-h-full object-contain"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
