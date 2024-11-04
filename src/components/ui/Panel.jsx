import PopoverComp from './Popover.jsx';
import { Popover } from '@headlessui/react'

export default function PanelComp({ navs, styles }) {
    return (<Popover.Group className="hidden lg:flex lg:gap-x-12">
        <a href="/learn" target="_blank" className={`text-sm font-semibold leading-6 ${styles.text}`}>
            Learn
        </a>
        {
            navs.map((nav, i) => <PopoverComp key={i} nav={nav} styles={styles} />)
        }
        <a href="/blog" className={`text-sm font-semibold leading-6 ${styles.text}`}>
            Blog
        </a>
    </Popover.Group>)
}