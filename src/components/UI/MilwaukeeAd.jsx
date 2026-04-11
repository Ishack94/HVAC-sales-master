import React from 'react'
import styles from './MilwaukeeAd.module.css'

const HD_LINK = 'https://www.homedepot.com/p/Milwaukee-M18-18-Volt-Lithium-Ion-Cordless-Rocket-Dual-Power-Tower-Light-Tool-Only-2131-20/304984170'
const MILWAUKEE_IMG = 'https://images.thdstatic.com/productImages/0b03b8ae-6f36-4c5f-a5a3-d5caa1b79f47/svn/milwaukee-work-lights-2131-20-64_600.jpg'

export default function MilwaukeeAd({ className }) {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      <a href={HD_LINK} target="_blank" rel="noopener noreferrer" className={styles.imgLink}>
        <img src={MILWAUKEE_IMG} alt="Milwaukee M18 ROCKET Tower Light" className={styles.img} />
      </a>
      <div className={styles.content}>
        <span className={styles.label}>MILWAUKEE TOOL</span>
        <h4 className={styles.title}>M18 ROCKET™ Tower Light</h4>
        <p className={styles.desc}>5-second setup. The jobsite light every tech needs.</p>
        <a
          href={HD_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btn}
        >
          Shop at Home Depot →
        </a>
      </div>
    </div>
  )
}
