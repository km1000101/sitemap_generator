import React, { useState } from 'react';
import { SitemapNode } from 'types';
import { ChevronRight, ChevronDown, ExternalLink, AlertCircle, CheckCircle, Clock, Globe, FileText, Layers } from 'lucide-react';
import { RealisticListIcon } from 'components/RealisticIcons';

interface SitemapListProps {
  nodes: SitemapNode[];
  onNodeClick?: (node: SitemapNode) => void;
}

const SitemapList: React.FC<SitemapListProps> = ({ nodes, onNodeClick }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (url: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(url)) {
      newExpanded.delete(url);
    } else {
      newExpanded.add(url);
    }
    setExpandedNodes(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center shadow-md">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        );
      case 'crawling':
        return (
          <div className="w-8 h-8 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md">
            <Clock className="w-4 h-4 text-white" />
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center shadow-md">
            <Clock className="w-4 h-4 text-white" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-success-900/40 backdrop-blur-sm text-success-100 text-xs font-semibold rounded-full border border-success-700/50 shadow-sm">
            Completed
          </span>
        );
      case 'crawling':
        return (
          <span className="px-3 py-1 bg-brand-blue-900/40 backdrop-blur-sm text-brand-blue-100 text-xs font-semibold rounded-full border border-brand-blue-700/50 shadow-sm">
            Crawling
          </span>
        );
      case 'error':
        return (
          <span className="px-3 py-1 bg-red-900/40 backdrop-blur-sm text-red-100 text-xs font-semibold rounded-full border border-red-700/50 shadow-sm">
            Error
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-700/50 backdrop-blur-sm text-gray-400 text-xs font-semibold rounded-full border border-gray-600/50 shadow-sm">
            Unknown
          </span>
        );
    }
  };

  const renderNode = (node: SitemapNode, depth: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.url);
    const indent = depth * 24;

    return (
      <div key={node.url} className="group">
        <div 
          className={`flex items-center py-4 px-4 bg-white/10 backdrop-blur-sm rounded-lg mx-2 my-1 border border-white/20 shadow-sm transition-all duration-300 transform hover:scale-[1.005] hover:shadow-medium cursor-pointer ${
            node.status === 'completed' ? 'border-l-4 border-l-success-500' :
            node.status === 'error' ? 'border-l-4 border-l-red-500' :
            node.status === 'crawling' ? 'border-l-4 border-l-brand-blue-500' :
            'border-l-4 border-l-gray-600'
          }`}
          style={{ paddingLeft: `${indent + 16}px` }}
          onClick={() => onNodeClick?.(node)}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.url);
              }}
              className="mr-3 text-gray-400 hover:text-brand-blue-500 transition-colors duration-200 p-1 rounded-lg bg-white/10 border border-white/20 shadow-sm hover:bg-white/20"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Status Icon */}
          <div className="mr-4">
            {getStatusIcon(node.status)}
          </div>

          {/* Node Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-white-500 truncate text-lg">
                {node.title || 'No Title'}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-brand-blue-900/40 backdrop-blur-sm text-brand-blue-100 text-xs font-semibold rounded-full border border-brand-blue-700/50 shadow-sm flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Depth {node.depth}
                </span>
                {getStatusBadge(node.status)}
              </div>
            </div>
            
            <div className="text-sm text-gray-400 truncate flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="font-mono bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-xs shadow-sm">{node.url}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(node.url, '_blank');
                }}
                className="text-brand-blue-500 hover:text-brand-blue-400 transition-colors duration-200 p-1 rounded-lg bg-white/10 border border-white/20 shadow-sm hover:bg-white/20"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            
            {node.error && (
              <div className="flex items-center gap-2 text-xs text-red-200 mt-2 p-2 bg-red-900/40 rounded-lg border border-red-700/50 shadow-sm">
                <AlertCircle className="w-3 h-3" />
                <span className="font-medium">Error: {node.error}</span>
              </div>
            )}
            
            {node.lastModified && (
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 p-2 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                <FileText className="w-3 h-3" />
                <span>Last modified: {new Date(node.lastModified).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-6 border-l-2 border-gray-700/50">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 shadow-large">
      <div className="px-6 py-4 border-b border-white/10 bg-white/10 backdrop-blur-sm rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <RealisticListIcon width={20} height={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white-500">Sitemap Structure</h3>
            <p className="text-sm text-gray-400">Click on nodes to expand/collapse and view details</p>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto p-2">
        {nodes.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white/10 rounded-xl m-2 border border-white/20 shadow-sm">
            <RealisticListIcon width={40} height={40} />
            <p>No sitemap data available</p>
          </div>
        ) : (
          nodes.map(node => renderNode(node))
        )}
      </div>
    </div>
  );
};

export default SitemapList;
