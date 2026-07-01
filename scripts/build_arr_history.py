"""Extract per-year ARR totals and per-company-per-year breakdown from 'Data for ARR' sheet."""

import csv
import warnings
from pathlib import Path

import openpyxl

warnings.filterwarnings("ignore")

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / ".context/attachments/LVwRUI/M&O masterark (Oskar Bøndergaards modstridende kopi 2026-03-10).xlsx"
OUT_TOTALS = ROOT / "data/processed/ao_arr_yearly_totals.csv"
OUT_DETAIL = ROOT / "data/processed/ao_arr_yearly_detail.csv"


def main() -> None:
    wb = openpyxl.load_workbook(SRC, data_only=True, read_only=True)
    ws = wb["Data for ARR"]
    rows = list(ws.iter_rows(values_only=True))

    # First pivot: cols 0-7 (name, 2022, 2023, 2024, 2025, 2026, blank, grand_total)
    years = [2022, 2023, 2024, 2025, 2026]
    detail = []
    for r in rows[8:]:
        name = r[0]
        if not name or not isinstance(name, str) or "total" in name.lower():
            continue
        values = {y: float(r[i + 1] or 0) for i, y in enumerate(years)}
        if any(values.values()):
            detail.append({"accounting_office_name": name, **{f"arr_{y}": round(v, 2) for y, v in values.items()}})

    # Year totals (sum from detail)
    totals = {y: 0.0 for y in years}
    for d in detail:
        for y in years:
            totals[y] += d[f"arr_{y}"]
    # Year-over-year growth
    yoy = {}
    for i, y in enumerate(years):
        if i == 0:
            yoy[y] = None
        else:
            prev = totals[years[i - 1]]
            yoy[y] = ((totals[y] - prev) / prev) if prev else None

    # Write totals
    with OUT_TOTALS.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["year", "arr_total", "yoy_growth"])
        for y in years:
            w.writerow([y, round(totals[y], 2), round(yoy[y], 4) if yoy[y] is not None else ""])

    # Write detail
    with OUT_DETAIL.open("w", encoding="utf-8", newline="") as f:
        cols = ["accounting_office_name"] + [f"arr_{y}" for y in years]
        writer = csv.DictWriter(f, fieldnames=cols)
        writer.writeheader()
        for d in sorted(detail, key=lambda x: -x[f"arr_{years[-1]}"]):
            writer.writerow(d)

    print(f"Wrote totals: {OUT_TOTALS.relative_to(ROOT)}")
    for y in years:
        growth = yoy[y]
        g = f"  YoY: {growth * 100:+.1f}%" if growth is not None else ""
        print(f"  {y}: {totals[y]:>12,.0f}{g}")
    print(f"\nWrote detail: {OUT_DETAIL.relative_to(ROOT)} ({len(detail)} companies)")


if __name__ == "__main__":
    main()
