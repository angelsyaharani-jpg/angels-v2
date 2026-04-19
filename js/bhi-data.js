/* ============================================================
   BENDERANG HIDUP INDONESIA — SHARED DATA & UTILITIES
   bhi-data.js
   ============================================================ */

// ============ CONFIG ============
const ADMIN_CODE = "benderang2025";
const DASH_DUR = 1000; // 10 menit
const PHOTO_DUR = 12000; // 12 detik
const SLIDE_DUR = 12000; // 12 detik

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// ============ DELAY REASON OPTIONS ============
const DELAY_REASONS = [
  "Unexpected matter yg lebih dari 1 hari",
  "Spec/desain berubah",
  "Data tidak lengkap",
  "Pemilihan material/metode butuh riset jauh lebih lama",
  "Overload",
  "Supplier terlambat memberikan harga",
  "Material langka",
  "Proses negosiasi lambat",
  "Proses internal lambat",
  "Lainnya"
];

// ============ HELPERS ============
function addDays(n) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function todayStr() { return addDays(0); }
function pad(n) { return String(n).padStart(2, "0"); }
function diffDays(dStr) { if (!dStr) return null; const d = new Date(dStr); d.setHours(0, 0, 0, 0); const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((d - t) / (1000 * 60 * 60 * 24)); }
function fmtDeadline(dStr) {
  if (!dStr) return "—";
  const diff = diffDays(dStr);
  const [y, m, day] = dStr.split("-");
  const label = `${parseInt(day)}/${parseInt(m)}/${y.slice(2)}`;
  if (diff < 0) return `${label} (${Math.abs(diff)} hari lalu)`;
  if (diff === 0) return `${label} (Hari ini!)`;
  if (diff === 1) return `${label} (Besok)`;
  return `${label} (${diff} hari lagi)`;
}

// ============ PERSISTENT STORAGE ============
const STORAGE_KEY = "bhi_state_v6";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return null;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      employees, projects, updateLog, sheetsUrl, waToken, nProjId, nTaskId,
      autoSendWA, lastAutoSendDate,
      gdrive: { ann: (typeof gdrivePengumuman !== "undefined" ? gdrivePengumuman : ""), vis: (typeof gdriveVision !== "undefined" ? gdriveVision : "") }
    }));
  } catch (e) { }
}

// ============ DEFAULT STATE ============
let employees = [
  { name: "Andi Saputra", init: "AS", wa: "" },
  { name: "Budi Hartono", init: "BH", wa: "" },
  { name: "Citra Dewi", init: "CD", wa: "" },
  { name: "Dimas Pratama", init: "DP", wa: "" },
  { name: "Eka Putri", init: "EP", wa: "" }
];

let nProjId = 10, nTaskId = 100;

let projects = [
  {
    id: 1, name: "RTM Pabrik ABC", client: "PT Maju Bersama", type: "project", priority: 5, imgLeft: "", imgRight: "", tasks: [
      { id: 11, name: "Survey & desain", person: "Andi Saputra", deadline: addDays(-10), pct: 100 },
      { id: 12, name: "Wiring panel", person: "Andi Saputra", deadline: addDays(-1), pct: 65, lateReason: null, extDeadline: null },
      { id: 13, name: "Commissioning", person: "Budi Hartono", deadline: addDays(8), pct: 0 }
    ]
  },
  {
    id: 2, name: "Robotics XYZ", client: "PT Sejahtera Pack", type: "project", priority: 4, imgLeft: "", imgRight: "", tasks: [
      { id: 21, name: "Programming", person: "Budi Hartono", deadline: addDays(0), pct: 80 },
      { id: 22, name: "Testing", person: "Budi Hartono", deadline: addDays(12), pct: 0 }
    ]
  },
  {
    id: 3, name: "Inquiry Kemasan Lancar", client: "PT Lancar Jaya", type: "inquiry", priority: 3, imgLeft: "", imgRight: "", tasks: [
      { id: 31, name: "BoM & sourcing", person: "Citra Dewi", deadline: addDays(-2), pct: 70, lateReason: null },
      { id: 32, name: "Proposal teknis", person: "Citra Dewi", deadline: addDays(3), pct: 0 }
    ]
  },
  {
    id: 4, name: "Drive System DEF", client: "PT Delta Energi", type: "project", priority: 4, imgLeft: "", imgRight: "", tasks: [
      { id: 41, name: "Instalasi inverter", person: "Dimas Pratama", deadline: addDays(1), pct: 90 }
    ]
  },
  {
    id: 5, name: "IIoT Prima Food", client: "PT Prima Food", type: "project", priority: 2, imgLeft: "", imgRight: "", tasks: [
      { id: 51, name: "Sensor mapping", person: "Eka Putri", deadline: addDays(5), pct: 35 }
    ]
  }
];

let updateLog = [];
let sheetsUrl = "";
let waToken = "gRJJcDgsrMaV6ZVkd71h";
let gdrivePengumuman = "https://script.google.com/macros/s/AKfycbyq1-hPuTj97OsNOQqTnt20oDFCejpIyF-avrDyW8O5VDFtP2uP4v-GWJnyeZ4iVl8R_Q/exec?folder=1QDq8UIqZS5aXcn4-cA3Yq427fNgobKlP";
let gdriveVision = "https://script.google.com/macros/s/AKfycbyq1-hPuTj97OsNOQqTnt20oDFCejpIyF-avrDyW8O5VDFtP2uP4v-GWJnyeZ4iVl8R_Q/exec?folder=19HcKuT-CRKsizg60OCLXiwEkz66n_NJN";
let autoSendWA = false;
let lastAutoSendDate = "";

// ============ INIT STATE FROM LOCALSTORAGE ============
(function () {
  const s = loadState();
  if (s) {
    if (s.employees) employees = s.employees;
    if (s.projects) projects = s.projects;
    if (s.updateLog) updateLog = s.updateLog;
    if (s.sheetsUrl) sheetsUrl = s.sheetsUrl;
    if (s.waToken) waToken = s.waToken;
    if (s.nProjId) nProjId = s.nProjId;
    if (s.nTaskId) nTaskId = s.nTaskId;
    if (s.autoSendWA) autoSendWA = s.autoSendWA;
    if (s.lastAutoSendDate) lastAutoSendDate = s.lastAutoSendDate;
    if (s.gdrive) {
      gdrivePengumuman = s.gdrive.ann || "";
      gdriveVision = s.gdrive.vis || "";
    }
  }
})();

// ============ PIN ============
function getPins() { try { return JSON.parse(localStorage.getItem("bhi_pins_v5") || "{}"); } catch (e) { return {}; } }
function savePin(name, pin) { const p = getPins(); p[name] = pin; localStorage.setItem("bhi_pins_v5", JSON.stringify(p)); }
function getPin(name) { return getPins()[name] || "1234"; }
function initPins() { employees.forEach(e => { if (!getPins()[e.name]) savePin(e.name, "1234"); }); }

// ============ SESSION (shared via sessionStorage so both pages share) ============
function getSession() {
  try { return JSON.parse(sessionStorage.getItem("bhi_session") || "null"); } catch (e) { return null; }
}
function setSession(obj) {
  sessionStorage.setItem("bhi_session", JSON.stringify(obj));
}
function clearSession() {
  sessionStorage.removeItem("bhi_session");
}

// ============ DASHBOARD CALC ============
function getDashboardTasks() {
  const today = todayStr();
  let overdue = [], todayT = [], risk = [], tomorrow = [];
  projects.forEach(p => {
    p.tasks.forEach(t => {
      if (t.pct >= 100) return;
      const d = diffDays(t.extDeadline || t.deadline);
      const obj = { proj: p.name, task: t.name, person: t.person, deadline: t.extDeadline || t.deadline, d, priority: p.priority || 1 };
      if (d === null) return;
      if (d < 0) overdue.push(obj);
      else if (d === 0) todayT.push(obj);
      else if (d === 1 || d === 2) risk.push(obj);
      else if (d === 3 || d === 4) tomorrow.push(obj);
    });
  });
  const sortByPrio = (a, b) => (b.priority || 1) - (a.priority || 1);
  return {
    overdue: overdue.sort(sortByPrio),
    today: todayT.sort(sortByPrio),
    risk: risk.sort(sortByPrio),
    tomorrow: tomorrow.sort(sortByPrio)
  };
}

function getProjectProgress() {
  return projects.map(p => {
    const total = p.tasks.length;
    const done = p.tasks.filter(t => t.pct >= 100).length;
    const pctAvg = total > 0 ? Math.round(p.tasks.reduce((s, t) => s + t.pct, 0) / total) : 0;
    const mainPerson = (() => {
      const cnt = {};
      p.tasks.forEach(t => { cnt[t.person] = (cnt[t.person] || 0) + 1; });
      return Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    })();
    return { ...p, pctAvg, done, total, mainPerson, priority: p.priority || 1 };
  }).sort((a, b) => b.priority - a.priority);
}

// ============ EXPORT HELPERS ============
function csvRow(arr) { return arr.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(","); }
function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ============ SHEETS ============
function pushToSheets(entry) {
  if (!sheetsUrl) return;
  fetch(sheetsUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) }).catch(() => { });
}
