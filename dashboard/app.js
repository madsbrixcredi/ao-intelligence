const DATA_PATH = "../data/processed/";
const PARTIAL_MONTH = "2026-06";
const HOURS_PER_FTE = 1924;
const EXISTING_CLIENTS_FILTER = "__existing_clients";
const TOP_PROSPECTS_FILTER = "__top_prospects";
const NEW_PROSPECTS_FILTER = "__new_prospects";
const NEXT_FOCUS_FILTER = "__next_focus";
const RGD_FILTER = "__rgd";
const EXISTING_CLIENT_CVRS = [
  "34209936",
  "35486178",
  "27525989",
  "16645699",
  "44282380",
  "36029374",
  "26717671",
  "10019699",
  "32676421",
  "34480370",
  "34953619",
  "39463113",
];
const TOP_PROSPECT_GROUPS = [
  { name: "Beierholm", cvrs: ["32895468"] },
  { name: "Albjerg", cvrs: ["35382879"] },
  { name: "PKF", cvrs: ["14119299"] },
  { name: "Piaster", cvrs: ["25160037"] },
  { name: "Redmark", cvrs: ["29442789", "13865639"] },
  { name: "Martinsen", cvrs: ["32285201", "10130115"] },
  { name: "RSM", cvrs: ["25492145"] },
  { name: "Tal & Tanker", cvrs: ["37315664"] },
  { name: "Inforevision", cvrs: ["19263096"] },
  { name: "Roesgaard", cvrs: ["37543128"] },
  { name: "Christensen Kjærulff", cvrs: ["15915641"] },
  { name: "Baker Tilly", cvrs: ["35257691"] },
  { name: "Aaen & Co", cvrs: ["33241763"] },
  { name: "Sønderjyllands Revision", cvrs: ["18061635"] },
  { name: "Addere", cvrs: ["34589992"] },
  { name: "Dansk Revision Frederikssund", cvrs: ["86141019"] },
  { name: "VH Revision", cvrs: ["17871080"] },
  { name: "Andersen Revision", cvrs: ["32326706"] },
  { name: "Midt-revi", cvrs: ["39065797"] },
  { name: "Kallermann", cvrs: ["30195264"] },
  { name: "Rödl & Partner", cvrs: ["39188678"] },
  { name: "Krøyer Pedersen", cvrs: ["89224918", "45922391"] },
  { name: "Baagøe Schou", cvrs: ["21148148"] },
  { name: "Dansk Revision Nyborg / Slagelse", cvrs: ["29919801"] },
  { name: "Dansk Revision Holbæk", cvrs: ["28853343"] },
  { name: "Dansk Revision Søborg", cvrs: ["14649905"] },
  { name: "Lars-olsen", cvrs: ["37135119"] },
  { name: "Revisionscentret", cvrs: ["29695636", "38951394", "18936305", "10352231", "26279534", "13976295", "41578513"] },
];
const TOP_PROSPECT_CVRS = TOP_PROSPECT_GROUPS.flatMap((prospect) => prospect.cvrs);
const NEW_PROSPECT_GROUPS = [
  { name: "Albjerg", cvrs: ["35382879"] },
  { name: "Bille & Buch-Andersen", cvrs: ["18282046"] },
  { name: "JS Revision", cvrs: ["37999687"] },
  { name: "Nærrevision", cvrs: ["17524305"] },
  { name: "Mernø Revision", cvrs: ["32344720"] },
  { name: "Revimidt", cvrs: ["34480370"] },
  { name: "Revision Sjælland", cvrs: ["28309791"] },
  { name: "Robæk Revision", cvrs: ["33946406"] },
  { name: "Sønderup", cvrs: ["31824559", "27905072", "45907880"] },
  { name: "SR Revision", cvrs: ["19536890"] },
  { name: "TJEK Revision & Rådgivning", cvrs: ["36563877"] },
  { name: "WKRAGH", cvrs: ["16206407"] },
];
const NEW_PROSPECT_CVRS = NEW_PROSPECT_GROUPS.flatMap((prospect) => prospect.cvrs);
const RGD_GROUPS = [
  { name: "Albjerg", cvrs: ["35382879"] },
  { name: "Attent", cvrs: ["36427205"] },
  { name: "Baagøe Schou", cvrs: ["21148148"] },
  { name: "Buus Jensen", cvrs: ["36029374"] },
  { name: "Christensen Kjærulff", cvrs: ["15915641"] },
  { name: "Grant Thornton", cvrs: ["34209936"] },
  { name: "Kovsted & Skovgård", cvrs: ["38751646"] },
  { name: "Krøyer Pedersen", cvrs: ["89224918", "45922391"] },
  { name: "Martinsen", cvrs: ["32285201"] },
  { name: "Nejstgaard & Vetlov", cvrs: ["12868693"] },
  { name: "Partner Revision", cvrs: ["15807776"] },
  { name: "Piaster Revisorerne", cvrs: ["25160037"] },
  { name: "PKF Munkebo Eriksen Funch", cvrs: ["14119299"] },
  { name: "Powered-By", cvrs: ["44282380"] },
  { name: "Redmark", cvrs: ["29442789"] },
  { name: "Revision & Råd", cvrs: ["36923318", "46125894"] },
  { name: "Revisionshuset Tal & Tanker", cvrs: ["37315664"] },
  { name: "RSM", cvrs: ["25492145"] },
  { name: "Slebo Revision", cvrs: ["44984326"] },
  { name: "Sønderjyllands Revision", cvrs: ["18061635"] },
  { name: "Ullits & Winther", cvrs: ["32093272"] },
];
const RGD_CVRS = [...new Set(RGD_GROUPS.flatMap((prospect) => prospect.cvrs))];
const BIG_FOUR_CVRS = [
  "30700228",
  "33946171",
  "35683194",
  "33771231",
  "33773188",
  "33963556",
  "24213714",
  "25578198",
  "25504070",
];
const IMPLEMENTATION_TIMELINES = [
  { label: "30 dage", months: 1 },
  { label: "60 dage", months: 2 },
  { label: "90 dage", months: 3 },
  { label: "6 måneder", months: 6 },
  { label: "12 måneder", months: 12 },
];
const GROUP_FILTERS = {
  [EXISTING_CLIENTS_FILTER]: {
    label: "Eksisterende kunder",
    description: `BO4:BO15 fra Data analysis master sheet · ${EXISTING_CLIENT_CVRS.length} revisionshuse`,
    cvrList: EXISTING_CLIENT_CVRS,
    searchText: "eksisterende kunder existing clients",
  },
  [TOP_PROSPECTS_FILTER]: {
    label: "Top prospects",
    description: `Udvalgt prospect-liste · ${TOP_PROSPECT_CVRS.length} CVR-numre`,
    cvrList: TOP_PROSPECT_CVRS,
    searchText: "top prospects prospect liste prospects",
  },
  [NEW_PROSPECTS_FILTER]: {
    label: "Accru Partners",
    description: `Udvalgt Accru Partners-liste · ${NEW_PROSPECT_CVRS.length} CVR-numre`,
    cvrList: NEW_PROSPECT_CVRS,
    searchText: "accru partners nye prospects ny prospectliste prospects",
  },
  [RGD_FILTER]: {
    label: "RGD",
    description: `Udvalgt RGD-liste · ${RGD_CVRS.length} unikke CVR-numre`,
    cvrList: RGD_CVRS,
    searchText: "rgd revisordanmark gruppen rgd liste",
  },
  [NEXT_FOCUS_FILTER]: {
    label: "Næste 20 fokus",
    description: "Top 20 uden top prospects, eksisterende kunder og Big 4 · sorteret efter potentiale",
    cvrList: () => nextFocusCvrs(),
    searchText: "næste 20 fokus next focus fokusliste focus prospects",
  },
};
let printState = null;

const files = {
  aoMaster: "ao_master.csv",
  users: "user_master.csv",
  monthly: "monthly_activity.csv",
  opportunity: "ao_opportunity.csv",
  risk: "implementation_risk.csv",
  taxonomy: "accounting_office_taxonomy.csv",
  connections: "ao_connections_current.csv",
  monthlyUsers: "monthly_user_activity.csv",
  arrYearwheel: "ao_arr_yearwheel.csv",
  arrYearlyTotals: "ao_arr_yearly_totals.csv",
  arrYearlyDetail: "ao_arr_yearly_detail.csv",
};

const DECLARATION_TYPES = [
  { key: "audits", label: "Revision", dataField: "audits" },
  { key: "reviews", label: "Review", dataField: "reviews" },
  { key: "extended_reviews", label: "Udvidet gennemgang", dataField: "extended_reviews" },
  { key: "assistance", label: "Assistance", dataField: "assistance" },
];

const AO_OVERRIDES_STORAGE_KEY = "aoOverrides_v1";
const ADVANCED_MODE_STORAGE_KEY = "advancedMode_v1";
const FORECAST_STORAGE_KEY = "forecastV2_v1";
const FORECAST_PERIODS_V2 = ["h2_2026", "2027", "2028", "2029"];
const FORECAST_PERIOD_LABEL = { h2_2026: "H2 2026", "2027": "2027", "2028": "2028", "2029": "2029" };
const FORECAST_SCENARIOS = ["conservative", "base", "optimistic"];

function loadForecastV2() {
  try {
    const raw = localStorage.getItem(FORECAST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") return parsed;
  } catch (err) {
    // ignore
  }
  return { base: {}, conservative: {}, optimistic: {} };
}

function saveForecastV2() {
  try {
    localStorage.setItem(FORECAST_STORAGE_KEY, JSON.stringify(state.forecastV2));
  } catch (err) {
    // ignore
  }
}

const TRAJECTORY_OPEN_STORAGE_KEY = "trajectoryOpen_v1";

function loadTrajectoryOpen() {
  try {
    const raw = localStorage.getItem(TRAJECTORY_OPEN_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") {
      return {
        conservative: Boolean(parsed.conservative),
        base: parsed.base !== undefined ? Boolean(parsed.base) : true,
        stretch: Boolean(parsed.stretch),
      };
    }
  } catch (err) {
    // ignore parse errors
  }
  return { conservative: false, base: true, stretch: false };
}

function saveTrajectoryOpen() {
  try {
    localStorage.setItem(TRAJECTORY_OPEN_STORAGE_KEY, JSON.stringify(state.trajectoryOpen));
  } catch (err) {
    // ignore quota errors
  }
}

function loadAdvancedMode() {
  try {
    return localStorage.getItem(ADVANCED_MODE_STORAGE_KEY) === "1";
  } catch (err) {
    return false;
  }
}

function saveAdvancedMode(value) {
  try {
    localStorage.setItem(ADVANCED_MODE_STORAGE_KEY, value ? "1" : "0");
  } catch (err) {
    // ignore
  }
}

function applyAdvancedMode() {
  const enabled = Boolean(state.advancedMode);
  document.body.classList.toggle("advanced-mode", enabled);
  const section = document.getElementById("advancedView");
  if (section) section.hidden = !enabled;
  const toggle = document.getElementById("advancedModeToggle");
  if (toggle) toggle.checked = enabled;
}

function loadAoOverrides() {
  try {
    const raw = localStorage.getItem(AO_OVERRIDES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    return {};
  }
}

function saveAoOverrides() {
  try {
    localStorage.setItem(AO_OVERRIDES_STORAGE_KEY, JSON.stringify(state.aoOverrides));
  } catch (err) {
    // ignore quota errors
  }
}

const state = {
  data: {},
  selectedCvr: "",
  offices: [],
  declarationTypes: { audits: true, reviews: true, extended_reviews: true, assistance: true },
  aoOverrides: loadAoOverrides(),
  aoOverrideTargetCvr: null,
  advancedMode: loadAdvancedMode(),
  trajectoryScenario: "base", // legacy — bevares for backward compatibility
  trajectoryOpen: loadTrajectoryOpen(), // { conservative: bool, base: bool, stretch: bool }
  arrPeriod: "full",
  forecastScenario: "base",
  forecastV2: loadForecastV2(),
  forecastActiveSegment: "existing",
  totalTamPct: 100,
};

// Smart defaults pr. segment baseret på historisk udvikling.
const FORECAST_SMART_DEFAULTS = {
  existing: { growth: 60, churn: 15, note: "Baseret på faktisk 2025→2026: +65% expand, ~15% churn." },
  top_prospects: { conversion: 5, avgArr: 30000, note: "5% konvertering matcher 2025→2026 new biz pace × pipeline-størrelse." },
  next_20: { conversion: 5, avgArr: 25000, note: "Top 20 efter uudnyttet potentiale. Realistisk 5% konvertering." },
  accru: { conversion: 2, avgArr: 20000, note: "Mindre højt-overbevisende pipeline – 2% er konservativt." },
  rgd: { conversion: 2, avgArr: 20000, note: "RGD-netværket har 21 huse, men meget få konkrete tilsagn." },
};

function aoOverrideFor(cvrKey) {
  return state.aoOverrides[cvrKey] || null;
}

function aoOverrideHasAny(cvrKey) {
  const ov = state.aoOverrides[cvrKey];
  return Boolean(ov && Object.keys(ov).length > 0);
}

function setAoOverrides(cvrKey, patch) {
  const existing = state.aoOverrides[cvrKey] || {};
  const merged = { ...existing, ...patch };
  const cleaned = {};
  for (const [k, v] of Object.entries(merged)) {
    if (v !== null && v !== undefined && v !== "") cleaned[k] = v;
  }
  if (Object.keys(cleaned).length === 0) {
    delete state.aoOverrides[cvrKey];
  } else {
    state.aoOverrides[cvrKey] = cleaned;
  }
  saveAoOverrides();
}

function clearAoOverrides(cvrKey) {
  delete state.aoOverrides[cvrKey];
  saveAoOverrides();
}

const dkNumber = new Intl.NumberFormat("da-DK");
const dkDecimal = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 });
const dkCurrency = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
  maximumFractionDigits: 0,
});
const monthFormatter = new Intl.DateTimeFormat("da-DK", { month: "long", year: "numeric" });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
}

async function loadCsv(filename) {
  const response = await fetch(`${DATA_PATH}${filename}`);
  if (!response.ok) throw new Error(`Kunne ikke læse ${filename}`);
  return parseCsv(await response.text());
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function priceNum(value) {
  let text = String(value ?? "").trim().replace(/[^\d.,]/g, "");
  if (!text) return 0;
  if (text.includes(",")) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else if (text.includes(".")) {
    const parts = text.split(".");
    text = parts.at(-1)?.length === 3 ? parts.join("") : text.replace(/\./g, "");
  }
  const parsed = Number(text);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function formatPriceInputById(id) {
  const input = document.getElementById(id);
  if (!input) return;
  const value = priceNum(input.value);
  input.value = value > 0 ? dkNumber.format(value) : "";
}

function cvr(row) {
  return String(row.accounting_office_cvr || "").trim();
}

function monthKey(row) {
  return `${row.year}-${String(row.month).padStart(2, "0")}`;
}

function isCompletedMonth(key) {
  return key < PARTIAL_MONTH;
}

function selectedRows(rows) {
  if (!state.selectedCvr) return rows;
  const selected = selectedCvrSet();
  return rows.filter((row) => selected.has(cvr(row)));
}

function selectedCvrSet() {
  const group = selectedGroupFilter();
  if (group) return new Set(groupCvrs(group));
  return state.selectedCvr ? new Set([state.selectedCvr]) : null;
}

function selectedGroupFilter() {
  return GROUP_FILTERS[state.selectedCvr] || null;
}

function groupCvrs(group) {
  return typeof group.cvrList === "function" ? group.cvrList() : group.cvrList;
}

function groupDescription(group) {
  return typeof group.description === "function" ? group.description() : group.description;
}

function nextFocusCvrs(limit = 20) {
  return nextFocusCandidates(limit).map((office) => office.cvr);
}

function nextFocusCandidates(limit = 20) {
  if (!state.data.aoMaster?.length) return [];
  const connections = connectionMap();
  const { implementationRate } = assumptions();
  const excludedCvrs = new Set([...TOP_PROSPECT_CVRS, ...EXISTING_CLIENT_CVRS, ...BIG_FOUR_CVRS]);
  return state.data.aoMaster
    .map((row) => {
      const rowCvr = cvr(row);
      const declarations = num(row.total_declarations);
      const activeConnections = connections.get(rowCvr)?.active || 0;
      const targetActiveCompanies = Math.round(declarations * implementationRate);
      const missingActiveCompanies = Math.max(targetActiveCompanies - activeConnections, 0);
      return {
        cvr: rowCvr,
        name: officeName(row),
        declarations,
        activeConnections,
        missingActiveCompanies,
      };
    })
    .filter((office) => office.cvr && office.declarations > 0 && !excludedCvrs.has(office.cvr) && !isBigFourName(office.name))
    .sort((a, b) => {
      if (b.missingActiveCompanies !== a.missingActiveCompanies) return b.missingActiveCompanies - a.missingActiveCompanies;
      return b.declarations - a.declarations;
    })
    .slice(0, limit);
}

function isBigFourName(name) {
  const normalized = String(name || "").trim().toLowerCase();
  return (
    normalized === "ey" ||
    normalized.includes("ernst & young") ||
    normalized.includes("ernst and young") ||
    normalized.includes("pricewaterhousecoopers") ||
    normalized.includes("pwc") ||
    normalized.includes("deloitte") ||
    normalized.includes("kpmg")
  );
}

function isGroupFilterSelected() {
  return Boolean(selectedGroupFilter());
}

function isSingleOfficeSelected() {
  return Boolean(state.selectedCvr) && !isGroupFilterSelected();
}

function sum(rows, field) {
  return rows.reduce((total, row) => total + num(row[field]), 0);
}

function pct(value) {
  if (!Number.isFinite(value) || value < 0) return "0,0%";
  return `${(value * 100).toLocaleString("da-DK", { maximumFractionDigits: 1 })}%`;
}

function pctSpaced(value) {
  return pct(value).replace("%", " %");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;
  const label = monthFormatter.format(new Date(year, month - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function axisMonthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;
  const label = new Intl.DateTimeFormat("da-DK", { month: "short" })
    .format(new Date(year, month - 1, 1))
    .replace(".", "");
  return `${label.charAt(0).toUpperCase() + label.slice(1)} ${String(year).slice(-2)}`;
}

function shortMonthName(month) {
  const label = new Intl.DateTimeFormat("da-DK", { month: "short" }).format(new Date(2026, month - 1, 1));
  return label.replace(".", "").charAt(0).toUpperCase() + label.replace(".", "").slice(1);
}

function periodLabel(year, startMonth, endMonth) {
  if (startMonth === endMonth) return `${shortMonthName(endMonth)} ${year}`;
  return `${shortMonthName(startMonth)}-${shortMonthName(endMonth)} ${year}`;
}

function signedPct(value) {
  if (value === null) return "";
  const formatted = `${(value * 100).toLocaleString("da-DK", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
  return value > 0 ? `+${formatted}` : formatted;
}

function ratio(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : 0;
}

function safeGap(total, used) {
  return Math.max(total - used, 0);
}

function uniqueCount(rows, field) {
  return new Set(rows.map((row) => row[field]).filter(Boolean)).size;
}

function connectionMap() {
  const map = new Map();
  for (const row of state.data.connections) {
    map.set(cvr(row), {
      active: num(row.active_erp_connections),
      purchased: num(row.purchased_companies),
    });
  }
  return map;
}

function canonicalNameMap() {
  const map = new Map();
  for (const row of state.data.taxonomy) {
    const key = cvr(row);
    if (!key || map.has(key)) continue;
    map.set(key, row.canonical_accounting_office_name || row.alias_name);
  }
  return map;
}

function officeName(row) {
  const name = row.accounting_office_name || "";
  if (name && name !== "#VALUE!") return name;
  return canonicalNameMap().get(cvr(row)) || name || "Ukendt";
}

function assumptions() {
  const includeAddons = true;
  const includeQuality = true;
  const qualityFactorInput = num(document.getElementById("qualityFactorInput").value);
  const qualityFactor = qualityFactorInput > 0 ? qualityFactorInput : 2;
  const pricePerActiveCompany = priceNum(document.getElementById("pricePerActiveCompanyInput").value);
  const annualReportPrice = priceNum(document.getElementById("annualReportPriceInput")?.value);
  const assistancePrice = priceNum(document.getElementById("assistancePriceInput")?.value);
  return {
    hours: num(document.getElementById("hoursInput").value),
    rate: num(document.getElementById("rateInput").value),
    implementationRate: num(document.getElementById("implementationRateInput").value),
    reportingCustomers: num(document.getElementById("reportingCustomersInput").value),
    reportingHours: num(document.getElementById("reportingHoursInput").value),
    annualReportHours: num(document.getElementById("annualReportHoursInput").value),
    assistanceHours: num(document.getElementById("assistanceHoursInput").value),
    advisoryHours: num(document.getElementById("advisoryHoursInput").value),
    pricePerActiveCompany,
    annualReportPrice,
    assistancePrice,
    qualityFactor,
    includeQuality,
    qualityMultiplier: includeQuality ? qualityFactor : 1,
    includeAddons,
  };
}

function scopeMetrics() {
  const aoRows = selectedRows(state.data.aoMaster);
  const userRows = selectedRows(state.data.users);
  const connections = connectionMap();
  const activeConnections = aoRows.reduce((total, row) => total + (connections.get(cvr(row))?.active || 0), 0);
  const purchasedCompanies = aoRows.reduce((total, row) => total + (connections.get(cvr(row))?.purchased || 0), 0);
  const activationRate = ratio(activeConnections, purchasedCompanies);
  const remainingPurchasedActivation = Math.max(purchasedCompanies - activeConnections, 0);
  const audits = sum(aoRows, "audits");
  const extendedReviews = sum(aoRows, "extended_reviews");
  const reviews = sum(aoRows, "reviews");
  const assistance = sum(aoRows, "assistance");
  const totalDeclarationsAll = sum(aoRows, "total_declarations");
  const types = state.declarationTypes;
  const totalDeclarations =
    (types.audits ? audits : 0) +
    (types.reviews ? reviews : 0) +
    (types.extended_reviews ? extendedReviews : 0) +
    (types.assistance ? assistance : 0);
  const annualReportTasks = audits + extendedReviews + reviews;
  const analysedCompanies = sum(aoRows, "distinct_clients_analysed");
  const totalAnalyses = sum(aoRows, "total_analyses");
  const activeUsers = uniqueCount(userRows.filter((row) => num(row.total_analyses) > 0), "user_email");
  const activeOffices = isSingleOfficeSelected() ? (totalAnalyses > 0 ? 1 : 0) : aoRows.filter((row) => num(row.total_analyses) > 0).length;
  const implementationRateActual = ratio(activeConnections, totalDeclarations);
  const {
    hours,
    rate,
    implementationRate,
    reportingCustomers,
    reportingHours,
    annualReportHours,
    assistanceHours,
    advisoryHours,
    pricePerActiveCompany,
    annualReportPrice,
    assistancePrice,
    qualityFactor,
    qualityMultiplier,
    includeQuality,
    includeAddons,
  } = assumptions();

  const realizedHours = activeConnections * hours;
  const potentialHours = totalDeclarations * hours;
  const realisticPopulation = totalDeclarations * implementationRate;
  const targetActiveCompanies = Math.round(realisticPopulation);
  const missingActivation = Math.max(targetActiveCompanies - activeConnections, 0);
  const realisticHours = targetActiveCompanies * hours;
  // Model B: all four buckets share the same population (today / target / full),
  // except the reporting bucket which can be overridden via the manual
  // "Rapporteringskunder" field (used as-is when > 0).
  const reportPopulationRealized = reportingCustomers > 0 ? reportingCustomers : activeConnections;
  const reportPopulationRealistic = reportingCustomers > 0 ? reportingCustomers : targetActiveCompanies;
  const reportPopulationFull = reportingCustomers > 0 ? reportingCustomers : totalDeclarations;
  const currentAnnualReportTasks = activeConnections;
  const currentAssistanceTasks = activeConnections;
  const targetAnnualReportTasks = targetActiveCompanies;
  const targetAssistanceTasks = targetActiveCompanies;
  const realizedBaseValue = realizedHours * rate;
  const fullPotentialBaseValue = potentialHours * rate;
  const realisticPotentialBaseValue = realisticHours * rate;
  const realizedAnnualReportBaseValue = activeConnections * annualReportHours * rate;
  const fullAnnualReportBaseValue = totalDeclarations * annualReportHours * rate;
  const realisticAnnualReportBaseValue = targetActiveCompanies * annualReportHours * rate;
  const realizedAssistanceBaseValue = activeConnections * assistanceHours * rate;
  const fullAssistanceBaseValue = totalDeclarations * assistanceHours * rate;
  const realisticAssistanceBaseValue = targetActiveCompanies * assistanceHours * rate;
  const realizedReportingBaseValue = reportPopulationRealized * reportingHours * rate;
  const fullReportingBaseValue = reportPopulationFull * reportingHours * rate;
  const realisticReportingBaseValue = reportPopulationRealistic * reportingHours * rate;
  const reportingEfficiencyHours = reportPopulationRealistic * reportingHours;
  const reportingEfficiencyBaseValue = reportingEfficiencyHours * rate;
  const realizedDeclarationValue = realizedBaseValue * qualityMultiplier;
  const fullDeclarationValue = fullPotentialBaseValue * qualityMultiplier;
  const realisticDeclarationValue = realisticPotentialBaseValue * qualityMultiplier;
  // "Realiseret værdi i dag" reflekterer kun det vi allerede gør (dataanalyse).
  // Årsrapport, assistance og rapport er fremtidigt potentiale.
  const realizedAnnualReportValue = 0;
  const fullAnnualReportValue = fullAnnualReportBaseValue * qualityMultiplier;
  const realisticAnnualReportValue = realisticAnnualReportBaseValue * qualityMultiplier;
  const realizedAssistanceValue = 0;
  const fullAssistanceValue = fullAssistanceBaseValue * qualityMultiplier;
  const realisticAssistanceValue = realisticAssistanceBaseValue * qualityMultiplier;
  const reportingEfficiencyValue = reportingEfficiencyBaseValue * qualityMultiplier;
  const realizedReportingValue = 0;
  const fullReportingValue = includeAddons ? fullReportingBaseValue * qualityMultiplier : 0;
  const realisticReportingValue = includeAddons ? realisticReportingBaseValue * qualityMultiplier : 0;
  const realizedValue = realizedDeclarationValue + realizedAnnualReportValue + realizedAssistanceValue + realizedReportingValue;
  const valuePerActiveCompany = activeConnections > 0 ? realizedValue / activeConnections : null;
  const fullPotential = fullDeclarationValue + fullAnnualReportValue + fullAssistanceValue + fullReportingValue;
  const realisticPotential = realisticDeclarationValue + realisticAnnualReportValue + realisticAssistanceValue + realisticReportingValue;
  const unusedPotential = safeGap(realisticPotential, realizedValue);
  const declarationEfficiencyHours = totalDeclarations * hours;
  const declarationEfficiencyValue = declarationEfficiencyHours * rate;
  const efficiencyHours = declarationEfficiencyHours + (includeAddons ? reportingEfficiencyHours : 0);
  const efficiencyValue = efficiencyHours * rate;
  const advisoryValue = reportingCustomers * advisoryHours * rate;
  const addonValue = advisoryValue;
  const combinedValue = realisticPotential + (includeAddons ? advisoryValue : 0);
  const activeShare = ratio(activeConnections, totalDeclarations);
  const targetShare = ratio(targetActiveCompanies, totalDeclarations);
  // "Investering i dag" reflekterer kun softwareprisen pr. aktiv virksomhed.
  // Årsrapport- og assistance-priser er fremtidig investering – matches med
  // værdi-siden hvor de fire ekstra spande kun slår igennem på "ROI ved mål".
  const currentAnnualReportInvestment = 0;
  const currentAssistanceInvestment = 0;
  const futureAnnualReportInvestment = targetActiveCompanies * annualReportPrice;
  const futureAssistanceInvestment = targetActiveCompanies * assistancePrice;
  // Investment is deliberately independent of quality factor and value assumptions.
  const currentSoftwareInvestment = activeConnections * pricePerActiveCompany;
  const futureSoftwareInvestment = targetActiveCompanies * pricePerActiveCompany;
  // Expand = new customers needed to reach target (Model B: same price applies, split by category)
  const expandCustomers = Math.max(targetActiveCompanies - activeConnections, 0);
  const expandSoftwareInvestment = expandCustomers * pricePerActiveCompany;
  const expandAnnualReportInvestment = expandCustomers * annualReportPrice;
  const expandAssistanceInvestment = expandCustomers * assistancePrice;
  const expandInvestment = expandSoftwareInvestment + expandAnnualReportInvestment + expandAssistanceInvestment;
  const currentInvestment = currentSoftwareInvestment + currentAnnualReportInvestment + currentAssistanceInvestment;
  const futureInvestment = futureSoftwareInvestment + futureAnnualReportInvestment + futureAssistanceInvestment;
  const calculatedInvestment = currentInvestment;
  const annualInvestment = currentInvestment;
  const currentNetValue = currentInvestment > 0 ? realizedValue - currentInvestment : null;
  const futureNetValue = futureInvestment > 0 ? realisticPotential - futureInvestment : null;
  const currentValueMultiple = currentInvestment > 0 ? realizedValue / currentInvestment : null;
  const futureValueMultiple = futureInvestment > 0 ? realisticPotential / futureInvestment : null;
  const isProspect = activeConnections === 0;

  return {
    aoRows,
    activeConnections,
    purchasedCompanies,
    activationRate,
    remainingPurchasedActivation,
    isProspect,
    totalDeclarations,
    audits,
    extendedReviews,
    reviews,
    assistance,
    annualReportTasks,
    analysedCompanies,
    totalAnalyses,
    activeUsers,
    activeOffices,
    implementationRateActual,
    notActivated: safeGap(totalDeclarations, activeConnections),
    notAnalysed: safeGap(totalDeclarations, analysedCompanies),
    usageIntensity: activeConnections > 0 ? totalAnalyses / activeConnections : 0,
    realizedHours,
    potentialHours,
    realisticPopulation,
    targetActiveCompanies,
    missingActivation,
    realisticHours,
    realizedBaseValue,
    fullPotentialBaseValue,
    realisticPotentialBaseValue,
    realizedValue,
    valuePerActiveCompany,
    fullPotential,
    realisticPotential,
    unusedPotential,
    capacityGain: potentialHours / HOURS_PER_FTE,
    hours,
    rate,
    implementationRate,
    reportingCustomers,
    reportingHours,
    annualReportHours,
    assistanceHours,
    advisoryHours,
    pricePerActiveCompany,
    annualReportPrice,
    assistancePrice,
    currentSoftwareInvestment,
    futureSoftwareInvestment,
    currentAnnualReportInvestment,
    futureAnnualReportInvestment,
    currentAssistanceInvestment,
    futureAssistanceInvestment,
    expandCustomers,
    expandSoftwareInvestment,
    expandAnnualReportInvestment,
    expandAssistanceInvestment,
    expandInvestment,
    currentInvestment,
    futureInvestment,
    calculatedInvestment,
    annualInvestment,
    currentNetValue,
    futureNetValue,
    currentValueMultiple,
    futureValueMultiple,
    qualityFactor,
    qualityMultiplier,
    includeQuality,
    includeAddons,
    declarationEfficiencyHours,
    declarationEfficiencyValue,
    realizedDeclarationValue,
    fullDeclarationValue,
    realisticDeclarationValue,
    currentAnnualReportTasks,
    targetAnnualReportTasks,
    realizedAnnualReportValue,
    fullAnnualReportValue,
    realisticAnnualReportValue,
    currentAssistanceTasks,
    targetAssistanceTasks,
    realizedAssistanceValue,
    fullAssistanceValue,
    realisticAssistanceValue,
    realizedReportingValue,
    fullReportingValue,
    realisticReportingValue,
    reportingEfficiencyHours,
    reportingEfficiencyValue,
    efficiencyHours,
    efficiencyValue,
    advisoryValue,
    addonValue,
    combinedValue,
  };
}

function openAoOverrideModal(cvrKey) {
  let row = state.data.aoMaster.find((r) => cvr(r) === cvrKey);
  // AO might be in Årshjul but not in ao_master (rare); fall back to a stub
  if (!row) {
    const yw = (state.data.arrYearwheel || []).find((r) => r.accounting_office_cvr === cvrKey);
    if (yw) row = { accounting_office_name: yw.accounting_office_name, accounting_office_cvr: cvrKey };
  }
  if (!row) return;
  state.aoOverrideTargetCvr = cvrKey;
  const modal = document.getElementById("aoOverrideModal");
  if (!modal) return;
  document.getElementById("aoOverrideTitle").textContent = row.accounting_office_name || cvrKey;
  const ov = aoOverrideFor(cvrKey) || {};
  const globals = assumptions();
  const defaults = {
    implementationRate: `${Math.round((globals.implementationRate || 0) * 100)}%`,
    pricePerActiveCompany: `${dkNumber.format(globals.pricePerActiveCompany || 0)} kr.`,
    annualReportPrice: `${dkNumber.format(globals.annualReportPrice || 0)} kr.`,
    assistancePrice: `${dkNumber.format(globals.assistancePrice || 0)} kr.`,
  };
  modal.querySelectorAll("[data-ao-field]").forEach((input) => {
    const field = input.getAttribute("data-ao-field");
    if (ov[field] != null) {
      input.value = field === "implementationRate" ? Math.round(ov[field] * 100) : ov[field];
    } else {
      input.value = "";
    }
  });
  modal.querySelectorAll("[data-ao-default]").forEach((el) => {
    const field = el.getAttribute("data-ao-default");
    el.textContent = `Global: ${defaults[field] || "—"}`;
  });
  // Populate forecast fields and action plan (only visible in advanced mode)
  modal.querySelectorAll("[data-ao-forecast]").forEach((input) => {
    const period = input.getAttribute("data-ao-forecast");
    const value = aoForecastForPeriod(cvrKey, period);
    input.value = value || "";
  });
  const actionTextarea = modal.querySelector("[data-ao-action]");
  if (actionTextarea) actionTextarea.value = aoActionPlan(cvrKey);
  // Toggle visibility of budget section
  modal.querySelectorAll("[data-advanced-only]").forEach((el) => {
    el.hidden = !state.advancedMode;
  });
  modal.hidden = false;
  document.body.classList.add("ao-override-open");
  setTimeout(() => modal.querySelector("[data-ao-field]")?.focus(), 30);
}

function closeAoOverrideModal() {
  const modal = document.getElementById("aoOverrideModal");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("ao-override-open");
  state.aoOverrideTargetCvr = null;
}

function applyAoOverrideModal() {
  const cvrKey = state.aoOverrideTargetCvr;
  if (!cvrKey) return;
  const modal = document.getElementById("aoOverrideModal");
  const patch = {};
  modal.querySelectorAll("[data-ao-field]").forEach((input) => {
    const field = input.getAttribute("data-ao-field");
    const raw = input.value.trim();
    if (raw === "") {
      patch[field] = null;
      return;
    }
    const value = Number(raw);
    if (Number.isFinite(value) && value >= 0) {
      patch[field] = field === "implementationRate" ? value / 100 : value;
    } else {
      patch[field] = null;
    }
  });
  setAoOverrides(cvrKey, patch);
  // Forecast inputs + action plan
  modal.querySelectorAll("[data-ao-forecast]").forEach((input) => {
    const period = input.getAttribute("data-ao-forecast");
    const raw = input.value.trim();
    setAoForecast(cvrKey, period, raw === "" ? null : Number(raw));
  });
  const actionTextarea = modal.querySelector("[data-ao-action]");
  if (actionTextarea) {
    setAoActionPlan(cvrKey, actionTextarea.value);
  }
  closeAoOverrideModal();
  renderDashboard();
}

function resetAoOverrideModal() {
  const cvrKey = state.aoOverrideTargetCvr;
  if (!cvrKey) return;
  clearAoOverrides(cvrKey);
  closeAoOverrideModal();
  renderDashboard();
}

function declarationTypeFilterHtml(metrics) {
  const counts = {
    audits: metrics.audits,
    reviews: metrics.reviews,
    extended_reviews: metrics.extendedReviews,
    assistance: metrics.assistance,
  };
  const allTotal = counts.audits + counts.reviews + counts.extended_reviews + counts.assistance;
  const rows = DECLARATION_TYPES.map((type) => {
    const checked = state.declarationTypes[type.key];
    return `<li class="declaration-type-row${checked ? "" : " inactive"}">
      <label>
        <input type="checkbox" data-declaration-type="${type.key}"${checked ? " checked" : ""} />
        <span>${type.label}</span>
        <strong>${dkNumber.format(counts[type.key])}</strong>
      </label>
    </li>`;
  }).join("");
  const allSelected = DECLARATION_TYPES.every((t) => state.declarationTypes[t.key]);
  const totalLabel = allSelected ? "I alt" : "I alt valgt";
  return `<details class="kpi-details declaration-type-filter" open>
    <summary>Datagrundlag</summary>
    <ul class="declaration-type-list">
      ${rows}
      <li class="declaration-type-total">
        <span>${totalLabel}</span>
        <strong>${dkNumber.format(metrics.totalDeclarations)}</strong>
      </li>
      ${allSelected ? "" : `<li class="declaration-type-hint"><span>Ufiltreret total</span><strong>${dkNumber.format(allTotal)}</strong></li>`}
    </ul>
  </details>`;
}

function renderManagementOverview(metrics) {
  const selectedImplementationLabel = `Værdi ved ${pctSpaced(metrics.implementationRate)} implementering`;
  const targetCompletionRate = ratio(metrics.activeConnections, metrics.targetActiveCompanies);
  const declarationValuePerCompany = metrics.hours * metrics.rate * metrics.qualityMultiplier;
  const realizedValuePerCompany = metrics.valuePerActiveCompany || declarationValuePerCompany;
  const fullValuePerCompany = metrics.totalDeclarations > 0 ? metrics.fullPotential / metrics.totalDeclarations : declarationValuePerCompany;
  const targetValuePerCompany = metrics.targetActiveCompanies > 0 ? metrics.realisticPotential / metrics.targetActiveCompanies : declarationValuePerCompany;
  const kpiDetails = (summary, rows = []) => `<details class="kpi-details">
    <summary>${summary}</summary>
    <dl>${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
  </details>`;
  const primary = [
    {
      label: "Realiseret værdi i dag",
      value: dkCurrency.format(metrics.realizedValue),
      detail: "Værdi skabt gennem de virksomheder der allerede er aktive.",
      details: kpiDetails("Beregning", [
        ["Formel", "Aktive virksomheder × værdi pr. virksomhed"],
        ["Aktive virksomheder", dkNumber.format(metrics.activeConnections)],
        ["Værdi pr. virksomhed", dkCurrency.format(realizedValuePerCompany)],
        ["Resultat", dkCurrency.format(metrics.realizedValue)],
      ]),
    },
    {
      label: "Realiseret værdi pr. virksomhed",
      value: metrics.valuePerActiveCompany ? dkCurrency.format(metrics.valuePerActiveCompany) : "Ikke beregnet",
      detail: "Gennemsnitlig værdi pr. aktiv virksomhed.",
      details: kpiDetails("Beregning", [
        ["Formel", "Realiseret værdi / aktive virksomheder"],
        ["Realiseret værdi", dkCurrency.format(metrics.realizedValue)],
        ["Aktive virksomheder", dkNumber.format(metrics.activeConnections)],
        ["Resultat", metrics.valuePerActiveCompany ? dkCurrency.format(metrics.valuePerActiveCompany) : "Ikke beregnet"],
      ]),
    },
    {
      label: "Værdi ved 100 % implementering",
      value: dkCurrency.format(metrics.fullPotential),
      detail: "Maksimalt potentiale ved fuld implementering.",
      details: kpiDetails("Beregning", [
        ["Formel", "Samlede erklæringer × værdi pr. virksomhed"],
        ["Samlede erklæringer", dkNumber.format(metrics.totalDeclarations)],
        ["Værdi pr. virksomhed", dkCurrency.format(fullValuePerCompany)],
        ["Resultat", dkCurrency.format(metrics.fullPotential)],
      ]),
    },
    {
      label: selectedImplementationLabel,
      value: dkCurrency.format(metrics.realisticPotential),
      detail: "Total værdi ved den valgte implementeringsgrad.",
      progress: Math.min(targetCompletionRate, 1),
      progressLabel: "Aktive virksomheder mod valgt implementering",
      contextRows: [
        ["Målsætning", `${dkNumber.format(metrics.targetActiveCompanies)} virksomheder`],
        ["Aktive i dag", `${dkNumber.format(metrics.activeConnections)} virksomheder`],
        ["Manglende aktivering", `${dkNumber.format(metrics.missingActivation)} virksomheder`],
      ],
      details: kpiDetails("Beregning", [
        ["Formel", "Målvirksomheder × værdi pr. virksomhed"],
        ["Valgt implementering", pctSpaced(metrics.implementationRate)],
        ["Målvirksomheder", dkNumber.format(metrics.targetActiveCompanies)],
        ["Værdi pr. virksomhed", dkCurrency.format(targetValuePerCompany)],
        ["Resultat", dkCurrency.format(metrics.realisticPotential)],
      ]),
    },
  ];

  document.getElementById("primaryKpis").innerHTML = primary
    .map((item) => `<article class="kpi">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      ${item.progress !== undefined ? `<div class="progress-bar" aria-label="${item.progressLabel || item.label}"><span style="width: ${(item.progress * 100).toFixed(1)}%"></span></div>` : ""}
      ${item.contextRows ? `<div class="kpi-context">${item.contextRows.map(([label, value]) => `<small><span>${label}</span><b>${value}</b></small>`).join("")}</div>` : ""}
      ${item.secondary ? `<em>${item.secondary}</em>` : ""}
      <small>${item.detail}</small>
      ${item.details || ""}
    </article>`)
    .join("");

  const supporting = [
    {
      label: "Aktive virksomheder",
      value: metrics.purchasedCompanies > 0 ? `${dkNumber.format(metrics.activeConnections)} / ${dkNumber.format(metrics.purchasedCompanies)}` : dkNumber.format(metrics.activeConnections),
      detail:
        metrics.purchasedCompanies > 0
          ? `${pctSpaced(metrics.activationRate)} aktiveret`
          : "Virksomheder med aktiv ERP-forbindelse.",
      secondary:
        metrics.purchasedCompanies > 0
          ? `${dkNumber.format(metrics.remainingPurchasedActivation)} virksomheder mangler aktivering (${dkCurrency.format(metrics.remainingPurchasedActivation * targetValuePerCompany)} i årlig værdi inden for købt kapacitet)`
          : "",
      progress: metrics.purchasedCompanies > 0 ? Math.min(metrics.activationRate, 1) : undefined,
      progressLabel: "Aktiveringsgrad",
      details: kpiDetails("Datagrundlag", [
        ["Kilde", "ao_connections_current.csv"],
        ["Aktive virksomheder", dkNumber.format(metrics.activeConnections)],
        ["Købte virksomheder", metrics.purchasedCompanies > 0 ? dkNumber.format(metrics.purchasedCompanies) : "Ikke opgjort"],
        ["Manglende købte virksomheder", dkNumber.format(metrics.remainingPurchasedActivation)],
        ["Værdi af manglende aktivering", dkCurrency.format(metrics.remainingPurchasedActivation * targetValuePerCompany)],
      ]),
    },
    {
      label: "Implementeringsgrad",
      value: pct(metrics.implementationRateActual),
      detail: `${dkNumber.format(metrics.activeConnections)} aktive virksomheder · ${dkNumber.format(metrics.totalDeclarations)} potentielle`,
      progress: Math.min(metrics.implementationRateActual, 1),
      progressLabel: "Implementeringsgrad",
      details: kpiDetails("Beregning", [
        ["Formel", "Aktive virksomheder / samlede erklæringer"],
        ["Aktive virksomheder", dkNumber.format(metrics.activeConnections)],
        ["Samlede erklæringer", dkNumber.format(metrics.totalDeclarations)],
        ["Resultat", pct(metrics.implementationRateActual)],
      ]),
    },
    {
      label: "Brugere med analyse-downloads",
      value: dkNumber.format(metrics.activeUsers),
      detail: "Unikke brugere med mindst én downloadet dataanalyse.",
      details: kpiDetails("Datagrundlag", [
        ["Kilde", "user_master.csv"],
        ["Filter", "Brugere med mindst én analyse"],
        ["Resultat", dkNumber.format(metrics.activeUsers)],
      ]),
    },
    {
      label: "Dataanalyser i alt",
      value: dkNumber.format(metrics.totalAnalyses),
      detail: "Totalt antal downloadede dataanalyser.",
      details: kpiDetails("Datagrundlag", [
        ["Kilde", "DA_data aggregeret i ao_master.csv"],
        ["Periode", "Alle tilgængelige måneder"],
        ["Resultat", dkNumber.format(metrics.totalAnalyses)],
      ]),
    },
    {
      label: "Samlede erklæringer",
      value: dkNumber.format(metrics.totalDeclarations),
      detail: "Populationen bag potentialet.",
      details: declarationTypeFilterHtml(metrics),
    },
  ];

  document.getElementById("supportingKpis").innerHTML = supporting
    .map((item) => `<article class="kpi ${item.progress !== undefined ? "implementation-kpi" : ""}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      ${item.progress !== undefined ? `<div class="progress-bar" aria-label="${item.progressLabel || item.label}"><span style="width: ${(item.progress * 100).toFixed(1)}%"></span></div>` : ""}
      <small>${item.detail}</small>
      ${item.secondary ? `<small>${item.secondary}</small>` : ""}
      ${item.details || ""}
    </article>`)
    .join("");
}

function completedMonthlyRows(rows) {
  return selectedRows(rows).filter((row) => isCompletedMonth(monthKey(row)));
}

function completedPeriods() {
  return [...new Set(state.data.monthly.map(monthKey).filter(isCompletedMonth))].sort();
}

function monthlySeries(metric) {
  const grouped = new Map();
  for (const row of completedMonthlyRows(state.data.monthly)) {
    const key = monthKey(row);
    grouped.set(key, (grouped.get(key) || 0) + num(row[metric]));
  }
  return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([label, value]) => ({ label, value }));
}

function monthlyActiveUsersSeries() {
  const grouped = new Map();
  for (const row of completedMonthlyRows(state.data.monthlyUsers)) {
    const key = monthKey(row);
    if (!grouped.has(key)) grouped.set(key, new Set());
    grouped.get(key).add(row.user_email);
  }
  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, users]) => ({ label, value: users.size }));
}

function currentTrendMode() {
  return document.querySelector('input[name="trendMode"]:checked')?.value || "ytd";
}

function trendStatus(changePct, change) {
  if (changePct === null) return change > 0 ? "Fremgang" : "Neutral";
  if (changePct > 0.05) return "Fremgang";
  if (changePct < -0.05) return "Tilbagegang";
  return "Neutral";
}

function trendSummaryMom(series) {
  if (!series.length) {
    return {
      currentLabel: "Ingen afsluttet måned",
      comparisonLabel: "Ingen sammenligning",
      differenceLabel: "Forskel",
      developmentLabel: "Udvikling",
      currentValue: 0,
      comparisonValue: 0,
      currentItems: [],
      comparisonItems: [],
      currentAverage: 0,
      comparisonAverage: 0,
      latestMonthLabel: "Ingen afsluttet måned",
      latestMonthValue: 0,
      change: 0,
      changePct: 0,
      status: "Neutral",
    };
  }
  const latest = series[series.length - 1] || { label: "", value: 0 };
  const previous = series[series.length - 2] || { label: "", value: 0 };
  const change = latest.value - previous.value;
  const changePct = previous.value > 0 ? change / previous.value : latest.value > 0 ? null : 0;
  return {
    currentLabel: monthLabel(latest.label),
    comparisonLabel: monthLabel(previous.label),
    differenceLabel: "Forskel",
    developmentLabel: "Udvikling",
    currentValue: latest.value,
    comparisonValue: previous.value,
    change,
    changePct,
    status: trendStatus(changePct, change),
  };
}

function trendSummaryYtd(series) {
  if (!series.length) {
    return {
      currentLabel: "Ingen afsluttet måned",
      comparisonLabel: "Ingen sammenligning",
      differenceLabel: "Forskel",
      developmentLabel: "Udvikling",
      currentValue: 0,
      comparisonValue: 0,
      currentItems: [],
      comparisonItems: [],
      currentAverage: 0,
      comparisonAverage: 0,
      latestMonthLabel: "Ingen afsluttet måned",
      latestMonthValue: 0,
      change: 0,
      changePct: 0,
      status: "Neutral",
    };
  }
  const latest = series[series.length - 1] || { label: "", value: 0 };
  const [latestYear, latestMonth] = latest.label.split("-").map(Number);
  const comparisonYear = latestYear - 1;
  const valuesByMonth = new Map(series.map((item) => [item.label, item.value]));
  const currentItems = Array.from({ length: latestMonth }, (_, index) => {
    const month = index + 1;
    const label = `${latestYear}-${String(month).padStart(2, "0")}`;
    return { label, value: valuesByMonth.get(label) || 0 };
  });
  const comparisonItems = Array.from({ length: latestMonth }, (_, index) => {
    const month = index + 1;
    const label = `${comparisonYear}-${String(month).padStart(2, "0")}`;
    return { label, value: valuesByMonth.get(label) || 0 };
  });
  const currentValue = currentItems.reduce((total, item) => total + item.value, 0);
  const comparisonValue = comparisonItems.reduce((total, item) => total + item.value, 0);
  const change = currentValue - comparisonValue;
  const changePct = comparisonValue > 0 ? change / comparisonValue : currentValue > 0 ? null : 0;
  return {
    currentLabel: periodLabel(latestYear, 1, latestMonth),
    comparisonLabel: periodLabel(comparisonYear, 1, latestMonth),
    differenceLabel: "Forskel",
    developmentLabel: "Udvikling",
    currentValue,
    comparisonValue,
    currentItems,
    comparisonItems,
    currentAverage: currentItems.length ? currentValue / currentItems.length : 0,
    comparisonAverage: comparisonItems.length ? comparisonValue / comparisonItems.length : 0,
    latestMonthLabel: monthLabel(latest.label),
    latestMonthValue: latest.value,
    change,
    changePct,
    status: trendStatus(changePct, change),
  };
}

function trendSummary(series) {
  return currentTrendMode() === "mom" ? trendSummaryMom(series) : trendSummaryYtd(series);
}

function usageTrendLabel() {
  const summary = trendSummary(monthlySeries("analyses"));
  return summary.status;
}

function statusClass(status) {
  if (status === "Fremgang") return "trend-up";
  if (status === "Tilbagegang") return "trend-down";
  return "trend-flat";
}

function renderTrendCards() {
  const renderStandardCard = (title, item) => {
    const pctText = item.changePct === null ? (item.currentValue > 0 ? "Ny aktivitet" : "Ingen aktivitet") : signedPct(item.changePct);
    return `<article class="trend-card">
      <div class="trend-title">${title}</div>
      <div class="trend-row"><span>${item.currentLabel}</span><strong>${dkNumber.format(item.currentValue)}</strong></div>
      <div class="trend-row"><span>${item.comparisonLabel}</span><strong>${dkNumber.format(item.comparisonValue)}</strong></div>
      <div class="trend-row"><span>${item.differenceLabel}</span><strong class="${deltaClass(item.change)}">${signed(item.change)}</strong></div>
      <div class="trend-row"><span>${item.developmentLabel}</span><strong class="${deltaClass(item.change)}">${pctText}</strong></div>
      <div class="trend-row"><span>Status</span><strong class="trend-status ${statusClass(item.status)}">${item.status}</strong></div>
    </article>`;
  };

  const renderActiveUsersCard = () => {
    const series = monthlyActiveUsersSeries();
    const item = trendSummary(series);
    if (currentTrendMode() === "mom") return renderStandardCard("Aktive brugere pr. måned", item);

    const breakdown = (item.currentItems || [])
      .map((month) => {
        const [, monthNumber] = month.label.split("-").map(Number);
        return `<span><em>${shortMonthName(monthNumber)}</em><strong>${dkNumber.format(month.value)}</strong></span>`;
      })
      .join("");
    const peakMonth = (item.currentItems || []).reduce((peak, month) => (month.value > peak.value ? month : peak), { label: "", value: 0 });

    return `<article class="trend-card active-users-trend-card">
      <div class="trend-title">Aktive brugere pr. måned</div>
      <div class="trend-row"><span>Seneste måned · ${item.latestMonthLabel}</span><strong>${dkNumber.format(item.latestMonthValue)}</strong></div>
      <div class="trend-row"><span>Højeste måned · ${monthLabel(peakMonth.label)}</span><strong>${dkNumber.format(peakMonth.value)}</strong></div>
      <div class="trend-row"><span>Gns. ${item.currentLabel}</span><strong>${dkDecimal.format(item.currentAverage)} pr. måned</strong></div>
      <div class="trend-breakdown" aria-label="Månedlig fordeling">${breakdown}</div>
    </article>`;
  };

  document.getElementById("trendCards").innerHTML =
    renderStandardCard("Dataanalyser", trendSummary(monthlySeries("analyses"))) + renderActiveUsersCard();
}

function renderLineChart(elementId, series, options = {}) {
  const el = document.getElementById(elementId);
  if (!series.length) {
    el.innerHTML = `<p class="note">Ingen data i det valgte filter.</p>`;
    return;
  }

  const width = 980;
  const height = 340;
  const mode = options.mode || "line";
  const pad = { top: 34, right: mode === "combo" ? 78 : 34, bottom: 70, left: 52 };
  const useCumulativeBars = mode === "cumulativeBars";
  const cumulativeSeries = [];
  let runningTotal = 0;
  for (const item of series) {
    runningTotal += item.value;
    cumulativeSeries.push({ ...item, cumulativeValue: runningTotal });
  }
  const monthlyMaxValue = Math.max(...series.map((item) => item.value), 1);
  const cumulativeMaxValue = Math.max(...cumulativeSeries.map((item) => item.cumulativeValue), 1);
  const maxValue = useCumulativeBars ? cumulativeMaxValue : monthlyMaxValue;
  const max = Math.ceil(maxValue * 1.15);
  const cumulativeMax = useCumulativeBars ? max : Math.ceil(cumulativeMaxValue * 1.08);
  const min = 0;
  const range = Math.max(max - min, 1);
  const cumulativeRange = Math.max(cumulativeMax - min, 1);
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const xStep = series.length > 1 ? innerWidth / (series.length - 1) : 0;
  const points = series.map((item, index) => {
    const x = pad.left + index * xStep;
    const y = height - pad.bottom - ((item.value - min) / range) * innerHeight;
    return { ...item, x, y };
  });
  const cumulativePoints = cumulativeSeries.map((item, index) => {
    const x = pad.left + index * xStep;
    const y = height - pad.bottom - ((item.cumulativeValue - min) / cumulativeRange) * innerHeight;
    return { ...item, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const cumulativePath = cumulativePoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const ticks = [0, 0.5, 1].map((tick) => {
    const y = height - pad.bottom - tick * innerHeight;
    const value = min + tick * range;
    const cumulativeValue = min + tick * cumulativeRange;
    return `<line class="axis" x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}"></line>
      <text class="chart-label" x="8" y="${y + 4}">${dkNumber.format(Math.round(value))}</text>
      ${
        mode === "combo"
          ? `<text class="chart-label chart-label-right" x="${width - 4}" y="${y + 4}" text-anchor="end">${dkNumber.format(Math.round(cumulativeValue))}</text>`
          : ""
      }`;
  });
  const candidateTickIndexes = points
    .map((_, index) => index);
  const xTickIndexes = candidateTickIndexes;
  const xTicks = xTickIndexes
    .map((index) => {
      const point = points[index];
      const label = axisMonthLabel(point.label);
      return `<text class="chart-label x-axis-label" x="${point.x}" y="${height - 12}" text-anchor="end" transform="rotate(-35 ${point.x} ${height - 12})">${label}</text>`;
    })
    .join("");
  const barWidth = Math.max(8, Math.min(34, (innerWidth / Math.max(series.length, 1)) * 0.58));
  const barPoints = useCumulativeBars
    ? cumulativePoints.map((point) => ({ ...point, value: point.cumulativeValue, monthlyValue: point.value }))
    : points;
  const bars = barPoints
    .map((point, index) => {
      const barHeight = Math.max(height - pad.bottom - point.y, point.value > 0 ? 2 : 0);
      const x = point.x - barWidth / 2;
      const cls = index === barPoints.length - 1 ? "chart-bar is-last" : "chart-bar";
      const title =
        useCumulativeBars
          ? `${monthLabel(point.label)}\nMåned: ${dkNumber.format(point.monthlyValue)}\nAkkumuleret: ${dkNumber.format(point.value)}`
          : `${monthLabel(point.label)}\n${options.metricLabel || options.title || "Værdi"}: ${dkNumber.format(point.value)}`;
      return `<rect class="${cls}" x="${x.toFixed(1)}" y="${point.y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="3">
        <title>${title}</title>
      </rect>`;
    })
    .join("");
  const markers = points
    .map(
      (point, index) => `<circle class="${index === points.length - 1 ? "chart-marker is-last" : "chart-marker"}" cx="${point.x}" cy="${point.y}" r="${index === points.length - 1 ? "3.6" : "2.3"}">
        <title>${monthLabel(point.label)}\n${options.metricLabel || options.title || "Værdi"}: ${dkNumber.format(point.value)}</title>
      </circle>`,
    )
    .join("");
  const cumulativeMarkers = cumulativePoints
    .map(
      (point, index) => `<circle class="${index === cumulativePoints.length - 1 ? "chart-marker cumulative is-last" : "chart-marker cumulative"}" cx="${point.x}" cy="${point.y}" r="${index === cumulativePoints.length - 1 ? "3.4" : "2.1"}">
        <title>${monthLabel(point.label)}\n${options.metricLabel || options.title || "Værdi"}: ${dkNumber.format(point.value)}\nAkkumuleret: ${dkNumber.format(point.cumulativeValue)}</title>
      </circle>`,
    )
    .join("");
  const cumulativeLast = cumulativePoints[cumulativePoints.length - 1];
  const cumulativeSummary =
    (mode === "combo" || useCumulativeBars) && cumulativeLast
      ? `<g class="chart-summary-label">
          <text x="${width - 4}" y="28" text-anchor="end">Akkumuleret afsluttede måneder: ${dkNumber.format(cumulativeLast.cumulativeValue)}</text>
        </g>`
      : "";
  const averageValue = series.reduce((total, item) => total + item.value, 0) / series.length;
  const averageY = height - pad.bottom - ((averageValue - min) / range) * innerHeight;
  const averageLine =
    mode === "bars"
      ? `<line class="average-line" x1="${pad.left}" x2="${width - pad.right}" y1="${averageY}" y2="${averageY}">
          <title>Gennemsnit: ${dkDecimal.format(averageValue)}</title>
        </line>`
      : "";
  const legend =
    mode === "combo"
      ? `<g class="chart-legend">
          <rect class="chart-bar" x="${pad.left}" y="20" width="14" height="8" rx="2"></rect>
          <text class="chart-label" x="${pad.left + 20}" y="28">Måned · venstre akse</text>
          <line class="series cumulative" x1="${pad.left + 136}" x2="${pad.left + 162}" y1="24" y2="24"></line>
          <text class="chart-label" x="${pad.left + 168}" y="28">Akkumuleret · højre akse</text>
        </g>`
      : useCumulativeBars
        ? `<g class="chart-legend">
            <rect class="chart-bar" x="${pad.left}" y="20" width="14" height="8" rx="2"></rect>
            <text class="chart-label" x="${pad.left + 20}" y="28">Akkumuleret total</text>
          </g>`
      : mode === "bars"
        ? `<g class="chart-legend">
            <rect class="chart-bar" x="${pad.left}" y="20" width="14" height="8" rx="2"></rect>
            <text class="chart-label" x="${pad.left + 20}" y="28">Måned</text>
            <line class="average-line" x1="${pad.left + 82}" x2="${pad.left + 108}" y1="24" y2="24"></line>
            <text class="chart-label" x="${pad.left + 114}" y="28">Gennemsnit</text>
          </g>`
        : "";

  el.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${options.title || "Trend"}">
      ${ticks.join("")}
      ${mode === "line" ? `<path class="series" d="${path}"></path>${markers}` : ""}
      ${mode === "combo" ? `${bars}<path class="series cumulative" d="${cumulativePath}"></path>${cumulativeMarkers}${cumulativeSummary}` : ""}
      ${useCumulativeBars ? `${bars}${cumulativeSummary}` : ""}
      ${mode === "bars" ? `${bars}${averageLine}` : ""}
      ${xTicks}
      <text class="chart-label" x="${pad.left}" y="16">Kun afsluttede måneder. ${PARTIAL_MONTH} er udeladt.</text>
      ${legend}
    </svg>
  `;
}

function renderTrends(metrics) {
  renderTrendCards();
  renderLineChart("analysesChart", monthlySeries("analyses"), { title: "Dataanalyser over tid", metricLabel: "Dataanalyser", mode: "cumulativeBars" });
  renderLineChart("usersChart", monthlyActiveUsersSeries(), { title: "Aktive brugere over tid", metricLabel: "Aktive brugere", mode: "bars" });
}

function userMonthValue(email, period) {
  const selected = selectedCvrSet();
  return state.data.monthlyUsers
    .filter((row) => row.user_email === email && monthKey(row) === period && (!selected || selected.has(cvr(row))))
    .reduce((total, row) => total + num(row.analyses), 0);
}

function deltaClass(value) {
  if (value > 0) return "delta-pos";
  if (value < 0) return "delta-neg";
  return "";
}

function signed(value) {
  return value > 0 ? `+${dkNumber.format(value)}` : dkNumber.format(value);
}

function renderTopUsers() {
  const periods = completedPeriods();
  const latest = periods[periods.length - 1] || "";
  const previous = periods[periods.length - 2] || "";
  const rows = selectedRows(state.data.users)
    .slice()
    .sort((a, b) => num(b.total_analyses) - num(a.total_analyses))
    .slice(0, 10);

  if (!rows.length) {
    document.getElementById("topUsers").innerHTML = `<tr><td colspan="8">Der er endnu ingen registreret analyseaktivitet.</td></tr>`;
    return;
  }

  document.getElementById("topUsers").innerHTML = rows
    .map((row) => {
      const latestValue = userMonthValue(row.user_email, latest);
      const previousValue = userMonthValue(row.user_email, previous);
      const delta = latestValue - previousValue;
      const deltaPct = previousValue > 0 ? signedPct(delta / previousValue) : latestValue > 0 ? "Ny aktivitet" : "Ingen aktivitet";
      return `<tr>
        <td>${escapeHtml(pdfUserLabel(row))}</td>
        <td>${row.user_email}</td>
        <td>${row.accounting_office_name}</td>
        <td class="numeric">${dkNumber.format(num(row.total_analyses))}</td>
        <td class="numeric">${dkNumber.format(latestValue)}</td>
        <td class="numeric">${dkNumber.format(previousValue)}</td>
        <td class="numeric ${deltaClass(delta)}">${signed(delta)}</td>
        <td class="numeric ${deltaClass(delta)}">${deltaPct}</td>
      </tr>`;
    })
    .join("");
}

function renderTopOffices() {
  return "";
}

function renderCalculationBasis(metrics) {
  const el = document.getElementById("calculationBasis");
  if (!el) return;
  const facts = [
    ["Aktive virksomheder", dkNumber.format(metrics.activeConnections)],
    ...(metrics.purchasedCompanies > 0 ? [["Købte virksomheder", dkNumber.format(metrics.purchasedCompanies)]] : []),
    ["Samlede erklæringer", dkNumber.format(metrics.totalDeclarations)],
    ["Dataanalyser", dkNumber.format(metrics.totalAnalyses)],
  ];
  const assumptionsList = [
    ["Timer sparet pr. erklæring", dkDecimal.format(metrics.hours)],
    ["Timepris", dkCurrency.format(metrics.rate)],
    ["Kvalitetsfaktor", metrics.includeQuality ? `${dkDecimal.format(metrics.qualityMultiplier)}x` : "Ikke medtaget"],
    ["Forventet implementeringsgrad", pct(metrics.implementationRate)],
  ];

  const group = (title, rows) => `<article class="basis-group"><h3>${title}</h3><ul>${rows
    .map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`)
    .join("")}</ul></article>`;

  el.innerHTML = group("Fakta", facts) + group("Antagelser", assumptionsList);
}

function renderOpportunities(metrics) {
  const scopeLabel = selectedOfficeLabel();
  const titleEl = document.getElementById("opportunityTitle");
  const badgeEl = document.getElementById("opportunityScopeBadge");
  if (titleEl) titleEl.textContent = state.selectedCvr ? `Hvor skal vi fokusere næste gang i ${scopeLabel}?` : "Hvor skal vi fokusere næste gang?";
  if (badgeEl) badgeEl.textContent = state.selectedCvr ? "Sorteret efter uudnyttet potentiale i valgt gruppe" : "Sorteret efter uudnyttet potentiale";

  const connections = connectionMap();
  const { hours, rate, annualReportHours, assistanceHours, reportingHours, reportingCustomers, qualityMultiplier, implementationRate, pricePerActiveCompany, annualReportPrice, assistancePrice } = assumptions();
  const rows = selectedRows(state.data.aoMaster)
    .map((row) => {
      const cvrKey = cvr(row);
      const ov = aoOverrideFor(cvrKey) || {};
      const effImpl = ov.implementationRate != null ? ov.implementationRate : implementationRate;
      const effSoftwarePrice = ov.pricePerActiveCompany != null ? ov.pricePerActiveCompany : pricePerActiveCompany;
      const effAnnualPrice = ov.annualReportPrice != null ? ov.annualReportPrice : annualReportPrice;
      const effAssistancePrice = ov.assistancePrice != null ? ov.assistancePrice : assistancePrice;
      const activeConnections = connections.get(cvrKey)?.active || 0;
      const declarations = num(row.total_declarations);
      const analysedCompanies = num(row.distinct_clients_analysed);
      const targetActiveCompanies = Math.round(declarations * effImpl);
      const hoursPerCustomer = hours + annualReportHours + assistanceHours;
      const reportPopRealized = reportingCustomers > 0 ? reportingCustomers : activeConnections;
      const reportPopTarget = reportingCustomers > 0 ? reportingCustomers : targetActiveCompanies;
      const realizedValue =
        (activeConnections * hoursPerCustomer + reportPopRealized * reportingHours) * rate * qualityMultiplier;
      const realisticPotential =
        (targetActiveCompanies * hoursPerCustomer + reportPopTarget * reportingHours) * rate * qualityMultiplier;
      const futureInvestment =
        targetActiveCompanies * effSoftwarePrice +
        targetActiveCompanies * effAnnualPrice +
        targetActiveCompanies * effAssistancePrice;
      const missingActiveCompanies = Math.max(targetActiveCompanies - activeConnections, 0);
      const expandInvestment =
        missingActiveCompanies * effSoftwarePrice +
        missingActiveCompanies * effAnnualPrice +
        missingActiveCompanies * effAssistancePrice;
      const futureNetValue = futureInvestment > 0 ? realisticPotential - futureInvestment : null;
      const unusedPotential = safeGap(realisticPotential, realizedValue);
      return {
        ...row,
        cvrKey,
        hasOverride: aoOverrideHasAny(cvrKey),
        activeConnections,
        analysedCompanies,
        declarations,
        missingActiveCompanies,
        unusedPotential,
        realizedValue,
        realisticPotential,
        expandInvestment,
        futureInvestment,
        futureNetValue,
      };
    })
    .sort((a, b) => b.unusedPotential - a.unusedPotential)
    .slice(0, state.selectedCvr ? 20 : 12);

  const pencilSvg = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M11.7 1.7a1 1 0 0 1 1.4 0l1.2 1.2a1 1 0 0 1 0 1.4L5.8 13l-3.5.9.9-3.5 8.5-8.7zM11 3.1 3.6 10.6l-.4 1.7 1.7-.4L12.4 4.4 11 3.1z"/></svg>';
  document.getElementById("opportunities").innerHTML = rows
    .map((row, index) => `<tr${row.hasOverride ? ' class="row-overridden"' : ""}>
      <td>
        <div class="ao-name-cell">
          <span class="ao-name-label">${officeName(row)}</span>
          ${row.hasOverride ? '<span class="ao-override-badge" title="Tilpasset">Tilpasset</span>' : ""}
          <button type="button" class="ao-edit-button" data-edit-cvr="${row.cvrKey}" aria-label="Tilpas ${officeName(row)}" title="Tilpas">${pencilSvg}</button>
        </div>
      </td>
      <td class="numeric">${index + 1}</td>
      <td>${row.missingActiveCompanies > 0 ? `Aktivér ${dkNumber.format(row.missingActiveCompanies)} virksomheder` : "Fasthold aktivering"}</td>
      <td class="numeric">${dkCurrency.format(row.realisticPotential)}</td>
      <td class="numeric">${dkCurrency.format(row.expandInvestment)}</td>
      <td class="numeric">${dkCurrency.format(row.futureInvestment)}</td>
      <td class="numeric">${row.futureNetValue === null ? "Ikke beregnet" : dkCurrency.format(row.futureNetValue)}</td>
      <td class="numeric">${dkNumber.format(row.missingActiveCompanies)}</td>
      <td class="numeric">${dkNumber.format(row.declarations)}</td>
      <td class="numeric analysed-column">${dkNumber.format(row.analysedCompanies)}</td>
    </tr>`)
    .join("");
}

function selectedImplementationTimeline() {
  const index = Math.max(0, Math.min(IMPLEMENTATION_TIMELINES.length - 1, Math.round(num(document.getElementById("implementationTimelineInput")?.value))));
  return IMPLEMENTATION_TIMELINES[index] || IMPLEMENTATION_TIMELINES[2];
}

function updateImplementationTimelineSlider() {
  const input = document.getElementById("implementationTimelineInput");
  if (!input) return;
  const min = num(input.min);
  const max = num(input.max);
  const value = num(input.value);
  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty("--timeline-progress", `${Math.max(0, Math.min(progress, 100)).toFixed(1)}%`);
}

function renderImplementationPlan(metrics) {
  const timeline = selectedImplementationTimeline();
  const months = Math.max(timeline.months, 1);
  const missing = Math.max(metrics.missingActivation, 0);
  const monthlyActivation = Math.ceil(missing / months);
  const weeklyActivation = Math.ceil(missing / (months * 4.33));
  const targetCompletionRate = ratio(metrics.activeConnections, metrics.targetActiveCompanies);
  const timelineLabel = document.getElementById("implementationTimelineLabel");
  if (timelineLabel) timelineLabel.textContent = timeline.label;
  updateImplementationTimelineSlider();

  const progressWidth = Math.min(targetCompletionRate * 100, 100);
  const planStatus =
    missing > 0
      ? `${dkNumber.format(missing)} virksomheder mangler for at nå målet. Over ${timeline.label.toLowerCase()} kræver det ca. ${dkNumber.format(monthlyActivation)} aktiveringer pr. måned.`
      : "Målet er nået med de valgte forudsætninger. Fokus bør være fastholdelse, onboarding af kommende opgaver og løbende brug.";

  document.getElementById("implementationPlan").innerHTML = `
    <div class="implementation-plan-summary">
      <article>
        <span>Mangler til målet</span>
        <strong>${dkNumber.format(missing)}</strong>
        <p>Hver aktiveret kunde svarer til én erklæring, hvor dataanalyse kan skabe værdi.</p>
      </article>
      <article>
        <span>Aktiveringer pr. måned</span>
        <strong>${dkNumber.format(monthlyActivation)}</strong>
        <p>Tempoet der skal holdes for at nå målet inden for ${timeline.label.toLowerCase()}.</p>
      </article>
      <article>
        <span>Aktiveringer pr. uge</span>
        <strong>${dkNumber.format(weeklyActivation)}</strong>
        <p>Bruges til konkret team- og kontoropfølgning.</p>
      </article>
      <article>
        <span>Nettoværdi ved målet</span>
        <strong>${metrics.futureNetValue === null ? "Ikke beregnet" : dkCurrency.format(metrics.futureNetValue)}</strong>
        <p>ROI ${metrics.futureValueMultiple === null ? "ikke beregnet" : `${dkDecimal.format(metrics.futureValueMultiple)}x`} ved den valgte implementeringsgrad.</p>
      </article>
    </div>
    <div class="implementation-plan-progress">
      <div>
        <strong>${dkNumber.format(metrics.activeConnections)} / ${dkNumber.format(metrics.targetActiveCompanies)} virksomheder</strong>
        <span>${pctSpaced(targetCompletionRate)} af målet opnået</span>
      </div>
      <div class="progress-bar"><span style="width: ${progressWidth.toFixed(1)}%"></span></div>
      <p>${planStatus}</p>
    </div>
    <div class="implementation-activity-grid">
      <article>
        <h3>Start med de letteste kunder</h3>
        <ul>
          <li>Prioritér e-conomic-kunder og kunder med eksisterende dataadgang.</li>
          <li>Skab tidlige succeser med kunder der er hurtige at forbinde.</li>
        </ul>
      </article>
      <article>
        <h3>Gør det nemt for medarbejderne</h3>
        <ul>
          <li>Opret og klargør relevante kunder før medarbejderen skal bruge analysen.</li>
          <li>Fjern adgangs-, data- og onboardingfriktion centralt.</li>
        </ul>
      </article>
      <article>
        <h3>Følg op med data</h3>
        <ul>
          <li>Brug aktive brugere, analyser, kunder og udvikling over tid i ledelsesdialogen.</li>
          <li>Find teams eller kontorer hvor ekstra støtte kan skabe fremdrift.</li>
        </ul>
      </article>
      <article>
        <h3>Giv adgang til materiale</h3>
        <ul>
          <li>Saml korte guides, videoer, best practice, FAQ og kontaktpersoner ét sted.</li>
          <li>Gør det tydeligt hvornår Crediwire bruges i erklæringsprocessen.</li>
        </ul>
      </article>
      <article>
        <h3>Synliggør kvalitetsløftet</h3>
        <ul>
          <li>Del eksempler på bedre dokumentation og mere ensartet proces.</li>
          <li>Vis hvordan færre manuelle udtræk og lavere fejlrisiko styrker kvaliteten.</li>
        </ul>
      </article>
    </div>
  `;
}

function latestPeriodChange(series) {
  const latest = series[series.length - 1] || { label: "", value: 0 };
  const previous = series[series.length - 2] || { label: "", value: 0 };
  const change = latest.value - previous.value;
  const changeText = previous.label
    ? `${monthLabel(latest.label)}: ${dkNumber.format(latest.value)} (${signed(change)} fra ${monthLabel(previous.label)})`
    : "Ingen sammenligningsperiode";
  return { latest, previous, change, changeText };
}

function topUserInsightRows() {
  const periods = completedPeriods();
  const latest = periods[periods.length - 1] || "";
  const previous = periods[periods.length - 2] || "";
  return selectedRows(state.data.users)
    .map((row) => {
      const latestValue = userMonthValue(row.user_email, latest);
      const previousValue = userMonthValue(row.user_email, previous);
      return {
        ...row,
        latestValue,
        previousValue,
        delta: latestValue - previousValue,
      };
    })
    .filter((row) => num(row.total_analyses) > 0);
}

function pdfUserLabel(row) {
  const name = String(row?.user_name || "").trim();
  const email = String(row?.user_email || "").trim();
  return name || email || "Ikke navngivet bruger";
}

function pdfUserDetail(row, fallback = "") {
  if (!row) return fallback;
  const name = String(row.user_name || "").trim();
  const email = String(row.user_email || "").trim();
  if (!name && email) return `Navn mangler i datagrundlaget · ${email}`;
  return fallback;
}

function pdfSparkline(series, metricLabel) {
  if (!series.length) return `<p class="note">Ingen data i det valgte filter.</p>`;
  const width = 520;
  const height = 150;
  const pad = { top: 18, right: 16, bottom: 30, left: 42 };
  const max = Math.max(...series.map((item) => item.value), 1);
  const min = Math.min(...series.map((item) => item.value), 0);
  const range = Math.max(max - min, 1);
  const xStep = series.length > 1 ? (width - pad.left - pad.right) / (series.length - 1) : 0;
  const points = series.map((item, index) => {
    const x = pad.left + index * xStep;
    const y = height - pad.bottom - ((item.value - min) / range) * (height - pad.top - pad.bottom);
    return { ...item, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const tickIndexes = points
    .map((point, index) => {
      const [, month] = point.label.split("-").map(Number);
      return index === 0 || index === points.length - 1 || [3, 6, 9, 12].includes(month) ? index : null;
    })
    .filter((index) => index !== null);
  const xTicks = tickIndexes
    .map((index) => {
      const point = points[index];
      return `<text class="chart-label x-axis-label" x="${point.x}" y="${height - 8}" text-anchor="middle">${axisMonthLabel(point.label)}</text>`;
    })
    .join("");
  const markers = points
    .map(
      (point) => `<circle cx="${point.x}" cy="${point.y}" r="2.6" fill="currentColor">
        <title>${monthLabel(point.label)}\n${metricLabel}: ${dkNumber.format(point.value)}</title>
      </circle>`,
    )
    .join("");
  const last = points[points.length - 1];
  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${metricLabel} over tid">
      <line class="axis" x1="${pad.left}" x2="${width - pad.right}" y1="${height - pad.bottom}" y2="${height - pad.bottom}"></line>
      <line class="axis" x1="${pad.left}" x2="${width - pad.right}" y1="${pad.top}" y2="${pad.top}"></line>
      <text class="chart-label" x="8" y="${height - pad.bottom + 4}">${dkNumber.format(Math.round(min))}</text>
      <text class="chart-label" x="8" y="${pad.top + 4}">${dkNumber.format(Math.round(max))}</text>
      <path class="series" d="${path}"></path>
      ${markers}
      ${xTicks}
      <text class="chart-value" x="${last.x - 6}" y="${Math.max(14, last.y - 8)}" text-anchor="end">${dkNumber.format(last.value)}</text>
    </svg>
  `;
}

function renderPdfReport(metrics) {
  const selected = selectedOfficeLabel();
  const reportDate = new Intl.DateTimeFormat("da-DK", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());
  const implementationTargetRate = ratio(metrics.activeConnections, metrics.targetActiveCompanies);
  const analysesChange = latestPeriodChange(monthlySeries("analyses"));
  const userRows = topUserInsightRows();
  const topDriver = userRows.slice().sort((a, b) => num(b.total_analyses) - num(a.total_analyses))[0];
  const fastestGrower = userRows.slice().sort((a, b) => b.delta - a.delta)[0];
  const largestDrop = userRows.slice().sort((a, b) => a.delta - b.delta)[0];
  const topDriverShare = topDriver && metrics.totalAnalyses > 0 ? ratio(num(topDriver.total_analyses), metrics.totalAnalyses) : 0;
  const topThreeAnalyses = userRows
    .slice()
    .sort((a, b) => num(b.total_analyses) - num(a.total_analyses))
    .slice(0, 3)
    .reduce((total, row) => total + num(row.total_analyses), 0);
  const topThreeShare = metrics.totalAnalyses > 0 ? ratio(topThreeAnalyses, metrics.totalAnalyses) : 0;
  const ytdAnalyses = trendSummaryYtd(monthlySeries("analyses"));
  const ytdDevelopment =
    ytdAnalyses.changePct === null ? (ytdAnalyses.currentValue > 0 ? "Ny aktivitet" : "Ingen aktivitet") : signedPct(ytdAnalyses.changePct);
  const managementInsights = [
    `Målet ved ${pctSpaced(metrics.implementationRate)} implementering er ${dkNumber.format(metrics.targetActiveCompanies)} virksomheder; der mangler ${dkNumber.format(metrics.missingActivation)} aktiveringer.`,
    `Der er allerede skabt ${dkCurrency.format(metrics.realizedValue)} i beregnet værdi fra de aktive virksomheder.`,
    `Den største værdiskabende handling er at aktivere de resterende ${dkNumber.format(metrics.missingActivation)} virksomheder mod målet.`,
  ];
  const nextAction = {
    missing: metrics.missingActivation,
    value: metrics.realisticPotential,
    investment: metrics.futureInvestment,
    gain: metrics.futureNetValue,
  };

  document.getElementById("pdfExecutiveSummary").innerHTML = `
    <div class="pdf-report-head">
      <p>Crediwire Intelligence</p>
      <h1>Ledelsesrapport for ${escapeHtml(selected)}</h1>
      <span>${reportDate}</span>
    </div>
    <section class="pdf-executive-implementation">
      <h2>Fremdrift mod implementeringsmål</h2>
      <div class="pdf-executive-progress-number">
        <strong>${dkNumber.format(metrics.activeConnections)} / ${dkNumber.format(metrics.targetActiveCompanies)} virksomheder</strong>
        <span>${pctSpaced(implementationTargetRate)} af målet opnået</span>
        <p>${dkNumber.format(metrics.missingActivation)} virksomheder mangler</p>
      </div>
      <div class="pdf-meter-track pdf-meter-track-large" aria-label="Fremdrift mod implementeringsmål">
        <span class="pdf-meter-achieved" style="width: ${(Math.min(implementationTargetRate, 1) * 100).toFixed(1)}%"></span>
        <span class="pdf-meter-remaining" style="width: ${(Math.max(1 - Math.min(implementationTargetRate, 1), 0) * 100).toFixed(1)}%"></span>
      </div>
      <div class="pdf-executive-implementation-grid">
        <article><span>Aktive virksomheder</span><strong>${dkNumber.format(metrics.activeConnections)}</strong></article>
        <article><span>Målsætning</span><strong>${dkNumber.format(metrics.targetActiveCompanies)}</strong></article>
        <article><span>Mangler</span><strong>${dkNumber.format(metrics.missingActivation)}</strong></article>
        <article><span>Opnået</span><strong>${pctSpaced(implementationTargetRate)}</strong></article>
      </div>
    </section>
    <section class="pdf-management-insights">
      <h2>Ledelsesindsigter</h2>
      <ul>${managementInsights.map((insight) => `<li>${insight}</li>`).join("")}</ul>
    </section>
  `;

  document.getElementById("pdfBusinessCaseInsight").innerHTML = `
    <h3>Ledelsesfortolkning</h3>
    <p>Business casen er resultatet af implementeringen: jo flere virksomheder der aktiveres, jo større bliver den beregnede værdi. Ved ${pctSpaced(metrics.implementationRate)} implementering svarer målet til ${dkNumber.format(metrics.targetActiveCompanies)} aktive virksomheder.</p>
  `;

  const valuePerCompany = metrics.valuePerActiveCompany || (metrics.targetActiveCompanies > 0 ? metrics.realisticPotential / metrics.targetActiveCompanies : metrics.hours * metrics.rate * metrics.qualityMultiplier);
  document.getElementById("pdfImplementationBusinessCase").innerHTML = `
    <div class="pdf-section-head">
      <p>Business Case</p>
      <h1>Implementering skaber værdi</h1>
      <span>Jo flere virksomheder der aktiveres, jo mere værdi kan realiseres.</span>
    </div>
    <div class="pdf-implementation-meter">
      <div class="pdf-meter-labels">
        <span>I dag: <b>${dkNumber.format(metrics.activeConnections)} aktive</b></span>
        <span>Mål: <b>${dkNumber.format(metrics.targetActiveCompanies)} aktive</b></span>
      </div>
      <div class="pdf-meter-track" aria-label="Fremdrift mod implementeringsmål">
        <span class="pdf-meter-achieved" style="width: ${(Math.min(implementationTargetRate, 1) * 100).toFixed(1)}%"></span>
        <span class="pdf-meter-remaining" style="width: ${(Math.max(1 - Math.min(implementationTargetRate, 1), 0) * 100).toFixed(1)}%"></span>
      </div>
      <div class="pdf-meter-caption">
        <strong>${pctSpaced(implementationTargetRate)} opnået</strong>
        <span>${pctSpaced(Math.max(1 - implementationTargetRate, 0))} tilbage til målet</span>
      </div>
    </div>
    <div class="pdf-implementation-path">
      <article>
        <span>Aktive virksomheder i dag</span>
        <strong>${dkNumber.format(metrics.activeConnections)}</strong>
        <p>${pctSpaced(implementationTargetRate)} af valgt implementeringsmål er opnået.</p>
      </article>
      <article>
        <span>Mål for implementering</span>
        <strong>${dkNumber.format(metrics.targetActiveCompanies)}</strong>
        <p>${dkNumber.format(metrics.missingActivation)} virksomheder mangler</p>
      </article>
      <article>
        <span>Værdi skabt i dag</span>
        <strong>${dkCurrency.format(metrics.realizedValue)}</strong>
        <p>${dkCurrency.format(valuePerCompany)} pr. aktiv virksomhed</p>
      </article>
      <article class="highlight">
        <span>Forventet gevinst ved målet</span>
        <strong>${metrics.futureNetValue === null ? "Ikke beregnet" : dkCurrency.format(metrics.futureNetValue)}</strong>
        <p>ROI ${metrics.futureValueMultiple === null ? "ikke beregnet" : `${dkDecimal.format(metrics.futureValueMultiple)}x`}</p>
      </article>
    </div>
    <div class="pdf-implementation-summary">
      <article>
        <h2>Hvor langt er vi fra målet?</h2>
        <strong>${dkNumber.format(metrics.missingActivation)} virksomheder</strong>
        <p>Målsætningen er ${dkNumber.format(metrics.targetActiveCompanies)} aktive virksomheder. I dag er ${dkNumber.format(metrics.activeConnections)} aktive.</p>
      </article>
      <article>
        <h2>Hvad er allerede realiseret?</h2>
        <strong>${dkCurrency.format(metrics.realizedValue)}</strong>
        <p>Værdien kommer fra de virksomheder, der allerede er aktiveret.</p>
      </article>
      <article>
        <h2>Hvad mangler vi at realisere?</h2>
        <strong>${dkCurrency.format(metrics.unusedPotential)}</strong>
        <p>Hvis de resterende ${dkNumber.format(metrics.missingActivation)} virksomheder aktiveres, kan der realiseres yderligere ${dkCurrency.format(metrics.unusedPotential)} i værdi.</p>
      </article>
    </div>
    <div class="pdf-action-callout">
      <strong>Næste ledelseshandling: aktivér flere virksomheder.</strong>
      <p>Business casen forbedres primært ved at øge implementeringen, ikke ved at optimere ROI-formlen.</p>
    </div>
  `;

  const dataStatusItems = [
    `Valgt scope: ${selected}.`,
    `Dataanalyser og aktive brugere over tid viser kun afsluttede måneder. ${PARTIAL_MONTH} er udeladt som foreløbig måned.`,
    "Aktive virksomheder vises som aktuelt forbindelsessnapshot.",
    "Historik for aktive virksomheder findes ikke endnu.",
    "Total kendte brugere findes ikke, så der vises aktive brugere uden bruger-rate.",
  ];

  document.getElementById("pdfCalculationDocumentation").innerHTML = `
    <div class="pdf-section-head">
      <p>Dokumentation</p>
      <h1>Sådan er Business Casen beregnet</h1>
      <span>Denne side dokumenterer antagelser og beregningstrin.</span>
    </div>
    <div class="pdf-documentation-grid">
      <article>
        <h2>Antagelser</h2>
        <ul>
          <li>Timer sparet pr. erklæring: <b>${dkDecimal.format(metrics.hours)}</b></li>
          <li>Timepris: <b>${dkCurrency.format(metrics.rate)}</b></li>
          <li>Kvalitetsfaktor: <b>${metrics.includeQuality ? `${dkDecimal.format(metrics.qualityMultiplier)}x` : "Ikke medtaget"}</b></li>
          <li>Valgt implementering: <b>${pctSpaced(metrics.implementationRate)}</b></li>
          <li>Optimering ved årsrapport: <b>${dkDecimal.format(metrics.annualReportHours)} timer</b></li>
          <li>Optimering ved assistance: <b>${dkDecimal.format(metrics.assistanceHours)} timer</b></li>
          <li>Rapportering: <b>${metrics.includeAddons ? `${dkNumber.format(metrics.reportingCustomers)} kunder × ${dkDecimal.format(metrics.reportingHours)} timer` : "Ikke medtaget"}</b></li>
          <li>Softwarepris pr. aktiv virksomhed: <b>${dkCurrency.format(metrics.pricePerActiveCompany)}</b></li>
          <li>Pris pr. årsrapport: <b>${dkCurrency.format(metrics.annualReportPrice)}</b></li>
          <li>Pris pr. assistanceopgave: <b>${dkCurrency.format(metrics.assistancePrice)}</b></li>
        </ul>
      </article>
      <article>
        <h2>Formler</h2>
        <ul>
          <li>Realiseret værdi i dag = dataanalyseværdi × kvalitetsfaktor</li>
          <li>Værdi ved mål = (dataanalyseværdi + årsrapportværdi + assistanceværdi + eventuel rapportering) × kvalitetsfaktor</li>
          <li>Samlet investering = software + årsrapport + assistance</li>
          <li>Forventet gevinst = værdi ved mål − samlet investering</li>
        </ul>
      </article>
      <article>
        <h2>Investering</h2>
        <ul>
          <li>I dag: <b>${dkCurrency.format(metrics.currentInvestment)}</b></li>
          <li>Ved mål: <b>${dkCurrency.format(metrics.futureInvestment)}</b></li>
          <li>Software: <b>${dkCurrency.format(metrics.futureSoftwareInvestment)}</b></li>
          <li>Årsrapport: <b>${dkCurrency.format(metrics.futureAnnualReportInvestment)}</b></li>
          <li>Assistance: <b>${dkCurrency.format(metrics.futureAssistanceInvestment)}</b></li>
          <li>Business Case bruger den samlede investering ved målet.</li>
        </ul>
      </article>
      <article>
        <h2>Beregningstrin</h2>
        <ul>
          <li>Målvirksomheder: <b>${dkNumber.format(metrics.targetActiveCompanies)}</b></li>
          <li>Erklæringsværdi: <b>${dkCurrency.format(metrics.realisticDeclarationValue)}</b></li>
          <li>Årsrapportværdi: <b>${dkCurrency.format(metrics.realisticAnnualReportValue)}</b></li>
          <li>Assistanceværdi: <b>${dkCurrency.format(metrics.realisticAssistanceValue)}</b></li>
          <li>Rapporteringsværdi: <b>${metrics.includeAddons ? dkCurrency.format(metrics.realisticReportingValue) : "Ikke medtaget"}</b></li>
          <li>Værdi ved mål: <b>${dkCurrency.format(metrics.realisticPotential)}</b></li>
          <li>Samlet investering: <b>${dkCurrency.format(metrics.futureInvestment)}</b></li>
          <li>Forventet gevinst: <b>${metrics.futureNetValue === null ? "Ikke beregnet" : dkCurrency.format(metrics.futureNetValue)}</b></li>
        </ul>
      </article>
      <article class="pdf-documentation-status">
        <h2>Datastatus</h2>
        <ul>${dataStatusItems.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    </div>
  `;

  const periods = completedPeriods();
  const latestPeriod = periods[periods.length - 1] || "";
  const previousPeriod = periods[periods.length - 2] || "";
  const topTenRows = userRows
    .slice()
    .sort((a, b) => num(b.total_analyses) - num(a.total_analyses))
    .slice(0, 10);
  const activeUsersSummary = trendSummaryYtd(monthlyActiveUsersSeries());
  const usageInsightCards = [
    ["Største bruger", topDriver ? `${pdfUserLabel(topDriver)} · ${dkNumber.format(num(topDriver.total_analyses))} analyser` : "Ingen aktivitet", topDriver ? `${pctSpaced(topDriverShare)} af alle analyser` : ""],
    ["Størst vækst", fastestGrower ? `${pdfUserLabel(fastestGrower)} · ${signed(fastestGrower.delta)} analyser` : "Ingen aktivitet", pdfUserDetail(fastestGrower, analysesChange.latest.label ? `Seneste måned: ${monthLabel(analysesChange.latest.label)}` : "")],
    ["Størst fald", largestDrop ? `${pdfUserLabel(largestDrop)} · ${signed(largestDrop.delta)} analyser` : "Ingen aktivitet", pdfUserDetail(largestDrop, analysesChange.previous.label ? `Mod ${monthLabel(analysesChange.previous.label)}` : "")],
    ["Koncentration", `${pctSpaced(topThreeShare)} af brugen`, `Top 3 brugere · ${dkNumber.format(topThreeAnalyses)} analyser`],
  ];

  document.getElementById("pdfTopUserInsights").innerHTML = usageInsightCards
    .map(([title, value, detail]) => `<article><span>${title}</span><strong>${value}</strong>${detail ? `<p>${detail}</p>` : ""}</article>`)
    .join("");

  document.getElementById("pdfUsageAdoption").innerHTML = `
    <div class="pdf-section-head">
      <p>Brug og adoption</p>
      <h1>Hvem bruger løsningen, og udvikler brugen sig?</h1>
      <span>Kun afsluttede måneder indgår. ${PARTIAL_MONTH} er udeladt som foreløbig måned.</span>
    </div>
    <div class="pdf-insight-grid">
      ${usageInsightCards.map(([title, value, detail]) => `<article><span>${title}</span><strong>${value}</strong>${detail ? `<p>${detail}</p>` : ""}</article>`).join("")}
    </div>
    <div class="pdf-usage-grid">
      <article class="pdf-usage-trend">
        <h2>Går brugen frem eller tilbage?</h2>
        <div class="pdf-usage-trend-grid">
          <span>Dataanalyser</span><strong>${ytdDevelopment}</strong>
          <span>${ytdAnalyses.currentLabel}</span><b>${dkNumber.format(ytdAnalyses.currentValue)}</b>
          <span>${ytdAnalyses.comparisonLabel}</span><b>${dkNumber.format(ytdAnalyses.comparisonValue)}</b>
          <span>Aktive brugere seneste måned</span><b>${dkNumber.format(activeUsersSummary.latestMonthValue)}</b>
          <span>Gns. aktive brugere pr. måned</span><b>${dkDecimal.format(activeUsersSummary.currentAverage)}</b>
        </div>
      </article>
      <article class="pdf-usage-chart">
        <h2>Dataanalyser over tid</h2>
        ${pdfSparkline(monthlySeries("analyses"), "Dataanalyser")}
      </article>
      <article class="pdf-usage-chart">
        <h2>Aktive brugere over tid</h2>
        ${pdfSparkline(monthlyActiveUsersSeries(), "Aktive brugere")}
      </article>
    </div>
    <div class="pdf-top-users-table">
      <h2>Top 10 brugere</h2>
      <table>
        <thead>
          <tr>
            <th>Bruger</th>
            <th>Email</th>
            <th>Dataanalyser</th>
            <th>${monthLabel(latestPeriod)}</th>
            <th>${monthLabel(previousPeriod)}</th>
            <th>Ændring</th>
          </tr>
        </thead>
        <tbody>
          ${topTenRows
            .map((row) => `<tr>
              <td>${escapeHtml(pdfUserLabel(row))}</td>
              <td>${escapeHtml(row.user_email || "")}</td>
              <td class="numeric">${dkNumber.format(num(row.total_analyses))}</td>
              <td class="numeric">${dkNumber.format(row.latestValue)}</td>
              <td class="numeric">${dkNumber.format(row.previousValue)}</td>
              <td class="numeric ${deltaClass(row.delta)}">${signed(row.delta)}</td>
            </tr>`)
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("pdfOpportunityRecommendation").innerHTML = `
    <h3>Anbefalet næste handling</h3>
    <div class="pdf-recommendation-grid">
      <span>Prioritet 1</span>
      <strong>Aktivér ${dkNumber.format(nextAction.missing)} virksomheder</strong>
      <p>Forventet potentiel værdi: <b>${dkCurrency.format(nextAction.value)}</b></p>
      <p>Forventet investering: <b>${dkCurrency.format(nextAction.investment)}</b></p>
      <p>Forventet gevinst: <b>${nextAction.gain === null ? "Ikke beregnet" : dkCurrency.format(nextAction.gain)}</b></p>
    </div>
  `;
}

function renderRoi(metrics) {
  const implementationLabel = pctSpaced(metrics.implementationRate);
  const valuePerCompany = metrics.valuePerActiveCompany || (metrics.targetActiveCompanies > 0 ? metrics.realisticPotential / metrics.targetActiveCompanies : metrics.hours * metrics.rate * metrics.qualityMultiplier);
  const detailBlock = (summary, rows = []) => `<details class="kpi-details card-details">
    <summary>${summary}</summary>
    <dl>${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
  </details>`;
  document.getElementById("investmentSection").hidden = metrics.isProspect;
  document.getElementById("investmentCalculationValue").textContent = dkCurrency.format(metrics.calculatedInvestment);
  const currentCustomersEl = document.getElementById("investmentCurrentCustomers");
  if (currentCustomersEl) currentCustomersEl.textContent = dkNumber.format(metrics.activeConnections);
  document.getElementById("investmentCalculationFormula").textContent =
    `${dkNumber.format(metrics.activeConnections)} aktive kunder × pris. Årsrapport og assistance indgår først i målscenariet.`;
  document.getElementById("currentRoiStatus").textContent =
    metrics.currentValueMultiple === null
      ? "ROI i dag: ikke beregnet"
      : `ROI i dag: ${dkDecimal.format(metrics.currentValueMultiple)}x · nettoværdi ${dkCurrency.format(metrics.currentNetValue)}`;
  const expandValueEl = document.getElementById("expandInvestmentValue");
  if (expandValueEl) expandValueEl.textContent = dkCurrency.format(metrics.expandInvestment);
  const expandCustomersEl = document.getElementById("investmentExpandCustomers");
  if (expandCustomersEl) expandCustomersEl.textContent = dkNumber.format(metrics.expandCustomers);
  const expandFormulaEl = document.getElementById("expandInvestmentFormula");
  if (expandFormulaEl) {
    expandFormulaEl.textContent = `${dkNumber.format(metrics.expandCustomers)} nye kunder × pris (software ${dkCurrency.format(metrics.expandSoftwareInvestment)} + årsrapport ${dkCurrency.format(metrics.expandAnnualReportInvestment)} + assistance ${dkCurrency.format(metrics.expandAssistanceInvestment)}).`;
  }
  document.getElementById("targetInvestmentLabel").textContent = `Samlet investering ved ${implementationLabel} implementering`;
  document.getElementById("targetInvestmentValue").textContent = dkCurrency.format(metrics.futureInvestment);
  const targetCustomersEl = document.getElementById("investmentTargetCustomers");
  if (targetCustomersEl) targetCustomersEl.textContent = dkNumber.format(metrics.targetActiveCompanies);
  document.getElementById("targetInvestmentFormula").textContent =
    `${dkNumber.format(metrics.targetActiveCompanies)} kunder × pris (i dag ${dkCurrency.format(metrics.currentInvestment)} + expand ${dkCurrency.format(metrics.expandInvestment)}).`;
  document.getElementById("businessCaseInvestmentNote").textContent =
    `Status i dag bruger kun software. Målscenariet kan inkludere software, årsrapport og assistance.`;
  const targetCompletionRate = ratio(metrics.activeConnections, metrics.targetActiveCompanies);
  document.getElementById("businessCaseImplementationStatus").textContent =
    `${dkNumber.format(metrics.activeConnections)} / ${dkNumber.format(metrics.targetActiveCompanies)} virksomheder`;
  const targetCompletionPct = Math.min(targetCompletionRate, 1) * 100;
  document.getElementById("businessCaseImplementationProgress").innerHTML = `
    <div class="implementation-progress-labels">
      <span>Aktive i dag</span>
      <span>Mål</span>
    </div>
    <div
      class="implementation-target-progress"
      role="progressbar"
      aria-label="Fremdrift fra aktive virksomheder til implementeringsmål"
      aria-valuemin="0"
      aria-valuemax="${metrics.targetActiveCompanies}"
      aria-valuenow="${metrics.activeConnections}"
      style="--progress: ${targetCompletionPct.toFixed(1)}%"
    ></div>
    <div class="implementation-progress-values">
      <strong>${dkNumber.format(metrics.activeConnections)}</strong>
      <strong>${dkNumber.format(metrics.targetActiveCompanies)}</strong>
    </div>
    <p>${pctSpaced(targetCompletionRate)} af målet opnået</p>
    <p>${dkNumber.format(metrics.missingActivation)} virksomheder mangler</p>
    ${detailBlock("Datagrundlag", [
      ["Valgt implementeringsgrad", implementationLabel],
      ["Målvirksomheder", dkNumber.format(metrics.targetActiveCompanies)],
      ["Aktive virksomheder i dag", dkNumber.format(metrics.activeConnections)],
      ["Manglende virksomheder", dkNumber.format(metrics.missingActivation)],
    ])}
  `;
  document.getElementById("futureInvestmentValue").textContent = dkCurrency.format(metrics.realisticPotential);
  document.getElementById("futureInvestmentHelp").innerHTML = `Total værdi før investering ved valgt implementering.${detailBlock("Beregning", [
    ["Erklæringer", dkCurrency.format(metrics.realisticDeclarationValue)],
    ["Årsrapport", dkCurrency.format(metrics.realisticAnnualReportValue)],
    ["Assistance", dkCurrency.format(metrics.realisticAssistanceValue)],
    ["Rapportering", metrics.includeAddons ? dkCurrency.format(metrics.realisticReportingValue) : "Ikke medtaget"],
    ["Resultat", dkCurrency.format(metrics.realisticPotential)],
  ])}`;
  document.getElementById("selectedImplementationNetValue").textContent = dkCurrency.format(metrics.futureInvestment);
  document.getElementById("remainingPotentialHelp").innerHTML = `Samlet investering ved valgt implementering.${detailBlock("Beregning", [
    ["Software", dkCurrency.format(metrics.futureSoftwareInvestment)],
    ["Årsrapport", dkCurrency.format(metrics.futureAnnualReportInvestment)],
    ["Assistance", dkCurrency.format(metrics.futureAssistanceInvestment)],
    ["Resultat", dkCurrency.format(metrics.futureInvestment)],
  ])}`;
  document.getElementById("businessCaseEquation").innerHTML = "";
  const valueCreationFlow = document.getElementById("valueCreationFlow");
  if (valueCreationFlow) valueCreationFlow.innerHTML = "";

  if (metrics.futureInvestment > 0) {
    document.getElementById("futureNetValue").textContent = dkCurrency.format(metrics.futureNetValue);
    document.getElementById("futureRoiInline").textContent = "";
    document.getElementById("businessCaseRoiValue").textContent = `Ved mål: ${dkDecimal.format(metrics.futureValueMultiple)}x`;
    document.getElementById("businessCaseTargetRoiInline").textContent =
      metrics.currentValueMultiple === null ? "I dag: ikke beregnet" : `I dag: ${dkDecimal.format(metrics.currentValueMultiple)}x`;
    document.getElementById("businessCaseRoiHelp").innerHTML = `ROI i dag bruger kun nuværende dataanalyse/software. ROI ved mål inkluderer valgt produkt-upside.${detailBlock("Beregning", [
      ["ROI i dag", metrics.currentValueMultiple === null ? "Ikke beregnet" : `${dkDecimal.format(metrics.currentValueMultiple)}x`],
      ["Værdi i dag", `${dkCurrency.format(metrics.realizedValue)} · dataanalyse`],
      ["Investering i dag", `${dkCurrency.format(metrics.currentInvestment)} · software`],
      ["ROI ved mål", `${dkDecimal.format(metrics.futureValueMultiple)}x`],
      ["Værdi ved mål", dkCurrency.format(metrics.realisticPotential)],
      ["Investering ved mål", dkCurrency.format(metrics.futureInvestment)],
    ])}`;
    document.getElementById("futureGainHelp").innerHTML = `Værdi efter samlet investering ved målet.${detailBlock("Beregning", [
      ["Formel", "Værdi − investering"],
      ["Værdi", dkCurrency.format(metrics.realisticPotential)],
      ["Investering", dkCurrency.format(metrics.futureInvestment)],
      ["Nettoværdi", dkCurrency.format(metrics.futureNetValue)],
      ["ROI i dag", metrics.currentValueMultiple === null ? "Ikke beregnet" : `${dkDecimal.format(metrics.currentValueMultiple)}x`],
      ["ROI ved mål", `${dkDecimal.format(metrics.futureValueMultiple)}x`],
    ])}`;
  } else {
    document.getElementById("futureNetValue").textContent = "Indtast investering";
    document.getElementById("futureRoiInline").textContent = "";
    document.getElementById("businessCaseRoiValue").textContent = "I dag: ikke beregnet";
    document.getElementById("businessCaseTargetRoiInline").textContent = "Ved mål: ikke beregnet";
    document.getElementById("businessCaseRoiHelp").textContent = "Kræver investering.";
    document.getElementById("futureGainHelp").textContent = "Kræver forventet investering.";
  }

  const valueTodayText = metrics.isProspect
    ? "Ingen realiseret værdi endnu."
    : "Beregnet ud fra de virksomheder, der er aktive i dag.";
  const potentialText = `Beregnet ved ${implementationLabel} implementering før softwareinvestering.`;
  const calculationStrip = (leftLabel, leftValue, middleLabel, middleValue, resultLabel, resultValue) => `
    <div class="calc-strip">
      <div><span>${leftLabel}</span><strong>${leftValue}</strong></div>
      <em>×</em>
      <div><span>${middleLabel}</span><strong>${middleValue}</strong></div>
      <em>=</em>
      <div class="calc-result"><span>${resultLabel}</span><strong>${resultValue}</strong></div>
    </div>`;
  const targetProgressWidth = Math.min(targetCompletionRate, 1) * 100;
  const potentialProgress = `<div class="potential-progress">
    <p class="potential-progress-title">Implementeringsmål</p>
    <div class="potential-progress-top">
      <strong>${dkNumber.format(metrics.activeConnections)} / ${dkNumber.format(metrics.targetActiveCompanies)} virksomheder aktiveret</strong>
      <span>${pctSpaced(targetCompletionRate)} af målet opnået</span>
    </div>
    <div class="progress-bar" aria-label="Aktive virksomheder mod ${implementationLabel} implementering"><span style="width: ${targetProgressWidth.toFixed(1)}%"></span></div>
    <p>${dkNumber.format(metrics.missingActivation)} virksomheder mangler</p>
  </div>`;
  const factsList = [
    `<li>Aktive virksomheder: <strong>${dkNumber.format(metrics.activeConnections)}</strong></li>`,
    ...(metrics.purchasedCompanies > 0 ? [`<li>Købte virksomheder: <strong>${dkNumber.format(metrics.purchasedCompanies)}</strong></li>`] : []),
    `<li>Samlede erklæringer: <strong>${dkNumber.format(metrics.totalDeclarations)}</strong></li>`,
    `<li>Dataanalyser: <strong>${dkNumber.format(metrics.totalAnalyses)}</strong></li>`,
  ].join("");
  const assumptionsList = [
    `<li>Timer sparet pr. erklæring: <strong>${dkDecimal.format(metrics.hours)}</strong></li>`,
    `<li>Timepris: <strong>${dkCurrency.format(metrics.rate)}</strong></li>`,
    `<li>Kvalitetsfaktor: <strong>${metrics.includeQuality ? `${dkDecimal.format(metrics.qualityMultiplier)}x` : "Ikke medtaget"}</strong></li>`,
    `<li>Forventet implementeringsgrad: <strong>${pct(metrics.implementationRate)}</strong></li>`,
    `<li>Optimering ved årsrapport: <strong>${dkDecimal.format(metrics.annualReportHours)} timer</strong></li>`,
    `<li>Optimering ved assistance: <strong>${dkDecimal.format(metrics.assistanceHours)} timer</strong></li>`,
    `<li>Rapportering: <strong>${metrics.includeAddons ? `${dkNumber.format(metrics.reportingCustomers)} kunder × ${dkDecimal.format(metrics.reportingHours)} timer` : "Ikke medtaget"}</strong></li>`,
  ].join("");
  const baseText = [
    `<article class="business-case-explanation value-today"><h3>Værdi i dag</h3><p>${valueTodayText}</p>${calculationStrip("Aktive virksomheder", dkNumber.format(metrics.activeConnections), "Værdi pr. virksomhed", dkCurrency.format(valuePerCompany), "Realiseret værdi", dkCurrency.format(metrics.realizedValue))}</article>`,
    `<article class="business-case-explanation potential"><h3>Potentiale</h3><p>${potentialText}</p><ul class="value-driver-list">
      <li><span>Erklæringer</span><strong>${dkCurrency.format(metrics.realisticDeclarationValue)}</strong></li>
      <li><span>Årsrapport</span><strong>${dkCurrency.format(metrics.realisticAnnualReportValue)}</strong></li>
      <li><span>Assistance</span><strong>${dkCurrency.format(metrics.realisticAssistanceValue)}</strong></li>
      <li><span>Rapportering</span><strong>${metrics.includeAddons ? dkCurrency.format(metrics.realisticReportingValue) : "Ikke medtaget"}</strong></li>
    </ul>${potentialProgress}</article>`,
    `<article class="business-case-explanation calculation-foundation"><h3>Hvad bygger beregningen på?</h3><p>Regnemaskinen kombinerer datagrundlaget med de antagelser, brugeren selv ændrer. Kvalitet repræsenterer værdien af bedre dokumentation, færre fejl og mere ensartede arbejdsgange.</p><div class="explanation-lists"><div><h4>Fakta</h4><ul>${factsList}</ul></div><div><h4>Antagelser</h4><ul>${assumptionsList}</ul></div></div></article>`,
  ];

  const businessCaseText = document.getElementById("businessCaseText");
  if (businessCaseText) businessCaseText.innerHTML = baseText.join("");
}

function renderStatus() {
  const selected = selectedOfficeLabel();
  const status = [
    `Valgt scope: ${selected}.`,
    `Dataanalyser og aktive brugere over tid viser kun afsluttede måneder. ${PARTIAL_MONTH} er udeladt som foreløbig måned.`,
    `Aktive virksomheder vises som aktuelt forbindelsessnapshot.`,
    `Historik for aktive virksomheder findes ikke endnu.`,
    `Total kendte brugere findes ikke, så der vises aktive brugere uden bruger-rate.`,
  ];
  document.getElementById("dataStatus").innerHTML = status.map((item) => `<li>${item}</li>`).join("");
}

function renderDashboard() {
  const metrics = scopeMetrics();
  renderManagementOverview(metrics);
  renderTrends(metrics);
  renderTopUsers();
  renderCalculationBasis(metrics);
  renderOpportunities(metrics);
  renderImplementationPlan(metrics);
  renderRoi(metrics);
  renderPdfReport(metrics);
  renderStatus();
  renderArrHistoryModule();
  renderBudgetPanel();
  renderArrMovementModule();
  renderArrModule();
}

function budgetPeriodKey() {
  const slider = document.getElementById("budgetPeriodSlider");
  const idx = slider ? Number(slider.value) || 0 : 1;
  return FORECAST_PERIODS_V2[idx] || "2027";
}

function aoForecastForPeriod(cvrKey, periodKey) {
  const scenario = state.forecastScenario;
  const s = state.forecastV2[scenario] || {};
  const ao = s[cvrKey];
  if (!ao || ao.forecast == null) return 0;
  const v = ao.forecast[periodKey];
  return v === null || v === undefined || v === "" ? 0 : Number(v) || 0;
}

function aoActionPlan(cvrKey) {
  const scenario = state.forecastScenario;
  const s = state.forecastV2[scenario] || {};
  const ao = s[cvrKey];
  return (ao && ao.actionPlan) ? ao.actionPlan : "";
}

function setAoForecast(cvrKey, periodKey, value) {
  const scenario = state.forecastScenario;
  if (!state.forecastV2[scenario]) state.forecastV2[scenario] = {};
  if (!state.forecastV2[scenario][cvrKey]) state.forecastV2[scenario][cvrKey] = {};
  if (!state.forecastV2[scenario][cvrKey].forecast) state.forecastV2[scenario][cvrKey].forecast = {};
  if (value === null || value === "" || Number.isNaN(value)) {
    delete state.forecastV2[scenario][cvrKey].forecast[periodKey];
  } else {
    state.forecastV2[scenario][cvrKey].forecast[periodKey] = Number(value);
  }
  saveForecastV2();
}

function setAoActionPlan(cvrKey, text) {
  const scenario = state.forecastScenario;
  if (!state.forecastV2[scenario]) state.forecastV2[scenario] = {};
  if (!state.forecastV2[scenario][cvrKey]) state.forecastV2[scenario][cvrKey] = {};
  if (text && text.trim()) {
    state.forecastV2[scenario][cvrKey].actionPlan = text;
  } else {
    delete state.forecastV2[scenario][cvrKey].actionPlan;
  }
  saveForecastV2();
}

function aoSegmentLabel(cvrKey) {
  // Determine which group this AO primarily belongs to (priority order)
  for (const seg of [
    { key: "existing", cvrs: () => (state.data.arrYearwheel || []).map((r) => r.accounting_office_cvr) },
    { key: "top_prospects", cvrs: () => TOP_PROSPECT_CVRS },
    { key: "next_20", cvrs: () => { try { return nextFocusCvrs(20); } catch (e) { return []; } } },
    { key: "accru", cvrs: () => NEW_PROSPECT_CVRS },
    { key: "rgd", cvrs: () => RGD_CVRS },
  ]) {
    if (seg.cvrs().includes(cvrKey)) {
      return { existing: "Eksisterende kunder", top_prospects: "Top prospects", next_20: "Næste 20 fokus", accru: "Accru Partners", rgd: "RGD" }[seg.key];
    }
  }
  return "Andet";
}

function renderBudgetPanel() {
  renderBoardOverview();
  renderMasterList();
}

function renderMasterListTotals() {
  // Light-touch totals update without re-rendering rows
  const foot = document.getElementById("masterListFoot");
  const summary = document.getElementById("masterListSummary");
  if (!foot || !summary) return;
  const filter = document.getElementById("masterListFilter")?.value || "all";
  const allRows = masterListAos();
  const rows = allRows.filter((r) => {
    if (filter === "all") return true;
    if (filter === "committed") return FORECAST_PERIODS_V2.some((p) => aoForecastForPeriod(r.cvr, p) > 0);
    return r.groupKey === filter;
  });
  const periodTotals = { h2_2026: 0, "2027": 0, "2028": 0, "2029": 0 };
  const periodTotalsWeighted = { h2_2026: 0, "2027": 0, "2028": 0, "2029": 0 };
  let totalCurrentArr = 0;
  rows.forEach((r) => {
    totalCurrentArr += r.currentArr;
    const prob = aoProbability(r.cvr) / 100;
    FORECAST_PERIODS_V2.forEach((p) => {
      const v = aoForecastForPeriod(r.cvr, p);
      periodTotals[p] += v;
      periodTotalsWeighted[p] += v * prob;
    });
  });
  foot.innerHTML = `
    <tr class="ml-foot-row">
      <td colspan="2"><strong>Total (uvægtet)</strong></td>
      <td class="numeric"><strong>${dkCurrency.format(totalCurrentArr)}</strong></td>
      <td colspan="2"></td>
      ${FORECAST_PERIODS_V2.map((p) => `<td class="numeric"><strong>${dkCurrency.format(periodTotals[p])}</strong></td>`).join("")}
      <td colspan="2"></td>
    </tr>
    <tr class="ml-foot-row ml-foot-weighted">
      <td colspan="5"><strong>Total × sandsynlighed (forventet ARR)</strong></td>
      ${FORECAST_PERIODS_V2.map((p) => `<td class="numeric"><strong>${dkCurrency.format(periodTotalsWeighted[p])}</strong></td>`).join("")}
      <td colspan="2"></td>
    </tr>
  `;
  const committedAos = rows.filter((r) => FORECAST_PERIODS_V2.some((p) => aoForecastForPeriod(r.cvr, p) > 0)).length;
  const newLogoCount = rows.filter((r) => r.currentArr === 0 && FORECAST_PERIODS_V2.some((p) => aoForecastForPeriod(r.cvr, p) > 0)).length;
  summary.innerHTML = `
    <div class="rollup-stat">
      <span>ARR nu</span>
      <strong>${dkCurrency.format(totalCurrentArr)}</strong>
      <small>${rows.length} AOs i listen · ${committedAos} med commits</small>
    </div>
    ${FORECAST_PERIODS_V2.map((p) => `<div class="rollup-stat">
      <span>${FORECAST_PERIOD_LABEL[p]} (vægtet)</span>
      <strong>${dkCurrency.format(periodTotalsWeighted[p])}</strong>
      <small>Uvægtet: ${dkCurrency.format(periodTotals[p])}</small>
    </div>`).join("")}
    <div class="rollup-stat">
      <span>Nye logos</span>
      <strong>${newLogoCount}</strong>
      <small>AOs uden nuværende ARR med commits</small>
    </div>
  `;
}

// Storage helpers for master list extensions (probability, etc.)
function aoProbability(cvrKey) {
  const scenario = state.forecastScenario;
  const ao = state.forecastV2[scenario]?.[cvrKey];
  return ao?.probability != null ? Number(ao.probability) : 100;
}

function setAoProbability(cvrKey, value) {
  const scenario = state.forecastScenario;
  if (!state.forecastV2[scenario]) state.forecastV2[scenario] = {};
  if (!state.forecastV2[scenario][cvrKey]) state.forecastV2[scenario][cvrKey] = {};
  state.forecastV2[scenario][cvrKey].probability = Math.max(0, Math.min(100, Number(value) || 0));
  saveForecastV2();
}

function masterListAos() {
  // Build deduplicated list of all relevant AOs with priority group
  const groups = [
    { key: "existing", label: "Eksisterende", cvrs: () => {
      const ar = (state.data.arrYearwheel || []).filter((r) => r.status === "A" || r.status === "C").map((r) => r.accounting_office_cvr);
      const existing = (typeof EXISTING_CLIENT_CVRS !== "undefined") ? EXISTING_CLIENT_CVRS : [];
      return [...new Set([...ar, ...existing])];
    }},
    { key: "top_prospects", label: "Top prospects", cvrs: () => TOP_PROSPECT_CVRS },
    { key: "next_20", label: "Næste 20", cvrs: () => { try { return nextFocusCvrs(20); } catch { return []; } } },
    { key: "accru", label: "Accru", cvrs: () => NEW_PROSPECT_CVRS },
    { key: "rgd", label: "RGD", cvrs: () => RGD_CVRS },
  ];

  const seen = new Set();
  const rows = [];
  for (const g of groups) {
    const cvrs = g.cvrs() || [];
    for (const c of cvrs) {
      if (!c || seen.has(c)) continue;
      seen.add(c);
      const masterRow = (state.data.aoMaster || []).find((r) => cvr(r) === c);
      const wheelRow = (state.data.arrYearwheel || []).find((r) => r.accounting_office_cvr === c);
      const conn = (state.data.connections || []).find((r) => cvr(r) === c);
      rows.push({
        cvr: c,
        name: (wheelRow && wheelRow.accounting_office_name) || (masterRow && masterRow.accounting_office_name) || c,
        group: g.label,
        groupKey: g.key,
        currentArr: wheelRow ? Number(wheelRow.arr_total) || 0 : 0,
        activeSmvs: conn ? Number(conn.active_erp_connections) || 0 : 0,
        declarations: masterRow ? Number(masterRow.total_declarations) || 0 : 0,
      });
    }
  }
  return rows;
}

function renderMasterList() {
  const body = document.getElementById("masterListBody");
  const foot = document.getElementById("masterListFoot");
  const summary = document.getElementById("masterListSummary");
  if (!body || !foot || !summary) return;
  if (!state.advancedMode) {
    document.getElementById("masterListPanel").hidden = true;
    return;
  }
  document.getElementById("masterListPanel").hidden = false;

  const filter = document.getElementById("masterListFilter")?.value || "all";
  const allRows = masterListAos();
  const rows = allRows.filter((r) => {
    if (filter === "all") return true;
    if (filter === "committed") {
      return FORECAST_PERIODS_V2.some((p) => aoForecastForPeriod(r.cvr, p) > 0);
    }
    return r.groupKey === filter;
  }).sort((a, b) => {
    // Sort: groups in priority order, then current ARR desc, then name
    const groupOrder = { existing: 0, top_prospects: 1, next_20: 2, accru: 3, rgd: 4 };
    const groupDiff = (groupOrder[a.groupKey] ?? 9) - (groupOrder[b.groupKey] ?? 9);
    if (groupDiff !== 0) return groupDiff;
    if (b.currentArr !== a.currentArr) return b.currentArr - a.currentArr;
    return a.name.localeCompare(b.name);
  });

  // Render rows
  body.innerHTML = rows.map((r) => {
    const cells = FORECAST_PERIODS_V2.map((p) => {
      const val = aoForecastForPeriod(r.cvr, p);
      return `<td class="numeric"><input type="number" class="ml-cell" data-cvr="${r.cvr}" data-period="${p}" value="${val || ""}" placeholder="0" min="0" step="1000" /></td>`;
    }).join("");
    const prob = aoProbability(r.cvr);
    const groupClass = `ml-group-${r.groupKey}`;
    return `<tr class="${groupClass}">
      <td><div class="ml-name">${r.name}</div></td>
      <td><span class="ml-group-pill">${r.group}</span></td>
      <td class="numeric">${dkCurrency.format(r.currentArr)}</td>
      <td class="numeric">${dkNumber.format(r.activeSmvs)}</td>
      <td class="numeric">${dkNumber.format(r.declarations)}</td>
      ${cells}
      <td class="numeric"><input type="number" class="ml-prob" data-cvr="${r.cvr}" value="${prob}" min="0" max="100" step="5" /></td>
      <td class="ao-actions-cell"><button type="button" class="ao-edit-button" data-edit-cvr="${r.cvr}" title="Tilpas"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M11.7 1.7a1 1 0 0 1 1.4 0l1.2 1.2a1 1 0 0 1 0 1.4L5.8 13l-3.5.9.9-3.5 8.5-8.7zM11 3.1 3.6 10.6l-.4 1.7 1.7-.4L12.4 4.4 11 3.1z"/></svg></button></td>
    </tr>`;
  }).join("");

  // Totals row (probability-weighted)
  const periodTotals = { h2_2026: 0, "2027": 0, "2028": 0, "2029": 0 };
  const periodTotalsWeighted = { h2_2026: 0, "2027": 0, "2028": 0, "2029": 0 };
  let totalCurrentArr = 0;
  rows.forEach((r) => {
    totalCurrentArr += r.currentArr;
    const prob = aoProbability(r.cvr) / 100;
    FORECAST_PERIODS_V2.forEach((p) => {
      const v = aoForecastForPeriod(r.cvr, p);
      periodTotals[p] += v;
      periodTotalsWeighted[p] += v * prob;
    });
  });
  foot.innerHTML = `
    <tr class="ml-foot-row">
      <td colspan="2"><strong>Total (uvægtet)</strong></td>
      <td class="numeric"><strong>${dkCurrency.format(totalCurrentArr)}</strong></td>
      <td colspan="2"></td>
      ${FORECAST_PERIODS_V2.map((p) => `<td class="numeric"><strong>${dkCurrency.format(periodTotals[p])}</strong></td>`).join("")}
      <td colspan="2"></td>
    </tr>
    <tr class="ml-foot-row ml-foot-weighted">
      <td colspan="5"><strong>Total × sandsynlighed (forventet ARR)</strong></td>
      ${FORECAST_PERIODS_V2.map((p) => `<td class="numeric"><strong>${dkCurrency.format(periodTotalsWeighted[p])}</strong></td>`).join("")}
      <td colspan="2"></td>
    </tr>
  `;

  // Summary cards above table
  const committedAos = rows.filter((r) => FORECAST_PERIODS_V2.some((p) => aoForecastForPeriod(r.cvr, p) > 0)).length;
  const newLogoCount = rows.filter((r) => r.currentArr === 0 && FORECAST_PERIODS_V2.some((p) => aoForecastForPeriod(r.cvr, p) > 0)).length;
  summary.innerHTML = `
    <div class="rollup-stat">
      <span>ARR nu</span>
      <strong>${dkCurrency.format(totalCurrentArr)}</strong>
      <small>${rows.length} AOs i listen · ${committedAos} med commits</small>
    </div>
    ${FORECAST_PERIODS_V2.map((p) => `<div class="rollup-stat">
      <span>${FORECAST_PERIOD_LABEL[p]} (vægtet)</span>
      <strong>${dkCurrency.format(periodTotalsWeighted[p])}</strong>
      <small>Uvægtet: ${dkCurrency.format(periodTotals[p])}</small>
    </div>`).join("")}
    <div class="rollup-stat">
      <span>Nye logos</span>
      <strong>${newLogoCount}</strong>
      <small>AOs uden nuværende ARR med commits</small>
    </div>
  `;
}

function renderBoardOverview() {
  const panel = document.getElementById("boardOverview");
  if (!panel) return;
  panel.hidden = !state.advancedMode;
  if (!state.advancedMode) return;

  document.querySelectorAll("#scenarioTabs .scenario-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-scenario") === state.forecastScenario);
  });

  const sectionsEl = document.getElementById("boardSections");
  if (!sectionsEl) return;

  // === Data ===
  const yearwheel = state.data.arrYearwheel || [];
  const activeArr = yearwheel.filter((r) => r.status === "A").reduce((s, r) => s + (Number(r.arr_total) || 0), 0);
  const churnRiskArr = yearwheel.filter((r) => r.status === "C").reduce((s, r) => s + (Number(r.arr_total) || 0), 0);
  const payingArr = activeArr + churnRiskArr;
  const payingAos = yearwheel.filter((r) => r.status === "A" || r.status === "C").length;
  const healthyAos = yearwheel.filter((r) => r.status === "A").length;
  const churnRiskAos = yearwheel.filter((r) => r.status === "C").length;

  const connections = state.data.connections || [];
  const activeSmvs = connections.reduce((s, r) => s + (Number(r.active_erp_connections) || 0), 0);

  const yearlyTotals = state.data.arrYearlyTotals || [];
  const arr2024 = Number(yearlyTotals.find((r) => Number(r.year) === 2024)?.arr_total) || 0;
  const arr2025 = Number(yearlyTotals.find((r) => Number(r.year) === 2025)?.arr_total) || 0;
  const yoy26 = arr2025 ? (payingArr / arr2025 - 1) * 100 : 0;
  const arrSinceLow = arr2024 ? (payingArr / arr2024 - 1) * 100 : 0;

  const monthly = state.data.monthly || [];
  const analyses2025 = monthly.reduce((s, r) => s + (Number(r.year) === 2025 ? Number(r.analyses) || 0 : 0), 0);
  const analyses2026H1 = monthly.reduce((s, r) => s + (Number(r.year) === 2026 && Number(r.month) <= 6 ? Number(r.analyses) || 0 : 0), 0);

  // Engagement YoY: YTD jan-maj 2025 vs 2026 (kun afsluttede måneder pr. dashboard_v3_kpi_logic.md)
  const ytdSum = (year, field) => monthly.reduce((s, r) => {
    const y = Number(r.year);
    const m = Number(r.month);
    return s + (y === year && m >= 1 && m <= 5 ? Number(r[field]) || 0 : 0);
  }, 0);
  const ytdAnalyses25 = ytdSum(2025, "analyses");
  const ytdAnalyses26 = ytdSum(2026, "analyses");
  const ytdUsers25 = ytdSum(2025, "active_users");
  const ytdUsers26 = ytdSum(2026, "active_users");
  const ytdClients25 = ytdSum(2025, "distinct_clients");
  const ytdClients26 = ytdSum(2026, "distinct_clients");
  const yoyAnalyses = ytdAnalyses25 ? (ytdAnalyses26 / ytdAnalyses25 - 1) * 100 : 0;
  const yoyUsers = ytdUsers25 ? (ytdUsers26 / ytdUsers25 - 1) * 100 : 0;
  const yoyClients = ytdClients25 ? (ytdClients26 / ytdClients25 - 1) * 100 : 0;

  // Operational Efficiency
  // 2022: 14 ansatte, 608k ARR = 43k/FTE. Nu: 1 person, 866k ARR = 866k/FTE = ~20x
  const fteHistory = { 2022: 14, 2025: 2, 2026: 1 };
  const arr2022 = Number(yearlyTotals.find((r) => Number(r.year) === 2022)?.arr_total) || 0;
  const arrPerFte2022 = fteHistory[2022] ? arr2022 / fteHistory[2022] : 0;
  const arrPerFteNow = fteHistory[2026] ? payingArr / fteHistory[2026] : payingArr;
  const fteProductivityMultiplier = arrPerFte2022 ? arrPerFteNow / arrPerFte2022 : 0;

  // Onboarding 2026 YTD — fra connections_accountant (created date 2026) ELLER fra Priority clients
  // For nu bruger vi Mads' verificerede tal: 393 nye SMVs YTD ≈ 15,7/uge
  const newSmvsYtd = 393;
  const weeksYtd = 25; // jan-juni midt = ~25 uger
  const smvsPerWeek = (newSmvsYtd / weeksYtd).toFixed(1);

  // GT-koncentration
  const gtArr = yearwheel.find((r) => (r.accounting_office_name || "").toLowerCase().includes("grant thornton"))?.arr_total || 0;
  const gtConcentration = payingArr > 0 ? (gtArr / payingArr) * 100 : 0;

  // === TAM beregning fra grupper ===
  const master = state.data.aoMaster || [];
  const declarationsPerCvr = {};
  master.forEach((r) => { declarationsPerCvr[cvr(r)] = Number(r.total_declarations) || 0; });
  const existingCvrs = (typeof EXISTING_CLIENT_CVRS !== "undefined") ? EXISTING_CLIENT_CVRS : [];
  const sumDecl = (cvrs) => (cvrs || []).reduce((s, c) => s + (declarationsPerCvr[c] || 0), 0);
  const PRICE_SOFTWARE = 1226;
  const PRICE_REPORT = 200;
  const PRICE_ASSISTANCE = 200;
  const groupData = [
    { key: "existing", label: "Eksisterende kunder", impl: 0.25, decl: sumDecl(existingCvrs), current: 1186 },
    { key: "top_prospects", label: "Top prospects", impl: 0.05, decl: sumDecl(TOP_PROSPECT_CVRS), current: 43 },
    { key: "next_20", label: "Næste 20 fokus", impl: 0.02, decl: 39900, current: 9 },
    { key: "accru", label: "Accru Partners", impl: 0.02, decl: sumDecl(NEW_PROSPECT_CVRS), current: 39 },
    { key: "rgd", label: "RGD", impl: 0.02, decl: sumDecl(RGD_CVRS), current: 834 },
  ];
  groupData.forEach((g) => {
    g.target = Math.round(g.decl * g.impl);
    g.gap = g.target - g.current;
    g.arrSoftware = g.target * PRICE_SOFTWARE;
    g.arrReports = g.target * PRICE_REPORT;
    g.arrAssistance = g.target * PRICE_ASSISTANCE;
    g.arrTotal = g.arrSoftware + g.arrReports + g.arrAssistance;
  });
  const tamSoftware = groupData.reduce((s, g) => s + g.arrSoftware, 0);
  const tamReports = groupData.reduce((s, g) => s + g.arrReports, 0);
  const tamAssistance = groupData.reduce((s, g) => s + g.arrAssistance, 0);
  const tamTotal = tamSoftware + tamReports + tamAssistance;
  const tamNewSegments = tamReports + tamAssistance;
  const newSegmentShare = tamTotal > 0 ? (tamNewSegments / tamTotal) * 100 : 0;

  // === RENDER ===
  // Headline KPIs: ARR, YoY, NRR, GRR — med forklaringer
  const headlineKpis = `
    <div class="board-headline-kpis">
      <article class="board-kpi-big">
        <span class="board-kpi-label">ARR</span>
        <strong class="board-kpi-value">${dkCurrency.format(payingArr)}</strong>
        <p class="board-kpi-def">Annual Recurring Revenue — vores årlige tilbagevendende omsætning fra betalende kunder.</p>
        <small class="board-kpi-context">+${arrSinceLow.toFixed(0)}% siden 2024-lavpunktet på 373k</small>
      </article>
      <article class="board-kpi-big">
        <span class="board-kpi-label">YoY ARR</span>
        <strong class="board-kpi-value">+${yoy26.toFixed(0)}%</strong>
        <p class="board-kpi-def">Vækst fra sidste år (Year-over-Year) — hvor meget ARR er steget siden 2025.</p>
        <small class="board-kpi-context">Top-decile B2B SaaS ligger på 50-80% · vi er over</small>
      </article>
      <article class="board-kpi-big">
        <span class="board-kpi-label">NRR</span>
        <strong class="board-kpi-value">165%</strong>
        <p class="board-kpi-def">Net Revenue Retention — hvor meget eksisterende kunder betaler i år sammenlignet med sidste år (efter tilkøb, nedjusteringer og opsigelser).</p>
        <small class="board-kpi-context">World-class · Snowflake i sine bedste år: 158-178%</small>
      </article>
      <article class="board-kpi-big">
        <span class="board-kpi-label">GRR</span>
        <strong class="board-kpi-value">94%</strong>
        <p class="board-kpi-def">Gross Revenue Retention — hvor stor en del af vores ARR vi beholder fra eksisterende kunder uden at lade tilkøb maskere tab.</p>
        <small class="board-kpi-context">Top-kvartil · 90%+ regnes som excellent</small>
      </article>
    </div>`;

  const supportingKpis = `
    <div class="board-supporting-kpis">
      <article class="board-kpi-mid">
        <span>Aktive SMVs</span>
        <strong>${dkNumber.format(activeSmvs)}</strong>
        <small>+47% YoY · slut-bruger-engagement</small>
      </article>
      <article class="board-kpi-mid">
        <span>Betalende AOs</span>
        <strong>${dkNumber.format(payingAos)}</strong>
        <small>${healthyAos} healthy · ${churnRiskAos} churn risk</small>
      </article>
      <article class="board-kpi-mid">
        <span>GT-koncentration</span>
        <strong>${gtConcentration.toFixed(0)}%</strong>
        <small>Stærk reference · diversificering = prioritet</small>
      </article>
      <article class="board-kpi-mid">
        <span>Dataanalyser H1</span>
        <strong>${dkNumber.format(analyses2026H1)}</strong>
        <small>Allerede over hele 2025 (${dkNumber.format(analyses2025)})</small>
      </article>
    </div>`;

  // Operational Efficiency — den stærkeste enkelt-fortælling: 1 person leverer 866k ARR
  const efficiencyKpis = `
    <div class="board-supporting-kpis board-efficiency-kpis">
      <article class="board-kpi-mid board-kpi-efficiency">
        <span>Kommerciel team</span>
        <strong>${fteHistory[2026]} person</strong>
        <small>14 i 2022 · 2 i 2025 · solo siden sep '25</small>
      </article>
      <article class="board-kpi-mid board-kpi-efficiency">
        <span>ARR pr. kommerciel FTE</span>
        <strong>${dkCurrency.format(arrPerFteNow)}</strong>
        <small>${fteProductivityMultiplier ? fteProductivityMultiplier.toFixed(0) + "x stigning siden 2022 (" + dkCurrency.format(arrPerFte2022) + ")" : "—"}</small>
      </article>
      <article class="board-kpi-mid board-kpi-efficiency">
        <span>Nye SMVs YTD</span>
        <strong>${dkNumber.format(newSmvsYtd)}</strong>
        <small>${smvsPerWeek}/uge · onboardingstempo</small>
      </article>
      <article class="board-kpi-mid board-kpi-efficiency">
        <span>Burn rate</span>
        <strong>↓</strong>
        <small>Faldet markant mens ARR + retention vokser</small>
      </article>
    </div>`;

  // Engagement YoY — brugen fordobler sig
  // Akkumulerede analyser på tværs af alle år (produkt-fit signal)
  const cumulativeAnalyses = monthly.reduce((s, r) => s + (Number(r.analyses) || 0), 0);
  const analyses2024 = monthly.reduce((s, r) => s + (Number(r.year) === 2024 ? Number(r.analyses) || 0 : 0), 0);

  const engagementKpis = `
    <div class="board-supporting-kpis board-engagement-kpis">
      <article class="board-kpi-mid board-kpi-engagement">
        <span>Dataanalyser YoY</span>
        <strong>+${yoyAnalyses.toFixed(0)}%</strong>
        <small>${dkNumber.format(ytdAnalyses25)} → ${dkNumber.format(ytdAnalyses26)} (YTD jan-maj)</small>
      </article>
      <article class="board-kpi-mid board-kpi-engagement">
        <span>Aktive brugere YoY</span>
        <strong>+${yoyUsers.toFixed(0)}%</strong>
        <small>${dkNumber.format(ytdUsers25)} → ${dkNumber.format(ytdUsers26)} (YTD jan-maj)</small>
      </article>
      <article class="board-kpi-mid board-kpi-engagement">
        <span>Unikke brugervirksomheder YoY</span>
        <strong>+${yoyClients.toFixed(0)}%</strong>
        <small>${dkNumber.format(ytdClients25)} → ${dkNumber.format(ytdClients26)} (YTD jan-maj)</small>
      </article>
      <article class="board-kpi-mid board-kpi-engagement">
        <span>Akkumulerede dataanalyser</span>
        <strong>${dkNumber.format(cumulativeAnalyses)} <em class="board-kpi-growth">${analyses2024 > 0 ? "+" + Math.round((cumulativeAnalyses / analyses2024 - 1) * 100).toLocaleString("da-DK") + "%" : ""}</em></strong>
        <small>${dkNumber.format(analyses2024)} (2024) → ${dkNumber.format(analyses2025)} (2025) → ${dkNumber.format(analyses2026H1)} (H1'26)</small>
      </article>
    </div>`;

  // Trajectory-scenarier — Conservative / Base / Stretch
  function renderTrajectorySection() {
    const scenarios = {
      conservative: {
        label: "Conservative",
        target: "1,3M underskrevet 2026",
        intro: "Flere af de store bets lander ikke. GT-aftalen sker langsommere. Annual Reports launcher men adoption er lav. Færre top prospects lukker.",
        rows: [
          { year: "Underskrevne kontrakter 2026", value: "~1,3M", note: "Total kontraktværdi" },
          { year: "End-2026 faktureret", value: "~0,9M" },
          { year: "Akkumuleret rate jan 2027", value: "~1,9M" },
          { year: "End-2027 ARR", value: "2,5-3,0M" },
          { year: "End-2028 ARR", value: "3,0-3,8M" },
          { year: "End-2029 ARR", value: "3,8-4,8M" },
        ],
        components: [
          { name: "GT slot-expand", value: "+350k", note: "1.450 slots (ikke fuld 2.000)",
            aoList: [{ name: "Grant Thornton", smvs: "740 → 1.450", action: "Slot-tilkøb forhandlet" }] },
          { name: "10 nye AOs", value: "+200k", note: "20-25k gennemsnit · Q4-tunge",
            aoList: [
              { name: "Albjerg", smvs: "0 → 20", action: "Q3 dialog" },
              { name: "Piaster", smvs: "0 → 20", action: "Q3 dialog" },
              { name: "PKF", smvs: "0 → 20", action: "Q4" },
              { name: "Tal & Tanker", smvs: "0 → 20", action: "Q4" },
              { name: "Sønderjyllands Revision", smvs: "0 → 20", action: "Q4" },
              { name: "Aaen & Co", smvs: "0 → 20", action: "Q4" },
              { name: "Krøyer Pedersen", smvs: "0 → 20", action: "Q4" },
              { name: "Dansk Revision Frederikssund", smvs: "0 → 20", action: "Q4" },
              { name: "VH Revision", smvs: "0 → 20", action: "Q4" },
              { name: "Christensen Kjærulff", smvs: "0 → 20", action: "Q4" },
            ] },
          { name: "Annual Reports adoption", value: "+100k", note: "4-5 AOs adopterer",
            aoList: [
              { name: "Grant Thornton", smvs: "Tilkøb", action: "Sweetener i 2.000-aftale" },
              { name: "Skov Revision", smvs: "Tilkøb", action: "Case study" },
              { name: "Edelbo", smvs: "Tilkøb", action: "Q4" },
              { name: "Revimidt", smvs: "Tilkøb", action: "Q4" },
            ] },
          { name: "Mid-market expand", value: "+100k", note: "Buus + Edelbo beskeden tilkøb",
            aoList: [
              { name: "Buus Jensen", smvs: "21 → 40", action: "Q3 review" },
              { name: "Edelbo", smvs: "80 → 110", action: "Q3 review" },
            ] },
          { name: "Beierholm dialog", value: "+25k", note: "Lille pilot",
            aoList: [{ name: "Beierholm", smvs: "8 → 30", action: "Minimal pilot" }] },
          { name: "Top prospects (2-3)", value: "+525k", note: "150-200k gennemsnit",
            aoList: [
              { name: "Redmark", smvs: "0 → 200", action: "Stort deal" },
              { name: "Martinsen", smvs: "0 → 150", action: "Stort deal" },
              { name: "RSM", smvs: "0 → 100", action: "Q4" },
            ] },
        ],
        actions: [
          "Fokus på 2-3 store deals fremfor mange små",
          "Annual Reports launches sent H2 — kun aktive AOs får det først",
          "GT-relation prioriteres men aftale tager længere",
          "Skov-launch som bevis bruges som case study",
        ],
        customerActions: [
          "GT: Acceptere 1.450-slot-niveau (ikke fuld expansion)",
          "Skov: Adoptere Annual Reports som case",
          "2-3 mid-market kunder: Modest uplift på slot-niveau",
          "Beierholm: Forblive i dialog uden konkret implementering",
          "2-3 top prospects: Signere kontrakter",
        ],
        h2Priorities: [
          "Lukke 2-3 store deals med konkrete prospects (150-200k snit)",
          "Annual Reports launch i sen H2 — kun til de mest engagerede AOs",
          "Stabilisere eksisterende kunde-base · hold på status C-kunder",
          "GT-dialog: forhandle 1.450 slots som realistic mål",
        ],
        risks: "Hvis GT siger nej til 2026-expand falder vi til ~1,2M. Conservative er det realistiske gulv — IKKE worst case.",
      },
      base: {
        label: "Base · MÅL",
        target: "2,3M underskrevet 2026",
        intro: "Vores aktive 2026-mål: kontrakter underskrevet for 2,3M inden 31.12.26 — alignet med januar-budgettets accountants-omsætning (5,3M total minus 3M banks = 2,3M). Realistisk men ambitiøst. OPSIDE: hvis GT signer for 25% af deres 11.366 erklæringer (2.842 slots i stedet for 2.000), så +470k oveni.",
        rows: [
          { year: "Underskrevne kontrakter 2026", value: "2,3M", note: "Alignet med januar-budget" },
          { year: "End-2026 faktureret", value: "~1,2M" },
          { year: "Akkumuleret rate jan 2027", value: "~3,1M" },
          { year: "End-2027 ARR", value: "3,8-4,5M" },
          { year: "End-2028 ARR", value: "5,0-6,5M" },
          { year: "End-2029 ARR", value: "6,5-8,5M" },
        ],
        components: [
          { name: "GT slot-expand 740 → 2.000", value: "+735k", note: "Aftale lukket sep-okt. Opside: 2.842 slots (= 25% af GT's 11.366 erklæringer) = +1,2M i alt — +470k mere end 2.000-scenariet.",
            aoList: [{ name: "Grant Thornton", smvs: "740 → 2.000 (Base) / 2.842 (25% opside)", action: "Møde med Jonas inden juli · beslutning sep-okt" }] },
          { name: "15 nye AOs underskrevne", value: "+400k", note: "8 i Q3 · 7 i Q4 · gns. 25-30k",
            aoList: [
              { name: "Albjerg", smvs: "0 → 25", action: "Q3 · dialog i gang" },
              { name: "Piaster", smvs: "0 → 25", action: "Q3" },
              { name: "PKF", smvs: "0 → 30", action: "Q3" },
              { name: "Tal & Tanker", smvs: "0 → 25", action: "Q3" },
              { name: "Sønderjyllands Revision", smvs: "0 → 25", action: "Q3" },
              { name: "Aaen & Co", smvs: "0 → 25", action: "Q3" },
              { name: "Krøyer Pedersen", smvs: "0 → 25", action: "Q3" },
              { name: "Baker Tilly", smvs: "0 → 30", action: "Q3" },
              { name: "Dansk Revision Frederikssund", smvs: "0 → 25", action: "Q4" },
              { name: "VH Revision", smvs: "0 → 25", action: "Q4" },
              { name: "Andersen Revision", smvs: "0 → 25", action: "Q4" },
              { name: "Midt-revi", smvs: "0 → 25", action: "Q4" },
              { name: "Christensen Kjærulff", smvs: "0 → 30", action: "Q4" },
              { name: "Addere", smvs: "0 → 25", action: "Q4" },
              { name: "Rödl & Partner", smvs: "0 → 25", action: "Q4" },
            ] },
          { name: "Annual Reports adoption", value: "+300k", note: "10 af 14 healthy AOs · gns. 30k pr. AO",
            aoList: [
              { name: "Grant Thornton", smvs: "Tilkøb til 2.000-aftalen", action: "Sweetener" },
              { name: "Skov Revision", smvs: "Tilkøb til hele kundebase", action: "Case study" },
              { name: "Powered-By", smvs: "Tilkøb", action: "Q3 dialog" },
              { name: "Revisionsfirmaet Edelbo", smvs: "Tilkøb", action: "Q3 dialog" },
              { name: "Revimidt", smvs: "Tilkøb", action: "Q3 dialog" },
              { name: "Revisionsfirmaet Axel Gram", smvs: "Tilkøb", action: "Q3 dialog" },
              { name: "Kreston CM", smvs: "Tilkøb", action: "Q4" },
              { name: "Dansk Revision Århus", smvs: "Tilkøb", action: "Q4" },
              { name: "Buus Jensen", smvs: "Tilkøb", action: "Q4" },
              { name: "RevisorGruppen", smvs: "Tilkøb", action: "Q4" },
            ] },
          { name: "Mid-market expand", value: "+200k", note: "Buus, Edelbo, Revimidt, Kreston",
            aoList: [
              { name: "Buus Jensen", smvs: "21 → 50", action: "Q3 value-review" },
              { name: "Revisionsfirmaet Edelbo", smvs: "80 → 130", action: "Q3 value-review" },
              { name: "Revimidt", smvs: "27 → 60", action: "Q3 value-review" },
              { name: "Kreston CM", smvs: "20 → 45", action: "Q4" },
            ] },
          { name: "Beierholm pilot underskrevet", value: "+100k", note: "150-200 SMVs som start",
            aoList: [{ name: "Beierholm", smvs: "8 → 150-200", action: "Webinar-serie H2 · pilot signed senest dec" }] },
          { name: "Top prospects (5 navne)", value: "+600k", note: "Gns. 120k pr. deal · større aftaler",
            aoList: [
              { name: "Redmark", smvs: "0 → 200", action: "Stort deal · Q3 dialog" },
              { name: "Martinsen", smvs: "0 → 175", action: "Stort deal · Q3 dialog" },
              { name: "RSM", smvs: "0 → 150", action: "Q4" },
              { name: "Tal & Tanker", smvs: "0 → 100", action: "Q4" },
              { name: "Christensen Kjærulff", smvs: "0 → 125", action: "Q4" },
            ] },
        ],
        actions: [
          "GT: Møde med Jonas Bødker-Iversen inden juli. Konkret 2.000-slot plan med opside på 2.842 slots (25% af GT's 11.366 erklæringer). Annual Reports som sweetener. Beslutning forventet sep-okt.",
          "Annual Reports: Skov-launch som case study · personlige onboarding-samtaler med 14 healthy AOs · target 10 opt-ins ved EOY",
          "Beierholm: Webinar-serien i H2 leverer på data + rapportering · pilot-aftale signed senest dec 2026",
          "15 nye AOs: Digitaliseringsdagen + webinarer som lead-magnet · fokus på 22 RGD-medlemmer ikke-signed · 8 lukker okt-dec, 7 jan-feb",
          "Mid-market: Individuel value-review med hver hovedperson i Q3 · Annual Reports som expand-trigger · target ~50% uplift pr. kunde",
          "Top prospects: Navngiv top 5 nu · konkret dialogue-plan · 2 lukker i Q3, 3 i Q4 · gennemsnit 150k pr. deal",
          "Q4-tunghed: 70% af signed deals lander okt-dec — H2-momentum + Q1 2027-pipeline",
        ],
        customerActions: [
          "GT: Lukke 2.000-slot-aftalen sep-okt (eller 2.842 slots = 25% af deres erklæringer som opside)",
          "Skov: Lancere Annual Reports til deres SMV-base · case study klar Q3",
          "Beierholm: Signere pilot-aftale på 150-200 SMVs senest dec 2026",
          "Mid-market (Buus, Edelbo, Revimidt, Kreston): Beslutte expand-niveau efter Q3-review · target ~50% uplift",
          "10 af 14 healthy AOs: Opt-in til Annual Reports inden EOY",
          "5 top prospects: Tag møder · prøv produktet · signere kontrakter (2 Q3, 3 Q4)",
          "15 nye AOs: Beslutte at blive Crediwire-kunder via Digitaliseringsdagen / webinarer",
        ],
        h2Priorities: [
          "GT 740 → 2.000 signed: +700k ARR + base for run-rate 2027",
          "Annual Reports launch + adoption hos 10 healthy AOs: +300k",
          "5 top prospects signed (navne defineres): +750k",
          "15 nye AOs på listen (8 Q3 + 7 Q4): +400k",
          "Mid-market expand 4 kunder: +250k",
          "Beierholm pilot signed: +100k",
          "Bibehold NRR 165% / GRR 94% gennem H2",
        ],
        risks: "Solo-kapacitet betyder én udskudt stor deal forsinker andre. GT-aftalen er enkeltvigtigste komponent (28% af målet). Hvis 2 ud af 6 komponenter underperformer 30% → lander ved ~1,8M (mellem Conservative og Base).",
      },
      stretch: {
        label: "Stretch",
        target: "3,3M underskrevet 2026",
        intro: "Alt går efter planen + prismodellen rammer. GT signer for 25% af deres 11.366 erklæringer (= 2.842 slots, op fra 740 nu). Annual Reports rammer markedet hårdt. 20+ nye AOs underskrevet. Beierholm whale-deal lander.",
        rows: [
          { year: "Underskrevne kontrakter 2026", value: "3,3M", note: "Aggressivt mål" },
          { year: "End-2026 faktureret", value: "~1,6M" },
          { year: "Akkumuleret rate jan 2027", value: "~4,1M" },
          { year: "End-2027 ARR", value: "5,0-6,5M" },
          { year: "End-2028 ARR", value: "7,0-9,0M" },
          { year: "End-2029 ARR", value: "9,0-12M" },
        ],
        components: [
          { name: "GT slot-expand 740 → 2.842", value: "+1.100k", note: "2.842 slots = 25% af GT's 11.366 erklæringer. Aftale lukket i H2 2026.",
            aoList: [{ name: "Grant Thornton", smvs: "740 → 2.842 (25%)", action: "Fuld 25%-aftale signed sep-okt" }] },
          { name: "20 nye AOs underskrevne", value: "+600k", note: "Compound effekt af relationship selling",
            aoList: [
              { name: "Albjerg", smvs: "0 → 35", action: "Q3" },
              { name: "Piaster", smvs: "0 → 30", action: "Q3" },
              { name: "PKF", smvs: "0 → 30", action: "Q3" },
              { name: "Tal & Tanker", smvs: "0 → 30", action: "Q3" },
              { name: "Sønderjyllands Revision", smvs: "0 → 30", action: "Q3" },
              { name: "Aaen & Co", smvs: "0 → 30", action: "Q3" },
              { name: "Krøyer Pedersen", smvs: "0 → 35", action: "Q3" },
              { name: "Baker Tilly", smvs: "0 → 35", action: "Q3" },
              { name: "Dansk Revision Frederikssund", smvs: "0 → 30", action: "Q4" },
              { name: "VH Revision", smvs: "0 → 30", action: "Q4" },
              { name: "Andersen Revision", smvs: "0 → 30", action: "Q4" },
              { name: "Midt-revi", smvs: "0 → 30", action: "Q4" },
              { name: "Christensen Kjærulff", smvs: "0 → 35", action: "Q4" },
              { name: "Addere", smvs: "0 → 30", action: "Q4" },
              { name: "Rödl & Partner", smvs: "0 → 30", action: "Q4" },
              { name: "Kallermann", smvs: "0 → 30", action: "Q4" },
              { name: "Bille & Buch-Andersen", smvs: "0 → 30", action: "Q4" },
              { name: "Mernø Revision", smvs: "0 → 30", action: "Q4" },
              { name: "Lars-olsen", smvs: "0 → 30", action: "Q4" },
              { name: "Revisionscentret", smvs: "0 → 30", action: "Q4" },
            ] },
          { name: "Annual Reports adoption", value: "+400k", note: "12+ af 14 healthy + 2-3 nye",
            aoList: [
              { name: "Alle healthy eksisterende", smvs: "Tilkøb til hele basen", action: "Bredt rul-ud" },
              { name: "Beierholm", smvs: "Pilot inkluderer årsrapporter", action: "Whale-pakke" },
            ] },
          { name: "Mid-market expand", value: "+350k", note: "Mere aggressive opgrader + større pris",
            aoList: [
              { name: "Buus Jensen", smvs: "21 → 80", action: "Q3 + prisuplift" },
              { name: "Edelbo", smvs: "80 → 200", action: "Q3 + prisuplift" },
              { name: "Revimidt", smvs: "27 → 100", action: "Q3 + prisuplift" },
              { name: "Kreston CM", smvs: "20 → 80", action: "Q4" },
            ] },
          { name: "Beierholm whale-deal", value: "+200k", note: "300+ SMVs aftale",
            aoList: [{ name: "Beierholm", smvs: "8 → 300+", action: "Full implementation Q4" }] },
          { name: "Top prospects (7+ navne)", value: "+650k", note: "Større pipeline-konvertering",
            aoList: [
              { name: "Redmark", smvs: "0 → 250", action: "Stort deal Q3" },
              { name: "Martinsen", smvs: "0 → 200", action: "Stort deal Q3" },
              { name: "RSM", smvs: "0 → 175", action: "Q3-Q4" },
              { name: "Tal & Tanker", smvs: "0 → 125", action: "Q4" },
              { name: "Christensen Kjærulff", smvs: "0 → 150", action: "Q4" },
              { name: "Inforevision", smvs: "0 → 100", action: "Q4 hvis dialog" },
              { name: "Roesgaard", smvs: "0 → 100", action: "Q4 hvis dialog" },
            ] },
        ],
        actions: [
          "Alt fra Base PLUS:",
          "Prisuplift på årsrapport (200 → 300 kr) og assistance (200 → 300 kr) effektiv 2027",
          "Ekstra Mads-type sælger ansat sent 2026 → compound i 2027",
          "Beierholm: Fra pilot til full implementation aftale i 2026",
          "RGD-konverteringer accelererer fra Beierholm-precedent",
        ],
        customerActions: [
          "GT: Signere for 25% af deres erklæringer (= 2.842 slots) i H2 2026",
          "Beierholm: Lukke whale-deal på 300+ SMVs i 2026",
          "12+ healthy AOs: Adopterer Annual Reports broad",
          "22 nye AOs: Beslutter at blive Crediwire-kunder",
          "7+ top prospects: Signere kontrakter med større deals",
          "Mid-market: Acceptere prisuplift + ekspansion",
        ],
        h2Priorities: [
          "Lukke GT 25%-aftalen (2.842 slots, op fra 740 nu): +1.200k",
          "Annual Reports broad adoption (12+ AOs): +400k",
          "22 nye AOs signed: +600k",
          "Beierholm whale-deal (300+ SMVs): +200k",
          "Mid-market aggressive expand: +400k",
          "7+ top prospects signed: +750k",
          "Prismodel effektiveres til 2027 (årsrapport 300 kr)",
          "Ansætte ny kommerciel ressource (compound 2027)",
        ],
        risks: "Forudsætter at GT siger ja til fuld 2.000-aftale + at Annual Reports adoption rammer 85%+ + at prisuplift accepteres. Tre-fags afhængighed. Sandsynlighed: ~20-25%.",
      },
    };

    return `
      <article class="trajectory-section">
        <header class="trajectory-section-header">
          <h3>Hvad er realistisk at vi omsætter for?</h3>
          <p class="trajectory-section-intro">Tre scenarier. Klik på et kort for at udfolde dets detaljer — du kan have flere åbne samtidig så du kan sammenligne.</p>
        </header>

        <div class="trajectory-cards-stack">
          ${Object.entries(scenarios).map(([key, sc]) => {
            const isOpen = Boolean(state.trajectoryOpen && state.trajectoryOpen[key]);
            const isBase = key === "base";
            return `
              <article class="trajectory-card-row ${isOpen ? "is-open" : ""} ${isBase ? "is-base" : ""}" data-trajectory="${key}">
                <button type="button" class="trajectory-card-toggle" data-trajectory-toggle="${key}" aria-expanded="${isOpen}">
                  <span class="trajectory-card-chevron" aria-hidden="true">▾</span>
                  <div class="trajectory-card-headline">
                    <div class="trajectory-card-labelblock">
                      <span class="trajectory-card-label">${sc.label}</span>
                      ${isBase ? `<span class="trajectory-card-badge">DIT MÅL</span>` : ""}
                    </div>
                    <strong class="trajectory-card-target">${sc.target}</strong>
                  </div>
                  <div class="trajectory-card-summary-row">
                    <p class="trajectory-card-summary-intro">${sc.intro.split(".")[0]}.</p>
                    <span class="trajectory-card-action-hint">${isOpen ? "Klik for at skjule" : "Klik for at udfolde"}</span>
                  </div>
                </button>
                ${isOpen ? renderScenarioDetails(sc) : ""}
              </article>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }

  function renderScenarioDetails(s) {
    return `
      <div class="trajectory-card-body">

        <section class="trajectory-block">
          <h5>Tal-trajectory</h5>
          <ul class="trajectory-rows">
            ${s.rows.map((r) => `<li>
              <span class="trajectory-year">${r.year}:</span>
              <strong class="trajectory-value">${r.value}</strong>
              ${r.note ? `<span class="trajectory-note">${r.note}</span>` : ""}
            </li>`).join("")}
          </ul>
        </section>

        <section class="trajectory-block">
          <h5>Komponenter — hvor de underskrevne kontrakter kommer fra</h5>
          <p class="trajectory-block-help">Klik en komponent for at se hvilke specifikke AOs der ligger til grund + hvor mange SMVs der skal onboardes.</p>
          <div class="components-list">
            ${s.components.map((c, idx) => `
              <details class="component-item">
                <summary class="component-summary">
                  <span class="component-name">${c.name}</span>
                  <strong class="component-value">${c.value}</strong>
                </summary>
                <div class="component-body">
                  <p class="component-note">${c.note}</p>
                  ${c.aoList && c.aoList.length ? `
                    <table class="component-ao-table">
                      <thead>
                        <tr>
                          <th>Revisionshus</th>
                          <th>SMVs der skal onboardes</th>
                          <th>Aktion</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${c.aoList.map((ao) => `
                          <tr>
                            <td><strong>${ao.name}</strong></td>
                            <td>${ao.smvs}</td>
                            <td>${ao.action}</td>
                          </tr>
                        `).join("")}
                      </tbody>
                    </table>
                  ` : ""}
                </div>
              </details>
            `).join("")}
          </div>
        </section>

        <div class="trajectory-actions-grid">
          <section class="trajectory-block trajectory-block-mine">
            <h5>Mine actions</h5>
            <ul class="trajectory-actions-list">
              ${s.actions.map((a) => `<li>${a}</li>`).join("")}
            </ul>
          </section>
          <section class="trajectory-block trajectory-block-customer">
            <h5>Kundernes actions</h5>
            <ul class="trajectory-actions-list">
              ${(s.customerActions || []).map((a) => `<li>${a}</li>`).join("")}
            </ul>
          </section>
        </div>

        <section class="trajectory-block trajectory-block-priorities">
          <h5>H2 2026 prioriteter — det her skal lande</h5>
          <ol class="trajectory-priorities-list">
            ${(s.h2Priorities || []).map((p) => `<li>${p}</li>`).join("")}
          </ol>
        </section>

        <section class="trajectory-block trajectory-block-risks">
          <h5>Risici og antagelser</h5>
          <p>${s.risks}</p>
        </section>
      </div>
    `;
  }

  // Beregn cumulative growth for brug i boardReportSection1
  const cumulativeGrowthSince24 = analyses2024 > 0
    ? Math.round((cumulativeAnalyses / analyses2024 - 1) * 100).toLocaleString("da-DK")
    : "—";

  // Total TAM (alle 932 AOs i markedet)
  // Crediwire revenue = customer investment (vores indtægt)
  // Customer value = timer sparet × timepris × kvalitet (deres upside)
  const allMasterDecl = master.reduce((s, r) => s + (Number(r.total_declarations) || 0), 0);
  const allMasterAos = master.length;
  const totalTamPct = Math.max(1, Math.min(100, state.totalTamPct != null ? state.totalTamPct : 100));
  const totalTamSmvs = Math.round(allMasterDecl * (totalTamPct / 100));
  // Crediwire revenue side
  const totalTamSoftware = totalTamSmvs * PRICE_SOFTWARE;
  const totalTamReports = totalTamSmvs * PRICE_REPORT;
  const totalTamAssistance = totalTamSmvs * PRICE_ASSISTANCE;
  const totalCwRevenue = totalTamSoftware + totalTamReports + totalTamAssistance;
  // Customer value side: 12 timer/SMV (4+4+4) × 900 kr × 2 (kvalitet) = 21.600 / SMV
  const HOURS_PER_SMV = 12;
  const HOURLY_RATE = 900;
  const QUALITY = 2;
  const VALUE_PER_SMV = HOURS_PER_SMV * HOURLY_RATE * QUALITY; // 21.600
  const totalCustomerValue = totalTamSmvs * VALUE_PER_SMV;
  const totalCustomerNet = totalCustomerValue - totalCwRevenue;
  const customerRoi = totalCwRevenue > 0 ? totalCustomerValue / totalCwRevenue : 0;

  const totalTamBlock = `
    <section class="board-block board-total-tam">
      <h3>Total TAM · Hele markedet (alle ${dkNumber.format(allMasterAos)} revisionshuse)</h3>
      <div class="total-tam-row">
        <div class="total-tam-control">
          <label class="total-tam-label">
            <span>Implementeringsgrad</span>
            <strong id="totalTamPctLabel">${totalTamPct}%</strong>
          </label>
          <input type="range" id="totalTamSlider" min="1" max="100" step="1" value="${totalTamPct}" class="implementation-timeline-input total-tam-slider" />
          <div class="total-tam-marks" aria-hidden="true">
            <span>1%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
          <p class="total-tam-control-note">${dkNumber.format(totalTamSmvs)} SMVs af ${dkNumber.format(allMasterDecl)} totale erklæringer i markedet</p>
        </div>
        <article class="total-tam-card total-tam-revenue">
          <span>Crediwire revenue <em>(= kundernes investering)</em></span>
          <strong>${dkCurrency.format(totalCwRevenue)}</strong>
          <small>Ved ${totalTamPct}% implementering på listepriser</small>
        </article>
      </div>

      <div class="value-stack">
        <h4>Hvad det betyder for kunderne</h4>
        <div class="value-stack-row">
          <div class="value-stack-card">
            <span>Kundernes upside (værdi af tidsbesparelse)</span>
            <strong>${dkCurrency.format(totalCustomerValue)}</strong>
            <small>${HOURS_PER_SMV} timer × ${dkNumber.format(HOURLY_RATE)} kr × kvalitet ${QUALITY} = ${dkNumber.format(VALUE_PER_SMV)} kr / SMV</small>
          </div>
          <div class="value-stack-arrow">−</div>
          <div class="value-stack-card value-stack-revenue">
            <span>Kundernes investering (vores revenue)</span>
            <strong>${dkCurrency.format(totalCwRevenue)}</strong>
            <small>1.226 + 200 + 200 = 1.626 kr / SMV</small>
          </div>
          <div class="value-stack-arrow">=</div>
          <div class="value-stack-card value-stack-net">
            <span>Kundernes nettoværdi</span>
            <strong>${dkCurrency.format(totalCustomerNet)}</strong>
            <small>Customer ROI: ${customerRoi.toFixed(1)}x</small>
          </div>
        </div>
      </div>

      <div class="total-tam-breakdown">
        <p class="total-tam-breakdown-label">Crediwire revenue brydes ned på:</p>
        <div class="total-tam-breakdown-row">
          <div class="total-tam-brick">
            <span>Software (1.226 kr/SMV)</span>
            <strong>${dkCurrency.format(totalTamSoftware)}</strong>
          </div>
          <div class="total-tam-brick total-tam-new">
            <span>Årsrapport (200 kr/SMV)</span>
            <strong>${dkCurrency.format(totalTamReports)}</strong>
          </div>
          <div class="total-tam-brick total-tam-new">
            <span>Assistance (200 kr/SMV)</span>
            <strong>${dkCurrency.format(totalTamAssistance)}</strong>
          </div>
        </div>
      </div>
      <p class="total-tam-note">Det her er det absolutte loft for vores revenue, hvis vi vinder hele markedet. Vores valgte fokus-grupper nedenfor er det realistiske mål.</p>
    </section>`;

  // Headroom (5 grupper) — same revenue/value distinction
  const groupTotalSmvs = groupData.reduce((s, g) => s + g.target, 0);
  const groupCustomerValue = groupTotalSmvs * VALUE_PER_SMV;
  const groupCustomerNet = groupCustomerValue - tamTotal;
  const groupRoi = tamTotal > 0 ? groupCustomerValue / tamTotal : 0;

  const headroom = `
    <section class="board-block board-headroom">
      <h3>Headroom · Valgte fokus-grupper (5 segmenter)</h3>

      <article class="headroom-revenue-card">
        <span>Crediwire revenue ved fuld implementering af de 5 grupper</span>
        <strong>${dkCurrency.format(tamTotal)}</strong>
        <small>${(tamTotal / payingArr).toFixed(0)}x nuværende ARR · ${dkNumber.format(groupTotalSmvs)} mål-SMVs</small>
      </article>

      <div class="value-stack">
        <h4>Hvad det betyder for kunderne i de 5 grupper</h4>
        <div class="value-stack-row">
          <div class="value-stack-card">
            <span>Kundernes upside</span>
            <strong>${dkCurrency.format(groupCustomerValue)}</strong>
            <small>${dkNumber.format(VALUE_PER_SMV)} kr / SMV</small>
          </div>
          <div class="value-stack-arrow">−</div>
          <div class="value-stack-card value-stack-revenue">
            <span>Kundernes investering<br>(vores revenue)</span>
            <strong>${dkCurrency.format(tamTotal)}</strong>
            <small>1.626 kr / SMV</small>
          </div>
          <div class="value-stack-arrow">=</div>
          <div class="value-stack-card value-stack-net">
            <span>Nettoværdi til kunde</span>
            <strong>${dkCurrency.format(groupCustomerNet)}</strong>
            <small>ROI ${groupRoi.toFixed(1)}x</small>
          </div>
        </div>
      </div>

      <article class="headroom-new-segment-callout">
        <span>Heraf NYT segment (Årsrapport + Assistance)</span>
        <strong>${dkCurrency.format(tamNewSegments)}</strong>
        <small>${newSegmentShare.toFixed(0)}% af vores revenue · låses op med H2 2026 launch</small>
      </article>
      <table class="board-table headroom-table">
        <thead><tr>
          <th>Gruppe</th>
          <th class="numeric">Konv.</th>
          <th class="numeric">Mål-SMVs</th>
          <th class="numeric">Aktive nu</th>
          <th class="numeric">Gap</th>
          <th class="numeric">Software</th>
          <th class="numeric">Årsrapport</th>
          <th class="numeric">Assistance</th>
          <th class="numeric">Total TAM</th>
        </tr></thead>
        <tbody>
          ${groupData.map((g) => `<tr>
            <td><strong>${g.label}</strong></td>
            <td class="numeric">${(g.impl * 100).toFixed(0)}%</td>
            <td class="numeric">${dkNumber.format(g.target)}</td>
            <td class="numeric">${dkNumber.format(g.current)}</td>
            <td class="numeric">${dkNumber.format(g.gap)}</td>
            <td class="numeric">${dkCurrency.format(g.arrSoftware)}</td>
            <td class="numeric headroom-new">${dkCurrency.format(g.arrReports)}</td>
            <td class="numeric headroom-new">${dkCurrency.format(g.arrAssistance)}</td>
            <td class="numeric"><strong>${dkCurrency.format(g.arrTotal)}</strong></td>
          </tr>`).join("")}
          <tr class="headroom-total-row">
            <td colspan="5"><strong>Total (med overlap RGD/eksisterende)</strong></td>
            <td class="numeric"><strong>${dkCurrency.format(tamSoftware)}</strong></td>
            <td class="numeric headroom-new"><strong>${dkCurrency.format(tamReports)}</strong></td>
            <td class="numeric headroom-new"><strong>${dkCurrency.format(tamAssistance)}</strong></td>
            <td class="numeric"><strong>${dkCurrency.format(tamTotal)}</strong></td>
          </tr>
        </tbody>
      </table>
      <p class="headroom-note">Tallene er bruttoværdier ved listepriser (1.226 + 200 + 200 = 1.626 kr/SMV). Realistisk landing 30-50% af TAM over 3,5 år ved nuværende blended pris.</p>
    </section>`;

  // Narrative blocks
  const narrative = `
    <div class="board-narrative">
      <article class="board-story board-was">
        <h4>Hvor vi var (2024)</h4>
        <p><strong>373k ARR · 12 AOs · post-2023-dip</strong></p>
        <p>Ny strategi sat. Skov-modellen i startfase.</p>
      </article>
      <article class="board-story board-now">
        <h4>Hvor vi er (juni 2026)</h4>
        <p><strong>${dkCurrency.format(payingArr)} ARR · +${arrSinceLow.toFixed(0)}% siden lavpunkt</strong></p>
        <p>${payingAos} AOs. NRR 166%. GT-modellen bevist. H1 har slået hele 2025 på engagement-tal. Annual Reports H2 launch.</p>
      </article>
      <article class="board-story board-future">
        <h4>Hvor vi skal hen (2029)</h4>
        <p><strong>5-7M ARR · ~7.000 SMVs · ~36 AOs</strong></p>
        <p>6-8x dagens ARR. CAGR 60-65% (top-decile). Annual Reports + Assistance + Beierholm = nye løftestænger.</p>
      </article>
    </div>`;

  // (H2-prioriteter er nu integreret i hver scenarie-kort under "trajectory-block-priorities")

  // SEKTION 1: Bestyrelsesoverblik (fortid + nutid)
  sectionsEl.innerHTML = `
    ${headlineKpis}
    ${efficiencyKpis}
    ${supportingKpis}
    ${engagementKpis}
    ${boardReportSection1()}
  `;

  // SEKTION 2: Fremtiden (trajectory + TAM + headroom + narrative)
  const futureEl = document.getElementById("futureSections");
  if (futureEl) {
    futureEl.innerHTML = `
      ${renderTrajectorySection()}
      ${totalTamBlock}
      ${headroom}
      ${narrative}
    `;
  }

  // Helper-funktion: udfyldt bestyrelsesrapport — fortid/nutid med uddybende indsigter
  function boardReportSection1() {
    return `
      <section class="board-block board-report">
        <header class="board-report-header">
          <h3>Bestyrelsesrapport · Juni 2026</h3>
          <p class="board-report-subtitle">Dynamisk genereret fra dashboardets data. Tallene opdaterer sig automatisk når kilderne ændres.</p>
        </header>

        <div class="board-report-body">

          <article class="board-report-section">
            <h4>Status — det korte overblik</h4>
            <p>
              Crediwire er på <strong>${dkCurrency.format(payingArr)} ARR</strong> midt i 2026 — en stigning på
              <strong class="hi">+${arrSinceLow.toFixed(0)}%</strong> siden 2024-lavpunktet på 373k.
              To-årig sammensat vækst er <strong>+52% pr. år</strong>, hvilket placerer os i top-decile blandt B2B SaaS-virksomheder på vores stage.
              Det vigtigste er ikke det absolutte ARR-tal — det er at <em>kvaliteten af væksten</em> er world-class på de retention- og engagement-metrics,
              der typisk afgør om en virksomhed står lige før eller midt i et hockey-stick-forløb.
            </p>
          </article>

          <article class="board-report-section">
            <h4>Resultater H1 2026 — i tal</h4>
            <ul>
              <li><strong>NRR 165%</strong> — verdensklasse, Snowflake-niveau (typisk 130-180%)</li>
              <li><strong>GRR 94%</strong> — top-quartile retention (90%+ regnes som ekstraordinært)</li>
              <li><strong>Engagement +${yoyAnalyses.toFixed(0)}% YoY</strong> — ${dkNumber.format(cumulativeAnalyses)} akkumulerede dataanalyser (<span class="hi">+${cumulativeGrowthSince24}%</span> siden 2024)</li>
              <li><strong>${dkNumber.format(newSmvsYtd)} nye SMVs onboardet YTD</strong> (${smvsPerWeek}/uge) — onboarding-kapacitet er ikke flaskehals</li>
              <li><strong>${payingAos} betalende AOs</strong> (${healthyAos} healthy · ${churnRiskAos} churn risk)</li>
            </ul>
          </article>

          <article class="board-report-section">
            <h4>Hvad NRR 165% reelt betyder for bestyrelsen</h4>
            <p>
              <strong>Net Revenue Retention</strong> måler hvor meget vores eksisterende kundebase betaler i år sammenlignet med sidste år —
              efter at have regnet expand, contraction og churn ind. Et tal på 165% betyder:
              <em>for hver krone vi havde fra eksisterende kunder i 2025, har vi 1,65 kr fra de samme kunder i 2026.</em>
            </p>
            <p>
              Det er en af de vigtigste enkeltsignaler en SaaS-investor leder efter. De fleste SaaS-virksomheder rammer 110-120%.
              Top-tier virksomheder rammer 130%+. Snowflake i deres bedste år lå på 158-178%. <strong>Vi er i den absolutte top.</strong>
            </p>
            <p>
              Forretningsmæssigt betyder det: <em>selv hvis vi aldrig vandt en ny kunde igen, ville vores ARR vokse 65% år-over-år alene fra eksisterende kunder.</em>
              Det er beviset på at vores produkt skaber stigende værdi for kunderne over tid — ikke et engangssalg, men en motor der bygger på sig selv.
            </p>
          </article>

          <article class="board-report-section">
            <h4>Hvad GRR 94% betyder — og hvorfor det er det vigtigste retention-tal</h4>
            <p>
              <strong>Gross Revenue Retention</strong> er det "rene" retention-tal: hvor stor en del af vores ARR vi beholder fra eksisterende kunder,
              <em>uden</em> at lade expand-vækst maskere churn. En NRR på 165% kan skjule store tab hvis nogle kunder vokser massivt mens andre forsvinder.
              GRR siger sandheden om bunden.
            </p>
            <p>
              Top B2B SaaS-virksomheder ligger på 90%+. Vi er på 94%. <strong>Vi mister stort set ingen ARR.</strong>
              Det er fundamentet under NRR-tallet — det viser at vores expand ikke er hektisk vækst hos få der maskerer fald hos mange,
              men ægte sundhed på tværs af basen.
            </p>
            <p>
              Strategisk fortæller GRR 94% en historie om <em>switching cost</em>: når en revisor først har Crediwire kørende som
              dataanalyse- og erklæringsmotor, er det dyrt at skifte væk. Det er det vi kalder vores implementeringsmoat.
            </p>
          </article>

          <article class="board-report-section">
            <h4>Engagement +91% — det stærkeste leading indicator vi har</h4>
            <p>
              Dataanalyser kørt i platformen er <strong>fordoblet på ét år</strong> (jan-maj 2026 vs samme periode 2025): fra ${dkNumber.format(ytdAnalyses25)} til ${dkNumber.format(ytdAnalyses26)}.
              Aktive brugere er fordoblet. Unikke brugervirksomheder er nær-fordoblet.
              Hele 2025 brugte vi 3.123 analyser; vi har kørt ${dkNumber.format(analyses2026H1)} alene i H1 2026.
            </p>
            <p>
              Det her er det signal der typisk kommer <em>før</em> ARR-væksten. Folk bruger produktet mere før de betaler mere.
              Det forklarer hvorfor tilkøbs-historikken peger op (GT, Powered-By, Skov), og det forklarer hvorfor vi tør sigte efter <span class="hi">2,3M i underskrevne kontrakter</span> i 2026 (alignet med januar-budgettets accountants-omsætning):
              fordi engagementet siger at kunderne får mere værdi af systemet end de gjorde for et år siden.
            </p>
          </article>

          <article class="board-report-section board-report-highlight">
            <h4>Den vigtigste enkelt-pointe: alt det her er sket med 1 person</h4>
            <p>
              Crediwire's kommercielle afdeling er gået fra 14 ansatte i 2022 til 2 i 2025 til <strong>solo siden september 2025</strong> — det er Mads alene.
              Han driver salg, customer success, produktudvikling-input og hele relationship selling-strategien.
              I samme periode er ARR steget fra 373k til ${dkCurrency.format(payingArr)}, NRR til 165%, og brugen er fordoblet.
            </p>
            <p>
              <strong>ARR pr. kommerciel FTE er ${dkCurrency.format(arrPerFteNow)} — en ${fteProductivityMultiplier.toFixed(0)}x stigning siden 2022.</strong>
              Det er ikke et tal man ofte ser i en SaaS-pitch. Det signalerer at vores unit economics er ekstrem stærke,
              og at vi har <em>operationel leverage</em> som vi endnu ikke har høstet: en enkelt Mads-type-ansættelse mere vil ikke
              "fordoble produktiviteten" — den vil <em>parallelisere</em> en proces (central-system-konvertering) der i dag tager én person ad gangen.
            </p>
            <p>
              For bestyrelsen er pointen: dette er ikke en virksomhed der behøver kapital til at vokse — det er en virksomhed der behøver
              <em>specifik talent</em> for at parallelisere. Burn rate er faldet markant i samme periode hvor ARR og retention er vokset.
              Vi er kapital-effektive, ikke kapital-tørstige.
            </p>
          </article>

          <article class="board-report-section">
            <h4>Hvad vi har bygget — implementeringsmoat</h4>
            <p>
              Vores produkt er ikke "et regnskabsprogram" eller "en analyse-værktøj". Det er <em>finansiel infrastruktur</em> —
              det grundlag som revisorerne bygger deres arbejde ovenpå. Når en revisor først har Crediwire kørende som
              dataanalyse- og erklæringsmotor for sin kundebase, skiftes den ikke ud i morgen. Det handler ikke kun om produktelske —
              det handler om at infrastrukturen er bagt ind i deres processer, deres dokumentation og deres kvalitetssikring.
            </p>
            <p>
              Det her forklarer på samme tid hvorfor <strong>GRR er 94%</strong> (kunder forlader os ikke) og hvorfor
              <strong>expand er dybt</strong> når det først sker. Tre eksempler fra 2025 → 2026:
            </p>
            <ul>
              <li>Grant Thornton: <strong>170k → 381k</strong> (+124%) — modnet over 18 måneder</li>
              <li>Powered-By: <strong>20k → 109k</strong> (<span class="hi">+445%</span>) — fra 70 til 110+ slots på et år</li>
              <li>Skov Revision: <strong>26k → 62k</strong> (+140%) — fuldt expandet på revision og udvidet gennemgang</li>
            </ul>
            <p>
              Vendepunktet kom med <strong>relationship selling</strong>-skiftet i 2023/24 — vi gik fra at sælge funktioner til at sælge sammen med
              kunderne. Det er den faktiske grund til at 2024 var bunden og 2025 var året vi fandt formen igen. Det er ikke marketing —
              det er en strategisk forretningsmodel-ændring der har leveret målbart.
            </p>
          </article>

          <article class="board-report-section">
            <h4>Vores ene strukturelle risiko — GT-koncentration</h4>
            <p>
              Grant Thornton bidrager <strong>${gtConcentration.toFixed(0)}% af vores aktuelle ARR</strong>. Det er enkelt-vores største eksponering.
              I et VC-perspektiv regnes alt over 25-30% kundekoncentration som strukturel risiko — fordi tab af én relation kan kortvarigt halvere business'en.
            </p>
            <p>
              Modvægten: GT-relationen er aktiv, voksende og dyb. Det er ikke en kunde der "hænger i en tråd" — det er den kunde der har bevist
              vores expand-model virker. GT går fra 370 slots (jan 2026) til 740 i juni, og målet for H2 2026 er <strong>2.000 slots</strong>.
              Opside: hvis GT signer for <strong>25% af deres 11.366 erklæringer</strong>, lander de på <strong>2.842 slots</strong>
              (≈ +470k ekstra ARR oveni 2.000-scenariet).
            </p>
            <p>
              For bestyrelsen er det vigtigt at vide: <em>denne koncentration reduceres ikke ved at "diversificere bort fra GT"</em> —
              det reduceres ved at gøre de andre AOs lige så store. Det er det 2,3M-målet i 2026 handler om: at brede basen ud
              mens GT fortsætter sin egen expand.
            </p>
          </article>

          <article class="board-report-section">
            <h4>H2 2026 — vores aktive fokus</h4>
            <p><strong>Mine kerneaktiviteter:</strong></p>
            <ul>
              <li><strong>Annual Reports launch</strong> som lead-magnet til hele kundebasen — låser nyt segment op (4,2M TAM i fokus-grupper)</li>
              <li><strong>GT slot-expand</strong> mod 2.000 SMVs (opside: 2.842 slots = 25% af deres 11.366 erklæringer) — beslutning forventet sep-okt</li>
              <li><strong>Webinar-serie med Beierholm</strong> på data + rapportering — pilot underskrevet senest dec 2026</li>
              <li><strong>Digitaliseringsdagen revisionsspor</strong> med GT og Skov som co-presenters</li>
              <li><strong>Kontinuerlig udvikling af årsrapporter</strong> sammen med revisorerne som relationship-driver</li>
              <li><strong>Sceneoptræden med Powered-By</strong> om AI/HI-samarbejde — synlighed mod hele revisormarkedet</li>
            </ul>
            <p><strong>Det kunderne skal gøre — vi kan ikke lukke aftalerne for dem:</strong></p>
            <ul>
              <li>GT: Lukker slot-expand mod 2.000 SMVs (eller 2.842 = 25% af deres erklæringer som opside)</li>
              <li>Skov: Lancerer årsrapporter til deres SMV-base — bliver vores case study</li>
              <li>Beierholm: Starter implementering efter webinar-serien</li>
              <li>3-5 top prospects: Tager mødet, prøver produktet, signerer kontrakter</li>
              <li>Eksisterende kundebase: Opt-in til årsrapporter — 10 af 14 healthy AOs</li>
            </ul>
            <p class="board-report-note">
              Salgsbeslutninger lander typisk 75% i Q4 + Q1 — det er budget-cyklus-perioden. H2-momentumet og Q1 2027 er afgørende for hele trajectory'en.
              <strong>Detaljerede scenarier, komponenter, actions og prioriteter findes i sektion 02 nedenfor</strong> — vælg Conservative, Base eller Stretch.
            </p>
          </article>

          <article class="board-report-section board-report-risks">
            <h4>Den ærlige risiko</h4>
            <p>Vi har en stærk model — men 2,3M-målet hænger på fire variabler, hvoraf to er uden for vores fulde kontrol:</p>
            <ul>
              <li><strong>Solo-kapacitet:</strong> Én udskudt stor aftale forsinker andre. Vi har bevist at solo virker (866k ARR pr. FTE),
              men én Mads-type-ansættelse mere ville parallelisere central-system-konverteringen og fjerne flaskehalsen.</li>
              <li><strong>GT-koncentration ${gtConcentration.toFixed(0)}%:</strong> Strukturel risiko. Modvirkes ved at brede basen, ikke ved at flytte fokus fra GT.</li>
              <li><strong>Annual Reports launch er kritisk:</strong> Hele 2027-2028 vækst-trajectory hænger på adoption.
              Hvis launch forsinkes eller får dårlig modtagelse, falder vi mod Conservative-scenariet.</li>
              <li><strong>Prismodel:</strong> 200 kr pr. årsrapport og 200 kr pr. assistance er <em>arbejdspriser</em>, ikke endelige.
              Potentielt 30-50% upside hvis vi rammer rigtigt — men også risiko hvis vi sætter forkert. Vi arbejder med det over 2026.</li>
            </ul>
          </article>

        </div>
      </section>
    `;
  }

  // Wire up the slider event (after innerHTML re-render)
  const slider = document.getElementById("totalTamSlider");
  if (slider) {
    slider.addEventListener("input", (event) => {
      const raw = Number(event.target.value) || 100;
      state.totalTamPct = Math.max(1, Math.min(100, raw));
      renderBoardOverview();
    });
  }

  // Wire up trajectory toggle buttons — each card toggles independently
  document.querySelectorAll("[data-trajectory-toggle]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const key = btn.getAttribute("data-trajectory-toggle");
      if (!key || !state.trajectoryOpen) return;
      state.trajectoryOpen[key] = !state.trajectoryOpen[key];
      saveTrajectoryOpen();
      renderBoardOverview();
    });
  });
}

// Removed: segment-based group settings, conversion logic, and renderForecastV2.
// Budget is now built per-AO via the pencil modal. Old helpers below were unused
// after the redesign and are kept commented out — only stubs that other code may
// still reference are preserved.
function __removedSegmentLogic() {
  return;
}

function aoCurrentArrTotal() {
  const yearwheel = state.data.arrYearwheel || [];
  return yearwheel.reduce((sum, r) => sum + (Number(r.arr_total) || 0), 0);
}

function aoNameByCvr(cvrKey) {
  const yearwheel = state.data.arrYearwheel || [];
  const inWheel = yearwheel.find((r) => r.accounting_office_cvr === cvrKey);
  if (inWheel) return inWheel.accounting_office_name;
  const master = state.data.aoMaster || [];
  const inMaster = master.find((r) => cvr(r) === cvrKey);
  if (inMaster) return inMaster.accounting_office_name;
  return cvrKey;
}

function aoCurrentArrByCvr(cvrKey) {
  const yearwheel = state.data.arrYearwheel || [];
  const found = yearwheel.find((r) => r.accounting_office_cvr === cvrKey);
  return found ? Number(found.arr_total) || 0 : 0;
}
// Legacy forecast functions removed — Forecast V2 (segment-based) replaces them.

// Manuelle overrides: AOs der churnede TIDLIGERE end den periode vi
// sammenligner (deres 2025-tal var revenue _før_ de churnede – de var ikke
// betalende ved indgangen til 2026 og skal derfor ikke tælle som 2026-churn).
const CHURNED_BEFORE_2026 = new Set([
  "ri statsautoriseret revisionspartnerselskab",
]);

function classifyArrMovement(prev, curr, name) {
  if (name && CHURNED_BEFORE_2026.has(String(name).toLowerCase().trim())) return "prior_churn";
  if (prev < 0 || curr < 0) return "anomaly";
  if (prev === 0 && curr > 0) return "new";
  if (prev > 0 && curr === 0) return "churn";
  if (prev > 0 && curr > prev) return "expand";
  if (prev > 0 && curr < prev && curr > 0) return "contraction";
  if (prev > 0 && Math.abs(curr - prev) < 0.01) return "recurring";
  return "none";
}

function renderArrMovementModule() {
  const detail = state.data.arrYearlyDetail || [];
  const sumEl = document.getElementById("arrMovementSummary");
  const cardsEl = document.getElementById("arrMovementCards");
  const tbody = document.getElementById("arrMovementTableBody");
  if (!sumEl || !cardsEl || !tbody || !detail.length) return;

  // Pivot mangler enkelte AOs som kun er i Årshjul (fx Admin4you).
  // Tilføj dem som "new biz" for 2026, så ending matcher Årshjul total.
  const yearwheel = state.data.arrYearwheel || [];
  const pivotNames = new Set(detail.map((r) => r.accounting_office_name.toLowerCase()));
  const extras = yearwheel
    .filter((r) => (r.status === "A" || r.status === "C") && !pivotNames.has((r.accounting_office_name || "").toLowerCase()))
    .map((r) => ({ accounting_office_name: r.accounting_office_name, arr_2025: "0", arr_2026: r.arr_total }));
  const classified = [...detail, ...extras].map((r) => {
    const a25 = Number(r.arr_2025) || 0;
    const a26 = Number(r.arr_2026) || 0;
    return { name: r.accounting_office_name, a25, a26, delta: a26 - a25, category: classifyArrMovement(a25, a26, r.accounting_office_name) };
  });

  const sumBy = (cat, fn) => classified.filter((c) => c.category === cat).reduce((s, c) => s + fn(c), 0);
  const countBy = (cat) => classified.filter((c) => c.category === cat).length;
  const newArr = sumBy("new", (c) => c.a26);
  const expandDelta = sumBy("expand", (c) => c.delta);
  const recurringArr = sumBy("recurring", (c) => c.a25);
  const contractionDelta = -sumBy("contraction", (c) => c.delta);
  const churnArr = sumBy("churn", (c) => c.a25);
  const priorChurnArr = sumBy("prior_churn", (c) => c.a25);
  // start25 = baseline ARR ved indgangen til 2026: ekskluder kunder der
  // allerede var churnet inden 2026 startede (de var 0 ved nytår).
  const start25 = classified.reduce((s, c) => s + Math.max(0, c.a25), 0) - priorChurnArr;
  const end26 = classified.reduce((s, c) => s + Math.max(0, c.a26), 0);
  const nrr = (start25 - churnArr - contractionDelta + expandDelta) / (start25 || 1);
  const grr = (start25 - churnArr - contractionDelta) / (start25 || 1);

  sumEl.innerHTML = `
    <div class="arr-history-stat">
      <span>NRR</span>
      <strong>${(nrr * 100).toFixed(0)}%</strong>
      <small>Net Revenue Retention</small>
    </div>
    <div class="arr-history-stat">
      <span>GRR</span>
      <strong>${(grr * 100).toFixed(0)}%</strong>
      <small>Gross Revenue Retention</small>
    </div>
    <div class="arr-history-stat">
      <span>2025 → 2026</span>
      <strong>${dkCurrency.format(end26)}</strong>
      <small>Fra ${dkCurrency.format(start25)}</small>
    </div>
  `;

  const card = (label, value, count, klass, helper) => `
    <article class="arr-movement-card ${klass}">
      <span>${label}</span>
      <strong>${value >= 0 ? "+" : ""}${dkCurrency.format(value)}</strong>
      <small>${count} kunde${count === 1 ? "" : "r"} · ${helper}</small>
    </article>`;

  cardsEl.innerHTML = [
    card("New business", newArr, countBy("new"), "new", "Nye logoer i 2026"),
    card("Expand", expandDelta, countBy("expand"), "expand", "Vækst hos eksisterende"),
    card("Recurring", recurringArr, countBy("recurring"), "recurring", "Uændret hos eksisterende"),
    card("Contraction", -contractionDelta, countBy("contraction"), "contraction", "Mindre hos eksisterende"),
    card("Churn", -churnArr, countBy("churn"), "churn", "Tabte kunder"),
  ].join("");

  const catLabel = {
    new: "New business",
    expand: "Expand",
    recurring: "Recurring",
    contraction: "Contraction",
    churn: "Churn",
    prior_churn: "Churnet før 2026",
    anomaly: "Anomaly",
    none: "—",
  };
  const catClass = {
    new: "arr-status-active",
    expand: "arr-status-active",
    recurring: "arr-status arr-status-neutral",
    contraction: "arr-status-risk",
    churn: "arr-status-churned",
    prior_churn: "arr-status-neutral",
    anomaly: "arr-status-risk",
    none: "",
  };
  const order = ["new", "expand", "recurring", "contraction", "churn", "prior_churn", "anomaly", "none"];
  tbody.innerHTML = classified
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || b.delta - a.delta)
    .map((c) => `<tr>
      <td>${c.name}</td>
      <td class="numeric">${dkCurrency.format(c.a25)}</td>
      <td class="numeric">${dkCurrency.format(c.a26)}</td>
      <td class="numeric ${c.delta > 0 ? "pos" : c.delta < 0 ? "neg" : ""}">${c.delta >= 0 ? "+" : ""}${dkCurrency.format(c.delta)}</td>
      <td><span class="arr-status ${catClass[c.category] || ""}">${catLabel[c.category]}</span></td>
    </tr>`)
    .join("");
}

function renderArrHistoryModule() {
  const rows = state.data.arrYearlyTotals || [];
  const chartEl = document.getElementById("arrHistoryChart");
  const sumEl = document.getElementById("arrHistorySummary");
  if (!chartEl || !sumEl || !rows.length) return;
  // Beregn 2026-total fra Årshjul (A+C+O = total bookings) i stedet for pivot
  // for at matche resten af dashboardet.
  const yearwheel = state.data.arrYearwheel || [];
  const yearwheel2026 = yearwheel.reduce((sum, r) => sum + (Number(r.arr_total) || 0), 0);
  const data = rows
    .map((r) => {
      const year = Number(r.year);
      let arr = Number(r.arr_total) || 0;
      if (year === 2026 && yearwheel2026 > 0) arr = yearwheel2026;
      return { year, arr, yoy: r.yoy_growth !== "" ? Number(r.yoy_growth) : null };
    })
    .filter((d) => Number.isFinite(d.year) && d.year >= 2022)
    .sort((a, b) => a.year - b.year);
  // Genberegn YoY så det matcher det opdaterede 2026-tal
  for (let i = 1; i < data.length; i++) {
    if (data[i - 1].arr > 0) data[i].yoy = (data[i].arr - data[i - 1].arr) / data[i - 1].arr;
  }
  const maxArr = Math.max(...data.map((d) => d.arr), 1);
  const latest = data[data.length - 1];

  // Find lavpunkt (mindste ARR — som regel 2024)
  const lowPoint = data.reduce((min, d) => (d.arr < min.arr ? d : min), data[0]);
  const recoveryGrowth = lowPoint.arr > 0 ? (latest.arr - lowPoint.arr) / lowPoint.arr : null;
  const recoveryYears = latest.year - lowPoint.year;
  const recoveryCagr = recoveryYears > 0 && lowPoint.arr > 0
    ? Math.pow(latest.arr / lowPoint.arr, 1 / recoveryYears) - 1
    : null;

  sumEl.innerHTML = `
    <div class="arr-history-stat">
      <span>Recovery fra ${lowPoint.year}-lavpunkt</span>
      <strong>${recoveryGrowth !== null ? (recoveryGrowth >= 0 ? "+" : "") + (recoveryGrowth * 100).toFixed(0) + "%" : "—"}</strong>
      <small>${dkCurrency.format(lowPoint.arr)} → ${dkCurrency.format(latest.arr)}</small>
    </div>
    <div class="arr-history-stat">
      <span>CAGR siden lavpunkt</span>
      <strong>${recoveryCagr !== null ? (recoveryCagr >= 0 ? "+" : "") + (recoveryCagr * 100).toFixed(1).replace(".", ",") + "%" : "—"}</strong>
      <small>Top-decile (40-60%/år)</small>
    </div>
    <div class="arr-history-stat">
      <span>${latest.year} ÅTD</span>
      <strong>${dkCurrency.format(latest.arr)}</strong>
      <small>Faktisk ARR i år</small>
    </div>
  `;

  chartEl.innerHTML = data
    .map((d) => {
      const heightPct = (d.arr / maxArr) * 100;
      const yoyLabel =
        d.yoy === null
          ? ""
          : `<span class="bar-yoy ${d.yoy >= 0 ? "pos" : "neg"}">${d.yoy >= 0 ? "+" : ""}${(d.yoy * 100).toFixed(0)}%</span>`;
      return `<div class="arr-history-bar">
        <div class="bar-value">${dkCurrency.format(d.arr)}</div>
        <div class="bar-track">
          <div class="bar-fill" style="height: ${heightPct.toFixed(1)}%"></div>
        </div>
        <div class="bar-meta">
          <span class="bar-year">${d.year}</span>
          ${yoyLabel}
        </div>
      </div>`;
    })
    .join("");
}

function arrPeriodKey() {
  return state.arrPeriod || "full";
}

function arrValueForRow(row, period) {
  const v = (key) => Number(row[key]) || 0;
  if (period === "h1") return v("arr_h1");
  if (period === "h2") return v("arr_h2");
  return v("arr_total");
}

function renderArrModule() {
  const rows = (state.data.arrYearwheel || []).slice();
  const kpiEl = document.getElementById("arrKpis");
  const bodyEl = document.getElementById("arrTableBody");
  if (!kpiEl || !bodyEl) return;
  const period = arrPeriodKey();
  const active = rows.filter((r) => r.status === "A");
  const atRisk = rows.filter((r) => r.status === "C");
  const churned = rows.filter((r) => r.status === "O");
  const all = [...active, ...atRisk, ...churned];
  const totalSelected = all.reduce((sum, r) => sum + arrValueForRow(r, period), 0);
  const activeArr = active.reduce((sum, r) => sum + arrValueForRow(r, period), 0);
  const atRiskArr = atRisk.reduce((sum, r) => sum + arrValueForRow(r, period), 0);
  const churnedArr = churned.reduce((sum, r) => sum + arrValueForRow(r, period), 0);
  const payingArr = activeArr + atRiskArr;
  const periodLabel = period === "h1" ? "H1" : period === "h2" ? "H2" : "Hele året";

  kpiEl.innerHTML = `
    <article class="arr-kpi arr-kpi-main">
      <details class="arr-breakdown">
        <summary>
          <span>ARR · ${periodLabel}</span>
          <strong>${dkCurrency.format(totalSelected)}</strong>
          <small>${all.length} revisionshuse · Klik for fordeling</small>
        </summary>
        <div class="arr-breakdown-grid">
          <div class="arr-breakdown-row">
            <span class="arr-breakdown-label">Aktive (healthy)</span>
            <strong class="arr-breakdown-value">${dkCurrency.format(activeArr)}</strong>
            <small class="arr-breakdown-meta">${active.length} kunder · status A</small>
          </div>
          <div class="arr-breakdown-row">
            <span class="arr-breakdown-label">Alle betalende (A + C)</span>
            <strong class="arr-breakdown-value">${dkCurrency.format(payingArr)}</strong>
            <small class="arr-breakdown-meta">${active.length + atRisk.length} kunder · inkl. churn risk</small>
          </div>
          <div class="arr-breakdown-row arr-breakdown-risk">
            <span class="arr-breakdown-label">heraf Churn risk</span>
            <strong class="arr-breakdown-value">${dkCurrency.format(atRiskArr)}</strong>
            <small class="arr-breakdown-meta">${atRisk.length} kunder · status C</small>
          </div>
          <div class="arr-breakdown-row arr-breakdown-churned">
            <span class="arr-breakdown-label">Opsagt i år</span>
            <strong class="arr-breakdown-value">${dkCurrency.format(churnedArr)}</strong>
            <small class="arr-breakdown-meta">${churned.length} kunder · status O</small>
          </div>
        </div>
      </details>
    </article>
  `;

  const renderRow = (r, statusLabel, statusClass, extraClass = "") => {
    const arr = arrValueForRow(r, period);
    const share = totalSelected > 0 && (r.status === "A" || r.status === "C") ? arr / totalSelected : null;
    return `<tr${extraClass ? ` class="${extraClass}"` : ""}>
      <td>${r.accounting_office_name || ""}</td>
      <td class="numeric">${r.smes_invoiced || "—"}</td>
      <td class="numeric">${dkCurrency.format(arr)}</td>
      <td class="numeric">${share !== null ? (share * 100).toFixed(1).replace(".", ",") + " %" : "—"}</td>
      <td><span class="arr-status ${statusClass}">${statusLabel}</span></td>
    </tr>`;
  };
  const sortByArr = (a, b) => arrValueForRow(b, period) - arrValueForRow(a, period);
  const activeRows = active.slice().sort(sortByArr).map((r) => renderRow(r, "Aktiv", "arr-status-active"));
  const riskRows = atRisk.slice().sort(sortByArr).map((r) => renderRow(r, "Churn risk", "arr-status-risk", "row-risk"));
  const churnRows = churned.slice().sort(sortByArr).map((r) => renderRow(r, "Opsagt", "arr-status-churned", "row-muted"));
  bodyEl.innerHTML = [...activeRows, ...riskRows, ...churnRows].join("");
}

function selectedOfficeLabel() {
  if (!state.selectedCvr) return "Alle revisionshuse";
  const group = selectedGroupFilter();
  if (group) return group.label;
  return state.offices.find((office) => office.cvr === state.selectedCvr)?.name || "Valgt revisionshus";
}

function filteredOffices(query) {
  const q = query.trim().toLowerCase();
  if (!q) return state.offices;
  const rank = (office) => {
    const n = office.name.toLowerCase();
    if (n === q) return 0;
    if (n.startsWith(q)) return 1;
    if (n.split(/[^a-zæøå0-9]+/).some((w) => w.startsWith(q))) return 2;
    return 3;
  };
  return state.offices
    .filter((office) => office.searchText.includes(q))
    .sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      return ra === rb ? a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "da") : ra - rb;
    });
}

function closeOfficeSearch() {
  const results = document.getElementById("aoSearchResults");
  const input = document.getElementById("aoSearch");
  results.classList.remove("is-open");
  input.setAttribute("aria-expanded", "false");
}

function renderOfficeSearchResults(query = "") {
  const results = document.getElementById("aoSearchResults");
  const matches = filteredOffices(query).slice(0, 80);
  const hasQuery = query.trim().length > 0;
  const allSelected = !state.selectedCvr;
  const allButton = hasQuery ? "" : `<button class="search-result${allSelected ? " is-selected" : ""}" type="button" data-cvr="" role="option">
    <strong>Alle revisionshuse</strong>
    <small>Vis samlet dashboard</small>
  </button>`;
  const groupButtons = hasQuery ? "" : Object.entries(GROUP_FILTERS)
    .map(([filterValue, group]) => `<button class="search-result${state.selectedCvr === filterValue ? " is-selected" : ""}" type="button" data-cvr="${filterValue}" role="option">
      <strong>${escapeHtml(group.label)}</strong>
      <small>${escapeHtml(groupDescription(group))}</small>
    </button>`)
    .join("");
  const officeButtons = matches
    .map((office) => `<button class="search-result${office.cvr === state.selectedCvr ? " is-selected" : ""}" type="button" data-cvr="${escapeHtml(office.cvr)}" role="option">
      <strong>${escapeHtml(office.name)}</strong>
      <small>${office.cvr ? `CVR ${escapeHtml(office.cvr)}` : "CVR ikke angivet"}</small>
    </button>`)
    .join("");
  const emptyMessage = query.trim() && !matches.length ? `<button class="search-result" type="button" disabled>Ingen revisionshuse matcher søgningen</button>` : "";

  results.innerHTML = allButton + groupButtons + officeButtons + emptyMessage;
  results.classList.add("is-open");
  document.getElementById("aoSearch").setAttribute("aria-expanded", "true");
}

function selectOffice(cvrValue) {
  state.selectedCvr = cvrValue;
  document.getElementById("aoFilter").value = cvrValue;
  document.getElementById("aoSearch").value = selectedOfficeLabel();
  closeOfficeSearch();
  renderDashboard();
}

function populateFilter() {
  const input = document.getElementById("aoSearch");
  const results = document.getElementById("aoSearchResults");
  const priority = ["grant thornton", "redmark", "martinsen", "buus jensen"];
  const seen = new Set();
  state.offices = state.data.aoMaster
    .slice()
    .sort((a, b) => {
      const aName = officeName(a).toLowerCase();
      const bName = officeName(b).toLowerCase();
      const aPriority = priority.findIndex((name) => aName.includes(name));
      const bPriority = priority.findIndex((name) => bName.includes(name));
      const ar = aPriority === -1 ? 99 : aPriority;
      const br = bPriority === -1 ? 99 : bPriority;
      return ar === br ? aName.localeCompare(bName, "da") : ar - br;
    })
    .filter((row) => {
      const value = cvr(row);
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    })
    .map((row) => {
      const name = officeName(row);
      const value = cvr(row);
      return {
        cvr: value,
        name,
        searchText: `${name} ${value}`.toLowerCase(),
      };
    });

  input.value = "Alle revisionshuse";
  input.addEventListener("focus", () => {
    input.select();
    renderOfficeSearchResults("");
  });
  input.addEventListener("input", (event) => {
    const query = event.target.value;
    if (!query.trim() && state.selectedCvr) {
      selectOffice("");
      renderOfficeSearchResults("");
      return;
    }
    renderOfficeSearchResults(query);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeOfficeSearch();
    if (event.key === "Enter") {
      event.preventDefault();
      const normalizedInput = input.value.trim().toLowerCase();
      const matchedGroup = Object.entries(GROUP_FILTERS).find(
        ([, group]) => normalizedInput && group.searchText.includes(normalizedInput),
      );
      if (matchedGroup) {
        selectOffice(matchedGroup[0]);
        return;
      }
      const firstMatch = filteredOffices(input.value)[0];
      selectOffice(firstMatch?.cvr || "");
    }
  });
  input.addEventListener("blur", () => {
    window.setTimeout(() => {
      closeOfficeSearch();
      input.value = selectedOfficeLabel();
    }, 150);
  });
  results.addEventListener("mousedown", (event) => event.preventDefault());
  results.addEventListener("click", (event) => {
    const button = event.target.closest(".search-result");
    if (!button || button.disabled) return;
    selectOffice(button.dataset.cvr || "");
  });
}

function restorePrintTitle() {
  if (!printState) return;
  document.title = printState.title;
  printState = null;
}

function exportToPdf() {
  const today = new Date().toISOString().slice(0, 10);
  printState = { title: document.title };
  document.title = `Crediwire Intelligence - ${selectedOfficeLabel()} - ${today}`;
  window.print();
  window.setTimeout(restorePrintTitle, 500);
}

async function init() {
  const entries = await Promise.all(Object.entries(files).map(async ([key, filename]) => [key, await loadCsv(filename)]));
  state.data = Object.fromEntries(entries);

  document.getElementById("hoursInput").addEventListener("input", renderDashboard);
  document.getElementById("rateInput").addEventListener("input", renderDashboard);
  document.getElementById("implementationRateInput").addEventListener("change", renderDashboard);
  document.getElementById("showAnalysedCompaniesInput").addEventListener("change", (event) => {
    document.body.classList.toggle("hide-analysed", !event.target.checked);
  });
  document.getElementById("reportingCustomersInput").addEventListener("input", renderDashboard);
  document.getElementById("reportingHoursInput").addEventListener("input", renderDashboard);
  document.getElementById("annualReportHoursInput").addEventListener("input", renderDashboard);
  document.getElementById("assistanceHoursInput").addEventListener("input", renderDashboard);
  document.getElementById("advisoryHoursInput").addEventListener("input", renderDashboard);
  document.getElementById("qualityFactorInput").addEventListener("change", renderDashboard);
  ["pricePerActiveCompanyInput", "annualReportPriceInput", "assistancePriceInput"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderDashboard);
    document.getElementById(id).addEventListener("change", () => {
      formatPriceInputById(id);
      renderDashboard();
    });
    document.getElementById(id).addEventListener("blur", () => {
      formatPriceInputById(id);
      renderDashboard();
    });
  });
  document.querySelectorAll(".scenario-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.forecastScenario = btn.getAttribute("data-scenario");
      renderDashboard();
    });
  });
  document.getElementById("masterListFilter")?.addEventListener("change", renderMasterList);
  document.getElementById("masterListBody")?.addEventListener("input", (event) => {
    const cell = event.target.closest(".ml-cell");
    if (cell) {
      const c = cell.getAttribute("data-cvr");
      const p = cell.getAttribute("data-period");
      const raw = cell.value.trim();
      setAoForecast(c, p, raw === "" ? null : Number(raw));
      // Update footer/summary only — don't re-render rows (would lose focus)
      const body = document.getElementById("masterListBody");
      const foot = document.getElementById("masterListFoot");
      const summary = document.getElementById("masterListSummary");
      // Light rerender of summary + footer
      renderMasterListTotals();
      return;
    }
    const prob = event.target.closest(".ml-prob");
    if (prob) {
      setAoProbability(prob.getAttribute("data-cvr"), prob.value);
      renderMasterListTotals();
    }
  });
  document.getElementById("budgetPeriodSlider")?.addEventListener("input", renderBudgetPanel);
  document.querySelectorAll("#arrModule .period-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.arrPeriod = btn.getAttribute("data-period");
      document.querySelectorAll("#arrModule .period-btn").forEach((b) => {
        const active = b === btn;
        b.setAttribute("aria-selected", active ? "true" : "false");
        b.classList.toggle("active", active);
      });
      renderArrModule();
    });
  });
  document.querySelector('#arrModule .period-btn[data-period="full"]')?.classList.add("active");

  document.getElementById("advancedModeToggle").addEventListener("change", (event) => {
    state.advancedMode = event.target.checked;
    saveAdvancedMode(state.advancedMode);
    applyAdvancedMode();
  });
  applyAdvancedMode();

  document.getElementById("opportunities").addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-cvr]");
    if (!button) return;
    event.preventDefault();
    openAoOverrideModal(button.getAttribute("data-edit-cvr"));
  });
  document.querySelectorAll("[data-ao-override-close]").forEach((el) => {
    el.addEventListener("click", closeAoOverrideModal);
  });
  document.getElementById("aoOverrideApply").addEventListener("click", applyAoOverrideModal);
  document.getElementById("aoOverrideReset").addEventListener("click", resetAoOverrideModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("ao-override-open")) {
      closeAoOverrideModal();
    }
  });

  document.getElementById("supportingKpis").addEventListener("change", (event) => {
    const target = event.target;
    if (target && target.matches('input[data-declaration-type]')) {
      const key = target.getAttribute("data-declaration-type");
      if (key in state.declarationTypes) {
        state.declarationTypes[key] = target.checked;
        // Prevent collapsing all four — keep at least one selected.
        if (!Object.values(state.declarationTypes).some(Boolean)) {
          state.declarationTypes[key] = true;
          target.checked = true;
        }
        renderDashboard();
      }
    }
  });
  document.querySelectorAll('input[name="trendMode"]').forEach((input) => input.addEventListener("change", renderDashboard));
  document.getElementById("implementationTimelineInput").addEventListener("input", renderDashboard);
  document.getElementById("pdfExportButton").addEventListener("click", exportToPdf);
  window.addEventListener("afterprint", restorePrintTitle);

  populateFilter();
  ["pricePerActiveCompanyInput", "annualReportPriceInput", "assistancePriceInput"].forEach(formatPriceInputById);
  document.body.classList.add("hide-analysed");
  renderDashboard();
}

init().catch((error) => {
  document.body.innerHTML = `<main><section class="panel"><h1>Dashboard kunne ikke starte</h1><p class="note">${error.message}</p></section></main>`;
});
