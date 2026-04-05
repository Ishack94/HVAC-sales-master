import React from 'react'
import styles from './IndexPage.module.css'
import SectionLabel from '../components/UI/SectionLabel'
import Card from '../components/Home/Card'
import Newsletter from '../components/Home/Newsletter'

const articles = [
  { title: 'The Diagnostic Process: Think Like a Detective', excerpt: 'Every service call is a puzzle. Master the systematic approach that separates great techs from average ones.', to: '/pro-lessons/diagnostic-process' },
  { title: 'Installation Basics That Prevent Callbacks', excerpt: 'Callbacks are expensive and reputation-damaging. These installation fundamentals eliminate the most common causes.', to: '/pro-lessons/installation-basics' },
  { title: 'Refrigerant Charging Fundamentals', excerpt: 'Proper charging is one of the most critical skills in HVAC. Get it wrong and you\'re leaving efficiency and callbacks on the table.', to: '/pro-lessons/refrigerant-charging' },
  { title: 'The A2L Refrigerant Transition (R-454B)', excerpt: 'R-454B is here and it changes how we handle, store, and work with refrigerants. Know what\'s different before you\'re on the job.', to: '/pro-lessons/a2l-refrigerant' },
  { title: 'Understanding Tariffs and Supply Chain', excerpt: 'Equipment prices are volatile. Understand how to navigate cost increases and protect your margins.', to: '/pro-lessons/tariffs-supply-chain' },
  { title: 'Customer Service on the Job Site', excerpt: 'Technical skills get you the job. Customer service skills get you the referral. Here\'s how to do both.', to: '/pro-lessons/customer-service-field' },
  { title: 'Building an HVAC Career Path', excerpt: 'From apprentice to business owner — the roadmap most people in this industry never got to see.', to: '/pro-lessons/career-path' },
  { title: 'Static Pressure Diagnostics', excerpt: 'Static pressure is the blood pressure of your duct system. Learn how to read it and fix what\'s wrong.', to: '/pro-lessons/static-pressure' },
  { title: 'Ductless Mini-Split Systems', excerpt: 'Mini-splits are everywhere now. Get up to speed on installation, charging, and troubleshooting.', to: '/pro-lessons/mini-splits' },
  { title: 'Electrical Fundamentals for HVAC Techs', excerpt: 'You don\'t need an electrician\'s license, but you do need to understand circuits. This is the foundation.', to: '/pro-lessons/electrical-fundamentals' },
  { title: 'Superheat and Subcooling Practical Guide', excerpt: 'If you\'re guessing at superheat and subcooling targets, you\'re guessing at efficiency. Learn the real numbers.', to: '/pro-lessons/superheat-subcooling' },
  { title: 'Combustion Analysis for Gas Furnaces', excerpt: 'Combustion analysis tells you what your eyes can\'t see. Learn how to use it to tune any furnace properly.', to: '/pro-lessons/combustion-analysis' },
  { title: 'Evacuation Procedures and Nitrogen Purging', excerpt: 'A proper evacuation is the difference between a reliable system and a callback waiting to happen.', to: '/pro-lessons/evacuation-procedures' },
]

export default function ProLessonsIndex() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <SectionLabel>Tech & Installer Pro Lessons</SectionLabel>
          <h1 className={styles.heading}>Sharpen Your Skills</h1>
          <p className={styles.subtitle}>
            Technical training for service technicians and installers who want to diagnose faster, install better, and come back less.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridInner}>
          {articles.map((article) => (
            <Card key={article.to} {...article} theme="copper" category="Pro Lesson" />
          ))}
        </div>
      </div>
      <Newsletter />
    </>
  )
}
