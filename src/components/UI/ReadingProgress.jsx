import React, { useState, useEffect } from 'react'

export default function ReadingProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setWidth((scrollTop / docHeight) * 100)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${width}%`,
        background: '#4a9fe5',
        zIndex: 999999,
        transition: 'width 0.15s linear',
        pointerEvents: 'none'
      }}
    />
  )
}
