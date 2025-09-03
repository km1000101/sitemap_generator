import React from 'react';
import { CrawlProgress } from '../types';
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-large">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-green-500 rounded-xl flex items-center justify-center shadow-glow">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Crawling Progress</h3>
            <p className="text-gray-600">Real-time updates on your website crawl</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isComplete ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success-50 to-green-50 rounded-full border border-success-200">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <span className="text-success-700 font-semibold">Complete</span>
            </div>
          ) : progress.currentUrl ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-blue-50 rounded-full border border-primary-200">
              <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
              <span className="text-primary-700 font-semibold">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-slate-50 rounded-full border border-gray-200">
              <AlertCircle className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600 font-semibold">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-lg font-bold text-primary-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary-500 via-blue-500 to-success-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-glow"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Progress Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Pages Crawled</span>
          </div>
          <div className="text-2xl font-bold text-primary-600">
            {progress.pagesCrawled}
            <span className="text-lg text-gray-500 font-normal"> / {progress.totalPages}</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-warning-50 to-orange-50 rounded-xl p-4 border border-warning-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-warning-500 to-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Current Depth</span>
          </div>
          <div className="text-2xl font-bold text-warning-600">
            {progress.currentDepth}
            <span className="text-lg text-gray-500 font-normal"> levels</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-success-50 to-green-50 rounded-xl p-4 border border-success-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-green-500 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Status</span>
          </div>
          <div className="text-lg font-bold text-success-600">
            {isComplete ? 'Completed' : 'In Progress'}
          </div>
        </div>
      </div>

      {/* Current URL */}
      {progress.currentUrl && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 via-primary-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Currently Crawling:</p>
              <p className="text-sm text-blue-800 break-all font-mono bg-white/60 px-3 py-2 rounded-lg border border-blue-100">
                {progress.currentUrl}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      {isComplete && (
        <div className="p-6 bg-gradient-to-r from-success-50 to-green-50 rounded-xl border border-success-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-success-900 mb-1">Crawling Completed!</h4>
              <p className="text-success-800">
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
