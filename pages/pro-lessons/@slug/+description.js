import { proArticles } from '../../../src/utils/articleData'

export default function description(pageContext) {
  const slug = pageContext?.routeParams?.slug
  const article = proArticles.find((a) => a.slug === slug)
  return article?.description || ''
}
