import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'

const PopoverComponent = (props) => {
    return <Popover className="relative">
        <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-violet-900 dark:text-violet-100">
            {props.thing.name}
            <i className="fa-solid fa-chevron-down h-4 w-4 flex-none text-violet-700 dark:text-violet-300" aria-hidden="true"></i>
        </Popover.Button>

        <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 tranviolet-y-1"
            enterTo="opacity-100 tranviolet-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 tranviolet-y-0"
            leaveTo="opacity-0 tranviolet-y-1"
        >
            <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-violet-50 dark:bg-violet-950 shadow-lg ring-1 ring-violet-900/5 dark:ring-violet-50/10">
                <div className="p-4">
                    {props.thing.items.map((item) => (
                        <div
                            key={item.name}
                            className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-violet-100 dark:hover:bg-violet-900"
                        >
                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900 group-hover:bg-violet-50 dark:group-hover:bg-violet-950">
                                <i className={`${item.icon} h-6 w-6 text-violet-600 dark:text-violet-300 group-hover:text-amber-600 dark:group-hover:text-amber-700 flex justify-center items-center`} aria-hidden="true" />
                            </div>
                            <div className="flex-auto">
                                <a href={item.href} className="block font-semibold text-violet-900 dark:text-violet-100">
                                    {item.name}
                                    <span className="absolute inset-0" /> {item.badge && <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900 px-2 py-1 text-xs font-medium text-violet-600 dark:text-violet-400 ring-1 ring-inset ring-violet-500/10">
                                        {item.badge}
                                    </span>}
                                </a>
                                <p className="mt-1 text-violet-600 dark:text-violet-400">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-violet-900/5 bg-violet-100 dark:bg-violet-900">
                    {props.thing.actions.map((action) => (
                        <a
                            key={action.name}
                            href={action.href}
                            className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-violet-900 dark:text-violet-100 hover:bg-violet-200 dark:hover:bg-violet-800"
                        >
                            <i className={`${action.icon} h-5 w-5 flex-none text-violet-400 dark:text-violet-200 flex justify-center items-center`} aria-hidden="true" />
                            {action.name}
                        </a>
                    ))}
                </div>
            </Popover.Panel>
        </Transition>
    </Popover>;
};

export default PopoverComponent;