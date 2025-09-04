# Sitemap Generator

Modern, browser-based sitemap generator with interactive visualization. Built with React, TypeScript, D3.js, and Tailwind CSS.

### Highlights
- **Web crawler**: Discovers internal links and builds a tree
- **Visual sitemap**: D3.js force/tree view and a hierarchical list
- **Exports**: XML, JSON, CSV (and image/PDF via `html2canvas` + `jspdf`)
- **Controls**: Depth/page limits, delay, external links toggle, robots.txt
- **Progress**: Real‑time crawl status and cancel support

## Quick start

Prerequisites:
- Node.js 16+ (18+ recommended)
- npm (comes with Node)

Clone and run locally:
```bash
git clone <your-repo-url> sitemap_generator
cd sitemap_generator
npm install
npm start
```
Open `http://localhost:3000`.

Production build:
```bash
npm run build
```

## How to use
1. Enter a fully qualified URL (e.g., `https://example.com`).
2. Adjust crawl options (depth, max pages, delay, external links, robots).
3. Start crawl and watch progress.
4. Explore results in the visual map and list.
5. Export sitemap as XML/JSON/CSV or save a snapshot.

## Crawl options
- **Max depth**: Limits traversal depth from the start URL
- **Max pages**: Hard cap on number of pages to crawl
- **Delay (ms)**: Throttle between requests
- **Include external links**: Follow off‑domain links when enabled
- **Respect robots.txt**: Avoid URLs disallowed by site rules

## Exports
- **XML**: Search‑engine friendly sitemap format
- **JSON**: Raw structured data of nodes/edges
- **CSV**: Flat list for spreadsheet analysis

## Architecture
- **React 18 + TypeScript** UI
- **Tailwind CSS** for styling
- **D3.js** for interactive visualization
- **Axios** for HTTP requests
- **Cheerio** for HTML parsing
- **html2canvas + jsPDF** for snapshots/exports

Key modules:
- `src/services/sitemapService.ts`: Crawl + sitemap generation
- `src/components/SitemapVisualizer.tsx`: D3 visualization
- `src/components/SitemapList.tsx`: Hierarchical list view
- `src/components/CrawlOptions.tsx`: Crawl settings UI
- `src/components/ExportOptions.tsx`: Export controls

## Project structure
```
src/
├─ components/           # UI components
├─ services/             # Crawling and domain logic (e.g., sitemapService)
├─ hooks/                # Reusable React hooks (scaffolded)
├─ utils/                # Utilities/helpers (scaffolded)
├─ constants/            # App-wide constants (scaffolded)
├─ types/                # TypeScript types (barrel: src/types/index.ts)
├─ App.tsx               # Root component
└─ index.tsx             # Entry point
```

Absolute imports are enabled with `baseUrl: "src"`. Example:
```ts
// before
import { SitemapData } from '../types';
// after
import { SitemapData } from 'types';
```

## Available scripts
- `npm start` — start development server
- `npm run build` — create production build
- `npm test` — run tests (CRA)
- `npm run eject` — eject CRA config

## Notes, limitations, and tips
- **CORS**: Crawling from the browser is subject to target site CORS and may fail if the site blocks cross‑origin requests. For strict sites, consider running a simple proxy or a server‑side crawler.
- **robots.txt**: When enabled, disallowed paths are skipped. Always respect site policies and terms.
- **Politeness**: Use delays and sensible page limits. Do not crawl aggressively.
- **Authentication**: Auth‑gated content and client‑side apps behind dynamic routes may not be fully discoverable.

## Troubleshooting
- Requests fail immediately with network/CORS errors:
  - Try a different domain, lower rate, or use a development proxy.
- Visual map appears empty:
  - Verify the start URL, reduce depth, check console for blocked requests.
- Build issues on older Node:
  - Use Node 18+ and reinstall dependencies (`rm -rf node_modules && npm install`).

## Browser support
- Latest Chrome, Edge, Firefox, Safari

## Contributing
1. Fork the repo and create a feature branch.
2. Make changes with TypeScript types and tests where relevant.
3. Run `npm start` locally and ensure no console errors.
4. Open a PR with a concise description and screenshots if UI changes.

## License
MIT

---
This tool is for legitimate SEO/site‑mapping purposes. Respect `robots.txt`, terms of service, and rate limits.
