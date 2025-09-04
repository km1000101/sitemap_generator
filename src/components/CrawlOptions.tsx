import React from 'react';
import { CrawlOptions as ICrawlOptions } from 'types';
import { Settings, Globe, Clock, Image, ExternalLink, Shield, Zap, Target, Layers, Tag, FileText, Share2, Code } from 'lucide-react';

interface CrawlOptionsProps {
  options: ICrawlOptions;
  onOptionsChange: (options: ICrawlOptions) => void;
  disabled?: boolean;
}

const CrawlOptions: React.FC<CrawlOptionsProps> = ({ 
  options, 
  onOptionsChange, 
  disabled = false 
}) => {
  const handleChange = (key: keyof ICrawlOptions, value: any) => {
    onOptionsChange({
      ...options,
      [key]: value
    });
  };

  return (
    <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-large">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white-500">Crawl Options</h3>
          <p className="text-gray-400">Configure how deep and wide to crawl your website</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Numeric Inputs */}
        <div className="space-y-6">
          {/* Max Depth */}
          <div className="group p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-soft hover:shadow-medium transition-shadow duration-300">
            <label className="flex items-center gap-3 text-sm font-semibold text-white-500/70 mb-3">
              <div className="w-8 h-8 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <Layers className="w-4 h-4 text-white" />
              </div>
              Max Depth
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="10"
                value={options.maxDepth}
                onChange={(e) => handleChange('maxDepth', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 bg-dark-blue-800/70 border border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-blue-400/30 focus:border-brand-blue-500 transition-all duration-300 text-lg disabled:bg-dark-blue-800/50 disabled:cursor-not-allowed hover:border-brand-blue-300 shadow-sm text-white-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                levels
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-11">Maximum depth to crawl (1-10 levels)</p>
          </div>

          {/* Max Pages */}
          <div className="group p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-soft hover:shadow-medium transition-shadow duration-300">
            <label className="flex items-center gap-3 text-sm font-semibold text-white-500/70 mb-3">
              <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center shadow-md">
                <Target className="w-4 h-4 text-white" />
              </div>
              Max Pages
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="1000"
                value={options.maxPages}
                onChange={(e) => handleChange('maxPages', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 bg-dark-blue-800/70 border border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-blue-400/30 focus:border-brand-blue-500 transition-all duration-300 text-lg disabled:bg-dark-blue-800/50 disabled:cursor-not-allowed hover:border-brand-blue-300 shadow-sm text-white-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                pages
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-11">Maximum pages to crawl (1-1000 pages)</p>
          </div>

          {/* Delay */}
          <div className="group p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-soft hover:shadow-medium transition-shadow duration-300">
            <label className="flex items-center gap-3 text-sm font-semibold text-white-500/70 mb-3">
              <div className="w-8 h-8 bg-warning-500 rounded-lg flex items-center justify-center shadow-md">
                <Clock className="w-4 h-4 text-white" />
              </div>
              Delay
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="5000"
                step="100"
                value={options.delay}
                onChange={(e) => handleChange('delay', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 bg-dark-blue-800/70 border border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-blue-400/30 focus:border-brand-blue-500 transition-all duration-300 text-lg disabled:bg-dark-blue-800/50 disabled:cursor-not-allowed hover:border-brand-blue-300 shadow-sm text-white-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                ms
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-11">Delay between requests in milliseconds</p>
          </div>
        </div>

        {/* Right Column - Checkboxes */}
        <div className="space-y-6">
          {/* Basic Crawl Settings */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
            <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-500" />
              Basic Crawl Settings
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-blue-300 transition-all duration-300 cursor-pointer group shadow-sm">
                <input
                  type="checkbox"
                  checked={options.includeImages}
                  onChange={(e) => handleChange('includeImages', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-accent-500 border-gray-600 rounded focus:ring-accent-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed bg-dark-blue-800"
                />
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <Image className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-white-500">Include Images</span>
                  <p className="text-xs text-gray-400">Crawl and index image files</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-blue-300 transition-all duration-300 cursor-pointer group shadow-sm">
                <input
                  type="checkbox"
                  checked={options.includeExternalLinks}
                  onChange={(e) => handleChange('includeExternalLinks', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-accent-500 border-gray-600 rounded focus:ring-accent-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed bg-dark-blue-800"
                />
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-white-500">Include External Links</span>
                  <p className="text-xs text-gray-400">Follow links to external domains</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-blue-300 transition-all duration-300 cursor-pointer group shadow-sm">
                <input
                  type="checkbox"
                  checked={options.respectRobotsTxt}
                  onChange={(e) => handleChange('respectRobotsTxt', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-accent-500 border-gray-600 rounded focus:ring-accent-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed bg-dark-blue-800"
                />
                <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center shadow-md">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-white-500">Respect robots.txt</span>
                  <p className="text-xs text-gray-400">Follow website crawling rules</p>
                </div>
              </label>
            </div>
          </div>

          {/* Meta Tag & Content Analysis */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
            <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-accent-500" />
              Meta Tag & Content Analysis
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-blue-300 transition-all duration-300 cursor-pointer group shadow-sm">
                <input
                  type="checkbox"
                  checked={options.extractMetaTags}
                  onChange={(e) => handleChange('extractMetaTags', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-accent-500 border-gray-600 rounded focus:ring-accent-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed bg-dark-blue-800"
                />
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-white-500">Extract Meta Tags</span>
                  <p className="text-xs text-gray-400">Extract SEO meta tags and Open Graph data</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-blue-300 transition-all duration-300 cursor-pointer group shadow-sm">
                <input
                  type="checkbox"
                  checked={options.analyzeContent}
                  onChange={(e) => handleChange('analyzeContent', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-accent-500 border-gray-600 rounded focus:ring-accent-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed bg-dark-blue-800"
                />
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-white-500">Analyze Content</span>
                  <p className="text-xs text-gray-400">Count words, headings, links, and images</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-blue-300 transition-all duration-300 cursor-pointer group shadow-sm">
                <input
                  type="checkbox"
                  checked={options.includeSocialMedia}
                  onChange={(e) => handleChange('includeSocialMedia', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-accent-500 border-gray-600 rounded focus:ring-accent-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed bg-dark-blue-800"
                />
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-white-500">Include Social Media</span>
                  <p className="text-xs text-gray-400">Extract Twitter Cards and Open Graph tags</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-blue-300 transition-all duration-300 cursor-pointer group shadow-sm">
                <input
                  type="checkbox"
                  checked={options.includeSchemaMarkup}
                  onChange={(e) => handleChange('includeSchemaMarkup', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-accent-500 border-gray-600 rounded focus:ring-accent-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed bg-dark-blue-800"
                />
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-white-500">Include Schema Markup</span>
                  <p className="text-xs text-gray-400">Extract structured data and JSON-LD</p>
                </div>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-brand-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <Globe className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">
                  These settings help balance crawling speed with thoroughness. 
                  Higher depth and page limits may take longer but provide more comprehensive results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrawlOptions;
