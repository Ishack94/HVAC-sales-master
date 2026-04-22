import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import { trackPageView } from './utils/analytics'
const SalesIndex = lazy(() => import('./pages/SalesIndex'))
const ProLessonsIndex = lazy(() => import('./pages/ProLessonsIndex'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const About = lazy(() => import('./pages/About'))
const Resources = lazy(() => import('./pages/Resources'))
const Troubleshoot = lazy(() => import('./pages/Troubleshoot'))
const SymptomRouter = lazy(() => import('./pages/SymptomRouter'))
const FaultCodeLookup = lazy(() => import('./pages/FaultCodeLookup'))
const LoadCalcPage = lazy(() => import('./pages/LoadCalcPage'))
const DuctDesignPage = lazy(() => import('./pages/DuctDesignPage'))
const ReverseDuctPage = lazy(() => import('./pages/ReverseDuctPage'))
const SuperheatPage = lazy(() => import('./pages/SuperheatPage'))
const EnergySavingsPage = lazy(() => import('./pages/EnergySavingsPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteTracker() {
  const location = useLocation()
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])
  return null
}

const fallback = (
  <div style={{ color: '#2a2d32', fontFamily: "'Figtree', sans-serif", padding: '60px', textAlign: 'center' }}>
    Loading...
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Suspense fallback={fallback}>
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
            <Route path="troubleshoot/symptom" element={<SymptomRouter />} />
            <Route path="troubleshoot/codes/*" element={<FaultCodeLookup />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
