import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
import { readFileSync } from 'fs';

// ─── Parse Excel ────────────────────────────────────────────────────────────
const wb = XLSX.readFile('src/data/POLLA MUNDIALISTA 2026.xlsx');
const sheet = wb.Sheets['Polla - Grupos'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// Row index 6 = column headers; participants start at col index 3
const headerRow = data[6];
const participantNames = headerRow.slice(3).map(s => String(s).trim()).filter(s => s !== '');

// Rows 7+ come in pairs: home team row (has match id in col 0), away team row
const excelPredictions = {}; // matchId -> { participantName -> {home, away} }
let pendingMatchId = null;
let pendingHomeRow = null;

for (let i = 7; i < data.length; i++) {
  const row = data[i];
  const col0 = row[0];
  const col1 = String(row[1]).trim();
  // Skip group header / blank rows
  if (col1 === '' && col0 === '') continue;

  if (col0 !== '' && typeof col0 === 'number') {
    // Home team row
    pendingMatchId = col0;
    pendingHomeRow = row;
  } else if (pendingMatchId !== null && pendingHomeRow !== null) {
    // Away team row
    const awayRow = row;
    excelPredictions[pendingMatchId] = {};
    for (let p = 0; p < participantNames.length; p++) {
      const name = participantNames[p];
      excelPredictions[pendingMatchId][name] = {
        home: Number(pendingHomeRow[p + 3]) || 0,
        away: Number(awayRow[p + 3]) || 0,
      };
    }
    pendingMatchId = null;
    pendingHomeRow = null;
  }
}

const matchIds = Object.keys(excelPredictions).map(Number).sort((a, b) => a - b);
console.log(`Excel: ${matchIds.length} matches, ${participantNames.length} participants`);

// ─── Parse participants.ts ───────────────────────────────────────────────────
const tsText = readFileSync('src/data/participants.ts', 'utf-8');

// Split by participant blocks using id: N as delimiter
const tsParticipants = [];
// Match each { id: N, name: "...", predictions: [...] }
// Use a two-pass approach: find each id line, then extract name and predictions
const blocks = tsText.split(/(?=\{\s*\n\s*id:\s*\d+,)/);

for (const block of blocks) {
  const idMatch = block.match(/id:\s*(\d+)/);
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  if (!idMatch || !nameMatch) continue;

  const id = parseInt(idMatch[1]);
  const name = nameMatch[1];
  const predictions = {};

  const predRegex = /\{\s*matchId:\s*(\d+),\s*home:\s*(\d+),\s*away:\s*(\d+)\s*\}/g;
  let pr;
  while ((pr = predRegex.exec(block)) !== null) {
    predictions[parseInt(pr[1])] = { home: parseInt(pr[2]), away: parseInt(pr[3]) };
  }

  tsParticipants.push({ id, name, predictions });
}

console.log(`TS: ${tsParticipants.length} participants`);

// ─── Name matching ───────────────────────────────────────────────────────────
function findExcelName(tsName) {
  const norm = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const tn = norm(tsName);
  let best = participantNames.find(n => norm(n) === tn);
  if (!best) {
    best = participantNames.find(n => norm(n).includes(tn) || tn.includes(norm(n)));
  }
  return best ?? null;
}

// ─── Compare ─────────────────────────────────────────────────────────────────
const differences = [];

for (const tsPart of tsParticipants) {
  const excelName = findExcelName(tsPart.name);

  if (!excelName) {
    differences.push({ participant: tsPart.name, issue: 'NO ENCONTRADO EN EXCEL' });
    continue;
  }

  const partDiffs = [];
  for (const matchId of matchIds) {
    const ep = excelPredictions[matchId]?.[excelName];
    const tp = tsPart.predictions[matchId];
    if (!ep || !tp) continue;
    if (ep.home !== tp.home || ep.away !== tp.away) {
      partDiffs.push({ matchId, excel: `${ep.home}-${ep.away}`, ts: `${tp.home}-${tp.away}` });
    }
  }

  if (partDiffs.length > 0) {
    differences.push({ participant: tsPart.name, excelName, diffs: partDiffs });
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────
const notFound = differences.filter(d => d.issue);
const withDiffs = differences.filter(d => d.diffs);

if (notFound.length > 0) {
  console.log(`\n⚠️  Participantes en TS sin match en Excel (${notFound.length}):`);
  for (const d of notFound) console.log(`  - ${d.participant}`);
}

if (withDiffs.length === 0) {
  console.log('\n✅ Sin diferencias en los partidos encontrados.');
} else {
  console.log(`\n❌ Diferencias encontradas en ${withDiffs.length} participantes:\n`);
  for (const d of withDiffs) {
    console.log(`  ${d.participant}:`);
    for (const diff of d.diffs) {
      console.log(`    Partido #${diff.matchId}: Excel=${diff.excel}  TS=${diff.ts}`);
    }
  }
}
