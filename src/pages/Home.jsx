import React from 'react'
import Hero from '../components/Home/Hero'
import Intro from '../components/Home/Intro'
import WhatYoullLearn from '../components/Home/WhatYoullLearn'
import HowToUse from '../components/Home/HowToUse'
import CardGrid from '../components/Home/CardGrid'
import DividerQuote from '../components/Home/DividerQuote'
import ResourceGrid from '../components/Home/ResourceGrid'
import About from '../components/Home/About'
import Newsletter from '../components/Home/Newsletter'

const salesCards = [
  {
    title: 'Stop Selling Equipment, Start Selling Outcomes',
    excerpt: 'Homeowners don\'t want a furnace — they want to be warm, comfortable, and not surprised by a breakdown in January.',
    to: '/sales/stop-selling-equipment',
    category: 'Sales',
  },
  {
    title: 'How to Handle "I Need to Think About It"',
    excerpt: 'This objection isn\'t rejection — it\'s a signal. Learn how to address the real concern without pressure.',
    to: '/sales/handle-objections',
    category: 'Sales',
  },
  {
    title: 'Maintenance Agreements: Your Most Predictable Revenue',
    excerpt: 'A strong maintenance program is the closest thing to guaranteed monthly income in HVAC. Here\'s how to sell it.',
    to: '/sales/maintenance-agreements',
    category: 'Sales',
  },
]

const proCards = [
  {
    title: 'The Diagnostic Process: Think Like a Detective',
    excerpt: 'Every service call is a puzzle. Master the systematic approach that separates great techs from average ones.',
    to: '/pro-lessons/diagnostic-process',
    category: 'Tech',
  },
  {
    title: 'Refrigerant Charging Fundamentals',
    excerpt: 'Proper charging is one of the most critical skills in HVAC. Get it wrong and you\'re leaving efficiency — and callbacks — on the table.',
    to: '/pro-lessons/refrigerant-charging',
    category: 'Tech',
  },
  {
    title: 'The A2L Refrigerant Transition (R-454B)',
    excerpt: 'R-454B is here and it changes how we handle, store, and work with refrigerants. Know what\'s different before you\'re on the job.',
    to: '/pro-lessons/a2l-refrigerant',
    category: 'Tech',
  },
]

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <WhatYoullLearn />
      <HowToUse />
      <CardGrid
        id="sales-training"
        label="Sales & Closing"
        title="Stuff That Actually Works"
        subtitle="Stop winging it at the kitchen table."
        cards={salesCards}
        theme="blue"
        viewAllTo="/sales"
        bg="white"
      />
      <DividerQuote quote="The best technicians never stop learning. The best closers never stop either." />
      <CardGrid
        id="pro-lessons"
        label="Tech & Installer Pro Lessons"
        title="Get Better at the Work"
        subtitle="Diagnose faster. Install cleaner. Come back less."
        cards={proCards}
        theme="copper"
        viewAllTo="/pro-lessons"
        bg="cream"
      />
      <ResourceGrid />
      <About />
      <Newsletter />
    </>
  )
}
