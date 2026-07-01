# Unmatched resolution

This document reviews the 23 unmatched accounting-office signals from `DA_data` and proposes manual mappings where there is enough evidence. The goal is to recover activity rows into the CVR-based AO Intelligence data mart without forcing weak matches.

## Summary

- Unmatched accounting offices reviewed: 23
- Unmatched activity rows reviewed: 372
- Rows recoverable with HIGH-confidence mappings: 180
- Rows recoverable with HIGH or MEDIUM-confidence mappings: 187
- Rows with any proposed CVR, including LOW-confidence candidates: 288

Recommended operational estimate: recover the HIGH-confidence mappings first. That would recover 180 of 372 unmatched rows. If the one MEDIUM-confidence match is manually confirmed, recoverable rows increase to 187.

## Method

- Started from the same unmatched definition used in `docs/unmatched_pareto.md`: activity office signals where dominant `analyzed_company_vat` did not match a declaration accounting-office CVR.
- Compared each unmatched office signal to declaration-table accounting-office names after normalizing legal suffixes and punctuation.
- Used observed email domains and user emails as supporting evidence.
- Used dominant activity CVRs only as evidence; these are not automatically trusted because the existing matching analysis showed activity CVRs may represent client/company CVRs rather than accounting-office CVRs.
- Assigned confidence conservatively. LOW means the candidate should not be mapped without human confirmation.

## Resolution table

| accounting_office_name | email domains observed | users observed | activity rows | activity CVR candidates | candidate declaration matches | recommended canonical accounting office name | recommended accounting office CVR | confidence | rationale |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | buusjensen.dk | co@buusjensen.dk, mll@buusjensen.dk, plk@buusjensen.dk | 162 | 36029374 (147); 29690073 (9); 33948476 (6) | Buus Jensen / 16119040 (1.00); Revisionsfirmaet Benny Jensen / 17937987 (0.70); Revisionsfirmaet Benny Lund Jensen / 37230359 (0.64); Revisionsfirmaet Bent Jørgensen / 57652551 (0.64); Revisionsfirmaet Svendsen / 34581673 (0.63) | Buus Jensen | 16119040 | HIGH | Strong brand/name match; `buusjensen.dk` domain supports the match. |
| RevisorGruppen I/S | revigruppen.dk | birgit@revigruppen.dk, gitte@revigruppen.dk, gm@revigruppen.dk, jane@revigruppen.dk, jesper@revigruppen.dk, kenneth@revigruppen.dk, lars@revigruppen.dk, lilly@revigruppen.dk, soeren@revigruppen.dk | 96 | 34953619 (91); 31481945 (4); 32938213 (1) | Revisorgruppen v/Eva Kristensen og Lars Gotfredsen / 35071199 (0.92); RevisorGruppen v/Lilly Jeppesen / 18587246 (0.92); RevisorGården / 19720705 (0.81); ReviGroup / 39875926 (0.70); Revisorhuset / 26593093 (0.69) | RevisorGruppen v/Lilly Jeppesen | 18587246 | LOW | Only plausible declaration-name candidate found locally; name/domain are not strong enough for automatic mapping. |
| Plature | plature.com | pr@plature.com | 26 | 38732420 (26) | Capture / 28126131 (0.71) | Plature |  | LOW | No credible declaration-table match found; activity appears real but declaration CVR is unresolved. |
| Martinsen Statsautoriseret Revisionspartnerselskab | martinsen.dk | uco@martinsen.dk | 13 | 10130115 (9); 34044228 (4) | Martinsen / 32285201 (1.00); Larsen, Statsautoriseret Revisionsanpartsselskab / 45756173 (0.67); N. K. Mortensen A/S Registrerede Revisorer / 66090116 (0.64); Partner Revision / 15807776 (0.62) | Martinsen | 32285201 | HIGH | Exact brand/name match to declaration office Martinsen. |
| Taleco ApS | taleco.dk | mm@taleco.dk | 10 | 30525035 (9); 39446235 (1) | ECO Revision / 35891986 (0.67) | Taleco ApS |  | LOW | No credible declaration-table match found. |
| Copenhagen Management Accounting Company ApS | gmail.com | joachimelmegaard@gmail.com | 8 | 33932464 (8) | No credible declaration-name candidate found | Copenhagen Management Accounting Company ApS |  | LOW | No credible declaration-table match found. |
| Aage Mogensen | aa-m.dk | slf@aa-m.dk | 7 | 35143408 (7) | Aage Maagensen / 12901038 (0.89); Registreret Revisor Annie Mogensen / 11972101 (0.81); Registreret revisor Marianne Mortensen / 15664908 (0.71); Revisionsfirmaet Tage Sørensen / 34879753 (0.69); Beck Mortensen Revision ApS / 46505190 (0.67) | Aage Maagensen | 12901038 | MEDIUM | Strong similar-name candidate; spelling differs and should be manually confirmed. |
| E-conomia Consulting ApS | gmail.com | westenseeconsulting@gmail.com | 7 | 44268965 (7) | E-Revisor.com / 36412143 (0.71); EC Økonomi og regnskab / 35926585 (0.64) | E-conomia Consulting ApS |  | LOW | No credible declaration-table match found. |
| Roknskaparfelagið skrásettir grannskoðarar Sp/f | roknskap.fo | ragnhild@roknskap.fo, torur@roknskap.fo | 6 | 00413887 (6) | No credible declaration-name candidate found | Roknskaparfelagið skrásettir grannskoðarar Sp/f |  | LOW | No credible Danish declaration-table match found. |
| PJ Køleteknik ApS | pjkoeleteknik.dk | faktura@pjkoeleteknik.dk | 5 | 37654795 (5) | No credible declaration-name candidate found | PJ Revision ApS Registrerede Revisorer | 26429862 | LOW | Weak prefix match only; name suggests this may be a client/company rather than an accounting office. |
| REDMARK, GODKENDT REVISIONSPARTNERSELSKAB | redmark.dk | jhp@redmark.dk | 5 | 13865639 (5) | Redmark / 29442789 (1.00) | Redmark | 29442789 | HIGH | Exact brand/name match to declaration office Redmark. |
| Regnskabsvirksomheden Schaumburg/Bendtsen ApS | rvsb.dk | ks@rvsb.dk | 5 | 28655835 (5) | No credible declaration-name candidate found | Regnskabsvirksomheden Schaumburg/Bendtsen ApS |  | LOW | No credible declaration-table match found. |
| ERASMUS & PARTNERE A/S | erasmus.dk | lasse@erasmus.dk | 4 | 28493584 (4) | Partner Revision / 15807776 (0.92); Nemli & Partnere Statsautoriserede Revisorer ApS / 43514172 (0.78); Andersen og Partnere / 26668840 (0.77); Sønderup & Partnere / 27905072 (0.77); Dahl, Rask & Partnere / 10422183 (0.75) | ERASMUS & PARTNERE A/S |  | LOW | No credible declaration-table match found. |
| Regnskabsfokus | regnskabsfokus.dk | bo@regnskabsfokus.dk | 4 | 33578628 (4) | Regnskabsfabrikanten / 38980149 (0.65); Lejenregnskabschef.dk / 30563670 (0.63) | Regnskabsfokus |  | LOW | No credible declaration-table match found. |
| The White Box | thewhitebox.dk | rlh@thewhitebox.dk | 4 | 40612246 (4) | No credible declaration-name candidate found | The White Box |  | LOW | No credible declaration-table match found. |
| RegnskabsHuset.com | regnskabshuset.com | fs@regnskabshuset.com | 2 | 18067676 (1); 42495654 (1) | JE Regnskabsservice / 17366270 (0.65) | RegnskabsHuset.com |  | LOW | No credible declaration-table match found. |
| Stoisk | stoiskregnskab.dk | nvo@stoiskregnskab.dk | 2 | 28919719 (2) | No credible declaration-name candidate found | Stoisk |  | LOW | No credible declaration-table match found. |
| #VALUE! | konditorbager.dk | maria@konditorbager.dk | 1 | 27083978 (1) | No credible declaration-name candidate found | #VALUE! |  | LOW | Invalid office signal; requires source-data cleanup. |
| Erhvervshus Midtjylland S/I | ehhs.dk | pba@ehhs.dk | 1 | 40084606 (1) | Midt Revision / 39065797 (0.92) | Erhvervshus Midtjylland S/I |  | LOW | No credible declaration-table match found. |
| Gaaga | gaaga.dk | thomas@gaaga.dk | 1 | 42027995 (1) | No credible declaration-name candidate found | Gaaga |  | LOW | No credible declaration-table match found. |
| NM Regnskab ApS | nmregnskab.dk | nikola.mikulovic@nmregnskab.dk | 1 | 44729989 (1) | Nem Revisor ApS / 35235892 (0.80) | NM Regnskab ApS |  | LOW | No credible declaration-table match found; similar names are not sufficient. |
| Sand bogholderi | sandbogholderi.dk | csp@sandbogholderi.dk | 1 | 42269425 (1) | Revision Sjælland / 28309791 (0.67); Sømad ApS / 38388002 (0.67) | Sand bogholderi |  | LOW | No credible declaration-table match found. |
| Vestjysk Consulting | vestjysk-consulting.dk | st@vestjysk-consulting.dk | 1 | 30498674 (1) | Sydvestjysk Revision ApS Godkendt Revisionsselskab / 42044040 (0.92); Vestjysk Landboforening / 25076079 (0.92) | Vestjysk Consulting |  | LOW | No credible declaration-table match found. |

## Recovery estimate

| Recovery scenario | Rows recovered | Share of unmatched rows |
| --- | ---: | ---: |
| HIGH-confidence mappings only | 180 | 48.39% |
| HIGH + MEDIUM-confidence mappings | 187 | 50.27% |
| All proposed CVRs, including LOW-confidence candidates | 288 | 77.42% |

## Recommendation

Apply HIGH-confidence mappings first: BUUS JENSEN, Martinsen, and REDMARK. These are brand/name-supported and recover 180 rows. Review Aage Mogensen manually as the only MEDIUM-confidence case. Do not automatically map the remaining LOW-confidence rows; most have no credible declaration-table match or appear to be client/company names rather than accounting-office declaration entities.
