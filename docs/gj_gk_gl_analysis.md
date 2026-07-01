# Analyse af kolonnerne GJ, GK og GL

Kilde: `data/raw/Downloads master sheet (49)-kopi.xlsx`, arket `Data analysis master sheet`.

Jeg har læst selve headers, formler og nabokolonner. Kolonnerne `GJ`, `GK` og `GL` ligger i en summary-blok øverst i arket, ikke i den rå `DA_data`-tabel. De relevante rækker er `5:58`, med total i række `4`.

Datadækning i master-arket: 6,031 aktivitetsrækker med datoer fra 2024-03-13 til 2026-06-04.

## Området omkring GJ:GL

Overskrifterne i arket er:

| Kolonne | Overheader | Header |
|---|---|---|
| GJ |  | Cvr |
| GK |  | Virksomhed (der har downloadet mindst én dataanalyse) |
| GL | Antal virksomheder | Med ERP-forbindelse |
| GM | Antal virksomheder | Uden ERP-forbindelse |
| GN | Antal virksomheder | I alt |
| GP | Analyse-downloads | I alt |
| GQ | Analyse-downloads | Unikke (monthly) |
| GR | Analyse-downloads | Unikke (all time) |
| GT | Realization rate | Købte virksomheder |
| GU | Realization rate | Realization rate |
| GW | Activation rate calc 1 |  |
| GX | Activation rate calc 2 |  |

Totalrækken viser blandt andet:

| Felt | Værdi |
|---|---:|
| GL, med ERP-forbindelse | 1310 |
| GM, uden ERP-forbindelse | 581 |
| GN, forbindelser i alt | 1891 |
| GP, analyse-downloads i alt | 6927 |
| GQ, unikke monthly | 1383 |
| GR, unikke all time | 642 |
| GT, købte virksomheder | 1270 |

## GJ

**Header:** `Cvr`

**Formel/logik:** Der ligger ingen Excel-formel i de analyserede celler `GJ5:GJ58`. Kolonnen er en statisk CVR-nøgle pr. virksomhed/regnskabskontor i summary-tabellen.

Den bruges dog aktivt af nabokolonnerne. `GL` refererer eksempelvis til `$GJ5` og matcher den mod `connection_data[from_company_vat]`.

**Hvad repræsenterer metricen?**

`GJ` er ikke en metric. Det er identifikatoren for virksomheden/regnskabskontoret i rækken. Den fortæller, hvilket CVR-nummer Excel bruger til at koble summary-rækken til ERP-forbindelsesdata.

**Hvordan beregnes den?**

Den beregnes ikke i selve arket. Den ser ud til at være en vedligeholdt/mappet nøgle, som skal passe til virksomhedsnavnet i `GK` og til `connection_data[from_company_vat]`.

**Type:** Connection key / identifier. Ikke current value, historical value, growth metric eller adoption metric.

**Business-spørgsmål:** Hvilket CVR-nummer bruger vi til at identificere dette regnskabskontor og koble det til ERP-forbindelser?

## GK

**Header:** `Virksomhed (der har downloadet mindst én dataanalyse)`

**Formel/logik:** Der ligger ingen Excel-formel i de analyserede celler `GK5:GK58`. `GK4` er total-label `I ALT`.

Kolonnen er en navnedimension for de virksomheder/regnskabskontorer, der indgår i download-summaryen. Den omkringliggende downloadlogik bruger navnene til opslag. Eksempelvis bruger `GP5` denne formel:

```excel
=_xlfn.XLOOKUP($GK5,_xlfn.ANCHORARRAY($Q$4),_xlfn.ANCHORARRAY($Z$4))
```

Det betyder, at total downloads i `GP` slås op via navnet i `GK` mod den beregnede virksomhedsliste i området omkring `Q4`.

Den relevante beregnede liste i `Q4` er:

```excel
=_xlfn.SORTBY(_xlfn.UNIQUE(_xlfn.ANCHORARRAY(I3)), COUNTIFS(_xlfn.ANCHORARRAY(I3), _xlfn.UNIQUE(_xlfn.ANCHORARRAY(I3))),-1)
```

`Q4` bygger altså en unik liste af `requesting_company_name` fra aktivitetsdata og sorterer efter antal forekomster. `GK` selv er dog ikke en direkte formelcelle i den læste workbook.

**Hvad repræsenterer metricen?**

`GK` er heller ikke en metric i sig selv. Det er visningsnavnet på virksomheden/regnskabskontoret i summary-rækken. Headeren siger, at listen handler om virksomheder, der har downloadet mindst én dataanalyse.

**Hvordan beregnes den?**

Navnet beregnes ikke i `GK`-cellerne. I praksis fungerer kolonnen som en vedligeholdt navneliste, der bruges til at hente downloads, unikke downloads og andre summary-tal i nabokolonnerne.

**Type:** Adoption dimension / current summary list. Ikke et KPI-tal alene.

**Business-spørgsmål:** Hvilke virksomheder/regnskabskontorer har downloadet mindst én dataanalyse, og hvilket navn skal vises i ledelsesrapporteringen?

## GL

**Header:** `Med ERP-forbindelse`

**Formel/logik:** `GL4` summerer kolonnen:

```excel
=SUM(GL5:GL58)
```

Den gennemgående rækkeformel starter i `GL5`:

```excel
=SUM(   --(_xlfn.VALUETOTEXT($GJ5)=_xlfn.VALUETOTEXT(connection_data[from_company_vat])) *   --ISNUMBER(MATCH(connection_data[to_company_status], {1,2,3,8}, 0)) )
```

**Hvad repræsenterer metricen?**

`GL` tæller ERP-forbindelser for virksomheden/regnskabskontoret på rækken. Den ser på `connection_data` og tæller de rækker, hvor:

1. `connection_data[from_company_vat]` er lig med CVR-nummeret i `GJ`.
2. `connection_data[to_company_status]` er en af statuskoderne `1`, `2`, `3` eller `8`.

I plain Danish: `GL` viser hvor mange klient-/virksomhedsforbindelser kontoret har, som Excel vurderer som “med ERP-forbindelse” ud fra statuskoderne i `connection_data`.

Vigtigt: Formlen tæller rækker i `connection_data`. Den bruger ikke `UNIQUE` på klient-CVR. Hvis der findes dubletter i forbindelsesdata, vil de blive talt med som flere forbindelsesrækker.

**Hvordan beregnes den?**

For hver række tager Excel CVR fra `GJ`, finder alle matching `from_company_vat` i `connection_data`, filtrerer til status `1`, `2`, `3` eller `8`, og summerer de matches.

**Type:** Connection metric. Den er en aktuel/snapshot-værdi for ERP-forbindelsesbasen i workbookens data, ikke en historisk trend eller vækstmetric.

**Business-spørgsmål:** Hvor stor en ERP-forbundet klientbase har dette regnskabskontor i dataene?

## 20 eksempelrækker

| Excel-række | GJ: Cvr | GK: Virksomhed | GL: Med ERP-forbindelse | GM: Uden ERP | GN: I alt forbindelser | GP: Analyse-downloads | GQ: Unikke monthly | GR: Unikke all time |
|---:|---:|---|---:|---:|---:|---:|---:|---:|
| 5 | 34209936 | Grant Thornton, Godkendt Revisionspartnerselskab | 683 | 396 | 1079 | 4182 | 698 | 505 |
| 6 | 35486178 | REVISIONSFIRMAET EDELBO STATSAUTORISERET REVISIONSPARTNERSELSKAB | 80 | 5 | 85 | 533 | 134 | 0 |
| 7 | 27525989 | Skov Revision ApS | 140 | 35 | 175 | 441 | 96 | 0 |
| 8 | 16645699 | Revisionsfirmaet Axel Gram I/S | 48 | 2 | 50 | 250 | 61 | 0 |
| 9 | 26717671 | DANSK REVISION ÅRHUS, GODKENDT REVISIONSPARTNERSELSKAB | 19 | 2 | 21 | 141 | 30 | 22 |
| 10 | 32676421 | LEIF MIKKELSEN & PARTNERE A/S | 16 | 2 | 18 | 127 | 28 | 17 |
| 11 | 36029374 | BUUS JENSEN I/S STATSAUTORISEREDE REVISORER | 21 | 0 | 21 | 162 | 32 | 21 |
| 12 | 10019699 | Danrevi Løgstør I/S | 15 | 0 | 15 | 133 | 36 | 21 |
| 13 | 44282380 | Powered-By Statsautoriseret Revisionspartnerselskab | 79 | 0 | 79 | 221 | 66 | 0 |
| 14 | 34953619 | RevisorGruppen I/S | 19 | 1 | 20 | 96 | 32 | 0 |
| 15 | 18437082 | Lægård Revision | 12 | 3 | 15 | 56 | 10 | 0 |
| 16 | 39463113 | Kreston CM Statsautoriseret Revisions interessentskab | 20 | 3 | 23 | 66 | 18 | 13 |
| 17 | 25160037 | PIASTER REVISORERNE, STATSAUTORISERET REVISIONSAKTIESELSKAB | 6 | 0 | 6 | 42 | 6 | 0 |
| 18 | 32895468 | Beierholm | 9 | 19 | 28 | 38 | 18 | 13 |
| 19 | 37543128 | Roesgaard Godkendt Revisionspartnerselskab | 4 | 4 | 8 | 32 | 9 | 0 |
| 20 | 34480370 | Revi Midt | 29 | 0 | 29 | 102 | 24 | 0 |
| 21 | 89224918 | Krøyer Pedersen Statsautoriserede Revisorer I/S | 3 | 3 | 6 | 23 | 5 | 3 |
| 22 | 38732420 | Plature | 0 | 0 | 0 | 26 | 5 | 0 |
| 23 | 36561505 | EY Godkendt Revisionspartnerselskab | 2 | 0 | 2 | 20 | 11 | 7 |
| 24 | 35382879 | Albjerg | 9 | 0 | 9 | 49 | 7 | 6 |

## KPI-vurdering

### 1. Kan GJ bruges som management KPI?

Nej. `GJ` er et CVR-nummer og dermed en nøgle, ikke et performance-tal. Det bør bruges til matching, deduplikering og drill-down, men ikke som et KPI på forsiden.

### 2. Kan GK bruges som management KPI?

Nej, ikke alene. `GK` er virksomhedsnavnet/regnskabskontorets navn. Det er en dimension, der kan bruges i tabeller, ranglister og filtre. Det fortæller hvem KPI’en handler om, men det er ikke en KPI.

### 3. Kan GL bruges som management KPI?

Ja, men kun som en ERP-/forbindelses-KPI. `GL` kan bruges til at vise størrelsen af den ERP-forbundne klientbase pr. regnskabskontor.

Den bør ikke forveksles med downloadaktivitet eller analyseadoption. Et kontor kan have mange ERP-forbindelser og få downloads, eller omvendt. Derfor bør `GL` på dashboardet stå sammen med download-KPI’er som `GP`, `GQ` eller den fulde `DA_data`-aktivitet, hvis formålet er adoption.

### 4. Hvilken af de tre bør være på dashboardets forside?

Af de tre er kun `GL` egnet som en egentlig forside-KPI.

Anbefaling:

- Vis `GL` som “ERP-forbundne virksomheder/forbindelser”.
- Brug `GK` som navn i top-lister og filtre.
- Brug `GJ` skjult som teknisk nøgle til matching.

### 5. Hvilket business-spørgsmål svarer hver kolonne på?

| Kolonne | Business-spørgsmål |
|---|---|
| GJ | Hvilket CVR identificerer regnskabskontoret, så vi kan koble downloads, ERP-forbindelser og øvrige data korrekt? |
| GK | Hvilket regnskabskontor/virksomhedsnavn vises for denne aktivitets- eller forbindelsesrække? |
| GL | Hvor mange ERP-forbundne klient-/virksomhedsforbindelser har dette regnskabskontor? |

## Konklusion

`GJ` og `GK` er nødvendige dimensioner, men ikke KPI’er. `GL` er den eneste af de tre kolonner, der kan bruges som management KPI, fordi den måler volumen af ERP-forbindelser. Den bedste brug på dashboardets forside er som en forbindelses-/implementation-metric, ikke som en download- eller adoption-metric.
