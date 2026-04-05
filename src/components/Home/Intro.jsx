import React from 'react'
import styles from './Intro.module.css'

export default function Intro() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.pullQuote}>
          I work in the trades and I&apos;ve seen the same thing over and over — good techs that know their stuff&hellip; but struggle when it comes to talking to customers.
        </p>
        <p className={styles.body}>
          Not because they&apos;re bad at their job. Because nobody ever showed them how to handle that side of it.
        </p>
        <p className={styles.body}>
          This site is just a collection of things that actually work.
        </p>
      </div>
    </section>
  )
}
