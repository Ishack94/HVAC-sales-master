import { proArticles } from '../../../src/utils/articleData'

export default async function onBeforePrerenderStart() {
  return proArticles.map((a) => `/pro-lessons/${a.slug}`)
}
