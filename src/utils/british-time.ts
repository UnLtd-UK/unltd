/**
 * Returns the current time expressed as British local time (Europe/London, accounting for BST/GMT)
 * formatted as an ISO-like string with a Z suffix — matching the convention used by Directus
 * for storing `date_time` fields (British local time stored as if it were UTC).
 *
 * Use `now()` in milliseconds to compare against `new Date(post.date_time).getTime()`,
 * ensuring both values use the same "British local time as UTC" convention.
 */
export function getBritishFakeUTCNow(): number {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const p: Record<string, string> = {};
    parts.forEach(part => { p[part.type] = part.value; });

    // Construct an ISO string using British local time components but with Z suffix,
    // matching how Directus stores date_time values.
    const fakeUTC = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}.000Z`;
    return new Date(fakeUTC).getTime();
}

/**
 * Returns the full British time object used by the posts data loader for API filtering.
 */
export function getBritishTime() {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const p: Record<string, string> = {};
    parts.forEach(part => { p[part.type] = part.value; });

    const britishDate = `${p.year}-${p.month}-${p.day}`;
    const britishCurrentTime = `${britishDate}T${p.hour}:${p.minute}:${p.second}.000Z`;
    const britishEndOfDay = `${britishDate}T23:59:59.999Z`;

    return {
        now,
        isoDate: britishDate,
        endOfDay: britishEndOfDay,
        currentTime: britishCurrentTime,
        formatted: `${britishDate} ${p.hour}:${p.minute}:${p.second}`,
    };
}
