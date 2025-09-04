import React from 'react';
import { SitemapData } from 'types';
import { Download, FileText, Code, Share2, FileDown, Database, Table } from 'lucide-react';
import { RealisticDocumentIcon } from 'components/RealisticIcons';

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
    <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-large">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white-500">Export Sitemap</h3>
          <p className="text-gray-400">Download your sitemap in multiple formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* XML Export */}
        <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-brand-blue-300 transition-all duration-300 shadow-soft hover:shadow-medium">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <RealisticDocumentIcon width={20} height={20} />
            </div>
            <div>
              <span className="font-semibold text-white-500 text-lg">XML Sitemap</span>
              <p className="text-xs text-brand-blue-500 font-medium">Search Engine Standard</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Standard XML format compatible with Google, Bing, and other search engines
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
              Size: ~{formatFileSize(getEstimatedFileSize('XML'))}
            </span>
            <div className="w-2.5 h-2.5 bg-brand-blue-500 rounded-full animate-pulse"></div>
          </div>
          <button
            onClick={onExportXML}
            className="w-full bg-brand-blue-500 text-white px-6 py-3 rounded-xl hover:bg-brand-blue-400 transition-all duration-300 font-semibold shadow-soft hover:shadow-medium transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download XML
          </button>
        </div>

        {/* JSON Export */}
        <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-accent-300 transition-all duration-300 shadow-soft hover:shadow-medium">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-white-500 text-lg">JSON Data</span>
              <p className="text-xs text-accent-500 font-medium">Developer Friendly</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Structured data format for developers, APIs, and data processing tools
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
              Size: ~{formatFileSize(getEstimatedFileSize('JSON'))}
            </span>
            <div className="w-2.5 h-2.5 bg-accent-500 rounded-full animate-pulse"></div>
          </div>
          <button
            onClick={onExportJSON}
            className="w-full bg-gradient-to-r from-accent-500 to-accent-700 text-white px-6 py-3 rounded-xl hover:from-accent-600 hover:to-accent-800 transition-all duration-300 font-semibold shadow-soft hover:shadow-medium transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download JSON
          </button>
        </div>

        {/* CSV Export */}
        <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-success-300 transition-all duration-300 shadow-soft hover:shadow-medium">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center shadow-md">
              <Table className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-white-500 text-lg">CSV Report</span>
              <p className="text-xs text-success-500 font-medium">Analysis Ready</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Spreadsheet format for data analysis, reporting, and Excel integration
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full border border-white/20">
              Size: ~{formatFileSize(getEstimatedFileSize('CSV'))}
            </span>
            <div className="w-2.5 h-2.5 bg-success-500 rounded-full animate-pulse"></div>
          </div>
          <button
            onClick={onExportCSV}
            className="w-full bg-gradient-to-r from-success-500 to-success-700 text-white px-6 py-3 rounded-xl hover:from-success-600 hover:to-success-800 transition-all duration-300 font-semibold shadow-soft hover:shadow-medium transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white-500 text-lg">Export Summary</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-lg p-4 border border-white/20 shadow-sm">
            <div className="text-2xl font-bold text-brand-blue-500 mb-1">{sitemapData.totalPages}</div>
            <div className="text-sm text-gray-400">Total Pages</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-white/20 shadow-sm">
            <div className="text-2xl font-bold text-accent-500 mb-1">{(sitemapData.crawlTime / 1000).toFixed(1)}s</div>
            <div className="text-sm text-gray-400">Crawl Time</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-white/20 shadow-sm">
            <div className="text-2xl font-bold text-success-500 mb-1">
              {new Date(sitemapData.generatedAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-400">Generated</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-white/20 shadow-sm">
            <div className="text-2xl font-bold text-white-500 mb-1">
              ~{formatFileSize(getEstimatedFileSize('XML') + getEstimatedFileSize('JSON') + getEstimatedFileSize('CSV'))}
            </div>
            <div className="text-sm text-gray-400">Total Size</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-brand-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-white-500 mb-2">Export Information</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
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
