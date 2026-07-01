"""Bygger ny board-PPT baseret på originalen — med opdaterede tal fra dashboardet.

Originalt design bevares:
- Top banner-billede (PNG fra original)
- Fonte: Montserrat ExtraBold (titler), Montserrat Light (body), Assistant Light (accent)
- Brand-farver: #3A3755 (lilla), #33FF89 (grøn)
- Slide-størrelse: 13.33 x 7.5 inches (16:9)

Indhold bygges fra dashboardets verificerede data:
- ARR 866k · NRR 165% · GRR 94% · brug +91% YoY
- 2026 target: 2,5M signed kontrakter inden 31.12.26
- Komponenter pr. driver med beløb
- Monthly activities H2 baseret på Mads' faktiske plan
- 3-scenarie trajectory 2027-2029
- Risiko + antagelser
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from lxml import etree
import os

# Brand-tokens fra original
COLOR_PURPLE = RGBColor(0x3A, 0x37, 0x55)  # primary brand
COLOR_GREEN = RGBColor(0x33, 0xFF, 0x89)   # accent
COLOR_WHITE = RGBColor(0xFF, 0xFF, 0xFF)
COLOR_GREY = RGBColor(0x7A, 0x77, 0x90)    # muted
COLOR_LIGHT_BG = RGBColor(0xF5, 0xF5, 0xF8)
COLOR_RISK = RGBColor(0xC8, 0x50, 0x32)    # warning orange

FONT_TITLE = "Montserrat ExtraBold"
FONT_BODY = "Montserrat Light"
FONT_ACCENT = "Assistant Light"

# Banner-billede fra originalen
BANNER_IMG = ".context/findings/ppt_assets/slide1_img1.png"

# Output
OUT_PATH = ".context/findings/Board_Update_H2_2026.pptx"

# === Bygger presentationen ===
prs = Presentation()
prs.slide_width = Inches(13.33)
prs.slide_height = Inches(7.5)

BLANK_LAYOUT = prs.slide_layouts[6]  # blank


# === Helpers ===
def add_text(slide, text, left, top, width, height, font=FONT_BODY, size=14,
             bold=False, color=COLOR_PURPLE, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.05)
    tf.margin_right = Inches(0.05)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)
    tf.vertical_anchor = anchor
    p = tf.paragraphs[0]
    p.alignment = align
    r = p.add_run()
    r.text = text
    r.font.name = font
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.color.rgb = color
    return tb


def add_multiline(slide, lines, left, top, width, height, font=FONT_BODY, size=12,
                  bold=False, color=COLOR_PURPLE, line_spacing=1.15):
    """lines: list of strings or list of (text, dict) tuples for per-line formatting."""
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.05)
    tf.margin_right = Inches(0.05)
    tf.margin_top = Inches(0.02)
    for i, line in enumerate(lines):
        opts = {}
        if isinstance(line, tuple):
            text, opts = line
        else:
            text = line
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.line_spacing = line_spacing
        r = p.add_run()
        r.text = text
        r.font.name = opts.get("font", font)
        r.font.size = Pt(opts.get("size", size))
        r.font.bold = opts.get("bold", bold)
        r.font.color.rgb = opts.get("color", color)
    return tb


def add_banner(slide):
    """Adds the top banner image as original."""
    if os.path.exists(BANNER_IMG):
        slide.shapes.add_picture(BANNER_IMG, Inches(-0.5), Inches(-1.9),
                                  Inches(8.5), Inches(1.2))


def add_header(slide, section_num, section_title, show_banner=True):
    """Adds standard slide header with section number, title, top-right 'BUDGET ALIGNMENT'."""
    if show_banner:
        add_banner(slide)
    # Top-right 'BUDGET ALIGNMENT' accent
    add_text(slide, "BUDGET ALIGNMENT", 4.8, 0.3, 3.8, 0.3,
             font=FONT_ACCENT, size=11, bold=False, color=COLOR_GREEN)
    # 'x' decoration
    add_text(slide, "×", 0.9, 1.4, 3.6, 0.3,
             font=FONT_ACCENT, size=14, bold=True, color=COLOR_PURPLE)
    # Section number
    add_text(slide, section_num, 0.5, 0.9, 2.0, 0.8,
             font=FONT_TITLE, size=42, bold=True, color=COLOR_PURPLE)
    # Section title
    add_text(slide, section_title, 3.0, 0.9, 9.0, 0.8,
             font=FONT_TITLE, size=32, bold=True, color=COLOR_PURPLE)


def add_footer(slide):
    """Adds the standard footer 'CREDIWIRE BUDGET ALIGNMENT COMMERCIAL'."""
    add_multiline(slide, [
        "CREDIWIRE",
        "BUDGET ALIGNMENT",
        "COMMERCIAL",
    ], 0.3, 6.7, 1.7, 0.6, font=FONT_BODY, size=8, color=COLOR_PURPLE, line_spacing=1.0)


def add_card(slide, left, top, width, height, fill=COLOR_WHITE, border=COLOR_PURPLE, border_width=0.5):
    """Adds a rounded rectangle card."""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                    Inches(left), Inches(top), Inches(width), Inches(height))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.color.rgb = border
    shape.line.width = Pt(border_width)
    shape.shadow.inherit = False
    # Round the corner slightly
    shape.adjustments[0] = 0.05
    return shape


# === SLIDE 1: TITLE ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_banner(slide)
# 'MID-YEAR REVIEW' label
add_text(slide, "MID-YEAR REVIEW", 1.0, 1.9, 4.0, 0.9,
         font=FONT_TITLE, size=22, bold=True, color=COLOR_PURPLE)
# 'x' decoration
add_text(slide, "×", 0.9, 1.4, 3.6, 0.3,
         font=FONT_ACCENT, size=18, bold=True, color=COLOR_PURPLE)
# Top-right 'BUDGET ALIGNMENT'
add_text(slide, "BUDGET ALIGNMENT", 4.8, 0.3, 3.8, 0.3,
         font=FONT_ACCENT, size=11, bold=False, color=COLOR_GREEN)
# Large title
add_text(slide, "BUDGET ALIGNMENT", 1.7, 3.3, 11.0, 0.9,
         font=FONT_TITLE, size=60, bold=True, color=COLOR_PURPLE)
add_text(slide, "H2 2026", 1.7, 4.4, 11.0, 0.9,
         font=FONT_TITLE, size=36, bold=True, color=COLOR_GREEN)
# Footer
add_footer(slide)
# Right-side date
add_text(slide, "Juni 2026", 11.0, 4.5, 2.0, 0.4,
         font=FONT_BODY, size=14, color=COLOR_PURPLE)


# === SLIDE 2: TOC ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_banner(slide)
add_text(slide, "BUDGET ALIGNMENT", 4.8, 0.3, 3.8, 0.3,
         font=FONT_ACCENT, size=11, bold=False, color=COLOR_GREEN)
add_text(slide, "×", 0.9, 1.4, 3.6, 0.3,
         font=FONT_ACCENT, size=14, bold=True, color=COLOR_PURPLE)
add_text(slide, "OVERSIGT", 1.0, 1.9, 6.0, 0.7,
         font=FONT_TITLE, size=28, bold=True, color=COLOR_PURPLE)

toc_nums = ["01", "02", "03", "04", "05", "06", "07", "08"]
toc_titles = [
    "H1 2026 — RESULTATER",
    "STATUS — HVOR VI ER",
    "H2 2026 — TARGET 2,5M SIGNED",
    "KEY EXPAND OVERVIEW",
    "ANNUAL REPORTS LAUNCH",
    "MONTHLY ACTIVITIES H2",
    "2027-2029 TRAJECTORY",
    "RISIKO + ANTAGELSER",
]
for i, (n, t) in enumerate(zip(toc_nums, toc_titles)):
    y = 2.9 + i * 0.45
    add_text(slide, n, 0.6, y, 1.5, 0.4,
             font=FONT_TITLE, size=18, bold=True, color=COLOR_PURPLE)
    add_text(slide, t, 2.3, y, 9.5, 0.4,
             font=FONT_BODY, size=16, color=COLOR_PURPLE)

add_footer(slide)


# === SLIDE 3: H1 2026 RESULTATER ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_header(slide, "01", "H1 2026 — RESULTATER")
add_text(slide, "Vores stærkeste H1 nogensinde — top-decile på alle SaaS-metrics.",
         3.0, 1.9, 9.0, 0.5, font=FONT_BODY, size=14, color=COLOR_PURPLE)

# KPI grid (4 cards top row + 2 below)
kpis_top = [
    ("ARR", "866k", "+132% siden 2024-lavpunkt"),
    ("NRR", "165%", "World-class · Snowflake-niveau"),
    ("GRR", "94%", "Top-quartile retention"),
    ("BRUG YoY", "+91%", "Dataanalyser YTD"),
]
for i, (label, value, sub) in enumerate(kpis_top):
    x = 0.5 + i * 3.15
    add_card(slide, x, 2.7, 3.0, 1.5, fill=COLOR_LIGHT_BG, border=COLOR_PURPLE)
    add_text(slide, label, x + 0.15, 2.8, 2.8, 0.3,
             font=FONT_ACCENT, size=10, bold=True, color=COLOR_GREY)
    add_text(slide, value, x + 0.15, 3.1, 2.8, 0.6,
             font=FONT_TITLE, size=28, bold=True, color=COLOR_PURPLE)
    add_text(slide, sub, x + 0.15, 3.75, 2.8, 0.4,
             font=FONT_BODY, size=9, color=COLOR_GREY)

# Bottom highlight
add_card(slide, 0.5, 4.5, 12.3, 1.8, fill=COLOR_PURPLE, border=COLOR_PURPLE)
add_text(slide, "DET HER ER SKET MED 1 PERSON I DEN KOMMERCIELLE AFDELING",
         0.8, 4.65, 11.7, 0.4,
         font=FONT_ACCENT, size=11, bold=True, color=COLOR_GREEN)
add_multiline(slide, [
    ("866k ARR pr. kommerciel FTE — 20x stigning siden 2022",
     {"font": FONT_TITLE, "size": 22, "color": COLOR_WHITE, "bold": True}),
    ("14 ansatte i 2022 · 2 i 2025 · solo siden sep 2025",
     {"font": FONT_BODY, "size": 13, "color": COLOR_WHITE}),
    ("Burn rate er faldet markant mens ARR og retention er vokset",
     {"font": FONT_BODY, "size": 13, "color": COLOR_WHITE}),
], 0.8, 5.05, 11.7, 1.2)

# Engagement context
add_text(slide,
         "7.085 akkumulerede dataanalyser kørt (+1.281% siden 2024) · 393 nye SMVs YTD (15,7/uge)",
         0.5, 6.5, 12.3, 0.4, font=FONT_BODY, size=11, color=COLOR_GREY, align=PP_ALIGN.CENTER)

add_footer(slide)


# === SLIDE 4: STATUS — HVOR VI ER ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_header(slide, "02", "STATUS — HVOR VI ER")
add_text(slide, "Vendepunktet er reelt. Recovery fra 2024-lavpunkt med top-decile vækst på alle metrics.",
         3.0, 1.9, 9.0, 0.5, font=FONT_BODY, size=13, color=COLOR_PURPLE)

# Three story cards: Where we were → are → going
stories = [
    ("HVOR VI VAR (2024)", "373k ARR", [
        "12 AOs aktive",
        "Post-2023 dip",
        "Strategi-skifte sat i værk",
        "Relationship selling som GTM",
    ]),
    ("HVOR VI ER (juni 2026)", "866k ARR", [
        "18 betalende AOs (14 healthy)",
        "NRR 165% · GRR 94%",
        "+91% engagement YoY",
        "1 person leverer 866k",
        "Annual Reports launch H2",
    ]),
    ("HVOR VI SKAL HEN (2029)", "7-9M ARR", [
        "~36 AOs · 7.000+ SMVs",
        "8-10x dagens ARR",
        "CAGR 60%+ (top-decile)",
        "Annual Reports + Assistance",
        "Beierholm-aftalen som whale",
    ]),
]
for i, (header, big, bullets) in enumerate(stories):
    x = 0.5 + i * 4.2
    is_now = (i == 1)
    fill = COLOR_PURPLE if is_now else COLOR_WHITE
    txt_color = COLOR_WHITE if is_now else COLOR_PURPLE
    sub_color = COLOR_GREEN if is_now else COLOR_GREY
    add_card(slide, x, 2.7, 4.0, 4.0, fill=fill, border=COLOR_PURPLE)
    add_text(slide, header, x + 0.2, 2.85, 3.7, 0.3,
             font=FONT_ACCENT, size=10, bold=True, color=sub_color)
    add_text(slide, big, x + 0.2, 3.15, 3.7, 0.6,
             font=FONT_TITLE, size=24, bold=True, color=txt_color)
    add_multiline(slide, [f"• {b}" for b in bullets],
                  x + 0.2, 3.85, 3.7, 2.7,
                  font=FONT_BODY, size=11, color=txt_color, line_spacing=1.4)

# Top expand-fortælling at bottom
add_text(slide,
         "TOP EXPAND 2025 → 2026: GT 170k → 381k (+124%) · Powered-By 20k → 109k (+445%) · Skov 26k → 62k (+140%)",
         0.5, 6.85, 12.3, 0.4, font=FONT_BODY, size=10, color=COLOR_GREY, align=PP_ALIGN.CENTER)

add_footer(slide)


# === SLIDE 5: H2 2026 TARGET 2.5M ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_header(slide, "03", "H2 2026 — TARGET 2,5M")
add_text(slide, "Vi sigter efter 2,5M signed kontrakter inden 31.12.26 — realistisk men ambitiøst. Hver komponent er opnåelig.",
         3.0, 1.9, 9.0, 0.5, font=FONT_BODY, size=13, color=COLOR_PURPLE)

# Big target number
add_card(slide, 0.5, 2.7, 4.0, 1.2, fill=COLOR_PURPLE, border=COLOR_PURPLE)
add_text(slide, "TARGET SIGNED 2026", 0.7, 2.8, 3.7, 0.3,
         font=FONT_ACCENT, size=10, bold=True, color=COLOR_GREEN)
add_text(slide, "2.500.000 DKK", 0.7, 3.1, 3.7, 0.7,
         font=FONT_TITLE, size=28, bold=True, color=COLOR_WHITE)

# Komponent-tabel
add_text(slide, "KOMPONENTER", 5.0, 2.8, 4.0, 0.3,
         font=FONT_ACCENT, size=10, bold=True, color=COLOR_GREY)

components = [
    ("GT slot-expand 740 → 2.000", "+735k", "(25% / 2.842 = +1,2M opside)"),
    ("15 nye AOs signed", "+400k", "8 i Q3 · 7 i Q4 · gns. 25-30k"),
    ("Annual Reports adoption", "+300k", "10 af 14 healthy AOs"),
    ("Mid-market expand", "+250k", "Buus, Edelbo, Revimidt, Kreston"),
    ("Beierholm pilot signed", "+100k", "150-200 SMVs som start"),
    ("Top prospects (5 navne)", "+750k", "Gns. 150k pr. deal"),
]
y_start = 3.2
for i, (name, value, note) in enumerate(components):
    y = y_start + i * 0.55
    add_text(slide, name, 5.0, y, 4.5, 0.4,
             font=FONT_BODY, size=12, bold=True, color=COLOR_PURPLE)
    add_text(slide, value, 9.5, y, 1.5, 0.4,
             font=FONT_TITLE, size=14, bold=True, color=COLOR_GREEN, align=PP_ALIGN.RIGHT)
    add_text(slide, note, 5.0, y + 0.25, 4.5, 0.3,
             font=FONT_BODY, size=9, color=COLOR_GREY)

# Hvad 2,5M signed betyder
add_card(slide, 0.5, 4.1, 4.0, 2.7, fill=COLOR_LIGHT_BG, border=COLOR_PURPLE)
add_text(slide, "HVAD 2,5M SIGNED BETYDER", 0.7, 4.2, 3.7, 0.3,
         font=FONT_ACCENT, size=9, bold=True, color=COLOR_GREY)
add_multiline(slide, [
    ("End-2026 invoiced (P&L):", {"font": FONT_BODY, "size": 11, "color": COLOR_GREY}),
    ("~1,3M", {"font": FONT_TITLE, "size": 18, "color": COLOR_PURPLE, "bold": True}),
    ("Run-rate jan 2027:", {"font": FONT_BODY, "size": 11, "color": COLOR_GREY}),
    ("~3,4M", {"font": FONT_TITLE, "size": 18, "color": COLOR_PURPLE, "bold": True}),
    ("End-2027 ARR:", {"font": FONT_BODY, "size": 11, "color": COLOR_GREY}),
    ("4,0-5,0M", {"font": FONT_TITLE, "size": 18, "color": COLOR_GREEN, "bold": True}),
], 0.7, 4.55, 3.7, 2.0, line_spacing=1.3)

add_footer(slide)


# === SLIDE 6: KEY EXPAND OVERVIEW ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_header(slide, "04", "KEY EXPAND OVERVIEW")
add_text(slide, "Top-kunder med ARR-udvikling 2025 → 2026 + planlagt H2-expand.",
         3.0, 1.9, 9.0, 0.5, font=FONT_BODY, size=13, color=COLOR_PURPLE)

# 6 kunde-kort (2 rows x 3)
key_expand = [
    ("Grant Thornton", "170k", "381k", "+124%", "Target 2026: 1.116k (2.000 slots)", "Aftale sep-okt"),
    ("Powered-By", "20k", "109k", "+445%", "Continued growth via SME-uplift", "Renewal jan"),
    ("Skov Revision", "26k", "62k", "+140%", "Annual Reports launches", "Renewal sep"),
    ("Edelbo", "59k", "59k", "0%", "Mid-market expand target", "AR + slot-uplift"),
    ("Buus Jensen", "13k", "17k", "+31%", "Renewal + AR add-on", "Q3 dialog"),
    ("Kreston CM", "21k", "24k", "+13%", "AR + slot-target +50k", "Q3 dialog"),
]
for i, (name, arr25, arr26, growth, target, status) in enumerate(key_expand):
    row = i // 3
    col = i % 3
    x = 0.4 + col * 4.3
    y = 2.6 + row * 2.2
    add_card(slide, x, y, 4.1, 2.0, fill=COLOR_WHITE, border=COLOR_PURPLE)
    add_text(slide, name, x + 0.2, y + 0.1, 3.7, 0.3,
             font=FONT_TITLE, size=14, bold=True, color=COLOR_PURPLE)
    # ARR-bevægelse
    add_text(slide, f"{arr25}  →  {arr26}", x + 0.2, y + 0.45, 2.5, 0.4,
             font=FONT_TITLE, size=16, bold=True, color=COLOR_PURPLE)
    growth_color = COLOR_GREEN if "+" in growth and growth != "0%" else COLOR_GREY
    add_text(slide, growth, x + 2.7, y + 0.5, 1.3, 0.4,
             font=FONT_TITLE, size=14, bold=True, color=growth_color, align=PP_ALIGN.RIGHT)
    # Target
    add_text(slide, "MÅL H2:", x + 0.2, y + 0.95, 3.7, 0.2,
             font=FONT_ACCENT, size=8, bold=True, color=COLOR_GREY)
    add_text(slide, target, x + 0.2, y + 1.15, 3.7, 0.3,
             font=FONT_BODY, size=10, color=COLOR_PURPLE)
    # Status
    add_text(slide, status, x + 0.2, y + 1.55, 3.7, 0.3,
             font=FONT_ACCENT, size=9, color=COLOR_GREY)

add_footer(slide)


# === SLIDE 7: ANNUAL REPORTS LAUNCH ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_header(slide, "05", "ANNUAL REPORTS LAUNCH")
add_text(slide, "Vores største strategiske bet i H2 2026 — låser nyt segment op for hele kundebasen.",
         3.0, 1.9, 9.0, 0.5, font=FONT_BODY, size=13, color=COLOR_PURPLE)

# Three pillars
pillars = [
    ("LAUNCH-STRATEGI", [
        "Gratis adgang for alle 14 healthy AOs",
        "Lead-magnet for nye prospects",
        "Skov som første case study",
        "Aktiv outreach til hele basen",
        "Personlige onboarding-samtaler",
    ]),
    ("FORVENTET ADOPTION", [
        "10 af 14 healthy AOs ved EOY",
        "Gennemsnit 30k pr. AO",
        "+300k signed kontrakter i 2026",
        "Pris pr. årsrapport: 200 kr",
        "Pris pr. assistance: 200 kr",
    ]),
    ("STRATEGISK BETYDNING", [
        "Låser 4,2M TAM op (24% af mål)",
        "Switching cost stiger markant",
        "GRR-boost (94% → 96%+)",
        "Trigger for 2027 mid-market expand",
        "Beierholm-deal-sweetener",
    ]),
]
for i, (header, bullets) in enumerate(pillars):
    x = 0.5 + i * 4.2
    add_card(slide, x, 2.7, 4.0, 4.0, fill=COLOR_LIGHT_BG, border=COLOR_PURPLE)
    add_text(slide, header, x + 0.2, 2.85, 3.7, 0.3,
             font=FONT_ACCENT, size=10, bold=True, color=COLOR_GREY)
    add_multiline(slide, [f"• {b}" for b in bullets],
                  x + 0.2, 3.2, 3.7, 3.4,
                  font=FONT_BODY, size=12, color=COLOR_PURPLE, line_spacing=1.4)

# Pris-disclaimer
add_text(slide,
         "BEMÆRK: 200 kr er arbejdspris. Prismodellen er ikke endelig — potentielt større upside i 2027.",
         0.5, 6.85, 12.3, 0.4, font=FONT_ACCENT, size=10, color=COLOR_RISK, align=PP_ALIGN.CENTER)

add_footer(slide)


# === SLIDE 8: MONTHLY ACTIVITIES H2 ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_header(slide, "06", "MONTHLY ACTIVITIES H2")
add_text(slide,
         "H2 2026 er Q4-tungt — 70% af signed deals lander okt-dec. Annual Reports launches sep.",
         3.0, 1.9, 9.0, 0.5, font=FONT_BODY, size=13, color=COLOR_PURPLE)

months = [
    ("JULI", "Sommer", [
        "Annual Reports planning",
        "GT-møde inden ferie",
        "Beierholm webinar-forberedelse",
        "Pipeline-pleje",
    ]),
    ("AUGUST", "Welcome back", [
        "GT slot-aftale dialog",
        "Beierholm webinar-serie start",
        "Annual Reports beta med Skov",
        "Mid-market value-review (Q3)",
    ]),
    ("SEPTEMBER", "Launch", [
        "Annual Reports officiel launch",
        "Digitaliseringsdagen revisionsspor",
        "Skov launcher som case",
        "Beierholm pilot-aftale",
        "PoweredBy AI/HI-talk",
    ]),
    ("OKTOBER", "Q4 push", [
        "GT slot-aftale lukket",
        "New AOs: 3-4 signer",
        "Annual Reports adoption +50%",
        "Top prospects (#1-2) lukker",
    ]),
    ("NOVEMBER", "Peak", [
        "New AOs: 3-4 signer",
        "Top prospects (#3-4) lukker",
        "Beierholm pilot live",
        "Mid-market expand realiseret",
    ]),
    ("DECEMBER", "Final push", [
        "New AOs: 1-2 sign'er",
        "Top prospect (#5) lukker",
        "EOY-konsolidering",
        "2027 Q1 pipeline pleje",
    ]),
]
for i, (month, theme, bullets) in enumerate(months):
    row = i // 3
    col = i % 3
    x = 0.4 + col * 4.3
    y = 2.5 + row * 2.3
    add_card(slide, x, y, 4.1, 2.1, fill=COLOR_WHITE, border=COLOR_PURPLE)
    add_text(slide, month, x + 0.2, y + 0.1, 2.0, 0.35,
             font=FONT_TITLE, size=14, bold=True, color=COLOR_PURPLE)
    add_text(slide, theme, x + 2.2, y + 0.15, 1.8, 0.3,
             font=FONT_ACCENT, size=10, bold=True, color=COLOR_GREEN, align=PP_ALIGN.RIGHT)
    add_multiline(slide, [f"• {b}" for b in bullets],
                  x + 0.2, y + 0.55, 3.7, 1.5,
                  font=FONT_BODY, size=10, color=COLOR_PURPLE, line_spacing=1.3)

add_footer(slide)


# === SLIDE 9: 2027-2029 TRAJECTORY ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_header(slide, "07", "2027-2029 TRAJECTORY")
add_text(slide, "Tre scenarier — Base er målet. Conservative som gulv. Stretch hvis alt rammes.",
         3.0, 1.9, 9.0, 0.5, font=FONT_BODY, size=13, color=COLOR_PURPLE)

# Trajectory table
scenarios = [
    ("CONSERVATIVE", "1,5M signed 2026",
     [("End-2026 invoiced", "~1,0M"),
      ("Run-rate jan 2027", "~2,1M"),
      ("End-2027 ARR", "2,8-3,4M"),
      ("End-2028 ARR", "3,4-4,2M"),
      ("End-2029 ARR", "4,2-5,2M")]),
    ("BASE · MÅL", "2,5M signed 2026",
     [("End-2026 invoiced", "~1,3M"),
      ("Run-rate jan 2027", "~3,4M"),
      ("End-2027 ARR", "4,0-5,0M"),
      ("End-2028 ARR", "5,5-7,0M"),
      ("End-2029 ARR", "7,0-9,0M")]),
    ("STRETCH", "3,5M signed 2026",
     [("End-2026 invoiced", "~1,7M"),
      ("Run-rate jan 2027", "~4,4M"),
      ("End-2027 ARR", "5,5-7,0M"),
      ("End-2028 ARR", "7,5-9,5M"),
      ("End-2029 ARR", "10-13M")]),
]
for i, (name, target, rows) in enumerate(scenarios):
    x = 0.4 + i * 4.3
    is_base = (i == 1)
    fill = COLOR_PURPLE if is_base else COLOR_WHITE
    title_color = COLOR_WHITE if is_base else COLOR_PURPLE
    sub_color = COLOR_GREEN if is_base else COLOR_GREY
    val_color = COLOR_WHITE if is_base else COLOR_PURPLE
    add_card(slide, x, 2.6, 4.1, 4.3, fill=fill, border=COLOR_PURPLE)
    add_text(slide, name, x + 0.2, 2.75, 3.7, 0.4,
             font=FONT_TITLE, size=16, bold=True, color=title_color)
    add_text(slide, target, x + 0.2, 3.15, 3.7, 0.3,
             font=FONT_ACCENT, size=10, bold=True, color=sub_color)
    for j, (label, value) in enumerate(rows):
        ry = 3.55 + j * 0.55
        add_text(slide, label, x + 0.2, ry, 2.4, 0.3,
                 font=FONT_BODY, size=10, color=sub_color)
        add_text(slide, value, x + 0.2, ry + 0.2, 3.7, 0.35,
                 font=FONT_TITLE, size=14, bold=True, color=val_color)

add_footer(slide)


# === SLIDE 10: RISIKO + ANTAGELSER ===
slide = prs.slides.add_slide(BLANK_LAYOUT)
add_header(slide, "08", "RISIKO + ANTAGELSER")
add_text(slide, "Vi har en stærk model — men 2,5M-målet hænger på fire variabler.",
         3.0, 1.9, 9.0, 0.5, font=FONT_BODY, size=13, color=COLOR_PURPLE)

risks = [
    ("GT-KONCENTRATION", "44% af ARR",
     "GT er enkelthøjeste eksponering. Hvis aftalen forskydes eller falder, mister vi 700k+. Diversificering bør være prioritet."),
    ("SOLO-KAPACITET", "1 kommerciel FTE",
     "Vi har bevist at solo virker — men ét forskudt stort dealsforsinker andre. Ansættelse af én Mads-type person ville give compound effekt."),
    ("PRISMODEL", "Arbejdspris 200 kr",
     "Pris pr. årsrapport og assistance er ikke endelig. Potentielt 30-50% upside hvis vi rammer rigtigt — men også risiko hvis vi sætter forkert."),
    ("ANNUAL REPORTS", "Launch kritisk",
     "Hele 2027-2028 vækst-trajectory hænger på adoption. Hvis launch forsinkes eller får dårlig modtagelse, falder vi mod Conservative."),
]
for i, (header, label, desc) in enumerate(risks):
    row = i // 2
    col = i % 2
    x = 0.5 + col * 6.3
    y = 2.7 + row * 2.1
    add_card(slide, x, y, 6.1, 1.9, fill=COLOR_LIGHT_BG, border=COLOR_RISK)
    add_text(slide, header, x + 0.2, y + 0.1, 5.7, 0.35,
             font=FONT_ACCENT, size=11, bold=True, color=COLOR_RISK)
    add_text(slide, label, x + 0.2, y + 0.45, 5.7, 0.4,
             font=FONT_TITLE, size=16, bold=True, color=COLOR_PURPLE)
    add_text(slide, desc, x + 0.2, y + 0.95, 5.7, 0.9,
             font=FONT_BODY, size=10, color=COLOR_PURPLE)

add_footer(slide)


# === Save ===
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
prs.save(OUT_PATH)
print(f'✓ Built: {OUT_PATH}')
print(f'  Slides: {len(prs.slides)}')
