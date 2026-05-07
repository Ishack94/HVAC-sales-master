import { salesArticles } from '../../../src/utils/articleData'

export default async function onBeforePrerenderStart() {
  return salesArticles.map((a) => `/sales/${a.slug}`)
}
