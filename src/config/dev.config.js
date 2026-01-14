/**
 * Development Configuration
 * 
 * Date Override via Environment Variable
 * 
 * To simulate a specific date/time, add to your .env file:
 *   DEV_DATETIME=2026-03-15T10:00:00
 * 
 * Leave unset or empty to use the real current date.
 */

/**
 * Get the current date for the application
 * In development, this can be overridden using DEV_DATETIME environment variable.
 * In production, this always returns the real current date.
 * 
 * @returns {Date} The current date (or simulated date if DEV_DATETIME is set)
 */
export const getCurrentDate = () => {
    const devDateString = import.meta.env.DEV_DATETIME;

    if (devDateString) {
        const devDate = new Date(devDateString);
        if (!isNaN(devDate.getTime())) {
            return devDate;
        }
        console.warn(`[dev.config] Invalid DEV_DATETIME: "${devDateString}". Using real date.`);
    }
    return new Date();
};

/**
 * Get the DEV_DATETIME string (for passing to client components)
 * @returns {string | undefined} The dev datetime string or undefined
 */
export const getDevDateTimeString = () => {
    return import.meta.env.DEV_DATETIME;
};

/**
 * Check if we're using a simulated date
 * @returns {boolean} True if using a dev override date
 */
export const isUsingDevDate = () => {
    const devDateString = import.meta.env.DEV_DATETIME;
    return devDateString && !isNaN(new Date(devDateString).getTime());
};

/**
 * Get formatted dev datetime info for display in dev tools
 * @returns {Object|null} Dev datetime info or null if not using dev datetime
 */
export const getDevDateInfo = () => {
    if (!isUsingDevDate()) return null;

    const devDate = new Date(import.meta.env.DEV_DATETIME);
    const realDate = new Date();

    // Calculate offset in milliseconds
    const offsetMs = devDate - realDate;
    const offsetDays = Math.floor(Math.abs(offsetMs) / (1000 * 60 * 60 * 24));
    const offsetHours = Math.floor((Math.abs(offsetMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const offsetMinutes = Math.floor((Math.abs(offsetMs) % (1000 * 60 * 60)) / (1000 * 60));
    const offsetSeconds = Math.floor((Math.abs(offsetMs) % (1000 * 60)) / 1000);
    const sign = offsetMs >= 0 ? '+' : '-';

    // Build offset string
    let offsetString = sign;
    if (offsetDays > 0) {
        offsetString += `${offsetDays}d `;
    }
    if (offsetHours > 0 || offsetDays > 0) {
        offsetString += `${offsetHours}h `;
    }
    if (offsetMinutes > 0 || offsetHours > 0 || offsetDays > 0) {
        offsetString += `${offsetMinutes}m `;
    }
    offsetString += `${offsetSeconds}s`;

    return {
        simulatedDateTime: devDate.toLocaleString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        realDateTime: realDate.toLocaleString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        offset: offsetString.trim()
    };
};

export default {
    getCurrentDate,
    getDevDateTimeString,
    isUsingDevDate,
    getDevDateInfo
};
