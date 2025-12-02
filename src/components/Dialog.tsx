'use client'

import { type MouseEventHandler, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

type DialogButton = {
  text: string
  href?: string
}

interface DialogComponentProps {
  title: string
  description: string
  primaryButton?: DialogButton
  icon: string
}

export default function DialogComponent({ title, description, primaryButton, icon }: DialogComponentProps) {
  const [open, setOpen] = useState(true)

  const scrollToAnchor = (hash: string) => {
    const element = document.querySelector(hash)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const renderPrimaryButton = () => {
    if (!primaryButton) {
      return (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          Close
        </button>
      )
    }

    if (primaryButton.href) {
      const isAnchor = primaryButton.href.startsWith('#')
      const isExternal = primaryButton.href.startsWith('http')

      const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
        setOpen(false)
        if (isAnchor) {
          event.preventDefault()
          setTimeout(() => scrollToAnchor(primaryButton.href!), 120)
        }
      }

      return (
        <a
          href={primaryButton.href}
          onClick={handleClick}
          target={isExternal ? '_blank' : '_self'}
          className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-violet-300 ring-inset hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 items-center gap-1"
        >
          <span>{primaryButton.text}</span>
          {isExternal && <i className="fa-solid fa-arrow-up-right-from-square text-xs" />}
        </a>
      )
    }

    return (
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="cursor-pointer inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      >
        {primaryButton.text}
      </button>
    )
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in backdrop-blur-xs "
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-violet-50 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-violet-100">
                <i aria-hidden="true" className={`${icon} text-lg text-violet-600`}></i>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-violet-900">
                  {title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-violet-700">
                    {description}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              {renderPrimaryButton()}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
