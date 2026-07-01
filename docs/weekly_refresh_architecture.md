# Weekly master sheet refresh architecture

## Goal

The weekly refresh should support this operational flow:

```text
Upload new master sheet
→ Refresh processed data
→ Validate key checks
→ Dashboard updated
```

The dashboard itself reads only from `data/processed`. Raw Excel files remain local inputs and must not be committed.

## Folder structure

```text
data/
  raw/
    Downloads master sheet (49)-kopi.xlsx
    assistancer alle-kopi.xlsx
    Revision alle-kopi.xlsx
    Review alle-kopi.xlsx
    Udvidetgennemgang alle-kopi.xlsx
  processed/
    ao_master.csv
    ao_connections_current.csv
    monthly_activity.csv
    monthly_user_activity.csv
    user_master.csv
    ao_opportunity.csv
    accounting_office_taxonomy.csv
    audits.csv
    reviews.csv
    extended_reviews.csv
    assistance.csv
```

## Refresh process

1. Replace the weekly Excel files in `data/raw`.
2. Confirm the file names match the expected names.
3. Run the processed-data build scripts.
4. Rebuild helper files, including active connections and monthly user activity.
5. Open the dashboard locally and verify the primary KPI row.
6. Commit only code, docs, and approved processed CSV outputs. Do not commit raw Excel files.

Current helper command:

```bash
python3 scripts/build_dashboard_helpers.py
```

If new upstream workbook structures are introduced, update the build scripts before relying on refreshed values.

## Validation flow

Run these checks after every refresh:

1. `ao_connections_current.csv` contains the GL active connection count.
2. `ao_master.csv` has one canonical row per accounting office.
3. Known manual mappings are still correct:
   - Buus Jensen must resolve to `BUUS JENSEN I/S STATSAUTORISEREDE REVISORER`, CVR `36029374`.
4. `DA_data` activity totals use the full available activity count, not a period-limited KPI cell.
5. Latest incomplete month is excluded from trend charts.
6. Business case assumptions still default as expected:
   - 4 hours saved
   - 1.200 kr. hourly rate
   - quality factor 2
   - 1.988 kr. annual price per active company

## Dashboard refresh behavior

The frontend fetches CSV files from `data/processed` at load time. After processed files are updated, refresh the browser to load the new CSV data.

If static assets change, increment the query-string version in `dashboard/index.html` for:

```text
styles.css?v=...
app.js?v=...
```

This avoids browser cache issues during release testing.

## Future migration path to live data

The current architecture is file-based:

```text
Excel exports → processed CSVs → static dashboard
```

A future live-data architecture should replace only the data ingestion layer:

```text
source systems / database
→ canonical AO mapping layer
→ dashboard API or scheduled CSV export
→ dashboard
```

The following concepts should remain stable during migration:

- `DA_data` is the source of truth for download activity.
- GL active ERP connections define active companies.
- Declaration files define the potential population.
- AO taxonomy resolves aliases and canonical CVRs.
- Raw Excel files should not be a long-term production dependency.

## Release recommendation

Before release, run one full refresh using the latest master sheet and save a short refresh log with:

- refresh date
- input file names
- total activity rows
- total active connections
- total declarations
- known mapping checks
- person who validated the output
