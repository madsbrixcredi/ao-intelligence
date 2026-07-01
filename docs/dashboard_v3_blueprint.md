# Crediwire Intelligence Dashboard V3 Blueprint

Purpose: freeze the management design before further UI changes. This document reviews the current dashboard, KPI logic, ROI logic and previous decisions, then defines the V3 blueprint for approval.

This is a specification only. No UI implementation should be inferred from this document until it is approved.

## 1. Final KPI Structure

The dashboard must support management decision making around one core business question:

```text
How much value has Crediwire realized today, how much potential remains, and where should implementation effort focus next?
```

### Primary KPIs

Primary KPIs are the numbers that should appear at the top of the dashboard. They explain the business case from population to realized value.

| KPI | Label in UI | Formula | Why it is shown | Role |
|---|---|---|---|---|
| Samlede erklæringer | `Samlede erklæringer` | `audits + extended_reviews + reviews + assistance` | Defines the full potential population. | Primary potential KPI |
| Aktive forbindelser | `Aktive forbindelser` | GL / `active_erp_connections` | Defines realized implementation population. | Primary realized KPI |
| Realiseret værdi i dag | `Realiseret værdi i dag` | `active_connections × hours_saved × hourly_rate × quality_multiplier` | Converts current implementation into value. | Primary value KPI |
| Fuldt potentiale | `Fuldt potentiale` | `total_declarations × hours_saved × hourly_rate × quality_multiplier` | Shows total addressable value if fully implemented. | Primary value KPI |
| Uudnyttet potentiale | `Uudnyttet potentiale` | `full_potential - realized_value` | Shows the opportunity gap. | Primary opportunity KPI |
| Implementeringsgrad | `Implementeringsgrad` | `active_connections / total_declarations` | Shows how far Crediwire has implemented against the potential base. | Primary progress KPI |

V3 recommendation: use `Implementeringsgrad` as the main management adoption metric, not `Dataanalyser / Samlede erklæringer`.

### Secondary KPIs

Secondary KPIs explain usage, behavior and execution risk. They should appear below the top management overview or inside tables.

| KPI | Label in UI | Formula | Why it is shown | Role |
|---|---|---|---|---|
| Dataanalyser | `Dataanalyser i alt` | `COUNT rows in DA_data` / `SUM(total_analyses)` | Shows usage volume. | Secondary usage KPI |
| Virksomheder analyseret | `Virksomheder analyseret` | `SUM(distinct_clients_analysed)` | Shows breadth of analysis activity. | Secondary coverage KPI |
| Aktive brugere | `Aktive brugere` | `COUNT DISTINCT user_email with activity` | Shows user adoption. | Secondary adoption KPI |
| Revisionshuse med aktivitet | `Revisionshuse med aktivitet` | `COUNT AO where total_analyses > 0` | Shows spread across accounting offices. | Secondary adoption KPI |
| Analysis coverage | `Analysis coverage` | `companies_analyzed / total_declarations` | Shows analysis breadth compared with potential. | Secondary diagnostic KPI |
| Usage intensity | `Usage intensity` | `data_analyses / active_connections` | Shows activity per activated connection. | Secondary diagnostic KPI |

### Supporting Population KPIs

These should be visible in the population section or drill-down, not as top-level hero KPIs.

| KPI | Formula |
|---|---|
| Revision | `SUM(audits)` |
| Udvidet gennemgang | `SUM(extended_reviews)` |
| Review | `SUM(reviews)` |
| Assistance | `SUM(assistance)` |

## 2. Final Management Layout

Recommended page structure from top to bottom:

### 1. Global Filters

- Accounting office filter: `Alle revisionshuse` plus all AO values from `ao_master.csv`.
- Time period filter for trend sections only.
- ROI assumption controls should stay in the ROI section, not in the global header.

### 2. Executive Summary

Purpose: explain the business case in one screen.

Recommended cards:

```text
Samlede erklæringer
Aktive forbindelser
Implementeringsgrad
Realiseret værdi i dag
Fuldt potentiale
Uudnyttet potentiale
```

This is the most important V3 change: management should immediately see population, implementation, realized value and gap. Usage counts are important, but they should not dominate the top section.

### 3. Population Breakdown

Show declaration population by type:

- Revision
- Udvidet gennemgang
- Review
- Assistance

Recommended visualization: compact horizontal bars or a simple table. This supports market sizing and explains what the potential consists of.

### 4. Activation and Usage

Show:

- Aktive forbindelser
- Virksomheder analyseret
- Dataanalyser i alt
- Aktive brugere
- Revisionshuse med aktivitet

Purpose: distinguish implementation from usage.

### 5. Trend Development

Show completed-month trends:

- Dataanalyser over tid
- Aktive brugere over tid
- Revisionshuse med aktivitet over tid, if available

Do not show active connections as a trend until historical GL snapshots exist.

### 6. Opportunity Table

Show where Crediwire should focus next. Table structure is defined in section 5.

### 7. Champions and Adoption Risk

Show top users and top accounting offices, but keep this below opportunity. Champions are useful for execution, not for the top-level business case.

### 8. ROI and Business Case

Show assumptions, formulas and business-case explanation. The ROI section must read like a management business case, not a spreadsheet.

### 9. Data Status and Limitations

Always include a compact status section:

- Data period
- Latest completed month used for trends
- GL connection snapshot date
- Known data limitations

## 3. Final ROI Logic

### Validated Population Logic

V3 should use:

```text
active_connections = realized population
total_declarations = potential population
```

Reasoning:

- Active connections are the best available signal for implemented, structured data availability.
- Total declarations are the best available measure of potential volume.
- Companies analyzed is a usage/coverage signal, not the realized value population.

### Final Base Formulas

```text
base_realized_value =
  active_connections × hours_saved_per_declaration × hourly_rate

base_full_potential =
  total_declarations × hours_saved_per_declaration × hourly_rate
```

### Quality Factor Logic

```text
if quality_enabled:
  quality_multiplier = quality_factor
else:
  quality_multiplier = 1
```

Rules:

- Default quality factor when enabled: `2x`.
- If quality is disabled, use multiplier `1x`.
- Never use `0x`.
- If the quality factor input is blank, invalid or below `1`, fall back to `2x` when enabled.

Final value formulas:

```text
realized_value =
  active_connections × hours_saved_per_declaration × hourly_rate × quality_multiplier

full_potential =
  total_declarations × hours_saved_per_declaration × hourly_rate × quality_multiplier

unrealized_potential =
  full_potential - realized_value
```

### Implementation Rate Logic

Use:

```text
implementation_rate =
  active_connections / total_declarations
```

Display label:

```text
Implementeringsgrad
```

Do not label this as generic “adoption” unless the explanation is explicit. It is a management ratio comparing activated connections to declaration volume.

### Companies Analyzed Must Not Drive ROI

`Virksomheder analyseret` must not be used in ROI formulas.

Reason:

- It measures usage breadth, not implemented population.
- It can understate value where connections exist but analyses have not been run.
- It can overstate true unique population if summed across offices.

It should be used for:

- Analysis coverage
- Usage diagnostics
- Implementation follow-up
- Opportunity prioritization

It should not be used for:

- Realized value
- Full potential
- Unrealized potential

### Optional Reporting and Advisory Logic

Keep behind a toggle:

```text
Medtag rapportering og rådgivning
```

When off, do not show reporting/advisory inputs or outputs.

When on:

```text
rapporteringseffektivitet =
  reporting_customers × reporting_hours_saved_per_customer × hourly_rate

rådgivningsværdi =
  reporting_customers × advisory_hours_per_reporting_customer × hourly_rate

samlet_værdi_inkl_rapportering_og_rådgivning =
  full_potential + rapporteringseffektivitet + rådgivningsværdi
```

Challenge: These add-ons are less directly validated by current activity data than active connections and declarations. Keep them optional and visually subordinate.

## 4. Final Trend Logic

### Completed Months Only

Trend charts and MoM calculations must use completed months only.

Current rule:

```text
Exclude the current partial month from default trends and MoM.
```

For the current data, June 2026 is partial and should be excluded from trend comparisons.

### MoM Logic

Use:

```text
latest_completed_month
previous_completed_month
change_abs = latest_completed_month - previous_completed_month
change_pct = change_abs / previous_completed_month
```

If previous month is `0`:

- If latest month is positive, show `Ny aktivitet`.
- If latest month is also `0`, show `0%`.

### Trend Indicators

Recommended trend indicators:

- Latest completed month value
- Previous completed month value
- Absolute change
- Percentage change
- 3-month rolling sum or average for management stability

Do not compare a completed month to a partial current month.

### Incomplete Months

Options:

1. Default: hide incomplete months from trend and MoM.
2. Optional: show incomplete month in a separate faint marker labeled `Foreløbig måned`.

V3 recommendation: keep incomplete month hidden by default. It avoids false decline signals.

### Active Connections Trend

Do not create a line chart for active connections until there are historical GL snapshots.

Show:

```text
Aktive forbindelser: current GL snapshot
Historik indsamles fremadrettet
```

## 5. Final Opportunity Logic

### Opportunity Table Structure

Recommended columns:

| Column | Formula / source | Purpose |
|---|---|---|
| Revisionshus | `accounting_office_name` | Identify target account. |
| Samlede erklæringer | `total_declarations` | Size of potential. |
| Aktive forbindelser | GL active connections | Implementation footprint. |
| Implementeringsgrad | `active_connections / total_declarations` | How much is activated. |
| Virksomheder analyseret | `distinct_clients_analysed` | Usage breadth. |
| Dataanalyser | `total_analyses` | Usage volume. |
| Usage intensity | `total_analyses / active_connections` | Activity per activated connection. |
| Uudnyttet potentiale | `full_potential - realized_value` | Economic opportunity gap. |
| Realiseret værdi | ROI realized formula | Value today. |
| Fuldt potentiale | ROI full potential formula | Addressable value. |

### Penetration Logic

Primary penetration metric:

```text
implementation_rate =
  active_connections / total_declarations
```

Secondary diagnostic metric:

```text
analysis_coverage =
  companies_analyzed / total_declarations
```

Challenge: Both compare non-identical units to declarations. They are management ratios, not strict accounting ratios. The UI must label them clearly.

### Potential Calculations

Economic opportunity should use value formulas:

```text
realized_value =
  active_connections × hours_saved × hourly_rate × quality_multiplier

full_potential =
  total_declarations × hours_saved × hourly_rate × quality_multiplier

unrealized_potential =
  full_potential - realized_value
```

V3 recommendation: do not sort the main opportunity table by `total_declarations - total_analyses`. Downloads are usage activity and should not reduce potential one-for-one.

### Sorting Logic

Default sort:

```text
unrealized_potential DESC
```

Secondary sort options:

- `total_declarations DESC`
- `implementation_rate ASC`
- `active_connections DESC`
- `usage_intensity ASC`
- `latest_completed_month_change ASC` for declining usage risk

## 6. Final Business Case Explanation Logic

The dashboard should explain the business case in plain language:

### Facts

Facts are observed data:

- `Samlede erklæringer` from declaration files.
- `Aktive forbindelser` from GL.
- `Dataanalyser` from `DA_data`.
- `Aktive brugere` from user activity.
- `Virksomheder analyseret` from processed activity model.

Recommended wording:

```text
Crediwire har i dag aktive ERP-forbindelser på en del af den samlede erklæringspopulation. Disse forbindelser er den realiserede base, hvor struktureret data kan skabe værdi.
```

### Assumptions

Assumptions are editable:

- Timer sparet pr. erklæring.
- Timepris.
- Kvalitetsfaktor.
- Optional reporting/advisory assumptions.

Recommended wording:

```text
Business casen bygger på brugerens egne antagelser om tidsbesparelse, timepris og kvalitetsfaktor. Kvalitetsfaktoren afspejler ekstra værdi af bedre dokumentation, mere ensartet proces, færre manuelle udtræk og lavere risiko for fejl.
```

### Realized Value

Recommended wording:

```text
Realiseret værdi i dag beregnes på de aktive forbindelser. Det viser værdien af den population, hvor Crediwire allerede har et aktivt datagrundlag.
```

### Potential Value

Recommended wording:

```text
Fuldt potentiale beregnes på alle erklæringer. Det viser den teoretiske værdi, hvis hele populationen blev understøttet af Crediwire.
```

### Opportunity Gap

Recommended wording:

```text
Uudnyttet potentiale er forskellen mellem fuldt potentiale og realiseret værdi. Det viser størrelsen af den kommercielle og implementeringsmæssige mulighed.
```

The explanation should avoid spreadsheet language such as “cell K29” in the UI. Cell references belong in documentation only.

## 7. Remaining Open Questions

Only unresolved decisions:

1. Should `total_declarations` be treated as a proxy for companies, or should a separate unique-company potential table be built?
2. Should quality factor default to enabled or disabled in the approved management view?
3. Should reporting/advisory add-ons be included in the executive summary when enabled, or remain only inside the ROI section?
4. Should opportunity sorting use pure `unrealized_potential`, or a composite priority score that also considers implementation readiness?
5. Should active connection snapshots be created monthly going forward to support real connection trends?
6. Should total known users be sourced from another system, so true user adoption rate can be calculated?

## 8. Challenge the Design

### Potentially Misleading KPIs

| KPI | Risk | Recommendation |
|---|---|---|
| Implementeringsgrad | Compares active connections to declaration volume, which are not identical units. | Use as management ratio; label clearly and explain. |
| Analysis coverage | Companies analyzed divided by declarations can be directionally useful but not exact. | Keep secondary. Do not use for ROI. |
| Usage intensity | High downloads per connection may indicate engagement, but also repeated work or noisy activity. | Treat as diagnostic, not success on its own. |
| Uudnyttet potentiale | Can look very large because it assumes full declaration population and quality multiplier. | Always show assumptions next to the value. |

### Potential Duplicates

| Pair | Issue | Recommendation |
|---|---|---|
| `Dataanalyser` and `Virksomheder analyseret` | Both describe usage, but one is volume and one is breadth. | Keep both, but group under usage, not top business value. |
| `Implementation rate` and `Connection penetration` | Same concept under two names. | Use one final label: `Implementeringsgrad`. |
| `Fuldt potentiale` and opportunity table `Fuldt potentiale` | Same formula appears in summary and table. | Keep both, but table is per-AO; summary is global or selected AO. |

### Potential Confusion

- “Adoption” is too broad. It can mean active connections, analysis usage, user adoption, or customer penetration. V3 should avoid a generic `Adoption rate` label.
- “Virksomheder analyseret” sounds like a value population, but it is a usage breadth metric. It must not drive ROI.
- Reporting/advisory values are optional scenario values, not observed data. They should not appear as facts.
- Quality factor is an assumption. It should be shown near the ROI values whenever enabled.

### Assumptions To Validate

1. `4` hours saved per declaration.
2. `1.200` DKK hourly rate.
3. `2x` quality factor.
4. Active GL connections as realized population.
5. Total declarations as potential population.
6. Reporting customers default `500`.
7. Reporting hours saved default `3`.
8. Advisory hours per reporting customer default `2`.
9. Whether declaration count can reasonably stand in for value population across all accounting offices.

## Approval Recommendation

Approve V3 only if management agrees to these core principles:

1. ROI is based on `active_connections` for realized value and `total_declarations` for full potential.
2. `Companies analyzed` is a usage diagnostic, not an ROI driver.
3. Quality factor is a value multiplier when enabled, and `1x` when disabled.
4. Trends exclude incomplete months by default.
5. Main opportunity sorting uses economic opportunity gap, not downloads minus declarations.
6. Generic “adoption rate” is replaced by precise labels: `Implementeringsgrad`, `Analysis coverage`, `Usage intensity`, and `Aktive brugere`.
