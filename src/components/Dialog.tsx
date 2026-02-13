'use client'

import { type MouseEventHandler, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import DynamicIcon from './ui/DynamicIcon'

type DialogButton = {
  text: string
  href?: string
  autoFocus?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

type ListItem = {
  icon: string
  iconColor?: string
  text: string
}

type ContentSection = {
  title?: string
  titleIcon?: string
  variant?: 'default' | 'warning'
  items: ListItem[]
}

interface DialogComponentProps {
  title: string
  description?: string
  content?: ContentSection[]
  primaryButton?: DialogButton
  secondaryButton?: DialogButton
  icon: string
}

export default function DialogComponent({ title, description, content, primaryButton, secondaryButton, icon }: DialogComponentProps) {
  const [open, setOpen] = useState(true)

  const scrollToAnchor = (hash: string) => {
    const element = document.querySelector(hash)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const renderContent = () => {
    if (description) {
      return <div className="mt-2 text-sm text-violet-700" dangerouslySetInnerHTML={{ __html: description }} />
    }

    if (!content || content.length === 0) return null

    return (
      <div className="mt-4 space-y-4">
        {content.map((section, sectionIndex) => {
          const isWarning = section.variant === 'warning'
          const wrapperClasses = isWarning
            ? 'bg-red-50 border border-red-200 rounded-lg p-4'
            : ''

          return (
            <div key={sectionIndex} className={wrapperClasses}>
              {section.title && (
                <p className={`font-semibold text-left mb-3 flex items-center gap-2 ${isWarning ? 'text-red-700' : 'text-violet-900'}`}>
                  {section.titleIcon && <DynamicIcon icon={section.titleIcon} />}
                  {section.title}
                </p>
              )}
              <ul className={`text-left space-y-3 ${isWarning ? 'text-red-600' : 'text-violet-700'}`}>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-sm">
                    <DynamicIcon icon={item.icon} className={`mt-0.5 ${item.iconColor || (isWarning ? 'text-red-600' : 'text-violet-600')}`} />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    )
  }

  const renderButton = (button: DialogButton, variant: 'primary' | 'secondary', extraClasses = '') => {
    const baseClasses =
      variant === 'primary'
        ? 'inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 items-center gap-1'
        : 'cursor-pointer inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-violet-900 shadow-xs ring-1 ring-violet-200 ring-inset hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600'

    const className = `${baseClasses}${extraClasses ? ` ${extraClasses}` : ''}`

    if (button.href) {
      const isAnchor = button.href.startsWith('#')
      const isExternal = button.href.startsWith('http')

      const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
        button.onClick?.(event)
        setOpen(false)

        if (isAnchor) {
          event.preventDefault()
          setTimeout(() => scrollToAnchor(button.href!), 120)
        }
      }

      return (
        <a
          href={button.href}
          onClick={handleClick}
          target={isExternal ? '_blank' : '_self'}
          rel={isExternal ? 'noreferrer noopener' : undefined}
          className={className}
          autoFocus={button.autoFocus}
        >
          <span>{button.text}</span>
          {variant === 'primary' && isExternal && <DynamicIcon icon="fa-solid fa-arrow-up-right-from-square" className="text-xs" />}
        </a>
      )
    }

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      button.onClick?.(event)
      setOpen(false)
    }

    return (
      <button
        type="button"
        onClick={handleClick}
        className={className}
        autoFocus={button.autoFocus}
      >
        {button.text}
      </button>
    )
  }

  const renderButtons = () => {
    const hasPrimary = Boolean(primaryButton)
    const hasSecondary = Boolean(secondaryButton)

    if (!hasPrimary && !hasSecondary) {
      return (
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Close
          </button>
        </div>
      )
    }

    const wrapperClasses = `mt-5 sm:mt-6${hasPrimary && hasSecondary ? ' sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3' : ''}`

    return (
      <div className={wrapperClasses}>
        {hasPrimary && renderButton(primaryButton!, 'primary', hasSecondary ? 'sm:col-start-1' : '')}
        {hasSecondary && renderButton(secondaryButton!, 'secondary', hasPrimary ? 'mt-3 sm:mt-0 sm:col-start-2' : '')}
      </div>
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
              <div className="flex size-12 items-center justify-center rounded-full bg-violet-100">
                <DynamicIcon icon={icon} className="text-lg text-violet-600" aria-hidden="true" />
              </div>
              <div className="mt-3 sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-violet-900" dangerouslySetInnerHTML={{ __html: title }} />
                {renderContent()}
              </div>
            </div>
            {renderButtons()}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
