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
      { name: 'Does it involve political, or religious campaigning?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Is it clearly driven by its social purpose?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'Can you demonstrate a clear need for it?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'Does it mainly benefit people or places within the UK?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Does it involve activities outside of the law, against public policy or anything which encourages ethnic, religious, or commercial disharmony?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Does it have the potential to be financially sustainable with our support?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'Does it do more than just raise awareness of a social issue?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Sectors', awards: { STMAT: false, STFFP: "Access to employment, </br>Financial services and financial inclusion, </br>Poverty reduction, </br>Skills and training", SCMAT: false, SCFFP: "Access to employment, </br>Financial services and financial inclusion, </br>Poverty reduction, </br>Skills and training" } },
      { name: 'Is it continuing activities that have already been running for more than four years?', awards: { STMAT: false, STFFP: false, SCMAT: false, SCFFP: false } },
      { name: 'Has your idea or social venture started trading?', awards: { STMAT: "Trading for under one year", STFFP: "Trading for under one year", SCMAT: "Trading for over one year", SCFFP: "Trading for over one year" } },
      { name: 'How long has your idea or social venture been incorporated?', awards: { STMAT: "Not yet or less than 4 years", STFFP: "Not yet or less than 4 years", SCMAT: "Less than 4 years", SCFFP: "Less than 4 years" } },
      { name: 'What was your social ventures turnover in its last financial year?', awards: { STMAT: "Less than £250,000", STFFP: "Less than £250,000", SCMAT: "Less than £250,000", SCFFP: "Less than £250,000" } },
      { name: 'Are you able to provide financial data which covers the last 12 months, along with financial projections for the next 12 months?', awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true } },
      { name: 'In the last 12 months, has your social venture earned over £18,000 in traded income?', awards: { STMAT: "£18,000 or more", STFFP: "£18,000 or more", SCMAT: "£18,000 or more", SCFFP: "£18,000 or more" } },
    ],
  },
]

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
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
                  <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
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
                  <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-3 text-sm/6 font-semibold text-gray-950 dark:bg-gray-800/50 dark:text-white">
                    {eligibiliti.name}
                  </div>
                </th>
              </tr>
              {eligibiliti.criteria.map((feature) => (
                <tr key={feature.name} className="border-b border-gray-100 last:border-none dark:border-white/10">
                  <th scope="row" className="px-0 py-4 text-sm/6 font-normal text-gray-600 dark:text-gray-300">
                    {feature.name}
                  </th>
                  {awards.map((award) => {
                    const value = feature.awards[award.code as keyof typeof feature.awards]
                    return (
                      <td key={award.code} className="p-4 max-sm:text-center">
                        {typeof value === 'string' ? (
                          <>
                            <span className="sr-only">{award.name} includes:</span>
                            <span className="text-sm/6 text-gray-950 dark:text-white">{value}</span>
                          </>
                        ) : value === true ? (
                          <>
                            <CheckIcon
                              aria-hidden="true"
                              className="inline-block size-4 fill-green-600 dark:fill-green-500"
                            />
                            <span className="sr-only">Included in {award.name}</span>
                          </>
                        ) : (
                          <>
                            <MinusIcon
                              aria-hidden="true"
                              className="inline-block size-4 fill-gray-400 dark:fill-gray-500"
                            />
                            <span className="sr-only">Not included in {award.name}</span>
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
                className="w-1/4 border-b border-gray-100 py-4 text-base/8 font-medium text-indigo-600 not-focus-visible:focus:outline-none data-selected:border-indigo-600 dark:border-white/10 dark:text-indigo-400 dark:data-selected:border-indigo-400"
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
                    <div className="-mx-6 mt-10 rounded-lg bg-gray-50 px-6 py-3 text-sm/6 font-semibold text-gray-950 group-first-of-type:mt-5 dark:bg-gray-800/50 dark:text-white">
                      {eligibiliti.name}
                    </div>
                    <dl>
                      {eligibiliti.criteria.map((feature) => (
                        <div
                          key={feature.name}
                          className="grid grid-cols-2 border-b border-gray-100 py-4 last:border-none dark:border-white/10"
                        >
                          <dt className="text-sm/6 font-normal text-gray-600 dark:text-gray-300">{feature.name}</dt>
                          <dd className="text-center">
                            {(() => {
                              const value = feature.awards[award.code as keyof typeof feature.awards]
                              if (typeof value === 'string') {
                                return (
                                  <span className="text-sm/6 text-gray-950 dark:text-white">{value}</span>
                                )
                              }

                              if (value === true) {
                                return (
                                  <>
                                    <CheckIcon
                                      aria-hidden="true"
                                      className="inline-block size-4 fill-green-600 dark:fill-green-500"
                                    />
                                    <span className="sr-only">Yes</span>
                                  </>
                                )
                              }

                              return (
                                <>
                                  <MinusIcon
                                    aria-hidden="true"
                                    className="inline-block size-4 fill-gray-400 dark:fill-gray-500"
                                  />
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
