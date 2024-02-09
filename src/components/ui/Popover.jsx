import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const PopoverComponent = (props) => {
    return <Popover className="relative">
        <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
            {props.thing.name}
            <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
        </Popover.Button>

        <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
        >
            <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                    {props.thing.items.map((item) => (
                        <div
                            key={item.name}
                            className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                        >
                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                <i className={`${item.icon} h-6 w-6 text-gray-600 group-hover:text-amber-600 flex justify-center items-center`} aria-hidden="true" />
                            </div>
                            <div className="flex-auto">
                                <a href={item.href} className="block font-semibold text-gray-900">
                                    {item.name}
                                    <span className="absolute inset-0" /> {item.badge && <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                        {item.badge}
                                    </span>}
                                </a>
                                <p className="mt-1 text-gray-600">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                    {props.thing.actions.map((action) => (
                        <a
                            key={action.name}
                            href={action.href}
                            className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                        >
                            <i className={`${action.icon} h-5 w-5 flex-none text-gray-400 flex justify-center items-center`} aria-hidden="true" />
                            {action.name}
                        </a>
                    ))}
                </div>
            </Popover.Panel>
        </Transition>
    </Popover>;
};

export default PopoverComponent;