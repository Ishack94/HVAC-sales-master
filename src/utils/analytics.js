const GA_ID = 'G-BMR1V0EQS1'

export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}

export function trackPageView(path) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_ID, { page_path: path })
  }
}
