import PopoverComp from './Popover.jsx';
import { Popover } from '@headlessui/react'

export default function PanelComp({ navs }) {
    return (<Popover.Group className="hidden lg:flex lg:gap-x-12">
        {
            navs.map((nav, i) => <PopoverComp key={i} nav={nav} />)
        }
        <a href="/blog" className="text-sm font-semibold leading-6 text-violet-900 dark:text-violet-100">
            Blog
        </a>
    </Popover.Group>)
}