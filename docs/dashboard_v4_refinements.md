# Dashboard V4 refinements

## Layout order

Dashboardet følger denne rækkefølge:

1. Ledelsesoverblik
2. Brug og udvikling
3. Estimeret Business Case
4. Top 10 brugere
5. Hvor skal vi fokusere næste gang?
6. Investering
7. Datastatus

Business case vises før bruger- og mulighedstabellerne, fordi ledelsen først skal se værdi og økonomisk potentiale.

Opportunity-sektionen er målrettet spørgsmålet: `Hvor skal vi fokusere næste gang?` Den viser prioritet, potentiel værdi og manglende aktive virksomheder før de mere rapporterende aktivitetskolonner.

Investering er flyttet ud af Business Case-sektionen, så læseflowet bliver:

```text
værdi
→ potentiale
→ brug
→ muligheder
→ investering som understøttende beregning
```

## Active companies KPI

`Aktive virksomheder` viser implementeringsstatus mod købt virksomhedskapacitet.

Kilden er `Downloads master sheet (49)-kopi.xlsx`, sheet `Data analysis master sheet`:

- `GL`: Med ERP-forbindelse
- `GT`: Købte virksomheder
- `GU`: Realization rate, beregnet som `GL / GT`

Dashboardets KPI beregnes som:

```text
aktive virksomheder / købte virksomheder
```

Aktiveringsgrad:

```text
aktive virksomheder / købte virksomheder
```

Manglende aktivering:

```text
max(købte virksomheder - aktive virksomheder, 0)
```

Eksempel for Grant Thornton:

```text
683 / 740
92,3 % aktiveret
57 virksomheder mangler aktivering
```

Valideringen af `GT` er dokumenteret i `docs/gt_purchased_capacity_review.md`. Feltet kan bruges som købt virksomhedskapacitet, men nogle AO-rækker har `GL > GT` eller `GT = 0`. Dashboardet må derfor ikke vise negative manglende aktiveringer.

## YTD and MoM labels

Trendkortene viser altid de konkrete perioder, der sammenlignes.

YTD sammenligner indeværende år til og med seneste afsluttede måned med samme periode året før.

Eksempel:

```text
Jan-Maj 2026
Jan-Maj 2025
Forskel
Udvikling
```

MoM sammenligner seneste afsluttede måned med måneden før.

Eksempel:

```text
Maj 2026
Apr 2026
Forskel
Udvikling
```

Procentændring beregnes som:

```text
(nuværende periode - sammenligningsperiode) / sammenligningsperiode
```

Hvis sammenligningsperioden er 0, vises `Ny aktivitet` eller `Ingen aktivitet` i stedet for at dividere med 0.

For `Aktive brugere` viser YTD-kortet ikke længere den summerede værdi af månedlige aktive brugere, fordi den kan forveksles med unikke brugere. Kortet er et månedligt aktivitetsbreakdown, ikke et afledt trend-KPI. Det viser ikke procentvis vækst, periodeændring eller status-badge. Kortet viser i stedet:

```text
Seneste måned
Højeste måned
Gennemsnit pr. måned
Månedlig fordeling
```

Top-KPI'en hedder `Brugere med analyse-downloads` og viser unikke brugere med mindst én downloadet dataanalyse i det valgte AO.

## Crediwire investment logic

Business case-sektionen viser en enkel investment-sammenligning.

Business case labels er scenarie-baserede og må ikke kræve fortolkning:

```text
Realiseret værdi i dag
Værdi pr. aktiv virksomhed
Værdi ved 100 % implementering
Værdi ved valgt implementering, fx Værdi ved 70 % implementering
ROI i dag
ROI ved valgt implementering, fx ROI ved 70 % implementering
```

KPI-kortet for `Værdi ved valgt implementering` skal også vise aktiveringsindsatsen bag værdien:

```text
Målsætning: [target_active_companies] virksomheder
Aktive i dag: [active_companies] virksomheder
Manglende aktivering: [missing_companies] virksomheder
```

Kortet viser en progress bar baseret på:

```text
active_companies / target_active_companies
```

ROI-logikken skal bruge den investering, der matcher scenariet:

```text
Investering i dag =
aktive virksomheder i dag × pris pr. aktiv virksomhed

ROI i dag =
realiseret værdi i dag / investering i dag

Investering ved valgt implementering =
target_active_companies × pris pr. aktiv virksomhed

Estimeret nettoværdi ved valgt implementering =
værdi ved valgt implementering - investering ved valgt implementering

ROI ved valgt implementering =
værdi ved valgt implementering / investering ved valgt implementering
```

ROI ved valgt implementering må ikke bruge dagens investering som denominator.

ROI-kortene viser ROI-multiple som det største tal, men skal også vise pengebeløbene direkte:

```text
ROI i dag
[multiple]x

Nettoværdi
[realiseret værdi i dag - investering i dag]

Værdi: [realiseret værdi i dag]
Investering: [investering i dag]
[active_companies] aktive virksomheder × [pris pr. aktiv virksomhed]
```

```text
ROI ved valgt implementering
[multiple]x

Nettoværdi
[værdi ved valgt implementering - investering ved valgt implementering]

Værdi: [værdi ved valgt implementering]
Investering: [investering ved valgt implementering]
[target_active_companies] aktive virksomheder × [pris pr. aktiv virksomhed]
```

Undgå labels som:

```text
Realistisk potentiale
Fremtidig værdi
Målsætning
Estimeret ROI
```

Investment-sektionen vises kun, når det valgte revisionshus har aktive virksomheder.

Customer mode:

```text
aktive virksomheder > 0
```

Viser realiseret værdi, værdi pr. aktiv virksomhed, potentiale, investering og estimeret ROI.

Prospect mode:

```text
aktive virksomheder = 0
```

Skjuler investering, årlig investering og estimeret ROI. Business casen viser i stedet potentiel værdi ved implementering, realistisk potentiale og hvad aktivering kræver.

Potentiale-forklaringen viser en progress bar mod den valgte implementeringsmålsætning:

```text
aktive virksomheder / mål for aktive virksomheder
opnået procent
manglende virksomheder
```

Eksempel:

```text
683 / 7.956 virksomheder
8,6 % opnået
7.273 virksomheder mangler
```

Standard:

```text
Pris pr. aktiv virksomhed pr. år = 1.988 kr.
```

Automatisk investering beregnes som:

```text
aktive virksomheder × pris pr. aktiv virksomhed pr. år
```

Dashboardet viser beregningen direkte, for eksempel:

```text
683 × 1.988 kr.
1.357.804 kr.
```

Der er ikke manuel override eller alternative pricing workflows i release-layoutet. Formålet er kun at vise:

```text
pris pr. aktiv virksomhed
→ samlet årlig investering
```

## Estimated ROI formulas

Estimeret ROI i dag:

```text
realiseret værdi i dag / årlig investering
```

Forklarende nettoværdi:

```text
realiseret værdi i dag - årlig investering
```

Estimeret ROI ved målsætning:

```text
realistisk potentiale / årlig investering
```

Forklarende nettoværdi ved målsætning:

```text
realistisk potentiale - årlig investering
```

Hvis årlig investering er 0 eller blank, vises ingen estimeret ROI. Dashboardet viser i stedet hjælpeteksten:

```text
Indtast årlig investering for at beregne estimeret ROI.
```

## Limitations

Crediwire investering er en brugerindtastet antagelse, ikke et tal udledt fra rå aktivitetsdata.

Estimeret ROI er ikke et regnskabsmæssigt ROI-tal. Det viser hvor mange gange den angivne årlige investering dækkes af den estimerede værdi i business case-modellen.

Realiseret værdi og realistisk potentiale afhænger fortsat af de valgte antagelser for tidsbesparelse, timepris, kvalitetsfaktor og implementeringsgrad.

## Weekly refresh architecture

Den endelige refresh-arkitektur er dokumenteret i `docs/weekly_refresh_architecture.md`.
