import React from 'react'
import styles from './IndexPage.module.css'
import SectionLabel from '../components/UI/SectionLabel'
import Card from '../components/Home/Card'
import Newsletter from '../components/Home/Newsletter'

const articles = [
  { title: 'Why Is My Furnace Blowing Cold Air?', excerpt: 'If your furnace is running but not producing heat, there are a handful of common causes — most of them simple to fix.', to: '/learn/furnace-blowing-cold-air' },
  { title: 'Why Is My Furnace Not Turning On?', excerpt: 'A furnace that won\'t start is one of the most common HVAC calls. Here\'s how to diagnose it step by step.', to: '/learn/furnace-not-turning-on' },
  { title: 'Why Does My Furnace Keep Turning On and Off?', excerpt: 'Short cycling is hard on equipment and hard on your heating bill. Here\'s what causes it and what to do about it.', to: '/learn/furnace-short-cycling' },
  { title: 'Why Is My Furnace Making Strange Noises?', excerpt: 'Banging, squealing, rattling — each sound tells a different story. Here\'s what they mean.', to: '/learn/furnace-strange-noises' },
  { title: 'Why Is My Furnace Leaking Water?', excerpt: 'Water around a furnace isn\'t always a big problem, but it\'s never something to ignore. Here\'s what\'s causing it.', to: '/learn/furnace-leaking-water' },
  { title: 'How to Clean a Furnace Flame Sensor', excerpt: 'A dirty flame sensor is one of the most common causes of a furnace that ignites and then shuts off. Here\'s how to clean it.', to: '/learn/clean-furnace-flame-sensor' },
  { title: 'Why Is My AC Not Blowing Cold Air?', excerpt: 'An AC that runs but doesn\'t cool is frustrating. Here are the most likely causes and how to address them.', to: '/learn/ac-not-blowing-cold-air' },
  { title: '80% vs 90% Efficiency Furnace: Which Is Right for You?', excerpt: 'The efficiency debate explained clearly — including when the higher upfront cost actually pays off.', to: '/learn/80-vs-90-efficiency-furnace' },
  { title: 'Single Stage vs Two Stage vs Modulating Furnace', excerpt: 'Not all furnaces cycle the same way. Understanding the differences helps you buy the right equipment.', to: '/learn/furnace-stages-explained' },
  { title: 'Best Gas Furnace Brands (2026)', excerpt: 'An honest breakdown of the top furnace brands — what the dealers won\'t always tell you.', to: '/learn/best-gas-furnace-brands' },
  { title: 'How Long Does a Gas Furnace Last?', excerpt: 'The honest answer to the most common question homeowners ask before they call for service.', to: '/learn/how-long-does-furnace-last' },
  { title: 'What Is AFUE Rating?', excerpt: 'AFUE tells you how efficiently your furnace converts fuel to heat. Here\'s what the number actually means.', to: '/learn/what-is-afue-rating' },
  { title: 'How Often to Change Your Furnace Filter', excerpt: 'The most overlooked furnace maintenance task — and the one with the biggest impact on air quality and efficiency.', to: '/learn/how-often-change-furnace-filter' },
  { title: '11 Furnace Parts Every Homeowner Should Know', excerpt: 'Understanding your equipment helps you communicate clearly with your HVAC tech and avoid unnecessary repairs.', to: '/learn/furnace-parts-homeowner-guide' },
  { title: 'What to Expect During a Furnace Tune-Up', excerpt: 'A tune-up isn\'t just a sales pitch. Here\'s exactly what a proper furnace inspection includes.', to: '/learn/furnace-tune-up-what-to-expect' },
  { title: 'What to Expect During an AC Tune-Up', excerpt: 'Summer prep for your cooling system — and how to tell if your tech is actually doing the work.', to: '/learn/ac-tune-up-what-to-expect' },
]

export default function LearnIndex() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <SectionLabel>Homeowner Guide</SectionLabel>
          <h1 className={styles.heading}>HVAC Help for Homeowners</h1>
          <p className={styles.subtitle}>
            Plain-language answers to the most common furnace and AC questions — written by people who actually work on this equipment.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridInner}>
          {articles.map((article) => (
            <Card key={article.to} {...article} theme="blue" category="Homeowner Guide" />
          ))}
        </div>
      </div>
      <Newsletter />
    </>
  )
}
