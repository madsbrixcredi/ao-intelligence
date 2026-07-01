// H2 2026 Timeline · per-AO luk-måned + erosion pr segment
// Data-kilde: data/processed/ao_master.csv + ao_connections_current.csv

// ---- Segment-definitioner (kopi fra app.js) ----
const EXISTING_CLIENT_CVRS = [
  "34209936", "35486178", "27525989", "16645699", "44282380", "36029374",
  "26717671", "10019699", "32676421", "34480370", "34953619", "39463113",
];
const TOP_PROSPECT_GROUPS = [
  { name: "Beierholm", cvrs: ["32895468"] }, { name: "Albjerg", cvrs: ["35382879"] },
  { name: "PKF", cvrs: ["14119299"] }, { name: "Piaster", cvrs: ["25160037"] },
  { name: "Redmark", cvrs: ["29442789", "13865639"] }, { name: "Martinsen", cvrs: ["32285201", "10130115"] },
  { name: "RSM", cvrs: ["25492145"] }, { name: "Tal & Tanker", cvrs: ["37315664"] },
  { name: "Inforevision", cvrs: ["19263096"] }, { name: "Roesgaard", cvrs: ["37543128"] },
  { name: "Christensen Kjærulff", cvrs: ["15915641"] }, { name: "Baker Tilly", cvrs: ["35257691"] },
  { name: "Aaen & Co", cvrs: ["33241763"] }, { name: "Sønderjyllands Revision", cvrs: ["18061635"] },
  { name: "Addere", cvrs: ["34589992"] }, { name: "Dansk Revision Frederikssund", cvrs: ["86141019"] },
  { name: "VH Revision", cvrs: ["17871080"] }, { name: "Andersen Revision", cvrs: ["32326706"] },
  { name: "Midt-revi", cvrs: ["39065797"] }, { name: "Kallermann", cvrs: ["30195264"] },
  { name: "Rödl & Partner", cvrs: ["39188678"] }, { name: "Krøyer Pedersen", cvrs: ["89224918", "45922391"] },
  { name: "Baagøe Schou", cvrs: ["21148148"] }, { name: "Dansk Revision Nyborg / Slagelse", cvrs: ["29919801"] },
  { name: "Dansk Revision Holbæk", cvrs: ["28853343"] }, { name: "Dansk Revision Søborg", cvrs: ["14649905"] },
  { name: "Lars-olsen", cvrs: ["37135119"] },
  { name: "Revisionscentret", cvrs: ["29695636", "38951394", "18936305", "10352231", "26279534", "13976295", "41578513"] },
  // Tilføjet 1. juli 2026 · Top 50 nye · rate 5% (kan overrides pr AO)
  { name: "BDO", cvrs: ["45719375"] },
  { name: "Aros", cvrs: ["29690065"] },
  { name: "Crowe", cvrs: ["33256876"] },
  { name: "RéVision+", cvrs: ["41695609"] },
  { name: "Dansk Revision Odense", cvrs: ["82218912"] },
  { name: "Øernes Revision", cvrs: ["37121924"] },
  { name: "Kvalitetsrevision", cvrs: ["36480254"] },
  { name: "Blicher Revision & Rådgivning", cvrs: ["78337818"] },
  { name: "Revision Ry & Hammel", cvrs: ["26267439"] },
  { name: "Harboe Consult", cvrs: ["35649417"] },
  { name: "Rådgivning & Revision", cvrs: ["10158117"] },
  { name: "Søby Revisorer", cvrs: ["19125742"] },
  { name: "Dansk Revision Esbjerg", cvrs: ["26993695"] },
  { name: "Trekroner Revision", cvrs: ["28991355"] },
  { name: "Revisionsfirmaet Albrechtsen", cvrs: ["77926410"] },
  { name: "Revision og Rådgivningsgruppen", cvrs: ["33771177"] },
  { name: "Status Revision", cvrs: ["30707907"] },
  { name: "RevisorGården Holbæk", cvrs: ["45071391"] },
  { name: "Lægård Revision", cvrs: ["18437082"] },
  { name: "Kreston SR", cvrs: ["33948794"] },
  { name: "Eco-Team", cvrs: ["27966675"] },
  { name: "JL Revisorer", cvrs: ["31332699"] },
  { name: "Revisions-Partner", cvrs: ["69305210"] },
  { name: "Danica", cvrs: ["37603686"] },
  { name: "Bays Revisionskontor", cvrs: ["20183497"] },
  { name: "Dansk Revision Roskilde", cvrs: ["14678093"] },
  { name: "Advosion", cvrs: ["37557064"] },
  { name: "Anker Høst", cvrs: ["31626536"] },
  { name: "Boreco", cvrs: ["36074981"] },
  { name: "Nordkyst Revision", cvrs: ["37605255"] },
  { name: "Optimal Revision", cvrs: ["19233383"] },
  { name: "LPOG", cvrs: ["33167288"] },
  { name: "K.T. Revision Vejle", cvrs: ["70969815"] },
  { name: "Tønder Revision", cvrs: ["29142807"] },
  { name: "Rønne Revision", cvrs: ["74717810"] },
  { name: "RevisorDK", cvrs: ["38257846"] },
  { name: "Dansk Revision Viborg", cvrs: ["20336390"] },
  { name: "Lou Revision", cvrs: ["31579309"] },
  { name: "Dansk Revision Hillerød", cvrs: ["26580390"] },
  { name: "Dalsgaard, Stahl & Wøldike", cvrs: ["21696382"] },
  { name: "Revision 2", cvrs: ["16968137"] },
  { name: "Revision København", cvrs: ["34619654"] },
  { name: "Revisionsfirmaet John Schantz", cvrs: ["28312393"] },
  { name: "BHA Statsautoriseret Revision", cvrs: ["18967901"] },
  { name: "Dahl, Rask & Partnere", cvrs: ["10422183"] },
  { name: "Aage Maagensen", cvrs: ["12901038"] },
  { name: "Algade Revision", cvrs: ["35663916"] },
  { name: "Barrett", cvrs: ["28842562"] },
  { name: "Vadskær Krømmelbein", cvrs: ["40689745"] },
  { name: "VKST Revision", cvrs: ["34351961"] },
];
const ACCRU_GROUPS = [
  { name: "Albjerg", cvrs: ["35382879"] }, { name: "Bille & Buch-Andersen", cvrs: ["18282046"] },
  { name: "JS Revision", cvrs: ["37999687"] }, { name: "Nærrevision", cvrs: ["17524305"] },
  { name: "Mernø Revision", cvrs: ["32344720"] }, { name: "Revimidt", cvrs: ["34480370"] },
  { name: "Revision Sjælland", cvrs: ["28309791"] }, { name: "Robæk Revision", cvrs: ["33946406"] },
  { name: "Sønderup", cvrs: ["31824559", "27905072", "45907880"] }, { name: "SR Revision", cvrs: ["19536890"] },
  { name: "TJEK Revision & Rådgivning", cvrs: ["36563877"] }, { name: "WKRAGH", cvrs: ["16206407"] },
];
const RGD_GROUPS = [
  { name: "Albjerg", cvrs: ["35382879"] }, { name: "Attent", cvrs: ["36427205"] },
  { name: "Baagøe Schou", cvrs: ["21148148"] }, { name: "Buus Jensen", cvrs: ["36029374"] },
  { name: "Christensen Kjærulff", cvrs: ["15915641"] }, { name: "Grant Thornton", cvrs: ["34209936"] },
  { name: "Kovsted & Skovgård", cvrs: ["38751646"] }, { name: "Krøyer Pedersen", cvrs: ["89224918", "45922391"] },
  { name: "Martinsen", cvrs: ["32285201"] }, { name: "Nejstgaard & Vetlov", cvrs: ["12868693"] },
  { name: "Partner Revision", cvrs: ["15807776"] }, { name: "Piaster Revisorerne", cvrs: ["25160037"] },
  { name: "PKF Munkebo Eriksen Funch", cvrs: ["14119299"] }, { name: "Powered-By", cvrs: ["44282380"] },
  { name: "Redmark", cvrs: ["29442789"] }, { name: "Revision & Råd", cvrs: ["36923318", "46125894"] },
  { name: "Revisionshuset Tal & Tanker", cvrs: ["37315664"] }, { name: "RSM", cvrs: ["25492145"] },
  { name: "Slebo Revision", cvrs: ["44984326"] }, { name: "Sønderjyllands Revision", cvrs: ["18061635"] },
  { name: "Ullits & Winther", cvrs: ["32093272"] },
];
const GT_CVR = "34209936";

// Huse Mads har markeret til at slette fra pipeline (1. juli 2026)
const SLET_CVRS = [
  "10352231", "13976295", "18936305", "26279534",
  "29695636", "38951394", "39065797", "41578513",
];

// Konsolidering: alias-CVR → primary CVR (samme revisionshus, flere CVRs i data)
const CVR_ALIASES = {
  "45922391": "89224918", // Krøyer Pedersen P/S → Krøyer Pedersen
  "46125894": "36923318", // Revision & Råd (fuld) → Revision & Råd
};

// Ryddede display-navne pr primary CVR (efter konsolidering)
const CANONICAL_NAMES = {
  "89224918": "Krøyer Pedersen",
  "36923318": "Revision & Råd",
};

function resolveCvr(cvr) {
  return CVR_ALIASES[cvr] || cvr;
}

// ---- Konstanter ----
const MONTHS = ["jul", "aug", "sep", "okt", "nov", "dec", "ikke_i_aar"];
const MONTH_LABELS = { jul: "Jul", aug: "Aug", sep: "Sep", okt: "Okt", nov: "Nov", dec: "Dec", ikke_i_aar: "Ikke i år" };
const SEGMENTS = ["existing", "top", "next20", "accru", "rgd"];
const SEGMENT_LABELS = { existing: "Existing", top: "Top Prospects", next20: "Næste 20", accru: "Accru", rgd: "RGD" };

// Default deadline (deadline måned pr segment)
const DEFAULT_DEADLINES = { existing: "sep", top: "okt", next20: "okt", accru: "nov", rgd: "nov" };
// Rate pr segment (max implementation)
const DEFAULT_RATES = { existing: 0.25, top: 0.05, next20: 0.02, accru: 0.02, rgd: 0.02 };
// Erosion-tabel pr segment (deadline → +1 → +2 → +3 → +4 → ikke_i_aar)
const DEFAULT_EROSION = {
  existing: [1.00, 0.90, 0.75, 0.55, 0.30, 0.00],
  top:      [1.00, 0.80, 0.60, 0.40, 0.20, 0.00],
  next20:   [1.00, 0.80, 0.60, 0.40, 0.20, 0.00],
  accru:    [1.00, 0.75, 0.50, 0.25, 0.00, 0.00],
  rgd:      [1.00, 0.75, 0.50, 0.25, 0.00, 0.00],
};

// ---- Hjælpe-funktioner ----
const dkNum = new Intl.NumberFormat("da-DK");
const dkCur = new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", maximumFractionDigits: 0 });
const dkKKr = (v) => Math.round(v / 1000).toLocaleString("da-DK") + "K";
const num = (v) => { const p = Number(v); return Number.isFinite(p) ? p : 0; };

function parseCSV(text) {
  const lines = text.replace(/\r/g, "").trim().split("\n");
  const parseLine = (l) => {
    const cells = []; let cur = ""; let q = false;
    for (const ch of l) {
      if (ch === '"') q = !q;
      else if (ch === "," && !q) { cells.push(cur); cur = ""; }
      else cur += ch;
    }
    cells.push(cur);
    return cells;
  };
  const headers = parseLine(lines[0]);
  return lines.slice(1).map((l) => {
    const c = parseLine(l);
    const o = {};
    headers.forEach((k, i) => (o[k] = c[i]));
    return o;
  });
}

async function loadCsv(name) {
  const res = await fetch(`../data/processed/${name}`);
  return parseCSV(await res.text());
}

// ---- State ----
const CLOSE_MONTHS_KEY = "timelineCloseMonths_v1";
const EROSION_KEY = "timelineErosion_v1";
const DEADLINES_KEY = "timelineDeadlines_v1";
const RATES_KEY = "timelineRates_v1";
const AO_OVERRIDES_KEY = "timelineAoOverrides_v1"; // { cvr → { price?, deadline? } }
const AO_NOTES_KEY = "timelineAoNotes_v1"; // { cvr → { trafiklys, note } }
const AO_DECL_TYPES_KEY = "timelineAoDeclTypes_v1"; // { cvr → { audits, reviews, extended_reviews, assistance } }
const SCENARIO_KEY = "timelineScenario_v1";
const GT_SCENARIO_KEY = "timelineGtScenario_v1";

const SCENARIO_MULTIPLIERS = { conservative: 0.6, basis: 1.0, stretch: 1.3 };
const GT_MULTIPLIERS = { full: 1.0, half: 0.5, none: 0.0 };

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; }
  catch { return fallback; }
}
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

const state = {
  aoMaster: [],
  masterMap: new Map(),
  connections: new Map(),
  pool: [], // de-duplikeret pool
  closeMonths: loadJson(CLOSE_MONTHS_KEY, {}), // { cvr → month }
  erosion: loadJson(EROSION_KEY, DEFAULT_EROSION),
  deadlines: loadJson(DEADLINES_KEY, DEFAULT_DEADLINES),
  rates: loadJson(RATES_KEY, DEFAULT_RATES),
  aoOverrides: loadJson(AO_OVERRIDES_KEY, {}), // { cvr → { price, deadline } }
  aoNotes: loadJson(AO_NOTES_KEY, {}), // { cvr → { trafiklys: 'green'|'yellow'|'red', note: '...' } }
  aoDeclTypes: loadJson(AO_DECL_TYPES_KEY, {}), // { cvr → { audits, reviews, extended_reviews, assistance } } · default = alle true
  scenario: localStorage.getItem(SCENARIO_KEY) || "basis",
  gtScenario: localStorage.getItem(GT_SCENARIO_KEY) || "full",
};

function getAoStatus(cvr) {
  return state.aoNotes[resolveCvr(cvr)] || {};
}
function setAoStatus(cvr, patch) {
  const primary = resolveCvr(cvr);
  const existing = state.aoNotes[primary] || {};
  const merged = { ...existing, ...patch };
  // Ryd tomme værdier
  Object.keys(merged).forEach((k) => {
    if (merged[k] === "" || merged[k] === null || merged[k] === undefined) delete merged[k];
  });
  if (Object.keys(merged).length === 0) {
    delete state.aoNotes[primary];
  } else {
    state.aoNotes[primary] = merged;
  }
  saveJson(AO_NOTES_KEY, state.aoNotes);
}

// Migration: kør ved load. Flyt alias-noter og overrides til primary CVR
function migrateAliases() {
  let changed = false;
  Object.entries(CVR_ALIASES).forEach(([alias, primary]) => {
    // Notes
    if (state.aoNotes[alias]) {
      if (!state.aoNotes[primary] || Object.keys(state.aoNotes[primary]).length === 0) {
        state.aoNotes[primary] = state.aoNotes[alias];
      } else {
        // Merge · behold primary's felter · fyld op med alias'
        state.aoNotes[primary] = { ...state.aoNotes[alias], ...state.aoNotes[primary] };
      }
      delete state.aoNotes[alias];
      changed = true;
    }
    // Overrides
    if (state.aoOverrides[alias]) {
      state.aoOverrides[primary] = state.aoOverrides[primary] || state.aoOverrides[alias];
      delete state.aoOverrides[alias];
      changed = true;
    }
    // Close months
    if (state.closeMonths[alias]) {
      state.closeMonths[primary] = state.closeMonths[primary] || state.closeMonths[alias];
      delete state.closeMonths[alias];
      changed = true;
    }
    // Decl types
    if (state.aoDeclTypes[alias]) {
      state.aoDeclTypes[primary] = state.aoDeclTypes[primary] || state.aoDeclTypes[alias];
      delete state.aoDeclTypes[alias];
      changed = true;
    }
  });
  if (changed) {
    saveJson(AO_NOTES_KEY, state.aoNotes);
    saveJson(AO_OVERRIDES_KEY, state.aoOverrides);
    saveJson(CLOSE_MONTHS_KEY, state.closeMonths);
    saveJson(AO_DECL_TYPES_KEY, state.aoDeclTypes);
  }
}

function getAoDeclTypes(cvr) {
  return state.aoDeclTypes[cvr] || { audits: true, reviews: true, extended_reviews: true, assistance: true };
}
function setAoDeclType(cvr, type, enabled) {
  const current = getAoDeclTypes(cvr);
  const updated = { ...current, [type]: enabled };
  if (!Object.values(updated).some(Boolean)) return; // Minimum én type skal være valgt
  state.aoDeclTypes[cvr] = updated;
  saveJson(AO_DECL_TYPES_KEY, state.aoDeclTypes);
}

function effectiveDeclarationsAndExpand(ao) {
  const t = getAoDeclTypes(ao.cvr);
  const decl = (t.audits ? ao.audits : 0) + (t.reviews ? ao.reviews : 0) + (t.extended_reviews ? ao.extendedReviews : 0) + (t.assistance ? ao.assistance : 0);
  const targetAtRate = Math.round(decl * ao.rate);
  const expandSmvs = Math.max(targetAtRate - ao.active, 0);
  return { decl, targetAtRate, expandSmvs };
}

function contributionOf(ao) {
  const closeMonth = getCloseMonth(ao.cvr, ao.segment);
  const aoDeadline = getAoDeadline(ao.cvr, ao.segment);
  const price = getAoPrice(ao.cvr, ao);
  const factor = erosionFactor(ao.segment, closeMonth, aoDeadline);
  const eff = effectiveDeclarationsAndExpand(ao);
  let bidrag = eff.expandSmvs * price * factor;
  bidrag *= SCENARIO_MULTIPLIERS[state.scenario] ?? 1;
  if (ao.isGt) bidrag *= GT_MULTIPLIERS[state.gtScenario] ?? 1;
  return { bidrag, factor, price, closeMonth, expandSmvs: eff.expandSmvs, effectiveDecl: eff.decl };
}

function getAoPrice(cvr, ao) {
  const ov = state.aoOverrides[cvr];
  if (ov && ov.price != null && ov.price !== "") return num(ov.price);
  if (ao.isGt) return num(document.getElementById("gtPrice").value);
  return num(document.getElementById("newSmvPrice").value);
}
function getAoDeadline(cvr, segment) {
  const ov = state.aoOverrides[cvr];
  if (ov && ov.deadline) return ov.deadline;
  return state.deadlines[segment];
}
function setAoOverride(cvr, field, value) {
  const existing = state.aoOverrides[cvr] || {};
  if (value === null || value === "" || value === undefined) {
    delete existing[field];
  } else {
    existing[field] = value;
  }
  if (Object.keys(existing).length === 0) {
    delete state.aoOverrides[cvr];
  } else {
    state.aoOverrides[cvr] = existing;
  }
  saveJson(AO_OVERRIDES_KEY, state.aoOverrides);
}

// ---- Pool builder (de-dup med prioritet + slet + konsolidér aliases) ----
function buildPool() {
  const segmentMap = new Map();
  const addToSeg = (cvr, segment) => {
    const primary = resolveCvr(cvr);
    if (SLET_CVRS.includes(primary)) return; // Slet fra pipeline
    if (!segmentMap.has(primary)) segmentMap.set(primary, segment);
  };
  EXISTING_CLIENT_CVRS.forEach((c) => addToSeg(c, "existing"));
  TOP_PROSPECT_GROUPS.forEach((g) => g.cvrs.forEach((c) => addToSeg(c, "top")));
  ACCRU_GROUPS.forEach((g) => g.cvrs.forEach((c) => addToSeg(c, "accru")));
  RGD_GROUPS.forEach((g) => g.cvrs.forEach((c) => addToSeg(c, "rgd")));

  // Byg omvendt map: primary → [aliases]
  const aliasesByPrimary = new Map();
  Object.entries(CVR_ALIASES).forEach(([alias, primary]) => {
    if (!aliasesByPrimary.has(primary)) aliasesByPrimary.set(primary, []);
    aliasesByPrimary.get(primary).push(alias);
  });

  const pool = [];
  segmentMap.forEach((segment, primaryCvr) => {
    // Saml data fra primary + evt aliases
    const cvrs = [primaryCvr, ...(aliasesByPrimary.get(primaryCvr) || [])];
    const rows = cvrs.map((c) => state.masterMap.get(c)).filter(Boolean);
    if (rows.length === 0) return;
    const decl = rows.reduce((s, r) => s + num(r.total_declarations), 0);
    if (decl <= 0) return;
    const active = cvrs.reduce((s, c) => s + (state.connections.get(c) || 0), 0);
    const rate = state.rates[segment];
    const targetAtRate = Math.round(decl * rate);
    const expandSmvs = Math.max(targetAtRate - active, 0);
    const isGt = primaryCvr === GT_CVR;
    const displayName = CANONICAL_NAMES[primaryCvr] || rows[0].accounting_office_name || primaryCvr;
    pool.push({
      cvr: primaryCvr,
      name: displayName,
      segment,
      rate,
      declarations: decl,
      active,
      analysed: rows.reduce((s, r) => s + num(r.distinct_clients_analysed), 0),
      adoption: rows.reduce((s, r) => s + num(r.adoption_score), 0) / rows.length,
      audits: rows.reduce((s, r) => s + num(r.audits), 0),
      reviews: rows.reduce((s, r) => s + num(r.reviews), 0),
      extendedReviews: rows.reduce((s, r) => s + num(r.extended_reviews), 0),
      assistance: rows.reduce((s, r) => s + num(r.assistance), 0),
      targetAtRate,
      expandSmvs,
      isGt,
      consolidatedFrom: cvrs.length > 1 ? cvrs : null,
    });
  });
  return pool;
}

// ---- Erosion beregning ----
// Deadline måned for segment. Hvis luk-måned = deadline → 100%.
// +1 måned = index 1, +2 = 2, ... "ikke_i_aar" = sidste index (0%)
function erosionFactor(segment, closeMonth, deadlineOverride = null) {
  if (closeMonth === "ikke_i_aar") return state.erosion[segment][5];
  const deadline = deadlineOverride || state.deadlines[segment];
  const deadlineIdx = MONTHS.indexOf(deadline);
  const closeIdx = MONTHS.indexOf(closeMonth);
  if (deadlineIdx < 0 || closeIdx < 0) return 0;
  const monthsPast = closeIdx - deadlineIdx;
  if (monthsPast <= 0) return state.erosion[segment][0]; // deadline eller før = 100%
  const idx = Math.min(monthsPast, 5);
  return state.erosion[segment][idx];
}

function getCloseMonth(cvr, segment) {
  return state.closeMonths[cvr] || state.deadlines[segment];
}

// ---- Render ----
function renderErosionTable() {
  const tbody = document.querySelector("#erosionTable tbody");
  tbody.innerHTML = SEGMENTS.map((seg) => `
    <tr data-segment="${seg}">
      <td>${SEGMENT_LABELS[seg]}</td>
      <td>${(state.erosion[seg][0] * 100).toFixed(0)}%</td>
      ${[1,2,3,4,5].map((i) => `
        <td><input type="number" min="0" max="100" step="5" value="${(state.erosion[seg][i] * 100).toFixed(0)}" data-erosion-seg="${seg}" data-erosion-idx="${i}" />%</td>
      `).join("")}
    </tr>
  `).join("");
}

function renderDeadlineTable() {
  const tbody = document.querySelector("#deadlineTable tbody");
  tbody.innerHTML = SEGMENTS.map((seg) => `
    <tr>
      <td>${SEGMENT_LABELS[seg]}</td>
      <td>${(state.rates[seg] * 100).toFixed(0)}%</td>
      <td>
        <select data-deadline-seg="${seg}">
          ${["jul","aug","sep","okt","nov","dec"].map((m) => `<option value="${m}" ${state.deadlines[seg] === m ? "selected" : ""}>${MONTH_LABELS[m]}</option>`).join("")}
        </select>
      </td>
    </tr>
  `).join("");
}

function renderAoTable() {
  const tbody = document.getElementById("aoTableBody");
  const newSmvPrice = num(document.getElementById("newSmvPrice").value);
  const gtPrice = num(document.getElementById("gtPrice").value);

  // Sortér: segment (prioritet) → potentiale desc
  const segPriority = { existing: 0, top: 1, next20: 2, accru: 3, rgd: 4 };
  const sorted = [...state.pool].sort((a, b) => {
    const sd = segPriority[a.segment] - segPriority[b.segment];
    if (sd !== 0) return sd;
    return b.expandSmvs - a.expandSmvs;
  });

  const rowHtml = sorted.map((ao) => {
    const c = contributionOf(ao);
    const closeMonth = c.closeMonth;
    const price = c.price;
    const expandSmvs = c.expandSmvs;
    const maxArr = expandSmvs * price;
    const factor = c.factor;
    const bidrag = c.bidrag;
    const erosionClass = factor >= 0.99 ? "erosion-100" : factor >= 0.5 ? "erosion-mid" : factor > 0 ? "erosion-low" : "erosion-0";
    const hasOverride = state.aoOverrides[ao.cvr];
    const status = getAoStatus(ao.cvr);
    const dot = status.trafiklys ? `<span class="tl-dot tl-${status.trafiklys}" title="${status.trafiklys === 'green' ? 'Grøn · god sandsynlighed' : status.trafiklys === 'yellow' ? 'Gul · i dialog' : 'Rød · i risiko'}"></span>` : "";
    const noteDot = status.note ? `<span class="note-icon" title="Har note">✏</span>` : "";
    return `<tr data-cvr="${ao.cvr}" onclick="openAoModal('${ao.cvr}')">
      <td><span class="seg-badge seg-${ao.segment}">${SEGMENT_LABELS[ao.segment]} ${(ao.rate*100).toFixed(0)}%</span></td>
      <td>${dot}${ao.name}${ao.isGt ? " ⭐" : ""}${hasOverride ? ' <span class="ao-override-badge">Tilpasset</span>' : ""}${noteDot}</td>
      <td class="numeric">${dkNum.format(ao.active)}</td>
      <td class="numeric">${dkNum.format(expandSmvs)}</td>
      <td class="numeric">${dkCur.format(maxArr)}</td>
      <td onclick="event.stopPropagation()">
        <select class="close-select" data-close-cvr="${ao.cvr}">
          ${MONTHS.map((m) => `<option value="${m}" ${closeMonth === m ? "selected" : ""}>${MONTH_LABELS[m]}</option>`).join("")}
        </select>
      </td>
      <td class="numeric"><span class="erosion-tag ${erosionClass}">${(factor * 100).toFixed(0)}%</span></td>
      <td class="numeric"><strong>${dkCur.format(bidrag)}</strong></td>
    </tr>`;
  }).join("");
  tbody.innerHTML = rowHtml;

  // Total
  const total = sorted.reduce((s, ao) => s + contributionOf(ao).bidrag, 0);
  const gap = num(document.getElementById("targetArr").value) - num(document.getElementById("currentArr").value);
  const totalEl = document.getElementById("totalForecast");
  totalEl.textContent = dkCur.format(total);
  totalEl.className = "value " + (total >= gap ? "ok" : total >= gap * 0.8 ? "warn" : "bad");
  const statusEl = document.getElementById("totalStatus");
  if (total >= gap) {
    statusEl.textContent = `✓ +${dkCur.format(total - gap)}`;
    statusEl.className = "value ok";
  } else {
    statusEl.textContent = `Mangler ${dkCur.format(gap - total)}`;
    statusEl.className = "value " + (total >= gap * 0.8 ? "warn" : "bad");
  }
}

function renderKpis() {
  const currentArr = num(document.getElementById("currentArr").value);
  const targetArr = num(document.getElementById("targetArr").value);
  document.getElementById("kpiCurrent").textContent = dkKKr(currentArr);
  document.getElementById("kpiTarget").textContent = dkKKr(targetArr);
  document.getElementById("kpiGap").textContent = dkKKr(targetArr - currentArr);
  document.getElementById("kpiPoolSize").textContent = state.pool.length;
}

function renderMonthlyForecast() {
  const container = document.getElementById("monthlyForecast");
  if (!container) return;

  // Aggregér bidrag pr luk-måned + tæl AOs i hvert erosion-band
  const monthData = {};
  MONTHS.forEach((m) => (monthData[m] = { total: 0, aos: 0, good: 0, warn: 0, bad: 0, zero: 0 }));

  state.pool.forEach((ao) => {
    const c = contributionOf(ao);
    monthData[c.closeMonth].total += c.bidrag;
    monthData[c.closeMonth].aos++;
    if (c.factor >= 0.99) monthData[c.closeMonth].good++;
    else if (c.factor >= 0.5) monthData[c.closeMonth].warn++;
    else if (c.factor > 0) monthData[c.closeMonth].bad++;
    else monthData[c.closeMonth].zero++;
  });

  const maxVal = Math.max(...MONTHS.map((m) => monthData[m].total), 1);

  container.innerHTML = MONTHS.map((m) => {
    const d = monthData[m];
    const heightPct = (d.total / maxVal) * 100;
    let barClass = "zero";
    if (d.total > 0) {
      if (d.good > d.warn + d.bad) barClass = "good";
      else if (d.warn > d.bad) barClass = "warn";
      else barClass = "bad";
    }
    const isSelected = state.selectedMonth === m;
    return `<div class="month-column ${isSelected ? 'selected' : ''}" onclick="selectMonth('${m}')">
      <div class="month-bar-wrap">
        <div class="month-bar ${barClass}" style="height:${heightPct}%">${d.total > 0 ? dkKKr(d.total) : ''}</div>
      </div>
      <div class="month-label">${MONTH_LABELS[m]}</div>
      <div class="month-value"><strong>${d.aos}</strong> ${d.aos === 1 ? 'hus' : 'huse'}</div>
    </div>`;
  }).join("");

  // Detail-panel: hvis en måned er valgt, vis AOer i den måned
  const details = document.getElementById("monthlyDetails");
  if (state.selectedMonth) {
    const month = state.selectedMonth;
    const aosInMonth = state.pool.filter((ao) => getCloseMonth(ao.cvr, ao.segment) === month);
    if (aosInMonth.length === 0) {
      details.innerHTML = `<strong>${MONTH_LABELS[month]}</strong>: ingen revisionshuse lukker denne måned.`;
    } else {
      const list = aosInMonth
        .map((ao) => {
          const c = contributionOf(ao);
          return { name: ao.name, segment: ao.segment, factor: c.factor, bidrag: c.bidrag };
        })
        .sort((a, b) => b.bidrag - a.bidrag);
      const total = list.reduce((s, x) => s + x.bidrag, 0);
      details.innerHTML = `<strong>${MONTH_LABELS[month]}</strong>: ${list.length} ${list.length === 1 ? 'hus' : 'huse'} · Forventet Ny ARR ${dkCur.format(total)}<br>
        ${list.map((x) => `<span style="display:inline-block;margin:4px 8px 4px 0;padding:3px 8px;background:white;border:1px solid var(--border);border-radius:4px">${x.name} <em style="color:var(--muted)">(${SEGMENT_LABELS[x.segment]} · realisering ${(x.factor*100).toFixed(0)}%)</em> <strong>${dkCur.format(x.bidrag)}</strong></span>`).join("")}`;
    }
    details.classList.remove("hidden");
  } else {
    details.innerHTML = `<em>Klik en søjle for at se hvilke revisionshuse der bidrager den måned.</em>`;
  }
}

function selectMonth(m) {
  state.selectedMonth = state.selectedMonth === m ? null : m;
  renderMonthlyForecast();
}
window.selectMonth = selectMonth;

function rerender() {
  state.pool = buildPool();
  renderKpis();
  renderAoTable();
  renderMonthlyForecast();
}

// ---- AO Modal ----
function openAoModal(cvr) {
  const ao = state.pool.find((p) => p.cvr === cvr);
  if (!ao) return;
  const c = contributionOf(ao);
  const price = c.price;
  const closeMonth = c.closeMonth;
  const factor = c.factor;
  const bidrag = c.bidrag;
  const investering = c.expandSmvs * price;
  const maxArr = investering;
  const roi = investering > 0 ? bidrag / investering : null;

  const ov = state.aoOverrides[cvr] || {};
  const priceOverridden = ov.price != null && ov.price !== "";
  const deadlineOverridden = ov.deadline != null && ov.deadline !== "";
  const defaultPrice = ao.isGt ? num(document.getElementById("gtPrice").value) : num(document.getElementById("newSmvPrice").value);
  const defaultDeadline = state.deadlines[ao.segment];

  document.getElementById("modalTitle").textContent = ao.name;
  document.getElementById("modalSubtitle").textContent = `CVR ${ao.cvr} · ${SEGMENT_LABELS[ao.segment]} (${(ao.rate*100).toFixed(0)}% rate)`;

  const status = getAoStatus(cvr);
  const tl = status.trafiklys || "";
  const note = status.note || "";
  const declTypes = getAoDeclTypes(cvr);
  const eff = effectiveDeclarationsAndExpand(ao);
  const effectiveDecl = eff.decl;

  document.getElementById("modalBody").innerHTML = `
    <div class="modal-section">
      <h3>Status og note</h3>
      <div class="tl-buttons">
        <button class="tl-btn tl-green ${tl === 'green' ? 'active' : ''}" data-tl-btn="green">🟢 Grøn · god sandsynlighed</button>
        <button class="tl-btn tl-yellow ${tl === 'yellow' ? 'active' : ''}" data-tl-btn="yellow">🟡 Gul · i dialog</button>
        <button class="tl-btn tl-red ${tl === 'red' ? 'active' : ''}" data-tl-btn="red">🔴 Rød · i risiko</button>
        <button class="tl-btn tl-clear ${!tl ? 'active' : ''}" data-tl-btn="">Ryd</button>
      </div>
      <textarea class="ao-note" data-note-cvr="${cvr}" placeholder="Skriv note: hvem har jeg talt med, hvad er næste skridt, hvad blokerer...">${note.replace(/</g, "&lt;")}</textarea>
    </div>

    <div class="modal-section">
      <h3>Fakta</h3>
      <div class="stat-grid">
        <div class="stat"><span>Aktive Brugervirksomheder på Crediwire</span><strong>${dkNum.format(ao.active)}</strong></div>
        <div class="stat"><span>Total antal erklæringer</span><strong>${dkNum.format(ao.declarations)}</strong></div>
        <div class="stat"><span>Analyserede Brugervirksomheder</span><strong>${dkNum.format(ao.analysed)}</strong></div>
      </div>
    </div>

    <div class="modal-section">
      <h3>Erklæringstyper (vælg dem der skal med i beregningen)</h3>
      <div class="decl-types">
        <label class="decl-type-item">
          <input type="checkbox" data-decl-type="audits" ${declTypes.audits ? 'checked' : ''} />
          <span class="decl-type-label">Revisionspåtegning</span>
          <span class="decl-type-count">${dkNum.format(ao.audits)}</span>
        </label>
        <label class="decl-type-item">
          <input type="checkbox" data-decl-type="reviews" ${declTypes.reviews ? 'checked' : ''} />
          <span class="decl-type-label">Review</span>
          <span class="decl-type-count">${dkNum.format(ao.reviews)}</span>
        </label>
        <label class="decl-type-item">
          <input type="checkbox" data-decl-type="extended_reviews" ${declTypes.extended_reviews ? 'checked' : ''} />
          <span class="decl-type-label">Udvidet gennemgang</span>
          <span class="decl-type-count">${dkNum.format(ao.extendedReviews)}</span>
        </label>
        <label class="decl-type-item">
          <input type="checkbox" data-decl-type="assistance" ${declTypes.assistance ? 'checked' : ''} />
          <span class="decl-type-label">Assistanceerklæring</span>
          <span class="decl-type-count">${dkNum.format(ao.assistance)}</span>
        </label>
      </div>
      <div class="decl-sum">Aktiv sum: <strong>${dkNum.format(effectiveDecl)}</strong> af ${dkNum.format(ao.declarations)} · ${((effectiveDecl / (ao.declarations || 1)) * 100).toFixed(0)}%</div>
    </div>

    <div class="modal-section">
      <h3>Antagelser for denne AO</h3>
      <div class="ao-overrides">
        <label class="ao-override-field">
          <span>Pris pr Brugervirksomhed (default ${defaultPrice} kr)</span>
          <input type="number" min="0" step="50" placeholder="${defaultPrice}" value="${priceOverridden ? ov.price : ''}" data-modal-field="price" />
          <small>${priceOverridden ? 'Brugerdefineret' : 'Bruger global'}</small>
        </label>
        <label class="ao-override-field">
          <span>Deadline (default ${MONTH_LABELS[defaultDeadline]})</span>
          <select data-modal-field="deadline">
            <option value="">Brug segment-default (${MONTH_LABELS[defaultDeadline]})</option>
            ${["jul","aug","sep","okt","nov","dec"].map(m => `<option value="${m}" ${ov.deadline === m ? "selected" : ""}>${MONTH_LABELS[m]}</option>`).join("")}
          </select>
          <small>${deadlineOverridden ? 'Brugerdefineret' : 'Bruger segment-default'}</small>
        </label>
        <label class="ao-override-field">
          <span>Forventet luk-måned</span>
          <select data-modal-field="closeMonth">
            ${MONTHS.map(m => `<option value="${m}" ${closeMonth === m ? "selected" : ""}>${MONTH_LABELS[m]}</option>`).join("")}
          </select>
          <small>Standard = deadline måned</small>
        </label>
      </div>
    </div>

    <div class="modal-section">
      <h3>Business Case ved luk i ${MONTH_LABELS[closeMonth]}</h3>
      <div class="stat-grid">
        <div class="stat"><span>Brugervirks. ved ${(ao.rate*100).toFixed(0)}% mål</span><strong>${dkNum.format(eff.expandSmvs)}</strong></div>
        <div class="stat"><span>Mulig ny ARR ved mål</span><strong>${dkCur.format(eff.expandSmvs * price)}</strong></div>
        <div class="stat"><span>Realiseringsgrad</span><strong>${(factor*100).toFixed(0)}%</strong></div>
        <div class="stat"><span>Forventet Ny ARR</span><strong style="color:var(--good)">${dkCur.format(bidrag)}</strong></div>
        <div class="stat"><span>Investering (expand-only)</span><strong>${dkCur.format(eff.expandSmvs * price)}</strong></div>
        <div class="stat"><span>ROI</span><strong>${roi === null ? "–" : roi.toFixed(1) + "x"}</strong></div>
      </div>
    </div>

    <div class="modal-actions">
      <a class="btn primary" href="index.html?ao=${ao.cvr}" target="_blank" title="Åbn fuld regnemaskine">🔗 Åbn i Business Case Regnemaskine</a>
      ${(priceOverridden || deadlineOverridden) ? `<button class="btn" onclick="resetAoOverrides('${cvr}')">Nulstil overrides</button>` : ''}
      <button class="btn" onclick="closeModal()">Luk</button>
    </div>
  `;

  // Bind modal input handlers
  document.querySelectorAll('[data-modal-field]').forEach((el) => {
    el.addEventListener('change', (e) => {
      const field = e.target.dataset.modalField;
      const v = e.target.value.trim();
      if (field === 'closeMonth') {
        state.closeMonths[cvr] = v;
        saveJson(CLOSE_MONTHS_KEY, state.closeMonths);
      } else {
        setAoOverride(cvr, field, v === '' ? null : (field === 'price' ? Number(v) : v));
      }
      rerender();
      openAoModal(cvr);
    });
  });

  // Trafiklys-knapper
  document.querySelectorAll('[data-tl-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.tlBtn;
      setAoStatus(cvr, { trafiklys: val || null });
      rerender();
      openAoModal(cvr);
    });
  });
  // Note-tekstområde
  const noteEl = document.querySelector(`[data-note-cvr="${cvr}"]`);
  if (noteEl) {
    noteEl.addEventListener('input', (e) => {
      setAoStatus(cvr, { note: e.target.value });
      // Genrender ikke modal ved hvert tastetryk (mister fokus) · kun tabellen
      renderAoTable();
    });
  }

  // Erklærings-checkboxes
  document.querySelectorAll('[data-decl-type]').forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const type = e.target.dataset.declType;
      setAoDeclType(cvr, type, e.target.checked);
      rerender();
      openAoModal(cvr);
    });
  });

  document.getElementById("modal").classList.add("open");
}

function resetAoOverrides(cvr) {
  delete state.aoOverrides[cvr];
  saveJson(AO_OVERRIDES_KEY, state.aoOverrides);
  rerender();
  openAoModal(cvr);
}
window.resetAoOverrides = resetAoOverrides;

function closeModal(event) {
  if (event && event.target.id !== "modal" && event.target.closest(".modal") && !event.target.classList.contains("close-btn")) return;
  document.getElementById("modal").classList.remove("open");
}

window.openAoModal = openAoModal;
window.closeModal = closeModal;

// ---- Init ----
// ---- Eksport / import af alle mine notater ----
function exportBackup() {
  const backup = {
    savedAt: new Date().toISOString(),
    notes: state.aoNotes,
    overrides: state.aoOverrides,
    closeMonths: state.closeMonths,
    declTypes: state.aoDeclTypes,
    scenario: state.scenario,
    gtScenario: state.gtScenario,
    erosion: state.erosion,
    deadlines: state.deadlines,
    rates: state.rates,
  };
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `timeline-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const backup = JSON.parse(e.target.result);
      if (!confirm(`Gendan backup fra ${backup.savedAt || 'ukendt dato'}? Dine nuværende notater overskrives.`)) return;
      if (backup.notes) { state.aoNotes = backup.notes; saveJson(AO_NOTES_KEY, backup.notes); }
      if (backup.overrides) { state.aoOverrides = backup.overrides; saveJson(AO_OVERRIDES_KEY, backup.overrides); }
      if (backup.closeMonths) { state.closeMonths = backup.closeMonths; saveJson(CLOSE_MONTHS_KEY, backup.closeMonths); }
      if (backup.declTypes) { state.aoDeclTypes = backup.declTypes; saveJson(AO_DECL_TYPES_KEY, backup.declTypes); }
      if (backup.scenario) { state.scenario = backup.scenario; localStorage.setItem(SCENARIO_KEY, backup.scenario); }
      if (backup.gtScenario) { state.gtScenario = backup.gtScenario; localStorage.setItem(GT_SCENARIO_KEY, backup.gtScenario); }
      if (backup.erosion) { state.erosion = backup.erosion; saveJson(EROSION_KEY, backup.erosion); }
      if (backup.deadlines) { state.deadlines = backup.deadlines; saveJson(DEADLINES_KEY, backup.deadlines); }
      if (backup.rates) { state.rates = backup.rates; saveJson(RATES_KEY, backup.rates); }
      alert(`Gendannet ${Object.keys(backup.notes || {}).length} noter. Genindlæser side...`);
      location.reload();
    } catch (err) {
      alert("Kunne ikke læse filen: " + err.message);
    }
  };
  reader.readAsText(file);
}

async function init() {
  state.aoMaster = await loadCsv("ao_master.csv");
  state.aoMaster.forEach((r) => state.masterMap.set(String(r.accounting_office_cvr).trim(), r));
  const conns = await loadCsv("ao_connections_current.csv");
  conns.forEach((r) => state.connections.set(String(r.accounting_office_cvr).trim(), num(r.active_erp_connections)));

  // Konsoliderings-migration: flyt notes/overrides fra alias CVRs til primary
  migrateAliases();

  renderErosionTable();
  renderDeadlineTable();

  // Erosion input listeners
  document.querySelectorAll("[data-erosion-seg]").forEach((inp) => {
    inp.addEventListener("input", (e) => {
      const seg = e.target.dataset.erosionSeg;
      const idx = Number(e.target.dataset.erosionIdx);
      state.erosion[seg][idx] = num(e.target.value) / 100;
      saveJson(EROSION_KEY, state.erosion);
      rerender();
    });
  });
  // Deadline listeners
  document.querySelectorAll("[data-deadline-seg]").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      state.deadlines[e.target.dataset.deadlineSeg] = e.target.value;
      saveJson(DEADLINES_KEY, state.deadlines);
      rerender();
    });
  });
  // Priser + ARR
  ["newSmvPrice", "gtPrice", "currentArr", "targetArr"].forEach((id) => {
    document.getElementById(id).addEventListener("input", rerender);
  });
  // Close-month pr AO (event delegation på table body)
  document.getElementById("aoTableBody").addEventListener("change", (e) => {
    if (e.target.classList.contains("close-select")) {
      const cvr = e.target.dataset.closeCvr;
      state.closeMonths[cvr] = e.target.value;
      saveJson(CLOSE_MONTHS_KEY, state.closeMonths);
      rerender();
    }
  });
  // Modal luk med escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Scenarie-knapper
  document.getElementById("scenarioBtns")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-scenario]");
    if (!btn) return;
    state.scenario = btn.dataset.scenario;
    localStorage.setItem(SCENARIO_KEY, state.scenario);
    document.querySelectorAll("#scenarioBtns button").forEach((b) => b.classList.toggle("active", b === btn));
    rerender();
  });
  document.getElementById("gtScenarioBtns")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gt]");
    if (!btn) return;
    state.gtScenario = btn.dataset.gt;
    localStorage.setItem(GT_SCENARIO_KEY, state.gtScenario);
    document.querySelectorAll("#gtScenarioBtns button").forEach((b) => b.classList.toggle("active", b === btn));
    rerender();
  });
  // Sæt initial active på baseret på loaded state
  document.querySelectorAll("#scenarioBtns button").forEach((b) => b.classList.toggle("active", b.dataset.scenario === state.scenario));
  document.querySelectorAll("#gtScenarioBtns button").forEach((b) => b.classList.toggle("active", b.dataset.gt === state.gtScenario));

  // Eksport / import
  document.getElementById("exportBtn")?.addEventListener("click", exportBackup);
  document.getElementById("importBtn")?.addEventListener("click", () => document.getElementById("importFile")?.click());
  document.getElementById("importFile")?.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (f) importBackup(f);
    e.target.value = ""; // reset så samme fil kan vælges igen
  });

  rerender();
}

init().catch((e) => {
  document.body.innerHTML = `<main><h1>Kunne ikke starte timeline</h1><p>${e.message}</p></main>`;
});
