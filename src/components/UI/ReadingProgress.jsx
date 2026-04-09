import React, { useState, useEffect } from 'react'
import styles from './ReadingProgress.module.css'

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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <div className={styles.bar} style={{ width: `${width}%` }} />
}
