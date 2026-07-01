# AO isolation audit

## Purpose

Validate that switching accounting office does not leave cached values from the previous selection and that dashboard components use the selected CVR consistently.

## Method

Two checks were performed:

1. Code-path review of every AO-dependent component in `dashboard/app.js`.
2. Runtime render harness in `.context/ao_isolation_audit.js` using the real dashboard code, a fake DOM, and the real processed CSV files.

The harness calls the same `selectOffice()` and `renderDashboard()` functions used by the browser, switches through every available AO selection state, and compares rendered values against independently filtered source data.

Result after fixes:

```text
checkedScopes: 932
failureCount: 0
gtLeaks: []
```

## Findings

### 1. Empty monthly activity could stop AO refresh

Status: Fixed

Severity: Critical

Root cause:

`trendSummaryYtd()` assumed the selected AO always had at least one completed monthly activity row. For AOs with no monthly activity, such as `Martinsen` CVR `32285201`, the trend summary attempted to format an invalid month.

Affected components:

- Trend summaries
- Trend charts
- Top users
- Opportunities
- Business Case / ROI
- Calculation basis
- Data status

Why broad impact:

`renderDashboard()` renders the trend section before several later components. A trend error could stop the render cycle, leaving later components with values from the previously selected AO.

Fix:

Added empty-series guards to both YTD and MoM trend summaries. Empty AO activity now renders neutral zero-state trend cards instead of throwing.

### 2. Purchased capacity could show negative remaining activation

Status: Fixed

Severity: Medium

Root cause:

The active-company KPI calculated remaining activation as:

```text
purchased companies - active companies
```

For AOs where `GL > GT`, for example Buus Jensen with `21 / 5`, this showed a negative number of remaining companies.

Affected components:

- Active companies KPI

Fix:

Remaining activation now uses:

```text
max(purchased companies - active companies, 0)
```

Activation rate itself is unchanged.

### 3. No Grant Thornton leakage found after switching

Status: Passed

Severity: None

The harness explicitly switched from Grant Thornton CVR `34209936` to Martinsen CVR `32285201` and checked for Grant Thornton values such as:

```text
683 / 740
4.182 analyses
6.556.800 kr. realized value
109.113.600 kr. full potential
```

No Grant Thornton values remained in the Martinsen render output.

## Component audit

| Component | Filter status | Notes |
|---|---:|---|
| Active users | Passed | Uses `selectedRows(state.data.users)` and selected CVR. |
| Active companies | Passed with data caveat | Uses selected AO rows and exact-CVR connection lookup. |
| Data analyses | Passed | Uses selected AO rows from `ao_master.csv`. |
| Business Case | Passed | Uses `scopeMetrics()` from selected AO rows. |
| ROI metrics | Passed | Uses selected active companies, declarations, and selected assumptions. |
| Trend summaries | Fixed / Passed | Empty-series AO selections now render zero-state cards. |
| Trend charts | Passed | Uses `completedMonthlyRows()` with selected CVR. |
| Top users | Passed with data caveat | Uses selected `user_master.csv`; monthly comparison values also filter by selected CVR. |
| Opportunities | Passed | For a selected AO, table renders only that AO. |
| Population metrics | Passed | Declarations and related population fields come from selected AO rows. |

## Data caveats found

These are not AO switching cache bugs, but they can still create confusing AO-level results.

### Martinsen is split across two CVRs

```text
32285201 Martinsen
- 8.150 declarations
- 0 analyses
- 0 active users

10130115 Martinsen Statsautoriseret Revisionspartnerselskab
- 0 declarations
- 13 analyses
- 1 active user
```

If management expects one combined Martinsen view, this requires taxonomy/canonical mapping. The current dashboard correctly isolates each CVR.

### Dansk Revision Slagelse / Århus user activity mismatch

`alni@danskrevision.dk` appears under two CVRs in `user_master.csv`:

```text
29919801 Dansk Revision Slagelse: 18 analyses
26717671 Dansk Revision Århus: 1 analysis
```

But `monthly_user_activity.csv` assigns the monthly rows for this email to `26717671`, while `monthly_activity.csv` includes activity for `29919801`.

Impact:

- The KPI and top-user total for Slagelse can show the user.
- Monthly active-user trend for Slagelse may not align because the monthly user rows point to Århus.

### Connection CVR mismatch for EY

`ao_connections_current.csv` contains:

```text
36561505 EY Godkendt Revisionspartnerselskab: 2 active companies
```

`ao_master.csv` contains:

```text
30700228 EY
```

Impact:

The EY active companies are not assigned to the EY declaration record by exact CVR matching.

### Duplicate connection CVR

`ao_connections_current.csv` contains duplicate CVR `53371914` with two names:

```text
Ri- Statsautoriseret Revisionsaktieselskab
Pro account
```

The dashboard uses a CVR map, so the duplicated CVR is not double-counted in selected AO views.

## Conclusion

AO switching is render-isolated after the trend zero-state fix.

There is no evidence that Grant Thornton values persist when switching to Martinsen or other AOs.

Remaining concerns are processed-data mapping issues, not dashboard cache or filter leakage:

- Martinsen split across two CVRs.
- Dansk Revision Slagelse / Århus monthly user mismatch.
- EY connection CVR mismatch.
- Duplicate connection CVR `53371914`.
