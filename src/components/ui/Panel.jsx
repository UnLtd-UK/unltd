import PopoverComp from './Popover.jsx';
import { Popover } from '@headlessui/react'

export default function PanelComp({ navs, text, text2, bg, bg2 }) {
    return (<Popover.Group className="hidden lg:flex lg:gap-x-12">
        {
            navs.map((nav, i) => <PopoverComp key={i} nav={nav} text={text} text2={text2} bg={bg} bg2={bg2} />)
        }
        <a href="/blog" className={`text-sm font-semibold leading-6 ${text}`}>
            Blog
        </a>
    </Popover.Group>)
}