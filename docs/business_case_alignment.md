# Business case alignment

Kilde: `data/raw/Business case 2025.xlsx`, arket `Avanceret`.

Formålet med dashboardets ROI V2 er at bruge logikken i `Avanceret`-arket, men præsentere den i en enklere management-visning.

Den aktuelle dashboard-default viser kun dataanalyseværdi og kvalitet:

- Realiseret værdi i dag
- Fuldt potentiale
- Uudnyttet potentiale
- Kvalitetsfaktor som multiplikator i værdiberegningen

Rapportering og rådgivning er valgfri add-ons bag togglen `Medtag rapportering og rådgivning`. Når togglen er slået til, bruger dashboardet samme underliggende rapporterings- og rådgivningsformler som `Avanceret`-arket.

Den aktuelle management-ROI bruger denne forenklede kvalitetslogik:

```text
base value = population × hours saved × hourly rate
quality adjusted value = base value × quality multiplier
quality multiplier = quality factor when quality is enabled
quality multiplier = 1 when quality is disabled
```

The multiplier must never be `0`.

Det betyder:

```text
realiseret værdi i dag = aktive forbindelser × timer sparet × timepris × kvalitetsmultiplikator
fuldt potentiale = samlede erklæringer × timer sparet × timepris × kvalitetsmultiplikator
uudnyttet potentiale = fuldt potentiale - realiseret værdi i dag
```

## Inputs

| Dashboard input | Avanceret-celle | Default i workbook | Dashboard default | Bemærkning |
|---|---:|---:|---:|---|
| Samlede erklæringer | `I8` | 500 | Fra valgt scope | Globalt scope bruger `ao_master.csv`; AO-filter bruger valgt `accounting_office_cvr`. |
| Time saving per declaration | `J8` | 4 | 4 | Redigerbart. |
| Hourly rate | `K8` | 1.200 | 1.200 | Redigerbart. Bruges også som advisory hourly rate, svarende til workbookens default hvor `M8 = K8`. |
| Reporting customers | `L8` | 500 | 500 | Redigerbart. |
| Advisory hours per reporting customer | `N8` | 2 | 2 | Redigerbart. |
| Reporting hours saved | `O8` | 3 | 3 | Redigerbart. |
| Quality factor | `M13` | 2 | 2 | Redigerbart som numerisk faktor i dashboardet. |
| Crediwire unit price | `I28` | 1.988 | 1.988 | Fast værdi fra workbooken. |

## Workbook formulas

| Komponent | Avanceret-celle | Formel | Dashboard formula |
|---|---:|---|---|
| Declaration hours saved | `J18` | `I8 * J8` | `total_declarations * time_saving_per_declaration` |
| Declaration efficiency value | `K18` | `J18 * K8` | `declaration_hours_saved * hourly_rate` |
| Advisory revenue opportunity | `M18` | `N8 * M8 * L8` | `advisory_hours_per_reporting_customer * hourly_rate * reporting_customers` |
| Reporting hours saved | `N18` | `L8 * O8` | `reporting_customers * reporting_hours_saved` |
| Reporting efficiency value | `O18` | `O8 * L8 * K8` | `reporting_hours_saved * reporting_customers * hourly_rate` |
| Advisory value | `I23` | `M18` | `advisory_revenue_opportunity` |
| Efficiency hours | `J23` | `J18 + N18` | `declaration_hours_saved + reporting_hours_saved` |
| Efficiency value | `K23` | `J23 * K8` | `efficiency_hours * hourly_rate` |
| Combined business value | `L23` | `I23 + K23` | `advisory_value + efficiency_value` |
| Crediwire price | `J28` | `I28 * I8` | `1988 * total_declarations` |
| ROI before quality factor | `J29` | `L23 - J28` | `combined_business_value - crediwire_price` |
| Value after quality factor | `K29` | `J29 * M13` | `(combined_business_value - crediwire_price) * quality_factor` |

## Dashboard outputs

| Dashboard output | Source formula |
|---|---|
| Erklæringseffektivitet | `K18` equivalent. |
| Rapporteringseffektivitet | `O18` equivalent. |
| Efficiency value | `K23` equivalent. |
| Advisory value | `I23` equivalent. |
| Combined value | `L23` equivalent. |
| Value after quality factor | `K29` equivalent. |

## Verification against Avanceret defaults

Using the workbook default inputs:

```text
I8 = 500 declarations
J8 = 4 hours per declaration
K8 = 1.200 hourly rate
L8 = 500 reporting customers
M8 = 1.200 advisory hourly rate
N8 = 2 advisory hours per reporting customer
O8 = 3 reporting hours saved
M13 = 2 quality factor
I28 = 1.988 Crediwire unit price
```

The workbook produces:

| Cell | Value |
|---:|---:|
| `J18` declaration hours saved | 2.000 |
| `K18` declaration efficiency value | 2.400.000 |
| `M18` advisory revenue opportunity | 1.200.000 |
| `N18` reporting hours saved | 1.500 |
| `O18` reporting efficiency value | 1.800.000 |
| `I23` advisory value | 1.200.000 |
| `J23` efficiency hours | 3.500 |
| `K23` efficiency value | 4.200.000 |
| `L23` combined business value | 5.400.000 |
| `J28` Crediwire price | 994.000 |
| `J29` ROI before quality factor | 4.406.000 |
| `K29` value after quality factor | 8.812.000 |

The dashboard uses the same formulas. If the dashboard scope is set to `500` declarations and the default editable inputs above are used, the dashboard matches these workbook outputs exactly.

## Differences from the previous dashboard ROI

The old dashboard only implemented:

```text
declarations * time_saving_per_declaration * hourly_rate
```

That covered only the declaration time-saving component. ROI V2 now includes:

1. Declaration efficiency value
2. Reporting efficiency value
3. Advisory revenue opportunity
4. Combined business value
5. Quality multiplier after Crediwire price

## Limitations

- The dashboard has one hourly rate input. This maps to both `K8` and `M8` because the workbook defaults use the same value for both.
- The dashboard exposes `quality factor` directly as a number. The workbook derives `M13` from four yes/no quality effects.
- The workbook uses a fixed Crediwire unit price of `1.988`; the dashboard keeps this fixed to match `Avanceret`.
- Global dashboard scope uses real `ao_master.csv` declaration volume instead of workbook sample value `500`.
