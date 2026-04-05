// Slug-to-title map for all articles across all sections.
// Used by ArticlePage to display the real title instead of the slug.

export const articleTitles = {
  // Sales Training
  'stop-selling-equipment': 'Stop Selling Equipment, Start Selling Outcomes',
  'handle-objections': 'How to Handle "I Need to Think About It"',
  'maintenance-agreements': 'Maintenance Agreements: Your Most Predictable Revenue',
  'selling-through-tariffs': 'Selling Through Price Increases and Tariffs',
  'first-impressions': 'First Impressions Close More Deals Than Pricing',
  'competing-private-equity': 'Competing Against Private Equity HVAC Companies',
  'indoor-air-quality-upsell': 'Indoor Air Quality Is the Easiest Upsell',
  'google-reviews': 'Google Reviews Are Making or Losing You Money',
  'building-demand': 'Building Demand Before the Breakdown',
  'heat-pumps-sales': 'Heat Pumps Are Your Biggest Sales Opportunity',
  'modern-informed-homeowner': 'Selling to the Modern Informed Homeowner',
  'csr-phone-skills': 'CSR Phone Skills Are Losing You Money',
  'flat-rate-pricing': 'Flat Rate Pricing vs Time and Materials',

  // Tech & Installer Pro Lessons
  'diagnostic-process': 'The Diagnostic Process: Think Like a Detective',
  'installation-basics': 'Installation Basics That Prevent Callbacks',
  'refrigerant-charging': 'Refrigerant Charging Fundamentals',
  'a2l-refrigerant': 'The A2L Refrigerant Transition (R-454B)',
  'tariffs-supply-chain': 'Understanding Tariffs and Supply Chain',
  'customer-service-field': 'Customer Service on the Job Site',
  'career-path': 'Building an HVAC Career Path',
  'static-pressure': 'Static Pressure Diagnostics',
  'mini-splits': 'Ductless Mini-Split Systems',
  'electrical-fundamentals': 'Electrical Fundamentals for HVAC Techs',
  'superheat-subcooling': 'Superheat and Subcooling Practical Guide',
  'combustion-analysis': 'Combustion Analysis for Gas Furnaces',
  'evacuation-procedures': 'Evacuation Procedures and Nitrogen Purging',

  // Homeowner SEO / Learn
  'furnace-blowing-cold-air': 'Why Is My Furnace Blowing Cold Air?',
  'furnace-not-turning-on': 'Why Is My Furnace Not Turning On?',
  'furnace-short-cycling': 'Why Does My Furnace Keep Turning On and Off?',
  'furnace-strange-noises': 'Why Is My Furnace Making Strange Noises?',
  'furnace-leaking-water': 'Why Is My Furnace Leaking Water?',
  'clean-furnace-flame-sensor': 'How to Clean a Furnace Flame Sensor',
  'ac-not-blowing-cold-air': 'Why Is My AC Not Blowing Cold Air?',
  '80-vs-90-efficiency-furnace': '80% vs 90% Efficiency Furnace: Which Is Right for You?',
  'furnace-stages-explained': 'Single Stage vs Two Stage vs Modulating Furnace',
  'best-gas-furnace-brands': 'Best Gas Furnace Brands (2026)',
  'how-long-does-furnace-last': 'How Long Does a Gas Furnace Last?',
  'what-is-afue-rating': 'What Is AFUE Rating?',
  'how-often-change-furnace-filter': 'How Often to Change Your Furnace Filter',
  'furnace-parts-homeowner-guide': '11 Furnace Parts Every Homeowner Should Know',
  'furnace-tune-up-what-to-expect': 'What to Expect During a Furnace Tune-Up',
  'ac-tune-up-what-to-expect': 'What to Expect During an AC Tune-Up',
}

// Convert a slug to a display title. Falls back to a capitalized slug.
export function getArticleTitle(slug) {
  if (!slug) return ''
  return articleTitles[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
