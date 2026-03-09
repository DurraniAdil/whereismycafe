// src/hooks/useShare.ts
import { useState } from 'react';

export interface CafeShareData {
    cafeName: string;
    cafeArea: string;
    cafeId: string;
    heroImageUrl?: string;
    tagline?: string;
}

export function useShare() {
    const [copied, setCopied] = useState(false);
    const [sharing, setSharing] = useState(false);

    const share = async ({ cafeId }: CafeShareData) => {
        const wimc_url = `${window.location.origin}/cafes/${cafeId}`;
        const text = `hey check this cafe out ${wimc_url}`;

        setSharing(true);

        const copyTextToClipboard = async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "absolute";
                    textArea.style.left = "-999999px";
                    document.body.prepend(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                    } finally {
                        textArea.remove();
                    }
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            } catch (err) {
                console.warn('Fallback copy failed', err);
            }
        };

        try {
            // Mobile devices natively support navigator.share
            if (navigator.share && typeof navigator.share === 'function') {
                try {
                    await navigator.share({ text });
                } catch (err: any) {
                    // If the user didn't intentionally abort the share, fallback to copy
                    if (err.name !== 'AbortError' && !err.message?.includes('abort')) {
                        await copyTextToClipboard();
                    }
                }
            } else {
                // Desktop or browsers without native share, just copy link
                await copyTextToClipboard();
            }
        } catch (err: unknown) {
            console.warn('Share completely failed:', err);
        } finally {
            setSharing(false);
        }
    };

    return { share, copied, sharing };
}
