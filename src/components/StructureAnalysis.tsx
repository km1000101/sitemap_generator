import React from 'react';
import { StructureAnalysis as IStructureAnalysis } from 'types';
import { Link, Image, FileText, Layers, AlertTriangle, TrendingUp } from 'lucide-react';
import { RealisticBranchIcon, RealisticChartIcon } from 'components/RealisticIcons';

interface StructureAnalysisProps {
  structureAnalysis: IStructureAnalysis;
}

const StructureAnalysis: React.FC<StructureAnalysisProps> = ({ structureAnalysis }) => {
  return (
    <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 shadow-large p-6">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center shadow-md transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <RealisticBranchIcon width={20} height={20} />
          </div>
          <h3 className="text-xl font-bold text-white-500">Structure Analysis</h3>
        </div>
        <p className="text-gray-400 text-sm">Website structure and content insights</p>
      </div>

      {/* Structure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft text-center">
          <div className="w-12 h-12 bg-brand-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white-500 mb-1">{structureAnalysis.maxDepth}</div>
          <div className="text-sm text-gray-400">Max Depth</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft text-center">
          <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <RealisticChartIcon width={24} height={24} />
          </div>
          <div className="text-2xl font-bold text-white-500 mb-1">{structureAnalysis.averageDepth.toFixed(1)}</div>
          <div className="text-sm text-gray-400">Average Depth</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft text-center">
          <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white-500 mb-1">{Math.round(structureAnalysis.averageWordCount)}</div>
          <div className="text-sm text-gray-400">Avg Words/Page</div>
        </div>
      </div>

      {/* Content Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
          <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-brand-blue-500" />
            Link Analysis
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <span className="text-sm text-gray-400">Internal Links</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {structureAnalysis.internalLinkCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <span className="text-sm text-gray-400">External Links</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {structureAnalysis.externalLinkCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <span className="text-sm text-gray-400">Total Links</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {(structureAnalysis.internalLinkCount + structureAnalysis.externalLinkCount).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <span className="text-sm text-gray-400">Link Ratio (Int/Ext)</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {structureAnalysis.externalLinkCount > 0 
                  ? (structureAnalysis.internalLinkCount / structureAnalysis.externalLinkCount).toFixed(1)
                  : '∞'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
          <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-accent-500" />
            Content Elements
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <span className="text-sm text-gray-400">Total Images</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {structureAnalysis.imageCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <span className="text-sm text-gray-400">H1 Tags</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {structureAnalysis.h1TagCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <span className="text-sm text-gray-400">H2 Tags</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {structureAnalysis.h2TagCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
              <span className="text-sm text-gray-400">H3 Tags</span>
              <span className="text-sm font-medium text-white-500 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {structureAnalysis.h3TagCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Depth Distribution */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft mb-6">
        <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-blue-500" />
          Depth Distribution
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(structureAnalysis.depthDistribution)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([depth, count]) => (
              <div key={depth} className="text-center p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                <div className="text-lg font-bold text-white-500 mb-1">Level {depth}</div>
                <div className="text-sm text-gray-400">{count} pages</div>
                <div className="w-full bg-gray-700/50 rounded-full h-2 mt-2 border border-white/10 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-brand-blue-500 to-brand-blue-700 h-2 rounded-full transition-all duration-300 shadow-md"
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
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft mb-6">
          <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-500" />
            Content Type Distribution
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(structureAnalysis.contentTypeDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                  <span className="text-sm text-gray-400 font-medium">{type}</span>
                  <span className="text-sm font-bold text-white-500 bg-white/10 px-3 py-1 rounded-full border border-white/20 shadow-sm">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Issues and Warnings */}
      {(structureAnalysis.orphanedPages.length > 0) && (
        <div className="bg-red-900/40 backdrop-blur-sm rounded-xl p-6 border border-red-700/50 shadow-soft mb-6">
          <h4 className="font-semibold text-red-50 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-300" />
            Structure Issues
          </h4>
          <div className="space-y-3">
            {structureAnalysis.orphanedPages.length > 0 && (
              <div>
                <h5 className="font-medium text-red-100 mb-2">Orphaned Pages ({structureAnalysis.orphanedPages.length})</h5>
                <p className="text-sm text-red-200 mb-2">
                  These pages have no incoming internal links and may be hard to discover:
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {structureAnalysis.orphanedPages.slice(0, 5).map((url, index) => (
                    <div key={index} className="text-xs text-red-200 bg-white/5 p-2 rounded-lg border border-white/10 shadow-sm">
                      {url}
                    </div>
                  ))}
                  {structureAnalysis.orphanedPages.length > 5 && (
                    <div className="text-xs text-red-300 text-center py-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
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
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft">
        <h4 className="font-semibold text-white-500 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success-500" />
          Structure Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-white-500">Immediate Actions:</h5>
            <ul className="text-sm text-gray-400 space-y-1 p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
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
            <h5 className="font-medium text-white-500">Long-term Improvements:</h5>
            <ul className="text-sm text-gray-400 space-y-1 p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
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
