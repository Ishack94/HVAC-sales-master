import { listBrandFamilies } from '../../../../../../src/data/fault-codes/loader'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default async function onBeforePrerenderStart() {
  const urls = []
  for (const family of listBrandFamilies()) {
    if (!family.platforms) continue
    for (const platform of family.platforms) {
      if (!platform.codes) continue
      for (const code of platform.codes) {
        const codeSlug = slugify(code.code_id)
        urls.push(`/troubleshoot/codes/${family.brand_family_id}/${platform.platform_id}/${codeSlug}`)
      }
    }
  }
  return urls
}
