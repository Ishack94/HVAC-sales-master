# HVAC Sales Master — Claude Code Build Brief

Use this document as the complete reference for building the HVAC Sales Master website. Everything you need to know about the project — tech stack, design, content, structure, and decisions — is here.

---

## PROJECT OVERVIEW

HVAC Sales Master is a content-driven website for HVAC professionals. It has two main content sections: **Sales Training** (articles for HVAC salespeople and comfort advisors) and **Tech & Installer Pro Lessons** (technical training for service technicians and installers). There's also a **Homeowner SEO** section with articles targeting Google search traffic on common furnace and AC problems. An **Industry Resources** section is a placeholder for future partner spotlights.

The site should feel premium, refined, and laid back — not salesy or corporate. Think luxury editorial, not generic SaaS.

---

## TECH STACK

- **Framework:** Vite + React (start with JavaScript, plan to convert to TypeScript later)
- **Styling:** CSS Modules or styled-components (match the aesthetic from the prototype)
- **Backend:** Supabase (for newsletter signups and future features)
- **Hosting:** Vercel (free SSL, automatic deploys from GitHub)
- **Version Control:** GitHub
- **Analytics:** GA4 (Google Analytics 4) — install from day one
- **Domain:** TBD (hvacsalesmaster.com or similar)

---

## COLOR PALETTE

These are the exact colors. Do not deviate.

```css
:root {
  /* Primary Blues */
  --navy: #002f49;           /* Darkest blue — headings, buttons, dark sections */
  --navy-light: #0a3d5c;     /* Slightly lighter navy */
  --blue: #2e668f;            /* Medium blue — secondary accents, card gradients */
  --blue-light: #6b8eac;     /* Light steel blue — tertiary text, subtle accents */
  --blue-mist: #b8cdd9;      /* Very light blue — barely there accents */

  /* Copper/Bronze (site accent — NOT the logo orange) */
  --copper: #bd6c25;          /* Primary warm accent — section labels, card links, trust icons */
  --copper-light: #d4883a;    /* Hover state for copper elements */

  /* Logo Orange (used ONLY in the logo, not as site accent) */
  --logo-orange: #e87722;     /* Brighter orange — logo text "SALES MASTER" only */

  /* Neutrals */
  --cream: #f6f5f3;           /* Light background sections */
  --warm-white: #FDFCFB;      /* Primary page background */
  --white: #ffffff;            /* Cards, trust bar */

  /* Text */
  --text-primary: #0a1f2e;    /* Main body text */
  --text-secondary: #3d5a6e;  /* Secondary/subtitle text */
  --text-tertiary: #7a95a8;   /* Muted text, captions */

  /* Utility */
  --divider: rgba(0, 47, 73, 0.08);  /* Borders, separators */
}
```

### Color Usage Rules
- **Navy (#002f49):** Buttons, headings, hero text, dark sections (newsletter, footer, divider quotes)
- **Blue (#2e668f):** Button hover states, italic accent text in hero, card image gradients (sales section)
- **Copper (#bd6c25):** Section labels (the small uppercase text with lines), card "Read More" links, trust bar icons, resource icons, newsletter subscribe button, scroll indicator
- **Logo Orange (#e87722):** ONLY in the logo itself — header and footer logo text "SALES MASTER"
- Cards in the Sales Training section use blue gradients for their image backgrounds
- Cards in the Tech & Installer section use copper/bronze gradients for their image backgrounds
- This color separation visually distinguishes the two main sections

---

## TYPOGRAPHY

```
Display/Headings: Cormorant Garamond (Google Fonts)
  - Hero: 5.5rem, weight 300 (light), letter-spacing -2px
  - Section titles: 3.4rem, weight 300, letter-spacing -1px
  - Card titles: 1.5rem, weight 600
  - Italic accent: font-style italic, weight 400

Body/UI: DM Sans (Google Fonts)
  - Body text: 0.88-1.1rem, weight 300
  - Buttons: 0.75rem, weight 600, letter-spacing 3px, uppercase
  - Labels: 0.68rem, weight 600, letter-spacing 5px, uppercase
  - Nav links: 0.78rem, weight 500, letter-spacing 1.5px, uppercase
```

Import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap`

---

## LOGO

The logo is an SVG with:
- A shield outline (stroke color #2d3e50)
- Ascending bar chart bars inside the shield (fill #2d3e50)
- An upward-curving arrow with arrowhead (stroke/fill #e87722)
- Text beside it: "HVAC" in navy, "SALES MASTER" in #e87722

The logo SVG is embedded in the prototype HTML file — extract it from there. The actual logo image file is also available at: `/mnt/user-data/uploads/3C3BF9A7-62ED-4073-ADA4-A046D9AAE4AC.PNG`

---

## DESIGN AESTHETIC

**Luxury editorial.** Think high-end architecture firm website or premium brand. NOT generic SaaS, NOT template-looking.

Key design principles:
- **Sharp corners:** 2-4px border-radius maximum. Luxury is angular, not bubbly.
- **Generous white space:** 120px section padding. 80px between section headers and content. Let everything breathe.
- **Light font weights:** Headers use weight 300 (light). Body uses weight 300. This creates the premium thin serif look.
- **Subtle grain texture:** A very faint noise texture overlays the entire page (opacity 0.02).
- **Restrained animations:** Staggered fade-in on hero elements. Cards reveal on scroll with cubic-bezier easing. Header transitions from transparent to frosted glass on scroll.
- **Copper-to-blue gradient line:** Cards have a thin bottom border that's a gradient from copper to blue, scaling in on hover.
- **Minimal borders:** Use rgba(0, 47, 73, 0.08) for borders — barely visible, just enough structure.

### Design Reference
The complete visual prototype is at: `hvac-sales-master-prototype.html`
This HTML file is the definitive design reference. Match it exactly in React components.

---

## SITE STRUCTURE

```
/                          → Homepage (hero, trust bar, sections, newsletter, footer)
/sales/                    → Sales Training index (list of all sales articles)
/sales/[slug]              → Individual sales article
/pro-lessons/              → Tech & Installer Pro Lessons index
/pro-lessons/[slug]        → Individual tech article
/learn/                    → Homeowner SEO articles index
/learn/[slug]              → Individual homeowner article
/resources/                → Industry Resources (placeholder for now)
/about/                    → About page
```

---

## HOMEPAGE SECTIONS (in order)

1. **Header** — Fixed, transparent on top, frosted glass on scroll. Logo left, nav right. Mobile: hamburger menu.
2. **Hero** — Centered text. Label: "For HVAC Professionals". H1: "Sell Smarter. *Master Your Craft.*" (italic on second line). Subtitle. Two buttons. Scroll indicator at bottom.
3. **Trust Bar** — Three items with icons: Industry Proven, Learn Anytime, Always Free.
4. **Sales Training** — Section label, title "Close More Deals", subtitle, 3 cards with blue gradient images.
5. **Divider Quote** — Dark navy background. "The best technicians never stop learning."
6. **Tech & Installer Pro Lessons** — Section label, title "Sharpen Your Skills", subtitle, 3 cards with copper gradient images.
7. **Industry Resources** — Section label, title "Tools We Recommend", 4 resource cards with "Coming Soon" badges.
8. **About** — Two-column: blue gradient image left, text right. "Built for the Industry, *by the Industry.*"
9. **Newsletter** — Dark navy background. Email input + subscribe button.
10. **Footer** — Dark navy. Logo, 3 link columns (Sales, Pro Lessons, Company), social icons, copyright.

---

## CONTENT FILES

All content is stored as markdown files. Here's what exists and where each article goes:

### Sales Training Articles (13 total)
Source files: `Content-Sales-Training/hvac-sales-master-content.md` through `round5.md`

1. Stop Selling Equipment, Start Selling Outcomes
2. How to Handle "I Need to Think About It"
3. Maintenance Agreements: Your Most Predictable Revenue
4. Selling Through Price Increases and Tariffs
5. First Impressions Close More Deals Than Pricing
6. Competing Against Private Equity HVAC Companies
7. Indoor Air Quality Is the Easiest Upsell
8. Google Reviews Are Making or Losing You Money
9. Building Demand Before the Breakdown
10. Heat Pumps Are Your Biggest Sales Opportunity
11. Selling to the Modern Informed Homeowner
12. CSR Phone Skills Are Losing You Money
13. Flat Rate Pricing vs Time and Materials

### Tech & Installer Pro Lessons (13 total)
Source files: `Content-Sales-Training/` rounds 1-5 (tech sections) + `Content-Tech-Lessons/hvac-sales-master-tech-content-round6.md`

1. The Diagnostic Process: Think Like a Detective
2. Installation Basics That Prevent Callbacks
3. Refrigerant Charging Fundamentals
4. The A2L Refrigerant Transition (R-454B)
5. Understanding Tariffs and Supply Chain
6. Customer Service on the Job Site
7. Building an HVAC Career Path
8. Static Pressure Diagnostics
9. Ductless Mini-Split Systems
10. Electrical Fundamentals for HVAC Techs
11. Superheat and Subcooling Practical Guide
12. Combustion Analysis for Gas Furnaces
13. Evacuation Procedures and Nitrogen Purging

### Homeowner SEO Articles (16 total)
Source files: `Content-Homeowner-SEO/` folder (4 files containing all raw content)

1. Why Is My Furnace Blowing Cold Air?
2. Why Is My Furnace Not Turning On? (absorb breaker reset + pilot light content)
3. Why Does My Furnace Keep Turning On and Off?
4. Why Is My Furnace Making Strange Noises?
5. Why Is My Furnace Leaking Water?
6. How to Clean a Furnace Flame Sensor
7. Why Is My AC Not Blowing Cold Air? (combine "not cooling" and "not blowing cold")
8. 80% vs 90% Efficiency Furnace
9. Single Stage vs Two Stage vs Modulating Furnace
10. Best Gas Furnace Brands (2026)
11. How Long Does a Gas Furnace Last?
12. What Is AFUE Rating?
13. How Often to Change Your Furnace Filter
14. 11 Furnace Parts Every Homeowner Should Know
15. What to Expect During a Furnace Tune-Up
16. What to Expect During an AC Tune-Up

---

## SEO REQUIREMENTS

- Each article gets its own URL slug (e.g., `/learn/furnace-blowing-cold-air`)
- Each page has a unique `<title>` tag (under 60 characters)
- Each page has a unique `<meta name="description">` (under 160 characters)
- Use H1 for the main title, H2 for sections within articles
- Internal linking: every article links to 2-3 related articles
- Schema markup: Article or HowTo schema on content pages
- Images need descriptive alt text
- Mobile-responsive (Google indexes mobile-first)
- Generate XML sitemap and submit to Google Search Console
- Set canonical URLs on every page
- Open Graph meta tags for social sharing

---

## COMPONENT STRUCTURE (suggested)

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── MobileMenu.jsx
│   │   └── Layout.jsx
│   ├── Home/
│   │   ├── Hero.jsx
│   │   ├── TrustBar.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── CardGrid.jsx
│   │   ├── Card.jsx
│   │   ├── DividerQuote.jsx
│   │   ├── ResourceGrid.jsx
│   │   ├── About.jsx
│   │   └── Newsletter.jsx
│   ├── Articles/
│   │   ├── ArticleList.jsx
│   │   ├── ArticlePage.jsx
│   │   └── ArticleCard.jsx
│   └── UI/
│       ├── Button.jsx
│       ├── SectionLabel.jsx
│       └── Badge.jsx
├── pages/
│   ├── Home.jsx
│   ├── SalesIndex.jsx
│   ├── ProLessonsIndex.jsx
│   ├── LearnIndex.jsx
│   ├── ArticlePage.jsx
│   ├── About.jsx
│   └── Resources.jsx
├── content/          ← Markdown article files
├── styles/           ← Global CSS, variables, reset
├── utils/            ← SEO helpers, markdown parser
└── App.jsx
```

---

## NEWSLETTER / SUPABASE

Set up a Supabase project with a single table:

```sql
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT now(),
  source TEXT DEFAULT 'website'
);
```

The newsletter form on the homepage and potentially on article pages should POST to Supabase. Show success/error states inline.

---

## KEY DECISIONS (do not change these)

- The site name is **HVAC Sales Master**
- Two main content sections: **Sales Training** and **Tech & Installer Pro Lessons**
- **Industry Resources** is a placeholder section with "Coming Soon" badges
- The About page is minimal — no mention of the owner's personal background
- Content is written in the owner's voice: direct, practical, no corporate fluff
- The logo uses a brighter orange (#e87722) that is separate from the site's copper accent (#bd6c25)
- The "Why HVAC Sales Master?" stats card was removed from the hero — keep it clean and centered
- The site alternates between cream (#f6f5f3) and warm-white (#FDFCFB) backgrounds between sections
- Dark navy (#002f49) is used for the newsletter section, footer, and divider quotes
- Sales Training cards use blue gradients, Tech Lesson cards use copper gradients

---

## PUBLISHING PRIORITY

Build and launch with these pages first:

**Phase 1 (Launch):**
1. Homepage (complete)
2. About page
3. Why Is My AC Not Blowing Cold Air
4. Why Is My Furnace Blowing Cold Air
5. Why Is My Furnace Not Turning On
6. Best Gas Furnace Brands 2026
7. 80% vs 90% Efficiency Furnace

**Phase 2 (Week 2-3):**
8-13. Additional homeowner SEO articles

**Phase 3 (Month 2):**
14-18. Remaining homeowner articles + tune-up guides

**Phase 4 (Month 2-3):**
19-31. Sales Training articles (2-3 per week)

**Phase 5 (Month 3-4):**
32-44. Tech & Installer Pro Lessons (2-3 per week)

---

## FILES TO REFERENCE

- **Design prototype:** `hvac-sales-master-prototype.html` — THE definitive visual reference
- **Logo image:** `3C3BF9A7-62ED-4073-ADA4-A046D9AAE4AC.PNG`
- **Color palette image:** `IMG_2979.AVIF`
- **Content files:** All in the organized folder structure (Sales Training, Tech Lessons, Homeowner SEO)
- **Site blueprint:** `SITE-BLUEPRINT-README.md` — full SEO strategy and content map

---
