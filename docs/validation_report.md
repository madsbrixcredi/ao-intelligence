# Validation report

Purpose: manually verify that accounting offices are being identified correctly before any dashboards are built.

Source workbook: `data/raw/Downloads master sheet (49)-kopi.xlsx`

Source sheet: `DA_data`

Sampling: 30 random rows using fixed seed `20260610`, then sorted by Excel row number for easier manual lookup.

Raw files were read only. No raw data was modified.

## Derivation method

For each sampled row:

1. `user_name` is enriched from `Priority clients active compani` by matching `user_email`.
2. `derived_accounting_office_name` is taken from `requesting_company_name_fixed`; if missing, it falls back to `requesting_company_name`, then email domain.
3. `derived_accounting_office_cvr` is taken from `analyzed_company_vat` when that CVR exists in the normalized declaration-office CVR list.
4. If `analyzed_company_vat` does not match the declaration CVR list, `requesting_company_vat` is used only as a fallback when it matches a declaration CVR.
5. If neither CVR matches declarations, `analyzed_company_vat` is kept as a low-confidence candidate for manual review.
6. `month` is derived from `created`; `analysis_type` is copied from `type`.

## Validation sample

| id | source_row | user_email | user_name | requesting_company_name_fixed | requesting_company_vat | analyzed_company_name | analyzed_company_vat | derived_accounting_office_name | derived_accounting_office_cvr | month | analysis_type | confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 87 | aso@beierholm.dk | Andreas Sørup Jepsen | Beierholm | 15882093 | Amtech ApS | 32895468 | Beierholm | 32895468 | 2024-08 | RevenueAnalysis | high |
| 2 | 409 | alni@danskrevision.dk |  | Dansk Revision Slagelse & Nyborg | 15108045 | Wenzel Nielsen | 29919801 | Dansk Revision Slagelse & Nyborg | 29919801 | 2025-03 | EssentialPalItems | high |
| 3 | 1025 | Nicolas.Thrue@dk.gt.com | Nicolas Lindegaard Thrue | Grant Thornton, Godkendt Revisionspartnerselskab | 30916107 | Din Bilpartner Lystrup ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2026-04 | DebtorAnalysis | high |
| 4 | 1224 | Oliver.blankensteiner@dk.gt.com | Oliver Blankensteiner | Grant Thornton, Godkendt Revisionspartnerselskab | 44609258 | Clarity Partners P/S | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2026-04 | RevenueAnalysis | high |
| 5 | 1501 | liva.timmermann@dk.gt.com | Liva Kring Timmermann | Grant Thornton, Godkendt Revisionspartnerselskab | 38747592 | Alice ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2026-03 | RevenueAnalysis | high |
| 6 | 1535 | kasper.schultz@dk.gt.com | Kasper Trampedach Schultz | Grant Thornton, Godkendt Revisionspartnerselskab | 38345672 | Sonny Rhs ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2026-03 | RevenueReconciliationV2 | high |
| 7 | 1702 | kasper.schultz@dk.gt.com | Kasper Trampedach Schultz | Grant Thornton, Godkendt Revisionspartnerselskab | 37936448 | Consolidated Forwarding Corporation ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2026-03 | DebtorAnalysis | high |
| 8 | 1775 | Nicolas.Thrue@dk.gt.com | Nicolas Lindegaard Thrue | Grant Thornton, Godkendt Revisionspartnerselskab | 34883637 | KloAgger A/S | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2026-03 | RevenueAnalysis | high |
| 9 | 2230 | jesper.christensen@dk.gt.com | Jesper Due Christensen | Grant Thornton, Godkendt Revisionspartnerselskab | 39157160 | SINUZ ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2026-02 | RevenueAnalysis | high |
| 10 | 2981 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 87465314 | FLISE BENT A/S | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-12 | EssentialPalItems | high |
| 11 | 3005 | thomas.thinghuus-jensen@dk.gt.com | Thomas Thinghuus-Jensen | Grant Thornton, Godkendt Revisionspartnerselskab | 58224618 | ERIK SVENDSEN ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-12 | DebtorAnalysis | high |
| 12 | 3281 | thomas.thinghuus-jensen@dk.gt.com | Thomas Thinghuus-Jensen | Grant Thornton, Godkendt Revisionspartnerselskab | 87415511 | ApS KILDEBRØNDE TRANSPORT. OVE KRISTIANSEN | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-09 | RevenueReconciliationV2 | high |
| 13 | 3337 | thomas.thinghuus-jensen@dk.gt.com | Thomas Thinghuus-Jensen | Grant Thornton, Godkendt Revisionspartnerselskab | 38691236 | juno the bakery ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-09 | EssentialPalItems | high |
| 14 | 3893 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 20947799 | MV POLERING A/S | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-05 | RevenueReconciliation | high |
| 15 | 3989 | anders.ahlmann@dk.gt.com | Anders Ahlmann | Grant Thornton, Godkendt Revisionspartnerselskab | 18614243 | IBSEN EL-ANLÆG A/S | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-04 | EssentialPalItems | high |
| 16 | 4408 | anders.ahlmann@dk.gt.com | Anders Ahlmann | Grant Thornton, Godkendt Revisionspartnerselskab | 37499595 | Spejlblank Vinduespolering ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-03 | BenchmarkAnalysis | high |
| 17 | 4584 | lasse.storvang@dk.gt.com | Lasse Lund Storvang | Grant Thornton, Godkendt Revisionspartnerselskab | 10049911 | LOGIS A/S | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-02 | EssentialPalItems | high |
| 18 | 4594 | alexander.logan@dk.gt.com | Alexander Logan | Grant Thornton, Godkendt Revisionspartnerselskab | 32067263 | WATTOO.DK A/S | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2025-02 | EssentialPalItems | high |
| 19 | 4777 | soeren.christensen@dk.gt.com | Søren Christensen | Grant Thornton, Godkendt Revisionspartnerselskab | 31896738 | Café Blågårds Apotek ApS | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 34209936 | 2024-06 | RevenueAnalysis | high |
| 20 | 5154 | pr@plature.com |  | Plature | 38732420 | Plature ApS | 38732420 | Plature | 38732420 | 2025-12 | RevenueAnalysis | low |
| 21 | 5332 | SuastiniDesak@powered-by.dk |  | Powered-By Statsautoriseret Revisionspartnerselskab | 44282380 | Powered-By Statsautoriseret Revisionspartnerselskab | 44282380 | Powered-By Statsautoriseret Revisionspartnerselskab | 44282380 | 2026-01 | SalaryAnalysis | high |
| 22 | 5382 | mrasmussen@powered-by.dk | Martin Rasmussen | Powered-By Statsautoriseret Revisionspartnerselskab | 33259336 | Minuba ApS | 33259336 | Powered-By Statsautoriseret Revisionspartnerselskab | 33259336 | 2025-05 | RevenueAnalysis | low |
| 23 | 5462 | ddj@revi-midt.dk | Dennis Damborg Jensen | Revi Midt | 34888973 | Taulborg VVS ApS | 34480370 | Revi Midt | 34480370 | 2026-03 | EssentialPalItems | high |
| 24 | 5546 | rof@axelgram.dk |  | Revisionsfirmaet Axel Gram I/S | 40420568 | Tammer Invest ApS | 16645699 | Revisionsfirmaet Axel Gram I/S | 16645699 | 2026-04 | DebtorAnalysis | high |
| 25 | 5553 | rof@axelgram.dk |  | Revisionsfirmaet Axel Gram I/S | 38217933 | CAFE CUCKOO´S NEST ODENSE APS | 16645699 | Revisionsfirmaet Axel Gram I/S | 16645699 | 2026-04 | RevenueAnalysis | high |
| 26 | 5667 | tb@axelgram.dk | Tina Buus | Revisionsfirmaet Axel Gram I/S | 44634562 | Odense Bilhus ApS | 16645699 | Revisionsfirmaet Axel Gram I/S | 16645699 | 2025-04 | RevenueReconciliation | high |
| 27 | 5955 | ms@edelbo.dk | MALENE STEMPIN | REVISIONSFIRMAET EDELBO STATSAUTORISERET REVISIONSPARTNERSELSKAB | 42534188 | Bilboel A/S | 35486178 | REVISIONSFIRMAET EDELBO STATSAUTORISERET REVISIONSPARTNERSELSKAB | 35486178 | 2025-10 | RevenueReconciliationV2 | high |
| 28 | 6060 | ml@edelbo.dk | MARTIN LARSEN | REVISIONSFIRMAET EDELBO STATSAUTORISERET REVISIONSPARTNERSELSKAB | 34619549 | HCC Bådeværft K/S | 35486178 | REVISIONSFIRMAET EDELBO STATSAUTORISERET REVISIONSPARTNERSELSKAB | 35486178 | 2025-05 | RevenueAnalysis | high |
| 29 | 6314 | soeren@revigruppen.dk | Søren Tofte Jensen | RevisorGruppen I/S | 32284426 | Entreprenør Peter Mortensen ApS | 34953619 | RevisorGruppen I/S | 34953619 | 2026-04 | RevenueAnalysis | low |
| 30 | 6756 | Rune@skov-revision.dk | Rune Bach | Skov Revision ApS | 42222593 | Det Glade Vanvid, Viborg ApS | 27525989 | Skov Revision ApS | 27525989 | 2025-03 | RevenueReconciliation | high |

## Row-by-row identification steps

### Row 1: Excel row 87

1. Read `user_email` = `aso@beierholm.dk`.
2. User name: `Andreas Sørup Jepsen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Beierholm` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `15882093`, `analyzed_company_vat` = `32895468`.
5. Accounting-office CVR: `32895468` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `32895468` exists in the declaration accounting-office CVR list as `Beierholm`.
7. Activity fields: month `2024-08`, analysis type `RevenueAnalysis`, analyzed company `Amtech ApS.`

### Row 2: Excel row 409

1. Read `user_email` = `alni@danskrevision.dk`.
2. User name: `not found`; no `user_name` match found in `Priority clients active compani`.
3. Accounting-office name: `Dansk Revision Slagelse & Nyborg` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `15108045`, `analyzed_company_vat` = `29919801`.
5. Accounting-office CVR: `29919801` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `29919801` exists in the declaration accounting-office CVR list as `Dansk Revision Slagelse`.
7. Activity fields: month `2025-03`, analysis type `EssentialPalItems`, analyzed company `Wenzel Nielsen.`

### Row 3: Excel row 1025

1. Read `user_email` = `Nicolas.Thrue@dk.gt.com`.
2. User name: `Nicolas Lindegaard Thrue`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `30916107`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2026-04`, analysis type `DebtorAnalysis`, analyzed company `Din Bilpartner Lystrup ApS.`

### Row 4: Excel row 1224

1. Read `user_email` = `Oliver.blankensteiner@dk.gt.com`.
2. User name: `Oliver Blankensteiner`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `44609258`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2026-04`, analysis type `RevenueAnalysis`, analyzed company `Clarity Partners P/S.`

### Row 5: Excel row 1501

1. Read `user_email` = `liva.timmermann@dk.gt.com`.
2. User name: `Liva Kring Timmermann`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `38747592`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2026-03`, analysis type `RevenueAnalysis`, analyzed company `Alice ApS.`

### Row 6: Excel row 1535

1. Read `user_email` = `kasper.schultz@dk.gt.com`.
2. User name: `Kasper Trampedach Schultz`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `38345672`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2026-03`, analysis type `RevenueReconciliationV2`, analyzed company `Sonny Rhs ApS.`

### Row 7: Excel row 1702

1. Read `user_email` = `kasper.schultz@dk.gt.com`.
2. User name: `Kasper Trampedach Schultz`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `37936448`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2026-03`, analysis type `DebtorAnalysis`, analyzed company `Consolidated Forwarding Corporation ApS.`

### Row 8: Excel row 1775

1. Read `user_email` = `Nicolas.Thrue@dk.gt.com`.
2. User name: `Nicolas Lindegaard Thrue`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `34883637`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2026-03`, analysis type `RevenueAnalysis`, analyzed company `KloAgger A/S.`

### Row 9: Excel row 2230

1. Read `user_email` = `jesper.christensen@dk.gt.com`.
2. User name: `Jesper Due Christensen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `39157160`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2026-02`, analysis type `RevenueAnalysis`, analyzed company `SINUZ ApS.`

### Row 10: Excel row 2981

1. Read `user_email` = `alexander.logan@dk.gt.com`.
2. User name: `Alexander Logan`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `87465314`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-12`, analysis type `EssentialPalItems`, analyzed company `FLISE BENT A/S.`

### Row 11: Excel row 3005

1. Read `user_email` = `thomas.thinghuus-jensen@dk.gt.com`.
2. User name: `Thomas Thinghuus-Jensen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `58224618`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-12`, analysis type `DebtorAnalysis`, analyzed company `ERIK SVENDSEN ApS.`

### Row 12: Excel row 3281

1. Read `user_email` = `thomas.thinghuus-jensen@dk.gt.com`.
2. User name: `Thomas Thinghuus-Jensen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `87415511`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-09`, analysis type `RevenueReconciliationV2`, analyzed company `ApS KILDEBRØNDE TRANSPORT. OVE KRISTIANSEN.`

### Row 13: Excel row 3337

1. Read `user_email` = `thomas.thinghuus-jensen@dk.gt.com`.
2. User name: `Thomas Thinghuus-Jensen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `38691236`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-09`, analysis type `EssentialPalItems`, analyzed company `juno the bakery ApS.`

### Row 14: Excel row 3893

1. Read `user_email` = `alexander.logan@dk.gt.com`.
2. User name: `Alexander Logan`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `20947799`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-05`, analysis type `RevenueReconciliation`, analyzed company `MV POLERING A/S.`

### Row 15: Excel row 3989

1. Read `user_email` = `anders.ahlmann@dk.gt.com`.
2. User name: `Anders Ahlmann`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `18614243`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-04`, analysis type `EssentialPalItems`, analyzed company `IBSEN EL-ANLÆG A/S.`

### Row 16: Excel row 4408

1. Read `user_email` = `anders.ahlmann@dk.gt.com`.
2. User name: `Anders Ahlmann`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `37499595`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-03`, analysis type `BenchmarkAnalysis`, analyzed company `Spejlblank Vinduespolering ApS.`

### Row 17: Excel row 4584

1. Read `user_email` = `lasse.storvang@dk.gt.com`.
2. User name: `Lasse Lund Storvang`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `10049911`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-02`, analysis type `EssentialPalItems`, analyzed company `LOGIS A/S.`

### Row 18: Excel row 4594

1. Read `user_email` = `alexander.logan@dk.gt.com`.
2. User name: `Alexander Logan`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `32067263`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2025-02`, analysis type `EssentialPalItems`, analyzed company `WATTOO.DK A/S.`

### Row 19: Excel row 4777

1. Read `user_email` = `soeren.christensen@dk.gt.com`.
2. User name: `Søren Christensen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Grant Thornton, Godkendt Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `31896738`, `analyzed_company_vat` = `34209936`.
5. Accounting-office CVR: `34209936` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34209936` exists in the declaration accounting-office CVR list as `Grant Thornton`.
7. Activity fields: month `2024-06`, analysis type `RevenueAnalysis`, analyzed company `Café Blågårds Apotek ApS.`

### Row 20: Excel row 5154

1. Read `user_email` = `pr@plature.com`.
2. User name: `not found`; no `user_name` match found in `Priority clients active compani`.
3. Accounting-office name: `Plature` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `38732420`, `analyzed_company_vat` = `38732420`.
5. Accounting-office CVR: `38732420` from `analyzed_company_vat` candidate, not declaration-matched; confidence = `low`.
6. CVR reasoning: No declaration-table CVR match found. Kept `analyzed_company_vat` `38732420` as a candidate because it is the best observed AO-CVR field in `DA_data`, but this row needs manual confirmation.
7. Activity fields: month `2025-12`, analysis type `RevenueAnalysis`, analyzed company `Plature ApS.`

### Row 21: Excel row 5332

1. Read `user_email` = `SuastiniDesak@powered-by.dk`.
2. User name: `not found`; no `user_name` match found in `Priority clients active compani`.
3. Accounting-office name: `Powered-By Statsautoriseret Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `44282380`, `analyzed_company_vat` = `44282380`.
5. Accounting-office CVR: `44282380` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `44282380` exists in the declaration accounting-office CVR list as `Powered-By Statsautoriseret Revisionspartnerselskab`.
7. Activity fields: month `2026-01`, analysis type `SalaryAnalysis`, analyzed company `Powered-By Statsautoriseret Revisionspartnerselskab.`

### Row 22: Excel row 5382

1. Read `user_email` = `mrasmussen@powered-by.dk`.
2. User name: `Martin Rasmussen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Powered-By Statsautoriseret Revisionspartnerselskab` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `33259336`, `analyzed_company_vat` = `33259336`.
5. Accounting-office CVR: `33259336` from `analyzed_company_vat` candidate, not declaration-matched; confidence = `low`.
6. CVR reasoning: No declaration-table CVR match found. Kept `analyzed_company_vat` `33259336` as a candidate because it is the best observed AO-CVR field in `DA_data`, but this row needs manual confirmation.
7. Activity fields: month `2025-05`, analysis type `RevenueAnalysis`, analyzed company `Minuba ApS.`

### Row 23: Excel row 5462

1. Read `user_email` = `ddj@revi-midt.dk`.
2. User name: `Dennis Damborg Jensen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Revi Midt` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `34888973`, `analyzed_company_vat` = `34480370`.
5. Accounting-office CVR: `34480370` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `34480370` exists in the declaration accounting-office CVR list as `Revimidt`.
7. Activity fields: month `2026-03`, analysis type `EssentialPalItems`, analyzed company `Taulborg VVS ApS.`

### Row 24: Excel row 5546

1. Read `user_email` = `rof@axelgram.dk`.
2. User name: `not found`; no `user_name` match found in `Priority clients active compani`.
3. Accounting-office name: `Revisionsfirmaet Axel Gram I/S` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `40420568`, `analyzed_company_vat` = `16645699`.
5. Accounting-office CVR: `16645699` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `16645699` exists in the declaration accounting-office CVR list as `Revisionsfirmaet Axel Gram`.
7. Activity fields: month `2026-04`, analysis type `DebtorAnalysis`, analyzed company `Tammer Invest ApS.`

### Row 25: Excel row 5553

1. Read `user_email` = `rof@axelgram.dk`.
2. User name: `not found`; no `user_name` match found in `Priority clients active compani`.
3. Accounting-office name: `Revisionsfirmaet Axel Gram I/S` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `38217933`, `analyzed_company_vat` = `16645699`.
5. Accounting-office CVR: `16645699` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `16645699` exists in the declaration accounting-office CVR list as `Revisionsfirmaet Axel Gram`.
7. Activity fields: month `2026-04`, analysis type `RevenueAnalysis`, analyzed company `CAFE CUCKOO´S NEST ODENSE APS.`

### Row 26: Excel row 5667

1. Read `user_email` = `tb@axelgram.dk`.
2. User name: `Tina Buus`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Revisionsfirmaet Axel Gram I/S` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `44634562`, `analyzed_company_vat` = `16645699`.
5. Accounting-office CVR: `16645699` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `16645699` exists in the declaration accounting-office CVR list as `Revisionsfirmaet Axel Gram`.
7. Activity fields: month `2025-04`, analysis type `RevenueReconciliation`, analyzed company `Odense Bilhus ApS.`

### Row 27: Excel row 5955

1. Read `user_email` = `ms@edelbo.dk`.
2. User name: `MALENE STEMPIN`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `REVISIONSFIRMAET EDELBO STATSAUTORISERET REVISIONSPARTNERSELSKAB` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `42534188`, `analyzed_company_vat` = `35486178`.
5. Accounting-office CVR: `35486178` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `35486178` exists in the declaration accounting-office CVR list as `Revisionsfirmaet Edelbo`.
7. Activity fields: month `2025-10`, analysis type `RevenueReconciliationV2`, analyzed company `Bilboel A/S.`

### Row 28: Excel row 6060

1. Read `user_email` = `ml@edelbo.dk`.
2. User name: `MARTIN LARSEN`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `REVISIONSFIRMAET EDELBO STATSAUTORISERET REVISIONSPARTNERSELSKAB` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `34619549`, `analyzed_company_vat` = `35486178`.
5. Accounting-office CVR: `35486178` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `35486178` exists in the declaration accounting-office CVR list as `Revisionsfirmaet Edelbo`.
7. Activity fields: month `2025-05`, analysis type `RevenueAnalysis`, analyzed company `HCC Bådeværft K/S.`

### Row 29: Excel row 6314

1. Read `user_email` = `soeren@revigruppen.dk`.
2. User name: `Søren Tofte Jensen`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `RevisorGruppen I/S` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `32284426`, `analyzed_company_vat` = `34953619`.
5. Accounting-office CVR: `34953619` from `analyzed_company_vat` candidate, not declaration-matched; confidence = `low`.
6. CVR reasoning: No declaration-table CVR match found. Kept `analyzed_company_vat` `34953619` as a candidate because it is the best observed AO-CVR field in `DA_data`, but this row needs manual confirmation.
7. Activity fields: month `2026-04`, analysis type `RevenueAnalysis`, analyzed company `Entreprenør Peter Mortensen ApS.`

### Row 30: Excel row 6756

1. Read `user_email` = `Rune@skov-revision.dk`.
2. User name: `Rune Bach`; matched from `Priority clients active compani.user_name` using `user_email`.
3. Accounting-office name: `Skov Revision ApS` from `requesting_company_name_fixed`.
4. Raw CVR candidates: `requesting_company_vat` = `42222593`, `analyzed_company_vat` = `27525989`.
5. Accounting-office CVR: `27525989` from `analyzed_company_vat`; confidence = `high`.
6. CVR reasoning: `analyzed_company_vat` `27525989` exists in the declaration accounting-office CVR list as `Skov Revision`.
7. Activity fields: month `2025-03`, analysis type `RevenueReconciliation`, analyzed company `Det Glade Vanvid, Viborg ApS.`
