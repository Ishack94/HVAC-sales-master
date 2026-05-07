import { salesArticles } from '../../../src/utils/articleData'

export default function description(pageContext) {
  const slug = pageContext?.routeParams?.slug
  const article = salesArticles.find((a) => a.slug === slug)
  return article?.description || ''
}
