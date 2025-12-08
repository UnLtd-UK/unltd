/**
 * Application Rounds Utility
 * Processes rounds data from Directus with date formatting and status calculations
 */

/**
 * Format an ISO date string for display
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date like "1 October 2025"
 */
export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

/**
 * Format an ISO date string as short date
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date like "1 Oct 2025"
 */
export const formatShortDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Format date with time
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date like "1 Oct 2025 at 9:00 AM"
 */
export const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Calculate days between two dates
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {number} Number of days (can be negative)
 */
const daysBetween = (startDate, endDate) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((endDate - startDate) / msPerDay);
};

/**
 * Round timeline phases
 */
export const RoundPhase = {
    UPCOMING: 'upcoming',           // Before applications open
    OPEN: 'open',                   // Applications are being accepted
    CLOSED: 'closed',               // Applications closed, not yet in assessment
    ASSESSMENT: 'assessment',       // In assessment period
    AWAITING_RESULTS: 'awaiting-results', // Assessment done, waiting for results
    RESULTS: 'results',             // Results being sent out
    COMPLETED: 'completed'          // Everything finished
};

/**
 * Determine which phase a round is currently in
 * @param {Object} round - Round with date fields
 * @returns {string} Phase constant
 */
export const getRoundPhase = (round) => {
    const now = new Date();
    const opens = new Date(round.opensDate);
    const closes = new Date(round.closesDate);
    const assessmentStart = new Date(round.assessmentStart);
    const assessmentEnd = new Date(round.assessmentEnd);
    const resultsStart = new Date(round.resultsStart);
    const resultsEnd = new Date(round.resultsEnd);

    if (now < opens) {
        return RoundPhase.UPCOMING;
    }
    if (now >= opens && now <= closes) {
        return RoundPhase.OPEN;
    }
    if (now > closes && now < assessmentStart) {
        return RoundPhase.CLOSED;
    }
    if (now >= assessmentStart && now <= assessmentEnd) {
        return RoundPhase.ASSESSMENT;
    }
    if (now > assessmentEnd && now < resultsStart) {
        return RoundPhase.AWAITING_RESULTS;
    }
    if (now >= resultsStart && now <= resultsEnd) {
        return RoundPhase.RESULTS;
    }
    return RoundPhase.COMPLETED;
};

/**
 * Get human-readable status info for a round phase
 * @param {string} phase - Round phase
 * @param {Object} round - Round data for date context
 * @returns {Object} Status info with label, description, and styling
 */
export const getPhaseInfo = (phase, round) => {
    const phaseInfoMap = {
        [RoundPhase.UPCOMING]: {
            label: 'Upcoming',
            shortLabel: 'Opens Soon',
            description: `Applications open ${formatDate(round.opensDate)}`,
            badgeClass: 'bg-violet-100 text-violet-700 border-violet-200',
            indicatorClass: 'bg-violet-400',
            icon: 'fa-solid fa-calendar-clock'
        },
        [RoundPhase.OPEN]: {
            label: 'Open for Applications',
            shortLabel: 'Open',
            description: `Submit before ${formatDate(round.closesDate)}`,
            badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            indicatorClass: 'bg-emerald-500',
            icon: 'fa-solid fa-door-open'
        },
        [RoundPhase.CLOSED]: {
            label: 'Applications Closed',
            shortLabel: 'Closed',
            description: `Assessment begins ${formatDate(round.assessmentStart)}`,
            badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
            indicatorClass: 'bg-slate-400',
            icon: 'fa-solid fa-door-closed'
        },
        [RoundPhase.ASSESSMENT]: {
            label: 'In Assessment',
            shortLabel: 'Assessing',
            description: `Results from ${formatDate(round.resultsStart)}`,
            badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
            indicatorClass: 'bg-amber-500',
            icon: 'fa-solid fa-magnifying-glass-chart'
        },
        [RoundPhase.AWAITING_RESULTS]: {
            label: 'Awaiting Results',
            shortLabel: 'Pending',
            description: `Results from ${formatDate(round.resultsStart)}`,
            badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
            indicatorClass: 'bg-blue-500',
            icon: 'fa-solid fa-hourglass-half'
        },
        [RoundPhase.RESULTS]: {
            label: 'Sending Results',
            shortLabel: 'Results',
            description: `Notifications until ${formatDate(round.resultsEnd)}`,
            badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
            indicatorClass: 'bg-purple-500',
            icon: 'fa-solid fa-envelope-open-text'
        },
        [RoundPhase.COMPLETED]: {
            label: 'Completed',
            shortLabel: 'Done',
            description: 'This round has finished',
            badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
            indicatorClass: 'bg-slate-300',
            icon: 'fa-solid fa-circle-check'
        }
    };

    return phaseInfoMap[phase] || phaseInfoMap[RoundPhase.COMPLETED];
};

/**
 * Calculate timing information for the current/active round
 * @param {Object} round - Round data
 * @returns {Object} Timing calculations
 */
export const getRoundTiming = (round) => {
    const now = new Date();
    const opens = new Date(round.opensDate);
    const closes = new Date(round.closesDate);
    const assessmentStart = new Date(round.assessmentStart);
    const assessmentEnd = new Date(round.assessmentEnd);
    const resultsStart = new Date(round.resultsStart);
    const resultsEnd = new Date(round.resultsEnd);

    // Total duration of application window
    const totalApplicationDays = daysBetween(opens, closes);

    // Days elapsed since opening
    const daysElapsed = now >= opens ? daysBetween(opens, now) : 0;

    // Days remaining until close
    const daysRemaining = now <= closes ? daysBetween(now, closes) : 0;

    // Days until opening (if upcoming)
    const daysUntilOpen = now < opens ? daysBetween(now, opens) : 0;

    // Progress percentage through application window
    const progressPercentage = now >= opens && now <= closes
        ? Math.min(100, Math.max(0, Math.round((daysElapsed / totalApplicationDays) * 100)))
        : now > closes ? 100 : 0;

    // Assessment timing
    const totalAssessmentDays = daysBetween(assessmentStart, assessmentEnd);
    const assessmentDaysElapsed = now >= assessmentStart ? daysBetween(assessmentStart, now) : 0;
    const assessmentDaysRemaining = now <= assessmentEnd ? daysBetween(now, assessmentEnd) : 0;
    const daysUntilAssessment = now < assessmentStart ? daysBetween(now, assessmentStart) : 0;

    // Results timing
    const daysUntilResults = now < resultsStart ? daysBetween(now, resultsStart) : 0;
    const resultsDaysRemaining = now <= resultsEnd ? daysBetween(now, resultsEnd) : 0;

    return {
        // Application window
        totalApplicationDays,
        daysElapsed,
        daysRemaining,
        daysUntilOpen,
        progressPercentage,

        // Assessment window
        totalAssessmentDays,
        assessmentDaysElapsed,
        assessmentDaysRemaining,
        daysUntilAssessment,

        // Results
        daysUntilResults,
        resultsDaysRemaining,

        // Formatted strings for display
        formatted: {
            daysRemaining: daysRemaining === 1 ? '1 day left' : `${daysRemaining} days left`,
            daysElapsed: daysElapsed === 1 ? '1 day elapsed' : `${daysElapsed} days elapsed`,
            daysUntilOpen: daysUntilOpen === 1 ? 'Opens in 1 day' : `Opens in ${daysUntilOpen} days`,
            daysUntilResults: daysUntilResults === 1 ? 'Results in 1 day' : `Results in ${daysUntilResults} days`,
            applicationWindow: `${totalApplicationDays} day application window`,
            assessmentWindow: `${totalAssessmentDays} day assessment period`
        }
    };
};

/**
 * Get capacity status for a round
 * @param {number} percentage - Current capacity percentage
 * @returns {Object} Capacity status info
 */
export const getCapacityStatus = (percentage) => {
    if (percentage === 100) {
        return {
            status: 'full',
            label: 'Round Full',
            description: 'This round has reached capacity. Applications will be assessed in the next round.',
            badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
            indicatorClass: 'bg-slate-400',
            urgency: 'none'
        };
    }
    if (percentage >= 80) {
        return {
            status: 'almost-full',
            label: 'Almost Full',
            description: 'Very limited spots remaining. Apply now to be assessed in this round.',
            badgeClass: 'bg-red-100 text-red-700 border-red-200',
            indicatorClass: 'bg-red-500',
            urgency: 'high'
        };
    }
    if (percentage >= 60) {
        return {
            status: 'filling-up',
            label: 'Filling Up',
            description: 'Limited spots remaining. Apply soon to secure your place.',
            badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
            indicatorClass: 'bg-amber-500',
            urgency: 'medium'
        };
    }
    if (percentage >= 40) {
        return {
            status: 'moderate',
            label: 'Moderate Availability',
            description: 'Good availability. Plan your application.',
            badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            indicatorClass: 'bg-yellow-500',
            urgency: 'low'
        };
    }
    return {
        status: 'open',
        label: 'Accepting Applications',
        description: 'Plenty of spots available in this round.',
        badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        indicatorClass: 'bg-emerald-500',
        urgency: 'none'
    };
};

/**
 * Process a single round from Directus format
 * @param {Object} directusRound - Raw round data from Directus
 * @param {number} applicationLimit - Max applications per round (default 650)
 * @returns {Object} Processed round with all computed properties
 */
export const processRound = (directusRound, applicationLimit = 650) => {
    const round = {
        id: directusRound.id,
        opensDate: directusRound.opens,
        closesDate: directusRound.closes,
        assessmentStart: directusRound.assessment_starts,
        assessmentEnd: directusRound.assessment_ends,
        resultsStart: directusRound.results_start,
        resultsEnd: directusRound.results_end,
        applicationLimit: directusRound.capacity ?? applicationLimit,
        capacityPercentage: directusRound.capacity_status ?? 0,

        // Formatted dates
        dates: {
            opens: formatDate(directusRound.opens),
            opensShort: formatShortDate(directusRound.opens),
            closes: formatDate(directusRound.closes),
            closesShort: formatShortDate(directusRound.closes),
            assessmentStart: formatDate(directusRound.assessment_starts),
            assessmentStartShort: formatShortDate(directusRound.assessment_starts),
            assessmentEnd: formatDate(directusRound.assessment_ends),
            assessmentEndShort: formatShortDate(directusRound.assessment_ends),
            resultsStart: formatDate(directusRound.results_start),
            resultsStartShort: formatShortDate(directusRound.results_start),
            resultsEnd: formatDate(directusRound.results_end),
            resultsEndShort: formatShortDate(directusRound.results_end)
        }
    };

    // Add computed properties
    const phase = getRoundPhase(round);
    const phaseInfo = getPhaseInfo(phase, round);
    const timing = getRoundTiming(round);
    const capacityStatus = getCapacityStatus(round.capacityPercentage);

    return {
        ...round,
        phase,
        phaseInfo,
        timing,
        capacityStatus,

        // Convenience booleans
        isUpcoming: phase === RoundPhase.UPCOMING,
        isOpen: phase === RoundPhase.OPEN,
        isClosed: phase === RoundPhase.CLOSED,
        isInAssessment: phase === RoundPhase.ASSESSMENT,
        isAwaitingResults: phase === RoundPhase.AWAITING_RESULTS,
        isInResults: phase === RoundPhase.RESULTS,
        isCompleted: phase === RoundPhase.COMPLETED,

        // Accepting applications?
        isAcceptingApplications: phase === RoundPhase.OPEN && round.capacityPercentage < 100,

        // Past, present, future classification
        isPast: phase === RoundPhase.COMPLETED,
        isPresent: [RoundPhase.OPEN, RoundPhase.CLOSED, RoundPhase.ASSESSMENT, RoundPhase.AWAITING_RESULTS, RoundPhase.RESULTS].includes(phase),
        isFuture: phase === RoundPhase.UPCOMING
    };
};

/**
 * Process all rounds and categorize them
 * @param {Array} directusRounds - Array of rounds from Directus
 * @param {number} applicationLimit - Max applications per round
 * @returns {Object} Processed and categorized rounds
 */
export const processAllRounds = (directusRounds, applicationLimit = 650) => {
    const processed = directusRounds.map(r => processRound(r, applicationLimit));

    // Sort by opens date
    processed.sort((a, b) => new Date(a.opensDate) - new Date(b.opensDate));

    // Categorize
    const past = processed.filter(r => r.isPast);
    const present = processed.filter(r => r.isPresent);
    const future = processed.filter(r => r.isFuture);

    // Find the current active round (first one that's open or most relevant)
    const currentRound = processed.find(r => r.isOpen)
        || processed.find(r => r.isPresent)
        || processed.find(r => r.isFuture)
        || processed[processed.length - 1];

    // Find next round accepting applications
    const nextOpenRound = processed.find(r => r.isFuture)
        || processed.find(r => r.isOpen && r.capacityPercentage < 100);

    return {
        all: processed,
        past,
        present,
        future,
        currentRound,
        nextOpenRound,

        // Summary counts
        counts: {
            total: processed.length,
            past: past.length,
            present: present.length,
            future: future.length
        }
    };
};

export default {
    formatDate,
    formatShortDate,
    formatDateTime,
    RoundPhase,
    getRoundPhase,
    getPhaseInfo,
    getRoundTiming,
    getCapacityStatus,
    processRound,
    processAllRounds
};
