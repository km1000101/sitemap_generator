import React from 'react';
import { StructureAnalysis as IStructureAnalysis } from '../types';
import { Network, BarChart3, Link, Image, FileText, Layers, AlertTriangle, TrendingUp } from 'lucide-react';

interface StructureAnalysisProps {
  structureAnalysis: IStructureAnalysis;
}

const StructureAnalysis: React.FC<StructureAnalysisProps> = ({ structureAnalysis }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-large p-6">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Structure Analysis</h3>
        </div>
        <p className="text-gray-600 text-sm">Website structure and content insights</p>
      </div>

      {/* Structure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{structureAnalysis.maxDepth}</div>
          <div className="text-sm text-gray-600">Max Depth</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{structureAnalysis.averageDepth.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Average Depth</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round(structureAnalysis.averageWordCount)}</div>
          <div className="text-sm text-gray-600">Avg Words/Page</div>
        </div>
      </div>

      {/* Content Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-amber-600" />
            Link Analysis
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Internal Links</span>
              <span className="text-sm font-medium text-gray-900">
                {structureAnalysis.internalLinkCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">External Links</span>
              <span className="text-sm font-medium text-gray-900">
                {structureAnalysis.externalLinkCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Total Links</span>
              <span className="text-sm font-medium text-gray-900">
                {(structureAnalysis.internalLinkCount + structureAnalysis.externalLinkCount).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Link Ratio (Int/Ext)</span>
              <span className="text-sm font-medium text-gray-900">
                {structureAnalysis.externalLinkCount > 0 
                  ? (structureAnalysis.internalLinkCount / structureAnalysis.externalLinkCount).toFixed(1)
                  : '∞'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-emerald-600" />
            Content Elements
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Total Images</span>
              <span className="text-sm font-medium text-gray-900">
                {structureAnalysis.imageCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">H1 Tags</span>
              <span className="text-sm font-medium text-gray-900">
                {structureAnalysis.h1TagCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">H2 Tags</span>
              <span className="text-sm font-medium text-gray-900">
                {structureAnalysis.h2TagCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">H3 Tags</span>
              <span className="text-sm font-medium text-gray-900">
                {structureAnalysis.h3TagCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Depth Distribution */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 mb-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Depth Distribution
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(structureAnalysis.depthDistribution)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([depth, count]) => (
              <div key={depth} className="text-center">
                <div className="text-lg font-bold text-gray-900 mb-1">Level {depth}</div>
                <div className="text-sm text-gray-600">{count} pages</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(count / Math.max(...Object.values(structureAnalysis.depthDistribution))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Content Type Distribution */}
      {Object.keys(structureAnalysis.contentTypeDistribution).length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Content Type Distribution
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(structureAnalysis.contentTypeDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                  <span className="text-sm text-gray-700 font-medium">{type}</span>
                  <span className="text-sm font-bold text-gray-900 bg-purple-100 px-3 py-1 rounded-full">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Issues and Warnings */}
      {(structureAnalysis.orphanedPages.length > 0) && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-100 mb-6">
          <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Structure Issues
          </h4>
          <div className="space-y-3">
            {structureAnalysis.orphanedPages.length > 0 && (
              <div>
                <h5 className="font-medium text-red-800 mb-2">Orphaned Pages ({structureAnalysis.orphanedPages.length})</h5>
                <p className="text-sm text-red-700 mb-2">
                  These pages have no incoming internal links and may be hard to discover:
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {structureAnalysis.orphanedPages.slice(0, 5).map((url, index) => (
                    <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      {url}
                    </div>
                  ))}
                  {structureAnalysis.orphanedPages.length > 5 && (
                    <div className="text-xs text-red-500 text-center py-2">
                      ... and {structureAnalysis.orphanedPages.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Structure Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">Immediate Actions:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              {structureAnalysis.orphanedPages.length > 0 && (
                <li>• Add internal links to orphaned pages</li>
              )}
              {structureAnalysis.h1TagCount === 0 && (
                <li>• Ensure each page has exactly one H1 tag</li>
              )}
              {structureAnalysis.internalLinkCount < structureAnalysis.externalLinkCount && (
                <li>• Increase internal linking for better SEO</li>
              )}
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">Long-term Improvements:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Maintain consistent heading hierarchy (H1 → H2 → H3)</li>
              <li>• Optimize internal linking structure</li>
              <li>• Regular content audits and updates</li>
              <li>• Monitor page depth and user experience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureAnalysis;
