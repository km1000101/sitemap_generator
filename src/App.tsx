import React, { useState, useCallback } from 'react';
import { SitemapData, CrawlOptions, CrawlProgress } from './types';
import sitemapService from './services/sitemapService';
import UrlInput from './components/UrlInput';
import CrawlOptionsComponent from './components/CrawlOptions';
import ProgressBar from './components/ProgressBar';
import SitemapVisualizer from './components/SitemapVisualizer';
import SitemapList from './components/SitemapList';
import ExportOptions from './components/ExportOptions';
import MetaAnalysis from './components/MetaAnalysis';
import StructureAnalysis from './components/StructureAnalysis';
import { Network, BarChart3, List, Sparkles, Tag, GitBranch, AlertTriangle } from 'lucide-react';

const defaultCrawlOptions: CrawlOptions = {
  maxDepth: 3,
  maxPages: 100,
  includeImages: false,
  includeExternalLinks: false,
  respectRobotsTxt: true,
  delay: 100,
  extractMetaTags: true,
  analyzeContent: true,
  includeSocialMedia: true,
  includeSchemaMarkup: false
};

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [crawlOptions, setCrawlOptions] = useState<CrawlOptions>(defaultCrawlOptions);
  const [sitemapData, setSitemapData] = useState<SitemapData | null>(null);
  const [progress, setProgress] = useState<CrawlProgress>({
    currentUrl: '',
    currentDepth: 0,
    pagesCrawled: 0,
    totalPages: 0,
    isComplete: false
  });
  const [isCrawling, setIsCrawling] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'list' | 'meta' | 'structure'>('visual');
  const [error, setError] = useState<string | null>(null);

  const handleStartCrawl = useCallback(async (startUrl: string) => {
    setUrl(startUrl);
    setError(null);
    setIsCrawling(true);
    setProgress({
      currentUrl: '',
      currentDepth: 0,
      pagesCrawled: 0,
      totalPages: crawlOptions.maxPages,
      isComplete: false
    });

    try {
      const data = await sitemapService.crawlWebsite(
        startUrl,
        crawlOptions,
        (progressUpdate) => setProgress(progressUpdate)
      );
      
      setSitemapData(data);
      setProgress(prev => ({ ...prev, isComplete: true }));
      console.log('Crawl complete, setting active tab to visual');
      setActiveTab('visual'); // Switch to Visual Tree View after crawl completes
      console.log('activeTab after setting:', 'visual');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during crawling');
    } finally {
      setIsCrawling(false);
    }
  }, [crawlOptions]);

  const handleStopCrawl = useCallback(() => {
    sitemapService.stopCrawling();
    setIsCrawling(false);
  }, []);

  const handleExportXML = useCallback(() => {
    if (!sitemapData) return;
    
    const xml = sitemapService.generateXMLSitemap(sitemapData.nodes);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [sitemapData]);

  const handleExportJSON = useCallback(() => {
    if (!sitemapData) return;
    
    const json = JSON.stringify(sitemapData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [sitemapData]);

  const handleExportCSV = useCallback(() => {
    if (!sitemapData) return;
    
    const csvRows = ['URL,Title,Depth,Status,Last Modified'];
    
    const addNodeToCSV = (node: any, depth: number) => {
      csvRows.push(`"${node.url}","${node.title}","${depth}","${node.status}","${node.lastModified || ''}"`);
      node.children.forEach((child: any) => addNodeToCSV(child, depth + 1));
    };
    
    sitemapData.nodes.forEach(node => addNodeToCSV(node, 0));
    
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [sitemapData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
                  <Network className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-success-400 to-success-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-700 to-primary-600 bg-clip-text text-transparent">
                  Sitemap Generator
                </h1>
                <p className="text-sm text-gray-600 font-medium">Modern web crawling & sitemap generation</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary-50 to-blue-50 rounded-full border border-primary-100">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse-gentle"></div>
              <span className="text-sm font-medium text-primary-700">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {/* URL Input */}
          <div className="animate-fade-in">
            <UrlInput
              onStartCrawl={handleStartCrawl}
              disabled={isCrawling}
              isLoading={isCrawling}
            />
          </div>

          {sitemapData && (
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {/* Visualization Tabs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-large">
                <div className="border-b border-gray-100">
                  <nav className="flex space-x-8 px-8">
                    <button
                      onClick={() => setActiveTab('visual')}
                      className={`py-5 px-1 border-b-2 font-semibold text-sm flex items-center gap-3 transition-all duration-200 ${
                        activeTab === 'visual'
                          ? 'border-primary-500 text-primary-600 bg-gradient-to-r from-primary-50 to-transparent'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        activeTab === 'visual' 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      Visual Tree
                    </button>
                    <button
                      onClick={() => setActiveTab('list')}
                      className={`py-5 px-1 border-b-2 font-semibold text-sm flex items-center gap-3 transition-all duration-200 ${
                        activeTab === 'list'
                          ? 'border-primary-500 text-primary-600 bg-gradient-to-r from-primary-50 to-transparent'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        activeTab === 'list' 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <List className="w-5 h-5" />
                      </div>
                      List View
                    </button>
                    <button
                      onClick={() => setActiveTab('meta')}
                      className={`py-5 px-1 border-b-2 font-semibold text-sm flex items-center gap-3 transition-all duration-200 ${
                        activeTab === 'meta'
                          ? 'border-primary-500 text-primary-600 bg-gradient-to-r from-primary-50 to-transparent'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        activeTab === 'meta' 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Tag className="w-5 h-5" />
                      </div>
                      Meta Analysis
                    </button>
                    <button
                      onClick={() => setActiveTab('structure')}
                      className={`py-5 px-1 border-b-2 font-semibold text-sm flex items-center gap-3 transition-all duration-200 ${
                        activeTab === 'structure'
                          ? 'border-primary-500 text-primary-600 bg-gradient-to-r from-primary-50 to-transparent'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        activeTab === 'structure' 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <GitBranch className="w-5 h-5" />
                      </div>
                      Structure Analysis
                    </button>
                  </nav>
                </div>

                <div className="p-8">
                  {activeTab === 'visual' ? (
                    <SitemapVisualizer
                      data={sitemapData.nodes}
                      width={800}
                      height={600}
                    />
                  ) : activeTab === 'list' ? (
                    <SitemapList
                      nodes={sitemapData.nodes}
                      onNodeClick={(node) => {
                        if (node.url) {
                          window.open(node.url, '_blank');
                        }
                      }}
                    />
                  ) : activeTab === 'meta' && sitemapData.metaAnalysis ? (
                    <MetaAnalysis metaAnalysis={sitemapData.metaAnalysis} />
                  ) : activeTab === 'structure' && sitemapData.structureAnalysis ? (
                    <StructureAnalysis structureAnalysis={sitemapData.structureAnalysis} />
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Not Available</h3>
                      <p className="text-gray-500">Enable meta tag extraction and content analysis in crawl options to view this data.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Crawl Options */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CrawlOptionsComponent
              options={crawlOptions}
              onOptionsChange={setCrawlOptions}
              disabled={isCrawling}
            />
          </div>

          {/* Progress Bar */}
          {isCrawling && (
            <div className="animate-slide-up">
              <ProgressBar
                progress={progress}
                isComplete={progress.isComplete}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="animate-slide-up">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-soft">
                <div className="flex items-center gap-3 text-red-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xl font-bold">!</span>
                  </div>
                  <div>
                    <span className="font-semibold text-lg">Error occurred</span>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {sitemapData && (
            <>
              {/* Export Options */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <ExportOptions
                  sitemapData={sitemapData}
                  onExportXML={handleExportXML}
                  onExportJSON={handleExportJSON}
                  onExportCSV={handleExportCSV}
                />
              </div>
            </>
          )}

          {/* Stop Crawling Button */}
          {isCrawling && (
            <div className="flex justify-center animate-bounce-gentle">
              <button
                onClick={handleStopCrawl}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-large hover:shadow-glow-lg transform hover:scale-105"
              >
                Stop Crawling
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Sitemap Generator</span>
            </div>
            <p className="text-gray-600 mb-2">Built with React, TypeScript, and D3.js</p>
            <p className="text-gray-500 text-sm">
              A modern sitemap generator for web developers and SEO professionals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
