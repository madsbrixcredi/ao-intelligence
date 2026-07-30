/* ==========================================================================
   Crediwire Management Dashboard
   Målgruppe: beslutningstager hos et revisionshus.

   Princip 1: Intet tal opdigtes. Findes datagrundlaget ikke, står der
              "ikke tilgængelig" med en forklaring.
   Princip 2: Målte tal og antagelser holdes visuelt adskilt.
   Princip 3: Nettoværdi vægter mere end ROI, fordi ROI er skala-uafhængig.
   ========================================================================== */

const DATA_PATH = "../data/processed/";

const FILES = {
  aoMaster: "ao_master.csv",
  connections: "ao_connections_current.csv",
  monthly: "monthly_activity.csv",
  risk: "implementation_risk.csv",
  users: "user_master.csv",
  declClass: "ao_declaration_class.csv",
  auditors: "ao_auditor_coverage.csv",
};

const MIN_PRICE = 1226;

const state = {
  data: {},
  cvr: "34209936", // Grant Thornton som udgangspunkt
  view: "overview",
  openHelp: new Set(),
};

/* ---------- formatering ---------- */
const nf = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("da-DK", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const n0 = (v) => nf.format(Math.round(v || 0));
const kr = (v) => `${n0(v)} kr.`;
const mio = (v) => `${nf1.format((v || 0) / 1e6)} mio. kr.`;
const pct1 = (v) => `${nf1.format((v || 0) * 100)}%`;
const pct0 = (v) => `${n0((v || 0) * 100)}%`;
const x1 = (v) => `${nf1.format(v || 0)}x`;

/** Store beløb i mio., små i hele kroner. */
const money = (v) => (Math.abs(v || 0) >= 1e6 ? mio(v) : kr(v));

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- CSV ---------- */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { value += '"'; i += 1; } else { quoted = false; }
      } else { value += ch; }
      continue;
    }
    if (ch === '"') { quoted = true; continue; }
    if (ch === ",") { row.push(value); value = ""; continue; }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(value); value = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
      continue;
    }
    value += ch;
  }
  if (value !== "" || row.length) { row.push(value); if (row.some((c) => c !== "")) rows.push(row); }

  const headers = rows.shift() || [];
  return rows.map((cells) => Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""])));
}

async function loadCsv(file) {
  const res = await fetch(`${DATA_PATH}${file}`);
  if (!res.ok) throw new Error(`Kunne ikke læse ${file}`);
  return parseCsv(await res.text());
}

const num = (v) => { const p = Number(v); return Number.isFinite(p) ? p : 0; };
const cvrOf = (r) => String(r.accounting_office_cvr || "").trim();

/* ==========================================================================
   BEREGNINGER · hver med ét ansvar og et navn der siger hvad den gør
   ========================================================================== */

/** Aktiveringsgrad: hvor stor en del af det købte er taget i brug. */
const activationRate = (active, purchased) => (purchased > 0 ? active / purchased : null);

/** Markedsdækning: hvor stor en del af husets erklæringer der kører på Crediwire. */
const marketCoverage = (active, declarations) => (declarations > 0 ? active / declarations : null);

/** Værdi pr. virksomhed ud fra antagelserne om tid, timepris og kvalitet. */
const valuePerCompany = (hours, rate, quality) => hours * rate * quality;

/** Mål i antal virksomheder ved en given andel af erklæringerne. */
const targetCompanies = (declarations, targetPct) => Math.round(declarations * targetPct);

/** Virksomheder der mangler at blive aktiveret. Kan ikke være negativ. */
const additionalCompanies = (target, active) => Math.max(0, target - active);

/** Nettoværdi. */
const netValue = (created, investment) => created - investment;

/** ROI. Null ved investering på nul, så vi ikke dividerer med nul. */
const roi = (created, investment) => (investment > 0 ? created / investment : null);

/** Andel af analyser udført af de tre mest aktive brugere. */
const topThreeShare = (row) => (row ? num(row.top_3_user_share) : null);

/**
 * Aktivitet år mod år for samme afsluttede måneder.
 * Den seneste måned i datasættet betragtes som ufuldstændig og udelades,
 * fordi revisorernes aktivitet er stærkt sæsonbetonet og en delvis måned
 * ellers ville ligne tilbagegang.
 */
function activityYoY(rows) {
  if (!rows.length) return null;
  const years = [...new Set(rows.map((r) => num(r.year)))].sort((a, b) => b - a);
  const current = years[0];
  const prev = current - 1;

  const monthsThisYear = rows.filter((r) => num(r.year) === current).map((r) => num(r.month)).sort((a, b) => a - b);
  if (!monthsThisYear.length) return null;

  const partial = Math.max(...monthsThisYear);
  const completed = monthsThisYear.filter((m) => m < partial);
  if (!completed.length) return null;

  const sumFor = (year) =>
    rows
      .filter((r) => num(r.year) === year && completed.includes(num(r.month)))
      .reduce((s, r) => s + num(r.analyses), 0);

  const now = sumFor(current);
  const before = sumFor(prev);

  return {
    currentYear: current,
    previousYear: prev,
    monthFrom: Math.min(...completed),
    monthTo: Math.max(...completed),
    current: now,
    previous: before,
    change: before > 0 ? now / before - 1 : null,
    excludedMonth: partial,
  };
}

const MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];

/* ==========================================================================
   SAMLET METRIK-OBJEKT for det valgte hus
   ========================================================================== */
function buildMetrics() {
  const c = state.cvr;
  const d = state.data;

  const master = d.aoMaster.find((r) => cvrOf(r) === c) || null;
  const conn = d.connections.find((r) => cvrOf(r) === c) || null;
  const riskRow = d.risk.find((r) => cvrOf(r) === c) || null;
  const cls = d.declClass.find((r) => cvrOf(r) === c) || null;
  const monthly = d.monthly.filter((r) => cvrOf(r) === c);
  const users = d.users.filter((r) => cvrOf(r) === c);
  const auditors = d.auditors.filter((r) => cvrOf(r) === c);

  const name = master?.accounting_office_name || conn?.accounting_office_name || "Ukendt revisionshus";

  // Målte tal
  const active = conn ? num(conn.active_erp_connections) : 0;
  const purchased = conn ? num(conn.purchased_companies) : 0;
  const hasAgreement = Boolean(conn);
  const declarations = master ? num(master.total_declarations) : 0;
  const analyses = master ? num(master.total_analyses) : 0;
  const activeUsers = master ? num(master.active_users) : 0;
  const analysedCompanies = master ? num(master.distinct_clients_analysed) : 0;
  const latestActivity = master?.latest_activity_date || "";

  const byType = {
    audits: master ? num(master.audits) : 0,
    reviews: master ? num(master.reviews) : 0,
    extended: master ? num(master.extended_reviews) : 0,
    assistance: master ? num(master.assistance) : 0,
  };

  // Antagelser fra brugerens input
  const a = readAssumptions();

  const vpc = valuePerCompany(a.hoursAnalysis, a.hourlyRate, a.quality);
  const target = targetCompanies(declarations, a.targetPct);
  const additional = additionalCompanies(target, active);

  // Tillæg: årsrapport, assistance, rapportering. Regnes kun med ved målet.
  const annualValue = a.countAnnual * a.hoursAnnual * a.hourlyRate * a.quality;
  const assistValue = a.countAssist * a.hoursAssist * a.hourlyRate * a.quality;
  const reportingValue = a.countReporting * a.hoursReporting * a.hourlyRate * a.quality;
  const addonValue = annualValue + assistValue + reportingValue;
  const addonInvestment = a.countAnnual * a.priceAnnual + a.countAssist * a.priceAssist;

  const createdToday = active * vpc;
  const investToday = active * a.pricePerCompany;
  const netToday = netValue(createdToday, investToday);
  const roiToday = roi(createdToday, investToday);

  const createdTarget = target * vpc + addonValue;
  const investTarget = target * a.pricePerCompany + addonInvestment;
  const netTarget = netValue(createdTarget, investTarget);
  const roiTarget = roi(createdTarget, investTarget);

  const unrealizedNet = netTarget - netToday;

  return {
    name, cvr: c, hasAgreement,
    active, purchased, declarations, analyses, activeUsers, analysedCompanies, latestActivity, byType,
    activationRate: activationRate(active, purchased),
    marketCoverage: marketCoverage(active, declarations),
    notActivated: Math.max(0, purchased - active),
    analysesPerCompany: active > 0 ? analyses / active : null,
    yoy: activityYoY(monthly),
    top3: topThreeShare(riskRow),
    riskLabel: riskRow?.implementation_risk || null,
    classB: cls ? num(cls.class_b) : null,
    classBTotal: cls ? num(cls.declarations_2025_2026) : null,
    addressableAnnual: cls ? num(cls.addressable_annual_reports) : null,
    classBAssistance: cls ? num(cls.class_b_assistance) : null,
    classBExtended: cls ? num(cls.class_b_extended_review) : null,
    auditors,
    users,
    a, vpc, target, additional,
    createdToday, investToday, netToday, roiToday,
    createdTarget, investTarget, netTarget, roiTarget,
    unrealizedNet,
    valueSplit: {
      dataanalyse: target * vpc,
      årsrapport: annualValue,
      assistance: assistValue,
      rapportering: reportingValue,
    },
  };
}

function readAssumptions() {
  const v = (id, fallback = 0) => {
    const el = document.getElementById(id);
    if (!el) return fallback;
    const parsed = Number(el.value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const price = Math.max(MIN_PRICE, v("pricePerCompany", MIN_PRICE));
  return {
    targetPct: v("targetPct", 25) / 100,
    hourlyRate: Math.max(0, v("hourlyRate", 1200)),
    hoursAnalysis: Math.max(0, v("hoursAnalysis", 4)),
    quality: Math.max(0, v("qualityFactor", 2)),
    pricePerCompany: price,
    hoursAnnual: Math.max(0, v("hoursAnnual")),
    priceAnnual: Math.max(0, v("priceAnnual")),
    countAnnual: Math.max(0, v("countAnnual")),
    hoursAssist: Math.max(0, v("hoursAssist")),
    priceAssist: Math.max(0, v("priceAssist")),
    countAssist: Math.max(0, v("countAssist")),
    countReporting: Math.max(0, v("countReporting")),
    hoursReporting: Math.max(0, v("hoursReporting")),
  };
}

/* ==========================================================================
   HEALTH · fire sporbare vurderinger, ingen sammensat score
   Der findes kun ét snapshot af aktiverede virksomheder (2026-07-02), så en
   samlet score med årstrend kan ikke beregnes uden at opdigte tal.
   ========================================================================== */
const THRESHOLDS = {
  activation: [[0.9, "excellent", "Excellent"], [0.75, "strong", "Strong"], [0.5, "developing", "Developing"], [0, "attention", "Needs attention"]],
  activity:   [[0.25, "excellent", "Excellent"], [0.05, "strong", "Strong"], [-0.05, "developing", "Developing"], [-Infinity, "attention", "Needs attention"]],
  spread:     [[0, "excellent", "Excellent"]], // håndteres særskilt, lavere er bedre
  coverage:   [[0.25, "excellent", "Excellent"], [0.1, "strong", "Strong"], [0.03, "developing", "Developing"], [0, "attention", "Needs attention"]],
};

/** Returnerer { cls, grade }. Feltet heder bevidst "grade" og ikke "label",
 *  så det ikke overskriver områdets navn når objektet spredes. */
function grade(scale, value) {
  if (value === null || value === undefined) return { cls: "na", grade: "Ikke tilgængelig" };
  for (const [min, cls, label] of THRESHOLDS[scale]) if (value >= min) return { cls, grade: label };
  return { cls: "attention", grade: "Needs attention" };
}

function healthRows(m) {
  const rows = [];

  rows.push({
    label: "Aktivering",
    ...grade("activation", m.activationRate),
    evidence: m.activationRate === null
      ? "Ingen aftale registreret"
      : `${pct1(m.activationRate)} af aftalen i brug · ${n0(m.active)} af ${n0(m.purchased)}`,
  });

  rows.push({
    label: "Aktivitet",
    ...grade("activity", m.yoy?.change ?? null),
    evidence: m.yoy && m.yoy.change !== null
      ? `${m.yoy.change >= 0 ? "+" : ""}${pct0(m.yoy.change)} år mod år · ${MONTHS[m.yoy.monthFrom - 1]} til ${MONTHS[m.yoy.monthTo - 1]}`
      : "For lidt historik til at sammenligne år mod år",
  });

  // Organisatorisk bredde: lavere koncentration er bedre, så skalaen er omvendt.
  let spread = { cls: "na", grade: "Ikke tilgængelig" };
  if (m.top3 !== null) {
    if (m.top3 <= 0.4) spread = { cls: "excellent", grade: "Excellent" };
    else if (m.top3 <= 0.6) spread = { cls: "strong", grade: "Strong" };
    else if (m.top3 <= 0.8) spread = { cls: "developing", grade: "Developing" };
    else spread = { cls: "attention", grade: "Needs attention" };
  }
  rows.push({
    label: "Organisatorisk bredde",
    ...spread,
    evidence: m.top3 === null
      ? "Ingen brugerdata"
      : `De tre mest aktive står for ${pct1(m.top3)} af analyserne${m.riskLabel ? ` · risikoniveau ${m.riskLabel}` : ""}`,
  });

  rows.push({
    label: "Markedsdækning",
    ...grade("coverage", m.marketCoverage),
    evidence: m.marketCoverage === null
      ? "Ingen erklæringsdata"
      : `${pct1(m.marketCoverage)} af ${n0(m.declarations)} erklæringer kører på Crediwire`,
  });

  return rows;
}

/* ==========================================================================
   RENDER
   ========================================================================== */
function render() {
  const m = buildMetrics();

  document.getElementById("firmName").textContent = m.name;
  document.getElementById("firmSub").textContent = m.hasAgreement
    ? `CVR ${m.cvr} · ${n0(m.declarations)} erklæringer · ${n0(m.active)} aktive virksomheder`
    : `CVR ${m.cvr} · ${n0(m.declarations)} erklæringer · ingen Crediwire-aftale endnu`;

  renderHealth(m);
  renderKpis(m);
  renderRecommendation(m);
  renderActivity(m);
  renderFocusPreview(m);
  renderBusinessCase(m);
  renderFocus(m);
  renderDataStatus(m);
}

function renderHealth(m) {
  document.getElementById("healthRows").innerHTML = healthRows(m)
    .map((r) => `<div class="health-row">
      <span>${esc(r.label)}</span>
      <span class="status ${r.cls}">${esc(r.grade)}</span>
      <span class="evidence">${esc(r.evidence)}</span>
    </div>`)
    .join("");

  document.getElementById("healthHelp").innerHTML = `
    <b>Health er fire selvstændige vurderinger, ikke én samlet score.</b><br />
    En samlet score ville kræve historik og et samlet medarbejdertal. Der findes
    kun ét snapshot af aktiverede virksomheder, og vi kender ikke husets samlede
    antal medarbejdere. Derfor vurderes hvert område for sig, og hvert udsagn kan
    spores til et tal i data.
    <table>
      <tr><td>Aktivering · Excellent</td><td>90% eller mere af aftalen i brug</td></tr>
      <tr><td>Aktivitet · Excellent</td><td>Vækst på 25% eller mere år mod år</td></tr>
      <tr><td>Organisatorisk bredde · Excellent</td><td>De tre mest aktive står for 40% eller mindre</td></tr>
      <tr><td>Markedsdækning · Excellent</td><td>25% eller mere af erklæringerne</td></tr>
    </table>`;
}


function renderKpis(m) {
  const cards = [];

  cards.push(`<article class="kpi">
    <span>Nettoværdi skabt <span class="chip chip-assume">Antagelse</span></span>
    <strong>${m.active > 0 ? money(m.netToday) : "Ingen endnu"}</strong>
    <em>${m.active > 0
      ? `${money(m.createdToday)} skabt værdi minus ${money(m.investToday)} investering`
      : "Ingen aktive virksomheder at regne værdi på endnu"}</em>
  </article>`);

  cards.push(`<article class="kpi">
    <span>Uudnyttet nettoværdi <span class="chip chip-assume">Antagelse</span></span>
    <strong>${money(m.unrealizedNet)}</strong>
    <em>Ved ${pct0(m.a.targetPct)} af erklæringerne · kræver ${n0(m.additional)} flere virksomheder</em>
  </article>`);

  const arCls = m.activationRate === null ? "" : ` style="width:${Math.min(100, m.activationRate * 100).toFixed(1)}%"`;
  cards.push(`<article class="kpi">
    <span>Aktivering <span class="chip chip-measured">Målt</span></span>
    <strong>${m.activationRate === null ? "Ingen aftale" : pct1(m.activationRate)}</strong>
    ${m.activationRate === null ? "" : `<div class="bar pos"><i${arCls}></i></div>`}
    <em>${m.activationRate === null
      ? `${n0(m.declarations)} erklæringer om året og ingen aftale endnu`
      : `${n0(m.active)} af ${n0(m.purchased)} virksomheder aktiveret`}</em>
  </article>`);

  const ch = m.yoy?.change;
  cards.push(`<article class="kpi">
    <span>Aktivitet <span class="chip chip-measured">Målt</span></span>
    <strong>${ch === null || ch === undefined ? "Ikke nok historik" : `${ch >= 0 ? "+" : ""}${pct0(ch)}`}</strong>
    <em>${m.yoy ? `${MONTHS[m.yoy.monthFrom - 1]} til ${MONTHS[m.yoy.monthTo - 1]} ${m.yoy.currentYear} mod ${m.yoy.previousYear}` : "Ingen månedsdata"}</em>
  </article>`);

  document.getElementById("kpiRow").innerHTML = cards.join("");
}

function renderRecommendation(m) {
  const el = document.getElementById("recommendation");

  // Regelbaseret. Reglen står i datastatus, så den kan efterprøves.
  let head, body;
  if (!m.hasAgreement) {
    head = "Start med en aftale";
    body = `Huset laver ${n0(m.declarations)} erklæringer om året og har ingen Crediwire-aftale. Ved ${pct0(m.a.targetPct)} dækning svarer det til ${n0(m.target)} virksomheder.`;
  } else if (m.notActivated > 0 && m.notActivated / Math.max(1, m.purchased) > 0.1) {
    head = `Aktivér de ${n0(m.notActivated)} virksomheder der mangler`;
    body = `De er allerede betalt for. Værdien er ${money(m.notActivated * m.vpc)} om året, og det kræver ingen ny aftale`;
  } else {
    head = `Udvid til ${pct0(m.a.targetPct)} af erklæringerne`;
    body = `Det svarer til ${n0(m.target)} virksomheder, altså ${n0(m.additional)} flere end i dag, og øger nettoværdien med ${money(m.unrealizedNet)}`;
  }

  el.innerHTML = `
    <div>
      <p class="eyebrow">Anbefalet næste skridt</p>
      <h3>${esc(head)}</h3>
      <p>${esc(body)}</p>
    </div>
    <button class="btn" data-goto="business">Se business case</button>`;
}

function renderActivity(m) {
  const el = document.getElementById("activityCard");
  if (!m.yoy) {
    el.innerHTML = `<div class="card-head"><h2>Aktivitet</h2></div>
      <p class="muted small">Der er ikke nok månedsdata til at sammenligne år mod år.</p>`;
    return;
  }
  const y = m.yoy;
  const max = Math.max(y.current, y.previous, 1);
  const growing = y.change !== null && y.change >= 0;

  el.innerHTML = `
    <div class="card-head">
      <div>
        <h2>${growing ? "Aktiviteten vokser" : "Aktiviteten falder"}</h2>
        <p class="muted small">${MONTHS[y.monthFrom - 1]} til ${MONTHS[y.monthTo - 1]}</p>
      </div>
      <strong style="font-size:19px">${y.change === null ? "—" : `${growing ? "+" : ""}${pct0(y.change)}`}</strong>
    </div>
    <div class="yoy">
      <div class="yoy-row">
        <div><span class="yr">${y.currentYear}</span><span class="val">${n0(y.current)} analyser</span></div>
        <div class="bar"><i style="width:${(y.current / max * 100).toFixed(1)}%"></i></div>
      </div>
      <div class="yoy-row">
        <div><span class="yr">${y.previousYear}</span><span class="val">${n0(y.previous)} analyser</span></div>
        <div class="bar"><i style="width:${(y.previous / max * 100).toFixed(1)}%;opacity:.45"></i></div>
      </div>
    </div>
    <div class="mini-stats">
      <div><span>Analyser i alt</span><b>${n0(m.analyses)}</b></div>
      <div><span>Aktive revisorer</span><b>${n0(m.activeUsers)}</b></div>
      <div><span>Pr. virksomhed</span><b>${m.analysesPerCompany === null ? "—" : nf1.format(m.analysesPerCompany)}</b></div>
    </div>
    <p class="muted small" style="margin-top:12px">${MONTHS[y.excludedMonth - 1]} er udeladt som ufuldstændig måned. Revisorernes aktivitet er sæsonbetonet, så en delvis måned ville ligne tilbagegang.</p>`;
}

/* ---------- fokuspunkter, delt mellem Overblik og Fokus ---------- */
function focusItems(m) {
  const items = [];

  if (m.notActivated > 0) {
    items.push({
      prio: m.notActivated / Math.max(1, m.purchased) > 0.1 ? "hoj" : "mellem",
      title: `${n0(m.notActivated)} købte virksomheder mangler aktivering`,
      text: "Allerede betalt, men værdien er ikke realiseret.",
      consequence: `${money(m.notActivated * m.vpc)} i årlig værdi ligger stille.`,
      action: "Aktivér dem inden næste fornyelse.",
    });
  }

  if (m.top3 !== null) {
    const high = m.top3 > 0.6;
    items.push({
      prio: high ? "hoj" : "lav",
      title: high ? "For stor afhængighed af få brugere" : "Brugen er rimeligt fordelt",
      text: `De tre mest aktive brugere står for ${pct1(m.top3)} af alle analyser.`,
      consequence: high
        ? "Implementeringen er sårbar ved fravær eller jobskifte."
        : `Vores risikomodel klassificerer koncentrationen som ${m.riskLabel || "lav"}.`,
      action: high ? "Træn flere brugere, så afhængigheden spredes." : "Ingen handling nødvendig nu.",
    });
  }

  if (m.addressableAnnual) {
    items.push({
      prio: "mellem",
      title: "Årsrapportmarkedet er ikke aktiveret",
      text: `${n0(m.addressableAnnual)} klasse B-virksomheder med assistance eller udvidet gennemgang.`,
      consequence: "Markedet for årsrapporter og assistance står uudnyttet.",
      action: "Sæt pris og timebesparelse på årsrapport i business casen.",
    });
  }

  const worst = [...m.auditors].sort((a, b) => num(b.untapped_clients) - num(a.untapped_clients))[0];
  if (worst && num(worst.untapped_clients) > 0) {
    items.push({
      prio: "mellem",
      title: "Store kundeporteføljer med lav dækning",
      text: `${worst.auditor_name} har ${n0(num(worst.clients))} klienter, hvoraf ${n0(num(worst.clients_on_crediwire))} er koblet til Crediwire. Dækning ${pct1(num(worst.coverage_pct))}.`,
      consequence: `${n0(num(worst.untapped_clients))} klienter hos én revisor er uden for platformen.`,
      action: "Prioritér denne revisor til onboarding og træning.",
    });
  }

  if (m.additional > 0) {
    items.push({
      prio: "lav",
      title: `${n0(m.additional)} flere virksomheder for at nå målet`,
      text: `Målet på ${pct0(m.a.targetPct)} svarer til ${n0(m.target)} virksomheder.`,
      consequence: `${money(m.unrealizedNet)} i uudnyttet nettoværdi.`,
      action: "Læg en aktiveringsplan for de kommende 12 måneder.",
    });
  }

  const order = { hoj: 0, mellem: 1, lav: 2 };
  return items.sort((a, b) => order[a.prio] - order[b.prio]);
}

function renderFocusPreview(m) {
  const items = focusItems(m).slice(0, 4);
  document.getElementById("focusPreview").innerHTML = `
    <div class="card-head">
      <div><h2>Ledelsens fokus</h2><p class="muted small">${items.length} konkrete punkter</p></div>
      <button class="link" data-goto="focus">Se alle</button>
    </div>
    ${items.map((i) => `<div class="focus-item">
      <span class="prio ${i.prio}">${i.prio === "hoj" ? "Høj" : i.prio === "mellem" ? "Mellem" : "Lav"}</span>
      <div class="body"><b>${esc(i.title)}</b><span>${esc(i.text)}</span></div>
    </div>`).join("")}`;
}

function renderFocus(m) {
  const items = focusItems(m);
  const count = (p) => items.filter((i) => i.prio === p).length;

  document.getElementById("focusSummary").innerHTML = `
    <article class="kpi"><span>Høj prioritet</span><strong>${count("hoj")}</strong><em>Kræver ledelseshandling</em></article>
    <article class="kpi"><span>Mellem prioritet</span><strong>${count("mellem")}</strong><em>Bør løses i næste periode</em></article>
    <article class="kpi"><span>Punkter i alt</span><strong>${items.length}</strong><em>Alle med sporbart datagrundlag</em></article>`;

  document.getElementById("focusList").innerHTML = items.map((i) => `
    <div class="card risk-card">
      <div class="risk-head">
        <span class="prio ${i.prio}">${i.prio === "hoj" ? "Høj" : i.prio === "mellem" ? "Mellem" : "Lav"}</span>
        <b>${esc(i.title)}</b>
      </div>
      <p>${esc(i.text)}</p>
      <div class="risk-meta">
        <div><span>Konsekvens</span><b>${esc(i.consequence)}</b></div>
        <div><span>Anbefalet handling</span><b>${esc(i.action)}</b></div>
      </div>
    </div>`).join("");
}

function renderBusinessCase(m) {
  document.getElementById("targetPctLabel").textContent = pct0(m.a.targetPct);
  document.getElementById("targetReadout").textContent =
    `${n0(m.target)} virksomheder af ${n0(m.declarations)} erklæringer · ${n0(m.additional)} skal aktiveres`;

  const annualEl = document.getElementById("annualDefault");
  if (annualEl) annualEl.textContent = m.addressableAnnual
    ? `Adresserbart marked: ${n0(m.addressableAnnual)}`
    : "Ingen klasse B-data for dette hus";
  const assistEl = document.getElementById("assistDefault");
  if (assistEl) assistEl.textContent = m.byType.assistance
    ? `Huset laver ${n0(m.byType.assistance)} assistanceerklæringer`
    : "Ingen assistancedata";

  document.getElementById("bcHeadline").innerHTML = `
    <span>Uudnyttet nettoværdi ved ${pct0(m.a.targetPct)} af erklæringerne</span>
    <strong>${money(m.unrealizedNet)}</strong>
    <em>Kræver at ${n0(m.additional)} flere virksomheder aktiveres. Bygger på antagelserne til venstre.</em>`;

  const row = (label, today, target, opts = {}) => {
    const delta = target - today;
    const cls = opts.neutral ? "neu" : delta > 0 ? "pos" : "neu";
    const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
    return `<tr class="${opts.strong ? "strong" : ""}">
      <td>${esc(label)}${opts.why ? `<button class="why" data-open="${opts.why}">hvorfor</button>` : ""}</td>
      <td class="today">${opts.fmt ? opts.fmt(today) : money(today)}</td>
      <td>${opts.fmt ? opts.fmt(target) : money(target)}</td>
      <td class="delta ${cls}">${sign}${opts.fmt ? opts.fmt(Math.abs(delta)) : money(Math.abs(delta))}</td>
    </tr>`;
  };

  document.getElementById("bcCompare").innerHTML = `
    <div class="card-head"><h2>I dag mod målet</h2><span class="muted small">Pr. år</span></div>
    <table class="cmp">
      <thead><tr><th>&nbsp;</th><th>I dag</th><th>Ved ${pct0(m.a.targetPct)}</th><th>Forskel</th></tr></thead>
      <tbody>
        ${row("Aktive virksomheder", m.active, m.target, { fmt: n0 })}
        ${row("Skabt værdi", m.createdToday, m.createdTarget, { why: "whyValue" })}
        ${row("Investering i Crediwire", m.investToday, m.investTarget, { neutral: true, why: "whyInvest" })}
        ${row("Nettoværdi", m.netToday, m.netTarget, { strong: true, why: "whyNet" })}
        <tr>
          <td>Værdi pr. investeret krone</td>
          <td class="today">${m.roiToday === null ? "—" : x1(m.roiToday)}</td>
          <td>${m.roiTarget === null ? "—" : x1(m.roiTarget)}</td>
          <td class="delta neu">—</td>
        </tr>
      </tbody>
    </table>
    <div id="whyValue" class="help" hidden>
      <b>Skabt værdi</b>
      <table>
        <tr><td>Aktive virksomheder</td><td>${n0(m.active)}</td></tr>
        <tr><td>× timer sparet pr. dataanalyse <span class="chip chip-assume">Antagelse</span></td><td>${nf1.format(m.a.hoursAnalysis)}</td></tr>
        <tr><td>× timepris <span class="chip chip-assume">Antagelse</span></td><td>${kr(m.a.hourlyRate)}</td></tr>
        <tr><td>× kvalitetsfaktor <span class="chip chip-assume">Antagelse</span></td><td>${nf1.format(m.a.quality)}</td></tr>
        <tr><td><b>= værdi i dag</b></td><td>${kr(m.createdToday)}</td></tr>
        <tr><td>Ved målet: ${n0(m.target)} virksomheder × ${kr(m.vpc)}</td><td>${kr(m.target * m.vpc)}</td></tr>
        ${m.valueSplit.årsrapport ? `<tr><td>+ årsrapport</td><td>${kr(m.valueSplit.årsrapport)}</td></tr>` : ""}
        ${m.valueSplit.assistance ? `<tr><td>+ assistance</td><td>${kr(m.valueSplit.assistance)}</td></tr>` : ""}
        ${m.valueSplit.rapportering ? `<tr><td>+ rapportering</td><td>${kr(m.valueSplit.rapportering)}</td></tr>` : ""}
        <tr><td><b>= værdi ved målet</b></td><td>${kr(m.createdTarget)}</td></tr>
      </table>
    </div>
    <div id="whyInvest" class="help" hidden>
      <b>Investering</b>
      <table>
        <tr><td>Pris pr. virksomhed pr. år <span class="chip chip-assume">Antagelse</span></td><td>${kr(m.a.pricePerCompany)}</td></tr>
        <tr><td>I dag: ${n0(m.active)} × ${kr(m.a.pricePerCompany)}</td><td>${kr(m.investToday)}</td></tr>
        <tr><td>Ved målet: ${n0(m.target)} × ${kr(m.a.pricePerCompany)}</td><td>${kr(m.target * m.a.pricePerCompany)}</td></tr>
        <tr><td><b>= investering ved målet</b></td><td>${kr(m.investTarget)}</td></tr>
      </table>
    </div>
    <div id="whyNet" class="help" hidden>
      <b>Nettoværdi og hvorfor ROI ikke ændrer sig</b><br />
      Nettoværdi er skabt værdi minus investering.
      <table>
        <tr><td>I dag: ${kr(m.createdToday)} − ${kr(m.investToday)}</td><td>${kr(m.netToday)}</td></tr>
        <tr><td>Ved målet: ${kr(m.createdTarget)} − ${kr(m.investTarget)}</td><td>${kr(m.netTarget)}</td></tr>
        <tr><td><b>= uudnyttet nettoværdi</b></td><td>${kr(m.unrealizedNet)}</td></tr>
      </table>
      Værdi og investering vokser begge lineært med antal virksomheder. Derfor er
      værdien pr. investeret krone den samme i dag og ved målet, med mindre der
      sættes pris på årsrapport eller assistance. Det der vokser er kronerne.
    </div>`;

  const split = Object.entries(m.valueSplit).filter(([, v]) => v > 0);
  const total = split.reduce((s, [, v]) => s + v, 0) || 1;
  document.getElementById("bcBreakdown").innerHTML = `
    <div class="card-head"><h2>Hvor værdien kommer fra</h2><span class="muted small">Ved målet</span></div>
    ${split.map(([k, v]) => `<div class="split-row">
      <div><span class="lbl">${esc(k[0].toUpperCase() + k.slice(1))}</span><span class="amt">${money(v)}</span></div>
      <div class="bar"><i style="width:${(v / total * 100).toFixed(1)}%"></i></div>
    </div>`).join("")}
    ${split.length === 1 ? `<p class="muted small" style="margin-top:10px">Kun dataanalyse er sat. Udfyld årsrapport, assistance eller rapportering i forudsætningerne for at se den fulde fordeling.</p>` : ""}`;
}

function renderDataStatus(m) {
  const conn = state.data.connections.find((r) => cvrOf(r) === m.cvr);
  document.getElementById("dataStatus").innerHTML = `
    <b>Kilder og forbehold</b>
    <table>
      <tr><td>Aktive og købte virksomheder</td><td>${esc(conn?.snapshot_date || "ukendt")}</td></tr>
      <tr><td>Erklæringer, analyser og brugere</td><td>ao_master.csv</td></tr>
      <tr><td>Regnskabsklasse og årsrapportmarked</td><td>Erklæringsregister 2025 til 2026</td></tr>
      <tr><td>Revisordækning</td><td>${n0(m.auditors.length)} revisorer med MNE-nummer</td></tr>
    </table>
    <br />
    <b>Sådan er anbefalingen dannet</b><br />
    Anbefalingen er regelbaseret, ikke genereret af en AI-model. Er mere end 10%
    af de købte virksomheder ikke aktiveret, anbefales aktivering først. Ellers
    anbefales udvidelse til den valgte målsætning.
    <br /><br />
    <b>Kendte begrænsninger</b><br />
    Der findes kun ét snapshot af aktiverede virksomheder, så udvikling i
    aktiveringsgrad kan ikke vises, og afvigelse fra en implementeringsplan kan
    ikke beregnes. Vi kender ikke husets samlede antal medarbejdere, så
    brugerbredde kan ikke opgøres i procent af organisationen.
    Revisordækning beregnes på klient-CVR og ikke på personnavn, fordi
    MNE-nummeret tilhører den underskrivende revisor, mens Crediwire-brugeren
    typisk er medarbejderen der udfører arbejdet.
    ${m.classBTotal && m.declarations
      ? `<br /><br />Erklæringsregistret opgør ${n0(m.classBTotal)} erklæringer for dette hus i 2025 til 2026, mens det samlede grundlag er ${n0(m.declarations)}. Forskellen skyldes forskellige perioder og er ikke fuldt afstemt.`
      : ""}`;
}

/* ==========================================================================
   INTERAKTION
   ========================================================================== */
function showView(id) {
  state.view = id;
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.target === id));
  document.querySelectorAll(".view").forEach((v) => {
    const on = v.id === id;
    v.classList.toggle("active", on);
    v.hidden = !on;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function officeList() {
  const conn = new Map(state.data.connections.map((r) => [cvrOf(r), r]));
  return state.data.aoMaster
    .filter((r) => cvrOf(r) && num(r.total_declarations) > 0)
    .map((r) => ({
      cvr: cvrOf(r),
      name: r.accounting_office_name,
      declarations: num(r.total_declarations),
      hasAgreement: conn.has(cvrOf(r)),
    }))
    .sort((a, b) => Number(b.hasAgreement) - Number(a.hasAgreement) || b.declarations - a.declarations);
}

function wireFirmPicker() {
  const input = document.getElementById("firmSearch");
  const results = document.getElementById("firmResults");
  const all = officeList();

  const show = (q) => {
    const term = q.trim().toLowerCase();
    const hits = (term
      ? all.filter((o) => o.name.toLowerCase().includes(term) || o.cvr.includes(term))
      : all
    ).slice(0, 40);

    results.innerHTML = hits.length
      ? hits.map((o) => `<button data-cvr="${o.cvr}">${esc(o.name)}
          <small>CVR ${o.cvr} · ${n0(o.declarations)} erklæringer${o.hasAgreement ? " · kunde" : ""}</small></button>`).join("")
      : `<button disabled>Ingen match</button>`;
    results.classList.add("open");
  };

  input.addEventListener("focus", () => show(input.value));
  input.addEventListener("input", () => show(input.value));

  results.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cvr]");
    if (!btn) return;
    state.cvr = btn.dataset.cvr;
    input.value = "";
    results.classList.remove("open");
    render();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".firm-picker")) results.classList.remove("open");
  });
}

function wireGlobalClicks() {
  document.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (tab) { showView(tab.dataset.target); return; }

    const goto = e.target.closest("[data-goto]");
    if (goto) { showView(goto.dataset.goto); return; }

    const opener = e.target.closest("[data-open]");
    if (opener) {
      const el = document.getElementById(opener.dataset.open);
      if (el) el.hidden = !el.hidden;
    }
  });
}

function wireInputs() {
  const ids = ["targetPct", "hourlyRate", "hoursAnalysis", "qualityFactor", "pricePerCompany",
    "hoursAnnual", "priceAnnual", "countAnnual", "hoursAssist", "priceAssist", "countAssist",
    "countReporting", "hoursReporting"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", render);
  });
  const price = document.getElementById("pricePerCompany");
  if (price) price.addEventListener("blur", () => {
    if (Number(price.value) < MIN_PRICE) price.value = String(MIN_PRICE);
    render();
  });
}

async function init() {
  try {
    const entries = await Promise.all(
      Object.entries(FILES).map(async ([key, file]) => [key, await loadCsv(file)])
    );
    state.data = Object.fromEntries(entries);

    document.getElementById("loading").hidden = true;
    document.querySelectorAll(".view").forEach((v) => { v.hidden = v.id !== state.view; });

    wireFirmPicker();
    wireGlobalClicks();
    wireInputs();
    render();
  } catch (err) {
    document.getElementById("loading").textContent = `Kunne ikke indlæse data: ${err.message}`;
  }
}

init();
