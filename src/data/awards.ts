/**
 * Awards Data
 * 
 * Defines all available Award types with their associated programmes and benefits.
 * Structured for future Directus integration - each award will become a collection item.
 * 
 * Award codes follow the pattern: {stage}-{programme}
 * - st = Starting Up
 * - sc = Scaling Up
 * - mat = Millennium Awards Trust
 * - ffp = Funding Futures Programme
 */

export interface ProgrammeService {
    name: string;
    icon: string;
}

export interface Programme {
    icon: string;
    name: string;
    code: string;
    path: string;
    colour: string;
    description: string;
}

export interface Award {
    code: string;
    name: string;
    stage: 'starting-up' | 'scaling-up';
    backgroundColour: string;
    grant: number;
    programme: Programme;
    grantUsability: Record<string, boolean>;
    programmeServices: ProgrammeService[];
}

export const awards: Award[] = [
    {
        code: "stmat",
        name: "Starting Up Award Millennium Awards Trust",
        stage: "starting-up",
        backgroundColour: "bg-slate-100",
        grant: 8000,
        programme: {
            icon: "fa-solid fa-universal-access",
            name: "Millennium Awards Trust",
            code: "mat",
            path: "/awards/millennium-awards-trust",
            colour: "amber",
            description:
                "Open to any social entrepreneur aged 16+ tackling a range of social issues.",
        },
        grantUsability: {
            "For social venture costs": true,
            "For social entrepreneur living costs": false,
        },
        programmeServices: [
            { name: "12 months of enrollment", icon: "fa-light fa-timer" },
            { name: "Support manager", icon: "fa-light fa-user-headset" },
            { name: "Upskill with your peers", icon: "fa-light fa-people-group" },
            { name: "Business mentoring", icon: "fa-light fa-handshake" },
            { name: "Legal advisor consultancy", icon: "fa-light fa-rectangle-pro" },
        ],
    },
    {
        code: "stffp",
        name: "Starting Up Award Funding Futures Programme",
        stage: "starting-up",
        backgroundColour: "bg-slate-100",
        grant: 8000,
        programme: {
            icon: "fa-solid fa-rocket",
            name: "Funding Futures Programme",
            code: "ffp",
            path: "/awards/funding-futures-programme",
            colour: "purple",
            description:
                "Supports 16-30 year olds with great ideas for solutions to help those sidelined by the financial system.",
        },
        grantUsability: {
            "For social venture costs": true,
            "For social entrepreneur living costs": false,
        },
        programmeServices: [
            { name: "12 months of enrollment", icon: "fa-light fa-timer" },
            { name: "Support manager", icon: "fa-light fa-user-headset" },
            { name: "Upskill with your peers", icon: "fa-light fa-people-group" },
            { name: "Business mentoring", icon: "fa-light fa-handshake" },
            { name: "Legal advisor consultancy", icon: "fa-light fa-rectangle-pro" },
            { name: "Peer-to-peer learning", icon: "fa-light fa-people-group" },
        ],
    },
    {
        code: "scmat",
        name: "Scaling Up Award Millennium Awards Trust",
        stage: "scaling-up",
        backgroundColour: "bg-slate-900",
        grant: 18000,
        programme: {
            icon: "fa-solid fa-universal-access",
            name: "Millennium Awards Trust",
            code: "mat",
            path: "/awards/millennium-awards-trust",
            colour: "amber",
            description:
                "Open to any social entrepreneur aged 16+ tackling a range of social issues.",
        },
        grantUsability: {
            "For social venture costs": true,
            "For social entrepreneur living costs": true,
        },
        programmeServices: [
            { name: "12 months of enrollment", icon: "fa-light fa-timer" },
            { name: "Support manager", icon: "fa-light fa-user-headset" },
            { name: "Upskill with your peers", icon: "fa-light fa-people-group" },
            { name: "Business mentoring", icon: "fa-light fa-handshake" },
            { name: "Legal advisor consultancy", icon: "fa-light fa-rectangle-pro" },
        ],
    },
    {
        code: "scffp",
        name: "Scaling Up Award Funding Futures Programme",
        stage: "scaling-up",
        backgroundColour: "bg-slate-900",
        grant: 18000,
        programme: {
            icon: "fa-solid fa-rocket",
            name: "Funding Futures Programme",
            code: "ffp",
            path: "/awards/funding-futures-programme",
            colour: "purple",
            description:
                "Supports 16-30 year olds with great ideas for solutions to help those sidelined by the financial system.",
        },
        grantUsability: {
            "For social venture costs": true,
            "For social entrepreneur living costs": true,
        },
        programmeServices: [
            { name: "12 months of enrollment", icon: "fa-light fa-timer" },
            { name: "Support manager", icon: "fa-light fa-user-headset" },
            { name: "Upskill with your peers", icon: "fa-light fa-people-group" },
            { name: "Business mentoring", icon: "fa-light fa-handshake" },
            { name: "Legal advisor consultancy", icon: "fa-light fa-rectangle-pro" },
            { name: "Peer-to-peer learning", icon: "fa-light fa-people-group" },
        ],
    },
];

/**
 * Helper to get an award by its code
 */
export const getAwardByCode = (code: string): Award | undefined => {
    return awards.find(award => award.code === code);
};

/**
 * Helper to get multiple awards by codes
 */
export const getAwardsByCodes = (codes: string[]): Award[] => {
    return codes.map(code => getAwardByCode(code)).filter((a): a is Award => a !== undefined);
};
