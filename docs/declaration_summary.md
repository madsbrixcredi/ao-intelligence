# Declaration summary

This summary is based on the four declaration Excel files in `data/raw`. The files were read only; the raw Excel files were not modified.

Each workbook contains a filter row, a blank row, and then the real declaration header row. The normalized tables use the row containing `Revisorfirma`, `Revisorfirma cvr`, and `Antal kunder` as the header.

## Normalized tables

| Table | Source file | Header row used | Rows | Output |
| --- | --- | ---: | ---: | --- |
| `audits` | `Revision alle-kopi.xlsx` | 3 | 910 | `data/processed/audits.csv` |
| `reviews` | `Review alle-kopi.xlsx` | 3 | 910 | `data/processed/reviews.csv` |
| `extended_reviews` | `Udvidetgennemgang alle-kopi.xlsx` | 3 | 910 | `data/processed/extended_reviews.csv` |
| `assistance` | `assistancer alle-kopi.xlsx` | 3 | 910 | `data/processed/assistance.csv` |

Each normalized table contains these columns:

- `accounting_office` from `Revisorfirma`
- `accounting_office_cvr` from `Revisorfirma cvr`
- `declaration_count` from `Antal kunder`

## Total accounting offices

- Distinct accounting offices across all four declaration tables: 910
- `audits` rows: 910
- `reviews` rows: 910
- `extended_reviews` rows: 910
- `assistance` rows: 910

## Total declarations by type

| Declaration type | Total declarations |
| --- | ---: |
| Audits | 42,691 |
| Reviews | 1,038 |
| Extended reviews | 62,589 |
| Assistance | 137,947 |
| **All types** | **244,265** |

## Top 50 accounting offices by volume

| Rank | Accounting office | CVR | Audits | Reviews | Extended reviews | Assistance | Total |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | Beierholm | 32895468 | 6,691 | 342 | 9,929 | 17,040 | 34,002 |
| 2 | BDO | 45719375 | 1,310 | 27 | 5,282 | 11,666 | 18,285 |
| 3 | PricewaterhouseCoopers | 33771231 | 5,714 | 11 | 3,856 | 4,543 | 14,124 |
| 4 | Deloitte | 33963556 | 4,578 | 28 | 4,567 | 2,566 | 11,739 |
| 5 | Grant Thornton | 34209936 | 945 | 45 | 4,246 | 6,130 | 11,366 |
| 6 | EY | 30700228 | 4,321 | 30 | 1,802 | 2,173 | 8,326 |
| 7 | Martinsen | 32285201 | 1,187 | 50 | 2,670 | 4,243 | 8,150 |
| 8 | Redmark | 29442789 | 1,356 | 8 | 1,650 | 3,103 | 6,117 |
| 9 | Partner Revision | 15807776 | 893 | 2 | 1,477 | 3,043 | 5,415 |
| 10 | RSM | 25492145 | 605 | 27 | 1,366 | 3,031 | 5,029 |
| 11 | Baker Tilly Denmark | 35257691 | 806 | 6 | 1,164 | 1,813 | 3,789 |
| 12 | Christensen Kjærulff | 15915641 | 701 | 25 | 902 | 1,409 | 3,037 |
| 13 | Inforevision | 19263096 | 1,130 | 16 | 655 | 1,131 | 2,932 |
| 14 | Roesgaard | 37543128 | 860 | 2 | 776 | 1,132 | 2,770 |
| 15 | Revisionshuset Tal & Tanker | 37315664 | 68 | 9 | 512 | 1,150 | 1,739 |
| 16 | Sønderjyllands revision | 18061635 | 298 | 1 | 579 | 683 | 1,561 |
| 17 | Buus Jensen | 16119040 | 513 | 33 | 252 | 699 | 1,497 |
| 18 | Aaen & Co. | 33241763 | 186 | 10 | 292 | 961 | 1,449 |
| 19 | JS Revision, Godkendt Revisionsaktieselskab | 37999687 | 115 | 1 | 240 | 1,049 | 1,405 |
| 20 | Piaster Revisorerne | 25160037 | 219 | 2 | 345 | 782 | 1,348 |
| 21 | Sønderup Godkendt Revisionsaktieselskab | 45907880 | 145 | 13 | 485 | 659 | 1,302 |
| 22 | Kovsted & Skovgård | 38751646 | 88 | 1 | 370 | 791 | 1,250 |
| 23 | Kreston CM | 39463113 | 317 | 4 | 244 | 654 | 1,219 |
| 24 | Baagøe Schou | 21148148 | 380 | 7 | 195 | 601 | 1,183 |
| 25 | Aros | 29690065 | 62 | 0 | 378 | 738 | 1,178 |
| 26 | Crowe | 33256876 | 267 | 12 | 352 | 482 | 1,113 |
| 27 | Albjerg | 35382879 | 347 | 4 | 83 | 646 | 1,080 |
| 28 | Addere Revision | 34589992 | 342 | 5 | 172 | 538 | 1,057 |
| 29 | Revisionsfirmaet Edelbo | 35486178 | 429 | 0 | 145 | 411 | 985 |
| 30 | RéVision+ Statsautoriseret Revisionsanpartsselskab | 41695609 | 24 | 3 | 182 | 724 | 933 |
| 31 | Dansk Revision Odense | 82218912 | 68 | 1 | 322 | 526 | 917 |
| 32 | Krøyer Pedersen Statsautoriserede Revisorer P/S | 45922391 | 176 | 14 | 301 | 386 | 877 |
| 33 | Øernes Revision | 37121924 | 36 | 2 | 148 | 686 | 872 |
| 34 | Revisionscentret Aabenraa | 29695636 | 37 | 0 | 384 | 447 | 868 |
| 35 | KPMG | 25578198 | 501 | 44 | 150 | 144 | 839 |
| 36 | Nærrevision | 17524305 | 69 | 1 | 149 | 607 | 826 |
| 37 | Dansk Revision Slagelse | 29919801 | 38 | 3 | 241 | 540 | 822 |
| 38 | Ullits & Winther | 32093272 | 151 | 1 | 242 | 415 | 809 |
| 39 | Dansk Revision Søborg | 14649905 | 108 | 1 | 153 | 540 | 802 |
| 40 | Kvalitetsrevision | 36480254 | 26 | 0 | 204 | 553 | 783 |
| 41 | Dansk Revision Holbæk | 28853343 | 101 | 2 | 190 | 481 | 774 |
| 42 | Blicher Revision & Rådgivning | 78337818 | 139 | 9 | 137 | 467 | 752 |
| 43 | Revision Ry & Hammel | 26267439 | 56 | 0 | 100 | 577 | 733 |
| 44 | Revision Sjælland | 28309791 | 53 | 2 | 126 | 540 | 721 |
| 45 | Kallermann Revision | 30195264 | 282 | 0 | 63 | 375 | 720 |
| 46 | PKF Munkebo Vindelev | 14119299 | 495 | 2 | 38 | 181 | 716 |
| 47 | Harboe Consult | 35649417 | 54 | 0 | 89 | 554 | 697 |
| 48 | VH Revision | 17871080 | 24 | 0 | 220 | 419 | 663 |
| 49 | Rådgivning & Revision | 10158117 | 217 | 2 | 13 | 425 | 657 |
| 50 | Søby Revisorer | 19125742 | 28 | 0 | 155 | 455 | 638 |

## Example rows

### `audits`

| accounting_office | accounting_office_cvr | declaration_count |
| --- | --- | ---: |
| 2+ Revision | 39701863 | 49 |
| 2+ Revision Grønland Statsautoriserede Revisorer ApS | 42793744 | 3 |
| 2A Revision | 37903949 | 0 |
| 2TalRevision | 29091331 | 17 |
| 2TalRevision v/Jan Christensen | 20935790 | 0 |

### `reviews`

| accounting_office | accounting_office_cvr | declaration_count |
| --- | --- | ---: |
| 2+ Revision | 39701863 | 0 |
| 2+ Revision Grønland Statsautoriserede Revisorer ApS | 42793744 | 0 |
| 2A Revision | 37903949 | 0 |
| 2TalRevision | 29091331 | 0 |
| 2TalRevision v/Jan Christensen | 20935790 | 0 |

### `extended_reviews`

| accounting_office | accounting_office_cvr | declaration_count |
| --- | --- | ---: |
| 2+ Revision | 39701863 | 141 |
| 2+ Revision Grønland Statsautoriserede Revisorer ApS | 42793744 | 16 |
| 2A Revision | 37903949 | 0 |
| 2TalRevision | 29091331 | 52 |
| 2TalRevision v/Jan Christensen | 20935790 | 19 |

### `assistance`

| accounting_office | accounting_office_cvr | declaration_count |
| --- | --- | ---: |
| 2+ Revision | 39701863 | 152 |
| 2+ Revision Grønland Statsautoriserede Revisorer ApS | 42793744 | 37 |
| 2A Revision | 37903949 | 116 |
| 2TalRevision | 29091331 | 220 |
| 2TalRevision v/Jan Christensen | 20935790 | 39 |
