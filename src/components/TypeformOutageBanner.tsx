'use client'

// TEMPORARY (added 2026-08-07): remove this component and its usage in Template.astro once Typeform is back online.

import { useState } from 'react'

const STATUS_URL = 'https://isdown.app/status/typeform'

export default function TypeformOutageBanner() {
    const [bannerVisible, setBannerVisible] = useState(true)

    if (!bannerVisible) return null

    return (
        <div className="bg-amber-500 py-2.5">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex items-center gap-x-6 px-6">
                <p className="text-sm/6 text-amber-950 flex-1 min-w-0">
                    <strong className="font-semibold">Service disruption:</strong>{' '}
                    <span className="hidden sm:inline">
                        Typeform is currently down, so our Awards Eligibility Checker and Fostering Innovation Accelerator
                        Eligibility Checker are temporarily unavailable. We apologise for the inconvenience this causes
                        &mdash; please check back once Typeform is back online.
                    </span>
                    <span className="sm:hidden">
                        Our Eligibility Checkers are temporarily unavailable due to a Typeform outage. Sorry for the inconvenience.
                    </span>{' '}
                    <a
                        href={STATUS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline underline-offset-2 hover:text-amber-900"
                    >
                        Check Typeform status&nbsp;&rarr;
                    </a>
                </p>
                <div className="flex flex-1 justify-end">
                    <button
                        type="button"
                        onClick={() => setBannerVisible(false)}
                        className="-m-3 p-3 focus-visible:-outline-offset-4"
                        aria-label="Dismiss banner"
                    >
                        <span className="sr-only">Dismiss</span>
                        <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="size-5 text-amber-950">
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
