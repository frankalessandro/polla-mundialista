export type { Group, Score, Match } from '../types.ts';
import type { Match } from '../types.ts';

export const matches: Match[] = [
  // ── Grupo A ──────────────────────────────────────────────────────────────
  { id: 1,  group: 'A', date: '2026-06-11', time: '14:00', home: 'México',        away: 'Sudáfrica',     stadium: 'Ciudad de México',        result: null },
  { id: 2,  group: 'A', date: '2026-06-11', time: '21:00', home: 'Corea del Sur', away: 'Rep. Checa',    stadium: 'Guadalajara',             result: null },
  { id: 25, group: 'A', date: '2026-06-18', time: '11:00', home: 'Rep. Checa',    away: 'Sudáfrica',     stadium: 'Atlanta',                 result: null },
  { id: 28, group: 'A', date: '2026-06-18', time: '20:00', home: 'México',        away: 'Corea del Sur', stadium: 'Guadalajara',             result: null },
  { id: 53, group: 'A', date: '2026-06-24', time: '20:00', home: 'Rep. Checa',    away: 'México',        stadium: 'Ciudad de México',        result: null },
  { id: 54, group: 'A', date: '2026-06-24', time: '20:00', home: 'Sudáfrica',     away: 'Corea del Sur', stadium: 'Monterrey',               result: null },

  // ── Grupo B ──────────────────────────────────────────────────────────────
  { id: 3,  group: 'B', date: '2026-06-12', time: '14:00', home: 'Canadá',            away: 'Bosnia y Herzeg.', stadium: 'Toronto',       result: null },
  { id: 8,  group: 'B', date: '2026-06-13', time: '14:00', home: 'Catar',             away: 'Suiza',            stadium: 'San Francisco', result: null },
  { id: 26, group: 'B', date: '2026-06-18', time: '14:00', home: 'Suiza',             away: 'Bosnia y Herzeg.', stadium: 'Los Ángeles',   result: null },
  { id: 27, group: 'B', date: '2026-06-18', time: '17:00', home: 'Canadá',            away: 'Catar',            stadium: 'Vancouver',     result: null },
  { id: 51, group: 'B', date: '2026-06-24', time: '14:00', home: 'Suiza',             away: 'Canadá',           stadium: 'Vancouver',     result: null },
  { id: 52, group: 'B', date: '2026-06-24', time: '14:00', home: 'Bosnia y Herzeg.',  away: 'Catar',            stadium: 'Seattle',       result: null },

  // ── Grupo C ──────────────────────────────────────────────────────────────
  { id: 5,  group: 'C', date: '2026-06-13', time: '20:00', home: 'Haití',    away: 'Escocia',   stadium: 'Boston',                   result: null },
  { id: 7,  group: 'C', date: '2026-06-13', time: '17:00', home: 'Brasil',   away: 'Marruecos', stadium: 'Nueva York/Nueva Jersey',   result: null },
  { id: 29, group: 'C', date: '2026-06-19', time: '19:30', home: 'Brasil',   away: 'Haití',     stadium: 'Filadelfia',               result: null },
  { id: 30, group: 'C', date: '2026-06-19', time: '17:00', home: 'Escocia',  away: 'Marruecos', stadium: 'Boston',                   result: null },
  { id: 49, group: 'C', date: '2026-06-24', time: '17:00', home: 'Escocia',  away: 'Brasil',    stadium: 'Miami',                    result: null },
  { id: 50, group: 'C', date: '2026-06-24', time: '17:00', home: 'Marruecos',away: 'Haití',     stadium: 'Atlanta',                  result: null },

  // ── Grupo D ──────────────────────────────────────────────────────────────
  { id: 4,  group: 'D', date: '2026-06-12', time: '20:00', home: 'Estados Unidos', away: 'Paraguay',      stadium: 'Los Ángeles',   result: null },
  { id: 6,  group: 'D', date: '2026-06-13', time: '23:00', home: 'Australia',      away: 'Turquía',       stadium: 'Vancouver',     result: null },
  { id: 31, group: 'D', date: '2026-06-19', time: '14:00', home: 'Estados Unidos', away: 'Australia',     stadium: 'Seattle',       result: null },
  { id: 32, group: 'D', date: '2026-06-19', time: '22:00', home: 'Turquía',        away: 'Paraguay',      stadium: 'San Francisco', result: null },
  { id: 59, group: 'D', date: '2026-06-25', time: '21:00', home: 'Turquía',        away: 'Estados Unidos',stadium: 'Los Ángeles',   result: null },
  { id: 60, group: 'D', date: '2026-06-25', time: '21:00', home: 'Paraguay',       away: 'Australia',     stadium: 'San Francisco', result: null },

  // ── Grupo E ──────────────────────────────────────────────────────────────
  { id: 9,  group: 'E', date: '2026-06-14', time: '18:00', home: 'Costa de Marfil', away: 'Ecuador',       stadium: 'Filadelfia',             result: null },
  { id: 10, group: 'E', date: '2026-06-14', time: '12:00', home: 'Alemania',        away: 'Curazao',       stadium: 'Houston',                result: null },
  { id: 33, group: 'E', date: '2026-06-20', time: '15:00', home: 'Alemania',        away: 'Costa de Marfil',stadium: 'Toronto',               result: null },
  { id: 34, group: 'E', date: '2026-06-20', time: '19:00', home: 'Ecuador',         away: 'Curazao',       stadium: 'Kansas City',            result: null },
  { id: 55, group: 'E', date: '2026-06-25', time: '15:00', home: 'Curazao',         away: 'Costa de Marfil',stadium: 'Filadelfia',            result: null },
  { id: 56, group: 'E', date: '2026-06-25', time: '15:00', home: 'Ecuador',         away: 'Alemania',      stadium: 'Nueva York/Nueva Jersey', result: null },

  // ── Grupo F ──────────────────────────────────────────────────────────────
  { id: 11, group: 'F', date: '2026-06-14', time: '15:00', home: 'Países Bajos', away: 'Japón',        stadium: 'Dallas',      result: null },
  { id: 12, group: 'F', date: '2026-06-14', time: '21:00', home: 'Suecia',       away: 'Túnez',        stadium: 'Monterrey',   result: null },
  { id: 35, group: 'F', date: '2026-06-20', time: '12:00', home: 'Países Bajos', away: 'Suecia',       stadium: 'Houston',     result: null },
  { id: 36, group: 'F', date: '2026-06-20', time: '23:00', home: 'Túnez',        away: 'Japón',        stadium: 'Monterrey',   result: null },
  { id: 57, group: 'F', date: '2026-06-25', time: '18:00', home: 'Japón',        away: 'Suecia',       stadium: 'Dallas',      result: null },
  { id: 58, group: 'F', date: '2026-06-25', time: '18:00', home: 'Túnez',        away: 'Países Bajos', stadium: 'Kansas City', result: null },

  // ── Grupo G ──────────────────────────────────────────────────────────────
  { id: 15, group: 'G', date: '2026-06-15', time: '20:00', home: 'Irán',         away: 'Nueva Zelanda', stadium: 'Los Ángeles', result: null },
  { id: 16, group: 'G', date: '2026-06-15', time: '14:00', home: 'Bélgica',      away: 'Egipto',        stadium: 'Seattle',     result: null },
  { id: 39, group: 'G', date: '2026-06-21', time: '14:00', home: 'Bélgica',      away: 'Irán',          stadium: 'Los Ángeles', result: null },
  { id: 40, group: 'G', date: '2026-06-21', time: '20:00', home: 'Nueva Zelanda',away: 'Egipto',        stadium: 'Vancouver',   result: null },
  { id: 63, group: 'G', date: '2026-06-26', time: '22:00', home: 'Egipto',       away: 'Irán',          stadium: 'Seattle',     result: null },
  { id: 64, group: 'G', date: '2026-06-26', time: '22:00', home: 'Nueva Zelanda',away: 'Bélgica',       stadium: 'Vancouver',   result: null },

  // ── Grupo H ──────────────────────────────────────────────────────────────
  { id: 13, group: 'H', date: '2026-06-15', time: '17:00', home: 'Arabia Saudita', away: 'Uruguay',        stadium: 'Miami',       result: null },
  { id: 14, group: 'H', date: '2026-06-15', time: '11:00', home: 'España',         away: 'Cabo Verde',     stadium: 'Atlanta',     result: null },
  { id: 37, group: 'H', date: '2026-06-21', time: '17:00', home: 'Uruguay',        away: 'Cabo Verde',     stadium: 'Miami',       result: null },
  { id: 38, group: 'H', date: '2026-06-21', time: '11:00', home: 'España',         away: 'Arabia Saudita', stadium: 'Atlanta',     result: null },
  { id: 65, group: 'H', date: '2026-06-26', time: '19:00', home: 'Cabo Verde',     away: 'Arabia Saudita', stadium: 'Houston',     result: null },
  { id: 66, group: 'H', date: '2026-06-26', time: '19:00', home: 'Uruguay',        away: 'España',         stadium: 'Guadalajara', result: null },

  // ── Grupo I ──────────────────────────────────────────────────────────────
  { id: 17, group: 'I', date: '2026-06-16', time: '14:00', home: 'Francia', away: 'Senegal', stadium: 'Nueva York/Nueva Jersey', result: null },
  { id: 18, group: 'I', date: '2026-06-16', time: '17:00', home: 'Irak',    away: 'Noruega', stadium: 'Boston',                  result: null },
  { id: 41, group: 'I', date: '2026-06-22', time: '19:00', home: 'Noruega', away: 'Senegal', stadium: 'Nueva York/Nueva Jersey', result: null },
  { id: 42, group: 'I', date: '2026-06-22', time: '16:00', home: 'Francia', away: 'Irak',    stadium: 'Filadelfia',              result: null },
  { id: 61, group: 'I', date: '2026-06-26', time: '14:00', home: 'Noruega', away: 'Francia', stadium: 'Boston',                  result: null },
  { id: 62, group: 'I', date: '2026-06-26', time: '14:00', home: 'Senegal', away: 'Irak',    stadium: 'Toronto',                 result: null },

  // ── Grupo J ──────────────────────────────────────────────────────────────
  { id: 19, group: 'J', date: '2026-06-16', time: '20:00', home: 'Argentina', away: 'Argelia',   stadium: 'Kansas City',  result: null },
  { id: 20, group: 'J', date: '2026-06-16', time: '23:00', home: 'Austria',   away: 'Jordania',  stadium: 'San Francisco',result: null },
  { id: 43, group: 'J', date: '2026-06-22', time: '12:00', home: 'Argentina', away: 'Austria',   stadium: 'Dallas',       result: null },
  { id: 44, group: 'J', date: '2026-06-22', time: '22:00', home: 'Jordania',  away: 'Argelia',   stadium: 'San Francisco',result: null },
  { id: 69, group: 'J', date: '2026-06-27', time: '21:00', home: 'Argelia',   away: 'Austria',   stadium: 'Kansas City',  result: null },
  { id: 70, group: 'J', date: '2026-06-27', time: '21:00', home: 'Jordania',  away: 'Argentina', stadium: 'Dallas',       result: null },

  // ── Grupo K ──────────────────────────────────────────────────────────────
  { id: 23, group: 'K', date: '2026-06-17', time: '12:00', home: 'Portugal',      away: 'Rep. del Congo', stadium: 'Houston',       result: null },
  { id: 24, group: 'K', date: '2026-06-17', time: '21:00', home: 'Uzbekistán',    away: 'Colombia',       stadium: 'Ciudad de México',result: null },
  { id: 47, group: 'K', date: '2026-06-23', time: '12:00', home: 'Portugal',      away: 'Uzbekistán',     stadium: 'Houston',       result: null },
  { id: 48, group: 'K', date: '2026-06-23', time: '21:00', home: 'Colombia',      away: 'Rep. del Congo', stadium: 'Guadalajara',   result: null },
  { id: 71, group: 'K', date: '2026-06-27', time: '18:30', home: 'Colombia',      away: 'Portugal',       stadium: 'Miami',         result: null },
  { id: 72, group: 'K', date: '2026-06-27', time: '18:30', home: 'Rep. del Congo',away: 'Uzbekistán',     stadium: 'Atlanta',       result: null },

  // ── Grupo L ──────────────────────────────────────────────────────────────
  { id: 21, group: 'L', date: '2026-06-17', time: '18:00', home: 'Ghana',     away: 'Panamá',    stadium: 'Toronto',              result: null },
  { id: 22, group: 'L', date: '2026-06-17', time: '15:00', home: 'Inglaterra',away: 'Croacia',   stadium: 'Dallas',               result: null },
  { id: 45, group: 'L', date: '2026-06-23', time: '15:00', home: 'Inglaterra',away: 'Ghana',     stadium: 'Boston',               result: null },
  { id: 46, group: 'L', date: '2026-06-23', time: '18:00', home: 'Panamá',    away: 'Croacia',   stadium: 'Toronto',              result: null },
  { id: 67, group: 'L', date: '2026-06-27', time: '16:00', home: 'Panamá',    away: 'Inglaterra',stadium: 'Nueva York/Nueva Jersey',result: null },
  { id: 68, group: 'L', date: '2026-06-27', time: '16:00', home: 'Croacia',   away: 'Ghana',     stadium: 'Filadelfia',           result: null },
];
