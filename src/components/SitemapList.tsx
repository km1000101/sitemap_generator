import React, { useState } from 'react';
import { SitemapNode } from '../types';
import { ChevronRight, ChevronDown, ExternalLink, AlertCircle, CheckCircle, Clock, Layers, Globe, FileText } from 'lucide-react';

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
          <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-green-500 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        );
      case 'crawling':
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-slate-500 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-success-100 to-green-100 text-success-700 text-xs font-semibold rounded-full border border-success-200">
            Completed
          </span>
        );
      case 'crawling':
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 text-xs font-semibold rounded-full border border-primary-200">
            Crawling
          </span>
        );
      case 'error':
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
            Error
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
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
          className={`flex items-center py-4 px-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 cursor-pointer transition-all duration-200 rounded-lg mx-2 my-1 ${
            node.status === 'completed' ? 'border-l-4 border-l-success-500 bg-gradient-to-r from-success-50/30 to-transparent' :
            node.status === 'error' ? 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/30 to-transparent' :
            node.status === 'crawling' ? 'border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/30 to-transparent' :
            'border-l-4 border-l-gray-300 bg-gradient-to-r from-gray-50/30 to-transparent'
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
              className="mr-3 text-gray-500 hover:text-primary-600 transition-colors duration-200 p-1 rounded-lg hover:bg-white/60"
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
              <span className="font-semibold text-gray-900 truncate text-lg">
                {node.title || 'No Title'}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 text-xs font-semibold rounded-full border border-primary-200 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Depth {node.depth}
                </span>
                {getStatusBadge(node.status)}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 truncate flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{node.url}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(node.url, '_blank');
                }}
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200 p-1 rounded-lg hover:bg-primary-100"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            
            {node.error && (
              <div className="flex items-center gap-2 text-xs text-red-600 mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-3 h-3" />
                <span className="font-medium">Error: {node.error}</span>
              </div>
            )}
            
            {node.lastModified && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <FileText className="w-3 h-3" />
                <span>Last modified: {new Date(node.lastModified).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-6 border-l-2 border-gray-200">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-large">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sitemap Structure</h3>
            <p className="text-sm text-gray-600">Click on nodes to expand/collapse and view details</p>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto p-2">
        {nodes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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
