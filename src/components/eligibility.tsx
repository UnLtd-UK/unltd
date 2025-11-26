import { Fragment } from 'react'
import { CheckIcon, MinusIcon } from '@heroicons/react/16/solid'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

const awards = [
  {
    name: 'Starting Up — Millennial Award Trust',
    code: 'STMAT',
    description: 'Everything you need to get started.',
    priceMonthly: '$19',
    href: '#',
    highlights: [
      { description: 'Custom domains' },
      { description: 'Edge content delivery' },
      { description: 'Advanced analytics' },
      { description: 'Quarterly workshops', disabled: true },
      { description: 'Single sign-on (SSO)', disabled: true },
      { description: 'Priority phone support', disabled: true },
    ],
  },
  {
    name: 'Starting Up — Funding Futures',
    code: 'STFFP',
    description: 'All the extras for your growing team.',
    priceMonthly: '$49',
    href: '#',
    highlights: [
      { description: 'Custom domains' },
      { description: 'Edge content delivery' },
      { description: 'Advanced analytics' },
      { description: 'Quarterly workshops' },
      { description: 'Single sign-on (SSO)', disabled: true },
      { description: 'Priority phone support', disabled: true },
    ],
  },
  {
    name: 'Scaling up — Millennial Award Trust',
    code: 'SCMAT',
    description: 'Added flexibility at scale.',
    priceMonthly: '$99',
    href: '#',
    highlights: [
      { description: 'Custom domains' },
      { description: 'Edge content delivery' },
      { description: 'Advanced analytics' },
      { description: 'Quarterly workshops' },
      { description: 'Single sign-on (SSO)' },
      { description: 'Priority phone support' },
    ],
  },
  {
    name: 'Scaling up — Funding Futures',
    code: 'SCFFP',
    description: 'Added flexibility at scale.',
    priceMonthly: '$99',
    href: '#',
    highlights: [
      { description: 'Custom domains' },
      { description: 'Edge content delivery' },
      { description: 'Advanced analytics' },
      { description: 'Quarterly workshops' },
      { description: 'Single sign-on (SSO)' },
      { description: 'Priority phone support' },
    ],
  },
]

const eligibility = [
  {
    name: 'Social entrepreneur',
    criteria: [
      { name: 'How old are you?', awards: { STMAT: "16 years old or older", STFFP: "16 to 30 years old", SCMAT: "16 years old or older", SCFFP: "16 to 30 years old" } },
      { name: 'Are you currently living in the United Kingdom?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'Are you the founder or leader of the social venture?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'Why are you looking for funding?', awards: { STMAT: "To create long term social impact", STFFP: "To create long term social impact", SCMAT: "To create long term social impact", SCFFP: "To create long term social impact" } },
      { name: 'Are you applying primarily to fund academic qualifications?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Are you applying primarily to fund overseas travel?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Are you applying primarily to pay others to deliver the work on your behalf?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Do you need both UnLtd\'s financial and non-financial support?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
    ],
  },
  {
    name: 'Social venture',
    criteria: [
      { name: 'Is it clearly driven by its social purpose?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'Can you demonstrate a clear need for it?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'Does it mainly benefit people or places within the UK?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Is it continuing activities that have already been running for more than four years?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Does it involve activities outside of the law, against public policy or anything which encourages ethnic, religious, or commercial disharmony?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Does it involve political, or religious campaigning?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Does it do more than just raise awareness of a social issue?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Does it have the potential to be financially sustainable with our support?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'How long has your idea or social venture been incorporated?', awards: { STMAT: "Not yet or less than 4 years", STFFP: "Not yet or less than 4 years", SCMAT: "Less than 4 years", SCFFP: "Less than 4 years" } },
      { name: 'Has your idea or social venture started trading?', awards: { STMAT: "Trading for under one year", STFFP: "Trading for under one year", SCMAT: "Trading for over one year", SCFFP: "Trading for over one year" } },
      {
        name: 'What sectors are you in?', awards: {
          STMAT: [
            "Access to education",
            "Access to employment",
            "Access to legal services",
            "Business support",
            "Climate change and energy",
            "Care in the community",
            "Conservation",
            "Creative industries",
            "Criminal justice",
            "Digital products or services",
            "Environmental sustainability",
            "Equity, diversity, and inclusion",
            "Financial services and financial inclusion",
            "Food, nutrition, or agriculture",
            "Healthy ageing",
            "Housing and/or homelessness",
            "Loneliness and/or social isolation",
            "Manufacturing",
            "Mental health and wellbeing",
            "Poverty reduction",
            "Quality of life",
            "Skills and training",
            "Social care",
            "Sport and physical health",
            "Technology",
            "Urban environments/community",
            "Water and sanitation",
            "Youth",
            "Other"
          ], STFFP: ["Access to employment", "Financial services and financial inclusion", "Poverty reduction", "Skills and training"], SCMAT: [
            "Access to education",
            "Access to employment",
            "Access to legal services",
            "Business support",
            "Climate change and energy",
            "Care in the community",
            "Conservation",
            "Creative industries",
            "Criminal justice",
            "Digital products or services",
            "Environmental sustainability",
            "Equity, diversity, and inclusion",
            "Financial services and financial inclusion",
            "Food, nutrition, or agriculture",
            "Healthy ageing",
            "Housing and/or homelessness",
            "Loneliness and/or social isolation",
            "Manufacturing",
            "Mental health and wellbeing",
            "Poverty reduction",
            "Quality of life",
            "Skills and training",
            "Social care",
            "Sport and physical health",
            "Technology",
            "Urban environments/community",
            "Water and sanitation",
            "Youth",
            "Other"
          ], SCFFP: ["Access to employment", "Financial services and financial inclusion", "Poverty reduction", "Skills and training"]
        }
      },
      { name: 'What was your social ventures turnover in its last financial year?', awards: { STMAT: null, STFFP: "Less than £250,000", SCMAT: null, SCFFP: "Less than £250,000" } },
      { name: 'In the last 12 months, has your social venture earned over £18,000 in traded income?', awards: { STMAT: null, STFFP: "£18,000 or more", SCMAT: null, SCFFP: "£18,000 or more" } },
      { name: 'Are you able to provide financial data which covers the last 12 months, along with financial projections for the next 12 months?', awards: { STMAT: null, STFFP: true, SCMAT: null, SCFFP: true } },
    ],
  },
]

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-violet-950">
      <div className="mx-auto max-w-2xl px-6 pt-16 sm:pt-24 lg:max-w-7xl lg:px-8">
        <table className="w-full text-left max-sm:hidden">
          <caption className="sr-only">Awards eligibility comparison</caption>
          <colgroup>
            <col className="w-2/5" />
            {awards.map((award) => (
              <col key={award.code} className="w-[15%]" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <td className="p-0" />
              {awards.map((award) => (
                <th key={award.code} scope="col" className="p-0">
                  <div className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                    {award.name} <span className="sr-only">plan</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {eligibility.map((eligibiliti) => (
            <tbody key={eligibiliti.name} className="group">
              <tr>
                <th scope="colgroup" colSpan={awards.length + 1} className="px-0 pt-10 pb-0 group-first-of-type:pt-5">
                  <div className="-mx-4 rounded-lg bg-violet-50 px-4 py-3 text-sm/6 font-semibold text-violet-950 dark:bg-violet-800/50 dark:text-violet-100">
                    {eligibiliti.name}
                  </div>
                </th>
              </tr>
              {eligibiliti.criteria.map((feature) => (
                <tr key={feature.name} className="border-b border-violet-100 last:border-none dark:border-white/10">
                  <th scope="row" className="px-0 py-4 text-sm/6 font-normal text-violet-600 dark:text-violet-300">
                    {feature.name}
                  </th>
                  {awards.map((award) => {
                    const value = feature.awards[award.code as keyof typeof feature.awards]
                    return (
                      <td key={award.code} className="p-4 max-sm:text-center">
                        {Array.isArray(value) ? (
                          <ul className="space-y-1 text-sm/6 text-violet-950 dark:text-violet-100">
                            {value.map((entry) => (
                              <li key={entry}>{entry}</li>
                            ))}
                          </ul>
                        ) : typeof value === 'string' ? (
                          <>
                            <span className="sr-only">{award.name} includes:</span>
                            <span className="text-sm/6 text-violet-950 dark:text-violet-100">{value}</span>
                          </>
                        ) : value === true ? (
                          <>
                            <i aria-hidden="true" className="fa-sharp fa-solid fa-circle-check size-4 fill-green-600 dark:fill-green-500 text-green-500"></i>
                            <span className="sr-only">Yes</span>
                          </>
                        ) : (
                          <>
                            <i aria-hidden="true" className="fa-sharp fa-solid fa-xmark size-4 fill-violet-400 dark:fill-violet-500 text-violet-500"></i>
                            <span className="sr-only">No</span>
                          </>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        <TabGroup className="sm:hidden">
          <TabList className="flex">
            {awards.map((award) => (
              <Tab
                key={award.code}
                className="w-1/4 border-b border-violet-100 py-4 text-base/8 font-medium text-violet-600 not-focus-visible:focus:outline-none data-selected:border-violet-600 dark:border-white/10 dark:text-violet-400 dark:data-selected:border-violet-400"
              >
                {award.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels as={Fragment}>
            {awards.map((award) => (
              <TabPanel key={award.code} className="focus:outline-none">
                {eligibility.map((eligibiliti) => (
                  <Fragment key={eligibiliti.name}>
                    <div className="-mx-6 mt-10 rounded-lg bg-violet-50 px-6 py-3 text-sm/6 font-semibold text-violet-950 group-first-of-type:mt-5 dark:bg-violet-800/50 dark:text-violet-100">
                      {eligibiliti.name}
                    </div>
                    <dl>
                      {eligibiliti.criteria.map((feature) => (
                        <div
                          key={feature.name}
                          className="grid grid-cols-2 border-b border-violet-100 py-4 last:border-none dark:border-white/10"
                        >
                          <dt className="text-sm/6 font-normal text-violet-600 dark:text-violet-300">{feature.name}</dt>
                          <dd className="text-center">
                            {(() => {
                              const value = feature.awards[award.code as keyof typeof feature.awards]
                              if (Array.isArray(value)) {
                                return (
                                  <ul className="space-y-1 text-sm/6 text-violet-950 dark:text-violet-100">
                                    {value.map((entry) => (
                                      <li key={entry}>{entry}</li>
                                    ))}
                                  </ul>
                                )
                              }

                              if (typeof value === 'string') {
                                return (
                                  <span className="text-sm/6 text-violet-950 dark:text-violet-100">{value}</span>
                                )
                              }

                              if (value === true) {
                                return (
                                  <>
                                    <i aria-hidden="true" className="fa-sharp fa-solid fa-circle-check size-4 fill-green-600 dark:fill-green-500 text-green-500"></i>
                                    <span className="sr-only">Yes</span>
                                  </>
                                )
                              }

                              return (
                                <>
                                  <i aria-hidden="true" className="fa-sharp fa-solid fa-xmark size-4 fill-violet-400 dark:fill-violet-500 text-violet-500"></i>
                                  <span className="sr-only">No</span>
                                </>
                              )
                            })()}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </Fragment>
                ))}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  )
}
