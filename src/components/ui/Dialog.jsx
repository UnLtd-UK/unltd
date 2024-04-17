import { Dialog } from '@headlessui/react'
import DisclosureComponent from './Disclosure.jsx';
import Logo from "../Logo.jsx";

export default function DialogComp({ nav, mobileMenuOpen, setMobileMenuOpen }) {
    return (
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-10" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-violet-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-violet-900/10">
                <div className="flex items-center justify-between">
                    <a href="/" className="-m-1.5 p-1.5">
                        <Logo colour="fill-amber-600" />
                    </a>
                    <button
                        type="button"
                        className="-m-2.5 rounded-md p-2.5 text-violet-700"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="sr-only">Close menu</span>
                        <i className="fa-solid fa-xmark h-6 w-6" aria-hidden="true" ></i>
                    </button>
                </div>
                <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-violet-500/10">
                        <div className="space-y-2 py-6">
                            {
                                nav.map((item) => <DisclosureComponent key={item.id} item={item} />)
                            }
                            <a
                                href="/blog"
                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-violet-900 hover:bg-violet-50"
                            >
                                Blog
                            </a>
                        </div>
                        <div className="py-6">
                            <a
                                href="https://unltd.microsoftcrmportals.com/applications"
                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-violet-900 hover:bg-violet-50"
                            >
                                Log in
                            </a>
                        </div>
                    </div>
                </div>
            </Dialog.Panel>
        </Dialog>
    )
}