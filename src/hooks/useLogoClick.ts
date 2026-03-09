import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useLogoClick() {
    const clickCount = useRef(0);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navigate = useNavigate();

    const handleLogoClick = useCallback(() => {
        clickCount.current += 1;
        if (timer.current) clearTimeout(timer.current);
        if (clickCount.current >= 5) {
            clickCount.current = 0;
            navigate('/wimc-secret');
            return;
        }
        timer.current = setTimeout(() => {
            clickCount.current = 0;
        }, 1500);
    }, [navigate]);

    return handleLogoClick;
}
