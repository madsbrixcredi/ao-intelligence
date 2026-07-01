// H2 2026 Budget · 3 scenarier med shuffle
// Bruger samme data som de andre dashboards

// ---- Segment-definitioner (kopi fra app.js) ----
const EXISTING_CLIENT_CVRS = [
  "34209936", "35486178", "27525989", "16645699", "44282380", "36029374",
  "26717671", "10019699", "32676421", "34480370", "34953619", "39463113",
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
const ACCRU_GROUPS = [
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
const GT_CVR = "34209936";

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
const EXCLUDED_KEY = "budgetExcludedCvrs_v1";
const LOCKED_KEY = "budgetLockedCvrs_v1";
function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch { return new Set(); }
}
function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
}
const loadExcluded = () => loadSet(EXCLUDED_KEY);
const saveExcluded = (s) => saveSet(EXCLUDED_KEY, s);
const loadLocked = () => loadSet(LOCKED_KEY);
const saveLocked = (s) => saveSet(LOCKED_KEY, s);

const state = {
  aoMaster: [],
  connections: new Map(),
  pool: [], // de-duplikeret pool af AOs med segment + rate
  activeTab: 0,
  excluded: loadExcluded(),
  locked: loadLocked(),
  // Pr. scenarie: liste af { cvr, smvs } valgte AOs (+ GT som "fixed")
  scenarios: [
    { name: "Med GT fuld", gtNewSmvs: 1260, picked: [] },
    { name: "Med 50% GT", gtNewSmvs: 630, picked: [] },
    { name: "Uden GT", gtNewSmvs: 0, picked: [] },
  ],
};

// Segment-prioritet for shuffle (existing først · derefter top · derefter accru/rgd random sammen)
const SEGMENT_PRIORITY = ["existing", "top", "accru", "rgd"];

// ---- De-dup pool-builder ----
function buildPool() {
  const masterMap = new Map();
  state.aoMaster.forEach((r) => masterMap.set(String(r.accounting_office_cvr).trim(), r));

  // Prioritet: existing > top > accru > rgd (Næste 20 ignoreres for nu pga 1 hus)
  const segmentMap = new Map(); // cvr → { segment, rate, name }
  EXISTING_CLIENT_CVRS.forEach((c) => {
    if (!segmentMap.has(c)) segmentMap.set(c, { segment: "existing", rate: 0.25 });
  });
  TOP_PROSPECT_GROUPS.forEach((g) => g.cvrs.forEach((c) => {
    if (!segmentMap.has(c)) segmentMap.set(c, { segment: "top", rate: 0.05, displayName: g.name });
  }));
  ACCRU_GROUPS.forEach((g) => g.cvrs.forEach((c) => {
    if (!segmentMap.has(c)) segmentMap.set(c, { segment: "accru", rate: 0.02, displayName: g.name });
  }));
  RGD_GROUPS.forEach((g) => g.cvrs.forEach((c) => {
    if (!segmentMap.has(c)) segmentMap.set(c, { segment: "rgd", rate: 0.02, displayName: g.name });
  }));

  const newSmvPrice = num(document.getElementById("newSmvPrice").value);
  const pool = [];
  segmentMap.forEach((seg, cvr) => {
    if (cvr === GT_CVR) return; // GT håndteres separat
    if (state.excluded.has(cvr)) return; // Bruger har ekskluderet
    const row = masterMap.get(cvr);
    if (!row) return;
    const decl = num(row.total_declarations);
    if (decl <= 0) return;
    const active = state.connections.get(cvr) || 0;
    const targetAtRate = Math.round(decl * seg.rate);
    const expandSmvs = Math.max(targetAtRate - active, 0);
    const expandArr = expandSmvs * newSmvPrice;
    if (expandSmvs <= 0 || expandArr <= 0) return;
    pool.push({
      cvr,
      name: row.accounting_office_name || seg.displayName || cvr,
      segment: seg.segment,
      rate: seg.rate,
      declarations: decl,
      active,
      targetAtRate,
      expandSmvs,
      expandArr,
    });
  });
  return pool;
}

// ---- Shuffle-algoritme ----
function shuffleScenario(scenarioIdx) {
  const sc = state.scenarios[scenarioIdx];
  const newSmvPrice = num(document.getElementById("newSmvPrice").value);
  const gtPrice = num(document.getElementById("gtPrice").value);
  const currentArr = num(document.getElementById("currentArr").value);
  const targetArr = num(document.getElementById("targetArr").value);
  const gap = Math.max(targetArr - currentArr, 0);
  const gtContribution = sc.gtNewSmvs * gtPrice;
  const remainingGap = Math.max(gap - gtContribution, 0);

  // Locked AOs kommer ALTID først (Mads tror på dem)
  const lockedFirst = state.pool.filter((p) => state.locked.has(p.cvr));

  // Resten i prioritets-rækkefølge: existing → top → accru/rgd
  const ordered = [];
  for (const segment of SEGMENT_PRIORITY) {
    const inSeg = state.pool.filter((p) => p.segment === segment && !state.locked.has(p.cvr));
    for (let i = inSeg.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [inSeg[i], inSeg[j]] = [inSeg[j], inSeg[i]];
    }
    ordered.push(...inSeg);
  }

  // Greedy fyld: locked først (fuld expand), så resten op til mål
  const picked = [];
  let accum = 0;
  for (const ao of lockedFirst) {
    // Locked AOs bruger ALTID deres fulde expand · de er "vi tror på dette"
    picked.push({ cvr: ao.cvr, smvs: ao.expandSmvs });
    accum += ao.expandSmvs * newSmvPrice;
  }
  for (const ao of ordered) {
    if (accum >= remainingGap) break;
    const needed = remainingGap - accum;
    const useSmvs = Math.min(ao.expandSmvs, Math.ceil(needed / newSmvPrice));
    const useArr = useSmvs * newSmvPrice;
    if (useArr <= 0) continue;
    picked.push({ cvr: ao.cvr, smvs: useSmvs });
    accum += useArr;
  }
  sc.picked = picked;
  renderScenario(scenarioIdx);
}

function excludeAo(cvr) {
  state.excluded.add(cvr);
  state.locked.delete(cvr); // ekskludér + låst er gensidigt udelukkende
  saveExcluded(state.excluded);
  saveLocked(state.locked);
  // Fjern fra alle scenariers picked-lister
  state.scenarios.forEach((sc) => {
    sc.picked = sc.picked.filter((p) => p.cvr !== cvr);
  });
  rebuildAndRender();
}
function reincludeAo(cvr) {
  state.excluded.delete(cvr);
  saveExcluded(state.excluded);
  rebuildAndRender();
}
function lockAo(cvr) {
  state.locked.add(cvr);
  state.excluded.delete(cvr); // låst + ekskludér er gensidigt udelukkende
  saveLocked(state.locked);
  saveExcluded(state.excluded);
  // Hvis ikke allerede picked i aktive scenarie · tilføj så bruger ser det med det samme
  const sc = state.scenarios[state.activeTab];
  if (!sc.picked.some((p) => p.cvr === cvr)) {
    const ao = state.pool.find((p) => p.cvr === cvr);
    if (ao) sc.picked.unshift({ cvr, smvs: ao.expandSmvs });
  }
  rebuildAndRender();
}
function unlockAo(cvr) {
  state.locked.delete(cvr);
  saveLocked(state.locked);
  rebuildAndRender();
}
window.excludeAo = excludeAo;
window.reincludeAo = reincludeAo;
window.lockAo = lockAo;
window.unlockAo = unlockAo;

function resetAll() {
  if (!confirm("Nulstil alle låste og ekskluderede AOs? Picked-lister i scenarier ryddes også.")) return;
  state.locked.clear();
  state.excluded.clear();
  saveLocked(state.locked);
  saveExcluded(state.excluded);
  state.scenarios.forEach((sc) => (sc.picked = []));
  state.pool = buildPool();
  updateKpis();
  state.scenarios.forEach((_, idx) => shuffleScenario(idx));
  renderScenario(state.activeTab);
}
window.resetAll = resetAll;

// ---- Render ----
function renderScenario(idx) {
  const sc = state.scenarios[idx];
  const newSmvPrice = num(document.getElementById("newSmvPrice").value);
  const gtPrice = num(document.getElementById("gtPrice").value);
  const currentArr = num(document.getElementById("currentArr").value);
  const targetArr = num(document.getElementById("targetArr").value);
  const gap = Math.max(targetArr - currentArr, 0);
  const gtContribution = sc.gtNewSmvs * gtPrice;
  const remainingGap = Math.max(gap - gtContribution, 0);

  // Sikr at alle locked AOs er øverst i picked (auto-include selv hvis shuffle ikke er kørt)
  const poolMap = new Map(state.pool.map((p) => [p.cvr, p]));
  const lockedCvrs = [...state.locked].filter((c) => poolMap.has(c));
  const nonLockedPicked = sc.picked.filter((p) => !state.locked.has(p.cvr) && poolMap.has(p.cvr));
  const lockedPicked = lockedCvrs.map((c) => ({ cvr: c, smvs: poolMap.get(c).expandSmvs }));
  sc.picked = [...lockedPicked, ...nonLockedPicked];

  // Recompute SMV-fordeling for valgte AOs så totalen rammer remainingGap
  // (locked AOs får fuld expand · efterfølgende AOs scales mod remaining)
  let remaining = remainingGap;
  const pickedRows = sc.picked
    .map((p) => {
      const ao = poolMap.get(p.cvr);
      if (!ao) return null;
      const isLocked = state.locked.has(p.cvr);
      let useSmvs;
      if (isLocked) {
        // Låste AOs bruger ALTID fuld expand · trækker fra remaining
        useSmvs = ao.expandSmvs;
      } else {
        const needed = Math.max(remaining, 0);
        useSmvs = needed > 0 ? Math.min(ao.expandSmvs, Math.ceil(needed / newSmvPrice)) : 0;
      }
      const useArr = useSmvs * newSmvPrice;
      remaining -= useArr;
      return { ...ao, useSmvs, useArr, isLocked };
    })
    .filter((p) => p && p.useSmvs > 0)
    .sort((a, b) => (b.isLocked - a.isLocked) || (b.useArr - a.useArr));

  const totalOther = pickedRows.reduce((s, r) => s + r.useArr, 0);
  const grandTotal = gtContribution + totalOther;
  const status = grandTotal >= gap ? "ok" : grandTotal >= gap * 0.9 ? "warn" : "bad";
  const statusLabel = grandTotal >= gap ? `✓ Mål nået (+${dkCur.format(grandTotal - gap)})` : `Mangler ${dkCur.format(gap - grandTotal)}`;

  const segBadge = (seg) => {
    const labels = { existing: "Existing 25%", top: "Top 5%", accru: "Accru 2%", rgd: "RGD 2%", next20: "Næste 20 2%" };
    return `<span class="seg-badge seg-${seg}">${labels[seg] || seg}</span>`;
  };

  const html = `
    <div class="scenario-head">
      <div class="gap-status">
        <div class="gap-stat"><span>GT-bidrag</span><strong>${dkKKr(gtContribution)}</strong></div>
        <div class="gap-stat"><span>Andre AOs</span><strong>${dkKKr(totalOther)}</strong></div>
        <div class="gap-stat ${status}"><span>Total H2 tilført</span><strong>${dkKKr(grandTotal)}</strong></div>
        <div class="gap-stat ${status}"><span>Mål 1.434K</span><strong>${statusLabel}</strong></div>
      </div>
      <button class="shuffle-btn" onclick="shuffleScenario(${idx})">🎲 Shuffle AOs</button>
    </div>

    <table class="pool-table">
      <thead>
        <tr>
          <th>AO</th>
          <th>Segment</th>
          <th class="numeric">Erklæringer</th>
          <th class="numeric">Aktive</th>
          <th class="numeric">Max SMVs (ved rate)</th>
          <th class="numeric">Brugte SMVs</th>
          <th class="numeric">ARR-bidrag</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${sc.gtNewSmvs > 0 ? `
          <tr class="fixed">
            <td><strong>Grant Thornton</strong></td>
            <td>${segBadge("gt")}</td>
            <td class="numeric">11.366</td>
            <td class="numeric">701</td>
            <td class="numeric">${dkNum.format(sc.gtNewSmvs)} (fast)</td>
            <td class="numeric">${dkNum.format(sc.gtNewSmvs)}</td>
            <td class="numeric"><strong>${dkCur.format(gtContribution)}</strong></td>
          </tr>
        ` : ""}
        ${pickedRows.length === 0 ? `
          <tr><td colspan="8" style="text-align:center;color:var(--muted);padding:20px">Tryk 🎲 Shuffle for at vælge AOs der lukker gappet · eller låst AO med ⭐ for at tro fast på.</td></tr>
        ` : pickedRows.map((r) => `
          <tr class="${r.isLocked ? "locked" : "selected"}">
            <td>${r.name} ${r.isLocked ? '<span class="lock-badge">⭐ Låst</span>' : ""}</td>
            <td>${segBadge(r.segment)}</td>
            <td class="numeric">${dkNum.format(r.declarations)}</td>
            <td class="numeric">${dkNum.format(r.active)}</td>
            <td class="numeric">${dkNum.format(r.expandSmvs)}</td>
            <td class="numeric">${dkNum.format(r.useSmvs)}</td>
            <td class="numeric"><strong>${dkCur.format(r.useArr)}</strong></td>
            <td class="row-actions">
              ${r.isLocked
                ? `<button class="unlock-btn" title="Lås op" onclick="unlockAo('${r.cvr}')">🔓</button>`
                : `<button class="lock-btn" title="Tro fast på · lås altid med" onclick="lockAo('${r.cvr}')">⭐</button>`}
              <button class="exclude-btn" title="Tro ikke på · ekskludér" onclick="excludeAo('${r.cvr}')">✕</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="footer-summary">
      <div>
        <small style="color:var(--muted);font-size:12px">Subtotal andre AOs: ${dkCur.format(totalOther)}</small><br>
        <small style="color:var(--muted);font-size:12px">GT-bidrag: ${dkCur.format(gtContribution)}</small>
      </div>
      <div style="text-align:right">
        <small style="color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:0.06em">Samlet H2-tilført</small><br>
        <strong style="font-size:28px">${dkCur.format(grandTotal)}</strong><br>
        <small style="color:var(--muted)">EOY 2026 ARR: ${dkCur.format(currentArr + grandTotal)} (mål ${dkCur.format(targetArr)})</small>
      </div>
    </div>

    ${state.excluded.size > 0 ? `
      <div class="excluded-section">
        <h4>Ekskluderede AOs (${state.excluded.size}) · tæller ikke med i nogen scenarier</h4>
        <div class="excluded-list">
          ${[...state.excluded].map((cvr) => {
            const row = state.aoMaster.find((r) => String(r.accounting_office_cvr).trim() === cvr);
            const name = row ? row.accounting_office_name : cvr;
            return `<span class="excluded-tag">${name} <button onclick="reincludeAo('${cvr}')" title="Tag tilbage">↺</button></span>`;
          }).join("")}
        </div>
      </div>
    ` : ""}

    <details>
      <summary>Vis hele poolen (${state.pool.length} AOs · sorteret efter potentiale)</summary>
      <table class="pool-table" style="margin-top:12px">
        <thead>
          <tr><th>AO</th><th>Segment</th><th class="numeric">Erklæringer</th><th class="numeric">Aktive</th><th class="numeric">Max expand SMVs</th><th class="numeric">Max ARR</th><th></th></tr>
        </thead>
        <tbody>
          ${[...state.pool].sort((a,b) => b.expandArr - a.expandArr).map((r) => {
            const isLocked = state.locked.has(r.cvr);
            return `
            <tr class="${isLocked ? "locked" : ""}">
              <td>${r.name} ${isLocked ? '<span class="lock-badge">⭐ Låst</span>' : ""}</td>
              <td>${segBadge(r.segment)}</td>
              <td class="numeric">${dkNum.format(r.declarations)}</td>
              <td class="numeric">${dkNum.format(r.active)}</td>
              <td class="numeric">${dkNum.format(r.expandSmvs)}</td>
              <td class="numeric">${dkCur.format(r.expandArr)}</td>
              <td class="row-actions">
                ${isLocked
                  ? `<button class="unlock-btn" title="Lås op" onclick="unlockAo('${r.cvr}')">🔓</button>`
                  : `<button class="lock-btn" title="Tro fast på · lås altid med" onclick="lockAo('${r.cvr}')">⭐</button>`}
                <button class="exclude-btn" title="Tro ikke på · ekskludér" onclick="excludeAo('${r.cvr}')">✕</button>
              </td>
            </tr>
          `; }).join("")}
        </tbody>
      </table>
    </details>
  `;
  document.getElementById("scenarioView").innerHTML = html;
}

function updateKpis() {
  const currentArr = num(document.getElementById("currentArr").value);
  const targetArr = num(document.getElementById("targetArr").value);
  const gap = targetArr - currentArr;
  document.getElementById("kpiCurrent").textContent = dkKKr(currentArr);
  document.getElementById("kpiTarget").textContent = dkKKr(targetArr);
  document.getElementById("kpiGap").textContent = dkKKr(gap);

  // Pool-kapacitet = sum af max ARR alle pool-AOs kan levere
  const poolCapacity = state.pool.reduce((s, p) => s + p.expandArr, 0);
  const poolEl = document.getElementById("kpiPoolCapacity");
  if (poolEl) poolEl.textContent = dkKKr(poolCapacity);
  const poolHelpEl = document.getElementById("kpiPoolCapacityHelp");
  if (poolHelpEl) {
    const headroom = gap > 0 ? (poolCapacity / gap).toFixed(1) : "—";
    poolHelpEl.textContent = `${state.pool.length} AOs · ${headroom}× headroom mod gap`;
  }
  // Lock/exclude-status
  const statusEl = document.getElementById("lockExcludeStatus");
  if (statusEl) {
    statusEl.textContent = `⭐ ${state.locked.size} låst · ✕ ${state.excluded.size} ekskluderet`;
  }
}

function rebuildAndRender() {
  state.pool = buildPool();
  updateKpis();
  renderScenario(state.activeTab);
}

window.shuffleScenario = shuffleScenario;

async function init() {
  state.aoMaster = await loadCsv("ao_master.csv");
  const conns = await loadCsv("ao_connections_current.csv");
  conns.forEach((r) => state.connections.set(String(r.accounting_office_cvr).trim(), num(r.active_erp_connections)));

  // Tab switching · auto-shuffle hvis scenariet er tomt
  document.getElementById("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    state.activeTab = Number(btn.dataset.tab);
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === btn));
    const sc = state.scenarios[state.activeTab];
    if (sc.picked.length === 0) {
      shuffleScenario(state.activeTab);
    } else {
      renderScenario(state.activeTab);
    }
  });

  // Input listeners
  ["newSmvPrice", "gtPrice", "currentArr", "targetArr"].forEach((id) => {
    document.getElementById(id).addEventListener("input", rebuildAndRender);
  });
  document.getElementById("resetBtn")?.addEventListener("click", resetAll);

  // Build pool først
  state.pool = buildPool();
  updateKpis();

  // Auto-populér ALLE 3 scenarier så de er klar fra start
  state.scenarios.forEach((_, idx) => shuffleScenario(idx));

  // Render det aktive scenarie
  renderScenario(state.activeTab);
}

init().catch((e) => {
  document.body.innerHTML = `<main><h1>Kunne ikke starte budget-værktøj</h1><p>${e.message}</p></main>`;
});
