import React from 'react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { usePageContext } from 'vike-react/usePageContext'
import Layout from '../../src/components/Layout/Layout'

const isServer = typeof window === 'undefined'

export default function PageShell({ children }) {
  const pageContext = usePageContext()
  const Router = isServer ? MemoryRouter : BrowserRouter
  const routerProps = isServer ? { initialEntries: [pageContext?.urlPathname || '/'] } : {}

  return (
    <HelmetProvider>
      <Router {...routerProps}>
        <Layout>{children}</Layout>
      </Router>
    </HelmetProvider>
  )
}
