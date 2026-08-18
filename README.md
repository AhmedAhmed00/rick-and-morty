# Multiverse Explorer

A responsive explorer for the Rick and Morty universe — browse, search and filter characters,
episodes and locations, in English and Arabic, with light and dark themes.

**Live demo:** <https://rick-and-morty-tempo.vercel.app/en>

Built with **Next.js 16 (App Router)**, **React 19**, **TanStack Query**, **Tailwind CSS v4**,
**TypeScript**, **nuqs**, **next-intl** and **Apollo Client**.

## Highlights

- Characters, episodes and locations with search, filtering and pagination.
- English and Arabic, with full RTL support.
- Light and dark themes from a single token set.
- Server-side prefetch hydrated into TanStack Query, so the first paint carries data.
- REST for lists, GraphQL for detail pages.
- Filters and pagination held in the URL, so every view is shareable.
- Accessible custom `Select`, `Dropdown` and `Sheet` components.
- 41 tests across 6 files.

## Running locally

Requires Node 20.9 or newer (Next 16).

```bash
npm install
cp .env.example .env.local     # optional
npm run dev
```

Open <http://localhost:3000> — the root redirects to `/en`, and Arabic is at `/ar`.

`.env.example` holds the two API endpoints. Both fall back to the public API if unset, so the app
runs without a `.env.local`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Vitest suite (41 tests) |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm run lint` | ESLint |

## Structure

```
app/[locale]/     Routes — parse params, prefetch, render.
components/       UI primitives, layout, one folder per entity.
lib/              Types, data access, query definitions, URL parsers.
hooks/            Client-side state helpers.
i18n/ messages/   Localisation setup and translations.
test/             Vitest specs and MSW handlers.
```

## Architecture

**App Router, not Pages.** Routes are server components that prefetch and hydrate, so the first paint
carries data instead of skeletons; `generateMetadata` gives every character, episode and location its
own title and share card, which the Pages Router can't do per record without extra plumbing; and the
`loading` / `error` / `not-found` conventions map straight onto the design system's states.

I deliberately did not use feature-based or clean architecture. This is a read-only browser over a
public API — no writes, no auth, no business rules to protect — so those layers would add indirection
without removing any real coupling. The code is grouped by role instead, which keeps the architecture
matched to the complexity that actually exists.

## Key decisions

- **Server prefetch.** Each route prefetches into a `QueryClient` and hydrates through
  `HydrationBoundary`, so the first paint carries data rather than skeletons.
- **REST and GraphQL.** REST covers lists, search and pagination. GraphQL covers the detail pages,
  where returning the episodes nested removes a round trip.
- **A single cache.** Apollo is used as transport only, so TanStack Query owns all cached server
  state.
- **URL as the source of truth.** Filters and pagination live in the query string via nuqs, shared by
  server and client, and invalid values never reach the API.
- **Config-driven `FilterBar`.** It owns every URL write, so adding a filter is a config entry rather
  than new markup.
- **Design tokens.** Colour, spacing and radii are defined once and exposed through Tailwind's
  `@theme`, so no component holds a raw hex value. Contrast was adjusted where the supplied palette
  fell short of WCAG AA.

## API notes

Behaviour was verified against the live API rather than assumed. Empty results return 404 instead of
an empty array, so a zero-result search resolves to an empty page rather than an error screen. Single
and batch episode requests return different shapes, and invalid or missing ids are mapped to a clean
404 instead of a 500.

## Internationalisation and accessibility

next-intl with locale-prefixed routes. Arabic sets `dir="rtl"`, and mirroring is handled with logical
CSS properties rather than per-component branching, with ICU plural rules and an Arabic font fallback.

Accessibility work covers semantic landmarks, a skip link, visible focus rings, status conveyed by
text as well as colour, keyboard support on the custom controls, and focus trapping in the mobile
navigation.

## SEO

Every route builds its own title and description through `generateMetadata`, in the active locale.
On top of that: Open Graph and Twitter cards so shared links preview with an image — character pages
use the character's portrait, everything else falls back to a card generated from the brand tokens —
plus canonical URLs, `hreflang` pairs linking `/en` and `/ar`, and a generated `robots.txt` and
`sitemap.xml` covering all 1,007 pages.

## Testing

`npm test` — 41 tests across 6 files with Vitest, React Testing Library and MSW. The mocks reproduce
the API's real quirks, covering the URL contract, both data adapters, the `Select` listbox, the
pagination algorithm and the status badge.

## Trade-offs

- **Loading states are scoped to the list routes.** A segment-level `loading` file opens a Suspense
  boundary above the detail pages, and streaming commits the response before `notFound()` runs, so a
  missing character returns HTTP 200 with 404 content. Scoping it keeps the status codes honest.
- **The home page fetches on the server without React Query.** A static overview with no filtering or
  pagination — the query cache would add indirection and buy nothing.
- **Metadata reads the record a second time.** React's `cache()` would collapse it, and is
  the right move as soon as detail pages grow; at this size the extra layer costs more than it saves.
- **Detail pages render on demand.** `generateStaticParams` could prerender popular ids, but across
  826 characters the build cost outweighed the benefit.

## Future improvements

Infinite scroll, a character comparison view, episode filtering by season, and visual regression
tests over the component states.
