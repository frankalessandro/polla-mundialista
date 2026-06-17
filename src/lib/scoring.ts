import type { Match, Score } from '../data/matches';
import type { Participant, Prediction } from '../data/participants';

/** Signo de la diferencia de goles: 1 local gana, -1 visitante gana, 0 empate. */
const sign = (diff: number): -1 | 0 | 1 => (diff > 0 ? 1 : diff < 0 ? -1 : 0);

/**
 * Función pura de puntaje de una predicción contra un marcador real.
 *
 * Reglas (replican el Excel original, corregidas):
 *  - Marcador EXACTO (ambos goles iguales)           → 5 puntos.
 *  - Si no es exacto:
 *      · acertar el RESULTADO (mismo signo local-vis,
 *        incluido 0-0 vs 0-0)                          → 2 puntos.
 *      · acertar los goles de AL MENOS UN equipo       → +1 punto.
 *    (ambos sumandos son independientes: 0 / 1 / 2 / 3 posibles)
 *
 * No contempla "partido no jugado": eso se decide a nivel de datos
 * (marcador real ausente) en {@link buildStandings}, no en esta función.
 */
export function scorePrediction(
  predHome: number,
  predAway: number,
  realHome: number,
  realAway: number,
): number {
  // Marcador exacto.
  if (predHome === realHome && predAway === realAway) return 5;

  let points = 0;

  // Acertó el resultado (ganador/empate).
  if (sign(predHome - predAway) === sign(realHome - realAway)) points += 2;

  // Acertó los goles de al menos un equipo.
  if (predHome === realHome || predAway === realAway) points += 1;

  return points;
}

/** Variante por conveniencia que recibe los objetos `Score`. */
export function scorePredictionScores(prediction: Score, real: Score): number {
  return scorePrediction(prediction.home, prediction.away, real.home, real.away);
}

export type StandingRow = {
  participantId: number;
  name: string;
  /** Suma de puntos sobre todos los partidos jugados. */
  total: number;
  /** Cuántas veces acertó el marcador exacto (5 puntos). */
  exactScores: number;
  /**
   * Cuántas veces acertó el resultado pero no el marcador exacto
   * (puntaje 2 o 3). Métrica corregida: NO replica el bug del Excel
   * que filtraba por puntaje == 3 a secas.
   */
  correctOutcomes: number;
  /** Partidos ya jugados que se contabilizaron (resultado disponible). */
  played: number;
};

/** Indexa los marcadores reales disponibles por id de partido. */
function buildResultsMap(matches: Match[]): Map<number, Score> {
  const map = new Map<number, Score>();
  for (const match of matches) {
    if (match.result) map.set(match.id, match.result);
  }
  return map;
}

/** Puntaje de un participante recorriendo solo los partidos ya jugados. */
function scoreParticipant(
  participant: Participant,
  results: Map<number, Score>,
): StandingRow {
  let total = 0;
  let exactScores = 0;
  let correctOutcomes = 0;
  let played = 0;

  for (const pred of participant.predictions) {
    const real = results.get(pred.matchId);
    if (!real) continue; // partido no jugado → 0 puntos, no se cuenta.

    played += 1;
    const points = scorePrediction(pred.home, pred.away, real.home, real.away);
    total += points;
    if (points === 5) exactScores += 1;
    else if (points === 2 || points === 3) correctOutcomes += 1;
  }

  return {
    participantId: participant.id,
    name: participant.name,
    total,
    exactScores,
    correctOutcomes,
    played,
  };
}

/**
 * Tabla de clasificación ordenada de mayor a menor puntaje.
 * Los empates conservan el orden de registro (sort estable de JS).
 */
export function buildStandings(
  matches: Match[],
  participants: Participant[],
): StandingRow[] {
  const results = buildResultsMap(matches);
  return participants
    .map((p) => scoreParticipant(p, results))
    .sort((a, b) => b.total - a.total);
}

export type { Prediction };
