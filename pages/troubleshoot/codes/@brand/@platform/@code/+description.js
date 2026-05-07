import { getBrandFamily } from '../../../../../../src/data/fault-codes/loader'

function findByCodeSlug(family, platformId, codeSlug) {
  if (!family || !family.platforms) return null
  const platform = family.platforms.find((p) => p.platform_id === platformId)
  if (!platform) return null
  const target = String(codeSlug).toLowerCase()
  const code = platform.codes.find((c) => {
    const slug = String(c.code_id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return slug === target
  })
  return code ? { family, platform, code } : null
}

function truncate(text, max) {
  if (!text) return ''
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + '…'
}

export default function description(pageContext) {
  const { brand, platform, code } = pageContext?.routeParams || {}
  const family = getBrandFamily(brand)
  const result = findByCodeSlug(family, platform, code)
  if (!result) return ''
  const sev = result.code.severity ? result.code.severity.replace(/_/g, ' ') : ''
  const text = `${result.code.code_identifier} on ${result.platform.platform_name}: ${result.code.meaning}. Root causes, diagnostic steps, and reset procedure. Severity: ${sev}.`
  return truncate(text, 155)
}
