import React from 'react'
import SectionLabel from '../UI/SectionLabel'
import styles from './WhatYoullLearn.module.css'

const items = [
  'What to say when a customer says "I need to think about it"',
  'How to bring up a full system replacement without sounding pushy',
  'Why most techs lose jobs (and don\'t even realize it)',
  'Simple ways to make customers trust you instantly',
  'How small conversations turn into big jobs',
]

export default function WhatYoullLearn() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionLabel>What You&apos;ll Get</SectionLabel>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item} className={styles.item}>
              <span className={styles.accent} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
