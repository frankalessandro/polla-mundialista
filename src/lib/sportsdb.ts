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
  strLeagueBadge: string | null;
  strDate: string | null;   // "2026-06-19" UTC
  strTime: string | null;   // "19:00:00" UTC
  strVenue: string | null;
};

/** Logo del Mundial: se captura del payload; este valor sirve de respaldo. */
const FALLBACK_LEAGUE_BADGE =
  'https://r2.thesportsdb.com/images/media/league/badge/e7er5g1696521789.png';
let leagueBadge: string | null = null;

/** URL del logo de la liga (FIFA World Cup). Memoizado vía {@link fetchResults}. */
export async function getLeagueBadge(): Promise<string> {
  try {
    await fetchResults();
  } catch {
    /* si la API falla usamos el respaldo */
  }
  return leagueBadge ?? FALLBACK_LEAGUE_BADGE;
}

/** Estados de TheSportsDB que indican un partido ya terminado. */
const FINISHED = new Set(['FT', 'AET', 'PEN', 'Match Finished']);

/** Estados que indican un partido EN JUEGO (marcador parcial, puntos variables). */
const LIVE = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INPLAY']);

type SportsDbResponse = { events: SportsDbEvent[] | null };

/** Clave de unión independiente del orden local/visitante. */
function pairKey(a: string, b: string): string {
  return [a, b].sort().join(' | ');
}

export type ResultEntry = {
  home: string;
  /** `null` si el partido aún no ha empezado (solo hay datos de fixture). */
  score: Score | null;
  live: boolean;
  /** Fecha en COT (UTC-5), formato "YYYY-MM-DD". */
  date?: string;
  /** Hora en COT (UTC-5), formato "HH:MM". */
  time?: string;
  /** Estadio tal como devuelve la API. */
  venue?: string;
};

/** Convierte fecha+hora UTC a COT (UTC-5). */
function utcToCot(dateStr: string, timeStr: string): { date: string; time: string } {
  const [h, m] = timeStr.split(':').map(Number);
  const [y, mo, d] = dateStr.split('-').map(Number);
  let cotH = h - 5;
  let day = d;
  let month = mo;
  let year = y;
  if (cotH < 0) {
    cotH += 24;
    // retroceder un día
    const dt = new Date(y, mo - 1, d - 1);
    year = dt.getFullYear();
    month = dt.getMonth() + 1;
    day = dt.getDate();
  }
  const p = (n: number) => String(n).padStart(2, '0');
  return { date: `${year}-${p(month)}-${p(day)}`, time: `${p(cotH)}:${p(m)}` };
}

/**
 * Descarga las tres rondas y devuelve un mapa `pairKey -> ResultEntry`.
 * Incluye todos los partidos: los terminados/en vivo llevan `score`; los no
 * empezados también aparecen para poder actualizar fecha/hora/estadio desde
 * la API. La descarga se memoiza para no repetir las peticiones por cada
 * página del build.
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
      leagueBadge ??= e.strLeagueBadge;
      const home = TEAM_ES[e.strHomeTeam];
      const away = TEAM_ES[e.strAwayTeam];
      if (!home || !away) continue;

      const status = e.strStatus ?? '';
      const finished = FINISHED.has(status);
      const live = !finished && LIVE.has(status);

      // fixture data (date/time/venue) para todos los partidos
      const cot =
        e.strDate && e.strTime ? utcToCot(e.strDate, e.strTime) : undefined;

      if (!finished && !live) {
        // Partido no empezado: guardamos solo fixture (score null).
        results.set(pairKey(home, away), {
          home, score: null, live: false,
          date: cot?.date, time: cot?.time, venue: e.strVenue ?? undefined,
        });
        continue;
      }
      if (e.intHomeScore === null || e.intAwayScore === null) continue;

      results.set(pairKey(home, away), {
        home,
        score: { home: Number(e.intHomeScore), away: Number(e.intAwayScore) },
        live,
        date: cot?.date,
        time: cot?.time,
        venue: e.strVenue ?? undefined,
      });
    }
  }

  return results;
}

export { pairKey };
