# Alexander Logan analysis

Source workbook: `data/raw/Downloads master sheet (49)-kopi.xlsx`

Source sheet: `DA_data`

Matching logic follows `docs/matching_strategy.md`: employee identity is enriched from `Priority clients active compani` by `user_email`; accounting-office name comes from `requesting_company_name_fixed`; accounting-office CVR comes from validated `analyzed_company_vat` where possible.

Raw files were read only. No raw data was modified.

## Summary

- Employee: Alexander Logan
- Matched email(s): `alexander.logan@dk.gt.com`
- Total analyses: 548
- First analysis date: 2025-02-04 12:24:04
- Latest analysis date: 2026-05-21 12:52:24
- Number of distinct client companies analysed: 80
- Associated accounting office(s):
  - `Grant Thornton, Godkendt Revisionspartnerselskab` / `34209936`: 548 analyses
- Matching confidence: high=548

## Analyses by month

| Month | Analyses |
| --- | ---: |
| 2025-02 | 52 |
| 2025-03 | 130 |
| 2025-04 | 56 |
| 2025-05 | 81 |
| 2025-06 | 44 |
| 2025-10 | 8 |
| 2025-11 | 17 |
| 2025-12 | 19 |
| 2026-01 | 19 |
| 2026-02 | 81 |
| 2026-03 | 26 |
| 2026-04 | 3 |
| 2026-05 | 12 |

## Analyses by year

| Year | Analyses |
| --- | ---: |
| 2025 | 407 |
| 2026 | 141 |

## Analyses by type

| Analysis type | Analyses |
| --- | ---: |
| EssentialPalItems | 164 |
| RevenueAnalysis | 132 |
| DebtorAnalysis | 77 |
| RevenueReconciliation | 77 |
| BenchmarkAnalysis | 54 |
| RevenueReconciliationV2 | 38 |
| CreditorAnalysis | 3 |
| SalaryAnalysis | 3 |

## Example analyses

Showing the 20 latest matched analyses performed by Alexander Logan.

| Source row | Created date | Month | User email | User name | Accounting office name | Accounting office CVR | Client company name | Client company CVR | Analysis type | Match confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 698 | 2026-05-21 12:52:24 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | CERO & ETAGE A/S | 43838415 | RevenueReconciliationV2 | high |
| 699 | 2026-05-21 12:49:25 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | CERO & ETAGE A/S | 43838415 | RevenueReconciliationV2 | high |
| 700 | 2026-05-21 08:40:18 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | CERO & ETAGE A/S | 43838415 | RevenueAnalysis | high |
| 798 | 2026-05-13 07:11:41 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | KOMPOSITTERRASSE.DK ApS | 34486999 | CreditorAnalysis | high |
| 799 | 2026-05-13 07:11:30 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | KOMPOSITTERRASSE.DK ApS | 34486999 | BenchmarkAnalysis | high |
| 800 | 2026-05-13 07:11:11 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | KOMPOSITTERRASSE.DK ApS | 34486999 | RevenueReconciliationV2 | high |
| 801 | 2026-05-13 06:40:56 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | KOMPOSITTERRASSE.DK ApS | 34486999 | DebtorAnalysis | high |
| 802 | 2026-05-13 06:40:04 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | KOMPOSITTERRASSE.DK ApS | 34486999 | RevenueAnalysis | high |
| 803 | 2026-05-13 06:39:31 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | KOMPOSITTERRASSE.DK ApS | 34486999 | EssentialPalItems | high |
| 804 | 2026-05-13 06:38:55 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | KOMPOSITTERRASSE.DK ApS | 34486999 | EssentialPalItems | high |
| 815 | 2026-05-12 09:26:17 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | Crone Burmeister Adv. ApS | 41957832 | DebtorAnalysis | high |
| 820 | 2026-05-12 07:46:56 | 2026-05 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | TT Cars ApS | 30915526 | CreditorAnalysis | high |
| 1021 | 2026-04-28 13:51:37 | 2026-04 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | RANDERS GULVSERVICE A/S | 33041594 | DebtorAnalysis | high |
| 1022 | 2026-04-28 13:39:34 | 2026-04 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | RANDERS GULVSERVICE A/S | 33041594 | RevenueAnalysis | high |
| 1225 | 2026-04-13 13:02:10 | 2026-04 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | PEA Sport ApS | 42907065 | RevenueAnalysis | high |
| 1749 | 2026-03-12 13:07:37 | 2026-03 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | PHARMA-TECH A/S | 32940897 | BenchmarkAnalysis | high |
| 1750 | 2026-03-12 13:04:49 | 2026-03 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | PHARMA-TECH A/S | 32940897 | EssentialPalItems | high |
| 1751 | 2026-03-12 13:04:10 | 2026-03 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | PHARMA-TECH A/S | 32940897 | EssentialPalItems | high |
| 1752 | 2026-03-12 12:56:45 | 2026-03 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | PHARMA-TECH A/S | 32940897 | RevenueAnalysis | high |
| 1753 | 2026-03-12 12:54:59 | 2026-03 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | PHARMA-TECH A/S | 32940897 | RevenueReconciliationV2 | high |

## Matching notes

The rows were identified by finding Alexander Logan in `Priority clients active compani.user_name`, then selecting `DA_data` rows with the same `user_email`.

For these rows, the accounting office is derived as follows:

- `requesting_company_name_fixed` consistently identifies the accounting-office name as `Grant Thornton, Godkendt Revisionspartnerselskab`.
- `analyzed_company_vat` consistently provides the accounting-office CVR `34209936` for the matched rows.
- That CVR exists in the declaration-office list as `Grant Thornton`, so the office match is high confidence.
- `requesting_company_vat` is treated as the client/company CVR, not the accounting-office CVR, following the validated matching strategy.
