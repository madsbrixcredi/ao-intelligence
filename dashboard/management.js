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
  declarations: "ao_declarations.csv",
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

/** Dage siden en ISO-dato. Null hvis datoen mangler eller ikke kan læses. */
function daysSince(isoDate) {
  if (!isoDate) return null;
  const then = Date.parse(isoDate);
  if (!Number.isFinite(then)) return null;
  return Math.max(0, Math.round((Date.now() - then) / 86400000));
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
  const decl = d.declarations.find((r) => cvrOf(r) === c) || null;
  const monthly = d.monthly.filter((r) => cvrOf(r) === c);
  const users = d.users.filter((r) => cvrOf(r) === c);
  const auditors = d.auditors.filter((r) => cvrOf(r) === c);

  const name = master?.accounting_office_name || conn?.accounting_office_name || "Ukendt revisionshus";

  // Målte tal
  const active = conn ? num(conn.active_erp_connections) : 0;
  const purchased = conn ? num(conn.purchased_companies) : 0;
  const hasAgreement = Boolean(conn);
  // Crediwire arbejder kun med regnskabsklasse B. Derfor er klasse B
  // grundlaget for potentiale, målsætning og markedsdækning. Klasse A, C og D
  // opgøres separat som det marked der ligger uden for produktet.
  const declarationsAll = decl ? num(decl.declarations) : (master ? num(master.total_declarations) : 0);
  const declarations = decl ? num(decl.class_b) : declarationsAll;
  const outsideScope = decl ? Math.max(0, num(decl.declarations) - num(decl.class_b)) : 0;
  const declSource = decl ? "Erklæringsregister 2025 til 2026 · regnskabsklasse B" : "ao_master.csv";
  const analyses = master ? num(master.total_analyses) : 0;
  const activeUsers = master ? num(master.active_users) : 0;
  const analysedCompanies = master ? num(master.distinct_clients_analysed) : 0;
  const latestActivity = master?.latest_activity_date || "";

  const byType = decl ? {
    audits: num(decl.class_b_audits),
    reviews: num(decl.class_b_reviews),
    extended: num(decl.class_b_extended_reviews),
    assistance: num(decl.class_b_assistance),
  } : {
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
    daysSinceActivity: daysSince(latestActivity),
    activationRate: activationRate(active, purchased),
    marketCoverage: marketCoverage(active, declarations),
    notActivated: Math.max(0, purchased - active),
    analysesPerCompany: active > 0 ? analyses / active : null,
    yoy: activityYoY(monthly),
    top3: topThreeShare(riskRow),
    riskLabel: riskRow?.implementation_risk || null,
    declarationsAll, outsideScope,
    classB: decl ? num(decl.class_b) : null,
    addressableAnnual: decl ? num(decl.addressable_annual_reports) : null,
    classBAssistance: decl ? num(decl.class_b_assistance) : null,
    classBExtended: decl ? num(decl.class_b_extended_reviews) : null,
    auditorsWithMne: decl ? num(decl.auditors_with_mne) : null,
    declSource,
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
   HEALTH SCORE · 0 til 100
   Sammensat af fem delscorer der alle kan beregnes fra data. Hver delscore
   har en dokumenteret kurve, så tallet kan efterprøves og diskuteres.
   Der vises ingen udvikling på scoren, fordi der kun findes ét snapshot af
   aktiverede virksomheder. En årstrend ville være opdigtet.
   ========================================================================== */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Samme skala for både den samlede score og hver delscore. */
const scoreBand = (score) =>
  score >= 90 ? { cls: "excellent", label: "Excellent" }
  : score >= 75 ? { cls: "strong", label: "Strong" }
  : score >= 60 ? { cls: "developing", label: "Developing" }
  : { cls: "attention", label: "Needs attention" };

/** Opremsning på dansk: "a, b og c". */
const joinDa = (arr) =>
  arr.length <= 1 ? (arr[0] || "") : `${arr.slice(0, -1).join(", ")} og ${arr.at(-1)}`;

/** Delscorer. Returnerer null når datagrundlaget mangler, så vægten kan flyttes. */
function healthComponents(m) {
  const comp = [];

  // 1) Aktivering · hvor stor en del af det købte er i brug. 100% = fuld score.
  const activationUnreliable = m.activationRate !== null && m.activationRate > 1.01;
  comp.push({
    key: "aktivering", label: "Aktivering", weight: 0.25,
    // Er der flere aktive end købte, stemmer kilderne ikke. Så udelades delscoren
    // i stedet for at give topkarakter på et forkert grundlag.
    score: m.activationRate === null || activationUnreliable ? null : clamp(m.activationRate, 0, 1) * 100,
    basis: m.activationRate === null
      ? "Ingen aftale registreret"
      : activationUnreliable
        ? `${n0(m.active)} aktive mod kun ${n0(m.purchased)} købte · aftaletallet skal afstemmes`
        : `${n0(m.active)} af ${n0(m.purchased)} købte virksomheder er i brug`,
    curve: "100% af aftalen i brug giver 100 point. Halvdelen giver 50.",
  });

  // 2) Vækst · analyser år mod år. Uændret giver 50, +50% eller mere giver 100.
  const g = m.yoy?.change ?? null;
  comp.push({
    key: "vaekst", label: "Vækst", weight: 0.20,
    score: g === null ? null : clamp((g + 0.5) * 100, 0, 100),
    basis: g === null
      ? "For lidt historik til at sammenligne år mod år"
      : `${g >= 0 ? "+" : ""}${pct0(g)} i analyser mod samme periode sidste år`,
    curve: "Uændret giver 50 point. +50% eller mere giver 100. −50% eller værre giver 0.",
  });

  // 3) Udnyttelse · hvor dybt platformen bruges pr. virksomhed.
  const apc = m.analysesPerCompany;
  comp.push({
    key: "udnyttelse", label: "Udnyttelse", weight: 0.20,
    score: apc === null ? null : clamp(apc / 12, 0, 1) * 100,
    basis: apc === null
      ? "Ingen aktive virksomheder at måle på"
      : `${nf1.format(apc)} analyser pr. aktiv virksomhed`,
    curve: "12 analyser pr. virksomhed om året, altså én om måneden, giver 100 point.",
  });

  // 4) Brugerbredde · hvor bredt brugen er fordelt. Omvendt af koncentration.
  const hasUsers = m.activeUsers > 0 && m.top3 !== null;
  comp.push({
    key: "bredde", label: "Brugerbredde", weight: 0.15,
    score: hasUsers ? clamp((1 - m.top3) / 0.67, 0, 1) * 100 : null,
    basis: hasUsers
      ? `${n0(m.activeUsers)} aktive brugere · de tre mest aktive står for ${pct1(m.top3)}`
      : "Ingen brugere har downloadet en analyse endnu",
    curve: "Står de tre mest aktive for en tredjedel eller mindre, gives 100 point. Står de for alt, gives 0.",
  });

  // 5) Markedsdækning · hvor stor en del af husets erklæringer der er dækket.
  comp.push({
    key: "daekning", label: "Markedsdækning", weight: 0.20,
    score: m.marketCoverage === null ? null : clamp(m.marketCoverage / 0.25, 0, 1) * 100,
    basis: m.marketCoverage === null
      ? "Ingen erklæringsdata"
      : `${n0(m.active)} af ${n0(m.declarations)} klasse B-erklæringer er dækket`,
    curve: "25% dækning af klasse B-erklæringerne giver 100 point.",
  });

  return comp;
}

/** Vægtet samlet score. Mangler en delscore, fordeles vægten på de øvrige. */
const MIN_WEIGHT_FOR_SCORE = 0.6;

function healthScore(m) {
  const comp = healthComponents(m);
  const usable = comp.filter((c) => c.score !== null);
  const totalWeight = usable.reduce((s, c) => s + c.weight, 0);

  // Kan under 60% af vægten beregnes, ville en samlet score sige mere om
  // manglende data end om huset. Så viser vi ingen score.
  if (totalWeight < MIN_WEIGHT_FOR_SCORE) {
    return {
      score: null, band: null, comp,
      excluded: comp.filter((c) => c.score === null).map((c) => c.label),
      tooLittleData: true,
      coverage: totalWeight,
    };
  }

  const score = Math.round(usable.reduce((s, c) => s + c.score * (c.weight / totalWeight), 0));

  const band = scoreBand(score);

  return {
    score, band, comp,
    excluded: comp.filter((c) => c.score === null).map((c) => c.label),
    reweighted: usable.length < comp.length,
  };
}

/* ==========================================================================
   RENDER
   ========================================================================== */
function render() {
  const m = buildMetrics();

  document.getElementById("firmName").textContent = m.name;
  document.getElementById("firmSub").textContent = m.hasAgreement
    ? `CVR ${m.cvr} · ${n0(m.declarations)} klasse B-erklæringer · ${n0(m.active)} aktive virksomheder`
    : `CVR ${m.cvr} · ${n0(m.declarations)} klasse B-erklæringer · ingen Crediwire-aftale endnu`;

  renderHealth(m);
  renderKpis(m);
  renderRecommendation(m);
  renderActivity(m);
  renderFocusPreview(m);
  renderBusinessCase(m);
  renderFocus(m);
  renderDataStatus(m);
}

/** Ring som WHOOP Recovery Score. Farven bærer beskeden, tallet står i midten. */
function scoreRing(score, band) {
  const R = 78, C = 2 * Math.PI * R;
  const pct = score === null ? 0 : clamp(score, 0, 100) / 100;
  const color = band ? `var(--band-${band.cls})` : "var(--line-2)";
  return `
    <div class="ring-wrap">
      <svg class="ring" viewBox="0 0 180 180" role="img" aria-label="${score === null ? "Ingen score" : `Score ${score} af 100`}">
        <circle cx="90" cy="90" r="${R}" class="ring-track" />
        <circle cx="90" cy="90" r="${R}" class="ring-fill"
          style="stroke:${color}; stroke-dasharray:${C.toFixed(1)}; stroke-dashoffset:${(C * (1 - pct)).toFixed(1)}" />
      </svg>
      <div class="ring-center">
        ${score === null
          ? `<span class="ring-none">Ingen<br />score</span>`
          : `<strong class="ring-score" style="color:${color}">${score}</strong>
             <span class="ring-band" style="color:${color}">${esc(band.label)}</span>`}
      </div>
    </div>`;
}

function renderHealth(m) {
  const h = healthScore(m);
  const el = document.getElementById("healthRows");

  const subs = h.comp.map((c) => {
    const cls = c.score === null ? null : scoreBand(c.score).cls;
    const col = cls ? `var(--band-${cls})` : "var(--line-2)";
    return `
    <div class="sub ${c.score === null ? "is-na" : ""}">
      <span class="sub-label">${esc(c.label)}</span>
      <div class="sub-bar"><i style="width:${c.score === null ? 0 : c.score.toFixed(0)}%; background:${col}"></i></div>
      <span class="sub-val" style="${cls ? `color:${col}` : ""}">${c.score === null ? "n/a" : Math.round(c.score)}</span>
    </div>`;
  }).join("");

  const note = h.score === null
    ? `${esc(joinDa(h.excluded))} kan ikke beregnes for dette hus. Der er kun grundlag for ${pct0(h.coverage)} af scorens vægt, og en samlet score ville derfor sige mere om manglende data end om huset.`
    : h.reweighted
      ? `${esc(joinDa(h.excluded))} kan ikke beregnes for dette hus. Vægten er fordelt på de øvrige delscorer.`
      : "";

  el.innerHTML = `
    <div class="health-main">
      ${scoreRing(h.score, h.band)}
      <div class="health-right">
        <p class="health-lead">${esc(healthLead(m, h))}</p>
        <div class="sub-scores">${subs}</div>
      </div>
    </div>
    ${note ? `<p class="muted small health-note">${note}</p>` : ""}`;

  document.getElementById("healthHelp").innerHTML = `
    <b>Sådan beregnes scoren</b><br />
    Fem delscorer, hver med sin egen kurve og vægt. Mangler en delscore, fordeles
    dens vægt på de øvrige. Kan under 60% af vægten beregnes, vises ingen score.
    <table>
      ${h.comp.map((c) => `<tr>
        <td><b>${esc(c.label)}</b> · vægt ${pct0(c.weight)}<br />${esc(c.curve)}<br /><span style="color:var(--muted)">${esc(c.basis)}</span></td>
        <td>${c.score === null ? "ikke beregnet" : Math.round(c.score) + " point"}</td>
      </tr>`).join("")}
      ${h.score !== null ? `<tr><td><b>Samlet</b></td><td><b>${h.score} · ${esc(h.band.label)}</b></td></tr>` : ""}
    </table>
    <br />
    <b>Niveauer</b><br />
    90 til 100 Excellent · 75 til 89 Strong · 60 til 74 Developing · under 60 Needs attention
    <br /><br />
    <b>Hvorfor der ikke vises udvikling på scoren</b><br />
    Der findes kun ét snapshot af aktiverede virksomheder, dateret
    ${esc(state.data.connections.find((r) => cvrOf(r) === m.cvr)?.snapshot_date || "ukendt")}.
    En sammenligning med sidste år ville derfor være et gæt.`;
}

/** Én sætning der siger hvad scoren betyder, og hvad der trækker mest ned. */
function healthLead(m, h) {
  if (h.score === null) {
    return m.hasAgreement
      ? "Der er ikke nok datagrundlag til at give huset en samlet score."
      : "Huset er ikke kunde endnu, så der er intet at score på.";
  }
  const usable = h.comp.filter((c) => c.score !== null);
  const weakest = usable.slice().sort((a, b) => a.score - b.score)[0];
  const strongest = usable.slice().sort((a, b) => b.score - a.score)[0];
  return `${strongest.label} trækker op med ${Math.round(strongest.score)} point. `
    + `${weakest.label} er det svageste med ${Math.round(weakest.score)} og er der, hvor der er mest at hente.`;
}

/**
 * KPI-rækken viser kun tal der ikke står andre steder på siden.
 * Aktivering, vækst, udnyttelse, brugerbredde og dækning ligger i Health.
 * Årstal og analysetal ligger i aktivitetskortet.
 */
function renderKpis(m) {
  const cards = [];

  cards.push(`<article class="kpi">
    <span>Nettoværdi skabt <span class="chip chip-assume">Antagelse</span></span>
    <strong>${m.active > 0 ? money(m.netToday) : "Ingen endnu"}</strong>
    <em>${m.active > 0
      ? `Efter investering i Crediwire`
      : "Ingen aktive virksomheder at regne værdi på endnu"}</em>
  </article>`);

  const belowToday = m.target <= m.active;
  cards.push(`<article class="kpi">
    <span>Uudnyttet nettoværdi <span class="chip chip-assume">Antagelse</span></span>
    <strong>${belowToday ? "Allerede nået" : money(m.unrealizedNet)}</strong>
    <em>${belowToday
      ? `Målsætningen ligger under antallet af aktive virksomheder`
      : `Ved den valgte målsætning nedenfor`}</em>
  </article>`);

  cards.push(`<article class="kpi">
    <span>Dataanalyser <span class="chip chip-measured">Målt</span></span>
    <strong>${n0(m.analyses)}</strong>
    <em>${m.analysedCompanies ? `Fordelt på ${n0(m.analysedCompanies)} virksomheder` : "Ingen virksomheder analyseret endnu"}</em>
  </article>`);

  cards.push(`<article class="kpi">
    <span>Aktive revisorer <span class="chip chip-measured">Målt</span></span>
    <strong>${n0(m.activeUsers)}</strong>
    <em>${m.daysSinceActivity === null
      ? "Ingen registreret aktivitet"
      : m.daysSinceActivity <= 31
        ? "Aktive inden for den seneste måned"
        : `Seneste aktivitet for ${n0(m.daysSinceActivity)} dage siden`}</em>
  </article>`);

  document.getElementById("kpiRow").innerHTML = cards.join("");
}

function renderRecommendation(m) {
  const el = document.getElementById("recommendation");

  // Regelbaseret. Reglen står i datastatus, så den kan efterprøves.
  // Beløbet gentages ikke her, det står i KPI-rækken.
  let head, body;
  if (!m.hasAgreement) {
    head = "Start med en aftale";
    body = `Huset laver ${n0(m.declarations)} klasse B-erklæringer om året og har ingen Crediwire-aftale endnu.`;
  } else if (m.notActivated > 0 && m.notActivated / Math.max(1, m.purchased) > 0.1) {
    head = `Aktivér de ${n0(m.notActivated)} virksomheder der mangler`;
    body = "De er allerede betalt for, så det kræver ingen ny aftale. Det er den hurtigste vej til mere værdi.";
  } else {
    head = `Udvid til ${pct0(m.a.targetPct)} af klasse B-porteføljen`;
    body = `Det kræver at ${n0(m.additional)} flere virksomheder kommer på platformen.`;
  }

  el.innerHTML = `
    <div>
      <p class="eyebrow">Anbefalet næste skridt</p>
      <h3>${esc(head)}</h3>
      <p>${esc(body)}</p>
    </div>
    <button class="btn" data-goto="business">Se business case</button>`;
}

/** Aktivitetskortet er det eneste sted årstal og analysetal pr. år står. */
function renderActivity(m) {
  const el = document.getElementById("activityCard");
  if (!m.yoy) {
    el.innerHTML = `<div class="card-head"><h2>Aktivitet over tid</h2></div>
      <p class="muted small">Der er ikke nok månedsdata til at sammenligne år mod år for dette hus.</p>`;
    return;
  }
  const y = m.yoy;
  const max = Math.max(y.current, y.previous, 1);
  const growing = y.change !== null && y.change >= 0;

  el.innerHTML = `
    <div class="card-head">
      <div>
        <h2>${growing ? "Aktiviteten vokser" : "Aktiviteten falder"}</h2>
        <p class="muted small">${MONTHS[y.monthFrom - 1]} til ${MONTHS[y.monthTo - 1]}, år mod år</p>
      </div>
      <strong class="yoy-change ${growing ? "up" : "down"}">${y.change === null ? "—" : `${growing ? "+" : ""}${pct0(y.change)}`}</strong>
    </div>
    <div class="yoy">
      <div class="yoy-row">
        <div><span class="yr">${y.currentYear}</span><span class="val">${n0(y.current)} analyser</span></div>
        <div class="bar"><i style="width:${(y.current / max * 100).toFixed(1)}%"></i></div>
      </div>
      <div class="yoy-row">
        <div><span class="yr">${y.previousYear}</span><span class="val">${n0(y.previous)} analyser</span></div>
        <div class="bar"><i class="faded" style="width:${(y.previous / max * 100).toFixed(1)}%"></i></div>
      </div>
    </div>
    <p class="muted small footnote">${MONTHS[y.excludedMonth - 1]} er udeladt som ufuldstændig måned. Aktiviteten er sæsonbetonet, så en delvis måned ville ligne tilbagegang.</p>`;
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
    `Svarer til ${n0(m.target)} af ${n0(m.declarations)} klasse B-erklæringer`;

  const annualEl = document.getElementById("annualDefault");
  if (annualEl) annualEl.textContent = m.addressableAnnual
    ? `Adresserbart marked: ${n0(m.addressableAnnual)}`
    : "Ingen klasse B-data for dette hus";
  const assistEl = document.getElementById("assistDefault");
  if (assistEl) assistEl.textContent = m.byType.assistance
    ? `Huset laver ${n0(m.byType.assistance)} assistanceerklæringer`
    : "Ingen assistancedata";

  // Er målet lavere end antallet af aktive i dag, findes der intet uudnyttet
  // potentiale. Et negativt tal her ville være meningsløst for læseren.
  const belowToday = m.target <= m.active;
  document.getElementById("bcHeadline").innerHTML = belowToday
    ? `<span>Målsætning ved ${pct0(m.a.targetPct)} af erklæringerne</span>
       <strong>Allerede nået</strong>
       <em>Målet svarer til ${n0(m.target)} virksomheder, og der er allerede ${n0(m.active)} aktive. Sæt målsætningen højere for at se et potentiale.</em>`
    : `<span>Uudnyttet nettoværdi</span>
       <strong>${money(m.unrealizedNet)}</strong>
       <em>Forskellen mellem nettoværdien i dag og ved målet. Bygger på forudsætningerne nedenfor.</em>`;

  const row = (label, today, target, opts = {}) => {
    const delta = target - today;
    const cls = opts.neutral ? "neu" : delta > 0 ? "pos" : "neu";
    const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
    return `<tr class="${opts.strong ? "strong" : ""}">
      <td>${esc(label)}${opts.why ? ` <button class="why" data-open="${opts.why}">hvorfor</button>` : ""}</td>
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
  const breakdownEl = document.getElementById("bcBreakdown");

  // Med kun én værdikilde ville kortet blot gentage totalen fra tabellen.
  if (split.length < 2) {
    breakdownEl.innerHTML = `
      <div class="card-head"><h2>Hvor værdien kommer fra</h2></div>
      <p class="muted small">Al værdi kommer i dag fra dataanalyse. Sæt timer og pris på årsrapport eller assistance i forudsætningerne for at se en fordeling.</p>`;
    return;
  }

  breakdownEl.innerHTML = `
    <div class="card-head"><h2>Hvor værdien kommer fra</h2><span class="muted small">Ved målet</span></div>
    ${split.map(([k, v]) => `<div class="split-row">
      <div><span class="lbl">${esc(k[0].toUpperCase() + k.slice(1))}</span><span class="amt">${money(v)}</span></div>
      <div class="bar"><i style="width:${(v / total * 100).toFixed(1)}%"></i></div>
    </div>`).join("")}
    ${split.length === 1 ? `<p class="muted small" style="margin-top:10px">Kun dataanalyse er sat. Udfyld årsrapport, assistance eller rapportering i forudsætningerne for at se den fulde fordeling.</p>` : ""}`;
}

function renderDataStatus(m) {
  const conn = state.data.connections.find((r) => cvrOf(r) === m.cvr);
  const masterRow = state.data.aoMaster.find((r) => cvrOf(r) === m.cvr);
  const masterDecl = masterRow ? num(masterRow.total_declarations) : 0;
  document.getElementById("dataStatus").innerHTML = `
    <b>Kilder og forbehold</b>
    <table>
      <tr><td>Aktive og købte virksomheder</td><td>${esc(conn?.snapshot_date || "ukendt")}</td></tr>
      <tr><td>Erklæringer, analyser og brugere</td><td>ao_master.csv</td></tr>
      <tr><td>Erklæringer, typer og regnskabsklasse</td><td>${esc(m.declSource)}</td></tr>
      <tr><td>Uden for produktets rækkevidde</td><td>${n0(m.outsideScope)} erklæringer i klasse A, C og D</td></tr>
      <tr><td>Revisordækning</td><td>${n0(m.auditors.length)} af ${m.auditorsWithMne === null ? "?" : n0(m.auditorsWithMne)} revisorer med MNE-nummer</td></tr>
    </table>
    <br />
    <b>Sådan er anbefalingen dannet</b><br />
    Anbefalingen er regelbaseret, ikke genereret af en AI-model. Er mere end 10%
    af de købte virksomheder ikke aktiveret, anbefales aktivering først. Ellers
    anbefales udvidelse til den valgte målsætning.
    <br /><br />
    <b>Afgrænsning til regnskabsklasse B</b><br />
    Crediwire arbejder kun med regnskabsklasse B. Alle tal for potentiale,
    målsætning og markedsdækning regnes derfor på klasse B alene. Huset laver
    ${n0(m.declarationsAll)} erklæringer i alt, hvoraf ${n0(m.declarations)} er klasse B
    og ${n0(m.outsideScope)} ligger i klasse A, C eller D og indgår ikke.
    <br /><br />
    <b>Kendte begrænsninger</b><br />
    Der findes kun ét snapshot af aktiverede virksomheder, så udvikling i
    aktiveringsgrad kan ikke vises, og afvigelse fra en implementeringsplan kan
    ikke beregnes. Vi kender ikke husets samlede antal medarbejdere, så
    brugerbredde kan ikke opgøres i procent af organisationen.
    Revisordækning beregnes på klient-CVR og ikke på personnavn, fordi
    MNE-nummeret tilhører den underskrivende revisor, mens Crediwire-brugeren
    typisk er medarbejderen der udfører arbejdet.
    ${masterDecl && m.declarations && Math.abs(masterDecl - m.declarations) / m.declarations > 0.01
      ? `<br /><br />Erklæringstallet ${n0(m.declarations)} kommer fra regionsudtrækket af 30. juli 2026, som dækker alle fem regioner og Grønland. Den tidligere kilde ao_master.csv opgør ${n0(masterDecl)} for dette hus. Forskellen er ${pct1(Math.abs(masterDecl - m.declarations) / masterDecl)} og skyldes at ao_master bygger på ældre udtræk fra 10. juni, hvor en stor del af juni-indberetningerne endnu ikke var offentliggjort.`
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

/**
 * Skifter revisionshus.
 * Antal årsrapporter og assistanceerklæringer er husets egne tal og må ikke
 * følge med til næste hus. Uden dette ville fx GT's 5.695 årsrapporter blive
 * brugt på et hus med 1.497 erklæringer i alt.
 */
function selectFirm(cvr) {
  state.cvr = cvr;

  const d = state.data;
  const decl = d.declarations.find((r) => cvrOf(r) === cvr);
  const master = d.aoMaster.find((r) => cvrOf(r) === cvr);

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = String(value);
  };
  set("countAnnual", decl ? num(decl.addressable_annual_reports) : 0);
  set("countAssist", decl ? num(decl.class_b_assistance) : (master ? num(master.assistance) : 0));
  set("countReporting", 0);

  render();
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
    selectFirm(btn.dataset.cvr);
    input.value = "";
    results.classList.remove("open");
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
    selectFirm(state.cvr);
  } catch (err) {
    document.getElementById("loading").textContent = `Kunne ikke indlæse data: ${err.message}`;
  }
}

init();
