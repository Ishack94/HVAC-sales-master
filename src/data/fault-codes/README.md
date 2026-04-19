# HVAC Fault Code Dataset

Normalized fault code reference data for the HVAC Sales Master troubleshoot tool. Platform-first architecture — a tech must identify the control board before looking up codes because the same code identifier often means different things across platform generations.

## Scope

**Currently included:**
- 7 gas furnace brand families (Carrier, Trane, Lennox, Daikin/Goodman, Rheem, Bosch/York, Nortek)
- Electric furnace coverage consolidated across all 7 families
- ~485 total records

**Future expansion:**
- Heat pump fault codes
- AC fault codes (inverter/variable-capacity)
- Mini-split fault codes (separate brand ecosystem)

## File Structure

```
src/data/fault-codes/
├── schema.json                    # JSON schema definition (v1.1.0)
├── brand-families-index.json      # Master index of all brand families
├── nortek-nordyne.json            # Nortek/Nordyne complete data (NORMALIZED)
├── bosch-york.json                # Bosch/York complete data (NORMALIZED)
├── carrier-global.json            # (pending normalization)
├── trane-technologies.json        # (pending normalization)
├── lennox-allied.json             # (pending normalization)
├── daikin-goodman.json            # (pending normalization)
├── rheem-ruud.json                # (pending normalization)
├── loader.js                      # JavaScript loader used by React components
└── README.md                      # This file
```

## Schema Summary

Each brand family file follows the same structure:

- **brand_family_id** / **brand_family_name** — identifiers
- **corporate_owner** — current parent company
- **brands** — all consumer-facing badges in this family
- **structural_overview** — plain-language summary of how this family handles codes
- **field_quirks** — brand-specific knowledge techs need
- **platforms** — control board generations (primary organizing dimension)
  - Each platform has its own **codes** array
  - Each code has 12 normalized fields including code_identifier, meaning, root_causes, diagnostic_path, escalation, reset_behavior, related_codes, source, and severity
- **communicating_ecosystem** — describes thermostat/app layer if present
- **cross_generation_conflicts** — critical warnings about same codes meaning different things

### v1.1.0 additions — Platform disambiguation

Each platform now includes two additional fields to support reliable model-year-independent identification:

- **model_number_prefixes** — array of nameplate prefix strings that match this platform (e.g., `["58SC0B", "58SC1B"]`). The tool performs case-insensitive prefix matching on user-entered model numbers. This is the **primary** disambiguator.
- **visual_identification** — short human-readable description of what the board looks like. Used in the "Don't know the model?" visual picker when the tech can't access the nameplate.

### Why model number instead of install year

Install year is unreliable for platform disambiguation:
- Manufacturers overlap platform generations by 3-5 years
- A "2018 Carrier furnace" could be 58MVP OR 58SC0B depending on model
- Most homeowners don't know the install year
- Model numbers from the nameplate are authoritative

The tool's UX flow:
1. User picks brand family
2. User enters model number from nameplate (primary path) → tool auto-matches to platform via model_number_prefixes
3. If user can't access nameplate, user picks visually ("which does your board look like?") via visual_identification and display_type
4. applies_to_years appears as optional soft confirmation, not primary filter

## How To Add a New Brand Family

1. Copy `nortek-nordyne.json` as a template
2. Rename to match brand family (e.g., `carrier-global.json`)
3. Update `brand_family_id`, `brand_family_name`, and `brands`
4. Fill in `structural_overview` and `field_quirks` from the research
5. For each platform:
   - Create platform entry with `platform_id`, `platform_name`, `display_type`
   - Populate `model_number_prefixes` with documented nameplate prefixes (leave empty array if not reliably documented)
   - Populate `visual_identification` with a short human-readable board description
   - Add each code as an entry in the `codes` array
   - Every code must have: `code_id`, `code_identifier`, `code_type`, `meaning`, `source`
6. Fill in `cross_generation_conflicts` — this is where the tool adds the most value
7. Update `brand-families-index.json` to change the status from `research_complete_normalization_pending` to `NORMALIZED`
8. Uncomment the corresponding line in `loader.js` to register the new brand family

## Data Quality Standards

- **MEANING field** should be verbatim OEM wording where possible. Short phrases, no narrative.
- **ROOT_CAUSES** should be ordered by likelihood, field consensus marked explicitly
- **DIAGNOSTIC_PATH** should be step-by-step what to check (first, second, third)
- **SOURCE** should cite the specific manual or document
- **No confabulation** — if a code cannot be verified, do not include it
- **model_number_prefixes** — only include prefixes verifiable from OEM literature. Leave empty array if unsure.

## Severity Levels

- `informational` — status display, no action needed
- `service_soon` — non-critical, address at next visit
- `urgent` — active fault blocking operation
- `safety_critical` — combustion, electrical, or structural safety issue

## Loader API

`loader.js` exposes these functions for React components:

- `getBrandFamiliesIndex()` — returns the master index
- `loadBrandFamily(brandFamilyId)` — async loads a specific brand family JSON
- `findCodesInPlatform(brandFamilyData, platformId, query)` — filter codes within a platform
- `getCrossGenerationConflicts(brandFamilyData, codeIdentifier)` — get cross-gen warnings for a code
- `getAvailableBrandFamilies()` — list of brand families currently registered
- `identifyPlatformByModelNumber(brandFamilyData, modelNumber)` — **NEW v1.1.0** — auto-match a nameplate model number to a platform (case-insensitive, whitespace/separator-tolerant, longest-prefix-wins)
- `getVisualIdentificationOptions(brandFamilyData)` — **NEW v1.1.0** — returns platforms with visual descriptions for the fallback picker UI

## Cross-Generation Conflicts

These are the MOST IMPORTANT entries in the dataset. When the same code identifier means different things across platforms, techs relying on memory from one platform will misdiagnose the other.

Nortek/Nordyne example: 3 flashes means "pressure switch stuck closed" on MG1/MG2 legacy boards but "inducer or pressure switch error" on Emerson 50V64 boards.

Bosch/York examples: Codes 4, 5, 6 all mean different things on legacy JCI flash boards vs YP9C modulating boards.

## Update Log

- 2026-04-19: Initial schema + Nortek/Nordyne normalized (v1.0.0)
- 2026-04-19: Bosch/York/Coleman/Luxaire normalized (71 records, 4 platforms)
- 2026-04-19: Schema v1.1.0 — added model_number_prefixes and visual_identification for nameplate-based platform identification. Existing Nortek and Bosch/York files updated with new fields.
