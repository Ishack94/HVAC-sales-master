import SectionLabel from '../components/UI/SectionLabel'
import Newsletter from '../components/Home/Newsletter'
import styles from './About.module.css'

export default function About() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <SectionLabel>About</SectionLabel>
          <h1 className={styles.heading}>
            Built for the Industry,<br />
            <em>by the Industry.</em>
          </h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.imageBlock} aria-hidden="true" />
          <div className={styles.text}>
            <p>
              HVAC Sales Master exists because the gap between field experience and business
              success shouldn&apos;t be a secret. The best technicians and salespeople learn through
              years of expensive trial and error — we&apos;re here to shortcut that.
            </p>
            <p>
              Every article is written from the inside — practical, direct, and grounded in
              how HVAC businesses actually work. No fluff. No generic advice recycled from
              other industries. Just the real playbook.
            </p>
            <p>
              We cover two sides of the business: <strong>Sales Training</strong> for comfort advisors
              and salespeople who want to close more jobs without feeling like a pushy salesperson,
              and <strong>Tech & Installer Pro Lessons</strong> for technicians and installers who want
              to sharpen their skills and advance their careers.
            </p>
            <p>
              We also publish homeowner-facing content that ranks in search and drives qualified
              leads to HVAC businesses — because better-informed homeowners make the sale easier.
            </p>
            <p>
              Everything on this site is free. Always.
            </p>
          </div>
        </div>
      </div>

      <Newsletter />
    </>
  )
}
