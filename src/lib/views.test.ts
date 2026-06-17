import test from 'node:test';
import assert from 'node:assert/strict';
import {
  matchesByGroup,
  matchesByDate,
  predictionsForMatch,
  breakdownForParticipant,
} from './views.ts';
import type { Match } from '../data/matches.ts';
import type { Participant } from '../data/participants.ts';

const mk = (over: Partial<Match> & Pick<Match, 'id'>): Match => ({
  group: 'A',
  date: '2026-06-11',
  time: '14:00',
  home: 'X',
  away: 'Y',
  stadium: '',
  result: null,
  ...over,
});

test('matchesByGroup agrupa por grupo y ordena por id', () => {
  const matches = [mk({ id: 3, group: 'B' }), mk({ id: 1, group: 'A' }), mk({ id: 2, group: 'A' })];
  const byGroup = matchesByGroup(matches);
  assert.deepEqual([...byGroup.keys()], ['A', 'B']); // orden canónico A..L
  assert.deepEqual(byGroup.get('A')!.map((m) => m.id), [1, 2]);
  assert.deepEqual(byGroup.get('B')!.map((m) => m.id), [3]);
});

test('matchesByDate ordena días y, dentro, por hora', () => {
  const matches = [
    mk({ id: 1, date: '2026-06-12', time: '20:00' }),
    mk({ id: 2, date: '2026-06-11', time: '21:00' }),
    mk({ id: 3, date: '2026-06-11', time: '14:00' }),
  ];
  const buckets = matchesByDate(matches);
  assert.deepEqual(buckets.map((b) => b.date), ['2026-06-11', '2026-06-12']);
  assert.deepEqual(buckets[0].matches.map((m) => m.id), [3, 2]); // 14:00 antes que 21:00
});

const participants: Participant[] = [
  { id: 1, name: 'Ana', predictions: [{ matchId: 1, home: 2, away: 1 }] },
  { id: 2, name: 'Beto', predictions: [{ matchId: 1, home: 1, away: 0 }] },
];

test('predictionsForMatch sin resultado → points null y orden de registro', () => {
  const rows = predictionsForMatch(mk({ id: 1 }), participants);
  assert.deepEqual(rows.map((r) => r.name), ['Ana', 'Beto']);
  assert.deepEqual(rows.map((r) => r.points), [null, null]);
});

test('predictionsForMatch con resultado → calcula y ordena por puntos desc', () => {
  // real 2-1: Ana acierta exacto (5), Beto acierta sólo resultado (2).
  const rows = predictionsForMatch(mk({ id: 1, result: { home: 2, away: 1 } }), participants);
  assert.deepEqual(rows.map((r) => r.name), ['Ana', 'Beto']);
  assert.deepEqual(rows.map((r) => r.points), [5, 2]);
});

test('breakdownForParticipant incluye TODAS las apuestas, jugadas o no', () => {
  const matches = [
    mk({ id: 1, date: '2026-06-11', result: { home: 2, away: 1 } }),
    mk({ id: 2, date: '2026-06-12', result: null }), // no jugado → result/points null
  ];
  const ana: Participant[] = [
    {
      id: 1,
      name: 'Ana',
      predictions: [
        { matchId: 1, home: 2, away: 1 },
        { matchId: 2, home: 0, away: 0 },
      ],
    },
  ];
  const rows = breakdownForParticipant(1, matches, ana);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map((r) => r.match.id), [1, 2]); // cronológico
  // Jugado: resultado y puntos presentes.
  assert.deepEqual(rows[0].result, { home: 2, away: 1 });
  assert.equal(rows[0].points, 5);
  // No jugado: resultado y puntos en null.
  assert.equal(rows[1].result, null);
  assert.equal(rows[1].points, null);
});
