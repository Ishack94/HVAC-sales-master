import React from 'react'
import Hero from '../components/Home/Hero'
import CardGrid from '../components/Home/CardGrid'
import DividerQuote from '../components/Home/DividerQuote'
import ResourceGrid from '../components/Home/ResourceGrid'
import About from '../components/Home/About'
import Newsletter from '../components/Home/Newsletter'

import { salesArticles, proArticles } from '../utils/articleData'

const salesCards = salesArticles.slice(0, 3).map((a) => ({
  title: a.title,
  excerpt: a.description,
  to: `/sales/${a.slug}`,
  category: 'Sales',
}))

const proCards = proArticles.slice(0, 3).map((a) => ({
  title: a.title,
  excerpt: a.description,
  to: `/pro-lessons/${a.slug}`,
  category: 'Tech',
}))

export default function Home() {
  return (
    <>
      <Hero />
      <CardGrid
        id="sales-training"
        label="Sales Training"
        title="Close More Deals"
        subtitle="Practical strategies that work when you're sitting across from a homeowner."
        cards={salesCards}
        theme="blue"
        viewAllTo="/sales"
        bg="white"
      />
      <DividerQuote quote="The best technicians never stop learning. The best closers never stop either." />
      <CardGrid
        id="pro-lessons"
        label="Pro Lessons"
        title="Sharpen Your Skills"
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
