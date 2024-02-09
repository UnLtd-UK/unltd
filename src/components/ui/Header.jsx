import { useState } from 'react'
import { Dialog, Disclosure, Popover } from '@headlessui/react'

import PopoverComponent from './Popover';
// import DisclosureComponent from './Disclosure';

const learn = {
  name: 'Learn',
  items:
    [
      {
        name: 'Choosing the right legal structure',
        description: 'Get a better understanding of your traffic',
        href: "/choosing-the-right-legal-structure",
        icon: "fa-solid fa-1"
      },
      {
        name: 'Defining social impact indicators, setting targets and refining your social model',
        description: 'Get a better understanding of your traffic',
        href: "/choosing-the-right-legal-structure",
        icon: "fa-solid fa-2"
      },
      {
        name: 'Stakeholder engagement and building networks',
        description: 'Get a better understanding of your traffic',
        href: "/choosing-the-right-legal-structure",
        icon: "fa-solid fa-3"
      },
      {
        name: 'Securing start up funding',
        description: 'Get a better understanding of your traffic',
        href: "/choosing-the-right-legal-structure",
        icon: "fa-solid fa-4"
      },
      {
        name: 'Other funding and support available for social entrepreneurs',
        description: 'Get a better understanding of your traffic',
        href: "/other-funding-and-support-available-for-social-entrepreneurs",
        icon: "fa-solid fa-5"
      }
    ],
  actions: [
    { name: 'Watch demo', href: '#', icon: 'fa-solid fa-6' },
    { name: 'Contact sales', href: '#', icon: 'fa-solid fa-7' },
  ]
};

const funding = {
  name: 'Our funding',
  items:
    [
      {
        name: 'Awards',
        description: 'for social entrepreneurs',
        href: "/awards",
        icon: "fa-solid fa-user"
      },
      {
        name: 'Investment',
        description: 'For social enterprises',
        href: "https://growthimpactfund.org.uk",
        icon: "fa-solid fa-shop"
      }
    ],
  actions: [
    { name: 'Watch demo', href: '#', icon: 'fa-solid fa-7' },
    { name: 'Contact sales', href: '#', icon: 'fa-solid fa-8' },
  ]
};

const join = {
  name: 'Join us',
  items:
    [
      {
        name: 'Fundraising',
        description: 'Give money',
        href: "/fundraising",
        icon: "fa-solid fa-piggy-bank"
      },
      {
        name: 'Partnering',
        description: 'Organisations wanting to fund and support us',
        href: "/partnering",
        icon: "fa-solid fa-handshake"
      },
      {
        name: 'Volunteering',
        description: 'Individuals looking to do pro bono',
        href: "/volunteering",
        icon: "fa-solid fa-street-view"
      }
    ],
  actions: [
    { name: 'Become an employee', href: 'https://www.jobtrain.co.uk/unltd-careers', icon: "fa-solid fa-briefcase" },
    { name: 'Become a trustee', href: 'https://unltd-trustees.co.uk', icon: "fa-solid fa-user-shield" },
  ]
};


const about = {
  name: 'About us',
  items:
    [
      {
        name: 'Our purpose',
        description: 'vision and mission',
        href: "/our-purpose",
        icon: "fa-solid fa-building-user"
      },
      {
        name: 'Our team',
        description: 'Made up of four direcorates',
        href: "/our-team",
        icon: "fa-solid fa-people-group"
      },
      {
        name: 'Our strategy',
        description: 'How we make impact',
        badge: "2022 - 2025",
        href: "https://breakingdownbarriers.unltd.org.uk",
        icon: "fa-solid fa-chess-pawn"
      },
      {
        name: 'Our impact',
        description: 'The change we are having',
        badge: "2021 - 2022",
        href: "/UnLtd_Impact_Report_2022.pdf",
        icon: "fa-solid fa-explosion"
      }
    ],
  actions: []
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">UnLtd</span>
            <svg
              className="h-8 w-auto"
              viewBox="0 0 5261 1529"
              xmlns="https://www.w3.org/2000/svg"
              xml:space="preserve"

            >
              <title>UnLtd logo</title>
              <descr>Orange pill</descr>
              <path
                className="fill-amber-600"
                d="M7215 15269c-1502-81-2953-611-4160-1519C1372 12483 281 10579 51 8505c-37-325-45-485-45-855 0-634 58-1156 195-1745 467-2006 1741-3750 3520-4818C4770 457 5947 94 7175 20c128-8 5006-10 16925-8l16745 3-44 23c-410 219-960 594-1371 936-311 258-724 659-979 951-1717 1962-2459 4540-2046 7111 181 1124 594 2216 1214 3209 477 763 1111 1486 1826 2080 364 301 807 608 1231 851 93 53 171 98 173 100 9 8-33489 1-33634-7Zm26482-3643c161-52 299-171 374-321 75-151 69 157 69-3630 0-2956-2-3419-15-3480-38-183-171-354-337-434-114-55-207-74-328-68-280 16-493 176-592 444-19 52-22 84-26 306l-4 247-78-102c-404-530-886-835-1479-935-154-26-610-26-766 0-624 105-1176 418-1578 897-285 341-506 807-601 1270-143 703-85 1458 159 2065 359 895 1099 1492 2030 1637 188 29 550 31 730 4 531-80 959-303 1340-697 61-63 139-151 175-196l65-83 5 1303 5 1302 29 75c82 213 256 368 466 415 98 22 254 14 357-19Zm-27211-320c214-68 368-225 436-446l22-75 6-2075c6-2060 6-2076 27-2205 84-510 238-853 507-1133 210-218 458-362 760-442 520-137 1131-89 1555 123 529 265 830 748 927 1487 17 124 19 298 24 2205 5 1974 6 2073 24 2125 73 220 249 387 466 446 87 23 253 24 340 1 115-30 207-83 296-172 92-92 143-180 174-301 20-76 20-119 20-2073 0-1272-4-2049-11-2141-14-203-44-429-80-605-260-1273-1058-2074-2314-2324-278-55-416-66-835-66-435 0-555 11-872 75-1254 257-2055 1110-2272 2420-64 386-61 256-61 2570v2105l27 81c49 142 132 252 254 333 174 117 385 148 580 87Zm13629 9c110-28 202-82 290-170 93-92 145-182 175-301 20-76 20-124 20-2986V4950h1738c1925 0 1809 4 1952-67 104-51 214-161 264-266 86-178 86-369 1-540-63-124-154-213-282-274-139-67-18-64-2338-61-2359 3-2133-4-2304 80-144 70-258 202-319 370l-27 73-3 3254c-2 3626-9 3301 69 3459 66 136 187 248 334 309 44 18 100 33 185 47 44 8 183-3 245-19Zm5909-291c175-45 339-182 417-349 58-124 59-131 59-712v-533h548c603 0 616-1 741-63 90-44 207-160 250-247 34-71 61-180 61-250 0-25-7-76-15-113-40-190-173-338-373-416l-67-26-572-3-573-3V6912c1-778 5-1441 10-1497 11-124 31-199 75-293 66-140 204-246 375-287 104-25 286-30 427-11 198 26 261 19 393-45 87-43 196-152 238-239 77-155 77-314 3-465-77-155-178-239-358-299-264-86-443-116-749-123-256-6-387 3-580 42-596 120-961 488-1083 1091-46 225-45 184-48 1892l-4 1632h-138c-229 0-340 39-467 165-115 113-164 233-164 400 0 160 56 291 170 399 125 117 238 156 457 156h143v510c0 425 3 524 16 587 56 270 267 468 549 514 64 10 184 2 259-17Zm-9499-1498c251-37 433-93 640-196 577-287 919-827 1017-1600 10-83 13-457 13-1815V4205l-27-75c-40-113-74-167-158-252-132-133-298-195-490-185-274 15-496 177-588 429l-27 73-6 1500c-6 1642-3 1564-65 1803-124 476-444 774-914 848-128 20-425 15-535-10-508-115-848-475-950-1006-9-47-19-94-22-105-4-11-9-693-13-1515l-5-1495-28-80c-61-173-166-294-320-370-199-98-398-100-596-5-114 55-231 170-284 280-79 161-72-75-72 2550 0 2205 1 2349 18 2410 59 219 216 392 415 459 314 106 652-32 800-325 53-104 65-170 71-376l6-188 85 113c97 128 300 341 410 430 310 250 671 393 1090 431 90 8 437-4 535-18Z"

                transform="matrix(.1 0 0 -.1 0 1529)"
              >
                <title>UnLtd logo</title>
                <descr> Orange pill</descr>
              </path>
              <path
                className="fill-amber-600"
                d="M31030 8410c-376-46-685-194-940-450-132-132-215-245-293-398-76-148-113-245-152-397-61-236-84-495-66-735 24-310 77-512 202-765 279-567 813-905 1429-905 964 0 1691 843 1647 1910-10 242-50 452-124 650-210 564-666 960-1229 1070-125 24-357 34-474 20ZM44540 15269c-1494-84-2921-600-4120-1487-477-353-952-804-1347-1279-384-462-765-1061-1017-1601-395-845-615-1664-703-2612-22-246-26-997-5-1240 149-1751 830-3307 2009-4592 488-532 1120-1040 1758-1414 902-527 1937-871 2970-988 323-37 416-41 880-41 478 0 571 5 915 46 2520 299 4736 1849 5895 4124 427 838 697 1761 789 2700 55 553 46 1178-25 1735-163 1294-671 2546-1458 3594-1301 1733-3236 2823-5381 3031-351 34-815 43-1160 24Zm540-2769c255-31 478-139 654-314 183-185 293-420 316-680 6-63 10-520 10-1058 0-522 1-948 3-948s532 77 1178 171c646 93 1212 173 1259 176 220 15 476-60 675-198 99-68 241-218 304-321 98-158 150-329 158-519 14-317-86-582-305-811-138-143-298-239-488-292-58-17-456-78-1139-176-577-83-1055-152-1062-153-6-1 326-661 754-1497 421-822 781-1530 800-1572 149-337 111-739-98-1049-54-82-175-207-260-269-254-189-603-256-914-176-119 31-292 114-386 185-86 66-193 179-250 266-26 39-334 633-686 1322l-640 1252-643-1257c-353-691-663-1288-689-1327-139-209-381-377-642-445-116-30-313-38-434-17-358 63-648 279-805 601-120 244-143 546-63 801 31 99-22-8 865 1728 407 796 739 1449 737 1451s-481 72-1064 156c-672 97-1091 161-1145 177-396 112-698 441-774 843-22 115-21 311 3 425 82 397 377 717 763 829 113 33 262 50 362 42 44-3 609-82 1254-176 645-93 1175-170 1177-170s6 467 8 1038c4 1131 0 1068 62 1243 105 301 356 553 660 662 157 56 327 76 485 57Z"

                transform="matrix(.1 0 0 -.1 0 1529)"
              >
                <title>UnLtd logo</title>
                <descr>Orange pill</descr>
              </path>
            </svg>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <i className="fa-solid fa-bars h-6 w-6" aria-hidden="true" ></i>
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">

          <PopoverComponent thing={learn} />

          <PopoverComponent thing={funding} />

          <PopoverComponent thing={join} />

          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Blog
          </a>

          <PopoverComponent thing={about} />

        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="https://unltd.microsoftcrmportals.com/applications" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">UnLtd</span>
              <svg
                class="h-8 w-auto"
                viewBox="0 0 5261 1529"
                xmlns="https://www.w3.org/2000/svg"
                xml:space="preserve"

              >
                <title>UnLtd logo</title>
                <descr>Orange pill</descr>
                <path
                  class="fill-amber-600"
                  d="M7215 15269c-1502-81-2953-611-4160-1519C1372 12483 281 10579 51 8505c-37-325-45-485-45-855 0-634 58-1156 195-1745 467-2006 1741-3750 3520-4818C4770 457 5947 94 7175 20c128-8 5006-10 16925-8l16745 3-44 23c-410 219-960 594-1371 936-311 258-724 659-979 951-1717 1962-2459 4540-2046 7111 181 1124 594 2216 1214 3209 477 763 1111 1486 1826 2080 364 301 807 608 1231 851 93 53 171 98 173 100 9 8-33489 1-33634-7Zm26482-3643c161-52 299-171 374-321 75-151 69 157 69-3630 0-2956-2-3419-15-3480-38-183-171-354-337-434-114-55-207-74-328-68-280 16-493 176-592 444-19 52-22 84-26 306l-4 247-78-102c-404-530-886-835-1479-935-154-26-610-26-766 0-624 105-1176 418-1578 897-285 341-506 807-601 1270-143 703-85 1458 159 2065 359 895 1099 1492 2030 1637 188 29 550 31 730 4 531-80 959-303 1340-697 61-63 139-151 175-196l65-83 5 1303 5 1302 29 75c82 213 256 368 466 415 98 22 254 14 357-19Zm-27211-320c214-68 368-225 436-446l22-75 6-2075c6-2060 6-2076 27-2205 84-510 238-853 507-1133 210-218 458-362 760-442 520-137 1131-89 1555 123 529 265 830 748 927 1487 17 124 19 298 24 2205 5 1974 6 2073 24 2125 73 220 249 387 466 446 87 23 253 24 340 1 115-30 207-83 296-172 92-92 143-180 174-301 20-76 20-119 20-2073 0-1272-4-2049-11-2141-14-203-44-429-80-605-260-1273-1058-2074-2314-2324-278-55-416-66-835-66-435 0-555 11-872 75-1254 257-2055 1110-2272 2420-64 386-61 256-61 2570v2105l27 81c49 142 132 252 254 333 174 117 385 148 580 87Zm13629 9c110-28 202-82 290-170 93-92 145-182 175-301 20-76 20-124 20-2986V4950h1738c1925 0 1809 4 1952-67 104-51 214-161 264-266 86-178 86-369 1-540-63-124-154-213-282-274-139-67-18-64-2338-61-2359 3-2133-4-2304 80-144 70-258 202-319 370l-27 73-3 3254c-2 3626-9 3301 69 3459 66 136 187 248 334 309 44 18 100 33 185 47 44 8 183-3 245-19Zm5909-291c175-45 339-182 417-349 58-124 59-131 59-712v-533h548c603 0 616-1 741-63 90-44 207-160 250-247 34-71 61-180 61-250 0-25-7-76-15-113-40-190-173-338-373-416l-67-26-572-3-573-3V6912c1-778 5-1441 10-1497 11-124 31-199 75-293 66-140 204-246 375-287 104-25 286-30 427-11 198 26 261 19 393-45 87-43 196-152 238-239 77-155 77-314 3-465-77-155-178-239-358-299-264-86-443-116-749-123-256-6-387 3-580 42-596 120-961 488-1083 1091-46 225-45 184-48 1892l-4 1632h-138c-229 0-340 39-467 165-115 113-164 233-164 400 0 160 56 291 170 399 125 117 238 156 457 156h143v510c0 425 3 524 16 587 56 270 267 468 549 514 64 10 184 2 259-17Zm-9499-1498c251-37 433-93 640-196 577-287 919-827 1017-1600 10-83 13-457 13-1815V4205l-27-75c-40-113-74-167-158-252-132-133-298-195-490-185-274 15-496 177-588 429l-27 73-6 1500c-6 1642-3 1564-65 1803-124 476-444 774-914 848-128 20-425 15-535-10-508-115-848-475-950-1006-9-47-19-94-22-105-4-11-9-693-13-1515l-5-1495-28-80c-61-173-166-294-320-370-199-98-398-100-596-5-114 55-231 170-284 280-79 161-72-75-72 2550 0 2205 1 2349 18 2410 59 219 216 392 415 459 314 106 652-32 800-325 53-104 65-170 71-376l6-188 85 113c97 128 300 341 410 430 310 250 671 393 1090 431 90 8 437-4 535-18Z"

                  transform="matrix(.1 0 0 -.1 0 1529)"
                >
                  <title>UnLtd logo</title>
                  <descr> Orange pill</descr>
                </path>
                <path
                  class="fill-amber-600"
                  d="M31030 8410c-376-46-685-194-940-450-132-132-215-245-293-398-76-148-113-245-152-397-61-236-84-495-66-735 24-310 77-512 202-765 279-567 813-905 1429-905 964 0 1691 843 1647 1910-10 242-50 452-124 650-210 564-666 960-1229 1070-125 24-357 34-474 20ZM44540 15269c-1494-84-2921-600-4120-1487-477-353-952-804-1347-1279-384-462-765-1061-1017-1601-395-845-615-1664-703-2612-22-246-26-997-5-1240 149-1751 830-3307 2009-4592 488-532 1120-1040 1758-1414 902-527 1937-871 2970-988 323-37 416-41 880-41 478 0 571 5 915 46 2520 299 4736 1849 5895 4124 427 838 697 1761 789 2700 55 553 46 1178-25 1735-163 1294-671 2546-1458 3594-1301 1733-3236 2823-5381 3031-351 34-815 43-1160 24Zm540-2769c255-31 478-139 654-314 183-185 293-420 316-680 6-63 10-520 10-1058 0-522 1-948 3-948s532 77 1178 171c646 93 1212 173 1259 176 220 15 476-60 675-198 99-68 241-218 304-321 98-158 150-329 158-519 14-317-86-582-305-811-138-143-298-239-488-292-58-17-456-78-1139-176-577-83-1055-152-1062-153-6-1 326-661 754-1497 421-822 781-1530 800-1572 149-337 111-739-98-1049-54-82-175-207-260-269-254-189-603-256-914-176-119 31-292 114-386 185-86 66-193 179-250 266-26 39-334 633-686 1322l-640 1252-643-1257c-353-691-663-1288-689-1327-139-209-381-377-642-445-116-30-313-38-434-17-358 63-648 279-805 601-120 244-143 546-63 801 31 99-22-8 865 1728 407 796 739 1449 737 1451s-481 72-1064 156c-672 97-1091 161-1145 177-396 112-698 441-774 843-22 115-21 311 3 425 82 397 377 717 763 829 113 33 262 50 362 42 44-3 609-82 1254-176 645-93 1175-170 1177-170s6 467 8 1038c4 1131 0 1068 62 1243 105 301 356 553 660 662 157 56 327 76 485 57Z"

                  transform="matrix(.1 0 0 -.1 0 1529)"
                >
                  <title>UnLtd logo</title>
                  <descr>Orange pill</descr>
                </path>
              </svg>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <i className="fa-solid fa-xmark h-6 w-6" aria-hidden="true" ></i>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">

                {/* <DisclosureComponent thing={learn} />

                <DisclosureComponent thing={funding} />

                <DisclosureComponent thing={join} /> */}

                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        {learn.name}
                        <i
                          className={classNames(open ? 'rotate-180' : '', 'fa-solid fa-chevron-down h-5 w-5 flex-none')}
                          aria-hidden="true"
                        ></i>
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...learn.items, ...learn.actions].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        {funding.name}
                        <i
                          className={classNames(open ? 'rotate-180' : '', 'fa-solid fa-chevron-down h-5 w-5 flex-none')}
                          aria-hidden="true"
                        ></i>
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...funding.items, ...funding.actions].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        {join.name}
                        <i
                          className={classNames(open ? 'rotate-180' : '', 'fa-solid fa-chevron-down h-5 w-5 flex-none')}
                          aria-hidden="true"
                        ></i>
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...join.items, ...join.actions].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Blog
                </a>

                {/* <DisclosureComponent thing={about} /> */}

                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        {about.name}
                        <i
                          className={classNames(open ? 'rotate-180' : '', 'fa-solid fa-chevron-down h-5 w-5 flex-none')}
                          aria-hidden="true"
                        ></i>
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...about.items, ...about.actions].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

              </div>
              <div className="py-6">
                <a
                  href="https://unltd.microsoftcrmportals.com/applications"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
