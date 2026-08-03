# Produktspecifikation · Crediwire Ledelsesdashboard

Samlet spec efter Mads' oprindelige prompt (30. juli 2026) og de beslutninger og
rettelser han gav i løbet af 31. juli. Dette dokument er sandheden om hvad vi bygger.

---

## 1 · Formål og målgruppe

En Crediwire-sælger viser dashboardet til beslutningstageren i et revisionshus,
typisk managing partner, CEO, COO, kommerciel direktør eller
digitaliseringsansvarlig. Eksempel: Rune hos Grant Thornton.

På cirka 30 sekunder skal det svare på:
1. Hvordan går det?
2. Hvilken værdi har vi fået?
3. Hvor stort er potentialet?
4. Hvad kræver opmærksomhed?
5. Hvad bør vi gøre nu?

Det skal føles som et moderne ledelsesprodukt (WHOOP, Stripe, Linear), ikke et
Power BI-dashboard. Detaljer, beregninger og avanceret analyse ligger bag klik,
faner eller fold ud (progressive disclosure).

---

## 2 · Bærende principper

1. **Intet tal opdigtes.** Mangler datagrundlaget, står der hvorfor. (Fx: kommuner
   udelades i denne version, fordi kommunedata ikke er i de indlæste filer.)
2. **Målt adskilles fra antaget.** Hvert tal mærkes, så revisoren kan se forskel.
3. **Nettoværdi vægter mere end ROI.** Kronerne er det vigtige. ROI må ikke dominere.
4. **Sæson må aldrig ligne tilbagegang.** Al udvikling vises år mod år eller rullende 12 mdr.
5. **Alt afgrænses til regnskabsklasse B.** Klasse A, C og D udelades.
6. **Byg på juni-versionens kvalitet.** Den gode `index.html` er barren. Opfind ikke ny struktur.
7. **Ingen tankestreg (—) i teksten.** Brug ":" · "·" eller komma.

---

## 3 · Struktur · fire faner (Mads' egen inddeling, 31. juli)

| Fane | Indhold |
|---|---|
| **1 Overblik** | Executive-forside: Crediwire Score, KPI'er, anbefaling, fokusområder |
| **2 Udvikling** | Brug over tid (år mod år), top-lister |
| **3 Business case** | Resultat forrest, regnemaskine foldet væk |
| **4 Muligheder** | Fokus-tabel og implementeringsplan, klar til handling |

Avanceret visning (bestyrelses- og budgettal) ligger bag "Avanceret"-knappen, uden for fanerne.

---

## 4 · Sektion 1 · Overblik (executive)

Maksimalt få primære elementer. Skal kunne afkodes på 30 sekunder.

### Crediwire Score
WHOOP-agtig ring, farven bærer beskeden, tallet i midten. Kvalitativ vurdering vises.
Vægtningen står **ikke** forrest, men bag linket "Sådan beregnes scoren".

### Primære KPI'er (store, klikbare kort, hver mærket målt/antaget)
- **Nettoværdi skabt** · med "værdi skabt" og "investering" under. Nettoværdi større end ROI.
- **Aktivering** · fx 96,6% · "715 af 740 virksomheder aktiveret".
- **Uudnyttet potentiale** · kroner + antal virksomheder uden for aftalen.
- **Aktivitet** · fx +140% · "jan–maj 2026 mod samme periode 2025".

### Ledelsesanbefaling
Én tydelig anbefaling under KPI-rækken. Fx "Udvid implementeringen til X% af
porteføljen. Det svarer til Y virksomheder og kan øge nettoværdien med ca. Z."
Primær knap "Se business case", sekundær "Lav implementeringsplan".

### Fokusområder (maks fire, klikbare til detaljer)
Fx: uaktiverede købte virksomheder · top 3 brugeres andel · manglende til målet ·
erklæringer relevante for årsrapport-produktet.

### Top 3 kommuner ("Hvor jeres kunder ligger")
Kundernes geografi, ikke husets kontorer. **Afventer fuldt dataudtræk** (kommunedata
er ikke i de nuværende filer, så det opdigtes ikke).

---

## 5 · Sektion 2 · Udvikling

Alt vises år mod år.

- **Går brugen frem eller tilbage?** YTD i år mod sidste år, med status (Fremgang).
- **Dataanalyser over tid** · søjlediagram, sæson-note (fx juni må gerne være lavere end marts).
- **Aktive brugere over tid** · søjlediagram.
- **Top 10 brugere** · navn, email, revisionshus, analyser i alt, seneste/forrige måned, ændring.
- Brugerafhængighed kommunikeres som organisatorisk risiko (top 3's andel).

---

## 6 · Sektion 3 · Business case

Interaktiv beregner, må ikke ligne et regneark. **Resultatet står forrest, regnemaskinen ligger foldet væk.**

### Forrest (resultatkort)
Implementeringsmål · Værdi · Investering · **Nettoværdi** · ROI (lille).
Uudnyttet nettoværdi er det vigtigste kommercielle tal. Hvert centralt tal kan foldes ud ("Beregning").

### Regnemaskine (foldet væk · "Business Case Regnemaskine")
Antagelserne grupperet som Mads' fire grupper:
- **Tid:** timepris, timer sparet pr. dataanalyse / årsrapport / assistance / rapporteringskunde
- **Kvalitet:** kvalitetsfaktor 0–10 (1 = ingen ekstra værdi, 2 = dobbelt værdi)
- **Omfang:** implementeringsgrad %, antal årsrapporter (**tal**, fx 543), antal assistance (**tal**), rapporteringskunder
- **Pris:** pris pr. aktiv virksomhed (min. 1.226 kr.), pr. årsrapport, pr. assistance

Antal årsrapporter og assistance angives som **tal** (kan også kunne skiftes til % af total).

### Viderefakturering
Knap "Viderefaktureres til kunder" ved priserne. Alle tre priser kan viderefaktureres
til kostpris. Slået til: investeringen falder mod 0, og ROI erstattes af "fuldt dækket".

---

## 7 · Sektion 4 · Muligheder

Skal kunne realiseres uden yderligere analyse. Navngivne lister, ikke aggregater.

- **Fokus-tabel** ("Hvor skal vi fokusere næste gang?"): prioriteret, sorterbar, med
  værdi, investering for expand, samlet investering og nettoværdi pr. linje.
- **Fuld revisorliste** (ikke kun top 10): navn, MNE, region med koncentrationsprocent
  (kundetyngdepunkt, aldrig "kontor"), klienter, aktive, i brug seneste 12 mdr.,
  uudnyttet potentiale, potentiel værdi. Sorterbar og filtrerbar.
- **Implementeringsplan:** tidshorisont (30/60/90 dage, 6/12 mdr.), mangler til målet,
  tempo pr. måned/uge, nettoværdi ved mål, og konkrete handlingskort.
- Filtre: region · kommune · virksomhed · revisor · MNE · erklæringstype.

Endnu ikke bygget fra prompten: **Focus and Risk** (risici med konsekvens, handling,
ansvarlig, deadline) og **Benchmark** mod andre huse i percentiler.

---

## 8 · Crediwire Score (tidligere "Firm Health")

Fem delscorer, vægtet sum, 0–100. Verificeret: Grant Thornton = **72**.

| Delscore | Vægt | Hvornår 100 point | GT |
|---|---:|---|---:|
| Aktivering | 25% | Hele aftalen i brug | 97 |
| Vækst | 20% | +50% eller mere år mod år | 100 |
| Udnyttelse | 20% | 12 analyser pr. virksomhed om året | 50 |
| Brugerbredde | 15% | Top 3 står for en tredjedel eller mindre | 85 |
| Markedsdækning | 20% | 25% dækning af klasse B | 25 |

Niveauer: 90–100 Excellent · 75–89 Strong · 60–74 **Value opportunity** · under 60 Needs attention.

To regler: kan under 60% af vægten beregnes, vises ingen score. Er der flere aktive
end købte, udelades Aktivering.

---

## 9 · Huse og grupper

Dashboardet kan vise **alle huse** og filtrere på de fem grupper (fra `app.js`):
Eksisterende kunder · Top prospects · **Accru Partners** · **RGD** · Næste 20 fokus.
Big 4 holdes ude af pipe-visninger. Standardvalg: Grant Thornton.

---

## 10 · Afklarede databeslutninger (31. juli)

| Emne | Beslutning |
|---|---|
| Virksomheder pr. AO | **Aktive** er det sande tal (GT 715). **Købte** (740) er det oprindelige køb. Aktive over købte = ekspansion, positivt (fx Buus 5 → 21). Købte = 0 = ikke-kunde eller ikke registreret. |
| Brugerbredde | Måles som top 3 brugeres andel. Ingen nævner om ansatte nødvendig. |
| Klasse A, C, D | Udelades. |
| Budget-ark | Fokuseres på klasse B. |
| Erklæringskilde | Det nye, fuldstændige regionsudtræk (264.077 rækker). |

---

## 11 · Datagrundlag og begrænsninger

- Erklæringer, brugere, analyser og forbindelser pr. hus ligger i `data/processed/`.
- Kommunedata og revisor-geografi kræver det fulde udtræk (ikke i de indlæste filer endnu).
- Alt kører live på `app.js` og `styles.css` fra juni-versionen, så dybden bevares 1:1.

---

## 12 · Designretning

Roligt, premium, moderne, meget let at afkode. Off-white baggrund, hvide kort, mørk
tekst, én accentfarve, grøn = positiv, orange = opmærksomhed, rød = reel risiko.
Store tal, meget whitespace, korte forklaringer, få farver, klare call to actions.
Undgå: store tabeller på forsiden, mange grafer, pie charts, gauges, tekniske feltnavne.
