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

/** Datos mínimos del fixture; `date`, `time`, `stadium` y `result` vienen de la API. */
type MatchSeed = Pick<Match, 'id' | 'group' | 'home' | 'away'>;

export const matches: MatchSeed[] = [
  // ── Grupo A ──────────────────────────────────────────────────────────────
  { id: 1,  group: 'A', home: 'México',        away: 'Sudáfrica'     },
  { id: 2,  group: 'A', home: 'Corea del Sur', away: 'Rep. Checa'    },
  { id: 25, group: 'A', home: 'Rep. Checa',    away: 'Sudáfrica'     },
  { id: 28, group: 'A', home: 'México',        away: 'Corea del Sur' },
  { id: 53, group: 'A', home: 'Rep. Checa',    away: 'México'        },
  { id: 54, group: 'A', home: 'Sudáfrica',     away: 'Corea del Sur' },

  // ── Grupo B ──────────────────────────────────────────────────────────────
  { id: 3,  group: 'B', home: 'Canadá',           away: 'Bosnia y Herzeg.' },
  { id: 8,  group: 'B', home: 'Catar',            away: 'Suiza'            },
  { id: 26, group: 'B', home: 'Suiza',            away: 'Bosnia y Herzeg.' },
  { id: 27, group: 'B', home: 'Canadá',           away: 'Catar'            },
  { id: 51, group: 'B', home: 'Suiza',            away: 'Canadá'           },
  { id: 52, group: 'B', home: 'Bosnia y Herzeg.', away: 'Catar'            },

  // ── Grupo C ──────────────────────────────────────────────────────────────
  { id: 5,  group: 'C', home: 'Haití',    away: 'Escocia'   },
  { id: 7,  group: 'C', home: 'Brasil',   away: 'Marruecos' },
  { id: 29, group: 'C', home: 'Brasil',   away: 'Haití'     },
  { id: 30, group: 'C', home: 'Escocia',  away: 'Marruecos' },
  { id: 49, group: 'C', home: 'Escocia',  away: 'Brasil'    },
  { id: 50, group: 'C', home: 'Marruecos',away: 'Haití'     },

  // ── Grupo D ──────────────────────────────────────────────────────────────
  { id: 4,  group: 'D', home: 'Estados Unidos', away: 'Paraguay'       },
  { id: 6,  group: 'D', home: 'Australia',      away: 'Turquía'        },
  { id: 31, group: 'D', home: 'Estados Unidos', away: 'Australia'      },
  { id: 32, group: 'D', home: 'Turquía',        away: 'Paraguay'       },
  { id: 59, group: 'D', home: 'Turquía',        away: 'Estados Unidos' },
  { id: 60, group: 'D', home: 'Paraguay',       away: 'Australia'      },

  // ── Grupo E ──────────────────────────────────────────────────────────────
  { id: 9,  group: 'E', home: 'Costa de Marfil', away: 'Ecuador'        },
  { id: 10, group: 'E', home: 'Alemania',         away: 'Curazao'        },
  { id: 33, group: 'E', home: 'Alemania',         away: 'Costa de Marfil'},
  { id: 34, group: 'E', home: 'Ecuador',          away: 'Curazao'        },
  { id: 55, group: 'E', home: 'Curazao',          away: 'Costa de Marfil'},
  { id: 56, group: 'E', home: 'Ecuador',          away: 'Alemania'       },

  // ── Grupo F ──────────────────────────────────────────────────────────────
  { id: 11, group: 'F', home: 'Países Bajos', away: 'Japón'        },
  { id: 12, group: 'F', home: 'Suecia',       away: 'Túnez'        },
  { id: 35, group: 'F', home: 'Países Bajos', away: 'Suecia'       },
  { id: 36, group: 'F', home: 'Túnez',        away: 'Japón'        },
  { id: 57, group: 'F', home: 'Japón',        away: 'Suecia'       },
  { id: 58, group: 'F', home: 'Túnez',        away: 'Países Bajos' },

  // ── Grupo G ──────────────────────────────────────────────────────────────
  { id: 15, group: 'G', home: 'Irán',          away: 'Nueva Zelanda' },
  { id: 16, group: 'G', home: 'Bélgica',       away: 'Egipto'        },
  { id: 39, group: 'G', home: 'Bélgica',       away: 'Irán'          },
  { id: 40, group: 'G', home: 'Nueva Zelanda', away: 'Egipto'        },
  { id: 63, group: 'G', home: 'Egipto',        away: 'Irán'          },
  { id: 64, group: 'G', home: 'Nueva Zelanda', away: 'Bélgica'       },

  // ── Grupo H ──────────────────────────────────────────────────────────────
  { id: 13, group: 'H', home: 'Arabia Saudita', away: 'Uruguay'        },
  { id: 14, group: 'H', home: 'España',          away: 'Cabo Verde'     },
  { id: 37, group: 'H', home: 'Uruguay',         away: 'Cabo Verde'     },
  { id: 38, group: 'H', home: 'España',          away: 'Arabia Saudita' },
  { id: 65, group: 'H', home: 'Cabo Verde',      away: 'Arabia Saudita' },
  { id: 66, group: 'H', home: 'Uruguay',         away: 'España'         },

  // ── Grupo I ──────────────────────────────────────────────────────────────
  { id: 17, group: 'I', home: 'Francia', away: 'Senegal' },
  { id: 18, group: 'I', home: 'Irak',    away: 'Noruega' },
  { id: 41, group: 'I', home: 'Noruega', away: 'Senegal' },
  { id: 42, group: 'I', home: 'Francia', away: 'Irak'    },
  { id: 61, group: 'I', home: 'Noruega', away: 'Francia' },
  { id: 62, group: 'I', home: 'Senegal', away: 'Irak'    },

  // ── Grupo J ──────────────────────────────────────────────────────────────
  { id: 19, group: 'J', home: 'Argentina', away: 'Argelia'   },
  { id: 20, group: 'J', home: 'Austria',   away: 'Jordania'  },
  { id: 43, group: 'J', home: 'Argentina', away: 'Austria'   },
  { id: 44, group: 'J', home: 'Jordania',  away: 'Argelia'   },
  { id: 69, group: 'J', home: 'Argelia',   away: 'Austria'   },
  { id: 70, group: 'J', home: 'Jordania',  away: 'Argentina' },

  // ── Grupo K ──────────────────────────────────────────────────────────────
  { id: 23, group: 'K', home: 'Portugal',       away: 'Rep. del Congo' },
  { id: 24, group: 'K', home: 'Uzbekistán',     away: 'Colombia'       },
  { id: 47, group: 'K', home: 'Portugal',       away: 'Uzbekistán'     },
  { id: 48, group: 'K', home: 'Colombia',       away: 'Rep. del Congo' },
  { id: 71, group: 'K', home: 'Colombia',       away: 'Portugal'       },
  { id: 72, group: 'K', home: 'Rep. del Congo', away: 'Uzbekistán'     },

  // ── Grupo L ──────────────────────────────────────────────────────────────
  { id: 21, group: 'L', home: 'Ghana',      away: 'Panamá'    },
  { id: 22, group: 'L', home: 'Inglaterra', away: 'Croacia'   },
  { id: 45, group: 'L', home: 'Inglaterra', away: 'Ghana'     },
  { id: 46, group: 'L', home: 'Panamá',     away: 'Croacia'   },
  { id: 67, group: 'L', home: 'Panamá',     away: 'Inglaterra'},
  { id: 68, group: 'L', home: 'Croacia',    away: 'Ghana'     },
];
