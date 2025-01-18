import { Dialog } from '@headlessui/react'
import DisclosureComp from '@components/ui/Disclosure.jsx';
import Logo from "@components/Logo.jsx";

export default function DialogComp({ nav, styles, mobileMenuOpen, setMobileMenuOpen, navigation }) {
    // Helper function to determine if an item is a standard link
    const isStandardLink = (item) => item.name && item.href && (!item.items || item.items.length === 0);

    return (
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-10" />
            <Dialog.Panel className={`fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-violet-900/10 ${styles.bg}`}>
                <div className="flex items-center justify-between">
                    <a href="/" className="-m-1.5 p-1.5">
                        <Logo colour={styles.fill} />
                    </a>
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-violet-100 hover:bg-violet-900 rounded-full"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="sr-only">Close menu</span>
                        <i className="fa-solid fa-xmark w-6 h-6" aria-hidden="true" ></i>
                    </button>
                </div>
                <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-violet-500/10">
                        <div className="space-y-2 py-6">
                            {nav.map((item) => (
                                isStandardLink(item) ? (
                                    <a
                                        key={item.id}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-violet-50 hover:bg-violet-900"
                                    >
                                        {item.name}
                                    </a>
                                ) : (
                                    <DisclosureComp key={item.id} item={item} />
                                )
                            ))}
                        </div>
                        {navigation?.code?.header?.action && (
                            <div className="py-6">
                                <a
                                    href={navigation.code.header.action.link}
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-violet-50 hover:bg-violet-900"
                                >
                                    {navigation.code.header.action.name}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog.Panel>
        </Dialog>
    )
}