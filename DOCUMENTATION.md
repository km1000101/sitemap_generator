# Sitemap Generator - Complete Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Service API](#service-api)
5. [Data Model](#data-model)
6. [Export Formats](#export-formats)
7. [Development Guide](#development-guide)
8. [Troubleshooting & FAQ](#troubleshooting--faq)
9. [Technical Deep Dive](#technical-deep-dive)

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

## Technical Deep Dive

### Core Technology Stack
- **Frontend**: React 18 + TypeScript
- **Visualization**: D3.js v7.8.0 for interactive tree/graph rendering
- **Styling**: Tailwind CSS with custom design system
- **HTTP Client**: Axios for web requests
- **HTML Parsing**: Cheerio (server-side jQuery-like library for Node.js)
- **Export**: html2canvas + jsPDF for image/PDF generation
- **Icons**: Lucide React + custom realistic icons

### Project Structure
```
src/
├── App.tsx                 # Main orchestrator component
├── services/
│   └── sitemapService.ts   # Core crawling & analysis logic
├── components/             # UI components
├── types/index.ts         # TypeScript interfaces
├── utils/index.ts         # Utility functions
└── constants/index.ts     # App constants
```

### SitemapService Class Architecture

The heart of the application is a singleton service class that handles:

#### 1. Crawling Engine
```typescript
async crawlWebsite(startUrl: string, options: CrawlOptions, onProgress?: (progress: CrawlProgress) => void): Promise<SitemapData>
```

**BFS (Breadth-First Search) Implementation:**
- Uses a queue-based approach: `crawlQueue: Array<{ url: string; depth: number; parent?: SitemapNode }>`
- Tracks visited URLs with `Set<string>` to prevent duplicates
- Respects depth limits and page limits
- Implements configurable delays between requests
- Supports cancellation via `AbortController`

#### 2. Page Processing Pipeline
For each page, the service:

1. **Fetches** with Axios (10s timeout, custom User-Agent)
2. **Parses** HTML with Cheerio
3. **Extracts** comprehensive data:
   - Title (with fallbacks: `<title>` → `<h1>` → URL path → "Untitled Page")
   - Meta tags (60+ different meta properties)
   - Content analysis (word count, headings, links, images)
   - HTTP headers (last-modified, content-type)
4. **Discovers** internal links for further crawling
5. **Builds** hierarchical node structure

#### 3. Meta Tag Extraction
Extracts 60+ meta properties including:
- **Basic SEO**: title, description, keywords, author, viewport
- **Open Graph**: og:title, og:description, og:image, og:type, og:url
- **Twitter Cards**: twitter:card, twitter:title, twitter:description
- **Technical**: robots, canonical, language, charset
- **Mobile**: apple-mobile-web-app-*, format-detection
- **Advanced**: theme-color, color-scheme, msapplication-*

#### 4. Content Analysis
- **Word counting** (removes scripts/styles first)
- **Link analysis** (internal vs external)
- **Heading structure** (H1, H2, H3 counts)
- **Image counting**
- **Content type distribution**

### UI Components Deep Dive

#### 1. SitemapVisualizer (D3.js Tree)
**Most complex component** - 915 lines of sophisticated D3.js visualization:

**Visual Design**
- **Card-based nodes** (170×180px base, auto-expanding)
- **Color-coded sections**:
  - Header: White dots + single-word title
  - Title section: Purple background
  - Description section: Blue background  
  - Footer: Green background with hostname
- **Status indicators**: Pending (orange), Completed (green), Crawling (blue), Error (red)

**Interactive Features**
- **Zoom & Pan**: Mouse wheel zoom (0.1x-5x), drag to pan
- **Inline editing**: Double-click title/description to edit
- **Node management**: Add/delete child nodes
- **Rich tooltips**: Hover for detailed page information
- **Export**: PNG/PDF download with pagination

**D3.js Implementation**
```typescript
// Tree layout with custom spacing
const treeLayout = d3.tree<SitemapNode>()
  .nodeSize([cardHeight + verticalGap, cardWidth + horizontalGap])
  .separation((a, b) => (a.parent === b.parent ? 1.4 : 1.8));

// Curved connectors between nodes
.attr('d', d => {
  const source = { x: d.source.x, y: d.source.y + cardWidth / 2 };
  const target = { x: d.target.x, y: d.target.y - cardWidth / 2 };
  const midY = (source.y + target.y) / 2;
  return `M${source.y},${source.x} C${midY},${source.x} ${midY},${target.x} ${target.y},${target.x}`;
})
```

#### 2. MetaAnalysis Component
**SEO Intelligence Dashboard**:
- **Overall SEO Score** (0-100) based on meta tag completeness
- **Coverage metrics** for titles, descriptions, keywords, canonical URLs
- **Social media analysis** (Open Graph, Twitter Cards)
- **Content optimization** insights (title/description length averages)
- **Common keywords** extraction and frequency analysis
- **Missing meta tags** identification
- **Actionable recommendations** for SEO improvements

#### 3. ExportOptions Component
**Multi-format Export System**:

**XML Sitemap Generation**
```typescript
generateXMLSitemap(nodes: SitemapNode[]): string {
  // Standard XML sitemap with extensions
  // Includes: <loc>, <lastmod>, <priority>, <changefreq>
  // Custom annotations: <description>, <keywords>, <canonical>, <robots>
  // Content metrics: <word-count>, <internal-links>, <images>, <h1-tags>
}
```

**Export Formats**
- **XML**: Search engine standard with custom annotations
- **JSON**: Full structured data for developers/APIs
- **CSV**: Flat spreadsheet format for analysis
- **PNG/PDF**: Visual tree snapshots with pagination

### Design System

#### Custom Tailwind Configuration
```javascript
colors: {
  'dark-blue': { 800: '#0A1128' },      // Deep navy background
  'brand-blue': { 500: '#007bff' },     // Primary brand color
  'white': { 500: '#ffffff' },          // Text color
  accent: { 400: '#F77C21', 500: '#F55C00' }, // Orange accents
  success: { 500: '#22c55e' },          // Green for completed
  warning: { 500: '#f59e0b' }           // Yellow for warnings
}
```

#### Visual Effects
- **Backdrop blur**: `backdrop-blur-lg` for glass morphism
- **Gradient overlays**: Subtle gradients on interactive elements
- **Custom shadows**: `shadow-soft`, `shadow-medium`, `shadow-large`, `shadow-glow`
- **Animations**: `fade-in`, `slide-up`, `bounce-gentle`, `pulse-gentle`
- **Transform effects**: Hover scale, rotation on icons

#### AnimatedMapBackground
**Sophisticated SVG background**:
- **Radial gradient** from deep blue to darker navy
- **Grid pattern** simulating latitude/longitude lines
- **Continental silhouettes** with low opacity
- **Animated data arcs** with moving dots (7-8s cycles)
- **CSS animations** for subtle movement effects

### Performance & Optimization

#### Crawling Optimizations
- **Request throttling**: Configurable delays (default 100ms)
- **AbortController**: Cancellation support
- **Memory management**: Efficient node tree structure
- **Progress callbacks**: Real-time UI updates

#### Visualization Performance
- **D3.js optimizations**: Efficient tree layout algorithms
- **SVG rendering**: Hardware-accelerated graphics
- **Zoom controls**: Smooth transitions with transform matrices
- **Memory cleanup**: Proper event listener removal

#### Export Performance
- **html2canvas**: High-resolution rendering (3-4x scale)
- **PDF pagination**: Automatic page breaks for large visualizations
- **Blob URLs**: Efficient file download handling

### Error Handling & Edge Cases

#### Crawling Resilience
- **Network errors**: Graceful handling with error nodes
- **Invalid URLs**: Validation and protocol auto-correction
- **CORS restrictions**: Clear error messaging
- **Timeout handling**: 10-second request timeouts
- **Malformed HTML**: Cheerio's robust parsing

#### UI Error States
- **Loading states**: Spinners and progress indicators
- **Error boundaries**: Graceful component error handling
- **Validation**: URL format validation with helpful messages
- **Empty states**: Meaningful messages when no data available

### Advanced Features

#### 1. Real-time Progress Tracking
```typescript
interface CrawlProgress {
  currentUrl: string;
  currentDepth: number;
  pagesCrawled: number;
  totalPages: number;
  isComplete: boolean;
  currentMetaTags?: MetaTags;
  currentContentAnalysis?: ContentAnalysis;
}
```

#### 2. SEO Analysis Engine
- **Automated scoring** based on meta tag completeness
- **Best practice recommendations**
- **Content optimization suggestions**
- **Social media readiness assessment**

#### 3. Interactive Visualization
- **Live editing** of node titles and descriptions
- **Dynamic node management** (add/delete)
- **Contextual tooltips** with rich metadata
- **Export capabilities** for presentations

#### 4. Multi-format Export
- **Industry-standard XML** sitemaps
- **Developer-friendly JSON** with full metadata
- **Analysis-ready CSV** for spreadsheet tools
- **High-quality visual exports** (PNG/PDF)

### Use Cases & Limitations

#### Ideal For
- **Small to medium websites** (up to 1000 pages)
- **SEO audits** and meta tag analysis
- **Information architecture** planning
- **Developer documentation** of site structure
- **Client presentations** with visual sitemaps

#### Limitations
- **Browser CORS restrictions** may block some sites
- **Client-side only** - no server-side crawling
- **JavaScript-heavy sites** may have incomplete content
- **Authentication-required** areas not accessible
- **Rate limiting** from target sites

#### Technical Constraints
- **Memory limits** for very large sites
- **Browser timeout** restrictions
- **Network reliability** dependencies
- **Single-threaded** crawling (no parallel requests)

---

*This documentation covers all aspects of the Sitemap Generator project. For quick setup instructions, see the main README.md file.*
