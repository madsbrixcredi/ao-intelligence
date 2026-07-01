# Dashboard V3 KPI Logic

Kildeprincipper:

- `DA_data` er source of truth for analyseaktivitet.
- GL / `Med ERP-forbindelse` er source of truth for aktive virksomheder.
- Rå data ændres ikke.
- Dashboardet er et management dashboard, ikke et regnearksdashboard.

## KPI-definitioner

| KPI navn | Formel | Kilde | Business meaning | Begrænsning | Fakta eller antagelse |
|---|---|---|---|---|---|
| Aktive virksomheder | `SUM(active_erp_connections)` | `ao_connections_current.csv`, afledt fra GL | Antal virksomheder med aktiv ERP-forbindelse til Crediwire. | Current snapshot; der findes ikke historiske GL-snapshots endnu. | Fakta |
| Samlede erklæringer | `audits + extended_reviews + reviews + assistance` | `ao_master.csv` | Den samlede potentialepopulation. | Erklæringer er ikke det samme som unikke virksomheder. | Fakta |
| Dataanalyser i alt | `SUM(total_analyses)` | `ao_master.csv` / `DA_data` | Samlet brugsvolumen. | Downloads/analyser er aktivitet, ikke unikke kunder. | Fakta |
| Aktive brugere | `COUNT DISTINCT user_email` med aktivitet | `user_master.csv` | Hvor mange brugere der driver anvendelsen. | Total kendte brugere findes ikke, så bruger-rate beregnes ikke. | Fakta |
| Udvikling i brug | Status fra seneste afsluttede måned vs. forrige afsluttede måned | `monthly_activity.csv` | Viser om brugen går frem eller tilbage. | Delmåneder må ikke bruges. | Fakta |
| Realiseret værdi i dag | `dataanalyseværdi × kvalitetsmultiplikator` | GL + ROI-inputs | Værdi af den aktiverede population i dag med nuværende produkt. | Årsrapport, assistance og rapportering er fremtidig upside og indgår ikke i status i dag. | Fakta × antagelse |
| Værdi pr. aktiv virksomhed | `realiseret_værdi_i_dag / aktive_virksomheder` | Beregnet | Estimeret værdi skabt pr. aktiv virksomhed med de valgte antagelser. | Skjules hvis aktive virksomheder er `0`. Der vises ikke værdi pr. erklæring som KPI. | Beregnet |
| Potentiel værdi ved fuld anvendelse | `(erklæringsværdi + årsrapportværdi + assistanceværdi + rapporteringsværdi) × kvalitetsmultiplikator` | `ao_master.csv` + ROI-inputs | Teoretisk værdi ved fuld anvendelse på hele populationen. | Erklæringer bruges som potentialeproxy. | Fakta × antagelse |
| Realistisk potentiale | `(erklæringsværdi ved mål + årsrapportværdi ved mål + assistanceværdi ved mål + rapporteringsværdi) × kvalitetsmultiplikator` | `ao_master.csv` + ROI-inputs | Mere realistisk potentiale baseret på valgt implementeringsgrad. | Implementeringsgraden er en antagelse. | Fakta × antagelse |
| Uudnyttet potentiale | `realistisk_potentiale - realiseret_værdi` | Beregnet | Økonomisk gap mellem realiseret værdi og realistisk potentiale. | Kan blive 0, hvis realiseret værdi overstiger realistisk potentiale. | Beregnet |
| Kvalitetsfaktor | `enabled ? selected_factor : 1` | ROI-input | Afspejler ekstra værdi af bedre dokumentation, mere ensartede arbejdsgange, færre manuelle udtræk og lavere risiko for fejl. | Ikke observeret datapunkt. Må aldrig være 0. | Antagelse |
| Forventet implementeringsgrad | Valgt værdi: `2%, 5%, 10%, 15%, 20%, 25%, 50%, 60%, 70%, 80%, 90%, 100%` | ROI-input | Justerer potentialet til en realistisk implementeringsforventning. | Ikke observeret datapunkt. | Antagelse |
| Rapporteringseffektivitet | `rapporteringskunder × rapporteringstimer_sparet × timepris × kvalitetsmultiplikator` | Valgfri ROI-inputs | Valgfri ekstra værdi fra rapportering. | Scenarie, ikke observeret data. | Antagelse |
| Rådgivningsværdi | `rapporteringskunder × rådgivningstimer_pr_kunde × timepris` | Valgfri ROI-inputs | Valgfri ekstra rådgivningsværdi. | Scenarie, ikke observeret data. | Antagelse |
| Samlet værdi inkl. rapportering og rådgivning | `realistisk_potentiale + rådgivningsværdi` | Beregnet | Samlet scenario-værdi når add-ons medtages. Rapportering indgår allerede i realistisk potentiale, hvis antagelserne er udfyldt. | Vises kun når add-on er slået til. | Beregnet scenario |

## ROI-Logik

ROI i dag og ROI ved mål må ikke behandles som samme lineære metric.

```text
ROI i dag = realiseret dataanalyseværdi / nuværende softwareinvestering
```

Status i dag indeholder ikke årsrapport, assistance eller rapportering, fordi disse er fremtidige expand-/produktmuligheder.

```text
ROI ved mål = værdi ved mål / investering ved mål
```

Værdi ved mål kan indeholde dataanalyse, årsrapport, assistance og rapportering afhængigt af de valgte antagelser. Investering ved mål kan indeholde software, årsrapport og assistance.

## Trendlogik

- Brug kun afsluttede måneder.
- Den aktuelle delmåned udelades som standard.
- Delmåneder bruges ikke i trend summary, MoM, YTD eller status.
- Default trendvisning er `YTD`, fordi den giver bedre management-overblik og undgår overreaktion på én måned.

YTD sammenligner current year to date med samme periode sidste år:

```text
Hvis seneste afsluttede måned er maj 2026:
current_period = jan-maj 2026
comparison_period = jan-maj 2025
ændring_i_antal = current_period - comparison_period
ændring_i_pct = (current_period - comparison_period) / comparison_period
```

MoM sammenligner seneste afsluttede måned med forrige afsluttede måned:

```text
ændring_i_antal = seneste_afsluttede_måned - forrige_afsluttede_måned
ændring_i_pct = (seneste_afsluttede_måned - forrige_afsluttede_måned) / forrige_afsluttede_måned
```

Hvis sammenligningsperioden er `0`:

- Vis `Ny aktivitet` hvis current period > 0.
- Vis `Ingen aktivitet` hvis begge perioder er 0.
- Divider aldrig med 0.

Procentvis ændring vises med dansk formatering:

```text
+12,4 %
-22,5 %
```

Status:

- `Fremgang` hvis ændringen er større end `+5%`
- `Neutral` hvis ændringen ligger mellem `-5%` og `+5%`
- `Tilbagegang` hvis ændringen er mindre end `-5%`

YTD trend summary skal vise:

```text
Jan-Maj 2026
Jan-Maj 2025
Ændring i antal
Ændring i %
Status
```

For `Aktive brugere` bruges YTD ikke som en stor summeret bruger-KPI, fordi summen af månedlige aktive brugere tæller samme person flere gange på tværs af måneder.

`Aktive brugere` er ikke et afledt trend-KPI i YTD-visningen. Kortet sammenligner ikke med samme periode sidste år, beregner ikke procentvis vækst, og viser ikke status-badge. De månedlige værdier og chartet skal bære historien.

`Aktive brugere` i trendsektionen vises derfor som:

```text
Seneste måned
Højeste måned
Gennemsnit pr. måned i perioden
Månedlig fordeling
```

Top-KPI'en `Brugere med analyse-downloads` er fortsat:

```text
COUNT DISTINCT user_email
WHERE total_analyses > 0
```

MoM trend summary skal vise:

```text
Maj 2026
April 2026
Ændring i antal
Ændring i %
Status
```

Charts skal understøtte konklusionen, ikke være konklusionen alene. Derfor vises summary over chartet.

Chart markers:

- Vis månedlabels mindst hvert kvartal.
- Vis månedlige labels, hvis serien er kort nok til at være læsbar.
- Hover skal altid vise fuld måned, år og metric-værdi, fx `April 2026` og `Dataanalyser: 347`.

## Prospect Mode

Prospect mode aktiveres når:

```text
active_companies = 0
```

I prospect mode har det valgte AO ingen aktive virksomheder i GL. Derfor er realiseret værdi `0`, men potentialet eksisterer stadig, hvis der findes samlede erklæringer.

Regler:

```text
realiseret_værdi_i_dag = 0
realistisk_potentiale = (erklæringsværdi ved mål + årsrapportværdi ved mål + assistanceværdi ved mål + rapporteringsværdi) × quality_multiplier
uudnyttet_potentiale = realistisk_potentiale
```

Dashboardet skal vise teksten:

```text
Der er ingen aktive virksomheder i Crediwire endnu. Derfor vises der ingen
realiseret værdi. Beregningen viser i stedet det estimerede potentiale,
hvis løsningen implementeres.
```

Prospect mode må ikke automatisk skjule brugsmålinger:

- Hvis `dataanalyser > 0`, vis dataanalyser.
- Hvis `active_users > 0`, vis aktive brugere og topbrugere.
- Hvis både `dataanalyser = 0` og `active_users = 0`, vis beskeden: `Der er endnu ingen registreret analyseaktivitet.`

Prospect mode må ikke vise adoption, penetration eller `active_connections / total_declarations`.

## Opportunity-logik

Opportunity-tabellen skal svare på:

```text
Hvor er de største økonomiske muligheder?
```

Kolonner:

- Revisionshus
- Prioritet
- Næste fokus
- Værdi ved valgt implementering
- Investering ved valgt implementering
- Nettoværdi ved valgt implementering
- Manglende aktive virksomheder
- Samlede erklæringer
- Realistisk potentiale
- Uudnyttet potentiale
- Virksomheder analyseret, skjult som sekundær indsigt

Sortering:

```text
Uudnyttet potentiale DESC
```

Vigtigt:

- Brug ikke `declarations - analyses` som opportunity.
- Brug ikke `dataanalyser` eller `virksomheder analyseret` til ROI.
- Vis ikke aktive virksomheder, dataanalyser, aktive brugere eller realiseret værdi som primære opportunity-kolonner; de flytter fokus væk fra beslutningen.
- `Virksomheder analyseret` er sekundær brugsindsigt og kan vises med toggle.

## Business Case Forklaring

Dashboardet skal forklare:

1. Fakta: aktive virksomheder, samlede erklæringer, dataanalyser og aktive brugere.
2. Antagelser: timer sparet, timepris, kvalitetsfaktor og implementeringsgrad.
3. Realiseret værdi: beregnet på aktive virksomheder.
4. Potentiale: beregnet på samlede erklæringer og forventet implementeringsgrad.
5. Gap: forskellen mellem realistisk potentiale og realiseret værdi.

Forklaringen skal skrives i naturligt dansk og undgå regnearks-/cellelogik.

Business-case forklaringen skal også vise kvalitetsfaktorens konkrete værdi:

```text
Uden kvalitetsfaktor: base_value
Med kvalitetsfaktor: quality_adjusted_value
Kvalitetsfaktoren bidrager dermed med: quality_adjusted_value - base_value
```

For potentialet skal forklaringen vise den operationelle aktiveringsopgave:

```text
Samlede erklæringer
Valgt implementeringsgrad
Målsætning i aktive virksomheder
Aktive virksomheder i dag
Manglende aktivering
```

Målsætningen beregnes som:

```text
round(total_declarations × implementation_rate)
```

Manglende aktivering beregnes som:

```text
max(målsætning_aktive_virksomheder - aktive_virksomheder_i_dag, 0)
```
