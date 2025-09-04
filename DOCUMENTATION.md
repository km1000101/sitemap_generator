# Sitemap Generator - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Service API](#service-api)
5. [Data Model](#data-model)
6. [Export Formats](#export-formats)
7. [Development Guide](#development-guide)
8. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Overview

Sitemap Generator is a client-side React application that crawls a website, builds a hierarchical structure, and provides:

- Interactive visualization of site structure (D3.js)
- Meta tag analysis and structural insights
- One‑click exports (XML/JSON/CSV) and snapshotting (image/PDF)

### Core features
- Start from a URL, set crawl limits (depth, pages), and throttle with delay.
- Respect `robots.txt` (toggle) and skip external links (toggle).
- Extract titles, meta tags, and basic content stats.
- Visualize as a graph/tree and as a hierarchical list.
- Export search‑engine‑friendly XML with additional annotations.

### Tech stack
- React 18, TypeScript
- D3.js for visualization
- Tailwind CSS for styling
- Axios + Cheerio for fetching and parsing

### When to use
- Quickly map small to medium sites from a browser.
- Audit meta tags and basic structure for SEO or IA tasks.

### Limitations
- Browser CORS restrictions may block some sites.
- Authenticated or heavily client‑rendered content may be incomplete.
- Large sites should use server‑side crawlers or proxies.

---

## Architecture

### High level
- `src/App.tsx` orchestrates crawling, progress, and views.
- `src/services/sitemapService.ts` performs crawling, parsing, and analysis.
- `src/components/*` renders input, options, visualizations, lists, analysis, and exports.
- `src/types/index.ts` defines the domain model.

### Data flow
1. User enters URL in `UrlInput` and starts crawl.
2. `App` calls `sitemapService.crawlWebsite(url, options, onProgress)`.
3. Service fetches pages (Axios), parses HTML (Cheerio), extracts data, enqueues internal links.
4. Progress updates emit `CrawlProgress` back to `App` for UI updates.
5. When done, `SitemapData` (nodes + analyses) is stored in `App` state.
6. Views (`SitemapVisualizer`, `SitemapList`, `MetaAnalysis`, `StructureAnalysis`) render from state.

### Key modules
- `sitemapService.crawlWebsite`: BFS crawl loop with queue, depth/page limits, delay, and abort.
- `sitemapService.crawlPage`: Fetch + parse page, extract title, meta, content metrics, and links.
- `sitemapService.generateMetaAnalysis`: Aggregates meta coverage and estimates an SEO score.
- `sitemapService.generateStructureAnalysis`: Depth, link/image counts, type distribution.
- `sitemapService.generateXMLSitemap`: Output annotated XML sitemap.

### Concurrency and control
- Single crawl at a time (`isCrawling` guard); cancel via `abortController`.
- Optional delay between requests to be polite.

### Visualization
- `SitemapVisualizer` uses D3 to draw an interactive tree/force layout.
- `SitemapList` renders a collapsible hierarchy and enables open-in-new-tab.

### Styling
- Tailwind CSS utility classes with custom palette (dark blue, brand blue, white tints).

---

## Components

### `UrlInput`
- Accepts a URL and initiates `handleStartCrawl`.
- Disables while crawling; shows loading state.

### `CrawlOptions`
- Edits `CrawlOptions` in `App` (depth, pages, delay, toggles).
- Disables during crawl to prevent changes mid-run.

### `ProgressBar`
- Displays `CrawlProgress` (current URL, depth, pages crawled, completion).

### `SitemapVisualizer`
- D3-based tree/graph rendering from `SitemapData.nodes`.
- Props: `data`, `width`, `height`.

### `SitemapList`
- Hierarchical list of nodes with click-to-open URLs.
- Prop: `nodes`.

### `MetaAnalysis`
- Renders aggregated meta tag coverage and averages from `MetaAnalysis`.

### `StructureAnalysis`
- Shows depth distribution, link/images counts, word counts.

### `ExportOptions`
- Buttons for XML/JSON/CSV exports; image/PDF snapshotting.

### `AnimatedMapBackground` and `RealisticIcons`
- Visual polish elements.

---

## Service API

### `sitemapService`

#### `crawlWebsite(startUrl, options, onProgress?) => Promise<SitemapData>`
- Starts a crawl from `startUrl` with `CrawlOptions`.
- Optional `onProgress(CrawlProgress)` callback.
- Returns `SitemapData` including nodes and analyses.
- Throws if a crawl is already running.

#### `stopCrawling() => void`
- Aborts the current crawl (if any).

#### `isCurrentlyCrawling() => boolean`
- Returns current crawling state.

#### `generateXMLSitemap(nodes: SitemapNode[]) => string`
- Produces XML sitemap for completed nodes with annotations like priority, changefreq, and select meta.

### Types (from `types/index.ts`)

Key interfaces:
- `SitemapNode`: page data (title, depth, status, meta/content metrics, children).
- `CrawlOptions`: crawl configuration (depth, pages, delay, toggles).
- `SitemapData`: crawl result aggregate.
- `CrawlProgress`: progress callback payload.
- `MetaAnalysis`, `StructureAnalysis`: aggregates for analysis views.

---

## Data Model

### `SitemapNode`
Fields include:
- `url`, `title`, `depth`, `status: 'pending' | 'crawling' | 'completed' | 'error'`
- `children: SitemapNode[]`, optional `parent`
- HTTP metadata: `lastModified`, `contentType`
- Meta tags: `metaTags` (title, description, keywords, Open Graph, Twitter, canonical, robots, language, charset, etc.)
- Content metrics: `wordCount`, `internalLinks`, `externalLinks`, `images`, `h1Tags`, `h2Tags`, `h3Tags`

### `CrawlOptions`
- `maxDepth`, `maxPages`, `delay`
- `includeExternalLinks`, `includeImages`, `respectRobotsTxt`
- `extractMetaTags`, `analyzeContent`, `includeSocialMedia`, `includeSchemaMarkup`

### `SitemapData`
- `nodes: SitemapNode[]`
- Totals: `totalPages`, `totalImages`, `totalExternalLinks`
- `crawlTime` (ms), `generatedAt` (ISO)
- Optional `metaAnalysis`, `structureAnalysis`

### `CrawlProgress`
- `currentUrl`, `currentDepth`, `pagesCrawled`, `totalPages`, `isComplete`
- Optional `currentMetaTags`, `currentContentAnalysis`

---

## Export Formats

### XML sitemap
- Generated by `sitemapService.generateXMLSitemap(nodes)`.
- Includes `<loc>`, `<lastmod>`, `<priority>`, `<changefreq>`.
- Adds optional annotations when available: `<description>`, `<keywords>`, `<canonical>`, `<robots>`, content type and counts.

### JSON
- Full `SitemapData` structure (nodes, totals, analyses).

### CSV
- Flat rows: `URL,Title,Depth,Status,Last Modified` plus descendants recursively.

### Snapshots (UI)
- Image/PDF captured via `html2canvas` + `jspdf` from the visualization area.

---

## Development Guide

### Requirements
- Node.js 18+
- npm

### Setup
```bash
npm install
npm start
```

### Scripts
- `npm start`: CRA dev server on port 3000
- `npm run build`: Production build to `build/`
- `npm test`: CRA tests

### Code style
- TypeScript, explicit interfaces in `types/`.
- Prefer early returns and shallow nesting.
- Keep components presentational; service hosts logic.

### Project structure
See `README.md` and architecture section above.

### Common tasks
- Add a new component under `src/components/`.
- Extend `SitemapNode`/`CrawlOptions` in `types/index.ts`.
- Update service extraction/analysis in `services/sitemapService.ts`.

### Releasing
- Build (`npm run build`).
- Serve `build/` or deploy to static hosting.

---

## Troubleshooting & FAQ

### Requests fail with CORS/network errors
- Many sites block cross-origin fetches in browsers. Try another domain, lower the rate (`delay`), or use a simple proxy/server-side crawl for strict sites.

### Visualization is empty
- Ensure the URL is valid and reachable.
- Reduce `maxDepth`/`maxPages` to keep the graph manageable.
- Check the browser console for errors.

### Crawl stalls or is slow
- Increase `delay` for politeness; reduce `maxPages`.
- Some sites have heavy pages or rate limiting.

### Meta/Structure analysis tabs show unavailable
- Enable `extractMetaTags` and `analyzeContent` in options before crawling.

### What about robots.txt?
- When toggled on, disallowed paths are skipped. Always respect site policies.

### Can it crawl authenticated areas?
- Not reliably from the browser. Use a server-side crawler for auth-gated sites.

---

*This documentation covers all aspects of the Sitemap Generator project. For quick setup instructions, see the main README.md file.*
