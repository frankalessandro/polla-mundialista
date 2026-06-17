import { matches } from '../data/matches.ts';
import type { Match } from '../data/matches.ts';

/**
 * Fuente única de partidos para toda la UI.
 *
 * Hoy devuelve los datos estáticos de {@link matches}. Cuando llegue la API de
 * resultados, sólo este archivo cambia (un `fetch` aquí dentro): las páginas y
 * el scoring no se enteran. Por eso es `async`, para que la firma ya soporte
 * una fuente remota sin reescribir los llamadores.
 */
export async function getMatches(): Promise<Match[]> {
  return matches;
}
