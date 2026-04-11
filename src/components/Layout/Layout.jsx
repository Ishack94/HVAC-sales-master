import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import styles from './Layout.module.css'

export default function Layout() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <div className={styles.topBar} aria-hidden="true" />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
