import type { Group, Match, Score } from '../data/matches.ts';
import type { Participant } from '../data/participants.ts';
import { buildStandings, scorePrediction } from './scoring.ts';

/**
 * Helpers de presentación puros (sin Astro) que adaptan el dominio a lo que
 * cada página necesita. Se mantienen testeables con `node:test`.
 */

/** Orden canónico de grupos para recorrer A..L de forma estable. */
const GROUP_ORDER: Group[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

/**
 * Agrupa los partidos por grupo (A..L), cada grupo ordenado por `id`.
 * Sólo incluye grupos que tengan al menos un partido.
 */
export function matchesByGroup(matches: Match[]): Map<Group, Match[]> {
  const result = new Map<Group, Match[]>();
  for (const group of GROUP_ORDER) {
    const ofGroup = matches
      .filter((m) => m.group === group)
      .sort((a, b) => a.id - b.id);
    if (ofGroup.length > 0) result.set(group, ofGroup);
  }
  return result;
}

export type DateBucket = { date: string; matches: Match[] };

/**
 * Agrupa los partidos por fecha (orden cronológico), cada día ordenado por
 * hora y, a igualdad de hora, por `id`.
 */
export function matchesByDate(matches: Match[]): DateBucket[] {
  const byDate = new Map<string, Match[]>();
  for (const match of matches) {
    const bucket = byDate.get(match.date);
    if (bucket) bucket.push(match);
    else byDate.set(match.date, [match]);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, ms]) => ({
      date,
      matches: ms.sort((a, b) => a.time.localeCompare(b.time) || a.id - b.id),
    }));
}

export type MatchPredictionRow = {
  participantId: number;
  name: string;
  home: number;
  away: number;
  /** Puntos obtenidos; `null` si el partido aún no se ha jugado. */
  points: number | null;
};

/**
 * Apuestas de todos los participantes para un partido concreto.
 * Si el partido ya tiene resultado, calcula los puntos de cada uno (orden
 * descendente por puntos); si no, conserva el orden de registro.
 */
export function predictionsForMatch(
  match: Match,
  participants: Participant[],
): MatchPredictionRow[] {
  const rows: MatchPredictionRow[] = [];
  for (const participant of participants) {
    const pred = participant.predictions.find((p) => p.matchId === match.id);
    if (!pred) continue;
    rows.push({
      participantId: participant.id,
      name: participant.name,
      home: pred.home,
      away: pred.away,
      points: match.result
        ? scorePrediction(pred.home, pred.away, match.result.home, match.result.away)
        : null,
    });
  }

  if (match.result) rows.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  return rows;
}

export type MatchImpact = { rank: number; change: number };

/**
 * Para un partido ya jugado, compara la clasificación con y sin ese partido
 * para determinar en qué puesto queda cada participante y cuántos puestos ganó/perdió.
 * `change` positivo = subió puestos; negativo = bajó.
 */
export function standingsImpactForMatch(
  matchId: number,
  matches: Match[],
  participants: Participant[],
): Map<number, MatchImpact> {
  const withMatch = buildStandings(matches, participants);
  const withoutMatch = buildStandings(
    matches.map((m) => (m.id === matchId ? { ...m, result: null } : m)),
    participants,
  );

  const prevRanks = new Map(withoutMatch.map((row, i) => [row.participantId, i + 1]));

  return new Map(
    withMatch.map((row, i) => {
      const rank = i + 1;
      const prev = prevRanks.get(row.participantId) ?? rank;
      return [row.participantId, { rank, change: prev - rank }];
    }),
  );
}

/**
 * Historia de posición de un participante partido a partido (orden cronológico).
 * Para cada partido jugado calcula el puesto acumulado hasta ese momento y
 * cuántas posiciones ganó/perdió respecto al partido anterior.
 * `change` positivo = subió; negativo = bajó; 0 = igual.
 */
export function participantPositionHistory(
  participantId: number,
  matches: Match[],
  participants: Participant[],
): Map<number, MatchImpact> {
  const played = matches
    .filter((m) => m.result !== null)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.time.localeCompare(b.time) ||
        a.id - b.id,
    );

  // Posición inicial antes de cualquier partido (orden de registro, todos a 0)
  const blank = matches.map((m) => ({ ...m, result: null as Match['result'] }));
  let prevRank =
    buildStandings(blank, participants).findIndex(
      (r) => r.participantId === participantId,
    ) + 1;

  const playedSet = new Set<number>();
  const result = new Map<number, MatchImpact>();

  for (const match of played) {
    playedSet.add(match.id);
    const partial = matches.map((m) =>
      playedSet.has(m.id) ? m : { ...m, result: null as Match['result'] },
    );
    const rank =
      buildStandings(partial, participants).findIndex(
        (r) => r.participantId === participantId,
      ) + 1;
    result.set(match.id, { rank, change: prevRank - rank });
    prevRank = rank;
  }

  return result;
}

export type BreakdownRow = {
  match: Match;
  prediction: Score;
  /** Marcador real, o `null` si el partido todavía no se ha jugado. */
  result: Score | null;
  /** Puntos obtenidos, o `null` mientras el partido no se haya jugado. */
  points: number | null;
};

/**
 * Desglose de un participante: TODAS sus apuestas (incluidos los partidos que
 * todavía no se han jugado), con la predicción, el marcador real —o `null` si
 * no se ha jugado— y los puntos obtenidos —`null` mientras no se juegue—.
 * Ordenado cronológicamente.
 */
export function breakdownForParticipant(
  participantId: number,
  matches: Match[],
  participants: Participant[],
): BreakdownRow[] {
  const participant = participants.find((p) => p.id === participantId);
  if (!participant) return [];

  const rows: BreakdownRow[] = [];
  for (const match of matches) {
    const pred = participant.predictions.find((p) => p.matchId === match.id);
    if (!pred) continue; // el participante no apostó este partido
    rows.push({
      match,
      prediction: { home: pred.home, away: pred.away },
      result: match.result,
      points: match.result
        ? scorePrediction(pred.home, pred.away, match.result.home, match.result.away)
        : null,
    });
  }

  return rows.sort(
    (a, b) =>
      a.match.date.localeCompare(b.match.date) ||
      a.match.time.localeCompare(b.match.time) ||
      a.match.id - b.match.id,
  );
}
