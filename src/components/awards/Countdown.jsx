import { useState, useEffect } from 'react';

/**
 * Countdown Component
 * Shows a live countdown timer (hours, minutes, seconds) when closing date is today
 * Falls back to showing days remaining if not closing today
 */
export default function Countdown({ closesDate, daysRemaining }) {
    const [timeLeft, setTimeLeft] = useState(null);
    const [isClosingToday, setIsClosingToday] = useState(false);

    useEffect(() => {
        const closeTime = new Date(closesDate);

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = closeTime - now;

            // Check if closing is today
            const today = new Date();
            const isToday = closeTime.toDateString() === today.toDateString();
            setIsClosingToday(isToday && difference > 0);

            if (difference <= 0) {
                return { hours: 0, minutes: 0, seconds: 0, expired: true };
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { hours, minutes, seconds, expired: false };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second if closing today
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.expired) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [closesDate]);

    // Show loading state initially
    if (timeLeft === null) {
        return (
            <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <i className="fa-regular fa-clock text-violet-300" />
                    <span className="text-sm text-violet-300">
                        <strong className="text-white">{daysRemaining}</strong>{" "}
                        {daysRemaining === 1 ? "day" : "days"} left to apply
                    </span>
                </div>
            </div>
        );
    }

    // If expired
    if (timeLeft.expired) {
        return (
            <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-circle-xmark text-red-400" />
                    <span className="text-sm text-red-300 font-semibold">
                        Applications closed
                    </span>
                </div>
            </div>
        );
    }

    // If closing today, show countdown
    if (isClosingToday) {
        const padZero = (num) => String(num).padStart(2, '0');

        return (
            <div className="pt-2 border-t border-white/10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-hourglass-half text-red-400 animate-pulse" />
                        <span className="text-sm text-red-300 font-semibold">
                            Closing today!
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-1 bg-red-500/20 rounded-lg p-3">
                        <div className="text-center">
                            <span className="text-2xl font-bold text-white font-mono">
                                {padZero(timeLeft.hours)}
                            </span>
                            <p className="text-xs text-red-300 uppercase">hrs</p>
                        </div>
                        <span className="text-2xl font-bold text-red-400 -mt-4">:</span>
                        <div className="text-center">
                            <span className="text-2xl font-bold text-white font-mono">
                                {padZero(timeLeft.minutes)}
                            </span>
                            <p className="text-xs text-red-300 uppercase">min</p>
                        </div>
                        <span className="text-2xl font-bold text-red-400 -mt-4">:</span>
                        <div className="text-center">
                            <span className="text-2xl font-bold text-white font-mono">
                                {padZero(timeLeft.seconds)}
                            </span>
                            <p className="text-xs text-red-300 uppercase">sec</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default: show days remaining
    return (
        <div className="pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
                <i className="fa-regular fa-clock text-violet-300" />
                <span className="text-sm text-violet-300">
                    <strong className="text-white">{daysRemaining}</strong>{" "}
                    {daysRemaining === 1 ? "day" : "days"} left to apply
                </span>
            </div>
        </div>
    );
}
