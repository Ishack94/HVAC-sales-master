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

export default function title(pageContext) {
  const { brand, platform, code } = pageContext?.routeParams || {}
  const family = getBrandFamily(brand)
  const result = findByCodeSlug(family, platform, code)
  if (!result) return 'Fault code not found | HVAC Sales Master'
  const shortBrand = result.family.brand_family_name.split(' /')[0]
  return `${shortBrand} ${result.code.code_identifier} Fault Code — ${result.code.meaning} | HVAC Sales Master`
}
