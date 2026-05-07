import { salesArticles } from '../../../src/utils/articleData'

export default function title(pageContext) {
  const slug = pageContext?.routeParams?.slug
  const article = salesArticles.find((a) => a.slug === slug)
  if (!article) return 'Article not found | HVAC Sales Master'
  return `${article.title} | HVAC Sales Master`
}
