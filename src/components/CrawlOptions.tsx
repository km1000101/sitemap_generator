import React from 'react';
import { CrawlOptions as ICrawlOptions } from '../types';
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-large">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-orange-500 rounded-xl flex items-center justify-center shadow-glow">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Crawl Options</h3>
          <p className="text-gray-600">Configure how deep and wide to crawl your website</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Numeric Inputs */}
        <div className="space-y-6">
          {/* Max Depth */}
          <div className="group">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed group-hover:border-primary-300"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                levels
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-11">Maximum depth to crawl (1-10 levels)</p>
          </div>

          {/* Max Pages */}
          <div className="group">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-green-500 rounded-lg flex items-center justify-center">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed group-hover:border-primary-300"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                pages
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-11">Maximum pages to crawl (1-1000 pages)</p>
          </div>

          {/* Delay */}
          <div className="group">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-warning-500 to-orange-500 rounded-lg flex items-center justify-center">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed group-hover:border-primary-300"
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
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-600" />
              Basic Crawl Settings
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.includeImages}
                  onChange={(e) => handleChange('includeImages', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Image className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Include Images</span>
                  <p className="text-xs text-gray-500">Crawl and index image files</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.includeExternalLinks}
                  onChange={(e) => handleChange('includeExternalLinks', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Include External Links</span>
                  <p className="text-xs text-gray-500">Follow links to external domains</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.respectRobotsTxt}
                  onChange={(e) => handleChange('respectRobotsTxt', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Respect robots.txt</span>
                  <p className="text-xs text-gray-500">Follow website crawling rules</p>
                </div>
              </label>
            </div>
          </div>

          {/* Meta Tag & Content Analysis */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-600" />
              Meta Tag & Content Analysis
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.extractMetaTags}
                  onChange={(e) => handleChange('extractMetaTags', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Extract Meta Tags</span>
                  <p className="text-xs text-gray-500">Extract SEO meta tags and Open Graph data</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.analyzeContent}
                  onChange={(e) => handleChange('analyzeContent', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Analyze Content</span>
                  <p className="text-xs text-gray-500">Count words, headings, links, and images</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.includeSocialMedia}
                  onChange={(e) => handleChange('includeSocialMedia', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Include Social Media</span>
                  <p className="text-xs text-gray-500">Extract Twitter Cards and Open Graph tags</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.includeSchemaMarkup}
                  onChange={(e) => handleChange('includeSchemaMarkup', e.target.checked)}
                  disabled={disabled}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Include Schema Markup</span>
                  <p className="text-xs text-gray-500">Extract structured data and JSON-LD</p>
                </div>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-100">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm text-primary-800 font-medium">
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
