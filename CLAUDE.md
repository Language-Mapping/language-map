# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Languages of New York City Map (https://languagemap.nyc/) — an interactive Mapbox-driven visualization of NYC's linguistic diversity using data from the Endangered Language Alliance. Originally CRA, now Vite. Hosted on Netlify.

## Commands

- `yarn start` — Vite dev server at http://localhost:3000
- `yarn build` — type-check (`tsc --noEmit`) then `vite build` to `./build`
- `yarn preview` — preview the production build
- `yarn lint` — `eslint '*/**/*.{js,ts,tsx}' --quiet`
- No test runner is wired up in `scripts`; `*.test.tsx` files exist (e.g. `App.test.tsx`, `Map.test.tsx`) but are excluded from `tsconfig.json` and ESLint, so they are stale. Don't assume they run.

## Environment

Required env vars (prefix `REACT_APP_` is preserved by Vite via `envPrefix` in `vite.config.mts`; access as `import.meta.env.REACT_APP_*`, not `process.env`):

- `REACT_APP_MB_TOKEN` — Mapbox access token (required)
- `REACT_APP_AIRTABLE_API_KEY` — Airtable API key (required; nearly all config + content lives in Airtable)
- `REACT_APP_YOUTUBE_API_KEY` — optional, only for video metadata
- `REACT_APP_SENTRY_ENVIRONMENT` — optional, set in `netlify.toml` per deploy context

Copy `sample.env` to `.env`. The hardcoded Airtable base IDs (`AIRTABLE_BASE`, `AIRTABLE_CENSUS_BASE`) live in `src/components/config/api.ts`.

## Architecture

### Data sources are external and naming-coupled

Two external systems drive the app, and the code is tightly coupled to their schemas:

1. **Mapbox tilesets** — layer names `mb-data` (language points), `puma`, `tract`, `counties`, `neighborhoods`. These names appear as object keys throughout `src/components/map/` and renaming them in Mapbox will break the app in ways TypeScript will not catch.
2. **Airtable** — most routes, table names, and column names are referenced by string literals from `src/components/config/api.ts` and typed in `src/components/context/types.ts`. See `docs/data-structure.md` for required fields.

When adding fields, update both the Airtable schema _and_ the TypeScript types in `src/components/context/types.ts`.

### Top-level composition

`src/index.tsx` → `ProvidersWrap` (theme + GlobalContext + SymbAndLabelContext) → `BrowserRouter` → `App` (Sentry boundary + app-wide `QueryClientProvider` + `MapToolsProvider` + `PanelContextProvider`) → `AppWrap` (layout: `PanelWrap`, `Map`, `TopBar`, `BottomNav`, plus `ResultsModal`).

### State management

State is split across **multiple React Contexts**, not Redux:

- `GlobalContext` (`src/components/context/GlobalContext.tsx`) — language features + filter state via `useReducer` (actions in `reducer.tsx`, types in `types.ts`).
- `SymbAndLabelContext` — map symbology and label settings.
- `MapToolsContext` — basemap, geocoder, census active field, etc.
- `PanelContext` (`src/components/panels/PanelContext.tsx`) — open/closed panel UI state.

Server state uses **`@tanstack/react-query` v4**. (The `react-query` v2 entry in `package.json` is leftover and unused.) The app-wide `QueryClient` is created in `src/components/App.tsx`; its defaults come from `reactQueryDefaults` in `src/components/config/api.ts` — everything is `staleTime: Infinity`, no refetch on focus/mount/reconnect, so Airtable data is treated as effectively static for the session. `InfoPanel` and `MediaModal` swap in their own clients (`wpQueryClient`, `mediaQueryClient`) for separate cache lifecycles on WordPress/media data.

### Routing

All routes are declared in `routes` in `src/components/config/api.ts` and consumed via `<Routes>`/`<Route>` (`react-router-dom` v6). URL is the source of truth for "what's selected" (e.g. `/Explore/Language/:value/:id`, `/Census/:table/:field/:id`). The map listens for route changes to fly/zoom/highlight.

**v6 nested-Routes gotcha — read this before adding routes inside a panel.** `PanelWrap.tsx` builds parent routes as `${rootPath}/*` from `nonNavRoutesConfig`, so panel components like `InfoPanel` and `DetailsPanel` are children of a parent `<Route path="/Foo/*">`. Inside a nested `<Routes>`, v6 strips the parent's `pathnameBase` from the URL before matching — meaning **absolute child paths like `<Route path={routes.info}>` (= `/Info`) silently fail to match** because the inner basename is already `/Info`. Use `<Route index>` for the parent path itself and **relative** paths (`path="About"`, not `path="/Info/About"`) for siblings. The mechanical v5→v6 migration left a few absolute-path regressions of this shape — `git grep '<Route path={routes\.'` to find suspects.

### Map layer wiring (`src/components/map/`)

- `Map.tsx` is the `react-map-gl` `<MapGL>` host. Children layers (`LangMbSrcAndLayer`, `CensusLayer`, `PolygonLayer` for neighborhoods/counties) attach Mapbox sources and style layers.
- Layer config is split across `config.ts`, `config.points.ts`, `config.census.ts`, `config.non-census-poly.ts` — three Mapbox Studio style IDs (light/dark/dark-bg) live in `config.ts` and are used by the basemap switcher.
- `events.ts` holds hover/click handlers; `hooks.tsx` and `hooks.points.ts` hold map-effect hooks (e.g. `useFlyToFilteredFeats`).

### Results table

`src/components/results/` was migrated from `@mui/x-data-grid` to `@tanstack/react-table` (recent commit `6619cb9`). `ResultsTable.tsx` builds the table; `config.tsx` defines columns + `initialColumnVisibility`; `exporting.ts` handles CSV (filefy) and PDF (jspdf + jspdf-autotable) export, which intentionally excludes hidden columns.

### MUI v5 with legacy makeStyles

The codebase uses **MUI v5** (`@mui/material`) but still relies on the deprecated `@mui/styles` (`makeStyles`/`createStyles`) pattern extensively, plus `StyledEngineProvider injectFirst` so JSS wins over emotion. The current branch is `agupta/upgrade-phase-4-mui-v5` — an in-progress migration. New components should match the surrounding file's style choice rather than introducing a third pattern.

### TypeScript path resolution

`tsconfig.json` sets `baseUrl: "src"`, so imports like `import { App } from 'components'` and `import { routes } from 'components/config/api'` are absolute-from-`src`. `vite-tsconfig-paths` reproduces this for the bundler. Don't add `src/` prefixes.

## Conventions worth knowing

- React 17, `react-router-dom` v6 (`<Routes>`/`<Route element={...} />`/`useNavigate`), `@tanstack/react-query` v4.
- `mapbox-gl` is pinned to v1.x and `react-map-gl` to v5.x — the v2/v6+ APIs (`Map` from react-map-gl v7) are not available.
- ESLint extends `airbnb-typescript` with prettier; lots of custom whitespace/padding rules. Run `yarn lint` before assuming a change is clean.
- Husky + lint-staged auto-fix on commit (`eslint --quiet --cache --fix`).
