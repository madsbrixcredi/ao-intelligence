# Buus Jensen mapping fix

## Root cause

Buus Jensen was split across two accounting-office records in the processed dashboard data:

| Source | Name | CVR | Value |
|---|---:|---:|---:|
| Activity / users / GL | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 36029374 | 162 analyses, 3 active users, 21 active ERP connections |
| Declaration data | Buus Jensen | 16119040 | 1,497 declarations |

The dashboard calculates active companies by looking up `active_erp_connections` from `data/processed/ao_connections_current.csv` using `accounting_office_cvr`.

Before the fix:

- selecting `BUUS JENSEN I/S STATSAUTORISEREDE REVISORER / 36029374` showed `21` active companies but `0` declarations.
- selecting `Buus Jensen / 16119040` showed `1,497` declarations but `0` active companies.

The mismatch was therefore not caused by the GL calculation. GL already contained the correct active-connection count. The issue was that declaration volume and activity/GL were assigned to different canonical AO records.

## GL calculation trace

`scripts/build_dashboard_helpers.py` reads active connections from:

- workbook: `data/raw/Downloads master sheet (49)-kopi.xlsx`
- sheet: `Data analysis master sheet`
- rows: `5:58`
- columns:
  - `GJ`: accounting office CVR
  - `GK`: accounting office name
  - `GL`: `Med ERP-forbindelse`

For Buus Jensen, the relevant row is row 11:

| Cell | Value |
|---|---:|
| GJ11 | 36029374 |
| GK11 | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER |
| GL11 | 21 |
| GM11 | 0 |
| GN11 | 21 |

The dashboard uses `GL11` as `active_erp_connections`.

## Variants found

### Downloads master sheet

The master sheet uses:

| Sheet | Observed name | Observed CVR / ID | Notes |
|---|---:|---:|---|
| Data analysis master sheet | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 36029374 | GL row and canonical activity office |
| DA_data | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | multiple customer VAT values | `requesting_company_vat` varies by row and is not reliable as AO canonical CVR |
| connection_data | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 36029374 | 21 connection rows |
| Priority clients active compani | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | client IDs / client rows | 21 active client rows |

### Processed data before correction

| File | Name | CVR |
|---|---:|---:|
| `ao_connections_current.csv` | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 36029374 |
| `user_master.csv` | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 36029374 |
| `monthly_activity.csv` | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 36029374 |
| `audits.csv` | Buus Jensen | 16119040 |
| `reviews.csv` | Buus Jensen | 16119040 |
| `extended_reviews.csv` | Buus Jensen | 16119040 |
| `assistance.csv` | Buus Jensen | 16119040 |
| `accounting_office_taxonomy.csv` | Buus Jensen | 16119040 |
| `ao_master.csv` | both records | 36029374 and 16119040 |

## Corrected canonical mapping

The corrected canonical accounting office is:

| Field | Value |
|---|---:|
| Canonical accounting office name | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER |
| Canonical accounting office CVR | 36029374 |
| Alias | Buus Jensen |
| Active ERP connections | 21 |
| Declaration volume | 1,497 |
| Download activity | 162 analyses |
| Active users | 3 |

## Files changed

The manual AO override was added to:

- `scripts/build_dashboard_helpers.py`

The following processed files were rebuilt/updated:

- `data/processed/accounting_office_taxonomy.csv`
- `data/processed/audits.csv`
- `data/processed/reviews.csv`
- `data/processed/extended_reviews.csv`
- `data/processed/assistance.csv`
- `data/processed/ao_master.csv`
- `data/processed/ao_opportunity.csv`
- `data/processed/implementation_risk.csv`
- `data/processed/ao_connections_current.csv`
- `data/processed/monthly_user_activity.csv`

Raw Excel files were not changed.

## Before and after

### Before

| Record | Active companies | Declarations | Analyses |
|---|---:|---:|---:|
| BUUS JENSEN I/S STATSAUTORISEREDE REVISORER / 36029374 | 21 | 0 | 162 |
| Buus Jensen / 16119040 | 0 | 1,497 | 0 |

### After

| Record | Active companies | Declarations | Analyses |
|---|---:|---:|---:|
| BUUS JENSEN I/S STATSAUTORISEREDE REVISORER / 36029374 | 21 | 1,497 | 162 |

## Verification

After the rebuild, `ao_master.csv` contains one Buus Jensen record:

```text
BUUS JENSEN I/S STATSAUTORISEREDE REVISORER
CVR: 36029374
Declarations: 1,497
Analyses: 162
Active users: 3
Distinct clients analysed: 19
```

`ao_connections_current.csv` contains:

```text
BUUS JENSEN I/S STATSAUTORISEREDE REVISORER
CVR: 36029374
active_erp_connections: 21
```

The dashboard now resolves Buus Jensen active companies through the same CVR as its declaration and activity records, so Buus Jensen shows `21` active companies.
