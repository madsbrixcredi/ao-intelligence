"""Convert "Årshjul AO" sheet from M&O masterark into ao_arr_yearwheel.csv."""

import csv
import re
import warnings
from pathlib import Path

import openpyxl

warnings.filterwarnings("ignore")

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / ".context/attachments/LVwRUI/M&O masterark (Oskar Bøndergaards modstridende kopi 2026-03-10).xlsx"
TAXONOMY = ROOT / "data/processed/accounting_office_taxonomy.csv"
MASTER = ROOT / "data/processed/ao_master.csv"
OUT = ROOT / "data/processed/ao_arr_yearwheel.csv"

# Manual CVR overrides for names not in taxonomy
MANUAL_CVR = {
    "revimidt godkendt revisionsaktieselskab": "34480370",
    "e-conomia consulting aps": "44268965",
    "erhvervshus midtjylland s i": "40084606",
    "beierholm statsautoriseret revisionspartnerselskab": "32895468",
    "regnskabshuset com": "18067676",
    "stoisk": "28919719",
    "taleco aps": "30525035",
    "skov revision registreret revisionsanpartsselskab": "27525989",
    "dansk revision århus godkendt revisionsaktieselskab": "26717671",
    "revision ry hammel godkendt revisionsaktieselskab": "26267439",
    "admin4you": "_admin4you",
    "cloud controlling aps": "_cloudcontrolling",
}

# Manuel status-override (M&O-arkets status er ikke altid opdateret).
# A = aktiv, O = opsagt, C = churn risk
STATUS_OVERRIDE = {
    "ellebæk revision godkendt revisionsanpartsselskab": "A",
    "baagøe schou statsautoriseret revisionsaktieselskab": "O",
    "lokal revision - statsautoriseret revisionsanpartsselskab": "O",
    "regnskabshuset com": "O",
    "revision ry hammel godkendt revisionsaktieselskab": "O",
    "stoisk": "O",
    "taleco aps": "O",
    "admin4you": "C",
    "cloud controlling aps": "C",
    "e-conomia consulting aps": "C",
    "erhvervshus midtjylland s i": "C",
}


def norm(s: str) -> str:
    s = (s or "").lower().strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"[,\.&/]+", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def main() -> None:
    # Build name → cvr lookup
    name_to_cvr: dict[str, str] = {}
    with TAXONOMY.open(encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name_to_cvr[norm(row["canonical_accounting_office_name"])] = row["accounting_office_cvr"]
            name_to_cvr[norm(row["alias_name"])] = row["accounting_office_cvr"]
    with MASTER.open(encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name_to_cvr.setdefault(norm(row["accounting_office_name"]), row["accounting_office_cvr"])

    wb = openpyxl.load_workbook(SRC, data_only=True, read_only=True)
    ws = wb["Årshjul AO"]
    rows = list(ws.iter_rows(values_only=True))
    months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
    out_rows = []
    for r in rows[1:]:
        if not r[0]:
            continue
        name = str(r[0]).strip()
        nn = norm(name)
        # Manuel override har forrang over status i selve arket
        status = STATUS_OVERRIDE.get(nn) or (r[14] if r[14] in ("A", "O") else None)
        if status not in ("A", "O", "C"):
            continue
        cvr = MANUAL_CVR.get(nn) or name_to_cvr.get(nn) or ""
        monthly = [float(r[i + 1] or 0) for i in range(12)]
        arr_total = float(r[13] or 0)
        # Halvår-splits
        h1 = sum(monthly[:6])
        h2 = sum(monthly[6:])
        record = {
            "accounting_office_name": name,
            "accounting_office_cvr": cvr,
            "status": status,
            "arr_total": round(arr_total, 2),
            "arr_h1": round(h1, 2),
            "arr_h2": round(h2, 2),
            "smes_invoiced": r[15] or "",
            "invoice_month": r[16] or "",
            "notes": (str(r[17])[:200] if r[17] else ""),
        }
        for i, m in enumerate(months):
            record[f"arr_{m}"] = round(monthly[i], 2)
        out_rows.append(record)

    if not out_rows:
        raise SystemExit("no rows extracted")

    fieldnames = list(out_rows[0].keys())
    with OUT.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in out_rows:
            writer.writerow(row)

    print(f"Wrote {len(out_rows)} rows to {OUT.relative_to(ROOT)}")
    unmatched = [r for r in out_rows if not r["accounting_office_cvr"] or r["accounting_office_cvr"].startswith("_")]
    if unmatched:
        print(f"  {len(unmatched)} synthetic/unmatched CVRs:")
        for r in unmatched:
            print(f"    - {r['accounting_office_name']} → {r['accounting_office_cvr']}")
    total_arr = sum(r["arr_total"] for r in out_rows)
    h1_arr = sum(r["arr_h1"] for r in out_rows)
    h2_arr = sum(r["arr_h2"] for r in out_rows)
    print(f"  Total ARR: {total_arr:,.0f} kr.  (H1: {h1_arr:,.0f}  H2: {h2_arr:,.0f})")


if __name__ == "__main__":
    main()
