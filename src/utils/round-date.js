/**
 * Round date parsing (timezone-safe)
 *
 * Directus returns naive datetime strings with no timezone designator
 * (e.g. "2026-07-01T10:00:00"). `new Date(str)` parses these in the *runtime*
 * timezone, which differs between local dev (Europe/London, BST) and Cloudflare
 * Workers (UTC). That makes round open/close comparisons an hour off in
 * production during BST — a round that has opened locally still looks closed.
 *
 * Round times are always entered as UK local time, so we interpret these
 * strings as Europe/London wall-clock time and return the correct absolute
 * instant regardless of where the code runs.
 */

/**
 * Get the Europe/London UTC offset (in ms) for a given instant, accounting
 * for BST/GMT.
 * @param {Date} date
 * @returns {number}
 */
const londonOffsetMs = (date) => {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(date);

    const map = {};
    for (const part of parts) map[part.type] = part.value;

    const asUtc = Date.UTC(
        Number(map.year),
        Number(map.month) - 1,
        Number(map.day),
        Number(map.hour),
        Number(map.minute),
        Number(map.second),
    );

    return asUtc - date.getTime();
};

/**
 * Parse a Directus datetime string as Europe/London wall-clock time.
 * @param {string} isoString - Datetime string from Directus
 * @returns {Date} Correct absolute instant
 */
export const parseRoundDate = (isoString) => {
    if (!isoString) return new Date(NaN);

    // Already carries an explicit timezone (Z or ±hh:mm) — trust it as-is.
    if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(isoString)) {
        return new Date(isoString);
    }

    // Interpret the wall-clock components as UTC first…
    const asUtc = new Date(`${isoString}Z`);
    if (isNaN(asUtc.getTime())) return new Date(isoString);

    // …then shift by the Europe/London offset at that instant.
    return new Date(asUtc.getTime() - londonOffsetMs(asUtc));
};

export default { parseRoundDate };
