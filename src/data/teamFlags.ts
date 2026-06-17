/**
 * Código de país (ISO 3166-1 alpha-2, o subdivisión `gb-*`) para cada selección
 * del fixture, usando los nombres en español de `src/data/matches.ts`.
 *
 * Se usa para construir la URL de la bandera en flagcdn.com. TheSportsDB ofrece
 * escudos de federación, no banderas nacionales, por eso las banderas salen de
 * aquí y no de la API.
 */
export const TEAM_ISO: Record<string, string> = {
  Argelia: 'dz',
  Argentina: 'ar',
  Australia: 'au',
  Austria: 'at',
  Bélgica: 'be',
  'Bosnia y Herzeg.': 'ba',
  Brasil: 'br',
  Canadá: 'ca',
  'Cabo Verde': 'cv',
  Colombia: 'co',
  Croacia: 'hr',
  Curazao: 'cw',
  'Rep. Checa': 'cz',
  'Rep. del Congo': 'cd',
  Ecuador: 'ec',
  Egipto: 'eg',
  Inglaterra: 'gb-eng',
  Francia: 'fr',
  Alemania: 'de',
  Ghana: 'gh',
  Haití: 'ht',
  Irán: 'ir',
  Irak: 'iq',
  'Costa de Marfil': 'ci',
  Japón: 'jp',
  Jordania: 'jo',
  México: 'mx',
  Marruecos: 'ma',
  'Países Bajos': 'nl',
  'Nueva Zelanda': 'nz',
  Noruega: 'no',
  Panamá: 'pa',
  Paraguay: 'py',
  Portugal: 'pt',
  Catar: 'qa',
  'Arabia Saudita': 'sa',
  Escocia: 'gb-sct',
  Senegal: 'sn',
  Sudáfrica: 'za',
  'Corea del Sur': 'kr',
  España: 'es',
  Suecia: 'se',
  Suiza: 'ch',
  Túnez: 'tn',
  Turquía: 'tr',
  'Estados Unidos': 'us',
  Uruguay: 'uy',
  Uzbekistán: 'uz',
};

/** URL de la bandera de una selección, o `null` si no está mapeada. */
export function flagUrl(team: string): string | null {
  const code = TEAM_ISO[team];
  return code ? `https://flagcdn.com/${code}.svg` : null;
}
