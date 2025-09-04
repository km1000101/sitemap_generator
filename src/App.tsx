import React, { useState, useCallback } from 'react';
import { SitemapData, CrawlOptions, CrawlProgress } from './types';
import sitemapService from './services/sitemapService';
import UrlInput from './components/UrlInput';
import AnimatedMapBackground from './components/AnimatedMapBackground';
import CrawlOptionsComponent from './components/CrawlOptions';
import ProgressBar from './components/ProgressBar';
import SitemapVisualizer from './components/SitemapVisualizer';
import SitemapList from './components/SitemapList';
import ExportOptions from './components/ExportOptions';
import MetaAnalysis from './components/MetaAnalysis';
import StructureAnalysis from './components/StructureAnalysis';
import { AlertTriangle } from 'lucide-react';
import { RealisticChartIcon, RealisticListIcon, RealisticTagIcon, RealisticBranchIcon } from './components/RealisticIcons';

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
    <div className="min-h-screen text-white-500 relative">
      <AnimatedMapBackground />
      {/* Header */}
      <header className="bg-dark-blue-800/60 backdrop-blur-lg shadow-medium border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white-500 to-brand-blue-500">
                  Sitemap Generator
                </h1>
                <p className="text-sm text-white-500/70 font-medium">Modern web crawling &amp; sitemap generation</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
              <div className="w-2.5 h-2.5 bg-success-500 rounded-full animate-bounce-gentle"></div>
              <span className="text-sm font-semibold text-white-500">AI-Powered Insights</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* URL Input */}
          <div className="animate-fade-in duration-500">
            <UrlInput
              onStartCrawl={handleStartCrawl}
              disabled={isCrawling}
              isLoading={isCrawling}
            />
          </div>

          {sitemapData && (
            <div className="animate-fade-in duration-500" style={{ animationDelay: '0.1s' }}>
              {/* Visualization Tabs */}
              <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 shadow-large overflow-hidden">
                <div className="border-b border-white/10">
                  <nav className="flex space-x-8 px-8">
                    <button
                      onClick={() => setActiveTab('visual')}
                      className={`py-5 px-1 border-b-2 font-semibold text-sm flex items-center gap-3 transition-all duration-300 transform hover:scale-105 ${
                        activeTab === 'visual'
                          ? 'border-brand-blue-500 text-brand-blue-500'
                          : 'border-transparent text-gray-400 hover:text-white-500 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        activeTab === 'visual' 
                          ? 'bg-brand-blue-500/20 text-brand-blue-500 shadow-sm' 
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        <RealisticChartIcon width={20} height={20} />
                      </div>
                      Visual Tree
                    </button>
                    <button
                      onClick={() => setActiveTab('list')}
                      className={`py-5 px-1 border-b-2 font-semibold text-sm flex items-center gap-3 transition-all duration-300 transform hover:scale-105 ${
                        activeTab === 'list'
                          ? 'border-brand-blue-500 text-brand-blue-500'
                          : 'border-transparent text-gray-400 hover:text-white-500 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        activeTab === 'list' 
                          ? 'bg-brand-blue-500/20 text-brand-blue-500 shadow-sm' 
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        <RealisticListIcon width={20} height={20} />
                      </div>
                      List View
                    </button>
                    <button
                      onClick={() => setActiveTab('meta')}
                      className={`py-5 px-1 border-b-2 font-semibold text-sm flex items-center gap-3 transition-all duration-300 transform hover:scale-105 ${
                        activeTab === 'meta'
                          ? 'border-brand-blue-500 text-brand-blue-500'
                          : 'border-transparent text-gray-400 hover:text-white-500 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        activeTab === 'meta' 
                          ? 'bg-brand-blue-500/20 text-brand-blue-500 shadow-sm' 
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        <RealisticTagIcon width={20} height={20} />
                      </div>
                      Meta Analysis
                    </button>
                    <button
                      onClick={() => setActiveTab('structure')}
                      className={`py-5 px-1 border-b-2 font-semibold text-sm flex items-center gap-3 transition-all duration-300 transform hover:scale-105 ${
                        activeTab === 'structure'
                          ? 'border-brand-blue-500 text-brand-blue-500'
                          : 'border-transparent text-gray-400 hover:text-white-500 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        activeTab === 'structure' 
                          ? 'bg-brand-blue-500/20 text-brand-blue-500 shadow-sm' 
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        <RealisticBranchIcon width={20} height={20} />
                      </div>
                      Structure Analysis
                    </button>
                  </nav>
                </div>

                <div className="p-8 bg-dark-blue-800/70">
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
                    <div className="text-center py-12 bg-white/10 rounded-xl shadow-soft border border-white/20">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <AlertTriangle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white-500 mb-2">Analysis Not Available</h3>
                      <p className="text-gray-400">Enable meta tag extraction and content analysis in crawl options to view this data.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Crawl Options */}
          <div className="animate-fade-in duration-500" style={{ animationDelay: '0.1s' }}>
            <CrawlOptionsComponent
              options={crawlOptions}
              onOptionsChange={setCrawlOptions}
              disabled={isCrawling}
            />
          </div>

          {/* Progress Bar */}
          {isCrawling && (
            <div className="animate-slide-up duration-500">
              <ProgressBar
                progress={progress}
                isComplete={progress.isComplete}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="animate-slide-up duration-500">
              <div className="bg-red-900/40 backdrop-blur-md border border-red-700/50 rounded-2xl p-6 shadow-medium">
                <div className="flex items-center gap-3 text-red-100">
                  <div className="w-12 h-12 bg-red-800/70 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-red-300 text-xl font-bold">!</span>
                  </div>
                  <div>
                    <span className="font-bold text-lg text-red-50">Error occurred</span>
                    <p className="text-red-200 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {sitemapData && (
            <>
              {/* Export Options */}
              <div className="animate-fade-in duration-500" style={{ animationDelay: '0.2s' }}>
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
            <div className="flex justify-center animate-bounce-gentle duration-700">
              <button
                onClick={handleStopCrawl}
                className="bg-brand-blue-500 text-white-500 px-8 py-4 rounded-2xl hover:bg-brand-blue-400 transition-all duration-300 font-bold shadow-large hover:shadow-glow-lg transform hover:scale-105"
              >
                Stop Crawling
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark-blue-800/60 backdrop-blur-lg border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-lg font-semibold text-white-500">Sitemap Generator</span>
            </div>
            <p className="text-white-500/70 mb-2">Built with React, TypeScript, and D3.js</p>
            <p className="text-gray-400 text-sm">
              A modern sitemap generator for web developers and SEO professionals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
