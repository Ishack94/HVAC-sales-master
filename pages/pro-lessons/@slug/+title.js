import { proArticles } from '../../../src/utils/articleData'

export default function title(pageContext) {
  const slug = pageContext?.routeParams?.slug
  const article = proArticles.find((a) => a.slug === slug)
  if (!article) return 'Article not found | HVAC Sales Master'
  return `${article.title} | HVAC Sales Master`
}
