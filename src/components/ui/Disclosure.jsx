import { Disclosure } from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DisclosureComp({ item }) {
    return <Disclosure as="div" className="-mx-3">
        {({ open }) => (
            <>
                <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-violet-100 hover:bg-violet-900">
                    {item.name}
                    <i
                        className={classNames(open ? 'rotate-180' : '', 'fa-solid fa-chevron-down h-5 w-5 flex-none text-violet-100')}
                        aria-hidden="true"
                    ></i>
                </Disclosure.Button>
                <Disclosure.Panel className="mt-2 space-y-2">
                    {[...item.items, ...item.actions].map((child) => (
                        <Disclosure.Button
                            key={child.name}
                            as="a"
                            href={child.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-violet-200 hover:bg-violet-900"
                        >
                            {child.name}
                        </Disclosure.Button>
                    ))}
                </Disclosure.Panel>
            </>
        )}
    </Disclosure>
};