import type { Score } from '../data/matches.ts';

/**
 * Cliente de TheSportsDB para los marcadores del Mundial 2026.
 *
 * Liga "FIFA World Cup" = id 4429, temporada "2026". La fase de grupos son las
 * rondas 1, 2 y 3 (24 partidos cada una). El endpoint por temporada está
 * limitado en el plan gratuito, así que pedimos las tres rondas por separado
 * (`eventsround.php`), que sí devuelven los 72 completos.
 *
 * La API entrega los nombres de equipo en inglés; aquí los traducimos al
 * español que usa `src/data/matches.ts` para poder casar cada evento con
 * nuestro fixture.
 */

const LEAGUE_ID = 4429;
const SEASON = '2026';
const ROUNDS = [1, 2, 3];
// La clave de prueba "123" es pública; se puede sobreescribir por entorno.
// `import.meta.env` solo existe bajo Astro/Vite; fuera de ahí caemos a `process.env`.
const API_KEY = import.meta.env?.SPORTSDB_KEY ?? process.env.SPORTSDB_KEY ?? '123';
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

/** Nombre en inglés (TheSportsDB) → nombre en español (nuestro fixture). */
const TEAM_ES: Record<string, string> = {
  Algeria: 'Argelia',
  Argentina: 'Argentina',
  Australia: 'Australia',
  Austria: 'Austria',
  Belgium: 'Bélgica',
  'Bosnia-Herzegovina': 'Bosnia y Herzeg.',
  Brazil: 'Brasil',
  Canada: 'Canadá',
  'Cape Verde': 'Cabo Verde',
  Colombia: 'Colombia',
  Croatia: 'Croacia',
  Curaçao: 'Curazao',
  'Czech Republic': 'Rep. Checa',
  'DR Congo': 'Rep. del Congo',
  Ecuador: 'Ecuador',
  Egypt: 'Egipto',
  England: 'Inglaterra',
  France: 'Francia',
  Germany: 'Alemania',
  Ghana: 'Ghana',
  Haiti: 'Haití',
  Iran: 'Irán',
  Iraq: 'Irak',
  'Ivory Coast': 'Costa de Marfil',
  Japan: 'Japón',
  Jordan: 'Jordania',
  Mexico: 'México',
  Morocco: 'Marruecos',
  Netherlands: 'Países Bajos',
  'New Zealand': 'Nueva Zelanda',
  Norway: 'Noruega',
  Panama: 'Panamá',
  Paraguay: 'Paraguay',
  Portugal: 'Portugal',
  Qatar: 'Catar',
  'Saudi Arabia': 'Arabia Saudita',
  Scotland: 'Escocia',
  Senegal: 'Senegal',
  'South Africa': 'Sudáfrica',
  'South Korea': 'Corea del Sur',
  Spain: 'España',
  Sweden: 'Suecia',
  Switzerland: 'Suiza',
  Tunisia: 'Túnez',
  Turkey: 'Turquía',
  USA: 'Estados Unidos',
  Uruguay: 'Uruguay',
  Uzbekistan: 'Uzbekistán',
};

type SportsDbEvent = {
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
};

/** Estados de TheSportsDB que indican un partido ya terminado. */
const FINISHED = new Set(['FT', 'AET', 'PEN', 'Match Finished']);

/** Estados que indican un partido EN JUEGO (marcador parcial, puntos variables). */
const LIVE = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INPLAY']);

type SportsDbResponse = { events: SportsDbEvent[] | null };

/** Clave de unión independiente del orden local/visitante. */
function pairKey(a: string, b: string): string {
  return [a, b].sort().join(' | ');
}

export type ResultEntry = { home: string; score: Score; live: boolean };

/**
 * Descarga las tres rondas y devuelve un mapa `pairKey -> { home, score }`
 * solo con los partidos que ya tienen ambos marcadores. La descarga se
 * memoiza para no repetir las peticiones por cada página del build.
 */
let cache: Promise<Map<string, ResultEntry>> | null = null;

export function fetchResults(): Promise<Map<string, ResultEntry>> {
  cache ??= load();
  return cache;
}

async function load(): Promise<Map<string, ResultEntry>> {
  const results = new Map<string, ResultEntry>();

  const responses = await Promise.all(
    ROUNDS.map(async (r) => {
      const res = await fetch(`${BASE}/eventsround.php?id=${LEAGUE_ID}&s=${SEASON}&r=${r}`);
      if (!res.ok) throw new Error(`TheSportsDB HTTP ${res.status} (ronda ${r})`);
      return (await res.json()) as SportsDbResponse;
    }),
  );

  for (const { events } of responses) {
    for (const e of events ?? []) {
      const status = e.strStatus ?? '';
      const finished = FINISHED.has(status);
      const live = !finished && LIVE.has(status);
      // Solo nos interesan partidos terminados o en juego; los no empezados
      // (NS), aplazados o cancelados se ignoran.
      if (!finished && !live) continue;
      if (e.intHomeScore === null || e.intAwayScore === null) continue;
      const home = TEAM_ES[e.strHomeTeam];
      const away = TEAM_ES[e.strAwayTeam];
      if (!home || !away) continue; // equipo no reconocido → se ignora
      results.set(pairKey(home, away), {
        home,
        score: { home: Number(e.intHomeScore), away: Number(e.intAwayScore) },
        live,
      });
    }
  }

  return results;
}

export { pairKey };
