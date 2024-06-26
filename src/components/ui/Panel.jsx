import PopoverComp from './Popover.jsx';
import { Popover } from '@headlessui/react'

export default function PanelComp({ navs, styles }) {
    return (<Popover.Group className="hidden lg:flex lg:gap-x-12">
        <a href="https://unltd.notion.site/30d6634e3a804604880ea30e5fd558a1?v=32fbb6ab6e074f50b0855c8e0de0ca44&pvs=74" target="_blank" className={`text-sm font-semibold leading-6 ${styles.text}`}>
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