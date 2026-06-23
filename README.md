# Polla Mundialista 2026

![Pantalla principal](src/assets/img_readme.png)

App de quiniela para la fase de grupos del Mundial 2026. Cada participante registra sus 72 predicciones antes de que arranque el torneo; la app calcula puntos en tiempo real, muestra la clasificación general y el impacto de cada partido sobre el ranking.

Desplegada en Vercel con build estático. Los marcadores se obtienen de TheSportsDB en tiempo de build y se memoizan para no repetir la petición por cada una de las 133 páginas generadas.

---

## Stack

- **[Astro 6](https://astro.build/)** — generación estática, rutas por archivo, sin frameworks JS
- **[Tailwind CSS 4](https://tailwindcss.com/)** — vía plugin de Vite, sin `tailwind.config`
- **TypeScript strict** — `astro/tsconfigs/strict`, imports con extensión `.ts` explícita
- **[TheSportsDB](https://www.thesportsdb.com/)** — API pública para marcadores (liga `4429`, FIFA World Cup 2026)
- **pnpm** — gestor de paquetes
- **Node 22.x** — requerido; los tests corren TypeScript nativo vía `node:test`

---

## Comandos

```bash
pnpm dev        # servidor local en localhost:4321
pnpm build      # build estático → dist/
pnpm preview    # sirve dist/ localmente
pnpm test       # todos los *.test.ts con node:test
```

Para correr un único archivo o filtrar por nombre:

```bash
node --test src/lib/scoring.test.ts
node --test --test-name-pattern="marcador exacto" "src/**/*.test.ts"
```

---

## Estructura

```
src/
├── types.ts                    # tipos de dominio compartidos (Match, Score, Participant…)
├── data/
│   ├── matches.ts              # fixture de los 72 partidos de la fase de grupos
│   ├── participants.ts         # 59 participantes con sus 72 predicciones cada uno
│   └── Prueba.xlsx             # fuente original de predicciones (no editar a mano)
├── lib/
│   ├── scoring.ts              # lógica de puntaje pura + buildStandings()
│   ├── scoring.test.ts
│   ├── views.ts                # helpers de presentación: agrupaciones, desglose, impacto
│   ├── views.test.ts
│   ├── matchSource.ts          # fuente única de partidos: fixture + marcadores de la API
│   ├── sportsdb.ts             # cliente TheSportsDB (fetch, traducción de equipos)
│   └── styles.ts               # helpers de clases CSS (getRankClass, getPointClass)
├── components/
│   ├── MatchCard.astro         # tarjeta de partido con estado live/jugado/programado
│   ├── MatchScore.astro        # display home–score–away, variante md y lg
│   ├── StandingsTable.astro    # tabla de clasificación con sort por columna
│   ├── PredictionsTable.astro  # apuestas de un partido con sort y buscador
│   ├── ParticipantSearch.astro # buscador de participante para la clasificación
│   ├── SearchInput.astro       # campo de búsqueda reutilizable
│   ├── SortIcon.astro          # chevron up/down para cabeceras de tabla ordenables
│   ├── Flag.astro              # bandera de equipo
│   ├── LiveBadge.astro         # badge rojo "En vivo" / "Provisional"
│   ├── DesempateToggle.astro   # toggle para mostrar/ocultar columnas de desempate
│   └── InfoModal.astro         # modal con la explicación del sistema de puntos
└── pages/
    ├── index.astro              # listado de partidos (por grupo / por fecha)
    ├── clasificacion.astro      # tabla general de clasificación
    ├── partido/[id].astro       # detalle de partido + apuestas de todos los participantes
    └── participante/[id].astro  # historial de un participante partido a partido
```

---

## Sistema de puntos

| Caso | Puntos |
|---|---|
| Marcador exacto (ej. 2-1 vs 2-1) | **5** |
| Resultado correcto (ganador o empate) | **+2** |
| Al menos un gol acertado (local o visitante) | **+1** |

Los dos últimos bonos son independientes entre sí: cuando la predicción no es exacta se pueden acumular 0, 1, 2 o 3 puntos. Los totales posibles por partido son **0, 1, 2, 3 y 5**.

**Desempate en la clasificación** (en orden): exactos → aciertos de 3 pts → aciertos de 2 pts → aciertos de 1 pt → orden de registro.

La lógica está en [`src/lib/scoring.ts`](src/lib/scoring.ts) con tests en [`src/lib/scoring.test.ts`](src/lib/scoring.test.ts). Las funciones corrigen bugs del Excel original del que se extrajeron los datos.

---

## Datos y marcadores

**Fixture** (`src/data/matches.ts`): los 72 partidos con id, grupo (A–L), fecha, hora, estadio y equipos. `result` parte en `null` y se sobreescribe en cada build con los marcadores reales.

**Predicciones** (`src/data/participants.ts`): 59 participantes, cada uno con 72 predicciones extraídas de `Prueba.xlsx`. Tratar como datos generados — no editar a mano.

**Marcadores en build**: `getMatches()` en `matchSource.ts` llama a TheSportsDB (rondas 1–3 vía `eventsround.php`) y superpone los resultados sobre el fixture casando por par de equipos. Si la API falla el sitio compila igual con todos los `result: null`. La promesa se memoiza: una sola petición HTTP por build, sin importar cuántas páginas la consuman.

Partidos con `live: true` tienen marcador parcial; sus puntos se calculan pero se marcan como **provisionales** en toda la UI.

---

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `SPORTSDB_KEY` | API key de TheSportsDB | `123` (clave pública) |

La clave `123` funciona en desarrollo pero tiene rate limit. Para producción se puede registrar una clave propia en [thesportsdb.com](https://www.thesportsdb.com) y configurarla en Vercel.

---

## Deploy

El sitio es 100% estático. Vercel detecta Astro automáticamente; no hace falta configuración adicional. Cada push a `main` dispara un nuevo build.

Como los marcadores se resuelven en tiempo de build, para reflejar nuevos resultados hay que triggerear un nuevo deploy (manual o con un deploy programado en Vercel).
