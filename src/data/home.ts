/**
 * Home page content. Edit the text here; icons are FontAwesome class strings.
 */

export interface HomeLink {
    text: string;
    url: string;
}

export interface HomeItem {
    icon: string;
    title: string;
    text: string;
}

export interface Home {
    hero: {
        title: string;
        text: string;
        image: { src: string; alt: string; width: number; height: number };
        primaryButton: HomeLink;
        secondaryButton: HomeLink;
    };
    mission: {
        title: string;
        text: string;
        callout: string;
        statistics: HomeItem[];
    };
    support: HomeItem[];
}

export const home: Home = {
    hero: {
        title: "You are unstoppable",
        text: "More people than ever are stepping up to tackle society's problems. Could you be one of them?",
        image: { src: "/img/home-hero.webp", alt: "", width: 1600, height: 768 },
        primaryButton: { text: "Go to Awards", url: "/awards" },
        secondaryButton: { text: "Our purpose", url: "/our-purpose" },
    },
    mission: {
        title: "Our mission",
        text: "We are UnLtd. We know social entrepreneurs offer some of the best solutions to loneliness, community resilience and our nation’s long term economic, social and cultural health.",
        callout:
            "We are committed to 50% of our Awards going to Black, Asian and minority ethnic social entrepreneurs, and/or disabled social entrepreneurs across our programmes.",
        statistics: [
            {
                icon: "fa-duotone fa-earth-europe",
                title: "Over 2 Million Lives Impacted",
                text: "Award Winners ventures reached an estimated 2,000,000 people, creating meaningful social impact.",
            },
            {
                icon: "fa-duotone fa-solid fa-lightbulb-on",
                title: "98% Feel Empowered to Create Change",
                text: "Nearly all Award Winners reported feeling confident in their ability to contribute to social change after receiving UnLtd’s support.",
            },
            {
                icon: "fa-duotone fa-award",
                title: "150 Awards Given",
                text: "In 2023/24, UnLtd supported 150 social entrepreneurs with Starting Up and Scaling Up grants and services to drive social change.",
            },
        ],
    },
    support: [
        {
            icon: "fa-regular fa-handshake",
            title: "One-to-one coaching",
            text: "You'll work with one of our coaches. They'll provide support and advice, and act as your 'critical friend' to help you achieve your goals and become a stronger social leader.",
        },
        {
            icon: "fa-regular fa-people-roof",
            title: "Mentoring and pro-bono experts",
            text: "We connect you with professionals who can provide specialist advice and help you develop. Our network of mentors and volunteers includes individuals across a range of industries as well as organisations such as Hogan Lovells, PA Consulting, Herbert Smith Freehills.",
        },
        {
            icon: "fa-regular fa-award",
            title: "Business and specialist skills",
            text: "From marketing to finance, you’ll get the chance to build your business skills thanks to our experts and partners. We run workshops, learning sessions and accelerators to make sure you get the knowledge you need.",
        },
        {
            icon: "fa-regular fa-magnifying-glass",
            title: "Understanding your impact",
            text: "UnLtd can work with you and give you the tools to better understand and measure the social impact you want to achieve.",
        },
    ],
};
