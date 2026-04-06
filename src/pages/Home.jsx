import React from 'react'
import Hero from '../components/Home/Hero'
import CardGrid from '../components/Home/CardGrid'
import DividerQuote from '../components/Home/DividerQuote'
import ResourceGrid from '../components/Home/ResourceGrid'
import About from '../components/Home/About'
import Newsletter from '../components/Home/Newsletter'

import { salesArticles, proArticles } from '../utils/articleData'

const salesHomepageImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80',
]

const proHomepageImages = [
  'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800&q=80',
]

const salesCards = salesArticles.slice(0, 3).map((a, i) => ({
  title: a.title,
  excerpt: a.description,
  to: `/sales/${a.slug}`,
  category: 'Sales',
  image: salesHomepageImages[i],
}))

const proCards = proArticles.slice(0, 3).map((a, i) => ({
  title: a.title,
  excerpt: a.description,
  to: `/pro-lessons/${a.slug}`,
  category: 'Tech',
  image: proHomepageImages[i],
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
