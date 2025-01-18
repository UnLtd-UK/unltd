import PopoverComp from './Popover.jsx';
import { Popover } from '@headlessui/react'

export default function PanelComp({ navs, styles }) {
    // Helper function to determine if an item is a standard link and is enabled
    const isStandardLink = (item) => item.enabled && item.name && item.href && (!item.items || item.items.length === 0);
    const isEnabled = (item) => item.enabled;

    return (
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
            {navs.filter(isEnabled).map((nav, i) => (
                isStandardLink(nav) ? (
                    <a 
                        key={nav.id || i} 
                        href={nav.href} 
                        className={`text-sm font-semibold leading-6 ${styles.text}`}
                    >
                        {nav.name}
                    </a>
                ) : (
                    nav.enabled && <PopoverComp key={nav.id || i} nav={nav} styles={styles} />
                )
            ))}
        </Popover.Group>
    )
}