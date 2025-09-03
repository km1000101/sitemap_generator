export interface SitemapNode {
  url: string;
  title: string;
  depth: number;
  children: SitemapNode[];
  parent?: SitemapNode;
  status: 'pending' | 'crawling' | 'completed' | 'error';
  error?: string;
  lastModified?: string;
  priority?: number;
  metaTags?: MetaTags;
  contentType?: string;
  wordCount?: number;
  internalLinks?: number;
  externalLinks?: number;
  images?: number;
  h1Tags?: number;
  h2Tags?: number;
  h3Tags?: number;
  canonicalUrl?: string;
  robotsMeta?: string;
  language?: string;
  charset?: string;
}

export interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  viewport?: string;
  robots?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  language?: string;
  charset?: string;
  refresh?: string;
  noindex?: boolean;
  nofollow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  unavailable_after?: string;
  rating?: string;
  referrer?: string;
  generator?: string;
  themeColor?: string;
  colorScheme?: string;
  msapplicationTileColor?: string;
  appleMobileWebAppTitle?: string;
  appleMobileWebAppCapable?: boolean;
  appleMobileWebAppStatusBarStyle?: string;
  formatDetection?: string;
  mobileOptimized?: string;
  handheldFriendly?: boolean;
}

export interface CrawlOptions {
  maxDepth: number;
  maxPages: number;
  includeImages: boolean;
  includeExternalLinks: boolean;
  respectRobotsTxt: boolean;
  delay: number;
  extractMetaTags: boolean;
  analyzeContent: boolean;
  includeSocialMedia: boolean;
  includeSchemaMarkup: boolean;
}

export interface SitemapData {
  nodes: SitemapNode[];
  totalPages: number;
  totalImages: number;
  totalExternalLinks: number;
  crawlTime: number;
  generatedAt: string;
  metaAnalysis?: MetaAnalysis;
  structureAnalysis?: StructureAnalysis;
}

export interface MetaAnalysis {
  totalPages: number;
  pagesWithTitle: number;
  pagesWithDescription: number;
  pagesWithKeywords: number;
  pagesWithOpenGraph: number;
  pagesWithTwitterCards: number;
  pagesWithCanonical: number;
  pagesWithRobotsMeta: number;
  averageTitleLength: number;
  averageDescriptionLength: number;
  commonKeywords: Array<{ keyword: string; count: number }>;
  missingMetaTags: string[];
  seoScore: number;
}

export interface StructureAnalysis {
  totalDepth: number;
  averageDepth: number;
  maxDepth: number;
  depthDistribution: Record<number, number>;
  internalLinkCount: number;
  externalLinkCount: number;
  imageCount: number;
  contentTypeDistribution: Record<string, number>;
  h1TagCount: number;
  h2TagCount: number;
  h3TagCount: number;
  averageWordCount: number;
  orphanedPages: string[];
  circularReferences: string[];
  brokenLinks: string[];
}

export interface CrawlProgress {
  currentUrl: string;
  currentDepth: number;
  pagesCrawled: number;
  totalPages: number;
  isComplete: boolean;
  currentMetaTags?: MetaTags;
  currentContentAnalysis?: {
    wordCount: number;
    internalLinks: number;
    externalLinks: number;
    images: number;
    h1Tags: number;
    h2Tags: number;
    h3Tags: number;
  };
}
