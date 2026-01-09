import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@awesome.me/kit-0ff725f684/icons/classic/solid'

import { steps } from "@data/steps.js";

export default function ProgressBar() {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="divide-y divide-violet-300 dark:divide-violet-700 rounded-md border border-violet-300 dark:border-violet-700 bg-violet-100 dark:bg-violet-950 md:flex md:divide-y-0">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className="relative md:flex md:flex-1">
                        {step.status === 'complete' ? (
                            <a href={step.href} className="group flex w-full items-center">
                                <span className="flex items-center px-6 py-4 text-sm font-medium">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500 group-hover:bg-amber-600">
                                        <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="size-6 text-white" />
                                    </span>
                                    <span className="ml-4 text-sm font-medium text-violet-900 dark:text-violet-100">{step.name}</span>
                                </span>
                            </a>
                        ) : step.status === 'current' ? (
                            <a href={step.href} aria-current="step" className="flex items-center px-6 py-4 text-sm font-medium">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-500">
                                    <span className="text-amber-500">{step.id}</span>
                                </span>
                                <span className="ml-4 text-sm font-medium text-violet-700 dark:text-violet-300">{step.name}</span>
                            </a>
                        ) : (
                            <a href={step.href} className="group flex items-center">
                                <span className="flex items-center px-6 py-4 text-sm font-medium">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-violet-300 group-hover:border-violet-400">
                                        <span className="text-violet-500 dark:text-violet-400 group-hover:text-violet-700">{step.id}</span>
                                    </span>
                                    <span className="ml-4 text-sm font-medium text-violet-500 dark:text-violet-400 group-hover:text-violet-700">{step.name}</span>
                                </span>
                            </a>
                        )}

                        {stepIdx !== steps.length - 1 ? (
                            <>
                                {/* Arrow separator for lg screens and up */}
                                <div aria-hidden="true" className="absolute top-0 right-0 hidden h-full w-5 md:block">
                                    <svg fill="none" viewBox="0 0 22 80" preserveAspectRatio="none" className="size-full text-violet-300 dark:text-violet-700">
                                        <path
                                            d="M0 -2L20 40L0 82"
                                            stroke="currentcolor"
                                            vectorEffect="non-scaling-stroke"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </>
                        ) : null}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
