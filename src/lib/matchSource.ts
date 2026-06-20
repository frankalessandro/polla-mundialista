import { matches } from '../data/matches.ts';
import type { Match } from '../data/matches.ts';
import { fetchResults, pairKey } from './sportsdb.ts';

/**
 * Fuente única de partidos para toda la UI.
 *
 * El fixture base (id, grupo, equipos) viene de {@link matches}; fecha, hora,
 * estadio y marcadores se traen de TheSportsDB en tiempo de build. Si la API
 * falla, los campos de fixture quedan vacíos pero el sitio compila.
 */
export async function getMatches(): Promise<Match[]> {
  let results: Awaited<ReturnType<typeof fetchResults>>;
  try {
    results = await fetchResults();
  } catch (err) {
    console.warn('[matchSource] No se pudieron cargar datos de la API:', err);
    return matches.map((m) => ({ ...m, date: '', time: '', stadium: '', result: null }));
  }

  return matches.map((match) => {
    const entry = results.get(pairKey(match.home, match.away));

    if (!entry) {
      console.warn(`[matchSource] Sin datos de API para: ${match.home} vs ${match.away}`);
    }

    const date = entry?.date ?? '';
    const time = entry?.time ?? '';
    const stadium = entry?.venue ?? '';

    let result: Match['result'] = null;
    let live = false;

    if (entry?.score !== null && entry?.score !== undefined) {
      // La API puede traer local/visitante invertidos; alineamos al fixture.
      result = entry.home === match.home
        ? entry.score
        : { home: entry.score.away, away: entry.score.home };
      live = entry.live;
    }

    return { ...match, date, time, stadium, result, live };
  });
}
