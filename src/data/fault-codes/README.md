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
├── schema.json                    # JSON schema definition
├── brand-families-index.json      # Master index of all brand families
├── nortek-nordyne.json            # Nortek/Nordyne complete data (NORMALIZED — template)
├── carrier-global.json            # (pending normalization)
├── trane-technologies.json        # (pending normalization)
├── lennox-allied.json             # (pending normalization)
├── daikin-goodman.json            # (pending normalization)
├── rheem-ruud.json                # (pending normalization)
├── bosch-york.json                # (pending normalization)
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
- **platforms** — control board generations (this is the primary organizing dimension)
  - Each platform has its own **codes** array
  - Each code has 12 normalized fields including code_identifier, meaning, root_causes, diagnostic_path, escalation, reset_behavior, related_codes, source, and severity
- **communicating_ecosystem** — describes thermostat/app layer if present (iComfort, EcoNet, ComfortBridge, etc.)
- **cross_generation_conflicts** — critical warnings about same codes meaning different things

## How To Add a New Brand Family

1. Copy `nortek-nordyne.json` as a template
2. Rename to match brand family (e.g., `carrier-global.json`)
3. Update `brand_family_id`, `brand_family_name`, and `brands`
4. Fill in `structural_overview` and `field_quirks` from the research
5. For each platform:
   - Create platform entry with `platform_id`, `platform_name`, `display_type`
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

## Severity Levels

- `informational` — status display, no action needed
- `service_soon` — non-critical, address at next visit
- `urgent` — active fault blocking operation
- `safety_critical` — combustion, electrical, or structural safety issue

## Cross-Generation Conflicts

These are the MOST IMPORTANT entries in the dataset. When the same code identifier means different things across platforms, techs relying on memory from one platform will misdiagnose the other. The tool UI should surface these prominently whenever a tech looks up a code that has a conflict.

Nortek/Nordyne example: 3 flashes means "pressure switch stuck closed" on MG1/MG2 legacy boards but "inducer or pressure switch error" on Emerson 50V64 boards. Same symptom, opposite root cause direction.

## Update Log

- 2026-04-19: Initial schema + Nortek/Nordyne normalized (v1.0.0)
