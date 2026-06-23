import { matches } from '../data/matches.ts';
import type { Match } from '../types.ts';
import { fetchResults, pairKey } from './sportsdb.ts';

/**
 * Fuente única de partidos para toda la UI.
 *
 * El fixture (id, grupo, estadio, fecha/hora) sale del archivo estático
 * {@link matches}; los MARCADORES se traen de TheSportsDB en tiempo de build y
 * se superponen sobre cada partido casando por el par de equipos. Si la API
 * falla, devolvemos el fixture con `result: null` para que el sitio siempre
 * compile.
 *
 * La promesa se memoiza para que múltiples llamadas dentro del mismo proceso
 * de build compartan una sola petición a la API.
 */
let _cached: Promise<Match[]> | null = null;

export function getMatches(): Promise<Match[]> {
  if (!_cached) _cached = resolveMatches();
  return _cached;
}

async function resolveMatches(): Promise<Match[]> {
  let results: Awaited<ReturnType<typeof fetchResults>>;
  try {
    results = await fetchResults();
  } catch (err) {
    console.warn('[matchSource] No se pudieron cargar resultados de la API:', err);
    return matches;
  }

  return matches.map((match) => {
    const entry = results.get(pairKey(match.home, match.away));
    if (!entry) return match;

    // La API puede traer el partido con local/visitante invertidos respecto a
    // nuestro fixture; alineamos el marcador a nuestra orientación.
    const result =
      entry.home === match.home
        ? entry.score
        : { home: entry.score.away, away: entry.score.home };

    // Tanto los partidos finalizados como los EN VIVO llevan marcador y por
    // tanto puntúan; el flag `live` marca que ese puntaje es provisional.
    return { ...match, result, live: entry.live };
  });
}
