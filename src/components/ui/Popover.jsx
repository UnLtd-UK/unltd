import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'

export default function PopoverComp({ nav, styles }) {
    return <Popover className="relative">
        <Popover.Button className={`cursor-pointer flex items-center gap-x-1 text-sm font-semibold leading-6 ${styles.text}`}>
            {nav.name}
            <i className={`fa-solid fa-chevron-down h-4 w-4 flex-none ${styles.text2}`} aria-hidden="true"></i>
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
            <Popover.Panel className={`absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl ${styles.bg} shadow-lg ring-1 ${styles.ring}`}>
                <div className="p-4">
                    {nav.items.map((child) => (
                        <div
                            key={child.id}
                            className={`group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 ${styles.hover} ${child.href === 'https://growthimpactfund.org.uk' ? 'dark:bg-slate-950 hover:dark:bg-slate-900' : ''}`}
                        >
                            {child.href === 'https://growthimpactfund.org.uk' ? <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 2034.33 1920" class="w-12 fill-slate-900 dark:fill-slate-100">
    <title>Growth Impact Fund Homepage</title>
    <path class="cls-1" d="M1869.71 1248a247 247 0 0 1-131.16-37.7c-104.28 89.75-386.34 356-475.49 677.17-.07.25-.17.71-.25 1 312.76-84.41 559-330.61 643.61-643.26a248.21 248.21 0 0 1-36.71 2.79ZM929.8 1651.34c-3.22-.13-6.43-.19-9.61-.19-139.13 0-230.19 121.77-270.08 189.49C770 1891.41 897.46 1920 1024 1920a922.67 922.67 0 0 0 120.47-7.88c-31.47-98.84-95.47-256.04-214.67-260.78ZM1869.71 836.52c-90.76 0-164.62 73.85-164.62 164.62a164.6 164.6 0 0 0 164.62 164.62c90.77 0 164.62-73.85 164.62-164.62s-73.85-164.62-164.62-164.62ZM1031.75 992a13.24 13.24 0 0 0 5.21 11q5.2 4.13 14.26 4.11a28.81 28.81 0 0 0 15.91-4.38 24.48 24.48 0 0 0 9.88-12.9v-12.91h-22.5q-22.77 0-22.76 15.08ZM885 927.83q-13.71 0-22.48 9.46t-8.78 25.92q0 16.45 8.78 25.92t22.48 9.46q13.72 0 22.5-9.46t8.78-25.92q0-16.46-8.78-25.92t-22.5-9.46ZM1054.25 1257q-13.73 0-22.49 9.32t-8.78 25.79q0 16.74 8.78 26.2t22.49 9.46q13.44 0 22.21-9.46t8.78-26.2q0-16.47-8.64-25.79t-22.35-9.32ZM850.73 660q8.78-9.47 8.78-26.2 0-16.45-8.78-25.78t-22.48-9.32q-13.72 0-22.5 9.32T797 633.79q0 16.74 8.78 26.2t22.5 9.46q13.72 0 22.45-9.45Z"></path>
<path class="cls-1" d="M1280 0C775 0 0 455 0 960c0 351.75 251.89 679.22 575.4 845.59a619.26 619.26 0 0 1 68.12-96.45c83.05-95.79 183-144.25 289.56-139.93 141.54 5.64 220.89 137.55 265.33 249.26 46.18-135.61 168.73-396.06 478.28-663.46a246.61 246.61 0 0 1-53.79-153.87c0-136.09 110.73-246.81 246.81-246.81a246.81 246.81 0 0 1 55.34 6.33C1878.75 350.51 1702.48 0 1280 0Zm-97.12 565.22h21.68v-38.67h52.11v38.67h34v38.95h-34v49.37q0 8 4.25 12.48t11.39 4.52a27.57 27.57 0 0 0 15.9-4.65l12.89 36.48a52.37 52.37 0 0 1-16 6.3 89.26 89.26 0 0 1-20.17 2.2q-29.07 0-44.7-14.27t-15.63-42.51v-49.92h-21.68ZM964 559.74l30.44 90 31.55-90h44.43l30.72 90.79 31.55-90.79h45.8l-52.92 148.66h-50.47l-28-80.92-29.07 80.92h-50.45l-52.94-148.66Zm72.68 480.26q-17.28 0-29.89-6t-19.06-16.32a43.23 43.23 0 0 1-6.45-23.45q0-21.13 16.18-32.78t49.93-11.66H1077q-1.38-23.58-31.55-23.58a72.46 72.46 0 0 0-21.66 3.42 57.43 57.43 0 0 0-18.65 9.47l-17.56-35.39q12.35-8.24 30-12.75a142.77 142.77 0 0 1 35.53-4.53q37 0 56.49 16.87t19.48 51.7v82.56h-48.54v-19.2q-11.22 21.64-43.86 21.64ZM634.05 559.74h49.64v17.83a48.57 48.57 0 0 1 20.71-15.23q12.75-5.07 29.2-5.07v46.9a106.13 106.13 0 0 0-11.78-.83q-16.74 0-26.2 9.06t-9.46 27.7v68.3h-52.11Zm-204.9 1.09a94.59 94.59 0 0 1 38.13-35.51q24.41-12.77 55.13-12.77 26.88 0 48.28 9.06a93 93 0 0 1 35.66 26.06l-34.57 31.26q-19.47-21.37-46.62-21.39-24.69 0-39.77 15T470.3 612.4a58 58 0 0 0 6.86 28.39 49.23 49.23 0 0 0 19.19 19.47q12.34 7 28.26 7a69.13 69.13 0 0 0 29.39-6.32v-52.65h48v79.54a125.2 125.2 0 0 1-37.85 18.1 150.9 150.9 0 0 1-42.79 6.31q-30.18 0-54.31-12.75a95.21 95.21 0 0 1-37.9-35.49q-13.71-22.76-13.7-51.56t13.7-51.61Zm50.48 284.71v192h-54.31v-192Zm96.27 371.11h-96.27v42.24h84.75v42h-84.75v65.83h-54.31v-192H575.9Zm176.09 150h-49.65v-15.92a53.34 53.34 0 0 1-19.74 13.72 64.46 64.46 0 0 1-24.41 4.66q-28.82 0-45.94-17t-17.15-51V1218h52.11v74.6q0 16.74 6.31 24.41t18.38 7.68q12.35 0 20.16-8.64t7.81-26.47V1218H752Zm17.55-329.15h-52.12V961q0-15.63-5.9-23t-16.58-7.4q-11.81 0-18.93 8.23t-7.14 25v73.78h-52.11V961q0-30.45-22.49-30.45-12.07 0-19.2 8.23t-7.13 25v73.78h-52.11V888.88h49.64v15.63a52.07 52.07 0 0 1 19.62-13.57 66.45 66.45 0 0 1 24.82-4.53 65.39 65.39 0 0 1 28 5.76 47.61 47.61 0 0 1 20 17.55 57.75 57.75 0 0 1 22.21-17.28 70.86 70.86 0 0 1 29.35-6q27.43 0 43.75 16.46t16.32 49.64Zm-14.39-364q-10.84-17.5-10.84-39.71A73.29 73.29 0 0 1 785 567q19.07-9.74 43.21-9.73t43.37 9.73a73 73 0 0 1 29.9 27.16q10.69 17.42 10.69 39.63t-10.69 39.77a73.56 73.56 0 0 1-29.9 27.44q-19.2 9.88-43.33 9.88-23.88 0-43.07-9.88a74.43 74.43 0 0 1-30.03-27.44Zm188.57 693.13h-52.11v-76.53q0-30.44-24.43-30.45-13.42 0-21.53 8.78t-8.08 26.33v71.87h-52.11V1218h49.64v16.18a58.89 58.89 0 0 1 20.9-13.83 70.49 70.49 0 0 1 26.32-4.79q27.72 0 44.58 16.45t16.87 49.65Zm15.48-363a69 69 0 0 1-26.33 26.88A73.15 73.15 0 0 1 896 1040q-26.07 0-41.42-15.63v66.38h-52.13V888.88h49.65v14.81c9.69-11.52 32.9-17.59 43.9-17.28 20.39.58 25.82 3.15 36.89 9.47a69 69 0 0 1 26.33 26.87q9.74 17.43 9.74 40.46t-9.76 40.46Zm177.33 363h-49.64v-14.81q-14.54 17.26-43.62 17.27a73.85 73.85 0 0 1-37-9.46 68.33 68.33 0 0 1-26.46-27q-9.75-17.55-9.75-40.59t9.75-40.45a67.63 67.63 0 0 1 26.46-26.75 74.79 74.79 0 0 1 37-9.32q26.61 0 41.15 15.36v-67.75h52.11Zm80.23-377.56q9.18 9.47 23.17 9.46 19.47 0 29.63-20l40.31 20.58a59.88 59.88 0 0 1-26 30q-18.42 10.89-43.67 10.89-24.67 0-44.15-9.87a74 74 0 0 1-30.31-27.43q-10.85-17.55-10.84-39.77t10.84-39.63a73.39 73.39 0 0 1 30.31-27.16q19.47-9.75 44.15-9.74 25.24 0 43.62 10.83a60 60 0 0 1 26 30l-40.31 20.57q-10.15-20-29.63-20-14 0-23.17 9.32t-9.19 25.79q.05 16.76 9.24 26.22Zm201.86 48.68a88.69 88.69 0 0 1-20.17 2.2q-29.07 0-44.7-14.27t-15.64-42.51v-49.86h-21.67v-38.95h21.67v-38.67h52.12v38.67h34v38.95h-34v49.37q0 8 4.25 12.48t11.39 4.53a27.58 27.58 0 0 0 15.9-4.66l12.89 36.48a52.12 52.12 0 0 1-16.04 6.3Zm60.77-329.41h-52.11v-76.46q0-30.45-24.42-30.45-13.44 0-21.53 8.78t-8.09 26.32v71.87h-52.11V504.88h52.11v68.57a56.94 56.94 0 0 1 20-12.07 72.84 72.84 0 0 1 24.68-4.11q27.71 0 44.57 16.45t16.87 49.65Z"></path>
</svg> : 
                            <div className={`mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg ${styles.bg2} group-hover:bg-violet-50 dark:group-hover:bg-violet-950`}>
                                <i className={`${child.icon} ${styles.text} group-hover:text-amber-500 dark:group-hover:text-amber-500 flex justify-center items-center`} aria-hidden="true" />
                            </div>}
                            <div className="flex-auto">
                                <a href={child.href} target={child.href.startsWith('http') && "_blank" } className={`flex font-semibold gap-3 items-center `}>
                                    <span className={`text-sm ${child.href === 'https://growthimpactfund.org.uk' ? 'text-slate-900 dark:text-slate-100' : 'text-violet-900 dark:text-violet-100'}`}>{child.name}</span>
                                    <span className="absolute inset-0" /> {child.badge && <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900 px-2 py-1 text-xs font-medium text-violet-600 dark:text-violet-400 ring-1 ring-inset ring-violet-500/10">
                                        {child.badge}
                                    </span>}
                                    {child.href.startsWith('http') && <i className={`fa-regular fa-arrow-up-right-from-square ${child.href === 'https://growthimpactfund.org.uk' ? 'text-slate-800 dark:text-slate-200' : 'text-violet-800 dark:text-violet-200'}`}></i>}
                                </a>
                                <p className={`mt-1 text-xs ${child.href === 'https://growthimpactfund.org.uk' ? 'text-slate-700 dark:text-slate-300' : 'text-violet-700 dark:text-violet-300'}`}>{child.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-violet-900/5 bg-violet-100 dark:bg-violet-900">
                    {nav.actions.map((child) => (
                        <a
                            key={child.id}
                            href={child.href}
                            className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-violet-900 dark:text-violet-100 hover:bg-violet-200 dark:hover:bg-violet-800"
                        >
                            <i className={`${child.icon} h-5 w-5 flex-none text-violet-400 dark:text-violet-200 flex justify-center items-center`} aria-hidden="true" />
                            {child.name}
                        </a>
                    ))}
                </div>
            </Popover.Panel>
        </Transition>
    </Popover>;
};