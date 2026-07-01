# Dashboard V2 KPI-logik

Kildeprincip: Download- og analyseaktivitet følger `docs/analysis_conventions.md`: brug fuld tilgængelig aktivitet fra `DA_data`, ikke periodebegrænsede masterark-KPI’er. Aktive forbindelser følger GL-metricen `Med ERP-forbindelse` fra `Data analysis master sheet`.

## KPI'er

| KPI | Formel | Datakilde | Business meaning | Begrænsninger | Type |
|---|---|---|---|---|---|
| Aktive forbindelser | `SUM(active_erp_connections)` | `data/processed/ao_connections_current.csv`, afledt fra GL | Hvor mange virksomheder/klientforbindelser har aktivt ERP-datagrundlag. | Current snapshot. Der findes ikke historiske GL-snapshots endnu. | Current value / realized value |
| Samlede erklæringer | `SUM(audits + reviews + extended_reviews + assistance)` | `data/processed/ao_master.csv` | Den samlede population/potentialebase, som Crediwire kan skabe værdi på. | Declaration-data er snapshot, ikke historisk trend. | Potential |
| Revision | `SUM(audits)` | `ao_master.csv` | Antal revisions-erklæringer i potentialebasen. | Snapshot. | Potential |
| Udvidet gennemgang | `SUM(extended_reviews)` | `ao_master.csv` | Antal udvidet gennemgang-erklæringer i potentialebasen. | Snapshot. | Potential |
| Review | `SUM(reviews)` | `ao_master.csv` | Antal review-erklæringer i potentialebasen. | Snapshot. | Potential |
| Assistance | `SUM(assistance)` | `ao_master.csv` | Antal assistance-erklæringer i potentialebasen. | Snapshot. | Potential |
| Virksomheder analyseret | `SUM(distinct_clients_analysed)` | `ao_master.csv` | Hvor mange unikke klientvirksomheder der har haft analyseaktivitet. | Summen på tværs af AO kan tælle samme klient flere gange, hvis klienten findes under flere AO. | Realized value |
| Dataanalyser | `SUM(total_analyses)` | `ao_master.csv` / `DA_data` | Samlet brugsvolumen. Hver række i `DA_data` er en analyse/download. | Downloads er aktivitet, ikke unikke virksomheder. | Realized value / trend |
| Aktive brugere | `COUNT(DISTINCT user_email)` med mindst én analyse | `user_master.csv` | Hvor mange medarbejdere der bruger løsningen. | Total kendte brugere findes ikke, så user adoption-rate kan ikke beregnes. | Realized value |
| Revisionshuse med aktivitet | `COUNT(accounting_office_cvr WHERE total_analyses > 0)` | `ao_master.csv` | Hvor bredt brugen er spredt på AO-niveau. | Afhænger af matching til AO. | Realized value |
| Ikke aktiverede virksomheder | `MAX(Samlede erklæringer - Aktive forbindelser, 0)` | `ao_master.csv` + GL | Groft estimat for population uden aktiv ERP-forbindelse. | Erklæringer og forbindelser er ikke samme enhed, så tallet er et ledelsesindikator-gap, ikke juridisk præcis virksomhedstælling. | Opportunity gap |
| Ikke analyserede virksomheder | `MAX(Samlede erklæringer - Virksomheder analyseret, 0)` | `ao_master.csv` | Groft estimat for population uden analysegrundlag. | Samlede erklæringer er declaration-volume, ikke unikke virksomheder. | Opportunity gap |
| Connection penetration | `Aktive forbindelser / Samlede erklæringer` | GL + `ao_master.csv` | Hvor stor del af potentialebasen der har aktivt struktureret datagrundlag. | Nævneren er erklæringer, tælleren er forbindelser. Bruges som management ratio. | Current value |
| Analysis coverage | `Virksomheder analyseret / Samlede erklæringer` | `ao_master.csv` | Hvor stor del af potentialebasen der mindst har analysegrundlag. | `distinct_clients_analysed` og erklæringer er ikke samme enhed. | Current value |
| Usage intensity | `Dataanalyser / Aktive forbindelser` | `ao_master.csv` + GL | Hvor meget analyseaktivitet der skabes pr. aktiv forbindelse. | Ikke defineret hvis aktive forbindelser er 0. | Adoption / usage |
| User adoption | Vis `Aktive brugere`; beregn ikke rate | `user_master.csv` | Hvor mange aktive brugere løsningen har. | Total kendte brugere findes ikke. | Current value |
| Realiseret værdi i dag | `aktive_forbindelser × timer_sparet_pr_erklæring × timepris × kvalitetsmultiplikator` | GL + ROI-inputs | Viser værdien af den aktiverede base i dag, inkl. antaget kvalitetsværdi hvis aktiveret. | Kvalitetsmultiplikator er `quality_factor` når kvalitet er aktiveret, ellers `1`. Den må aldrig være `0`. | Realized value |
| Fuldt potentiale | `samlede_erklæringer × timer_sparet_pr_erklæring × timepris × kvalitetsmultiplikator` | `ao_master.csv` + ROI-inputs | Viser potentialet hvis hele populationen understøttes af dataanalyse, inkl. antaget kvalitetsværdi hvis aktiveret. | Scenarie, ikke realiseret værdi. Kvalitetsmultiplikator er `1`, når kvalitet ikke er medtaget. | Potential |
| Uudnyttet potentiale | `fuldt_potentiale - realiseret_værdi_i_dag` | Beregnet | Viser gap mellem aktuel aktivering og fuld population. | Sammenligner aktive forbindelser med erklæringspopulation som management-indikator. | Opportunity gap |
| Kvalitetsfaktor | `enabled ? quality_factor : 1` | ROI-input | Afspejler ekstra værdi af bedre dokumentation, mere ensartet proces, færre manuelle udtræk og lavere risiko for fejl. | Default er `2x`, når kvalitet er aktiveret. Når kvalitet ikke er medtaget, bruges `1x`. Der multipliceres aldrig med `0`. | ROI assumption |
| Rapporteringseffektivitet | `rapporteringskunder × rapporteringstimer_sparet_pr_kunde × timepris` | Valgfri ROI-inputs | Værdi af tidsbesparelse på rapportering. | Vises kun når `Medtag rapportering og rådgivning` er slået til. Matcher `Avanceret!O18`. | Optional add-on |
| Rådgivningsværdi | `rapporteringskunder × rådgivningstimer_pr_rapporteringskunde × timepris` | Valgfri ROI-inputs | Potentiel ny rådgivningsomsætning. | Vises kun når add-on togglen er slået til. Matcher `Avanceret!M18` med samme timepris som dashboard-input. | Optional add-on |
| Samlet værdi inkl. rapportering og rådgivning | `fuldt_potentiale_inkl_kvalitetsfaktor + rapporteringseffektivitet + rådgivningsværdi` | Beregnet | Viser samlet potentialeværdi, når de valgfri add-ons medregnes. | Vises kun når add-on togglen er slået til. | Optional combined value |

## ROI V2-regler

Defaultvisningen viser kun dataanalyse og kvalitet:

- Realiseret værdi i dag
- Fuldt potentiale
- Uudnyttet potentiale
- Kvalitetsfaktor indgår i værdierne, når den er aktiveret

Default inputs:

- Timer sparet pr. erklæring = `4`
- Timepris = `1.200`
- Kvalitetsfaktor = `2`

Kvalitetsregel:

```text
Hvis kvalitet er aktiveret: kvalitetsmultiplikator = quality_factor
Hvis kvalitet ikke er medtaget: kvalitetsmultiplikator = 1
Brug aldrig 0 som kvalitetsmultiplikator.
```

Kvalitetsforklaring i UI:

```text
Kvalitetsfaktoren afspejler den ekstra værdi af bedre dokumentation,
mere ensartet proces, færre manuelle udtræk og lavere risiko for fejl.
Den er en antagelse, som brugeren selv kan justere.
```

Når `Medtag rapportering og rådgivning` er slået til, vises ekstra inputs:

- Rapporteringskunder = `500`
- Rapporteringstimer sparet pr. kunde = `3`
- Rådgivningstimer pr. rapporteringskunde = `2`

Og ekstra outputs:

- Rapporteringseffektivitet
- Rådgivningsværdi
- Samlet værdi inkl. rapportering og rådgivning

Formelvisningen må kun vise de formler, der er relevante for den aktuelle toggle-state.

## Trendregler

- Dataanalyser over tid bruger `monthly_activity.csv`.
- Aktive brugere over tid bruger `monthly_user_activity.csv`.
- Kun afsluttede måneder vises som standard.
- Den aktuelle delmåned må ikke bruges til MoM-sammenligninger.
- Aktive forbindelser må ikke vises som trend, før der findes historiske GL-snapshots.
- Hvis connection-historik mangler, vis teksten: `Historik indsamles fremadrettet`.

## MoM-regler

Topbrugere skal vise:

- Seneste afsluttede måned
- Forrige afsluttede måned
- Ændring i antal
- Ændring i %

Formler:

```text
ændring_i_antal = seneste_afsluttede_måned - forrige_afsluttede_måned
ændring_i_pct = ændring_i_antal / forrige_afsluttede_måned
```

Hvis forrige måned er 0, vis `Ny aktivitet` i procentfeltet.

## AO-filter

Alle KPI’er, tabeller, trends og ROI-beregninger skal filtreres med:

```text
accounting_office_cvr = selected_accounting_office_cvr
```

Når filteret er tomt, vises globalt Crediwire-dashboard.
