import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

const dinoBox = {
  id: 'dino',
  title: 'Dino Quote',
  desc: 'HVAC business tools built for contractors who want to win more jobs.',
  btn: 'Learn More →',
  watermark: 'DINO QUOTE',
  height: 140,
}

const mostPopular = [
  { title: 'Stop Selling Equipment, Start Selling Outcomes', to: '/sales/stop-selling-equipment-start-selling-outcomes' },
  { title: "How to Handle 'I Need to Think About It'", to: '/sales/handle-i-need-to-think-about-it' },
  { title: 'The First 90 Seconds at the Door', to: '/sales/first-90-seconds-at-the-door' },
  { title: 'Why Is My Furnace Blowing Cold Air?', to: '/pro-lessons/furnace-blowing-cold-air' },
]

const bestClosing = [
  { title: 'Stop Selling Equipment, Start Selling Outcomes', to: '/sales/stop-selling-equipment-start-selling-outcomes' },
  { title: "How to Handle 'I Need to Think About It'", to: '/sales/handle-i-need-to-think-about-it' },
  { title: 'The First 90 Seconds at the Door', to: '/sales/first-90-seconds-at-the-door' },
]

const techToSales = [
  { title: 'From HVAC Tech to $150k in Sales', to: '/sales/hvac-tech-to-sales' },
  { title: 'Turn a Service Call Into a Sale', to: '/sales/turn-service-call-into-sale' },
  { title: 'Maintenance Agreements: Predictable Revenue', to: '/sales/maintenance-agreements-predictable-revenue' },
]

function AdBox({ box }) {
  return (
    <div className={styles.box}>
      <div className={styles.imgArea} style={{ height: box.height }}>
        <span className={styles.watermark}>{box.watermark}</span>
      </div>
      <div className={styles.boxBody}>
        <h3 className={styles.boxTitle}>{box.title}</h3>
        <p className={styles.boxDesc}>{box.desc}</p>
        <button className={styles.boxBtn}>{box.btn}</button>
      </div>
    </div>
  )
}

function CuratedBox({ label, items }) {
  return (
    <div className={styles.curatedBox}>
      <p className={styles.curatedLabel}>{label}</p>
      {items.map((item) => (
        <Link key={item.to} to={item.to} className={styles.popularLink}>
          {item.title}
        </Link>
      ))}
    </div>
  )
}

export default function Sidebar({ links = [], variant }) {
  return (
    <aside className={styles.sidebar}>
      <AdBox box={dinoBox} />

      {variant === 'home' ? (
        <>
          <CuratedBox label="Best Closing Articles" items={bestClosing} />
          <CuratedBox label="For Techs Moving Into Sales" items={techToSales} />
        </>
      ) : (
        <>
          <div className={styles.mostPopular}>
            <p className={styles.mostPopularLabel}>Most Popular</p>
            {mostPopular.map((item) => (
              <Link key={item.to} to={item.to} className={styles.popularLink}>
                {item.title}
              </Link>
            ))}
          </div>

          {links.length > 0 && (
            <div className={styles.keepReading}>
              <p className={styles.keepLabel}>Keep Reading</p>
              {links.map((item) => (
                <div key={item.to} className={styles.linkItem}>
                  <span className={styles.linkCat} style={item.color ? { color: item.color } : {}}>{item.category}</span>
                  <Link to={item.to} className={styles.linkTitle}>{item.title}</Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </aside>
  )
}
