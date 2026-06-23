// ── Tipos de dominio compartidos ─────────────────────────────────────────────
// Todos los tipos que describen la forma de los datos del dominio viven aquí.
// Los archivos de datos (matches.ts, participants.ts) importan desde este
// módulo; las librerías (scoring.ts, views.ts) también, evitando que la lógica
// pura dependa de los archivos de datos.

export type Group = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export type Score = { home: number; away: number };

export type Match = {
  id: number;
  group: Group;
  date: string;
  time: string;
  home: string;
  away: string;
  stadium: string;
  result: Score | null;
  /**
   * `true` cuando `result` es un marcador EN VIVO (parcial): los puntos
   * derivados son provisionales y pueden cambiar. Lo fija {@link getMatches}
   * desde el estado de la API; en los datos estáticos siempre va ausente.
   */
  live?: boolean;
};

export type Prediction = {
  matchId: number;
  home: number;
  away: number;
};

export type Participant = {
  id: number;
  name: string;
  predictions: Prediction[];
};
