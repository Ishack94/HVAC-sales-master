import React from 'react'
import Hero from '../components/Home/Hero'
import CardGrid from '../components/Home/CardGrid'
import DividerQuote from '../components/Home/DividerQuote'
import ResourceGrid from '../components/Home/ResourceGrid'
import About from '../components/Home/About'
import Newsletter from '../components/Home/Newsletter'

import { salesArticles, proArticles } from '../utils/articleData'

const salesImages = [
  "linear-gradient(to bottom, rgba(0,47,73,0.3), rgba(0,47,73,0.6)), url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80')",
  "linear-gradient(to bottom, rgba(0,47,73,0.3), rgba(0,47,73,0.6)), url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80')",
  "linear-gradient(to bottom, rgba(0,47,73,0.3), rgba(0,47,73,0.6)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80')",
]

const proImages = [
  "linear-gradient(to bottom, rgba(189,108,37,0.3), rgba(189,108,37,0.6)), url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80')",
  "linear-gradient(to bottom, rgba(189,108,37,0.3), rgba(189,108,37,0.6)), url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80')",
  "linear-gradient(to bottom, rgba(189,108,37,0.3), rgba(189,108,37,0.6)), url('https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80')",
]

const salesCards = salesArticles.slice(0, 3).map((a, i) => ({
  title: a.title,
  excerpt: a.description,
  to: `/sales/${a.slug}`,
  category: 'Sales',
  image: salesImages[i],
}))

const proCards = proArticles.slice(0, 3).map((a, i) => ({
  title: a.title,
  excerpt: a.description,
  to: `/pro-lessons/${a.slug}`,
  category: 'Tech',
  image: proImages[i],
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
