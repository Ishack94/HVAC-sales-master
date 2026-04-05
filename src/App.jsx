import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import SalesIndex from './pages/SalesIndex'
import ProLessonsIndex from './pages/ProLessonsIndex'
import LearnIndex from './pages/LearnIndex'
import ArticlePage from './pages/ArticlePage'
import About from './pages/About'
import Resources from './pages/Resources'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sales" element={<SalesIndex />} />
          <Route path="sales/:slug" element={<ArticlePage section="sales" />} />
          <Route path="pro-lessons" element={<ProLessonsIndex />} />
          <Route path="pro-lessons/:slug" element={<ArticlePage section="pro-lessons" />} />
          <Route path="learn" element={<LearnIndex />} />
          <Route path="learn/:slug" element={<ArticlePage section="learn" />} />
          <Route path="about" element={<About />} />
          <Route path="resources" element={<Resources />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
