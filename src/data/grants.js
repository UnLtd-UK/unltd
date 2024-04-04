import { getCollection } from './load.js';

const collection = "grants";

const filterOptions = {
    sort: ['sort', '-date_time'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

// const grants = await getCollection(collection, filterOptions, attach);

const grants = [
    {
        name: "Starting Up",
        demographic: "Social entrepreneur",
        description:
            "You have an idea or have started to make a difference to people's lives, your community, or have ambitions to create change at a national level.",
        amount: "8,000",
        features: [
            {
                name: "For social venture costs",
                icon: "fa-regular fa-circle-check",
            },
        ],
        eligibilities: [
            {
                name: "Incorporated",
                value: "Not yet or less 4 years",
                icon: "fa-solid fa-pen-nib",
            },
            {
                name: "Selling goods and services",
                value: "Less than 1 year",
                icon: "fa-solid fa-bag-shopping",
            },
        ],
        programmes: [
            { name: "Core", colour: "amber" },
            { name: "Access to Employment", colour: "violet" },
            { name: "Financial Inclusion", colour: "red" },
            { name: "Healthy Ageing", colour: "green" },
            { name: "Movement for Change", colour: "blue" },
        ],
    },
    {
        name: "Scaling Up",
        description:
            "You are already running a social venture that is making a positive difference and you have compelling evidence of your impact.",
        amount: "18,000",
        features: [
            {
                name: "For social venture costs",
                icon: "fa-regular fa-circle-check",
            },
            {
                name: "For social entrepreneur living costs",
                icon: "fa-regular fa-circle-check",
            },
        ],
        eligibilities: [
            {
                name: "Incorporated",
                value: "Less 4 years",
                icon: "fa-solid fa-pen-nib",
            },
            {
                name: "Selling goods and services",
                value: "1 to 4 years",
                icon: "fa-solid fa-bag-shopping",
            },
        ],
        programmes: [
            { name: "Core", colour: "amber" },
            { name: "Access to Employment", colour: "violet" },
            { name: "Financial Inclusion", colour: "red" },
            { name: "Healthy Ageing", colour: "green" },
            { name: "Movement for Change", colour: "blue" },
        ],
    },
];

export { grants }