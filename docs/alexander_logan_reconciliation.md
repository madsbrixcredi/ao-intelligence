# Alexander Logan reconciliation

This reconciles the 548 Alexander Logan analysis rows from `DA_data` with the unique-download methodology used in `Data analysis master sheet`. The workbook was read only; no raw files were modified.

## Source and matching

- Source workbook: `data/raw/Downloads master sheet (49)-kopi.xlsx`
- Activity source: `DA_data`
- Employee match: Alexander Logan from `Priority clients active compani.user_name`, joined to `DA_data` by `user_email`
- Matched email: `alexander.logan@dk.gt.com`
- Accounting-office matching follows `docs/matching_strategy.md`

## What constitutes a download

A download, in the master-sheet methodology, is one activity row in the analysis data. In `Data analysis master sheet`, the all-time total download formulas count rows by accounting-office name and analysis type, for example `COUNTIFS($I:$I, office, $H:$H, analysis_type)`.

For Alexander Logan, that row-level method gives:

- Raw analysis/download rows: 548
- Exact core event rows after de-duplicating by email, timestamp, type, office, company name, and company CVR: 548

So the 548 rows are not duplicate rows in the simple event sense. They are repeated analyses/downloads against the same client companies.

## What constitutes a unique download

The all-time unique-download formula in the master sheet counts distinct analyzed company names for an accounting office. The relevant formula pattern is:

```excel
COUNTA(UNIQUE(FILTER($K$3:$K$4991,$I$3:$I$4991=office)))
```

In plain English: filter rows to one accounting office, take the analyzed company name from column `K`, then count each company once.

The monthly unique-download section uses the same idea by month: distinct analyzed company names for an accounting office and month. The monthly total is a sum of monthly unique counts, so the same company can count once in February and once again in March.

Applied to Alexander Logan:

- Raw downloads / analyses: 548
- Unique client companies all time, using `analyzed_company_name`: 80
- Sum of monthly unique client-company counts: 86
- Rows included in 548 but excluded from all-time unique count: 468

## Reconciliation

| Metric | Count | Meaning |
| --- | ---: | --- |
| Raw Alexander rows | 548 | Every matched `DA_data` activity row for Alexander Logan |
| Exact unique event rows | 548 | Same as raw count; no exact event duplicates found |
| All-time unique downloads | 80 | Distinct client companies analyzed by Alexander Logan |
| Monthly unique downloads | 86 | Distinct client companies per month, summed across months |
| Rows excluded by all-time unique logic | 468 | Repeated analyses of client companies after the first occurrence |

## Analyses excluded from all-time unique count

The rows excluded from the all-time unique count are not invalid. They are additional analyses/downloads for client companies Alexander had already analyzed at least once. Common reasons are multiple analysis types for the same company, repeated analyses on the same date, or analyses of the same company in later months.

Top repeated client companies:

| Client company | Client CVR | Raw rows | Rows excluded by all-time unique logic |
| --- | --- | ---: | ---: |
| WATTOO.DK A/S | 32067263 | 45 | 44 |
| FLISE BENT A/S | 87465314 | 25 | 24 |
| Meny Saltum A/S | 28283121 | 20 | 19 |
| Seamar Scandinavia A/S | 33752059 | 17 | 16 |
| De Studerendes Hus i Århus | 27364039 | 16 | 15 |
| Exercere ApS | 40525084 | 15 | 14 |
| KOMPOSITTERRASSE.DK ApS | 34486999 | 13 | 12 |
| Pallekoncept ApS | 34716250 | 12 | 11 |
| Apply ApS | 40237992 | 12 | 11 |
| Ejendomsmæglerfirmaet John Frandsen Galten & Odder A/S | 41021977 | 11 | 10 |
| EJENDOMSMÆGLERFIRMAET JOHN FRANDSEN A/S | 19752372 | 11 | 10 |
| HELLERUP ELEKTRIKEREN ApS | 32831990 | 9 | 8 |
| Ejendomsmæglerfirmaet John Frandsen Syddjurs A/S | 43609084 | 9 | 8 |
| Ejendomsmæglerfirmaet John Frandsen Løgstør og Aars A/S | 43716085 | 9 | 8 |
| Taksator.nu ApS | 38994883 | 9 | 8 |
| BN Skilte A/S | 49907028 | 9 | 8 |
| PHARMA-TECH A/S | 32940897 | 9 | 8 |
| Vallensbækdellen ApS | 31879914 | 8 | 7 |
| Pind & Partnere Advokatpartnerselskab | 37405671 | 8 | 7 |
| SMOCK ENTREPRISE ApS | 30832744 | 8 | 7 |
| HV LÅSETEKNIK ApS | 32835007 | 8 | 7 |
| Datterselskabet Trekroner ApS | 40336443 | 8 | 7 |
| SK Tømrer og Snedker ApS | 34461023 | 8 | 7 |
| FRANKLY JUICE A/S | 32349811 | 8 | 7 |
| Aastrand Tømrerentreprise ApS | 43203088 | 8 | 7 |
| LUDV. BJØRNS VINHANDEL A/S | 37970816 | 8 | 7 |
| FWN EJENDOMME ApS | 34895627 | 7 | 6 |
| Fair Games ApS | 43302981 | 7 | 6 |
| Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 6 | 5 |
| HVALSØ TELTUDLEJNING ApS | 30729951 | 6 | 5 |

Excluded rows by month:

| Month | Excluded rows |
| --- | ---: |
| 2025-02 | 43 |
| 2025-03 | 117 |
| 2025-04 | 46 |
| 2025-05 | 66 |
| 2025-06 | 37 |
| 2025-10 | 7 |
| 2025-11 | 14 |
| 2025-12 | 18 |
| 2026-01 | 17 |
| 2026-02 | 70 |
| 2026-03 | 23 |
| 2026-04 | 1 |
| 2026-05 | 9 |

Excluded rows by analysis type:

| Analysis type | Excluded rows |
| --- | ---: |
| EssentialPalItems | 127 |
| RevenueAnalysis | 109 |
| DebtorAnalysis | 72 |
| RevenueReconciliation | 67 |
| BenchmarkAnalysis | 53 |
| RevenueReconciliationV2 | 36 |
| CreditorAnalysis | 2 |
| SalaryAnalysis | 2 |

## Can 533 be reproduced with the same unique logic?

No, not for Alexander Logan using the master-sheet unique-download logic.

- Alexander raw rows: 548
- Alexander all-time unique downloads: 80
- Alexander monthly unique-download sum: 86

The number 533 is reproducible elsewhere in the master data, but as a raw total download count, not as Alexander Logan unique downloads. For example:

| Group | Raw downloads | All-time unique analyzed companies | Monthly unique sum |
| --- | ---: | ---: | ---: |
| Grant Thornton, Godkendt Revisionspartnerselskab | 4,182 | 505 | 698 |
| REVISIONSFIRMAET EDELBO STATSAUTORISERET REVISIONSPARTNERSELSKAB | 533 | 73 | 134 |
| Alexander Logan | 548 | 80 | 86 |

Therefore, if 533 is being used as an Alexander Logan number, it is not produced by the unique-download formulas found in the master sheet. It is either a different filter, a different workbook version, or a raw download total from another grouping.

## Appendix: first 100 rows excluded by all-time unique logic

The full excluded set has 468 rows. The first 100 are shown here for manual checking.

| Source row | Created | Month | Client company | Client CVR | Analysis type |
| ---: | --- | --- | --- | --- | --- |
| 4698 | 2025-02-05 08:54:25 | 2025-02 | Solara ApS | 40934499 | EssentialPalItems |
| 4697 | 2025-02-05 08:55:06 | 2025-02 | Solara ApS | 40934499 | DebtorAnalysis |
| 4696 | 2025-02-05 08:55:40 | 2025-02 | Solara ApS | 40934499 | RevenueReconciliation |
| 4646 | 2025-02-20 09:24:33 | 2025-02 | FLISE BENT A/S | 87465314 | EssentialPalItems |
| 4645 | 2025-02-20 09:24:56 | 2025-02 | FLISE BENT A/S | 87465314 | DebtorAnalysis |
| 4644 | 2025-02-20 09:25:23 | 2025-02 | FLISE BENT A/S | 87465314 | RevenueReconciliation |
| 4643 | 2025-02-20 09:25:49 | 2025-02 | FLISE BENT A/S | 87465314 | RevenueAnalysis |
| 4642 | 2025-02-20 09:26:35 | 2025-02 | FLISE BENT A/S | 87465314 | BenchmarkAnalysis |
| 4636 | 2025-02-20 14:20:14 | 2025-02 | FLISE BENT A/S | 87465314 | RevenueReconciliation |
| 4631 | 2025-02-20 14:26:34 | 2025-02 | FLISE BENT A/S | 87465314 | RevenueReconciliation |
| 4630 | 2025-02-20 14:34:03 | 2025-02 | Solara ApS | 40934499 | RevenueReconciliation |
| 4626 | 2025-02-21 07:31:36 | 2025-02 | FLISE BENT A/S | 87465314 | RevenueReconciliation |
| 4621 | 2025-02-21 13:00:19 | 2025-02 | FWN EJENDOMME ApS | 34895627 | EssentialPalItems |
| 4620 | 2025-02-21 13:01:03 | 2025-02 | FWN EJENDOMME ApS | 34895627 | RevenueAnalysis |
| 4619 | 2025-02-21 13:01:23 | 2025-02 | FWN EJENDOMME ApS | 34895627 | DebtorAnalysis |
| 4618 | 2025-02-21 13:02:41 | 2025-02 | FWN EJENDOMME ApS | 34895627 | EssentialPalItems |
| 4617 | 2025-02-21 13:03:01 | 2025-02 | FWN EJENDOMME ApS | 34895627 | RevenueReconciliation |
| 4616 | 2025-02-21 13:05:38 | 2025-02 | FWN EJENDOMME ApS | 34895627 | BenchmarkAnalysis |
| 4607 | 2025-02-26 09:05:55 | 2025-02 | FLISE BENT A/S | 87465314 | RevenueReconciliation |
| 4604 | 2025-02-28 08:47:45 | 2025-02 | Fair Games ApS | 43302981 | BenchmarkAnalysis |
| 4603 | 2025-02-28 08:48:55 | 2025-02 | Fair Games ApS | 43302981 | BenchmarkAnalysis |
| 4602 | 2025-02-28 08:55:04 | 2025-02 | Fair Games ApS | 43302981 | EssentialPalItems |
| 4600 | 2025-02-28 10:00:14 | 2025-02 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | EssentialPalItems |
| 4599 | 2025-02-28 10:00:54 | 2025-02 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | RevenueAnalysis |
| 4598 | 2025-02-28 10:01:49 | 2025-02 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | DebtorAnalysis |
| 4597 | 2025-02-28 10:03:06 | 2025-02 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | RevenueReconciliation |
| 4596 | 2025-02-28 10:04:04 | 2025-02 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | BenchmarkAnalysis |
| 4594 | 2025-02-28 10:27:14 | 2025-02 | WATTOO.DK A/S | 32067263 | EssentialPalItems |
| 4593 | 2025-02-28 10:27:44 | 2025-02 | WATTOO.DK A/S | 32067263 | EssentialPalItems |
| 4592 | 2025-02-28 10:30:54 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4591 | 2025-02-28 10:31:25 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4590 | 2025-02-28 10:32:08 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4589 | 2025-02-28 10:34:05 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4588 | 2025-02-28 10:34:37 | 2025-02 | WATTOO.DK A/S | 32067263 | DebtorAnalysis |
| 4587 | 2025-02-28 10:35:07 | 2025-02 | WATTOO.DK A/S | 32067263 | DebtorAnalysis |
| 4586 | 2025-02-28 10:35:51 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4585 | 2025-02-28 10:37:18 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4578 | 2025-02-28 14:44:44 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4577 | 2025-02-28 14:51:22 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4576 | 2025-02-28 14:52:18 | 2025-02 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4575 | 2025-02-28 15:14:38 | 2025-02 | Fair Games ApS | 43302981 | EssentialPalItems |
| 4574 | 2025-02-28 15:15:43 | 2025-02 | Fair Games ApS | 43302981 | RevenueAnalysis |
| 4573 | 2025-02-28 15:16:00 | 2025-02 | Fair Games ApS | 43302981 | BenchmarkAnalysis |
| 4537 | 2025-03-05 08:55:41 | 2025-03 | Vallensbækdellen ApS | 31879914 | RevenueAnalysis |
| 4536 | 2025-03-05 08:55:49 | 2025-03 | Vallensbækdellen ApS | 31879914 | DebtorAnalysis |
| 4534 | 2025-03-05 09:11:54 | 2025-03 | Vallensbækdellen ApS | 31879914 | EssentialPalItems |
| 4533 | 2025-03-05 09:12:24 | 2025-03 | Vallensbækdellen ApS | 31879914 | EssentialPalItems |
| 4532 | 2025-03-05 09:12:54 | 2025-03 | Vallensbækdellen ApS | 31879914 | EssentialPalItems |
| 4531 | 2025-03-05 09:19:03 | 2025-03 | Vallensbækdellen ApS | 31879914 | EssentialPalItems |
| 4530 | 2025-03-05 09:19:31 | 2025-03 | Vallensbækdellen ApS | 31879914 | RevenueAnalysis |
| 4529 | 2025-03-05 09:20:44 | 2025-03 | Copenhagen Light Production A/S | 30487206 | EssentialPalItems |
| 4528 | 2025-03-05 09:21:14 | 2025-03 | Copenhagen Light Production A/S | 30487206 | EssentialPalItems |
| 4527 | 2025-03-05 09:21:44 | 2025-03 | Copenhagen Light Production A/S | 30487206 | EssentialPalItems |
| 4526 | 2025-03-05 09:22:58 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4525 | 2025-03-05 09:23:28 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4524 | 2025-03-05 09:24:22 | 2025-03 | WATTOO.DK A/S | 32067263 | BenchmarkAnalysis |
| 4523 | 2025-03-05 09:24:57 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueReconciliation |
| 4522 | 2025-03-05 09:25:28 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueReconciliation |
| 4521 | 2025-03-05 09:25:57 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueReconciliation |
| 4520 | 2025-03-05 09:27:39 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4519 | 2025-03-05 09:28:09 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4507 | 2025-03-05 10:24:27 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4506 | 2025-03-05 10:24:57 | 2025-03 | WATTOO.DK A/S | 32067263 | RevenueAnalysis |
| 4482 | 2025-03-12 10:22:42 | 2025-03 | Exercere ApS | 40525084 | EssentialPalItems |
| 4481 | 2025-03-12 11:27:06 | 2025-03 | Tian Fu ApS | 39879182 | RevenueAnalysis |
| 4480 | 2025-03-12 11:30:16 | 2025-03 | Exercere ApS | 40525084 | EssentialPalItems |
| 4479 | 2025-03-12 11:30:46 | 2025-03 | Exercere ApS | 40525084 | EssentialPalItems |
| 4478 | 2025-03-12 11:31:16 | 2025-03 | Exercere ApS | 40525084 | EssentialPalItems |
| 4477 | 2025-03-12 11:37:55 | 2025-03 | Exercere ApS | 40525084 | EssentialPalItems |
| 4476 | 2025-03-12 11:38:26 | 2025-03 | Exercere ApS | 40525084 | RevenueAnalysis |
| 4475 | 2025-03-12 11:38:56 | 2025-03 | Exercere ApS | 40525084 | RevenueAnalysis |
| 4474 | 2025-03-12 11:39:36 | 2025-03 | Exercere ApS | 40525084 | DebtorAnalysis |
| 4473 | 2025-03-12 11:39:48 | 2025-03 | Exercere ApS | 40525084 | RevenueReconciliation |
| 4472 | 2025-03-12 11:40:18 | 2025-03 | Exercere ApS | 40525084 | RevenueReconciliation |
| 4466 | 2025-03-12 12:00:04 | 2025-03 | Exercere ApS | 40525084 | RevenueReconciliation |
| 4456 | 2025-03-12 13:35:35 | 2025-03 | Pallekoncept ApS | 34716250 | EssentialPalItems |
| 4455 | 2025-03-12 13:36:05 | 2025-03 | Pallekoncept ApS | 34716250 | EssentialPalItems |
| 4454 | 2025-03-12 13:44:42 | 2025-03 | Pallekoncept ApS | 34716250 | EssentialPalItems |
| 4453 | 2025-03-12 13:57:32 | 2025-03 | Pallekoncept ApS | 34716250 | EssentialPalItems |
| 4452 | 2025-03-12 13:58:02 | 2025-03 | Pallekoncept ApS | 34716250 | EssentialPalItems |
| 4451 | 2025-03-12 14:02:44 | 2025-03 | Pallekoncept ApS | 34716250 | RevenueAnalysis |
| 4450 | 2025-03-12 14:03:07 | 2025-03 | Pallekoncept ApS | 34716250 | DebtorAnalysis |
| 4449 | 2025-03-12 14:03:37 | 2025-03 | Pallekoncept ApS | 34716250 | DebtorAnalysis |
| 4448 | 2025-03-12 14:03:56 | 2025-03 | Pallekoncept ApS | 34716250 | RevenueReconciliation |
| 4447 | 2025-03-12 14:04:19 | 2025-03 | Pallekoncept ApS | 34716250 | BenchmarkAnalysis |
| 4446 | 2025-03-12 14:10:06 | 2025-03 | Pallekoncept ApS | 34716250 | RevenueReconciliation |
| 4442 | 2025-03-14 09:15:58 | 2025-03 | Exercere ApS | 40525084 | RevenueReconciliation |
| 4441 | 2025-03-14 09:16:28 | 2025-03 | Exercere ApS | 40525084 | RevenueReconciliation |
| 4437 | 2025-03-14 10:22:23 | 2025-03 | Exercere ApS | 40525084 | DebtorAnalysis |
| 4432 | 2025-03-14 11:59:49 | 2025-03 | Pind & Partnere Advokatpartnerselskab | 37405671 | EssentialPalItems |
| 4431 | 2025-03-14 12:00:19 | 2025-03 | Pind & Partnere Advokatpartnerselskab | 37405671 | EssentialPalItems |
| 4430 | 2025-03-14 12:01:14 | 2025-03 | Pind & Partnere Advokatpartnerselskab | 37405671 | EssentialPalItems |
| 4429 | 2025-03-14 12:02:36 | 2025-03 | Pind & Partnere Advokatpartnerselskab | 37405671 | EssentialPalItems |
| 4428 | 2025-03-14 12:03:01 | 2025-03 | Pind & Partnere Advokatpartnerselskab | 37405671 | RevenueAnalysis |
| 4427 | 2025-03-14 12:03:17 | 2025-03 | Pind & Partnere Advokatpartnerselskab | 37405671 | RevenueReconciliation |
| 4426 | 2025-03-14 12:03:56 | 2025-03 | Pind & Partnere Advokatpartnerselskab | 37405671 | BenchmarkAnalysis |
| 4400 | 2025-03-14 15:46:17 | 2025-03 | SMOCK ENTREPRISE ApS | 30832744 | EssentialPalItems |
| 4399 | 2025-03-14 15:46:57 | 2025-03 | SMOCK ENTREPRISE ApS | 30832744 | RevenueAnalysis |
| 4398 | 2025-03-14 15:47:21 | 2025-03 | SMOCK ENTREPRISE ApS | 30832744 | DebtorAnalysis |
| 4397 | 2025-03-14 15:47:51 | 2025-03 | SMOCK ENTREPRISE ApS | 30832744 | RevenueReconciliation |
