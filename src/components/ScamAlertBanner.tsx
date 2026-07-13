'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import DynamicIcon from './ui/DynamicIcon'

const HASH = '#scam-alert'

export default function ScamAlertBanner() {
    const [bannerVisible, setBannerVisible] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    // Auto-open when the page is loaded with #scam-alert
    useEffect(() => {
        if (window.location.hash === HASH) setModalOpen(true)
    }, [])

    const openModal = () => {
        history.replaceState(null, '', HASH)
        setModalOpen(true)
    }

    const closeModal = () => {
        history.replaceState(null, '', window.location.pathname + window.location.search)
        setModalOpen(false)
    }

    if (!bannerVisible) return null

    return (
        <>
            <div className="bg-red-600 py-2.5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex items-center gap-x-6 px-6">
                    <p className="text-sm/6 text-white flex-1 min-w-0">
                        <button
                            type="button"
                            onClick={openModal}
                            className="hover:underline text-left"
                        >
                            <strong className="font-semibold">Important: Scam email alert</strong>
                            <span className="hidden sm:inline">
                                <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
                                    <circle r="1" cx="1" cy="1" />
                                </svg>
                                We've been made aware of fraudulent emails claiming to be from UnLtd
                            </span>
                            <span aria-hidden="true">&nbsp;&rarr;</span>
                        </button>
                    </p>
                    <div className="flex flex-1 justify-end">
                        <button
                            type="button"
                            onClick={() => setBannerVisible(false)}
                            className="-m-3 p-3 focus-visible:-outline-offset-4"
                            aria-label="Dismiss banner"
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="size-5 text-white">
                                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <Dialog open={modalOpen} onClose={closeModal} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in backdrop-blur-xs"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-violet-50 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-3 right-3 rounded-md p-1.5 text-violet-400 hover:text-violet-600 hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                                aria-label="Close"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5">
                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                </svg>
                            </button>
                            <div>
                                <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
                                    <DynamicIcon icon="fa-solid fa-triangle-exclamation" className="text-lg text-red-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 sm:mt-5">
                                    <DialogTitle as="h3" className="text-base font-semibold text-violet-900">
                                        Important: Scam email alert
                                    </DialogTitle>
                                    <div className="mt-2 text-sm text-violet-700">
                                        <p>We've been made aware of fraudulent emails claiming to be from UnLtd, telling people they've received an Award.</p>
                                        <p className="mt-2 font-semibold">These emails are not from us.</p>
                                    </div>
                                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="font-semibold text-left mb-3 flex items-center gap-2 text-red-700">
                                            <DynamicIcon icon="fa-solid fa-shield-halved" className="text-red-600" />
                                            If you receive a message like this, please:
                                        </p>
                                        <ul className="text-left space-y-3 text-red-600">
                                            <li className="flex items-start gap-3 text-sm">
                                                <DynamicIcon icon="fa-solid fa-circle-xmark" className="mt-0.5 shrink-0 text-red-600" />
                                                <span>Do not click any links or download attachments</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-sm">
                                                <DynamicIcon icon="fa-solid fa-circle-xmark" className="mt-0.5 shrink-0 text-red-600" />
                                                <span>Do not share personal or financial information</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-sm">
                                                <DynamicIcon icon="fa-solid fa-envelope" className="mt-0.5 shrink-0 text-red-600" />
                                                <span>Report it to your email provider and delete it</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <p className="mt-4 text-sm text-violet-700">
                                        If you're unsure whether a message from UnLtd is genuine, please contact us directly at{' '}
                                        <a
                                            href="mailto:awardapplications@unltd.org.uk"
                                            className="font-medium text-violet-900 underline hover:text-violet-700"
                                        >
                                            awardapplications@unltd.org.uk
                                        </a>.
                                    </p>
                                </div>
                            </div>

                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
