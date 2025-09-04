import React from 'react';
import { CrawlProgress } from 'types';
import { Loader2, CheckCircle, AlertCircle, TrendingUp, Target, Clock } from 'lucide-react';

interface ProgressBarProps {
  progress: CrawlProgress;
  isComplete: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, isComplete }) => {
  const percentage = progress.totalPages > 0 
    ? Math.round((progress.pagesCrawled / progress.totalPages) * 100) 
    : 0;

  return (
    <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-large">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white-500">Crawling Progress</h3>
            <p className="text-gray-400">Real-time updates on your website crawl</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isComplete ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-success-900/40 backdrop-blur-sm rounded-full border border-success-700/50 shadow-sm">
              <CheckCircle className="w-5 h-5 text-success-100" />
              <span className="text-success-100 font-semibold">Complete</span>
            </div>
          ) : progress.currentUrl ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-blue-900/40 backdrop-blur-sm rounded-full border border-brand-blue-700/50 shadow-sm">
              <Loader2 className="w-5 h-5 text-brand-blue-100 animate-spin" />
              <span className="text-brand-blue-100 font-semibold">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-full border border-gray-600/50 shadow-sm">
              <AlertCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-semibold">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white-500">Progress</span>
          <span className="text-lg font-bold text-brand-blue-500">{percentage}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden border border-white/20 shadow-inner">
          <div 
            className="bg-gradient-to-r from-brand-blue-500 via-accent-500 to-success-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-md"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Progress Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white-500">Pages Crawled</span>
          </div>
          <div className="text-2xl font-bold text-brand-blue-500">
            {progress.pagesCrawled}
            <span className="text-lg text-gray-400 font-normal"> / {progress.totalPages}</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white-500">Current Depth</span>
          </div>
          <div className="text-2xl font-bold text-accent-500">
            {progress.currentDepth}
            <span className="text-lg text-gray-400 font-normal"> levels</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center shadow-md">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white-500">Status</span>
          </div>
          <div className="text-lg font-bold text-success-500">
            {isComplete ? 'Completed' : 'In Progress'}
          </div>
        </div>
      </div>

      {/* Current URL */}
      {progress.currentUrl && (
        <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white-500 mb-1">Currently Crawling:</p>
              <p className="text-sm text-gray-400 break-all font-mono bg-white/5 px-3 py-2 rounded-lg border border-white/10 shadow-sm">
                {progress.currentUrl}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      {isComplete && (
        <div className="p-6 bg-success-900/40 backdrop-blur-sm rounded-xl border border-success-700/50 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-success-100 mb-1">Crawling Completed!</h4>
              <p className="text-success-200">
                Successfully discovered and indexed <span className="font-bold">{progress.pagesCrawled}</span> pages from your website.
                You can now view the results and export your sitemap.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
