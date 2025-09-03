import React from 'react';
import { MetaAnalysis as IMetaAnalysis } from '../types';
import { Tag, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Target, Eye, Share2 } from 'lucide-react';

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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-large p-6">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Meta Tag Analysis</h3>
        </div>
        <p className="text-gray-600 text-sm">Comprehensive SEO and meta tag insights</p>
      </div>

      {/* SEO Score */}
      <div className="mb-6">
        <div className={`p-6 rounded-2xl border-2 ${getScoreBorderColor(metaAnalysis.seoScore)} ${getScoreBgColor(metaAnalysis.seoScore)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Overall SEO Score</h4>
              <p className="text-sm text-gray-600">Based on meta tag completeness and optimization</p>
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Meta Tag Coverage
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Title Tags</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {metaAnalysis.pagesWithTitle}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((metaAnalysis.pagesWithTitle / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Descriptions</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {metaAnalysis.pagesWithDescription}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((metaAnalysis.pagesWithDescription / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Keywords</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {metaAnalysis.pagesWithKeywords}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((metaAnalysis.pagesWithKeywords / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Canonical URLs</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {metaAnalysis.pagesWithCanonical}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((metaAnalysis.pagesWithCanonical / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-600" />
            Social Media & Open Graph
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Open Graph Tags</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {metaAnalysis.pagesWithOpenGraph}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((metaAnalysis.pagesWithOpenGraph / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Twitter Cards</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {metaAnalysis.pagesWithTwitterCards}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((metaAnalysis.pagesWithTwitterCards / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Robots Meta</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {metaAnalysis.pagesWithRobotsMeta}/{metaAnalysis.totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((metaAnalysis.pagesWithRobotsMeta / metaAnalysis.totalPages) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Optimization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Content Optimization
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Avg Title Length</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(metaAnalysis.averageTitleLength)} chars
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Avg Description Length</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(metaAnalysis.averageDescriptionLength)} chars
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Total Pages Analyzed</span>
              <span className="text-sm font-medium text-gray-900">
                {metaAnalysis.totalPages}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            Common Keywords
          </h4>
          <div className="space-y-2">
            {metaAnalysis.commonKeywords.slice(0, 5).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate">{keyword.keyword}</span>
                <span className="text-sm font-medium text-gray-900 bg-amber-100 px-2 py-1 rounded-full">
                  {keyword.count}
                </span>
              </div>
            ))}
            {metaAnalysis.commonKeywords.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">No keywords found</p>
            )}
          </div>
        </div>
      </div>

      {/* Missing Meta Tags */}
      {metaAnalysis.missingMetaTags.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
          <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Areas for Improvement
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metaAnalysis.missingMetaTags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-red-700">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Add {tag} meta tags</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-600 mt-3">
            Consider adding these meta tags to improve your SEO score and social media sharing.
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mt-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          SEO Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">Immediate Actions:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
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
            <h5 className="font-medium text-gray-900">Long-term Improvements:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
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
