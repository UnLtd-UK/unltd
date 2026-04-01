/**
 * Hope Map Data & Configuration
 * Static data for the Hope Map — an interactive directory of social entrepreneurs across the UK.
 * Modelled on src/data/topics.ts for the tag configuration pattern.
 */

import type { Coordinates } from './hopeMapLocations';
import { ukCities } from './hopeMapLocations';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HopeMapPerson {
    id: string;
    name: string;
    organisation: string;
    location: string;
    coordinates: Coordinates;
    description: string;
    actOfHope: string;
    websiteUrl: string;
    tags: string[];
}

export interface HopeMapTagConfig {
    label: string;
    bgClass: string;
    textClass: string;
}

// ─── Tag Configuration ───────────────────────────────────────────────────────

export const hopeMapTags: Record<string, HopeMapTagConfig> = {
    "health": {
        label: "Health",
        bgClass: "bg-emerald-500/20",
        textClass: "text-emerald-300",
    },
    "arts-culture": {
        label: "Arts & Culture",
        bgClass: "bg-fuchsia-500/20",
        textClass: "text-fuchsia-300",
    },
    "education": {
        label: "Education",
        bgClass: "bg-sky-500/20",
        textClass: "text-sky-300",
    },
    "environment": {
        label: "Environment",
        bgClass: "bg-green-500/20",
        textClass: "text-green-300",
    },
    "community": {
        label: "Community",
        bgClass: "bg-amber-500/20",
        textClass: "text-amber-300",
    },
    "youth": {
        label: "Youth",
        bgClass: "bg-violet-500/20",
        textClass: "text-violet-300",
    },
    "employment": {
        label: "Employment",
        bgClass: "bg-rose-500/20",
        textClass: "text-rose-300",
    },
    "housing": {
        label: "Housing",
        bgClass: "bg-orange-500/20",
        textClass: "text-orange-300",
    },
    "technology": {
        label: "Technology",
        bgClass: "bg-cyan-500/20",
        textClass: "text-cyan-300",
    },
    "food": {
        label: "Food",
        bgClass: "bg-lime-500/20",
        textClass: "text-lime-300",
    },
};

// ─── Helper Functions ────────────────────────────────────────────────────────

export function getTagConfig(slug: string): HopeMapTagConfig | null {
    return hopeMapTags[slug] ?? null;
}

export function getTagLabel(slug: string): string | null {
    return hopeMapTags[slug]?.label ?? null;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

export const hopeMapEntries: HopeMapPerson[] = [
    {
        id: "1",
        name: "Sarah Mitchell",
        organisation: "GreenStart CIC",
        location: "Newcastle upon Tyne",
        coordinates: ukCities["Newcastle upon Tyne"],
        description: "GreenStart supports young people from disadvantaged backgrounds to access green skills training and employment opportunities in the renewable energy sector.",
        actOfHope: "Every young person we train is one more voice for a sustainable future.",
        websiteUrl: "https://example.com/greenstart",
        tags: ["environment", "youth", "employment"],
    },
    {
        id: "2",
        name: "James Okonkwo",
        organisation: "Harmony Arts",
        location: "Manchester",
        coordinates: ukCities["Manchester"],
        description: "Harmony Arts uses music and performing arts to improve mental health outcomes for refugees and asylum seekers, building community through creative expression.",
        actOfHope: "Music is a universal language — it helps people feel at home no matter where they are.",
        websiteUrl: "https://example.com/harmony-arts",
        tags: ["arts-culture", "health", "community"],
    },
    {
        id: "3",
        name: "Priya Sharma",
        organisation: "CodeForward",
        location: "Birmingham",
        coordinates: ukCities["Birmingham"],
        description: "CodeForward provides free coding bootcamps and digital skills workshops for women from ethnic minority backgrounds, helping them transition into tech careers.",
        actOfHope: "When one woman learns to code, she opens doors for an entire generation.",
        websiteUrl: "https://example.com/codeforward",
        tags: ["technology", "education", "employment"],
    },
    {
        id: "4",
        name: "Tom Bridges",
        organisation: "The Food Cycle",
        location: "Bristol",
        coordinates: ukCities["Bristol"],
        description: "The Food Cycle rescues surplus food from supermarkets and restaurants to cook nutritious community meals, tackling food poverty and social isolation together.",
        actOfHope: "A shared meal can change someone's whole week. That's where hope starts.",
        websiteUrl: "https://example.com/food-cycle",
        tags: ["food", "community", "health"],
    },
    {
        id: "5",
        name: "Aisling Byrne",
        organisation: "SafeSpace Housing",
        location: "Belfast",
        coordinates: ukCities["Belfast"],
        description: "SafeSpace provides transitional housing and holistic support for young people leaving the care system, ensuring no one falls through the cracks.",
        actOfHope: "A stable home is the foundation everything else is built on.",
        websiteUrl: "https://example.com/safespace",
        tags: ["housing", "youth", "community"],
    },
    {
        id: "6",
        name: "Kwame Asante",
        organisation: "BrightMinds Academy",
        location: "London",
        coordinates: ukCities["London"],
        description: "BrightMinds runs Saturday schools and mentoring programmes for Black Caribbean boys, raising aspirations and academic achievement through culturally relevant education.",
        actOfHope: "When a young person sees themselves in their teacher, they start to believe in what's possible.",
        websiteUrl: "https://example.com/brightminds",
        tags: ["education", "youth"],
    },
    {
        id: "7",
        name: "Fiona Campbell",
        organisation: "Highland Health Collective",
        location: "Inverness",
        coordinates: ukCities["Inverness"],
        description: "The Highland Health Collective brings together peer support workers and wellbeing coaches to address rural mental health isolation across the Scottish Highlands.",
        actOfHope: "No one should have to struggle alone just because they live far from a city.",
        websiteUrl: "https://example.com/highland-health",
        tags: ["health", "community"],
    },
    {
        id: "8",
        name: "Rhys Morgan",
        organisation: "Creative Valleys",
        location: "Swansea",
        coordinates: ukCities["Swansea"],
        description: "Creative Valleys transforms disused industrial spaces into community arts hubs in the South Wales valleys, fostering local creativity and economic regeneration.",
        actOfHope: "Art doesn't just fill empty buildings — it fills empty hearts.",
        websiteUrl: "https://example.com/creative-valleys",
        tags: ["arts-culture", "community", "employment"],
    },
];
