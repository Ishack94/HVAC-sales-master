import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import SalesIndex from './pages/SalesIndex'
import ProLessonsIndex from './pages/ProLessonsIndex'
import ArticlePage from './pages/ArticlePage'
import About from './pages/About'
import Resources from './pages/Resources'
import Troubleshoot from './pages/Troubleshoot'
import LoadCalcPage from './pages/LoadCalcPage'
import DuctDesignPage from './pages/DuctDesignPage'
import ReverseDuctPage from './pages/ReverseDuctPage'
import SuperheatPage from './pages/SuperheatPage'
import EnergySavingsPage from './pages/EnergySavingsPage'
import NotFound from './pages/NotFound'
import { trackPageView } from './utils/analytics'

function RouteTracker() {
  const location = useLocation()
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sales" element={<SalesIndex />} />
          <Route path="sales/:slug" element={<ArticlePage section="sales" />} />
          <Route path="pro-lessons" element={<ProLessonsIndex />} />
          <Route path="pro-lessons/:slug" element={<ArticlePage section="pro-lessons" />} />
          <Route path="about" element={<About />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/hvac-load-calculator" element={<LoadCalcPage />} />
          <Route path="resources/duct-design-calculator" element={<DuctDesignPage />} />
          <Route path="resources/reverse-duct-calculator" element={<ReverseDuctPage />} />
          <Route path="resources/superheat-subcooling-calculator" element={<SuperheatPage />} />
          <Route path="resources/energy-savings-calculator" element={<EnergySavingsPage />} />
          <Route path="troubleshoot" element={<Troubleshoot />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
