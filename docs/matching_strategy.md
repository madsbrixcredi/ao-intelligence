# Matching strategy

This document analyzes `data/raw/Downloads master sheet (49)-kopi.xlsx` and how download/activity rows can be linked to accounting offices. The workbook was read only; no raw data was modified.

## Relevant sheets

| Sheet | Relevant role | Rows inspected | Key fields found |
| --- | --- | ---: | --- |
| `DA_data` | Best canonical activity table for analysis/download events. | 6,927 | `user_id`, `created`, `type`, `requesting_company_name`, `requesting_company_vat`, `analyzed_company_name`, `analyzed_company_vat`, `user_email`, `end_domain`, `requesting_company_name_fixed` |
| `Data analysis master sheet` | Wider version of `DA_data` with explicit `year`, `month`, and pivot/helper columns. Useful for validation, not as the primary clean source. | 6,927 | `user_email`, `created`, `year`, `month`, `type`, `requesting_company_name`, `requesting_company_vat`, `analyzed_company_name`, `analyzed_company_vat` |
| `Priority clients active compani` | User and active-client enrichment table. Useful for employee names. | 2,121 | `client_name`, `created`, `name`, `vat`, `user_id`, `user_email`, `user_name`, `erp`, `status` |
| `connection_data` | Company connection table. Useful as a relationship/cross-check table, not activity. | 6,847 | `from_company_name`, `from_company_vat`, `to_company_name`, `to_company_vat`, `to_company_erp`, `to_company_status` |
| `MSpar_data_automatic` | Separate activity table for MSpar-style data. | 1,706 | `user_id`, `created`, `company_vat_number`, `company_name`, `analysis_type`, `user_email` |
| `MSpar master sheet` | MSpar activity with department/month fields. | 1,706 | `Bruger e-mail`, `CVR`, `Virksomhedsnavn`, `Afdeling`, `Oprettet`, `Måned`, `Type` |

Sheets such as `Data analysis - which companies`, `Onboarding per week`, `3.2 Summary`, `Analysis pr SME`, `Onboarding per person`, and `MSpar_data_department_advisor` are summary, pivot, filter, or helper sheets. They are useful for context but should not be the primary source for row-level matching.

## Field interpretation

For `DA_data`, the observed matching fields are not perfectly named. For row-level matching, use this interpretation:

| Needed field | Best source in `DA_data` | Notes |
| --- | --- | --- |
| `user_name` | Join from `Priority clients active compani.user_name` using `user_email` | Available for many, but not all, activity rows. |
| `user_email` | `DA_data.user_email` | Present on all inspected `DA_data` rows. |
| `office` | Not available in `DA_data` | Available only in MSpar as `Afdeling`, but not for the accounting-office activity rows. |
| `department` | Not available in `DA_data` | Same limitation as office. |
| `accounting_office_name` | `requesting_company_name_fixed`, fallback `requesting_company_name` | This is the best office-name signal and is often derived from the email domain. |
| `accounting_office_cvr` | Usually `analyzed_company_vat`, after validation/canonicalization | This is the best CVR candidate for the accounting office. Do not use blindly without a crosswalk. |
| `company_cvr` | Usually `requesting_company_vat` | This behaves like the analyzed/client company CVR in many rows. |
| `company_name` | `analyzed_company_name` | This behaves like the analyzed/client company name in many rows. |
| `analysis_type` | `type` | Event type. |
| `created_date` | `created` | Event timestamp. |
| `month` | derive from `created`, or use master sheet `month`/`Year + month` | Deriving from `created` keeps the clean source to one table. |

For MSpar rows, `MSpar master sheet` can provide `user_email`, `office/department` via `Afdeling`, `company_cvr`, `company_name`, `analysis_type`, `created_date`, and `month`. It does not provide an accounting-office name or accounting-office CVR comparable to the declaration files.

## Key coverage checks

- `DA_data` rows: 6,927
- Distinct `user_email` domains in `DA_data`: 52
- Distinct fixed accounting-office names in `DA_data`: 54
- Distinct `analyzed_company_vat` values in `DA_data`: 119
- Distinct `requesting_company_vat` values in `DA_data`: 918
- Rows where `analyzed_company_vat` matches a declaration accounting-office CVR: 6,282 of 6,927
- Rows where `requesting_company_vat` matches a declaration accounting-office CVR: 172 of 6,927
- Rows where `user_email` can be enriched with `user_name` from `Priority clients active compani`: 6,112 of 6,927

## Answers

### 1. Best unique key for linking activity to an accounting office

Use a canonical `accounting_office_cvr` as the final unique key, but derive it through a small accounting-office matching dimension rather than trusting one raw column blindly.

Recommended derivation:

1. Start from `DA_data.user_email` / `end_domain` and `requesting_company_name_fixed` to identify the accounting-office group.
2. Assign the canonical accounting-office CVR using the dominant validated `analyzed_company_vat` for that office/domain, preferably matched to the declaration-table `accounting_office_cvr`.
3. Store the result as `accounting_office_cvr` and use that as the join key to declaration tables.

Do not use `requesting_company_vat` as the accounting-office key. It has many distinct values and often behaves like the analyzed/client company CVR, not the accounting-office CVR.

### 2. Can activity be aggregated directly to accounting office level?

Yes, but with a matching dimension. `DA_data` can be aggregated to accounting-office level by `requesting_company_name_fixed` / email domain immediately, and to declaration-compatible accounting-office CVR after canonicalizing `analyzed_company_vat` into a validated `accounting_office_cvr`.

### 3. Can activity be aggregated to office/department level?

Not for the main accounting-office activity in `DA_data`; it has no office or department field. Department-level aggregation is only available in the MSpar sheets through `MSpar master sheet.Afdeling`. That can be aggregated by department for MSpar activity, but it cannot be directly linked to the declaration accounting offices without an additional mapping.

### 4. Can activity be aggregated to employee level?

Yes at email level, and partly at employee-name level. `DA_data` has `user_email` and `user_id`, so employee-level aggregation by email is reliable. `Priority clients active compani` can enrich many emails with `user_name`, but not every `DA_data` row has a matching name, so `user_email` should remain the stable employee key.

### 5. Example rows for matching

These examples use the corrected matching interpretation for `DA_data`: accounting office from fixed name/domain plus `analyzed_company_vat`, and analyzed company from `analyzed_company_name` plus `requesting_company_vat`.

| source | user_name | user_email | office | department | accounting_office_name | accounting_office_cvr | company_cvr | company_name | analysis_type | created_date | month |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DA_data | Michel Laursen | ml@albjerg.dk |  |  | Albjerg | 35382879 | 36415754 | Spring/Summer P/S | CreditorAnalysis | 2026-04-07 17:09:26 | 2026-04 |
| DA_data | Mads Sebastian Avnsbo | msa@albjerg.dk |  |  | Albjerg | 21051896 | 21051896 | TRANS-IT A/S | EssentialPalItems | 2026-03-24 09:59:05 | 2026-03 |
| DA_data | Michel Laursen | ml@albjerg.dk |  |  | Albjerg | 35382879 | 35403515 | Parcel Feeder A/S | RevenueReconciliationV2 | 2026-03-16 18:03:39 | 2026-03 |
| DA_data | Michel Laursen | ml@albjerg.dk |  |  | Albjerg | 35382879 | 26924081 | Jaguar Gruppen | SalaryAnalysis | 2026-02-02 17:22:17 | 2026-02 |
| DA_data | Michel Laursen | ml@albjerg.dk |  |  | Albjerg | 35382879 | 40796819 | Dansk Kurer & Transportservice ApS | SalaryAnalysis | 2026-01-29 20:16:58 | 2026-01 |
| DA_data | Michel Laursen | ml@albjerg.dk |  |  | Albjerg | 35382879 | 26629152 | Holger Danske Flytteforretning A/S | EssentialPalItems | 2026-01-23 10:47:53 | 2026-01 |
| DA_data | Mark Meyer Jensen | mmj@beierholm.dk |  |  | Beierholm | 32895468 | 41263121 | Arkyn Studios apS | DebtorAnalysis | 2026-05-12 06:47:19 | 2026-05 |
| DA_data | Andreas Sørup Jepsen | aso@beierholm.dk |  |  | Beierholm | 32895468 | 37065285 | A2Vent ApS | RevenueReconciliation | 2025-11-18 11:12:15 | 2025-11 |
| DA_data | Andreas Sørup Jepsen | aso@beierholm.dk |  |  | Beierholm | 32895468 | 15882093 | Amtech ApS | RevenueAnalysis | 2025-09-23 12:04:47 | 2025-09 |
| DA_data |  | kisp@beierholm.dk |  |  | Beierholm | 43356933 | 43356933 | Beierholm Test - Bergmann | RevenueReconciliation | 2025-03-05 12:28:01 | 2025-03 |
| DA_data |  | sae@beierholm.dk |  |  | Beierholm | 32895468 | 21275875 | Jim Riel A/S | EssentialPalItems | 2024-11-05 16:01:32 | 2024-11 |
| DA_data | Nickie Prangsgaard Meyer | npm@beierholm.dk |  |  | Beierholm | 32895468 | 34597529 | Sommerby Petersen og Poulsen | BenchmarkAnalysis | 2024-09-26 07:21:14 | 2024-09 |
| DA_data | Pernille Nørtved Bjergager | pnb@beierholm.dk |  |  | Beierholm | 32895468 | 43571613 | Leasho | EssentialPalItems | 2024-09-26 07:20:44 | 2024-09 |
| DA_data | Lukas Jacobsen | luj@beierholm.dk |  |  | Beierholm | 32895468 | 42004170 | Motorgaarden Skals | EssentialPalItems | 2024-09-26 06:34:26 | 2024-09 |
| DA_data |  | ckg@beierholm.dk |  |  | Beierholm | 38699377 | 38699377 | Martlev ApS | EssentialPalItems | 2024-09-10 13:49:54 | 2024-09 |
| DA_data | Andreas Sørup Jepsen | aso@beierholm.dk |  |  | Beierholm | 32895468 | 42866326 | Dannebrog Gulv ApS | EssentialPalItems | 2024-09-10 10:54:40 | 2024-09 |
| DA_data | Andreas Sørup Jepsen | aso@beierholm.dk |  |  | Beierholm | 32895468 | 41297034 | Plug In ApS | RevenueAnalysis | 2024-08-29 07:30:54 | 2024-08 |
| DA_data | Andreas Sørup Jepsen | aso@beierholm.dk |  |  | Beierholm | 32895468 | 10057663 | ABILDHAUGES FYSIOTERAPI & TRÆNING ApS | EssentialPalItems | 2024-08-28 20:22:35 | 2024-08 |
| DA_data |  | mbd@beierholm.dk |  |  | Beierholm | 12345678 | 12345678 | TEST | EssentialPalItems | 2024-06-13 07:30:46 | 2024-06 |
| DA_data | Peter Leth Keller | plk@buusjensen.dk |  |  | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 36029374 | 36029374 | SANKT PEDER DRIFTSSELSKAB ApS | CreditorAnalysis | 2026-05-23 05:42:09 | 2026-05 |
