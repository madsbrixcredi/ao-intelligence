# Alexander Logan KPI reverse engineering

Objective: reproduce the existing KPI in `Downloads master sheet (49)-kopi.xlsx` where Alexander Logan equals 533. This does not create a new metric.

## Workbook location of the KPI

- Sheet: `Data analysis master sheet`
- User row: row `113`
- User identifier in workbook: `alexander.logan@dk.gt.com`
- All-time row total: `Z113 = 548`
- Existing KPI total: `BM113 = 533`
- Difference/check cell: `BN113 = -15`, formula `+BM113-Z113`

## Source sheets involved

1. `DA_data`
   - Raw activity source for the KPI.
   - Relevant fields: `user_email`, `created`, `type`, `requesting_company_name`, `requesting_company_vat`, `analyzed_company_name`, `analyzed_company_vat`.
2. `Data analysis master sheet`
   - Formula sheet containing the KPI.
   - Relevant columns: `B` user email, `G` Year + month, `H` analysis type, `Q:Z` all-time counts by analysis type, and `AD:BM` monthly counts plus KPI total.

No declaration sheets, `Priority clients active compani`, `connection_data`, or MSpar sheets are involved in this workbook KPI calculation. The KPI uses the email directly, not the human name.

## Filters involved

- Exact user filter: `user_email = alexander.logan@dk.gt.com`.
- Month field: `Year + month` from column `G`.
- KPI period: columns `AE:BC`, from `2024-03` through `2026-03`.
- Later months are present in the row but are not included in the KPI total because `BM113` stops at `BC113`.

## Grouping rules involved

- All-time count: group by user email and analysis type, then sum analysis-type counts.
- KPI count: group by user email and month, then sum monthly counts for the fixed KPI period.

## Deduplication rules involved

None for the 533 KPI. `BM113 = 533` is not a unique-download cell. It is a period-limited sum of monthly row counts.

## Exclusion rules involved

- Exclude rows for any other user email.
- Exclude months outside `AE:BC`. For Alexander Logan this excludes April 2026 and May 2026.

## Exact workbook formulas

```excel
R113 = SUM(($Q113=$B:$B)*($H:$H=R$3))
...
Y113 = SUM(($Q113=$B:$B)*($H:$H=Y$3))
Z113 = R113+S113+T113+U113+V113+W113+X113+Y113

AE113 = SUM(($AD113=$B:$B)*($G:$G=AE$111))
...
BL113 = SUM(($AD113=$B:$B)*($G:$G=BL$111))
BM113 = SUM(AE113:BC113)
BN113 = +BM113-Z113
```

The critical formula is `BM113 = SUM(AE113:BC113)`. The workbook has later month columns, but the KPI total does not include them.

## Reproduction

| Step | Result | Explanation |
| --- | ---: | --- |
| Start from `DA_data` rows for `alexander.logan@dk.gt.com` | 548 | Exact email filter |
| Group by analysis type and sum `R113:Y113` | 548 | Reproduces `Z113`; no deduplication |
| Group same rows into monthly buckets | 548 | Same population, grouped by column `G` month |
| Sum only KPI period `AE113:BC113` | 533 | March 2024 through March 2026 |
| Exclude months after `BC113` | -15 | April 2026 and May 2026 |
| Final workbook KPI `BM113` | 533 | Existing KPI result |

Requested chain:

- `548` becomes `X = 548` after grouping the same rows into monthly buckets.
- `X = 548` becomes `Y = 533` after applying the workbook period range `AE:BC`.
- `Y = 533` is the final KPI value `533`.

Equivalent arithmetic: `548 - 3 (April 2026) - 12 (May 2026) = 533`.

## Analysis-type count check

| Analysis type | Workbook count | Reproduced count |
| --- | ---: | ---: |
| EssentialPalItems | 164 | 164 |
| RevenueAnalysis | 132 | 132 |
| BenchmarkAnalysis | 54 | 54 |
| RevenueReconciliation | 77 | 77 |
| DebtorAnalysis | 77 | 77 |
| RevenueReconciliationV2 | 38 | 38 |
| SalaryAnalysis | 3 | 3 |
| CreditorAnalysis | 3 | 3 |
| **Total** | **548** | **548** |

## Monthly count check

| Month | Workbook column | Workbook count | Included in `BM113`? |
| --- | --- | ---: | --- |
| 2025-02 | AP113 | 52 | yes |
| 2025-03 | AQ113 | 130 | yes |
| 2025-04 | AR113 | 56 | yes |
| 2025-05 | AS113 | 81 | yes |
| 2025-06 | AT113 | 44 | yes |
| 2025-10 | AX113 | 8 | yes |
| 2025-11 | AY113 | 17 | yes |
| 2025-12 | AZ113 | 19 | yes |
| 2026-01 | BA113 | 19 | yes |
| 2026-02 | BB113 | 81 | yes |
| 2026-03 | BC113 | 26 | yes |
| 2026-04 | BD113 | 3 | no |
| 2026-05 | BE113 | 12 | no |

## Excluded rows

These rows are counted in `Z113 = 548` but excluded from `BM113 = 533` because they occur after March 2026.

| Source row in `DA_data` | Created | Month | Analysis type | Analyzed company |
| ---: | --- | --- | --- | --- |
| 1225 | 2026-04-13 13:02:10 | 2026-04 | RevenueAnalysis | PEA Sport ApS |
| 1022 | 2026-04-28 13:39:34 | 2026-04 | RevenueAnalysis | RANDERS GULVSERVICE A/S |
| 1021 | 2026-04-28 13:51:37 | 2026-04 | DebtorAnalysis | RANDERS GULVSERVICE A/S |
| 820 | 2026-05-12 07:46:56 | 2026-05 | CreditorAnalysis | TT Cars ApS |
| 815 | 2026-05-12 09:26:17 | 2026-05 | DebtorAnalysis | Crone Burmeister Adv. ApS |
| 804 | 2026-05-13 06:38:55 | 2026-05 | EssentialPalItems | KOMPOSITTERRASSE.DK ApS |
| 803 | 2026-05-13 06:39:31 | 2026-05 | EssentialPalItems | KOMPOSITTERRASSE.DK ApS |
| 802 | 2026-05-13 06:40:04 | 2026-05 | RevenueAnalysis | KOMPOSITTERRASSE.DK ApS |
| 801 | 2026-05-13 06:40:56 | 2026-05 | DebtorAnalysis | KOMPOSITTERRASSE.DK ApS |
| 800 | 2026-05-13 07:11:11 | 2026-05 | RevenueReconciliationV2 | KOMPOSITTERRASSE.DK ApS |
| 799 | 2026-05-13 07:11:30 | 2026-05 | BenchmarkAnalysis | KOMPOSITTERRASSE.DK ApS |
| 798 | 2026-05-13 07:11:41 | 2026-05 | CreditorAnalysis | KOMPOSITTERRASSE.DK ApS |
| 700 | 2026-05-21 08:40:18 | 2026-05 | RevenueAnalysis | CERO & ETAGE A/S |
| 699 | 2026-05-21 12:49:25 | 2026-05 | RevenueReconciliationV2 | CERO & ETAGE A/S |
| 698 | 2026-05-21 12:52:24 | 2026-05 | RevenueReconciliationV2 | CERO & ETAGE A/S |
