import { useState, useEffect } from 'react';

/**
 * CountdownTimer Component
 * A sleek countdown timer that shows hours:minutes:seconds
 * Only displays when there's less than 24 hours remaining
 */
export default function CountdownTimer({ closesDate }) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const closeTime = new Date(closesDate);

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = closeTime - now;

            if (difference <= 0) {
                return { expired: true, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                expired: false,
                hours: Math.floor(difference / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (newTimeLeft.expired) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [closesDate]);

    if (!timeLeft) return null;

    if (timeLeft.expired) {
        return (
            <div className="flex items-center gap-2 text-red-400">
                <span className="text-xs font-medium">Closed</span>
            </div>
        );
    }

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="flex items-center gap-1.5">
            <span className="text-xs text-red-400 font-medium">Closes in</span>
            <div className="flex items-center gap-0.5 font-mono text-sm font-bold text-white bg-red-500/20 px-2 py-0.5 rounded">
                <span>{pad(timeLeft.hours)}</span>
                <span className="text-red-400 animate-pulse">:</span>
                <span>{pad(timeLeft.minutes)}</span>
                <span className="text-red-400 animate-pulse">:</span>
                <span>{pad(timeLeft.seconds)}</span>
            </div>
        </div>
    );
}
