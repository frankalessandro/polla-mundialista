import { readFileSync, writeFileSync } from 'fs';

let ts = readFileSync('src/data/participants.ts', 'utf-8');

// Swap matchId 31 and 32 scores for every participant
// Pattern: find each pair of consecutive lines matchId: 31 ... matchId: 32
// and swap their home/away values
let swapCount = 0;
ts = ts.replace(
  /(\{ matchId: 31, home: (\d+), away: (\d+) \})([\s\S]*?)(\{ matchId: 32, home: (\d+), away: (\d+) \})/g,
  (_, _31, h31, a31, between, _32, h32, a32) => {
    swapCount++;
    return `{ matchId: 31, home: ${h32}, away: ${a32} }${between}{ matchId: 32, home: ${h31}, away: ${a31} }`;
  }
);
console.log(`Swapped matchId 31 & 32 for ${swapCount} participants`);

// Fix Angelisa's additional corrections
// matchId 26: home 1, away 1 → home 1, away 0
// matchId 50: home 2, away 1 → home 2, away 0
// These replacements must be scoped to her block — use the surrounding context
const angelisaIdx = ts.indexOf('name: "Angelisa Hurtado"');
if (angelisaIdx === -1) throw new Error('Angelisa not found');

const blockStart = ts.lastIndexOf('{', angelisaIdx);
const blockEnd = ts.indexOf('\n  },\n', angelisaIdx) + 5;
let block = ts.slice(blockStart, blockEnd);

block = block.replace('{ matchId: 26, home: 1, away: 1 }', '{ matchId: 26, home: 1, away: 0 }');
block = block.replace('{ matchId: 50, home: 2, away: 1 }', '{ matchId: 50, home: 2, away: 0 }');

ts = ts.slice(0, blockStart) + block + ts.slice(blockEnd);

writeFileSync('src/data/participants.ts', ts, 'utf-8');
console.log('Done writing file');
