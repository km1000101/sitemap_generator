import React from 'react';
import { MetaAnalysis as IMetaAnalysis } from 'types';
import { TrendingUp, AlertTriangle, CheckCircle, Target, Eye, Share2 } from 'lucide-react';
import { RealisticTagIcon, RealisticChartIcon } from 'components/RealisticIcons';

interface MetaAnalysisProps {
  metaAnalysis: IMetaAnalysis;
}

const MetaAnalysis: React.FC<MetaAnalysisProps> = ({ metaAnalysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreBorderColor = (score: number) => {
    if (score >= 80) return 'border-green-200';
    if (score >= 60) return 'border-yellow-200';
    return 'border-red-200';
  };

  return (
    <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 shadow-large p-6">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center shadow-md transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <RealisticTagIcon width={20} height={20} />
          </div>
          <h3 className="text-xl font-bold text-white-500">Meta Tag Analysis</h3>
        </div>
        <p className="text-gray-400 text-sm">Comprehensive SEO and meta tag insights</p>
      </div>

      {/* SEO Score */}
      <div className="mb-6">
        <div className={`p-6 rounded-2xl border-2 ${getScoreBorderColor(metaAnalysis.seoScore)} bg-white/10 backdrop-blur-sm shadow-soft`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white-500 mb-2">Overall SEO Score</h4>
              <p className="text-gray-400 text-sm">Based on meta tag completeness and optimization</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(metaAnalysis.seoScore)}`}>
                {metaAnalysis.seoScore}/100
              </div>
              <div className="text-sm text-gray-500">points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Tag Coverage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
          <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-brand-blue-500" />
            Meta Tag Coverage
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Title Tags</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white-500">
                  {metaAnalysis.pagesWithTitle}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  ({Math.round((metaAnalysis.pagesWithTitle / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Descriptions</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white-500">
                  {metaAnalysis.pagesWithDescription}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  ({Math.round((metaAnalysis.pagesWithDescription / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Keywords</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white-500">
                  {metaAnalysis.pagesWithKeywords}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  ({Math.round((metaAnalysis.pagesWithKeywords / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Canonical URLs</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white-500">
                  {metaAnalysis.pagesWithCanonical}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  ({Math.round((metaAnalysis.pagesWithCanonical / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
          <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-accent-500" />
            Social Media & Open Graph
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Open Graph Tags</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white-500">
                  {metaAnalysis.pagesWithOpenGraph}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  ({Math.round((metaAnalysis.pagesWithOpenGraph / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Twitter Cards</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white-500">
                  {metaAnalysis.pagesWithTwitterCards}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  ({Math.round((metaAnalysis.pagesWithTwitterCards / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Robots Meta</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white-500">
                  {metaAnalysis.pagesWithRobotsMeta}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  ({Math.round((metaAnalysis.pagesWithRobotsMeta / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Optimization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
          <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
            <RealisticChartIcon width={20} height={20} />
            Content Optimization
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Avg Title Length</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {Math.round(metaAnalysis.averageTitleLength)} chars
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Avg Description Length</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {Math.round(metaAnalysis.averageDescriptionLength)} chars
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Pages Analyzed</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {metaAnalysis.totalPages}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
          <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-500" />
            Common Keywords
          </h4>
          <div className="space-y-2">
            {metaAnalysis.commonKeywords.slice(0, 5).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                <span className="text-sm text-gray-400 truncate">{keyword.keyword}</span>
                <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  {keyword.count}
                </span>
              </div>
            ))}
            {metaAnalysis.commonKeywords.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">No keywords found</p>
            )}
          </div>
        </div>
      </div>

      {/* Missing Meta Tags */}
      {metaAnalysis.missingMetaTags.length > 0 && (
        <div className="bg-red-900/40 backdrop-blur-sm rounded-xl p-6 border border-red-700/50 shadow-soft">
          <h4 className="font-semibold text-red-50 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-300" />
            Areas for Improvement
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metaAnalysis.missingMetaTags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-red-200 p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Add {tag} meta tags</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-300 mt-3">
            Consider adding these meta tags to improve your SEO score and social media sharing.
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft mt-6">
        <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-blue-500" />
          SEO Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-white-500">Immediate Actions:</h5>
            <ul className="text-sm text-gray-400 space-y-1 p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              {metaAnalysis.pagesWithDescription / metaAnalysis.totalPages < 0.8 && (
                <li>• Add meta descriptions to all pages</li>
              )}
              {metaAnalysis.pagesWithCanonical / metaAnalysis.totalPages < 0.7 && (
                <li>• Implement canonical URLs for duplicate content</li>
              )}
              {metaAnalysis.pagesWithOpenGraph / metaAnalysis.totalPages < 0.6 && (
                <li>• Add Open Graph tags for better social sharing</li>
              )}
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-white-500">Long-term Improvements:</h5>
            <ul className="text-sm text-gray-400 space-y-1 p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <li>• Optimize title lengths (50-60 characters)</li>
              <li>• Write compelling meta descriptions (150-160 characters)</li>
              <li>• Implement structured data markup</li>
              <li>• Regular meta tag audits and updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaAnalysis;
