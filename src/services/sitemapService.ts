import axios from 'axios';
import * as cheerio from 'cheerio';
import { SitemapNode, CrawlOptions, SitemapData, CrawlProgress, MetaTags, MetaAnalysis, StructureAnalysis } from '../types';

class SitemapService {
  private visitedUrls = new Set<string>();
  private crawlQueue: Array<{ url: string; depth: number; parent?: SitemapNode }> = [];
  private isCrawling = false;
  private abortController?: AbortController;

  async crawlWebsite(
    startUrl: string,
    options: CrawlOptions,
    onProgress?: (progress: CrawlProgress) => void
  ): Promise<SitemapData> {
    if (this.isCrawling) {
      throw new Error('Crawl already in progress');
    }

    this.isCrawling = true;
    this.visitedUrls.clear();
    this.crawlQueue = [];
    this.abortController = new AbortController();

    const startTime = Date.now();
    const rootNode: SitemapNode = {
      url: startUrl,
      title: 'Root',
      depth: 0,
      children: [],
      status: 'pending'
    };

    this.crawlQueue.push({ url: startUrl, depth: 0, parent: rootNode });

    try {
      while (this.crawlQueue.length > 0 && this.visitedUrls.size < options.maxPages) {
        const { url, depth, parent } = this.crawlQueue.shift()!;
        
        if (this.visitedUrls.has(url) || depth > options.maxDepth) {
          continue;
        }

        this.visitedUrls.add(url);

        if (onProgress) {
          onProgress({
            currentUrl: url,
            currentDepth: depth,
            pagesCrawled: this.visitedUrls.size,
            totalPages: options.maxPages,
            isComplete: false
          });
        }

        try {
          const node = await this.crawlPage(url, depth, parent, options);
          if (parent && node) {
            parent.children.push(node);
          }
        } catch (error) {
          console.error(`Error crawling ${url}:`, error);
          if (parent) {
            // Try to extract a meaningful title from URL even for error cases
            let errorTitle = 'Error';
            try {
              const urlPath = new URL(url).pathname;
              const pathSegments = urlPath.split('/').filter(segment => segment.length > 0);
              if (pathSegments.length > 0) {
                const lastSegment = pathSegments[pathSegments.length - 1];
                errorTitle = lastSegment.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
                errorTitle = errorTitle.charAt(0).toUpperCase() + errorTitle.slice(1);
              }
            } catch (e) {
              // Keep default error title
            }
            
            parent.children.push({
              url,
              title: errorTitle,
              depth,
              children: [],
              parent,
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        // Add delay between requests
        if (options.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, options.delay));
        }
      }
    } finally {
      this.isCrawling = false;
    }

    const endTime = Date.now();
    const crawlTime = endTime - startTime;

    if (onProgress) {
      onProgress({
        currentUrl: '',
        currentDepth: 0,
        pagesCrawled: this.visitedUrls.size,
        totalPages: options.maxPages,
        isComplete: true
      });
    }

    // Ensure root node has completed status if it was crawled
    if (rootNode.children.length > 0) {
      rootNode.status = 'completed';
    }

    // Generate analysis data
    const metaAnalysis = this.generateMetaAnalysis([rootNode]);
    const structureAnalysis = this.generateStructureAnalysis([rootNode]);

    return {
      nodes: [rootNode],
      totalPages: this.visitedUrls.size,
      totalImages: structureAnalysis.imageCount,
      totalExternalLinks: structureAnalysis.externalLinkCount,
      crawlTime,
      generatedAt: new Date().toISOString(),
      metaAnalysis,
      structureAnalysis
    };
  }

  private async crawlPage(
    url: string,
    depth: number,
    parent?: SitemapNode,
    options?: CrawlOptions
  ): Promise<SitemapNode> {
    const node: SitemapNode = {
      url,
      title: '',
      depth,
      children: [],
      parent,
      status: 'crawling'
    };

    try {
      const response = await axios.get(url, {
        signal: this.abortController?.signal,
        timeout: 10000,
        headers: {
          'User-Agent': 'SitemapGenerator/1.0'
        }
      });

      const $ = cheerio.load(response.data);
      let title = $('title').first().text().trim();
      
      // If no title found, try to extract from h1 tag
      if (!title) {
        title = $('h1').first().text().trim();
      }
      
      // If still no title, try to extract from URL path
      if (!title) {
        try {
          const urlPath = new URL(url).pathname;
          const pathSegments = urlPath.split('/').filter(segment => segment.length > 0);
          if (pathSegments.length > 0) {
            // Use the last meaningful segment of the URL path
            const lastSegment = pathSegments[pathSegments.length - 1];
            title = lastSegment.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ''); // Remove file extension
            title = title.charAt(0).toUpperCase() + title.slice(1); // Capitalize first letter
          }
        } catch (e) {
          // URL parsing failed, continue with fallback
        }
      }
      
      // Final fallback
      if (!title) {
        title = 'Untitled Page';
      }
      
      node.title = title;
      node.status = 'completed';
      node.lastModified = response.headers['last-modified'];
      node.contentType = response.headers['content-type']?.split(';')[0] || 'text/html';

      // Extract meta tags if enabled
      if (options?.extractMetaTags) {
        node.metaTags = this.extractMetaTags($);
        node.language = node.metaTags.language;
        node.charset = node.metaTags.charset;
        node.canonicalUrl = node.metaTags.canonical;
        node.robotsMeta = node.metaTags.robots;
      }

      // Analyze content if enabled
      if (options?.analyzeContent) {
        const contentAnalysis = this.analyzeContent($, url);
        node.wordCount = contentAnalysis.wordCount;
        node.internalLinks = contentAnalysis.internalLinks;
        node.externalLinks = contentAnalysis.externalLinks;
        node.images = contentAnalysis.images;
        node.h1Tags = contentAnalysis.h1Tags;
        node.h2Tags = contentAnalysis.h2Tags;
        node.h3Tags = contentAnalysis.h3Tags;
      }

      // Extract links for further crawling
      if (depth < (options?.maxDepth || 3)) {
        const links = $('a[href]').map((_, el) => $(el).attr('href')).get();
        
        for (const link of links) {
          if (link && this.isValidInternalLink(link, url)) {
            const absoluteUrl = new URL(link, url).href;
            if (!this.visitedUrls.has(absoluteUrl)) {
              this.crawlQueue.push({
                url: absoluteUrl,
                depth: depth + 1,
                parent: node
              });
            }
          }
        }
      }

      // Update progress with current analysis
      if (options?.analyzeContent) {
        const contentAnalysis = this.analyzeContent($, url);
        // This would be passed to onProgress if we had access to it here
      }

    } catch (error) {
      node.status = 'error';
      node.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return node;
  }

  private extractMetaTags($: any): MetaTags {
    const metaTags: MetaTags = {};

    // Basic meta tags
    metaTags.title = $('title').first().text().trim();
    metaTags.description = $('meta[name="description"]').attr('content');
    metaTags.keywords = $('meta[name="keywords"]').attr('content')?.split(',').map((k: string) => k.trim()) || [];
    metaTags.author = $('meta[name="author"]').attr('content');
    metaTags.viewport = $('meta[name="viewport"]').attr('content');
    metaTags.robots = $('meta[name="robots"]').attr('content');
    metaTags.canonical = $('link[rel="canonical"]').attr('href');
    metaTags.language = $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content');
    metaTags.charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="content-type"]').attr('content');

    // Open Graph tags
    metaTags.ogTitle = $('meta[property="og:title"]').attr('content');
    metaTags.ogDescription = $('meta[property="og:description"]').attr('content');
    metaTags.ogImage = $('meta[property="og:image"]').attr('content');
    metaTags.ogType = $('meta[property="og:type"]').attr('content');
    metaTags.ogUrl = $('meta[property="og:url"]').attr('content');

    // Twitter Card tags
    metaTags.twitterCard = $('meta[name="twitter:card"]').attr('content');
    metaTags.twitterTitle = $('meta[name="twitter:title"]').attr('content');
    metaTags.twitterDescription = $('meta[name="twitter:description"]').attr('content');
    metaTags.twitterImage = $('meta[name="twitter:image"]').attr('content');

    // Additional meta tags
    metaTags.refresh = $('meta[http-equiv="refresh"]').attr('content');
    metaTags.rating = $('meta[name="rating"]').attr('content');
    metaTags.referrer = $('meta[name="referrer"]').attr('content');
    metaTags.generator = $('meta[name="generator"]').attr('content');
    metaTags.themeColor = $('meta[name="theme-color"]').attr('content');
    metaTags.colorScheme = $('meta[name="color-scheme"]').attr('content');
    metaTags.msapplicationTileColor = $('meta[name="msapplication-TileColor"]').attr('content');
    metaTags.appleMobileWebAppTitle = $('meta[name="apple-mobile-web-app-title"]').attr('content');
    metaTags.appleMobileWebAppCapable = $('meta[name="apple-mobile-web-app-capable"]').attr('content') === 'yes';
    metaTags.appleMobileWebAppStatusBarStyle = $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content');
    metaTags.formatDetection = $('meta[name="format-detection"]').attr('content');
    metaTags.mobileOptimized = $('meta[name="MobileOptimized"]').attr('content');
    metaTags.handheldFriendly = $('meta[name="HandheldFriendly"]').attr('content') === 'true';

    // Parse robots meta for boolean flags
    if (metaTags.robots) {
      const robots = metaTags.robots.toLowerCase();
      metaTags.noindex = robots.includes('noindex');
      metaTags.nofollow = robots.includes('nofollow');
      metaTags.noarchive = robots.includes('noarchive');
      metaTags.nosnippet = robots.includes('nosnippet');
      metaTags.noimageindex = robots.includes('noimageindex');
    }

    return metaTags;
  }

  private analyzeContent($: any, baseUrl: string) {
    // Remove script and style elements for text analysis
    $('script, style, noscript').remove();
    
    const bodyText = $('body').text();
    const wordCount = bodyText.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
    
    // Parse base URL to get the origin
    const urlOrigin = new URL(baseUrl).origin;
    
    const internalLinks = $('a[href^="/"], a[href^="' + urlOrigin + '"]').length;
    const externalLinks = $('a[href^="http"]').not('[href^="' + urlOrigin + '"]').length;
    const images = $('img').length;
    const h1Tags = $('h1').length;
    const h2Tags = $('h2').length;
    const h3Tags = $('h3').length;

    return {
      wordCount,
      internalLinks,
      externalLinks,
      images,
      h1Tags,
      h2Tags,
      h3Tags
    };
  }

  private generateMetaAnalysis(nodes: SitemapNode[]): MetaAnalysis {
    const completedNodes = this.flattenNodes(nodes).filter(n => n.status === 'completed' && n.metaTags);
    const totalPages = completedNodes.length;

    if (totalPages === 0) {
      return {
        totalPages: 0,
        pagesWithTitle: 0,
        pagesWithDescription: 0,
        pagesWithKeywords: 0,
        pagesWithOpenGraph: 0,
        pagesWithTwitterCards: 0,
        pagesWithCanonical: 0,
        pagesWithRobotsMeta: 0,
        averageTitleLength: 0,
        averageDescriptionLength: 0,
        commonKeywords: [],
        missingMetaTags: [],
        seoScore: 0
      };
    }

    const pagesWithTitle = completedNodes.filter(n => n.metaTags?.title).length;
    const pagesWithDescription = completedNodes.filter(n => n.metaTags?.description).length;
    const pagesWithKeywords = completedNodes.filter(n => n.metaTags?.keywords && n.metaTags.keywords.length > 0).length;
    const pagesWithOpenGraph = completedNodes.filter(n => n.metaTags?.ogTitle || n.metaTags?.ogDescription).length;
    const pagesWithTwitterCards = completedNodes.filter(n => n.metaTags?.twitterCard).length;
    const pagesWithCanonical = completedNodes.filter(n => n.metaTags?.canonical).length;
    const pagesWithRobotsMeta = completedNodes.filter(n => n.metaTags?.robots).length;

    const titleLengths = completedNodes
      .filter(n => n.metaTags?.title)
      .map(n => n.metaTags!.title!.length);
    const averageTitleLength = titleLengths.length > 0 
      ? titleLengths.reduce((a, b) => a + b, 0) / titleLengths.length 
      : 0;

    const descriptionLengths = completedNodes
      .filter(n => n.metaTags?.description)
      .map(n => n.metaTags!.description!.length);
    const averageDescriptionLength = descriptionLengths.length > 0 
      ? descriptionLengths.reduce((a, b) => a + b, 0) / descriptionLengths.length 
      : 0;

    // Count common keywords
    const keywordCounts: Record<string, number> = {};
    completedNodes.forEach(n => {
      if (n.metaTags?.keywords) {
        n.metaTags.keywords.forEach(keyword => {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        });
      }
    });
    const commonKeywords = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Identify missing meta tags
    const missingMetaTags: string[] = [];
    if (pagesWithDescription / totalPages < 0.8) missingMetaTags.push('description');
    if (pagesWithKeywords / totalPages < 0.5) missingMetaTags.push('keywords');
    if (pagesWithOpenGraph / totalPages < 0.6) missingMetaTags.push('Open Graph');
    if (pagesWithCanonical / totalPages < 0.7) missingMetaTags.push('canonical');
    if (pagesWithRobotsMeta / totalPages < 0.5) missingMetaTags.push('robots');

    // Calculate SEO score (0-100)
    const seoScore = Math.round(
      (pagesWithTitle / totalPages) * 20 +
      (pagesWithDescription / totalPages) * 20 +
      (pagesWithKeywords / totalPages) * 15 +
      (pagesWithOpenGraph / totalPages) * 15 +
      (pagesWithCanonical / totalPages) * 15 +
      (pagesWithRobotsMeta / totalPages) * 15
    );

    return {
      totalPages,
      pagesWithTitle,
      pagesWithDescription,
      pagesWithKeywords,
      pagesWithOpenGraph,
      pagesWithTwitterCards,
      pagesWithCanonical,
      pagesWithRobotsMeta,
      averageTitleLength,
      averageDescriptionLength,
      commonKeywords,
      missingMetaTags,
      seoScore
    };
  }

  private generateStructureAnalysis(nodes: SitemapNode[]): StructureAnalysis {
    const allNodes = this.flattenNodes(nodes);
    const completedNodes = allNodes.filter(n => n.status === 'completed');
    
    const depths = completedNodes.map(n => n.depth);
    const maxDepth = Math.max(...depths, 0);
    const averageDepth = depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;
    
    const depthDistribution: Record<number, number> = {};
    depths.forEach(depth => {
      depthDistribution[depth] = (depthDistribution[depth] || 0) + 1;
    });

    const totalInternalLinks = completedNodes.reduce((sum, n) => sum + (n.internalLinks || 0), 0);
    const totalExternalLinks = completedNodes.reduce((sum, n) => sum + (n.externalLinks || 0), 0);
    const totalImages = completedNodes.reduce((sum, n) => sum + (n.images || 0), 0);
    const totalH1Tags = completedNodes.reduce((sum, n) => sum + (n.h1Tags || 0), 0);
    const totalH2Tags = completedNodes.reduce((sum, n) => sum + (n.h2Tags || 0), 0);
    const totalH3Tags = completedNodes.reduce((sum, n) => sum + (n.h3Tags || 0), 0);
    const totalWordCount = completedNodes.reduce((sum, n) => sum + (n.wordCount || 0), 0);
    const averageWordCount = completedNodes.length > 0 ? totalWordCount / completedNodes.length : 0;

    const contentTypeDistribution: Record<string, number> = {};
    completedNodes.forEach(n => {
      if (n.contentType) {
        contentTypeDistribution[n.contentType] = (contentTypeDistribution[n.contentType] || 0) + 1;
      }
    });

    // Find orphaned pages (no incoming links)
    const allUrls = new Set(completedNodes.map(n => n.url));
    const linkedUrls = new Set<string>();
    completedNodes.forEach(n => {
      if (n.children) {
        n.children.forEach(child => linkedUrls.add(child.url));
      }
    });
    const orphanedPages = Array.from(allUrls).filter(url => !linkedUrls.has(url));

    return {
      totalDepth: maxDepth,
      averageDepth,
      maxDepth,
      depthDistribution,
      internalLinkCount: totalInternalLinks,
      externalLinkCount: totalExternalLinks,
      imageCount: totalImages,
      contentTypeDistribution,
      h1TagCount: totalH1Tags,
      h2TagCount: totalH2Tags,
      h3TagCount: totalH3Tags,
      averageWordCount,
      orphanedPages,
      circularReferences: [], // TODO: Implement circular reference detection
      brokenLinks: [] // TODO: Implement broken link detection
    };
  }

  private flattenNodes(nodes: SitemapNode[]): SitemapNode[] {
    const result: SitemapNode[] = [];
    const flatten = (node: SitemapNode) => {
      result.push(node);
      node.children.forEach(flatten);
    };
    nodes.forEach(flatten);
    return result;
  }

  private isValidInternalLink(link: string, baseUrl: string): boolean {
    try {
      const url = new URL(link, baseUrl);
      const base = new URL(baseUrl);
      
      // Skip external links, anchors, javascript, mailto, etc.
      if (url.protocol !== base.protocol || url.hostname !== base.hostname) {
        return false;
      }
      
      if (link.startsWith('#') || link.startsWith('javascript:') || link.startsWith('mailto:')) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  generateXMLSitemap(nodes: SitemapNode[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
         xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
         xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${this.generateXMLNodes(nodes)}
</urlset>`;
    
    return xml;
  }

  private generateXMLNodes(nodes: SitemapNode[]): string {
    let xml = '';
    
    for (const node of nodes) {
      if (node.status === 'completed') {
        xml += `  <url>
    <loc>${this.escapeXML(node.url)}</loc>
    <title>${this.escapeXML(node.title)}</title>
    ${node.lastModified ? `<lastmod>${node.lastModified}</lastmod>` : ''}
    <priority>${node.depth === 0 ? '1.0' : Math.max(0.1, 1.0 - node.depth * 0.1).toFixed(1)}</priority>
    <changefreq>${this.getChangeFrequency(node)}</changefreq>
    ${node.metaTags?.description ? `<description>${this.escapeXML(node.metaTags.description)}</description>` : ''}
    ${node.metaTags?.keywords && node.metaTags.keywords.length > 0 ? `<keywords>${this.escapeXML(node.metaTags.keywords.join(', '))}</keywords>` : ''}
    ${node.metaTags?.canonical ? `<canonical>${this.escapeXML(node.metaTags.canonical)}</canonical>` : ''}
    ${node.metaTags?.robots ? `<robots>${this.escapeXML(node.metaTags.robots)}</robots>` : ''}
    ${node.contentType ? `<content-type>${this.escapeXML(node.contentType)}</content-type>` : ''}
    ${node.wordCount ? `<word-count>${node.wordCount}</word-count>` : ''}
    ${node.internalLinks ? `<internal-links>${node.internalLinks}</internal-links>` : ''}
    ${node.externalLinks ? `<external-links>${node.externalLinks}</external-links>` : ''}
    ${node.images ? `<images>${node.images}</images>` : ''}
    ${node.h1Tags ? `<h1-tags>${node.h1Tags}</h1-tags>` : ''}
    ${node.h2Tags ? `<h2-tags>${node.h2Tags}</h2-tags>` : ''}
    ${node.h3Tags ? `<h3-tags>${node.h3Tags}</h3-tags>` : ''}
  </url>
`;
      }
      
      if (node.children.length > 0) {
        xml += this.generateXMLNodes(node.children);
      }
    }
    
    return xml;
  }

  private getChangeFrequency(node: SitemapNode): string {
    // Determine change frequency based on content type and depth
    if (node.depth === 0) return 'daily';
    if (node.depth === 1) return 'weekly';
    if (node.depth === 2) return 'monthly';
    return 'yearly';
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  stopCrawling(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isCrawling = false;
  }

  isCurrentlyCrawling(): boolean {
    return this.isCrawling;
  }
}

export default new SitemapService();
