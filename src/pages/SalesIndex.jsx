import React from 'react'
import styles from './IndexPage.module.css'
import SectionLabel from '../components/UI/SectionLabel'
import Card from '../components/Home/Card'
import Newsletter from '../components/Home/Newsletter'

const articles = [
  { title: 'Stop Selling Equipment, Start Selling Outcomes', excerpt: 'Homeowners don\'t want a furnace — they want to be warm, comfortable, and not surprised by a breakdown in January.', to: '/sales/stop-selling-equipment' },
  { title: 'How to Handle "I Need to Think About It"', excerpt: 'This objection isn\'t rejection — it\'s a signal. Learn how to address the real concern without pressure.', to: '/sales/handle-objections' },
  { title: 'Maintenance Agreements: Your Most Predictable Revenue', excerpt: 'A strong maintenance program is the closest thing to guaranteed monthly income in HVAC.', to: '/sales/maintenance-agreements' },
  { title: 'Selling Through Price Increases and Tariffs', excerpt: 'Equipment costs are up. Learn how to have the price conversation without losing the job.', to: '/sales/selling-through-tariffs' },
  { title: 'First Impressions Close More Deals Than Pricing', excerpt: 'Before you open your mouth, the homeowner has already formed an opinion. Make sure it\'s the right one.', to: '/sales/first-impressions' },
  { title: 'Competing Against Private Equity HVAC Companies', excerpt: 'Big company budgets don\'t mean they win. Here\'s how small and mid-size operators stay competitive.', to: '/sales/competing-private-equity' },
  { title: 'Indoor Air Quality Is the Easiest Upsell', excerpt: 'IAQ products sell themselves when you tell the right story. Here\'s the simple framework.', to: '/sales/indoor-air-quality-upsell' },
  { title: 'Google Reviews Are Making or Losing You Money', excerpt: 'Your online reputation is your sales team. Understand how to build it and protect it.', to: '/sales/google-reviews' },
  { title: 'Building Demand Before the Breakdown', excerpt: 'The best HVAC salespeople create urgency before the equipment fails. Here\'s how to do it ethically.', to: '/sales/building-demand' },
  { title: 'Heat Pumps Are Your Biggest Sales Opportunity', excerpt: 'The market is shifting. Understand how to position heat pumps and close more high-ticket jobs.', to: '/sales/heat-pumps-sales' },
  { title: 'Selling to the Modern Informed Homeowner', excerpt: 'Today\'s homeowner has already researched before you arrive. Here\'s how to sell to someone who thinks they know everything.', to: '/sales/modern-informed-homeowner' },
  { title: 'CSR Phone Skills Are Losing You Money', excerpt: 'The job is often won or lost on the first phone call. Train your CSRs like they\'re your best salesperson.', to: '/sales/csr-phone-skills' },
  { title: 'Flat Rate Pricing vs Time and Materials', excerpt: 'Which pricing model makes you more money? The answer might surprise you.', to: '/sales/flat-rate-pricing' },
]

export default function SalesIndex() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <SectionLabel>Sales & Closing</SectionLabel>
          <h1 className={styles.heading}>Sales & Closing</h1>
          <p className={styles.subtitle}>
            Stuff that actually works when you&apos;re sitting across from a homeowner.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridInner}>
          {articles.map((article) => (
            <Card key={article.to} {...article} theme="blue" category="Sales Training" />
          ))}
        </div>
      </div>
      <Newsletter />
    </>
  )
}
