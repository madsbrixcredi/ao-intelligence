# Crediwire Intelligence Dashboard V1

Sprog: dansk.

Formål: Dashboardet skal give Crediwire-ledelsen et samlet overblik over vækst, adoption, brug, potentiale, risiko og ekspansionsmuligheder på tværs af alle revisions- og regnskabshuse.

V1 er et globalt Crediwire-dashboard. Det må ikke være bygget specifikt til Grant Thornton, Beierholm, Redmark, Martinsen, RSM eller andre enkelte revisionshuse, men arkitekturen skal gøre det muligt senere at filtrere hele dashboardet på `accounting_office_cvr`.

## Grundprincipper

- Brug `docs/analysis_conventions.md` som source of truth for download- og analysetællinger.
- Brug fuld tilgængelig aktivitet fra `DA_data`, ikke de periodebegrænsede KPI’er i masterarket.
- Brug `GL`-metricen, `Med ERP-forbindelse`, som officiel source of truth for aktive ERP-forbindelser.
- Byg først globalt dashboard. AO-specifikke dashboards kommer senere som filterede versioner.
- Vis datadækning tydeligt: activity-data dækker aktuelt `2024-03-13` til `2026-06-04`.

## Datagrundlag

Dashboardet skal bygges oven på de validerede modeltabeller:

| Tabel | Rolle |
|---|---|
| `data/processed/ao_master.csv` | Mastertabel pr. accounting office med erklæringer, analyser, brugere, klienter og adoption. |
| `data/processed/user_master.csv` | Brugertabel med total aktivitet pr. bruger. |
| `data/processed/monthly_activity.csv` | Månedlig aktivitetsfakt pr. accounting office. |
| `data/processed/ao_opportunity.csv` | Potentiale og uudnyttet volume pr. accounting office. |
| `data/processed/implementation_risk.csv` | Risikoklassifikation baseret på brugerbredde og koncentration. |

Derudover skal V1 bruge aktive forbindelser fra masterarket:

| Kilde | Felt | Brug |
|---|---|---|
| `Downloads master sheet (49)-kopi.xlsx`, `Data analysis master sheet` | `GJ` / `Cvr` | Matching-nøgle til accounting office CVR. |
| `Downloads master sheet (49)-kopi.xlsx`, `Data analysis master sheet` | `GK` / `Virksomhed (der har downloadet mindst én dataanalyse)` | Visningsnavn i den eksisterende summary. |
| `Downloads master sheet (49)-kopi.xlsx`, `Data analysis master sheet` | `GL` / `Med ERP-forbindelse` | Officiel count af aktive ERP-forbindelser. |

`GL` beregnes i masterarket som antal rækker i `connection_data`, hvor `from_company_vat` matcher accounting office CVR, og hvor `to_company_status` er en af `1`, `2`, `3` eller `8`.

V1 bør materialisere dette som en lille modeltabel:

```text
ao_connections_current
- accounting_office_cvr
- accounting_office_name
- active_erp_connections
- source = "Data analysis master sheet GL"
- snapshot_date
```

Aktuel kendt total fra masterarket: `1.310` aktive ERP-forbindelser.

## KPI-definitioner

| KPI | Dansk label | Definition | Kilde | Aktuel værdi |
|---|---|---|---|---:|
| Aktive forbindelser | Aktive forbindelser | Sum af `active_erp_connections` fra GL-metricen. | `ao_connections_current` fra masterarkets `GL` | 1.310 |
| Dataanalyser i alt | Dataanalyser i alt | Sum af `total_analyses`; svarer til alle rækker i `DA_data` efter valideret matching. | `ao_master.csv` / `DA_data` | 6.927 |
| Aktive brugere | Aktive brugere | Antal unikke `user_email` med mindst én analyse. | `user_master.csv` | 253 |
| Revisionshuse med aktivitet | Revisionshuse med aktivitet | Antal `accounting_office_cvr` med `total_analyses > 0`. | `ao_master.csv` | 53 |
| Samlede erklæringer | Samlede erklæringer | Sum af `audits + reviews + extended_reviews + assistance`. | `ao_master.csv` | 244.265 |
| Adoption rate | Adoption rate | `total_analyses / total_declarations`. | `ao_master.csv` | 2,84% |

### Trend-definitioner

| Metric | Månedlig trend | Seneste måned | Seneste kvartal | Seneste 12 måneder |
|---|---|---|---|---|
| Dataanalyser | Sum `analyses` pr. måned. | Seneste komplette eller delvise måned i data. | Sum seneste 3 måneder. | Sum seneste 12 måneder. |
| Aktive brugere | Antal aktive brugere pr. måned. | Seneste måned. | Gennemsnit eller sum af månedlige aktive brugere; label skal være tydelig. | Gennemsnitlig månedlig aktiv brugerbase. |
| Revisionshuse med aktivitet | Antal offices med `analyses > 0` pr. måned. | Seneste måned. | Antal unikke aktive offices i kvartalet. | Antal unikke aktive offices i perioden. |
| Aktive forbindelser | Kræver månedlige snapshots af GL/connection-data. | Current snapshot kan vises. | Ikke historisk tilgængelig i V1 uden snapshots. | Ikke historisk tilgængelig i V1 uden snapshots. |
| Samlede erklæringer | Kræver månedlige declaration snapshots. | Current snapshot kan vises. | Ikke historisk tilgængelig i V1 uden snapshots. | Ikke historisk tilgængelig i V1 uden snapshots. |

Vigtigt: Hvis der ikke findes historiske snapshots for aktive forbindelser eller erklæringer, må dashboardet ikke opfinde en trend. Vis i stedet current value og en tydelig note: “Historik kræver månedlige snapshots”.

## Dashboardstruktur

Navigation og informationshierarki:

1. Crediwire Overblik
2. Vækst
3. Adoption
4. Champions
5. Muligheder
6. Risiko
7. ROI
8. AO Template-arkitektur

Globalt filterområde:

- Periode
- Accounting office
- Analysis type, hvis data gøres tilgængeligt i en fremtidig fact-tabel
- Kun aktive revisionshuse / alle revisionshuse
- Risiko-niveau

Default-visning:

- Globalt scope
- Alle måneder i tilgængelig data
- Alle accounting offices

## Section 1: Crediwire Overblik

Formål: Ledelsen skal på få sekunder kunne se nuværende størrelse, aktivitet og potentiale.

KPI cards:

| KPI card | Hovedtal | Sekundær tekst | Trend |
|---|---|---|---|
| Aktive forbindelser | 1.310 | ERP-forbindelser med status 1, 2, 3 eller 8 | Snapshot; trend først når connection snapshots findes. |
| Dataanalyser i alt | 6.927 | Alle analyser i `DA_data` | Månedlig linje fra `monthly_activity.csv`. |
| Aktive brugere | 253 | Brugere med mindst én analyse | Månedlig aktiv brugertrend. |
| Revisionshuse med aktivitet | 53 | Revisionshuse med mindst én analyse | Månedlig office-aktivitet. |
| Samlede erklæringer | 244.265 | Samlet deklarationspotentiale | Snapshot; trend først når declaration snapshots findes. |

Visualiseringer:

- KPI-kort i én række på desktop.
- Månedlig linjegraf for dataanalyser.
- Månedlig linjegraf for aktive brugere.
- Månedlig linjegraf for aktive revisionshuse.
- Snapshot-indikator for aktive forbindelser og samlede erklæringer, hvis historik ikke findes.

Wireframe:

```text
+-----------------------------------------------------------------------+
| CREDIWIRE OVERBLIK                         Periode | AO filter | ... |
+-----------------------------------------------------------------------+
| Aktive forbindelser | Dataanalyser | Aktive brugere | Aktive AO | ... |
+-----------------------------------------------------------------------+
| Dataanalyser pr. måned                | Aktive brugere pr. måned      |
+-----------------------------------------------------------------------+
| Revisionshuse med aktivitet pr. måned | Datadækning og noter          |
+-----------------------------------------------------------------------+
```

## Section 2: Vækst

Formål: Besvare “Vokser vi?” og “Hvor hurtigt vokser vi?”

Metrics:

- Dataanalyser pr. måned.
- Aktive brugere pr. måned.
- Revisionshuse med aktivitet pr. måned.
- Aktive forbindelser som current snapshot; historisk vækst kræver connection snapshots.

Periodevisninger:

| Periode | Beregning |
|---|---|
| Seneste måned | Månedens værdi sammenlignet med forrige måned. |
| Seneste kvartal | Sum eller gennemsnit for seneste 3 måneder sammenlignet med de 3 måneder før. |
| Seneste 12 måneder | Sum eller gennemsnit for seneste 12 måneder sammenlignet med de 12 måneder før, hvis nok historik findes. |

Vækstberegning:

```text
growth_abs = current_period_value - previous_period_value
growth_pct = growth_abs / previous_period_value
```

Hvis previous period er `0`, vis “ny aktivitet” i stedet for procent.

Visualiseringer:

- Tre linjegrafer: analyser, aktive brugere, aktive revisionshuse.
- Små summary cards for seneste måned, kvartal og 12 måneder.
- Brug grøn/rød kun til retning, ikke som hele designets farvepalette.

## Section 3: Adoption

Formål: Besvare “Hvor stor del af potentialet udnytter vi?”

KPI’er:

| KPI | Definition |
|---|---|
| Samlede erklæringer | Sum `total_declarations`. |
| Samlede analyser | Sum `total_analyses`. |
| Adoption rate | `total_analyses / total_declarations`. |

Global aktuel adoption:

```text
6.927 / 244.265 = 2,84%
```

Visualiseringer:

- KPI-kort for samlet potentiale, analyser og adoption rate.
- Bar chart: top revisionshuse efter total declarations.
- Scatterplot: `total_declarations` mod `total_analyses`, boblestørrelse = aktive forbindelser.
- Trendlinje for analyser over tid. Erklæringer er snapshot, medmindre der senere skabes historiske declaration snapshots.

Fortolkning:

- Høj declarations-volume + lav analyseaktivitet = stort uudnyttet potentiale.
- Høj aktive forbindelser + lav analyseaktivitet = lav adoption på eksisterende teknisk footprint.
- Høj analyseaktivitet + få aktive brugere = implementeringsrisiko, fordi adoptionen er personafhængig.

## Section 4: Champions

Formål: Vise hvem der driver brugen, både på bruger- og revisionshusniveau.

### Top 10 brugere

Kolonner:

| Kolonne | Definition |
|---|---|
| Navn | `user_name`. |
| Email | `user_email`. |
| Revisionshus | `accounting_office_name`. |
| Dataanalyser | `total_analyses`. |
| Udvikling måned over måned | Seneste måneds analyser minus forrige måneds analyser for samme bruger. |

Nuværende modelgap: `user_master.csv` indeholder totaler, men ikke månedlig brugeraktivitet. For at beregne MoM pr. bruger skal V1 enten læse `DA_data` direkte eller materialisere:

```text
monthly_user_activity
- year
- month
- user_email
- user_name
- accounting_office_cvr
- accounting_office_name
- analyses
```

### Top 10 revisionshuse

Kolonner:

| Kolonne | Definition |
|---|---|
| Revisionshus | `accounting_office_name`. |
| Aktive brugere | `active_users`. |
| Dataanalyser | `total_analyses`. |
| Aktive forbindelser | GL-derived `active_erp_connections`. |

Sortering default: `total_analyses DESC`.

Alternativ sortering:

- Aktive forbindelser
- Adoption rate
- Uudnyttet potentiale
- Seneste måneds vækst

## Section 5: Muligheder

Formål: Besvare “Hvor bør Crediwire fokusere indsatsen?”

Topliste: revisionshuse med størst uudnyttet potentiale.

Kolonner:

| Kolonne | Definition |
|---|---|
| Revisionshus | `accounting_office_name`. |
| Erklæringer | `total_declarations`. |
| Dataanalyser | `total_analyses`. |
| Aktive forbindelser | GL-derived `active_erp_connections`. |
| Opportunity score | V1-score defineret nedenfor. |

V1 opportunity score:

```text
untapped_potential = total_declarations - total_analyses
connection_signal = active_erp_connections
usage_signal = total_analyses

opportunity_score =
  0.60 * percentile_rank(untapped_potential)
+ 0.25 * percentile_rank(connection_signal)
+ 0.15 * percentile_rank(usage_signal)
```

Rationale:

- Uudnyttet potentiale skal veje højest.
- Aktive forbindelser viser, at teknisk adgang allerede findes.
- Eksisterende brug viser, at organisationen allerede kender produktet.

Hvis man ønsker en mere konservativ V1 uden ny score, kan dashboardet i første release sortere direkte på `untapped_potential` og vise “Opportunity score” som rangnummer. Men den anbefalede V1 er en 0-100 score, fordi den bedre svarer på prioritering.

Anbefalede segmenter:

| Segment | Regel | Handling |
|---|---|---|
| Stor base, lav adoption | Høj `total_declarations`, lav `adoption_score` | Ledelsesdialog og enablement. |
| Mange forbindelser, lav brug | Høj GL, lav `total_analyses` | Aktiveringskampagne mod brugere. |
| Aktivt kontor, få brugere | Høj aktivitet, lav brugerbredde | Træning af flere medarbejdere. |
| Ingen aktivitet, stor base | Høj declarations, 0 analyser | Salgs-/CS-prioritet. |

## Section 6: Risiko

Formål: Vise hvor adoptionen er sårbar eller faldende.

Risikotyper:

| Risikotype | Definition | Anbefalet handling |
|---|---|---|
| Aktivitet koncentreret på få brugere | `top_3_user_share >= 0.85` eller `active_users <= 1`. | Udvid træning til flere brugere hos samme revisionshus. |
| Lav adoption | `adoption_score` er lav relativt til declarations-potentialet. | Prioriter onboarding, use cases og ledelsesopfølgning. |
| Faldende aktivitet | Seneste 3 måneder lavere end foregående 3 måneder. | Kontakt kontoret og identificer blocker. |
| Ingen ERP-forbindelser | `active_erp_connections = 0`. | Afklar integration, dataadgang og teknisk setup. |

Kolonner:

| Kolonne | Definition |
|---|---|
| AO navn | `accounting_office_name`. |
| Risikotype | Klassifikation fra reglerne ovenfor. |
| Anbefalet handling | Kort handlingsforslag. |
| Aktivitet | `total_analyses`. |
| Aktive brugere | `active_users`. |
| Top 3 user share | `top_3_user_share`. |
| Aktive forbindelser | GL-derived `active_erp_connections`. |

Visualiseringer:

- Risiko-tabel med sortering HIGH først.
- Stacked bar efter risikotype.
- Scatterplot: aktive brugere mod analyser, farvet efter risiko.

## Section 7: ROI

Formål: Give ledelsen en interaktiv business case for tidsbesparelse og økonomisk potentiale.

Kilde: `data/raw/Business case 2025.xlsx`.

Business case workbooken indeholder to relevante modeller:

| Ark | Input | Formel |
|---|---|---|
| `Simpel` | Antal kunder, timer sparet pr. kunde pr. år, faktureret timepris | `sparede_timer = kunder * timer`; `værdi = sparede_timer * timepris`. |
| `Avanceret` | Antal erklæringer, timer sparet pr. erklæring, faktureret timepris, antal kunder | `sparede_timer = erklæringer * timer`; `værdi = sparede_timer * timepris`. |

Default-inputs fra business case workbook:

| Input | Default |
|---|---:|
| Gennemsnitlig tidsbesparelse pr. erklæring | 4 timer |
| Timepris | 1.200 DKK |

Dashboard-inputs:

- Gennemsnitlig tidsbesparelse pr. erklæring.
- Timepris.
- Scope: alle erklæringer, uudnyttet potentiale, potentiale ved 10%, potentiale ved 20%, potentiale ved 30%.
- Accounting office filter, når AO template aktiveres.

Outputs:

```text
sparede_timer = selected_declaration_or_potential_volume * time_saving_hours
estimeret_oekonomisk_vaerdi = sparede_timer * hourly_rate
roi_potentiale = estimeret_oekonomisk_vaerdi
```

Vigtigt: Workbooken indeholder ikke et egentligt cost-input. Dashboardet bør derfor kalde outputtet “ROI potentiale” eller “økonomisk potentiale”, ikke en klassisk ROI-procent. Hvis der senere tilføjes implementeringspris eller licensomkostning, kan man beregne:

```text
roi_pct = (estimeret_oekonomisk_vaerdi - cost) / cost
```

Wireframe:

```text
+-----------------------------------------------------------------------+
| ROI BUSINESS CASE                                                     |
+-----------------------------------------------------------------------+
| Tidsbesparelse pr. erklæring [ 4,0 timer ]  Timepris [ 1.200 DKK ]    |
| Scope [ Uudnyttet potentiale v ]                                      |
+-----------------------------------------------------------------------+
| Sparede timer | Estimeret økonomisk værdi | ROI potentiale            |
+-----------------------------------------------------------------------+
| Sensitivitet: 2 timer | 4 timer | 6 timer | 8 timer                   |
+-----------------------------------------------------------------------+
```

## Section 8: AO Template

Målet er, at det globale dashboard senere kan blive et AO-dashboard ved at sætte:

```text
accounting_office_cvr = selected_cvr
```

Alle centrale tabeller skal derfor have `accounting_office_cvr` som join- og filterfelt.

Anbefalet semantisk model:

```text
dim_accounting_office
- accounting_office_cvr
- accounting_office_name
- canonical_accounting_office_name
- brand_name

fact_activity_monthly
- accounting_office_cvr
- year
- month
- analyses
- active_users
- distinct_clients

fact_user_activity
- accounting_office_cvr
- user_email
- user_name
- total_analyses
- distinct_clients
- first_activity_date
- latest_activity_date

fact_opportunity
- accounting_office_cvr
- total_declarations
- total_analyses
- adoption_score
- untapped_potential
- potential_at_10_percent
- potential_at_20_percent
- potential_at_30_percent
- opportunity_score

fact_connections_current
- accounting_office_cvr
- active_erp_connections
- source
- snapshot_date

fact_implementation_risk
- accounting_office_cvr
- active_users
- total_analyses
- top_3_user_share
- implementation_risk
- recommended_action
```

Globalt dashboard:

```text
WHERE accounting_office_cvr IS NOT NULL
```

AO-dashboard:

```text
WHERE accounting_office_cvr = :selected_accounting_office_cvr
```

Eksempler på fremtidige AO-filtre:

- Grant Thornton
- Beierholm
- Redmark
- Martinsen
- RSM
- Alle andre accounting offices i taxonomy/masterdata

## Visuelt design

Retning: professionelt ledelsesdashboard, ikke marketing-side.

Anbefalinger:

- Brug et tæt, skanningsvenligt layout med klare tabeller og grafer.
- Brug hvide eller meget lyse flader, neutral tekst og få accentfarver.
- Brug farver funktionelt: grøn for positiv vækst, rød for fald/risiko, blå for neutral aktivitet, gul/orange for opmærksomhed.
- KPI-kort skal være kompakte og sammenlignelige.
- Undgå store hero-sektioner, dekorative gradienter og forklarende marketingtekst.
- Alle charts skal have danske labels, dataperiode og tydelig enhed.
- Risiko- og opportunity-tabeller skal kunne sorteres og filtreres.

Forside-layout:

```text
+----------------------------------------------------------------------------------+
| Crediwire Intelligence                         Periode | Segment | AO filter     |
+----------------------------------------------------------------------------------+
| Aktive forbindelser | Dataanalyser | Aktive brugere | Aktive AO | Erklæringer    |
+----------------------------------------------------------------------------------+
| Vækst: analyser og brugere over tid        | Adoption: potentiale vs brug         |
+----------------------------------------------------------------------------------+
| Champions                                  | Muligheder                           |
+----------------------------------------------------------------------------------+
| Risiko                                     | ROI business case                    |
+----------------------------------------------------------------------------------+
```

## Datakvalitet og kendte begrænsninger

- `GL` er current snapshot, ikke en historisk månedlig serie.
- `Samlede erklæringer` er current declaration snapshot, ikke en historisk månedlig serie.
- `monthly_activity.csv` understøtter månedlig aktivitet pr. accounting office, men ikke bruger-MoM uden enten `DA_data` eller en ny `monthly_user_activity` tabel.
- Opportunity score kræver, at GL-metricen joines på `accounting_office_cvr`.
- Umatchede accounting offices bør håndteres via `accounting_office_taxonomy.csv` før dashboardet bruges til endelig ledelsesrapportering.
- Dashboardet skal vise datadækning og bør skelne mellem “current snapshot” og “trend”.

## Minimum V1 leverance

V1 er klar til UI-implementation, når disse modeloutputs findes:

1. `ao_master.csv`
2. `user_master.csv`
3. `monthly_activity.csv`
4. `ao_opportunity.csv`
5. `implementation_risk.csv`
6. `ao_connections_current.csv` eller tilsvarende GL-derived model
7. Valgfrit, men anbefalet: `monthly_user_activity.csv`

## Beslutninger

- Frontpage KPI: `Aktive forbindelser`, `Dataanalyser i alt`, `Aktive brugere`, `Revisionshuse med aktivitet`, `Samlede erklæringer`.
- Officiel aktive forbindelser-metric: GL / `Med ERP-forbindelse`.
- Officiel download-/analyse-count: fuld `DA_data`, ikke masterarkets periodebegrænsede KPI-celler.
- Første dashboard er globalt.
- AO-dashboard bygges senere som filteret version på `accounting_office_cvr`.
