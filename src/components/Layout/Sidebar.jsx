import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

const adBoxes = [
  {
    id: 'dino',
    title: 'Dino Quote',
    desc: 'HVAC business tools built for contractors who want to win more jobs.',
    btn: 'Learn More →',
    watermark: 'DINO QUOTE',
    height: 140,
  },
  {
    id: 'partner1',
    title: 'Partner Spotlight',
    desc: 'Your ad here. Reach HVAC professionals across the country.',
    btn: 'Inquire →',
    watermark: 'Your Ad Here',
    height: 120,
  },
  {
    id: 'partner2',
    title: 'Partner Spotlight',
    desc: 'Your ad here. Reach HVAC professionals across the country.',
    btn: 'Inquire →',
    watermark: 'Your Ad Here',
    height: 120,
  },
]

export default function Sidebar({ links = [] }) {
  return (
    <aside className={styles.sidebar}>
      {adBoxes.map((box) => (
        <div key={box.id} className={styles.box}>
          <div className={styles.imgArea} style={{ height: box.height }}>
            <span className={styles.watermark}>{box.watermark}</span>
          </div>
          <div className={styles.boxBody}>
            <h3 className={styles.boxTitle}>{box.title}</h3>
            <p className={styles.boxDesc}>{box.desc}</p>
            <button className={styles.boxBtn}>{box.btn}</button>
          </div>
        </div>
      ))}

      {links.length > 0 && (
        <div className={styles.keepReading}>
          <p className={styles.keepLabel}>Keep Reading</p>
          {links.map((item) => (
            <div key={item.to} className={styles.linkItem}>
              <span className={styles.linkCat}>{item.category}</span>
              <Link to={item.to} className={styles.linkTitle}>{item.title}</Link>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
