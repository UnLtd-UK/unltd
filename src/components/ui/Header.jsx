import { useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'; // Import useLocation hook

// Real data we aren't using //////////////////////////////
// import { navigation } from "@data/navigation.js"
// const navigations = navigation.code.header.main;
// console.log("Diretcus: ", navigation);

// Fake data we are using to debug //////////////////////////////
const data = {
  header: {
    action: {
      name: "Log in",
      link: "https://unltd.microsoftcrmportals.com/applications"
    },
    main: [
      {
        id: 1,
        name: "Our funding",
        items: [
          {
            id: 1,
            name: "Awards",
            description: "For social entrepreneurs",
            href: "/awards",
            icon: "fa-solid fa-award"
          },
          {
            id: 2,
            name: "Investment",
            description: "For organisations",
            href: "https://growthimpactfund.org.uk",
            icon: "fa-solid fa-shop"
          }
        ],
        actions: []
      },
      {
        id: 2,
        name: "Join us",
        items: [
          {
            id: 1,
            name: "Fundraising",
            description: "Give money",
            href: "/fundraising",
            icon: "fa-solid fa-piggy-bank"
          },
          {
            id: 2,
            name: "Partnering",
            description: "Orgs looking to fund and support us",
            href: "/partnering",
            icon: "fa-solid fa-handshake"
          },
          {
            id: 3,
            name: "Volunteering",
            description: "Individuals looking to do pro bono",
            href: "/volunteering",
            icon: "fa-solid fa-street-view"
          }
        ],
        actions: []
      },
      {
        id: 3,
        name: "About us",
        items: [
          {
            id: 1,
            name: "Our purpose",
            description: "vision and mission",
            href: "/our-purpose",
            icon: "fa-solid fa-puzzle-piece"
          },
          {
            id: 2,
            name: "Our team",
            description: "Made up of four direcorates",
            href: "/our-team",
            icon: "fa-solid fa-people-group"
          },
          {
            id: 3,
            name: "Our strategy",
            description: "How we make impact",
            badge: "2022 - 2025",
            href: "https://strategy.unltd.org.uk",
            icon: "fa-solid fa-chess-pawn"
          },
          {
            id: 4,
            name: "Our impact",
            description: "The change we are having",
            badge: "2021 - 2022",
            href: "/UnLtd_Impact_Report_2022.pdf",
            icon: "fa-solid fa-explosion"
          }
        ],
        actions: []
      }
    ]
  },
  footer: {
    socials: [
      {
        name: "X",
        link: "https://twitter.com/UnLtd",
        slug: "",
        icon: "fa-brands fa-x-twitter"
      },
      {
        name: "Instagram",
        link: "https://www.instagram.com/unltduk",
        slug: "",
        icon: "fa-brands fa-instagram"
      },
      {
        name: "Facebook",
        link: "https://www.facebook.com/UnLtd",
        slug: "",
        icon: "fa-brands fa-facebook"
      },
      {
        name: "YouTube",
        link: "https://www.youtube.com/user/UnLtdVideos",
        slug: "",
        icon: "fa-brands fa-youtube"
      },
      {
        name: "LinkedIn",
        link: "https://www.linkedin.com/company/unltd",
        slug: "",
        icon: "fa-brands fa-linkedin"
      }
    ],
    address: {
      address1: "123 Whitecross Street",
      address2: "Islington, London",
      address3: "EC1Y 8JJ",
      phone: "02075661100"
    },
    phone: "+44 20 7566 1100",
    regulatory: [
      {
        name: "Companies House",
        link: "https://find-and-update.company-information.service.gov.uk/company/04180639",
        number: "04180639"
      },
      {
        name: "Charity Commission for England and Wales",
        link: "https://apps.charitycommission.gov.uk/Showcharity/RegisterOfCharities/SearchResultHandler.aspx?RegisteredCharityNumber=1090393",
        number: "1090393"
      },
      {
        name: "Scottish Charity Regulator",
        link: "https://www.oscr.org.uk/about-charities/search-the-register/charity-details?number=SC032445",
        number: "SC032445"
      }
    ],
    links: [
      {
        name: "Enquiries",
        items: [
          {
            name: "Award enquiry",
            link: "",
            slug: "enquiries/award-enquiry",
            icon: ""
          },
          {
            name: "General enquiry",
            link: "",
            slug: "enquiries/general-enquiry",
            icon: ""
          },
          {
            name: "Press & media enquiry",
            link: "",
            slug: "enquiries/press-and-media-enquiry",
            icon: ""
          }
        ]
      },
      {
        name: "Legal",
        items: [
          {
            name: "Privacy Policy",
            link: "",
            slug: "privacy-policy",
            icon: ""
          },
          {
            name: "Complaints Policy",
            link: "",
            slug: "complaints-policy",
            icon: ""
          },
          {
            name: "Browser Storage Policy",
            link: "",
            slug: "browser-storage-policy",
            icon: ""
          },
          {
            name: "Photography & Filming Policy",
            link: "",
            slug: "photography-and-filming-policy",
            icon: ""
          },
          {
            name: "Terms & Conditions",
            link: "",
            slug: "terms-and-conditions",
            icon: ""
          }
        ]
      },
      {
        name: "Reports & Equity",
        items: [
          {
            name: "Financial Reports",
            link: "",
            slug: "financial-reports",
            icon: ""
          },
          {
            name: "Impact Reports",
            link: "",
            slug: "impact-reports",
            icon: ""
          },
          {
            name: "Equity Report",
            link: "",
            slug: "equity-report",
            icon: ""
          },
          {
            name: "Equity Audit",
            link: "",
            slug: "equity-audit",
            icon: ""
          },
          {
            name: "Equity Commitments",
            link: "",
            slug: "equity-commitments",
            icon: ""
          }
        ]
      },
      {
        name: "Other",
        items: [
          {
            name: "Careers",
            link: "https://www.jobtrain.co.uk/unltd-careers",
            slug: "",
            icon: ""
          },
          {
            name: "Plausible Analytics",
            link: "https://plausible.io/unltd.org.uk",
            slug: "",
            icon: ""
          },
          {
            name: "Safeguarding",
            link: "",
            slug: "safeguarding",
            icon: ""
          },
          {
            name: "Gift Aid",
            link: "",
            slug: "gift-aid",
            icon: ""
          },
          {
            name: "Our brand",
            link: "",
            slug: "our-brand",
            icon: ""
          }
        ]
      }
    ]
  }
}
const navigations = data.header.main;

import Logo from "@components/Logo.jsx";
import PanelComp from './Panel.jsx';
import DialogComp from './Dialog.jsx';

export default function HeaderComp({ styles }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className={styles.bg}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <Logo />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${styles.text}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <i className="fa-solid fa-bars h-6 w-6" aria-hidden="true" ></i>
          </button>
        </div>
        <PanelComp navs={navigations} styles={styles} />
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="https://unltd.microsoftcrmportals.com/applications" className={`text-sm font-semibold leading-6 ${styles.text}`}>
            Log in <span aria-hidden="true" className={styles.text2}>&rarr;</span>
          </a>
        </div>
      </nav>
      <DialogComp nav={navigations} styles={styles} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
    </header>
  )
}