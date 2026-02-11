/**
 * Application Rounds Utility
 * Processes rounds data from Directus with date formatting and status calculations
 */

import { getCurrentDate } from '@config/dev.config.js';

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
    INTERVIEW: 'interview',         // In interview period
    AWAITING_RESULTS: 'awaiting-results', // Interviews done, waiting for results
    RESULTS: 'results',             // Results being sent out
    COMPLETED: 'completed'          // Everything finished
};

/**
 * Determine which phase a round is currently in
 * @param {Object} round - Round with date fields
 * @returns {string} Phase constant
 */
export const getRoundPhase = (round) => {
    const now = getCurrentDate();
    const opens = new Date(round.opensDate);
    const closes = new Date(round.closesDate);
    const assessmentStart = new Date(round.assessmentStart);
    const assessmentEnd = new Date(round.assessmentEnd);
    const interviewStart = round.interviewStart ? new Date(round.interviewStart) : null;
    const interviewEnd = round.interviewEnd ? new Date(round.interviewEnd) : null;
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
    // Interview phase (only if interview dates exist)
    if (interviewStart && interviewEnd) {
        if (now > assessmentEnd && now < interviewStart) {
            return RoundPhase.AWAITING_RESULTS; // Gap between assessment and interview
        }
        if (now >= interviewStart && now <= interviewEnd) {
            return RoundPhase.INTERVIEW;
        }
        if (now > interviewEnd && now < resultsStart) {
            return RoundPhase.AWAITING_RESULTS;
        }
    } else {
        // No interview dates — original flow
        if (now > assessmentEnd && now < resultsStart) {
            return RoundPhase.AWAITING_RESULTS;
        }
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
            description: round.interviewStart
                ? `Interviews from ${formatDate(round.interviewStart)}`
                : `Results from ${formatDate(round.resultsStart)}`,
            badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
            indicatorClass: 'bg-amber-500',
            icon: 'fa-solid fa-magnifying-glass-chart'
        },
        [RoundPhase.INTERVIEW]: {
            label: 'Interviewing',
            shortLabel: 'Interviews',
            description: `Results from ${formatDate(round.resultsStart)}`,
            badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            indicatorClass: 'bg-yellow-500',
            icon: 'fa-solid fa-comments'
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
    const now = getCurrentDate();
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

    // Interview timing (if dates exist)
    const interviewStart = round.interviewStart ? new Date(round.interviewStart) : null;
    const interviewEnd = round.interviewEnd ? new Date(round.interviewEnd) : null;
    const totalInterviewDays = interviewStart && interviewEnd ? daysBetween(interviewStart, interviewEnd) : 0;
    const interviewDaysRemaining = interviewEnd && now <= interviewEnd ? daysBetween(now, interviewEnd) : 0;
    const daysUntilInterview = interviewStart && now < interviewStart ? daysBetween(now, interviewStart) : 0;

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

        // Interview window
        totalInterviewDays,
        interviewDaysRemaining,
        daysUntilInterview,

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
    // Check if capacity is enabled for this round
    // Capacity is disabled when both capacity and capacity_status are 0/null/undefined
    // We treat null, undefined, and 0 as equivalent for this check
    const capacityValue = directusRound.capacity ?? 0;
    const capacityStatusValue = directusRound.capacity_status ?? 0;
    const hasCapacity = !(capacityValue === 0 && capacityStatusValue === 0);

    const round = {
        id: directusRound.id,
        opensDate: directusRound.opens,
        closesDate: directusRound.closes,
        assessmentStart: directusRound.assessment_starts,
        assessmentEnd: directusRound.assessment_ends,
        interviewStart: directusRound.interview_starts ?? null,
        interviewEnd: directusRound.interview_ends ?? null,
        resultsStart: directusRound.results_start,
        resultsEnd: directusRound.results_end,
        applicationLimit: directusRound.capacity ?? applicationLimit,
        capacityPercentage: directusRound.capacity_status ?? 0,
        hasCapacity,

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
            interviewStart: directusRound.interview_starts ? formatDate(directusRound.interview_starts) : null,
            interviewStartShort: directusRound.interview_starts ? formatShortDate(directusRound.interview_starts) : null,
            interviewEnd: directusRound.interview_ends ? formatDate(directusRound.interview_ends) : null,
            interviewEndShort: directusRound.interview_ends ? formatShortDate(directusRound.interview_ends) : null,
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
        isInInterview: phase === RoundPhase.INTERVIEW,
        isAwaitingResults: phase === RoundPhase.AWAITING_RESULTS,
        isInResults: phase === RoundPhase.RESULTS,
        isCompleted: phase === RoundPhase.COMPLETED,

        // Accepting applications?
        // Only check capacity if capacity tracking is enabled for this round
        isAcceptingApplications: phase === RoundPhase.OPEN && (!round.hasCapacity || round.capacityPercentage < 100),

        // Past, present, future classification
        isPast: phase === RoundPhase.COMPLETED,
        isPresent: [RoundPhase.OPEN, RoundPhase.CLOSED, RoundPhase.ASSESSMENT, RoundPhase.INTERVIEW, RoundPhase.AWAITING_RESULTS, RoundPhase.RESULTS].includes(phase),
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
    // Handle empty rounds
    if (!directusRounds || directusRounds.length === 0) {
        return {
            all: [],
            past: [],
            present: [],
            future: [],
            currentRound: null,
            nextOpenRound: null,
            hasNoRounds: true,
            counts: { total: 0, past: 0, present: 0, future: 0 }
        };
    }

    const processed = directusRounds.map(r => processRound(r, applicationLimit));

    // Sort by opens date
    processed.sort((a, b) => new Date(a.opensDate) - new Date(b.opensDate));

    // Categorize
    const past = processed.filter(r => r.isPast);
    const present = processed.filter(r => r.isPresent);
    const future = processed.filter(r => r.isFuture);

    // Priority logic for current round:
    // 1. First: Any currently OPEN round (accepting applications)
    // 2. Second: Any round currently in progress (present but not accepting - e.g., in assessment)
    // 3. Third: Next upcoming/future round
    // 4. Fourth: Most recent past round (last one by close date)
    const openRound = processed.find(r => r.isOpen);
    const presentRound = processed.find(r => r.isPresent);
    const futureRound = future[0]; // First upcoming round (sorted by date)
    const lastPastRound = past.length > 0 ? past[past.length - 1] : null;

    // Determine current round based on priority
    let currentRound = openRound || presentRound || futureRound || lastPastRound || null;

    // Next open round: the first future round (if any)
    // Only relevant if current round is not open or is at capacity
    const nextOpenRound = futureRound || null;

    // Determine if we have no future rounds left
    const hasNoFutureRounds = future.length === 0 && !openRound;

    return {
        all: processed,
        past,
        present,
        future,
        currentRound,
        nextOpenRound,
        hasNoRounds: false,
        hasNoFutureRounds,

        // Summary counts
        counts: {
            total: processed.length,
            past: past.length,
            present: present.length,
            future: future.length
        }
    };
};

/**
 * Get the round name based on results months (e.g., "March 2026" or "March–April 2026")
 * @param {Object} round - Processed round object
 * @returns {string} Human-readable round name
 */
export const getRoundName = (round) => {
    if (!round?.resultsStart || !round?.resultsEnd) return 'Application Round';

    const resultsStart = new Date(round.resultsStart);
    const resultsEnd = new Date(round.resultsEnd);
    const startMonth = resultsStart.toLocaleDateString('en-GB', { month: 'long' });
    const endMonth = resultsEnd.toLocaleDateString('en-GB', { month: 'long' });
    const year = resultsStart.getFullYear();

    if (startMonth === endMonth) {
        return `${startMonth} ${year}`;
    }
    return `${startMonth}–${endMonth} ${year}`;
};

/**
 * Check if a round is closing today
 * @param {Object} round - Processed round object
 * @returns {boolean} True if the round closes today
 */
export const isClosingToday = (round) => {
    if (!round?.closesDate) return false;
    const closeDate = new Date(round.closesDate);
    const today = getCurrentDate();
    return closeDate.toDateString() === today.toDateString();
};

/**
 * Check if a round is closing within 24 hours
 * @param {Object} round - Processed round object
 * @returns {boolean} True if closing within 24 hours
 */
export const isClosingWithin24Hours = (round) => {
    if (!round?.closesDate) return false;
    const closeDate = new Date(round.closesDate);
    const now = getCurrentDate();
    const hoursRemaining = (closeDate - now) / (1000 * 60 * 60);
    return hoursRemaining > 0 && hoursRemaining <= 24;
};

/**
 * Check if a round is closing within 48 hours
 * @param {Object} round - Processed round object
 * @returns {boolean} True if closing within 48 hours
 */
export const isClosingWithin48Hours = (round) => {
    if (!round?.closesDate) return false;
    const closeDate = new Date(round.closesDate);
    const now = getCurrentDate();
    const hoursRemaining = (closeDate - now) / (1000 * 60 * 60);
    return hoursRemaining > 0 && hoursRemaining <= 48;
};

/**
 * Check if a round is closing within 7 days
 * @param {Object} round - Processed round object
 * @returns {boolean} True if closing within 7 days
 */
export const isClosingWithin7Days = (round) => {
    if (!round?.closesDate) return false;
    const closeDate = new Date(round.closesDate);
    const now = getCurrentDate();
    const daysRemaining = (closeDate - now) / (1000 * 60 * 60 * 24);
    return daysRemaining > 0 && daysRemaining <= 7;
};

/**
 * Get deadline urgency level
 * @param {Object} round - Processed round object
 * @returns {string} 'critical' (48hrs), 'high' (7 days), 'normal'
 */
export const getDeadlineUrgency = (round) => {
    if (isClosingWithin48Hours(round)) return 'critical';
    if (isClosingWithin7Days(round)) return 'high';
    return 'normal';
};

/**
 * Get time remaining until close
 * @param {Object} round - Processed round object
 * @returns {Object} Time remaining breakdown
 */
export const getTimeUntilClose = (round) => {
    if (!round?.closesDate) return null;

    const closeDate = new Date(round.closesDate);
    const now = getCurrentDate();
    const difference = closeDate - now;

    if (difference <= 0) {
        return { expired: true, hours: 0, minutes: 0, seconds: 0, totalHours: 0 };
    }

    const totalHours = difference / (1000 * 60 * 60);
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { expired: false, hours, minutes, seconds, totalHours };
};

/**
 * Get widget display data for a round (used by RoundWidget)
 * @param {Object} currentRound - Current processed round
 * @param {Object} nextOpenRound - Next upcoming round (optional)
 * @param {Object} options - Additional options (hasNoRounds, hasNoFutureRounds)
 * @returns {Object} Widget display data
 */
export const getWidgetDisplayData = (currentRound, nextOpenRound = null, options = {}) => {
    const { hasNoRounds = false, hasNoFutureRounds = false } = options;

    // Handle no rounds case
    if (hasNoRounds || !currentRound) {
        return {
            displayRound: null,
            roundName: null,
            status: 'no-rounds',
            isAcceptingApplications: false,
            shouldShowNextRound: false,
            hasNoRounds: true,
            hasNoFutureRounds: true,
            dates: null
        };
    }

    // Only consider capacity if capacity tracking is enabled for this round
    const hasCapacity = currentRound.hasCapacity ?? true;
    const isCapacityFull = hasCapacity && currentRound.capacityPercentage >= 100;
    const isAcceptingApplications = currentRound.isOpen && !isCapacityFull;

    // Determine which round to display
    // Priority: 
    // 1. If current round is open and accepting → show it
    // 2. If current round is open but full → show next if exists, else show current
    // 3. If current round is not open but in assessment/results → show it, mention next if exists
    // 4. If current round is past and there's a next round → show next
    // 5. If current round is past and no next round → show last round's status

    let displayRound = currentRound;
    let shouldShowNextRound = false;

    if (isAcceptingApplications) {
        // Current round is open and accepting - show it
        displayRound = currentRound;
    } else if (currentRound.isOpen && isCapacityFull) {
        // Current round is open but full - show next if available
        if (nextOpenRound) {
            displayRound = nextOpenRound;
            shouldShowNextRound = true;
        } else {
            displayRound = currentRound; // Show full message
        }
    } else if (currentRound.isPresent && !currentRound.isOpen) {
        // Current round is in assessment/results phase - show it
        displayRound = currentRound;
    } else if (currentRound.isUpcoming) {
        // Current round is upcoming - show it
        displayRound = currentRound;
    } else if (currentRound.isPast) {
        // Current round is past
        if (nextOpenRound) {
            // There's a future round - show when it opens
            displayRound = nextOpenRound;
            shouldShowNextRound = true;
        } else {
            // No future rounds - show last round's completed status
            displayRound = currentRound;
        }
    }

    // Determine status
    let status = 'upcoming';
    if (hasNoFutureRounds && displayRound.isPast) {
        status = 'completed';
    } else if (isAcceptingApplications && displayRound === currentRound) {
        status = 'open';
    } else if (displayRound.isUpcoming || shouldShowNextRound) {
        status = 'upcoming';
    } else if (displayRound.isInAssessment) {
        status = 'assessing';
    } else if (displayRound.isInResults) {
        status = 'results';
    } else if (displayRound.isPast) {
        status = 'completed';
    }

    // Capacity urgency level
    let capacityUrgency = 'low';
    if (displayRound.capacityPercentage >= 80) {
        capacityUrgency = 'critical';
    } else if (displayRound.capacityPercentage >= 60) {
        capacityUrgency = 'high';
    } else if (displayRound.capacityPercentage >= 40) {
        capacityUrgency = 'medium';
    }

    // Deadline urgency level (independent of capacity)
    const deadlineUrgency = getDeadlineUrgency(displayRound);

    return {
        displayRound,
        currentRound, // Also return the original current round for reference
        roundName: getRoundName(displayRound),
        status,
        isAcceptingApplications: isAcceptingApplications && displayRound === currentRound,
        shouldShowNextRound,
        hasNoRounds: false,
        hasNoFutureRounds,
        isClosingToday: isClosingToday(displayRound),
        isClosingSoon: isClosingWithin24Hours(displayRound),
        isClosingWithin48Hours: isClosingWithin48Hours(displayRound),
        isClosingWithin7Days: isClosingWithin7Days(displayRound),
        hasCapacity: displayRound.hasCapacity ?? true,
        capacityPercentage: displayRound.capacityPercentage,
        capacityUrgency,
        deadlineUrgency,
        daysRemaining: displayRound.timing?.daysRemaining ?? 0,
        daysUntilOpen: displayRound.timing?.daysUntilOpen ?? 0,
        closesDate: displayRound.closesDate,
        opensDate: displayRound.opensDate,
        dates: displayRound.dates
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
    processAllRounds,
    getRoundName,
    isClosingToday,
    isClosingWithin24Hours,
    isClosingWithin48Hours,
    isClosingWithin7Days,
    getDeadlineUrgency,
    getTimeUntilClose,
    getWidgetDisplayData
};
