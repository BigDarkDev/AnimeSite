AnimeSensei — Simple Developer Documentation

Overview
- AnimeSensei is a Next.js 16 app (App Router) that shows anime metadata from AniList, streaming options via Consumet, and AMP variants for fast mobile access.
- Branding: AnimeSensei (site-wide branding across web and AMP pages).
- Goal: A clean, approachable doc set for new contributors to understand the project quickly.

Tech Stack (summary)
- Frontend: Next.js 16, React, TypeScript, Tailwind CSS
- Data: AniList GraphQL (metadata, trending, recent, search), Consumet API (streaming data)
- Ads: Google AdSense via a reusable AdUnitRaw component; ads.txt verification at root/public
- AMP: Static and dynamic AMP pages (home, anime detail, watch)

Project Structure (high level)
- app/
  - layout.tsx: Global layout, typography, and notes about ad wiring
  - page.tsx: Home page (trending, recent, search) with AdUnitRaw ad placements
  - watch/: Watch flow page (external watchers)
  - amp-home/: AMP home route
  - amp-anime/[id]/route.ts: AMP page for anime detail (dynamic id)
  - amp-watch/route.ts: AMP watch page (title param)
- components/
  - AdUnitRaw.tsx: Safe ad HTML renderer (executes inline scripts)
  - AdSense.tsx: Legacy AdSense wrapper (kept for reference)
  - AnimeCard.tsx, TrendingCard.tsx: UI components for lists
- lib/
  - anilist.ts: AniList GraphQL wrappers (getRecentEpisodes, getTrendingAnime, searchAnime, etc.)
  - consumet.ts: Streaming API wrappers with multi-endpoint fallback
  - hianime-links.ts: Generates external streaming options and home page link
- public/
  - ads.txt: root verification for ad networks
  - amp/home.html: static AMP Home page (AMP-ready)
- AMP Routes
  - app/amp-home/route.ts
  - app/amp-anime/[id]/route.ts
  - app/amp-watch/route.ts

Key Data Contracts
- Anime (lib/anilist.ts): id, title (romaji/english), coverImage, bannerImage, description, genres, averageScore, episodes, status, season, seasonYear, format
- RecentEpisode extends Anime with nextAiringEpisode
- Episode, StreamingLink (lib/consumet.ts): Episode: id, number, title, url; StreamingLink: url, quality, isM3U8
- AnimeSearchResult (Consumet): id, title, url, image, releaseDate, subOrDub

Ad Integration
- AdUnitRaw.tsx renders a supplied HTML snippet (ads with script blocks) safely in React/Next.js.
- Home page uses AdUnitRaw for both the Sidebar and Bottom ad slots.
- ads.txt files exist at repository root and public/ for production verification.
- The AdSense Script tag is not globally injected; ads render through AdUnitRaw blocks to avoid conflicts.

AMP Strategy
- Static AMP page (public/amp/home.html) for quick verification.
- Dynamic AMP routes (app/amp-home/route.ts, app/amp-anime/[id]/route.ts, app/amp-watch/route.ts).
- Branding on AMP pages is AnimeSensei; amp-ad blocks used for ad delivery.
- Validation: run AMP Validator on AMP pages after deploy.

Environment & Deployment
- NEXT_PUBLIC_SHOW_AMP_LINK toggles visibility of the AMP link in the header (for dev vs prod).
- ads.txt exists at root and in public/ for ad networks to verify inventory.
- Deployment: Vercel recommended; ensure environment has the same Node version and public URL for AdSense verification.

Quality & Tests
- Local build: npm install, npm run build, npm run start
- AMP checks: Use AMP Validator extension or online tools on all AMP URLs
- Lint/TypeScript: Consider adding a small script to run tsc and eslint in CI

Extending & Contributing
- To add a new ad provider:
  1) Create a small AdUnitRaw instance with the provider's HTML snippet
  2) Add a line to ads.txt for verification
- To add a new AMP page:
  - Implement a new Next.js route (GET) under app/amp-<name>/route.ts and return AMP_HTML with the proper amp-ad blocks

Appendix: Quick Tips
- If you want to revert the AMP link toggle, set NEXT_PUBLIC_SHOW_AMP_LINK to 0 or remove the gating in app/page.tsx.
- For brand assets, provide a logo and color tokens to align all pages; I can wire Tailwind theming if you’d like.
