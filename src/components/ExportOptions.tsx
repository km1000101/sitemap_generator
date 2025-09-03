import React from 'react';
import { SitemapData } from '../types';
import { Download, FileText, Code, Share2, FileDown, Database, Table } from 'lucide-react';

interface ExportOptionsProps {
  sitemapData: SitemapData | null;
  onExportXML: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  sitemapData,
  onExportXML,
  onExportJSON,
  onExportCSV
}) => {
  if (!sitemapData) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getEstimatedFileSize = (format: string): number => {
    const baseSize = sitemapData.totalPages * 100; // Rough estimate
    switch (format) {
      case 'XML': return baseSize * 1.2;
      case 'JSON': return baseSize * 1.5;
      case 'CSV': return baseSize * 0.8;
      default: return baseSize;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-large">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-green-500 rounded-xl flex items-center justify-center shadow-glow">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Export Sitemap</h3>
          <p className="text-gray-600">Download your sitemap in multiple formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* XML Export */}
        <div className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-medium">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-lg">XML Sitemap</span>
              <p className="text-xs text-orange-600 font-medium">Search Engine Standard</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Standard XML format compatible with Google, Bing, and other search engines
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
              Size: ~{formatFileSize(getEstimatedFileSize('XML'))}
            </span>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
          <button
            onClick={onExportXML}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-soft hover:shadow-medium transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download XML
          </button>
        </div>

        {/* JSON Export */}
        <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-medium">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-lg">JSON Data</span>
              <p className="text-xs text-blue-600 font-medium">Developer Friendly</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Structured data format for developers, APIs, and data processing tools
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
              Size: ~{formatFileSize(getEstimatedFileSize('JSON'))}
            </span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <button
            onClick={onExportJSON}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-soft hover:shadow-medium transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download JSON
          </button>
        </div>

        {/* CSV Export */}
        <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-medium">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Table className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-lg">CSV Report</span>
              <p className="text-xs text-green-600 font-medium">Analysis Ready</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Spreadsheet format for data analysis, reporting, and Excel integration
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
              Size: ~{formatFileSize(getEstimatedFileSize('CSV'))}
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <button
            onClick={onExportCSV}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-soft hover:shadow-medium transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-lg">Export Summary</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-2xl font-bold text-primary-600 mb-1">{sitemapData.totalPages}</div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-2xl font-bold text-warning-600 mb-1">{(sitemapData.crawlTime / 1000).toFixed(1)}s</div>
            <div className="text-sm text-gray-600">Crawl Time</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-2xl font-bold text-success-600 mb-1">
              {new Date(sitemapData.generatedAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Generated</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-2xl font-bold text-info-600 mb-1">
              ~{formatFileSize(getEstimatedFileSize('XML') + getEstimatedFileSize('JSON') + getEstimatedFileSize('CSV'))}
            </div>
            <div className="text-sm text-gray-600">Total Size</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-blue-50 via-primary-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Export Information</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              <strong>XML format</strong> is the industry standard for search engines. <strong>JSON format</strong> is ideal for developers and APIs. 
              <strong>CSV format</strong> is perfect for data analysis and Excel integration. Choose the format that best fits your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
