# Dashboard V3 final refinements

## Chart axis logic

Trendgraferne viser kun afsluttede måneder. Den aktuelle delmåned er udeladt.

X-aksen bruger forkortede danske månedsetiketter med årstal, for eksempel `Jan 25`, `Apr 25`, `Jul 25` og `Okt 25`.

Som standard vises kvartalsmarkører på aksen. Første og sidste tilgængelige måned vises også, så brugeren kan se hele periodens start og slut. Alle måneder tvinges ikke ind på aksen, da det gør grafen sværere at læse. Hvis der kun er få måneder i den valgte visning, kan alle måneder vises.

Etiketterne vises vandret, når der er plads. Hvis aksen bliver tæt, roteres etiketterne maksimalt 25 grader.

Hover viser altid den fulde måned, årstal og metrikkens værdi, for eksempel:

```text
April 2026
Dataanalyser: 347
```

## AO search behavior

Dropdown-listen er erstattet af en søgbar revisionshusvælger.

Brugeren kan søge på:

- revisionshusets navn
- revisionshusets CVR-nummer

`Alle revisionshuse` er stadig en valgmulighed og viser det samlede dashboard. Når et revisionshus vælges, opdateres alle KPI'er, trendkort, grafer, tabeller og ROI-beregninger ud fra samme `selectedCvr`-filter som tidligere.

Søgningen kører lokalt i browseren på de indlæste data fra `ao_master.csv`. Den ændrer ikke data og opretter ikke nye mappings.

## PDF export behavior

Knappen `Eksportér til PDF` bruger browserens printfunktion via `window.print()`.

Print/PDF-eksporten bruger den aktuelle dashboardtilstand:

- valgt revisionshus eller `Alle revisionshuse`
- aktuelle ROI-forudsætninger
- kvalitetsfaktor til/fra
- rapportering og rådgivning til/fra
- valgt trendtilstand, YTD eller MoM
- aktuelt viste tabeller og grafer

Før printdialogen åbnes, sættes dokumenttitlen til:

```text
Crediwire Intelligence - [valgt revisionshus] - [dato]
```

Dette giver i de fleste browsere et PDF-navn som eksempelvis:

```text
Crediwire Intelligence - Alle revisionshuse - 2026-06-10.pdf
```

## Technical limitations

Filnavnet kan ikke garanteres fuldt ud fra JavaScript, fordi browserens printdialog styrer den endelige `Gem som PDF`-oplevelse.

PDF-eksporten er en printvenlig version af den aktuelle side, ikke en server-genereret rapport. Det betyder, at eksporten afspejler præcis den dashboardtilstand, brugeren ser, men sidebrud og endelig skalering kan variere lidt mellem browsere.
