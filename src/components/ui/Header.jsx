import { useState } from 'react'

import Logo from "@components/Logo.jsx";
import PanelComp from './Panel.jsx';
import DialogComp from './Dialog.jsx';

export default function HeaderComp({ styles, navigation }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigations = navigation?.code?.header?.enabled ? navigation?.code?.header?.main || [] : [];

  return (
    <header className={styles.bg}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <Logo />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${styles.text}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <i className="fa-solid fa-bars h-6 w-6" aria-hidden="true" ></i>
          </button>
        </div>
        <PanelComp navs={navigations} styles={styles} />
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {navigation?.code?.header?.enabled && navigation?.code?.header?.action?.enabled && (
            <a href={navigation.code.header.action.link} className={`text-sm font-semibold leading-6 ${styles.text}`}>
              {navigation.code.header.action.name} <span aria-hidden="true" className={styles.text2}>&rarr;</span>
            </a>
          )}
        </div>
      </nav>
      <DialogComp 
        nav={navigations} 
        styles={styles} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        navigation={navigation}
      />
    </header>
  )
}