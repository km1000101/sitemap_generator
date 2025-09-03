import React, { useState } from 'react';
import { Globe, Play, AlertCircle, Sparkles, Zap } from 'lucide-react';

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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-large hover:shadow-glow transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Website URL</h3>
          <p className="text-gray-600">Enter the website URL to generate a sitemap</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url-input" className="block text-sm font-semibold text-gray-700 mb-3">
            Website Address
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              disabled={disabled || isLoading}
              className={`relative w-full px-6 py-4 pl-16 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-lg ${
                error 
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                  : 'border-gray-200 hover:border-primary-300'
              } ${
                disabled || isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
            />
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-3 mt-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || isLoading || !url.trim()}
          className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
            disabled || isLoading || !url.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700 focus:ring-4 focus:ring-primary-500/30 shadow-large hover:shadow-glow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span className="animate-pulse">Crawling...</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              Start Crawling
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-primary-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Pro Tip</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              Enter any website URL and we'll crawl it to discover all linked pages and create a comprehensive sitemap. 
              Our AI-powered crawler respects robots.txt and provides detailed insights about your website structure.
            </p>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-green-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">AI-Powered</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-warning-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">Smart Crawling</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">Fast Results</span>
        </div>
      </div>
    </div>
  );
};

export default UrlInput;
