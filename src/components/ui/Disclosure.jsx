import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const DisclosureComponent = (props) => {

    return <Disclosure as="div" className="-mx-3">
        {({ open }) => (
            <>
                <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-violet-900 hover:bg-violet-50">
                    {props.thing.name}
                    <ChevronDownIcon
                        className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                        aria-hidden="true"
                    />
                </Disclosure.Button>
                <Disclosure.Panel className="mt-2 space-y-2">
                    {[...props.thing.items, ...props.thing.actions].map((item) => (
                        <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-violet-900 hover:bg-violet-50"
                        >
                            {item.name}
                        </Disclosure.Button>
                    ))}
                </Disclosure.Panel>
            </>
        )}
    </Disclosure>;
};

export default DisclosureComponent;