# GT purchased capacity review

## Workbook source

File:

```text
data/raw/Downloads master sheet (49)-kopi.xlsx
```

Sheet:

```text
Data analysis master sheet
```

## Column meaning

Column `GT` represents purchased company capacity.

The relevant headers are:

```text
GL row 2: Antal virksomheder
GL row 3: Med ERP-forbindelse
GM row 3: Uden ERP-forbindelse
GN row 3: I alt
GT row 2: Realization rate
GT row 3: Købte virksomheder
GU row 3: Realization rate
```

`GU` confirms the logic:

```text
GU = GL / GT
```

Example for Grant Thornton:

```text
GL = 683
GT = 740
GU = 0,9229729729
```

This supports the interpretation:

```text
active companies / purchased companies = activation rate
```

## Reliability across AOs

`GT` is usable where the purchased capacity value is populated.

Observed workbook checks:

- Rows with `GL` populated: 54
- Rows with `GT` populated: 54
- Sum of `GL`: 1.310 active companies
- Sum of `GT`: 1.270 purchased companies
- Rows where active companies exceed purchased companies: 4

The column is therefore a real capacity field, but it is not perfectly clean as a management KPI without handling edge cases.

Known edge cases:

- Some AOs have `GT = 0` even when active companies exist.
- Some AOs have `GL > GT`, producing realization rates above 100%.
- Buus Jensen has `GL = 21`, `GT = 5`, `GU = 4,2`.

## Recommendation

Use `GT` as purchased company capacity when presenting activation progress, but display it as an implementation KPI with guardrails.

Recommended KPI format:

```text
Aktive virksomheder
683 / 740
92,3 % aktiveret
57 virksomheder mangler aktivering
```

Rules:

- Use `GL` as active companies.
- Use `GT` as purchased companies where `GT > 0`.
- Calculate activation rate as `GL / GT`.
- Calculate remaining activation as `max(GT - GL, 0)`.
- If `GL > GT`, show the rate but avoid negative remaining companies.
- If `GT` is missing or 0, fall back to showing only active companies and do not show an activation rate.

This makes the KPI more useful for management than a standalone active-company count, because it answers whether purchased capacity has been implemented.
