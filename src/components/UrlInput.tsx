import React, { useState } from 'react';
import { Play, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { RealisticGlobeIcon } from './RealisticIcons';

interface UrlInputProps {
  onStartCrawl: (url: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onStartCrawl, disabled = false, isLoading = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (input: string): boolean => {
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Add protocol if missing
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    if (!validateUrl(processedUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    onStartCrawl(processedUrl);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-large">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-brand-blue-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
          <RealisticGlobeIcon width={24} height={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white-500">Website URL</h3>
          <p className="text-gray-400">Enter the website URL to generate a sitemap</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url-input" className="block text-sm font-semibold text-white-500/70 mb-3">
            Website Address
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-500 to-brand-blue-700 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              disabled={disabled || isLoading}
              className={`relative w-full px-6 py-4 pl-16 border border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-blue-400/30 focus:border-brand-blue-500 transition-all duration-300 text-lg shadow-sm text-white-500 bg-dark-blue-800/70 ${
                error 
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                  : 'hover:border-brand-blue-300'
              } ${
                disabled || isLoading ? 'bg-dark-blue-800/50 cursor-not-allowed' : ''
              }`}
            />
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <RealisticGlobeIcon width={16} height={16} />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-3 mt-3 p-3 bg-red-900/40 backdrop-blur-sm rounded-xl border border-red-700/50 shadow-soft">
              <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
              <span className="text-red-200 font-medium">{error}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || isLoading || !url.trim()}
          className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
            disabled || isLoading || !url.trim()
              ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-white/10 shadow-sm'
              : 'bg-brand-blue-500 text-white-500 hover:bg-brand-blue-400 focus:ring-4 focus:ring-brand-blue-500/30 shadow-large hover:shadow-glow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span className="animate-pulse">Crawling...</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shadow-inner">
                <Play className="w-4 h-4 text-white" />
              </div>
              Start Crawling
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-brand-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-white-500 mb-2">Pro Tip</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enter any website URL and we'll crawl it to discover all linked pages and create a comprehensive sitemap. 
              Our AI-powered crawler respects robots.txt and provides detailed insights about your website structure.
            </p>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 shadow-sm">
          <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-white-500">AI-Powered</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 shadow-sm">
          <div className="w-8 h-8 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md">
            <RealisticGlobeIcon width={16} height={16} />
          </div>
          <span className="text-sm font-medium text-white-500">Smart Crawling</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 shadow-sm">
          <div className="w-8 h-8 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-white-500">Fast Results</span>
        </div>
      </div>
    </div>
  );
};

export default UrlInput;
