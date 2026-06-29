import { useState, useMemo, useEffect, useRef } from "react";

const T = {
  navy:     "#0A1628",
  navyMid:  "#112240",
  navyLight:"#1B3461",
  red:      "#C8102E",
  gold:     "#F5C518",
  goldDim:  "#C49A10",
  white:    "#FFFFFF",
  offWhite: "#EEF2F8",
  muted:    "#7A8FAE",
  green:    "#00C18A",
  greenDim: "#009E70",
  card:     "#162035",
  border:   "#243555",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { background: #0A1628; margin: 0; }
  input::placeholder { color: #7A8FAE; }
  input:focus { outline: none; }
  button:focus { outline: none; }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
`;

const GROUPS = {
  A: [
    { name: "Mexico",         code: "MEX", total: 20, extra: [] },
    { name: "South Africa",   code: "RSA", total: 20, extra: [] },
    { name: "South Korea",    code: "KOR", total: 20, extra: [] },
    { name: "Czech Republic", code: "CZE", total: 20, extra: [] },
  ],
  B: [
    { name: "Canada",         code: "CAN", total: 20, extra: [] },
    { name: "Bosnia & Herz.", code: "BIH", total: 20, extra: [] },
    { name: "Qatar",          code: "QAT", total: 20, extra: [] },
    { name: "Switzerland",    code: "SUI", total: 20, extra: [] },
  ],
  C: [
    { name: "Brazil",         code: "BRA", total: 20, extra: [] },
    { name: "Morocco",        code: "MAR", total: 20, extra: [] },
    { name: "Haiti",          code: "HAI", total: 20, extra: [] },
    { name: "Scotland",       code: "SCO", total: 20, extra: [] },
  ],
  D: [
    { name: "USA",            code: "USA", total: 20, extra: [] },
    { name: "Paraguay",       code: "PAR", total: 20, extra: [] },
    { name: "Australia",      code: "AUS", total: 20, extra: [] },
    { name: "Turkey",         code: "TUR", total: 20, extra: [] },
  ],
  E: [
    { name: "Germany",        code: "GER", total: 20, extra: [] },
    { name: "Curaçao",        code: "CUW", total: 20, extra: [] },
    { name: "Ivory Coast",    code: "CIV", total: 20, extra: [] },
    { name: "Ecuador",        code: "ECU", total: 20, extra: [] },
  ],
  F: [
    { name: "Netherlands",    code: "NED", total: 20, extra: [] },
    { name: "Japan",          code: "JPN", total: 20, extra: [] },
    { name: "Sweden",         code: "SWE", total: 20, extra: [] },
    { name: "Tunisia",        code: "TUN", total: 20, extra: [] },
  ],
  G: [
    { name: "Belgium",        code: "BEL", total: 20, extra: [] },
    { name: "Egypt",          code: "EGY", total: 20, extra: [] },
    { name: "Iran",           code: "IRN", total: 20, extra: [] },
    { name: "New Zealand",    code: "NZL", total: 20, extra: [] },
  ],
  H: [
    { name: "Spain",          code: "ESP", total: 20, extra: [] },
    { name: "Cape Verde",     code: "CPV", total: 20, extra: [] },
    { name: "Saudi Arabia",   code: "KSA", total: 20, extra: [] },
    { name: "Uruguay",        code: "URU", total: 20, extra: [] },
  ],
  I: [
    { name: "France",         code: "FRA", total: 20, extra: [] },
    { name: "Senegal",        code: "SEN", total: 20, extra: [] },
    { name: "Iraq",           code: "IRQ", total: 20, extra: [] },
    { name: "Norway",         code: "NOR", total: 20, extra: [] },
  ],
  J: [
    { name: "Argentina",      code: "ARG", total: 20, extra: [] },
    { name: "Algeria",        code: "ALG", total: 20, extra: [] },
    { name: "Austria",        code: "AUT", total: 20, extra: [] },
    { name: "Jordan",         code: "JOR", total: 20, extra: [] },
  ],
  K: [
    { name: "Portugal",       code: "POR", total: 20, extra: [] },
    { name: "DR Congo",       code: "COD", total: 20, extra: [] },
    { name: "Uzbekistan",     code: "UZB", total: 20, extra: [] },
    { name: "Colombia",       code: "COL", total: 20, extra: [] },
  ],
  L: [
    { name: "England",        code: "ENG", total: 20, extra: [] },
    { name: "Croatia",        code: "CRO", total: 20, extra: [] },
    { name: "Ghana",          code: "GHA", total: 20, extra: [] },
    { name: "Panama",         code: "PAN", total: 20, extra: [] },
  ],
};

const FWC_STICKERS = [
  { key: "FWC00", label: "FWC00" },
  ...Array.from({ length: 19 }, (_, i) => ({ key: `FWC${i+1}`, label: `FWC${i+1}` })),
];
const CC_STICKERS = Array.from({ length: 12 }, (_, i) => ({ key: `CC${i+1}`, label: `CC${i+1}` }));

function buildStickers({ code, total }) {
  return Array.from({ length: total }, (_, i) => ({ key: `${code}_${i}`, label: `${code}${i+1}` }));
}

const ALL_TEAMS = Object.values(GROUPS).flat();
const TEAM_TO_GROUP = {};
Object.entries(GROUPS).forEach(([g, teams]) => teams.forEach(t => { TEAM_TO_GROUP[t.code] = g; }));
const TOTAL_STICKERS = 980 + 20 + 12; // 1012

const FLAG_URLS = {
  MEX:"mx",RSA:"za",KOR:"kr",CZE:"cz",CAN:"ca",BIH:"ba",QAT:"qa",SUI:"ch",
  BRA:"br",MAR:"ma",HAI:"ht",SCO:"gb-sct",USA:"us",PAR:"py",AUS:"au",TUR:"tr",
  GER:"de",CUW:"cw",CIV:"ci",ECU:"ec",NED:"nl",JPN:"jp",SWE:"se",TUN:"tn",
  BEL:"be",EGY:"eg",IRN:"ir",NZL:"nz",ESP:"es",CPV:"cv",KSA:"sa",URU:"uy",
  FRA:"fr",SEN:"sn",IRQ:"iq",NOR:"no",ARG:"ar",ALG:"dz",AUT:"at",JOR:"jo",
  POR:"pt",COD:"cd",UZB:"uz",COL:"co",ENG:"gb-eng",CRO:"hr",GHA:"gh",PAN:"pa",
};

function initTeamState(val) {
  const s = {};
  ALL_TEAMS.forEach(team => { s[team.code] = Array(team.total).fill(val); });
  return s;
}

// localStorage persistence
function usePersisted(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch { return fallback; }
  });
  function set(next) {
    const val = typeof next === "function" ? next(value) : next;
    setValue(val);
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
  return [value, set];
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", fontSize: 12, fontWeight: active ? 700 : 500,
      letterSpacing: "0.04em", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap",
      border: active ? `1.5px solid ${T.gold}` : `1px solid ${T.border}`,
      background: active ? T.gold : T.card, color: active ? T.navy : T.muted,
    }}>{children}</button>
  );
}

function ProgressBar({ pct, color, height = 6 }) {
  return (
    <div style={{ height, background: T.navyLight, borderRadius: 999, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color || T.green, borderRadius: 999, transition: "width 0.4s ease" }} />
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: T.card, borderRadius: 10, padding: "10px 12px", border: `1px solid ${T.border}`, borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Bebas Neue, sans-serif", letterSpacing: "0.05em", color: T.white }}>{value}</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [owned,    setOwned]    = usePersisted("panini2026_owned",     initTeamState(false));
  const [dupes,    setDupes]    = usePersisted("panini2026_dupes",     initTeamState(0));
  const [fwcOwned, setFwcOwned] = usePersisted("panini2026_fwc_owned", FWC_STICKERS.map(() => false));
  const [fwcDupes, setFwcDupes] = usePersisted("panini2026_fwc_dupes", FWC_STICKERS.map(() => 0));
  const [ccOwned,  setCcOwned]  = usePersisted("panini2026_cc_owned",  CC_STICKERS.map(() => false));
  const [ccDupes,  setCcDupes]  = usePersisted("panini2026_cc_dupes",  CC_STICKERS.map(() => 0));

  const [saved, setSaved] = useState(false);
  const [view, setView] = useState("group");
  const [selectedGroup, setSelectedGroup] = useState("A");
  const [openTeam, setOpenTeam] = useState(null);
  const [search, setSearch] = useState("");
  const importRef = useRef(null);
  const [importMsg, setImportMsg] = useState(null);
  const firstRender = useRef(true);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, type = "success") {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [owned, dupes, fwcOwned, fwcDupes, ccOwned, ccDupes]);

  const totalOwned = useMemo(() =>
    Object.values(owned).reduce((s, arr) => s + arr.filter(Boolean).length, 0)
    + fwcOwned.filter(Boolean).length
    + ccOwned.filter(Boolean).length,
  [owned, fwcOwned, ccOwned]);

  const totalDupes = useMemo(() =>
    Object.values(dupes).reduce((s, arr) => s + arr.reduce((a, b) => a + b, 0), 0)
    + fwcDupes.reduce((a, b) => a + b, 0)
    + ccDupes.reduce((a, b) => a + b, 0),
  [dupes, fwcDupes, ccDupes]);

  const pct = Math.round((totalOwned / TOTAL_STICKERS) * 100);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return ALL_TEAMS.filter(t => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q));
  }, [search]);

  const allMissingList = useMemo(() => {
    const list = [];
    ALL_TEAMS.forEach(team => {
      buildStickers(team).forEach((sticker, i) => {
        if (!owned[team.code]?.[i])
          list.push({ teamName: team.name, code: team.code, label: sticker.label, group: TEAM_TO_GROUP[team.code] });
      });
    });
    FWC_STICKERS.forEach((s, i) => { if (!fwcOwned[i]) list.push({ teamName: "FWC", code: "FWC", label: s.label, group: "FWC", isFWC: true }); });
    CC_STICKERS.forEach((s, i)  => { if (!ccOwned[i])  list.push({ teamName: "CC",  code: "CC",  label: s.label, group: "CC",  isCC:  true }); });
    return list;
  }, [owned, fwcOwned, ccOwned]);

  const allDupesList = useMemo(() => {
    const list = [];
    ALL_TEAMS.forEach(team => {
      buildStickers(team).forEach((sticker, i) => {
        const count = dupes[team.code]?.[i] || 0;
        if (count > 0) list.push({ teamName: team.name, code: team.code, label: sticker.label, count });
      });
    });
    FWC_STICKERS.forEach((s, i) => { if (fwcDupes[i] > 0) list.push({ teamName: "FWC Stickers", code: "FWC", label: s.label, isFWC: true, count: fwcDupes[i] }); });
    CC_STICKERS.forEach((s, i)  => { if (ccDupes[i]  > 0) list.push({ teamName: "CC Stickers",  code: "CC",  label: s.label, isCC:  true, count: ccDupes[i] }); });
    return list;
  }, [dupes, fwcDupes, ccDupes]);

  function toggleOwned(code, idx, label) {
    setOwned(prev => {
      const arr = [...prev[code]]; 
      const wasOwned = arr[idx];
      arr[idx] = !arr[idx];
      if (!arr[idx]) {
        setDupes(pd => { const da = [...pd[code]]; da[idx] = 0; return { ...pd, [code]: da }; });
        showToast(`✕ Removed ${label}`, "remove");
      } else {
        showToast(`✓ Added ${label}`, "success");
      }
      return { ...prev, [code]: arr };
    });
  }
  function changeDupe(code, idx, delta, label) {
    setDupes(prev => {
      const arr = [...prev[code]];
      const newVal = Math.max(0, (arr[idx]||0)+delta);
      arr[idx] = newVal;
      if (delta > 0) showToast(`+ Duplicate added for ${label} (×${newVal})`, "dupe");
      else if (delta < 0 && newVal >= 0) showToast(`− Duplicate removed for ${label} (×${newVal})`, "remove");
      return { ...prev, [code]: arr };
    });
  }
  function teamOwned(code) { return (owned[code]||[]).filter(Boolean).length; }
  function teamTotal(code) { return (owned[code]||[]).length; }
  function teamDupes(code) { return (dupes[code]||[]).reduce((a,b)=>a+b,0); }
  function groupOwned(g) { return GROUPS[g].reduce((s,t)=>s+teamOwned(t.code),0); }
  function groupTotal(g) { return GROUPS[g].reduce((s,t)=>s+teamTotal(t.code),0); }
  const groupKeys = Object.keys(GROUPS);

  // Export / Import
  function handleExport() {
    const data = { owned, dupes, fwcOwned, fwcDupes, ccOwned, ccDupes, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "panini-wc2026-backup.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function handleImport(e) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.owned || !d.dupes) throw new Error();
        setOwned(d.owned); setDupes(d.dupes);
        if (d.fwcOwned) setFwcOwned(d.fwcOwned);
        if (d.fwcDupes) setFwcDupes(d.fwcDupes);
        if (d.ccOwned)  setCcOwned(d.ccOwned);
        if (d.ccDupes)  setCcDupes(d.ccDupes);
        setImportMsg({ ok: true, text: "✓ Data imported!" });
      } catch { setImportMsg({ ok: false, text: "✕ Invalid backup file." }); }
      setTimeout(() => setImportMsg(null), 3000);
    };
    reader.readAsText(file); e.target.value = "";
  }

  // ── Team Card ──────────────────────────────────────────────────────────────
  const TeamCard = ({ name, code }) => {
    const total = teamTotal(code), o = teamOwned(code), d = teamDupes(code);
    const p = Math.round((o / total) * 100);
    const isOpen = openTeam?.code === code;
    const complete = o === total;
    return (
      <button onClick={() => setOpenTeam(isOpen ? null : { name, code })} style={{
        width: "100%", textAlign: "left", cursor: "pointer",
        background: isOpen ? T.navyLight : T.card,
        border: isOpen ? `2px solid ${T.gold}` : `1px solid ${T.border}`,
        borderRadius: 10, padding: "12px 14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <img src={`https://paniniwm2026sticker.com/flags/${FLAG_URLS[code]}.png`} alt=""
            style={{ width: 28, height: 19, objectFit: "cover", borderRadius: 3, flexShrink: 0 }}
            onError={e => e.target.style.display="none"} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
            <div style={{ fontSize: 10, color: T.muted }}>{code} · GRP {TEAM_TO_GROUP[code]}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: complete ? T.gold : T.white }}>{o}/{total}</div>
            {d > 0 && <div style={{ fontSize: 10, color: T.green }}>{d} dupes</div>}
            {complete && <div style={{ fontSize: 10, color: T.gold }}>✓ DONE</div>}
          </div>
        </div>
        <ProgressBar pct={p} color={complete ? T.gold : T.green} height={4} />
      </button>
    );
  };

  // ── Sticker Panel ──────────────────────────────────────────────────────────
  const StickerPanel = ({ name, code }) => {
    const stickers = buildStickers({ code, total: teamTotal(code) });
    return (
      <div style={{ background: T.navyMid, borderRadius: 10, border: `1px solid ${T.border}`, padding: 14, marginTop: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, letterSpacing: "0.05em" }}>
            {name.toUpperCase()} · {teamOwned(code)}/{teamTotal(code)}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setOwned(p=>({...p,[code]:Array(teamTotal(code)).fill(true)}))} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 5, cursor: "pointer", border: `1px solid ${T.border}`, background: T.navyLight, color: T.muted, fontWeight: 600 }}>All owned</button>
            <button onClick={() => { const n=teamTotal(code); setOwned(p=>({...p,[code]:Array(n).fill(false)})); setDupes(p=>({...p,[code]:Array(n).fill(0)})); }} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 5, cursor: "pointer", border: `1px solid ${T.border}`, background: T.navyLight, color: T.muted, fontWeight: 600 }}>Clear</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
          {stickers.map((sticker, i) => {
            const isOwned = owned[code]?.[i], dupeCount = dupes[code]?.[i]||0;
            return (
              <div key={sticker.key}>
                <div style={{ position: "relative" }}>
                  <button onClick={() => { if (!isOwned) toggleOwned(code, i, sticker.label); }} style={{
                    width: "100%", aspectRatio: "3/4", borderRadius: 6, cursor: isOwned ? "default" : "pointer", padding: 0,
                    border: isOwned ? `2px solid ${T.green}` : `1px solid ${T.border}`,
                    background: isOwned ? "rgba(0,193,138,0.15)" : T.navy,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: isOwned ? T.green : T.muted }}>{sticker.label}</span>
                    {isOwned && <span style={{ fontSize: 11, color: T.green, marginTop: 1 }}>✓</span>}
                  </button>
                  {isOwned && (
                    <button
                      onClick={() => toggleOwned(code, i, sticker.label)}
                      title="Click to unmark"
                      style={{
                        position: "absolute", top: 2, right: 2,
                        width: 14, height: 14, borderRadius: "50%",
                        background: "rgba(200,16,46,0.7)", border: "none",
                        cursor: "pointer", fontSize: 9, color: T.white,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 0, lineHeight: 1,
                      }}
                    >✕</button>
                  )}
                </div>
                {isOwned && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginTop: 3 }}>
                    <button onClick={() => changeDupe(code, i, -1, sticker.label)} style={{ width:15,height:15,borderRadius:"50%",border:`1px solid ${T.border}`,background:T.navyLight,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,padding:0 }}>−</button>
                    <span style={{ fontSize:9,minWidth:12,textAlign:"center",color:dupeCount>0?T.green:T.muted }}>{dupeCount}</span>
                    <button onClick={() => changeDupe(code, i, 1, sticker.label)} style={{ width:15,height:15,borderRadius:"50%",border:`1px solid ${T.border}`,background:T.navyLight,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,padding:0 }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Special Section (FWC / CC) ─────────────────────────────────────────────
  const SpecialSection = ({ title, color, stickers, ownedArr, setOwnedArr, dupesArr, setDupesArr }) => {
    const tot = stickers.length;
    const own = ownedArr.filter(Boolean).length;
    const p = Math.round((own / tot) * 100);
    return (
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, letterSpacing: "0.08em", color }}>{title}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{own}/{tot} owned</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, color: p===100 ? T.gold : T.white }}>{p}%</span>
            <button onClick={() => setOwnedArr(stickers.map(() => true))} style={{ fontSize: 10, padding: "4px 9px", borderRadius: 5, cursor: "pointer", border: `1px solid ${T.border}`, background: T.navyLight, color: T.muted, fontWeight: 600 }}>All</button>
            <button onClick={() => { setOwnedArr(stickers.map(() => false)); setDupesArr(stickers.map(() => 0)); }} style={{ fontSize: 10, padding: "4px 9px", borderRadius: 5, cursor: "pointer", border: `1px solid ${T.border}`, background: T.navyLight, color: T.muted, fontWeight: 600 }}>Clear</button>
          </div>
        </div>
        <div style={{ height: 5, background: T.navyLight, borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ height: "100%", width: `${p}%`, background: p===100 ? T.gold : color, borderRadius: 999, transition: "width 0.4s" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
          {stickers.map((sticker, i) => {
            const isOwned = ownedArr[i], dupeCount = dupesArr[i]||0;
            return (
              <div key={sticker.key}>
                <div style={{ position: "relative" }}>
                  <button onClick={() => {
                    if (!isOwned) {
                      const arr = [...ownedArr]; arr[i] = true; setOwnedArr(arr);
                      showToast(`✓ Added ${sticker.label}`, "success");
                    }
                  }} style={{
                    width: "100%", aspectRatio: "3/4", borderRadius: 6, cursor: isOwned ? "default" : "pointer", padding: 0,
                    border: isOwned ? `2px solid ${color}` : `1px solid ${T.border}`,
                    background: isOwned ? `${color}22` : T.navy,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: isOwned ? color : T.muted }}>{sticker.label}</span>
                    {isOwned && <span style={{ fontSize: 11, color, marginTop: 1 }}>✓</span>}
                  </button>
                  {isOwned && (
                    <button
                      onClick={() => {
                        const arr = [...ownedArr]; arr[i] = false;
                        const da = [...dupesArr]; da[i] = 0;
                        setOwnedArr(arr); setDupesArr(da);
                        showToast(`✕ Removed ${sticker.label}`, "remove");
                      }}
                      title="Click to unmark"
                      style={{
                        position: "absolute", top: 2, right: 2,
                        width: 14, height: 14, borderRadius: "50%",
                        background: "rgba(200,16,46,0.7)", border: "none",
                        cursor: "pointer", fontSize: 9, color: T.white,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 0, lineHeight: 1,
                      }}
                    >✕</button>
                  )}
                </div>
                {isOwned && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginTop: 3 }}>
                    <button onClick={() => { const da=[...dupesArr]; const nv=Math.max(0,(da[i]||0)-1); da[i]=nv; setDupesArr(da); showToast(`− Duplicate removed for ${sticker.label} (×${nv})`, "remove"); }} style={{ width:15,height:15,borderRadius:"50%",border:`1px solid ${T.border}`,background:T.navyLight,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,padding:0 }}>−</button>
                    <span style={{ fontSize:9,minWidth:12,textAlign:"center",color:dupeCount>0?color:T.muted }}>{dupeCount}</span>
                    <button onClick={() => { const da=[...dupesArr]; const nv=(da[i]||0)+1; da[i]=nv; setDupesArr(da); showToast(`+ Duplicate added for ${sticker.label} (×${nv})`, "dupe"); }} style={{ width:15,height:15,borderRadius:"50%",border:`1px solid ${T.border}`,background:T.navyLight,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,padding:0 }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Copy Button ────────────────────────────────────────────────────────────
  function CopyButton({ getText, label }) {
    const [open, setOpen] = useState(false);
    const taRef = useRef(null);
    return (
      <div>
        <button onClick={() => { setOpen(v=>!v); if (!open) setTimeout(()=>taRef.current?.select(),50); }} style={{ fontSize: 11, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600, border: open?`1.5px solid ${T.gold}`:`1px solid ${T.border}`, background: open?"rgba(245,197,24,0.15)":T.card, color: open?T.gold:T.muted }}>
          {open ? "✕ Close" : label}
        </button>
        {open && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>Click box → <strong style={{color:T.white}}>Ctrl+A</strong> → <strong style={{color:T.white}}>Ctrl+C</strong></div>
            <textarea ref={taRef} readOnly value={getText()} onFocus={e=>e.target.select()} onClick={e=>e.target.select()} style={{ width:"100%",height:160,fontSize:11,fontFamily:"monospace",padding:10,borderRadius:6,border:`1px solid ${T.border}`,background:T.navy,color:T.offWhite,resize:"vertical",outline:"none" }} />
          </div>
        )}
      </div>
    );
  }

  function buildMissingText(list) {
    const byTeam = {};
    list.forEach(s => { if (!byTeam[s.code]) byTeam[s.code]={teamName:s.teamName,items:[]}; byTeam[s.code].items.push(s.label); });
    return ["MISSING STICKERS — Panini World Cup 2026","", ...Object.values(byTeam).map(({teamName,items})=>`${teamName}: ${items.join(", ")}`), "","Total: "+list.length].join("\n");
  }
  function buildDupesText(list) {
    const byTeam = {};
    list.forEach(d => { if (!byTeam[d.code]) byTeam[d.code]={teamName:d.teamName,items:[]}; byTeam[d.code].items.push(`${d.label} x${d.count}`); });
    return ["DUPLICATE STICKERS — Panini World Cup 2026","", ...Object.values(byTeam).map(({teamName,items})=>`${teamName}: ${items.join(", ")}`), "","Total: "+list.reduce((s,d)=>s+d.count,0)].join("\n");
  }

  // ── Missing View ───────────────────────────────────────────────────────────
  const MissingView = () => {
    const [mf, setMf] = useState("all");
    const filters = ["all", ...groupKeys, "FWC", "CC"];
    const filtered = mf==="all" ? allMissingList : allMissingList.filter(s=>s.group===mf);
    if (allMissingList.length===0) return <div style={{textAlign:"center",padding:"3rem 1rem",color:T.gold,fontSize:22,fontFamily:"Bebas Neue, sans-serif",letterSpacing:"0.1em"}}>🏆 ALBUM COMPLETE!</div>;
    const byTeam = {};
    filtered.forEach(s=>{ if(!byTeam[s.code]) byTeam[s.code]={teamName:s.teamName,code:s.code,items:[]}; byTeam[s.code].items.push(s); });
    return (
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {filters.map(g=>(
            <button key={g} onClick={()=>setMf(g)} style={{ padding:"4px 10px",fontSize:11,borderRadius:5,cursor:"pointer",fontWeight:700, border:mf===g?`1.5px solid ${T.red}`:`1px solid ${T.border}`, background:mf===g?"rgba(200,16,46,0.2)":T.card, color:mf===g?"#FF6680":T.muted }}>
              {g==="all"?"ALL":g==="FWC"?"FWC":g==="CC"?"CC":`GRP ${g}`}
            </button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <div style={{fontSize:12,color:T.muted}}><span style={{color:"#FF6680",fontWeight:700}}>{filtered.length}</span> missing</div>
          {filtered.length>0 && <CopyButton label="📋 Show list" getText={()=>buildMissingText(filtered)} />}
        </div>
        {Object.values(byTeam).map(({teamName,code,items})=>(
          <div key={code} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              {FLAG_URLS[code] && <img src={`https://paniniwm2026sticker.com/flags/${FLAG_URLS[code]}.png`} alt="" style={{width:22,height:15,objectFit:"cover",borderRadius:2}} onError={e=>e.target.style.display="none"} />}
              <span style={{fontSize:13,fontWeight:700,color:T.white}}>{teamName}</span>
              <span style={{fontSize:11,color:T.muted,marginLeft:"auto"}}>{items.length} missing</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {items.map(({label,isFWC,isCC})=>(
                <div key={label} style={{padding:"3px 8px",borderRadius:5,background:isFWC?"rgba(245,197,24,0.15)":isCC?"rgba(244,0,9,0.15)":"rgba(200,16,46,0.15)",border:`1px solid ${isFWC?T.goldDim:isCC?"#F40009":"#8B1020"}`}}>
                  <span style={{fontSize:11,fontWeight:700,color:isFWC?T.gold:isCC?"#FF6680":"#FF6680"}}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── Dupes View ─────────────────────────────────────────────────────────────
  const DupesView = () => {
    if (allDupesList.length===0) return <div style={{textAlign:"center",padding:"2.5rem 1rem",color:T.muted,fontSize:13}}>No duplicates tracked yet.</div>;
    const byTeam = {};
    allDupesList.forEach(d=>{ if(!byTeam[d.code]) byTeam[d.code]={teamName:d.teamName,code:d.code,items:[]}; byTeam[d.code].items.push(d); });
    return (
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:4}}>
          <div style={{fontSize:12,color:T.muted}}><span style={{color:T.green,fontWeight:700}}>{allDupesList.reduce((s,d)=>s+d.count,0)}</span> dupes across {Object.keys(byTeam).length} teams</div>
          <CopyButton label="📋 Show list" getText={()=>buildDupesText(allDupesList)} />
        </div>
        {Object.values(byTeam).map(({teamName,code,items})=>(
          <div key={code} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              {FLAG_URLS[code] && <img src={`https://paniniwm2026sticker.com/flags/${FLAG_URLS[code]}.png`} alt="" style={{width:22,height:15,objectFit:"cover",borderRadius:2}} onError={e=>e.target.style.display="none"} />}
              <span style={{fontSize:13,fontWeight:700,color:T.white}}>{teamName}</span>
              <span style={{fontSize:11,color:T.muted,marginLeft:"auto"}}>{items.reduce((s,d)=>s+d.count,0)} dupes</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {items.map(({label,isFWC,isCC,count})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:5,background:isFWC?"rgba(245,197,24,0.12)":isCC?"rgba(244,0,9,0.12)":"rgba(0,193,138,0.12)",border:`1px solid ${isFWC?T.goldDim:isCC?"#F40009":T.greenDim}`}}>
                  <span style={{fontSize:11,fontWeight:700,color:isFWC?T.gold:isCC?"#FF6680":T.green}}>{label}</span>
                  <span style={{fontSize:10,fontWeight:700,background:T.green,color:T.navy,borderRadius:999,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>×{count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const isSearching = search.trim().length > 0;

  // ── Trade View ─────────────────────────────────────────────────────────────
  const TradeView = () => {
    const [addInput, setAddInput] = useState("");
    const [removeInput, setRemoveInput] = useState("");
    const [addResults, setAddResults] = useState(null);
    const [removeResults, setRemoveResults] = useState(null);

    const allStickers = useMemo(() => {
      const map = {};
      ALL_TEAMS.forEach(team => {
        buildStickers(team).forEach((s, i) => {
          map[s.label.toUpperCase()] = { code: team.code, teamName: team.name, idx: i, label: s.label };
        });
      });
      FWC_STICKERS.forEach((s, i) => { map[s.label.toUpperCase()] = { code: "FWC", teamName: "FWC Stickers", idx: i, label: s.label, isFWC: true }; });
      CC_STICKERS.forEach((s, i)  => { map[s.label.toUpperCase()] = { code: "CC",  teamName: "CC Stickers",  idx: i, label: s.label, isCC:  true }; });
      return map;
    }, []);

    function parseCodes(text) {
      return [...new Set((text.toUpperCase().match(/[A-Z]{2,4}\d{1,2}/g) || []))];
    }

    // BULK ADD — mark stickers as owned
    function handleBulkAdd() {
      const codes = parseCodes(addInput);
      const added = [], alreadyHad = [], notFound = [];

      // Collect all changes first
      const teamChanges = {};
      const fwcChanges = [...fwcOwned];
      const ccChanges = [...ccOwned];

      codes.forEach(code => {
        const sticker = allStickers[code];
        if (!sticker) { notFound.push(code); return; }

        if (sticker.isFWC) {
          if (fwcChanges[sticker.idx]) { alreadyHad.push(sticker); return; }
          fwcChanges[sticker.idx] = true;
          added.push(sticker);
        } else if (sticker.isCC) {
          if (ccChanges[sticker.idx]) { alreadyHad.push(sticker); return; }
          ccChanges[sticker.idx] = true;
          added.push(sticker);
        } else {
          if (!teamChanges[sticker.code]) teamChanges[sticker.code] = [...(owned[sticker.code] || [])];
          if (teamChanges[sticker.code][sticker.idx]) { alreadyHad.push(sticker); return; }
          teamChanges[sticker.code][sticker.idx] = true;
          added.push(sticker);
        }
      });

      // Apply all changes at once
      if (Object.keys(teamChanges).length > 0) {
        setOwned(prev => ({ ...prev, ...teamChanges }));
      }
      setFwcOwned(fwcChanges);
      setCcOwned(ccChanges);

      if (added.length > 0) showToast(`✓ Added ${added.length} sticker${added.length !== 1 ? "s" : ""}`, "success");
      setAddResults({ added, alreadyHad, notFound });
    }

    // BULK REMOVE — only removes 1 duplicate if available, otherwise unmarks
    function handleBulkRemove() {
      const codes = parseCodes(removeInput);
      const traded = [], removedDupe = [], notOwned = [], notFound = [];

      // Collect all changes first
      const teamOwnedChanges = {};
      const teamDupesChanges = {};
      const fwcOwnedChanges = [...fwcOwned];
      const fwcDupesChanges = [...fwcDupes];
      const ccOwnedChanges = [...ccOwned];
      const ccDupesChanges = [...ccDupes];

      codes.forEach(code => {
        const sticker = allStickers[code];
        if (!sticker) { notFound.push(code); return; }

        if (sticker.isFWC) {
          if (!fwcOwnedChanges[sticker.idx]) { notOwned.push(sticker); return; }
          const dupeCount = fwcDupesChanges[sticker.idx] || 0;
          if (dupeCount > 0) {
            fwcDupesChanges[sticker.idx] = dupeCount - 1;
            removedDupe.push({ ...sticker, wasCount: dupeCount, newCount: dupeCount - 1 });
          } else {
            fwcOwnedChanges[sticker.idx] = false;
            traded.push(sticker);
          }
        } else if (sticker.isCC) {
          if (!ccOwnedChanges[sticker.idx]) { notOwned.push(sticker); return; }
          const dupeCount = ccDupesChanges[sticker.idx] || 0;
          if (dupeCount > 0) {
            ccDupesChanges[sticker.idx] = dupeCount - 1;
            removedDupe.push({ ...sticker, wasCount: dupeCount, newCount: dupeCount - 1 });
          } else {
            ccOwnedChanges[sticker.idx] = false;
            traded.push(sticker);
          }
        } else {
          if (!teamOwnedChanges[sticker.code]) teamOwnedChanges[sticker.code] = [...(owned[sticker.code] || [])];
          if (!teamDupesChanges[sticker.code]) teamDupesChanges[sticker.code] = [...(dupes[sticker.code] || [])];
          if (!teamOwnedChanges[sticker.code][sticker.idx]) { notOwned.push(sticker); return; }
          const dupeCount = teamDupesChanges[sticker.code][sticker.idx] || 0;
          if (dupeCount > 0) {
            teamDupesChanges[sticker.code][sticker.idx] = dupeCount - 1;
            removedDupe.push({ ...sticker, wasCount: dupeCount, newCount: dupeCount - 1 });
          } else {
            teamOwnedChanges[sticker.code][sticker.idx] = false;
            teamDupesChanges[sticker.code][sticker.idx] = 0;
            traded.push(sticker);
          }
        }
      });

      // Apply all changes at once
      if (Object.keys(teamOwnedChanges).length > 0) setOwned(prev => ({ ...prev, ...teamOwnedChanges }));
      if (Object.keys(teamDupesChanges).length > 0) setDupes(prev => ({ ...prev, ...teamDupesChanges }));
      setFwcOwned(fwcOwnedChanges);
      setFwcDupes(fwcDupesChanges);
      setCcOwned(ccOwnedChanges);
      setCcDupes(ccDupesChanges);

      const total = traded.length + removedDupe.length;
      if (total > 0) showToast(`✕ Removed ${total} sticker${total !== 1 ? "s" : ""}`, "remove");
      setRemoveResults({ traded, removedDupe, notOwned, notFound });
    }

    const sectionStyle = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px" };
    const pillStyle = (bg, border, color) => ({ padding: "4px 10px", borderRadius: 5, background: bg, border: `1px solid ${border}`, display: "inline-flex", flexDirection: "column" });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* BULK ADD */}
        <div style={sectionStyle}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, color: T.green, letterSpacing: "0.08em", marginBottom: 4 }}>📥 STICKERS I RECEIVED</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>Paste sticker codes you got from a trade — they'll be marked as owned.</div>
          <textarea value={addInput} onChange={e => setAddInput(e.target.value)}
            placeholder="e.g. MEX1, BRA3, FWC2, CC1..."
            style={{ width: "100%", height: 100, fontSize: 12, fontFamily: "monospace", padding: 10, borderRadius: 6, border: `1px solid ${T.border}`, background: T.navy, color: T.white, resize: "vertical", outline: "none", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleBulkAdd} style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 700, borderRadius: 6, cursor: "pointer", border: "none", background: T.green, color: T.navy }}>✓ ADD STICKERS</button>
            <button onClick={() => { setAddInput(""); setAddResults(null); }} style={{ padding: "10px 14px", fontSize: 12, borderRadius: 6, cursor: "pointer", border: `1px solid ${T.border}`, background: T.navyLight, color: T.muted }}>Clear</button>
          </div>
          {addResults && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {addResults.added.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.green, marginBottom: 6 }}>✓ Added {addResults.added.length} sticker{addResults.added.length !== 1 ? "s" : ""}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {addResults.added.map(s => (
                      <div key={s.label} style={pillStyle("rgba(0,193,138,0.12)", T.greenDim, T.green)}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.green }}>{s.label}</span>
                        <span style={{ fontSize: 9, color: T.muted }}>{s.teamName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {addResults.alreadyHad.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, marginBottom: 6 }}>⚠ Already owned ({addResults.alreadyHad.length}) — not changed</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {addResults.alreadyHad.map(s => (
                      <div key={s.label} style={pillStyle("rgba(245,197,24,0.1)", T.goldDim, T.gold)}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.gold }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {addResults.notFound.length > 0 && (
                <div style={{ fontSize: 12, color: T.muted }}>? Not recognized: {addResults.notFound.join(", ")}</div>
              )}
            </div>
          )}
        </div>

        {/* BULK REMOVE */}
        <div style={sectionStyle}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, color: T.red, letterSpacing: "0.08em", marginBottom: 4 }}>📤 STICKERS I TRADED AWAY</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
            Paste sticker codes you gave away. If you have duplicates, <strong style={{ color: T.white }}>only 1 duplicate is removed</strong>. If you have no duplicates, the sticker is unmarked.
          </div>
          <textarea value={removeInput} onChange={e => setRemoveInput(e.target.value)}
            placeholder="e.g. MEX3, BRA7, FWC5..."
            style={{ width: "100%", height: 100, fontSize: 12, fontFamily: "monospace", padding: 10, borderRadius: 6, border: `1px solid ${T.border}`, background: T.navy, color: T.white, resize: "vertical", outline: "none", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleBulkRemove} style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 700, borderRadius: 6, cursor: "pointer", border: "none", background: T.red, color: T.white }}>✕ REMOVE STICKERS</button>
            <button onClick={() => { setRemoveInput(""); setRemoveResults(null); }} style={{ padding: "10px 14px", fontSize: 12, borderRadius: 6, cursor: "pointer", border: `1px solid ${T.border}`, background: T.navyLight, color: T.muted }}>Clear</button>
          </div>
          {removeResults && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {removeResults.removedDupe.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, marginBottom: 6 }}>− Removed 1 duplicate ({removeResults.removedDupe.length} sticker{removeResults.removedDupe.length !== 1 ? "s" : ""})</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {removeResults.removedDupe.map(s => (
                      <div key={s.label} style={pillStyle("rgba(245,197,24,0.1)", T.goldDim, T.gold)}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.gold }}>{s.label}</span>
                        <span style={{ fontSize: 9, color: T.muted }}>×{s.wasCount} → ×{s.newCount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {removeResults.traded.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6680", marginBottom: 6 }}>✕ Fully traded away ({removeResults.traded.length} sticker{removeResults.traded.length !== 1 ? "s" : ""})</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {removeResults.traded.map(s => (
                      <div key={s.label} style={pillStyle("rgba(200,16,46,0.15)", "#8B1020", "#FF6680")}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6680" }}>{s.label}</span>
                        <span style={{ fontSize: 9, color: T.muted }}>{s.teamName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {removeResults.notOwned.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 6 }}>⚠ Didn't have these — skipped</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {removeResults.notOwned.map(s => (
                      <div key={s.label} style={pillStyle(T.navyLight, T.border, T.muted)}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.muted }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {removeResults.notFound.length > 0 && (
                <div style={{ fontSize: 12, color: T.muted }}>? Not recognized: {removeResults.notFound.join(", ")}</div>
              )}
            </div>
          )}
        </div>

      </div>
    );
  };

  // ── Check List View ────────────────────────────────────────────────────────
  const CheckListView = () => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState(null);
    const imgRef = useRef(null);

    // Build a lookup of all sticker labels
    const allStickers = useMemo(() => {
      const map = {};
      ALL_TEAMS.forEach(team => {
        buildStickers(team).forEach((s, i) => {
          map[s.label.toUpperCase()] = { code: team.code, teamName: team.name, idx: i, label: s.label };
        });
      });
      FWC_STICKERS.forEach((s, i) => { map[s.label.toUpperCase()] = { code: "FWC", teamName: "FWC Stickers", idx: i, label: s.label, isFWC: true }; });
      CC_STICKERS.forEach((s, i)  => { map[s.label.toUpperCase()] = { code: "CC",  teamName: "CC Stickers",  idx: i, label: s.label, isCC:  true }; });
      return map;
    }, []);

    function parseAndCheck(text) {
      const matches = text.toUpperCase().match(/[A-Z]{2,4}\d{1,2}/g) || [];
      const need = [], dontNeed = [], notFound = [];
      const seen = new Set();
      matches.forEach(code => {
        if (seen.has(code)) return;
        seen.add(code);
        const sticker = allStickers[code];
        if (!sticker) { notFound.push(code); return; }
        const isOwned = sticker.isFWC
          ? fwcOwned[sticker.idx]
          : sticker.isCC
            ? ccOwned[sticker.idx]
            : owned[sticker.code]?.[sticker.idx];
        const dupeCount = sticker.isFWC
          ? fwcDupes[sticker.idx] || 0
          : sticker.isCC
            ? ccDupes[sticker.idx] || 0
            : dupes[sticker.code]?.[sticker.idx] || 0;
        if (!isOwned) need.push({ ...sticker, dupeCount: 0 });
        else dontNeed.push({ ...sticker, dupeCount });
      });
      setResults({ need, dontNeed, notFound, total: seen.size });
    }

    function handleCheck() {
      if (input.trim()) parseAndCheck(input);
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, color: T.gold, letterSpacing: "0.08em", marginBottom: 6 }}>CHECK A STICKER LIST</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
            Paste a list of sticker codes (e.g. from a friend's duplicates) and see which ones you still need.
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste sticker codes here e.g. MEX1, MEX5, BRA3, FWC1, CC2..."
            style={{
              width: "100%", height: 120, fontSize: 12, fontFamily: "monospace",
              padding: 10, borderRadius: 6, border: `1px solid ${T.border}`,
              background: T.navy, color: T.white, resize: "vertical", outline: "none",
              marginBottom: 10,
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleCheck} style={{
              flex: 1, padding: "10px", fontSize: 13, fontWeight: 700, borderRadius: 6, cursor: "pointer",
              border: "none", background: T.gold, color: T.navy, letterSpacing: "0.04em",
            }}>🔍 CHECK LIST</button>
            <button onClick={() => { setInput(""); setResults(null); }} style={{
              padding: "10px 16px", fontSize: 12, borderRadius: 6, cursor: "pointer",
              border: `1px solid ${T.border}`, background: T.navyLight, color: T.muted,
            }}>Clear</button>
          </div>
        </div>

        {results && (
          <>
            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { label: "You Need", value: results.need.length, color: T.red },
                { label: "Already Have", value: results.dontNeed.length, color: T.green },
                { label: "Not Found", value: results.notFound.length, color: T.muted },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: T.card, borderRadius: 10, padding: "10px 12px", border: `1px solid ${T.border}`, borderTop: `3px solid ${color}` }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Bebas Neue, sans-serif", color: T.white }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Stickers you need */}
            {results.need.length > 0 && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FF6680", marginBottom: 10 }}>✗ You need these ({results.need.length})</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {results.need.map(({ label, teamName, isFWC, isCC }) => (
                    <div key={label} style={{ padding: "4px 10px", borderRadius: 5, background: "rgba(200,16,46,0.15)", border: "1px solid #8B1020" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6680" }}>{label}</div>
                      <div style={{ fontSize: 9, color: T.muted }}>{teamName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stickers you already have */}
            {results.dontNeed.length > 0 && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>✓ You already have these ({results.dontNeed.length})</div>
                  {results.dontNeed.some(s => s.dupeCount > 0) && (
                    <CopyButton
                      label="📋 Copy tradeable"
                      getText={() => {
                        const tradeable = results.dontNeed.filter(s => s.dupeCount > 0);
                        const lines = ["TRADEABLE DUPLICATES FROM CHECKLIST", ""];
                        const byTeam = {};
                        tradeable.forEach(s => {
                          if (!byTeam[s.teamName]) byTeam[s.teamName] = [];
                          byTeam[s.teamName].push(`${s.label} ×${s.dupeCount}`);
                        });
                        Object.entries(byTeam).forEach(([team, items]) => {
                          lines.push(`${team}: ${items.join(", ")}`);
                        });
                        lines.push("", `Total tradeable: ${tradeable.length}`);
                        return lines.join("\n");
                      }}
                    />
                  )}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {results.dontNeed.map(({ label, teamName, dupeCount }) => (
                    <div key={label} style={{ padding: "4px 10px", borderRadius: 5, background: "rgba(0,193,138,0.12)", border: `1px solid ${T.greenDim}`, position: "relative" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.green }}>{label}</div>
                      <div style={{ fontSize: 9, color: T.muted }}>{teamName}</div>
                      {dupeCount > 0 && (
                        <div style={{
                          position: "absolute", top: -6, right: -6,
                          background: T.gold, color: T.navy,
                          fontSize: 9, fontWeight: 700,
                          borderRadius: 999, minWidth: 16, height: 16,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          padding: "0 4px",
                        }}>×{dupeCount}</div>
                      )}
                    </div>
                  ))}
                </div>
                {results.dontNeed.some(s => s.dupeCount > 0) && (
                  <div style={{ fontSize: 11, color: T.gold, marginTop: 10, fontWeight: 600 }}>
                    🌟 Gold badge = you have duplicates of that sticker you could trade!
                  </div>
                )}
              </div>
            )}

            {/* Not recognized */}
            {results.notFound.length > 0 && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, marginBottom: 10 }}>? Not recognized ({results.notFound.length})</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {results.notFound.map(label => (
                    <div key={label} style={{ padding: "4px 10px", borderRadius: 5, background: T.navyLight, border: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.need.length === 0 && results.dontNeed.length > 0 && (
              <div style={{ textAlign: "center", padding: "1rem", fontSize: 13, color: T.green, fontWeight: 600 }}>
                🎉 You already have all of these stickers!
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{css}</style>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          zIndex: 9999, whiteSpace: "nowrap",
          background: toast.type === "success" ? T.green : toast.type === "dupe" ? T.gold : T.red,
          color: toast.type === "dupe" ? T.navy : T.white,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          animation: "slideUp 0.2s ease",
        }}>
          {toast.message}
        </div>
      )}
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>

      <div style={{ fontFamily: "Inter, sans-serif", background: T.navy, minHeight: "100vh", padding: "1.25rem 1rem", maxWidth: 700, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #C8102E 0%, #8B0020 100%)", borderRadius: 14, padding: "18px 20px", marginBottom: 14, position: "relative", overflow: "hidden", boxShadow: "0 4px 24px rgba(200,16,46,0.35)" }}>
          <div style={{ position:"absolute",right:-30,top:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.06)" }} />
          <div style={{ position:"absolute",right:40,bottom:-40,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)" }} />
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative" }}>
            <div>
              <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.18em",color:"rgba(255,255,255,0.7)",textTransform:"uppercase",marginBottom:4 }}>Panini Official</div>
              <div style={{ fontFamily:"Bebas Neue, sans-serif",fontSize:26,letterSpacing:"0.06em",color:T.white,lineHeight:1 }}>FIFA WORLD CUP</div>
              <div style={{ fontFamily:"Bebas Neue, sans-serif",fontSize:26,letterSpacing:"0.06em",color:T.gold,lineHeight:1 }}>2026™ STICKER TRACKER</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:6 }}>USA · Canada · Mexico</div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6 }}>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.6)",opacity:saved?1:0,transition:"opacity 0.3s" }}>✓ Saved</div>
              <div style={{ display:"flex",gap:6 }}>
                <button onClick={handleExport} style={{ fontSize:10,padding:"5px 10px",borderRadius:5,border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.15)",color:T.white,cursor:"pointer",fontWeight:600 }}>⬇ Export</button>
                <button onClick={()=>importRef.current?.click()} style={{ fontSize:10,padding:"5px 10px",borderRadius:5,border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.15)",color:T.white,cursor:"pointer",fontWeight:600 }}>⬆ Import</button>
                <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display:"none" }} />
              </div>
            </div>
          </div>
        </div>

        {importMsg && (
          <div style={{ fontSize:12,padding:"8px 12px",borderRadius:6,marginBottom:10, background:importMsg.ok?"rgba(0,193,138,0.15)":"rgba(200,16,46,0.15)", color:importMsg.ok?T.green:"#FF6680", border:`1px solid ${importMsg.ok?T.greenDim:T.red}` }}>{importMsg.text}</div>
        )}

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12 }}>
          <StatCard label="Total"   value={TOTAL_STICKERS}            accent={T.muted} />
          <StatCard label="Owned"   value={totalOwned}                accent={T.green} />
          <StatCard label="Missing" value={TOTAL_STICKERS-totalOwned} accent={T.red} />
          <StatCard label="Dupes"   value={totalDupes}                accent={T.gold} />
        </div>

        {/* Progress */}
        <div style={{ background:T.card,borderRadius:10,padding:"12px 16px",marginBottom:12,border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:T.muted }}>Album Completion</span>
            <span style={{ fontFamily:"Bebas Neue, sans-serif",fontSize:20,color:pct===100?T.gold:T.white }}>{pct}%</span>
          </div>
          <div style={{ height:10,background:T.navyLight,borderRadius:999,overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${pct}%`,background:`linear-gradient(90deg, ${T.green}, ${T.gold})`,borderRadius:999,transition:"width 0.4s ease" }} />
          </div>
        </div>

        {/* Search */}
        <div style={{ position:"relative",marginBottom:12 }}>
          <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:T.muted,pointerEvents:"none" }}>🔍</span>
          <input type="text" placeholder="Search team name or code…" value={search} onChange={e=>{setSearch(e.target.value);setOpenTeam(null);}}
            style={{ width:"100%",padding:"9px 36px 9px 36px",fontSize:13,borderRadius:8,border:`1.5px solid ${isSearching?T.gold:T.border}`,background:T.card,color:T.white,fontFamily:"Inter, sans-serif" }} />
          {isSearching && <button onClick={()=>{setSearch("");setOpenTeam(null);}} style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.muted,padding:2,lineHeight:1 }}>×</button>}
        </div>

        {isSearching && (
          <div style={{ marginBottom:12 }}>
            {searchResults.length===0
              ? <div style={{fontSize:13,color:T.muted,padding:"1rem 0"}}>No teams found for "{search}".</div>
              : <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{fontSize:11,color:T.muted,marginBottom:2}}>{searchResults.length} result{searchResults.length!==1?"s":""}</div>
                  {searchResults.map(team=>(
                    <div key={team.code}>
                      <TeamCard {...team} />
                      {openTeam?.code===team.code && <StickerPanel {...team} />}
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {!isSearching && (
          <>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:12 }}>
              {[
                { key:"special",   label:"FWC & CC" },
                { key:"group",     label:"By Group" },
                { key:"team",      label:"By Team" },
                { key:"missing",   label:`Missing${TOTAL_STICKERS-totalOwned>0?` (${TOTAL_STICKERS-totalOwned})`:""}` },
                { key:"dupes",     label:`Dupes${totalDupes>0?` (${totalDupes})`:""}` },
                { key:"trade",     label:"🔄 Trade" },
                { key:"checklist", label:"📋 Check List" },
              ].map(({key,label})=>(
                <TabBtn key={key} active={view===key} onClick={()=>{setView(key);setOpenTeam(null);}}>{label}</TabBtn>
              ))}
            </div>

            {view==="special" && (
              <>
                <SpecialSection title="FWC STICKERS — Host Countries & Cities" color={T.gold}
                  stickers={FWC_STICKERS} ownedArr={fwcOwned} setOwnedArr={setFwcOwned} dupesArr={fwcDupes} setDupesArr={setFwcDupes} />
                <SpecialSection title="CC STICKERS — Coca-Cola" color="#F40009"
                  stickers={CC_STICKERS} ownedArr={ccOwned} setOwnedArr={setCcOwned} dupesArr={ccDupes} setDupesArr={setCcDupes} />
              </>
            )}

            {view==="group" && (
              <>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                  {groupKeys.map(g=>{
                    const o=groupOwned(g),t=groupTotal(g),active=selectedGroup===g;
                    return (
                      <button key={g} onClick={()=>{setSelectedGroup(g);setOpenTeam(null);}} style={{ padding:"5px 11px",fontSize:12,borderRadius:6,cursor:"pointer",fontWeight:700, border:active?`1.5px solid ${T.gold}`:`1px solid ${T.border}`, background:active?"rgba(245,197,24,0.15)":T.card, color:active?T.gold:T.muted }}>
                        {g} {o===t?"✓":`${o}/${t}`}
                      </button>
                    );
                  })}
                </div>
                {(()=>{
                  const o=groupOwned(selectedGroup),t=groupTotal(selectedGroup),p=Math.round(o/t*100);
                  return (
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <ProgressBar pct={p} color={o===t?T.gold:T.green} height={5} />
                      <span style={{fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>Group {selectedGroup}: {o}/{t} ({p}%)</span>
                    </div>
                  );
                })()}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {GROUPS[selectedGroup].map(team=>(
                    <div key={team.code}>
                      <TeamCard {...team} />
                      {openTeam?.code===team.code && <StickerPanel {...team} />}
                    </div>
                  ))}
                </div>
              </>
            )}

            {view==="team" && (
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {groupKeys.map(g=>(
                  <div key={g}>
                    <div style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",margin:"12px 0 6px",paddingLeft:2}}>— Group {g} —</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {GROUPS[g].map(team=>(
                        <div key={team.code}>
                          <TeamCard {...team} />
                          {openTeam?.code===team.code && <StickerPanel {...team} />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view==="missing" && <MissingView />}
            {view==="dupes"   && <DupesView />}
            {view==="trade"   && <TradeView />}
            {view==="checklist" && <CheckListView />}
          </>
        )}

        <div style={{textAlign:"center",marginTop:24,fontSize:10,color:T.navyLight}}>
          Panini FIFA World Cup 2026™ · Unofficial Tracker
        </div>
      </div>
    </>
  );
}
