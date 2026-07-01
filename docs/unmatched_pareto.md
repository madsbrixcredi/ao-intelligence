# Unmatched activity Pareto

This report analyzes DA_data activity rows whose derived accounting-office CVR did not match a declaration accounting-office CVR using the AO Intelligence V1 matching logic.

## Summary

- Total DA_data activity rows: 6,927
- Unmatched activity rows: 372
- Share of total activity affected if unmatched rows are excluded: 5.37%
- Distinct unmatched accounting offices: 23
- Distinct unmatched users: 34
- Distinct unmatched email domains: 22

## Pareto analysis

- Top 10 unmatched accounting offices: 340 rows (91.40% of unmatched activity)
- Top 20 unmatched accounting offices: 369 rows (99.19% of unmatched activity)
- All remaining unmatched accounting offices: 3 rows (0.81% of unmatched activity)

## Top 50 unmatched accounting offices by activity

| accounting_office_name | activity_rows | users | email_domains |
| --- | ---: | ---: | ---: |
| BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 162 | 3 | 1 |
| RevisorGruppen I/S | 96 | 9 | 1 |
| Plature | 26 | 1 | 1 |
| Martinsen Statsautoriseret Revisionspartnerselskab | 13 | 1 | 1 |
| Taleco ApS | 10 | 1 | 1 |
| Copenhagen Management Accounting Company ApS | 8 | 1 | 1 |
| Aage Mogensen | 7 | 1 | 1 |
| E-conomia Consulting ApS | 7 | 1 | 1 |
| Roknskaparfelagið skrásettir grannskoðarar Sp/f | 6 | 2 | 1 |
| PJ Køleteknik ApS | 5 | 1 | 1 |
| REDMARK, GODKENDT REVISIONSPARTNERSELSKAB | 5 | 1 | 1 |
| Regnskabsvirksomheden Schaumburg/Bendtsen ApS | 5 | 1 | 1 |
| ERASMUS & PARTNERE A/S | 4 | 1 | 1 |
| Regnskabsfokus | 4 | 1 | 1 |
| The White Box | 4 | 1 | 1 |
| RegnskabsHuset.com | 2 | 1 | 1 |
| Stoisk | 2 | 1 | 1 |
| #VALUE! | 1 | 1 | 1 |
| Erhvervshus Midtjylland S/I | 1 | 1 | 1 |
| Gaaga | 1 | 1 | 1 |
| NM Regnskab ApS | 1 | 1 | 1 |
| Sand bogholderi | 1 | 1 | 1 |
| Vestjysk Consulting | 1 | 1 | 1 |

## Interpretation

The unmatched rows are concentrated among a few large accounting offices.

If unmatched rows were excluded from management reporting, approximately 5.37% of total DA_data activity would be excluded (372 of 6,927 rows).

The largest unmatched offices should be reviewed first because they explain most of the unmatched activity. In particular, the top 10 alone represent more than half of unmatched activity.

## Notes

- An unmatched row here means the activity office signal could not be mapped to a declaration CVR through the validated dominant `analyzed_company_vat` approach.
- These rows are still valid activity rows. The issue is declaration-CVR linkage, not activity validity.
- Excluding them would simplify CVR-joined reporting but would understate total activity.
