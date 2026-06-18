import test from 'node:test';
import assert from 'node:assert/strict';
import { scorePrediction, buildStandings } from './scoring.ts';
import type { Match } from '../data/matches';
import type { Participant } from '../data/participants';

test('marcador exacto → 5 puntos', () => {
  // Ejemplo del enunciado: real 2-1, predicción 2-1.
  assert.equal(scorePrediction(2, 1, 2, 1), 5);
});

test('acierta resultado + un equipo → 3 puntos', () => {
  // real 2-1, predicción 3-1: ganó el local (+2) y acertó goles del visitante (+1).
  assert.equal(scorePrediction(3, 1, 2, 1), 3);
});

test('acierta solo el resultado → 2 puntos', () => {
  // real 2-1, predicción 1-0: ganó el local, ningún marcador individual.
  assert.equal(scorePrediction(1, 0, 2, 1), 2);
});

test('no acierta nada → 0 puntos', () => {
  // real 2-1, predicción 0-0: resultado distinto y ningún marcador individual.
  assert.equal(scorePrediction(0, 0, 2, 1), 0);
});

test('empate exacto 0-0 vs 0-0 → 5 puntos', () => {
  assert.equal(scorePrediction(0, 0, 0, 0), 5);
});

test('empate con resultado correcto pero distinto marcador → 2 puntos', () => {
  // real 0-0, predicción 1-1: empate (+2), ningún goleador exacto.
  assert.equal(scorePrediction(1, 1, 0, 0), 2);
});

test('marcador individual sin acertar resultado → 1 punto', () => {
  // real 0-0, predicción 0-1: no es empate en la predicción, pero local 0 == 0.
  assert.equal(scorePrediction(0, 1, 0, 0), 1);
});

test('acierta un equipo con resultado equivocado → 1 punto', () => {
  // real 2-2 (empate), predicción 2-3 (gana visitante): local 2==2 → +1, sin +2.
  assert.equal(scorePrediction(2, 3, 2, 2), 1);
});

test('resultado correcto + un marcador exacto → 3 puntos', () => {
  // real 3-1, predicción 2-1: gana local en ambos (+2) y visitante 1==1 (+1) = 3.
  assert.equal(scorePrediction(2, 1, 3, 1), 3);
});

test('predicción invertida del marcador → 0 puntos', () => {
  // real 2-1, predicción 1-2: resultado opuesto, ningún goleador coincide.
  assert.equal(scorePrediction(1, 2, 2, 1), 0);
});

test('buildStandings ordena por total y cuenta exactos', () => {
  const matches: Match[] = [
    { id: 1, group: 'A', date: '', time: '', home: 'X', away: 'Y', stadium: '', result: { home: 2, away: 1 } },
    { id: 2, group: 'A', date: '', time: '', home: 'Z', away: 'W', stadium: '', result: { home: 0, away: 0 } },
    { id: 3, group: 'A', date: '', time: '', home: 'P', away: 'Q', stadium: '', result: null }, // no jugado
  ];
  const participants: Participant[] = [
    {
      id: 10,
      name: 'Ana',
      predictions: [
        { matchId: 1, home: 2, away: 1 }, // 5
        { matchId: 2, home: 1, away: 1 }, // 2
        { matchId: 3, home: 9, away: 9 }, // no jugado → 0
      ],
    },
    {
      id: 20,
      name: 'Beto',
      predictions: [
        { matchId: 1, home: 3, away: 1 }, // 3
        { matchId: 2, home: 0, away: 0 }, // 5
        { matchId: 3, home: 1, away: 0 }, // no jugado → 0
      ],
    },
  ];

  const table = buildStandings(matches, participants);

  // Ana 7, Beto 8 → Beto primero.
  assert.deepEqual(table.map((r) => r.name), ['Beto', 'Ana']);
  assert.equal(table[0].total, 8);
  assert.equal(table[1].total, 7);

  const ana = table.find((r) => r.name === 'Ana')!;
  assert.equal(ana.exactScores, 1);
  assert.equal(ana.twoPointHits, 1); // el partido de 2 puntos
  assert.equal(ana.played, 2); // el no jugado no cuenta
});

test('buildStandings: empate de puntos conserva el orden de registro', () => {
  const matches: Match[] = [
    { id: 1, group: 'A', date: '', time: '', home: 'X', away: 'Y', stadium: '', result: { home: 1, away: 0 } },
  ];
  const participants: Participant[] = [
    { id: 1, name: 'Primero', predictions: [{ matchId: 1, home: 1, away: 0 }] },
    { id: 2, name: 'Segundo', predictions: [{ matchId: 1, home: 2, away: 0 }] },
  ];
  // Primero saca 5, Segundo saca 2 → distinto; forcemos empate:
  participants[1].predictions[0] = { matchId: 1, home: 1, away: 0 };
  const table = buildStandings(matches, participants);
  assert.deepEqual(table.map((r) => r.name), ['Primero', 'Segundo']);
});
