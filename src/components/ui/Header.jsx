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
        href: "/learn/choosing-the-right-legal-structure",
        icon: "fa-solid fa-1"
      },
      {
        name: 'Defining social impact indicators, setting targets and refining your social model',
        description: 'Get a better understanding of your traffic',
        href: "/learn/defining-social-impact-indictators-setting-targets-and-refining-your-social-model",
        icon: "fa-solid fa-2"
      },
      {
        name: 'Stakeholder engagement and building networks',
        description: 'Get a better understanding of your traffic',
        href: "/learn/stakeholder-engagement-and-building-networks",
        icon: "fa-solid fa-3"
      },
      {
        name: 'Securing start up funding',
        description: 'Get a better understanding of your traffic',
        href: "/learn/securing-start-up-funding",
        icon: "fa-solid fa-4"
      },

    ],
  actions: [
  ]
};

const funding = {
  name: 'Our funding',
  items:
    [
      {
        name: 'Awards',
        description: 'For individuals',
        href: "/awards",
        icon: "fa-solid fa-user"
      },
      {
        name: 'Investment',
        description: 'For businesses',
        href: "https://growthimpactfund.org.uk",
        icon: "fa-solid fa-shop"
      }
    ],
  actions: [
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
        href: "https://strategy.unltd.org.uk",
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
    <header className="">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">UnLtd</span>
            <img className="h-8 w-auto" src="/logo.svg" alt="" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700"
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

          <a href="https://ghost.org" className="text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            Blog
          </a>

          <PopoverComponent thing={about} />

        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="https://unltd.microsoftcrmportals.com/applications" className="text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">UnLtd</span>
              <img className="h-8 w-auto" src="/logo.svg" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <i className="fa-solid fa-xmark h-6 w-6" aria-hidden="true" ></i>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-slate-500/10">
              <div className="space-y-2 py-6">

                {/* <DisclosureComponent thing={learn} />

                <DisclosureComponent thing={funding} />

                <DisclosureComponent thing={join} /> */}

                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50">
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
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-slate-900 hover:bg-slate-50"
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
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50">
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
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-slate-900 hover:bg-slate-50"
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
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50">
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
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-slate-900 hover:bg-slate-50"
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
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50"
                >
                  Blog
                </a>

                {/* <DisclosureComponent thing={about} /> */}

                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50">
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
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-slate-900 hover:bg-slate-50"
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
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50"
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
