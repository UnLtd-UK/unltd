interface FooterLinkItem {
    name: string;
    link: string;
    slug: string;
    icon: string;
    target?: string;
    description?: string;
}

interface FooterLinkGroup {
    name: string;
    items: FooterLinkItem[];
}

export const navigation = {
    code: {
        footer: {
            socials: [
                {
                    name: "BlueSky",
                    link: "https://bsky.app/profile/unltd.org.uk",
                    slug: "",
                    icon: "fa-brands fa-bluesky",
                },
                {
                    name: "Instagram",
                    link: "https://www.instagram.com/unltduk",
                    slug: "",
                    icon: "fa-brands fa-instagram",
                },
                {
                    name: "LinkedIn",
                    link: "https://www.linkedin.com/company/unltd",
                    slug: "",
                    icon: "fa-brands fa-linkedin",
                },
                {
                    name: "YouTube",
                    link: "https://www.youtube.com/user/unLtdvideos",
                    slug: "",
                    icon: "fa-brands fa-youtube",
                },
            ],
            address: {
                address1: "123 Whitecross Street",
                address2: "Islington, London",
                address3: "EC1Y 8JJ",
            },
            phone: "+44 20 7566 1100",
            regulatory: [
                {
                    name: "Companies House",
                    link: "https://find-and-update.company-information.service.gov.uk/company/04180639",
                    number: "04180639",
                },
                {
                    name: "Charity Commission for England and Wales",
                    link: "https://apps.charitycommission.gov.uk/Showcharity/RegisterOfCharities/SearchResultHandler.aspx?RegisteredCharityNumber=1090393",
                    number: "1090393",
                }
            ],
            links: [
                {
                    name: "Contact Us",
                    items: [
                        { name: "Find a form", link: "", slug: "contact", icon: "" },
                        { name: "General", link: "", slug: "contact/general-enquiries", icon: "" },
                        { name: "Awards", link: "", slug: "contact/awards-enquiries", icon: "" },
                        { name: "Partnerships", link: "", slug: "contact/partnerships-enquiries", icon: "" },
                        { name: "Volunteering", link: "", slug: "contact/volunteering-enquiries", icon: "" },
                        { name: "Press & Media", link: "", slug: "contact/press-media-enquiries", icon: "" },
                    ],
                },
                {
                    name: "Legal",
                    items: [
                        { name: "Privacy Policy", link: "", slug: "privacy-policy", icon: "" },
                        { name: "Complaints Policy", link: "", slug: "complaints-policy", icon: "" },
                        { name: "Browser Storage Policy", link: "", slug: "browser-storage-policy", icon: "" },
                        { name: "Photography & Filming Policy", link: "", slug: "photography-and-filming-policy", icon: "" },
                        { name: "Terms & Conditions", link: "", slug: "terms-and-conditions", icon: "" },
                    ],
                },
                {
                    name: "Reports & Equity",
                    items: [
                        { name: "Financial Reports", link: "", slug: "financial-reports", icon: "" },
                        { name: "Impact Reports", link: "", slug: "impact-reports", icon: "" },
                    ],
                },
                {
                    name: "Other",
                    items: [
                        { name: "Careers", target: "", link: "", slug: "careers", icon: "" },
                        { name: "Safeguarding", link: "", slug: "safeguarding", icon: "" },
                    ],
                },
            ] as FooterLinkGroup[],
        },
    },
};
