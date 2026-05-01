/**
 * Hope Map Data & Configuration
 * Static data for the Hope Map — an interactive directory of social entrepreneurs across the UK.
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
    /** The tagline is the organisation's logline — a short mission statement. */
    tagline: string;
    /** The quote is a personal statement from the social entrepreneur in their own voice. */
    quote: string;
    websiteUrl: string;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

export const hopeMapEntries: HopeMapPerson[] = [
    {
        id: "3",
        name: "Ash Morgan",
        organisation: "Ocean Buffer Project",
        location: "Treverva, near Falmouth, Cornwall",
        coordinates: ukCities["Falmouth"],
        tagline: "Simple, community-led carbon removal",
        quote: "We grow mini oceans on land, using marine algae to remove carbon and give people a hopeful, inclusive, hands-on way to take real climate action in their own community.",
        websiteUrl: "https://oceanbufferproject.co.uk/",
    },
    {
        id: "1",
        name: "Djanira Dju",
        organisation: "MotherLink",
        location: "Reading",
        coordinates: ukCities["Reading"],
        tagline: "Empowering mums across the UK to navigate the challenges of motherhood",
        quote: "MotherLink supports mothers facing overwhelm, isolation and financial hardship through accessible support, community connection and practical tools that help rebuild confidence and stability.",
        websiteUrl: "https://www.motherlink.co.uk/",
    },
    {
        id: "6",
        name: "Ian Timbrell",
        organisation: "More than Flags and Rainbows",
        location: "Cardiff, Wales",
        coordinates: ukCities["Cardiff"],
        tagline: "Helping schools be more inclusive",
        quote: "At More Than Flags and Rainbows we work with teachers and pupils to put a stop to bullying and help schools and communities become more LGBTQ+ inclusive.",
        websiteUrl: "https://www.morethanflagsandrainbows.com/",
    },
    {
        id: "4",
        name: "Khaleda Noon",
        organisation: "Theatre of the Oppressed Scotland",
        location: "Edinburgh",
        coordinates: ukCities["Edinburgh"],
        tagline: "Theatre, hip-hop and anti-racism",
        quote: "I use theatre, hip hop education and anti-racist practice to work with young people and communities across Scotland, turning lived experience into creative expression, influencing systems and creating spaces where people feel seen, heard and able to shape change.",
        websiteUrl: "https://www.toscot.co.uk/",
    },
    {
        id: "5",
        name: "Paula Eldridge",
        organisation: "Tumble Lindy Hop Jive",
        location: "Llannon, Carmarthenshire, Wales",
        coordinates: ukCities["Llanelli"],
        tagline: "Tackling loneliness and exclusion though dance",
        quote: "Delivering therapeutic dance, whether seated, standing, care homes, community groups, big or small, our impact is evident on the smiles of every face making each and every day special, bringing happiness and joy.",
        websiteUrl: "https://www.tumblelindy.co.uk/",
    },
    {
        id: "2",
        name: "Philip Reain-Adair",
        organisation: "Live Life",
        location: "Lisburn, NI",
        coordinates: ukCities["Lisburn"],
        tagline: "Supporting school leavers and young people with additional needs",
        quote: "Live Life provides award‑winning services to its participants and the wider disabled community, showcasing inclusion and life‑changing impact through innovation and a collaborative approach.",
        websiteUrl: "https://www.livelifewellbeingcentre.co.uk/",
    },
];
