import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'

const PopoverComponent = (props) => {
    return <Popover className="relative">
        <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {props.thing.name}
            <i className="fa-solid fa-chevron-down h-4 w-4 flex-none text-slate-400 dark:text-slate-500" aria-hidden="true"></i>
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
            <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-950 shadow-lg ring-1 ring-slate-900/5 dark:ring-slate-50/10">
                <div className="p-4">
                    {props.thing.items.map((item) => (
                        <div
                            key={item.name}
                            className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-slate-100 dark:hover:bg-slate-900"
                        >
                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-950">
                                <i className={`${item.icon} h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-700 flex justify-center items-center`} aria-hidden="true" />
                            </div>
                            <div className="flex-auto">
                                <a href={item.href} className="block font-semibold text-slate-900 dark:text-slate-100">
                                    {item.name}
                                    <span className="absolute inset-0" /> {item.badge && <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-900 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/10">
                                        {item.badge}
                                    </span>}
                                </a>
                                <p className="mt-1 text-slate-600 dark:text-slate-400">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-900/5 bg-slate-100 dark:bg-slate-900">
                    {props.thing.actions.map((action) => (
                        <a
                            key={action.name}
                            href={action.href}
                            className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                            <i className={`${action.icon} h-5 w-5 flex-none text-slate-400 dark:text-slate-200 flex justify-center items-center`} aria-hidden="true" />
                            {action.name}
                        </a>
                    ))}
                </div>
            </Popover.Panel>
        </Transition>
    </Popover>;
};

export default PopoverComponent;