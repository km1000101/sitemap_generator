import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SitemapNode } from '../types';
import { BarChart3, AlertCircle, CheckCircle, Clock, ZoomIn, ZoomOut, RotateCcw, Download, FileImage, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SitemapVisualizerProps {
  data: SitemapNode[];
  width?: number;
  height?: number;
}

const SitemapVisualizer: React.FC<SitemapVisualizerProps> = ({ 
  data, 
  width = 800, 
  height = 600 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Create hierarchical data structure
    const root = d3.hierarchy(data[0]);
    
    // Set up the tree layout
    const treeLayout = d3.tree<SitemapNode>()
      .size([height - 120, width - 120]);

    // Generate the tree layout
    const treeData = treeLayout(root);

    // Create gradient definitions
    const defs = svg.append('defs');
    
    // Add gradients for different statuses
    const gradients = {
      completed: defs.append('linearGradient')
        .attr('id', 'gradient-completed')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%'),
      crawling: defs.append('linearGradient')
        .attr('id', 'gradient-crawling')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%'),
      error: defs.append('linearGradient')
        .attr('id', 'gradient-error')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%'),
      default: defs.append('linearGradient')
        .attr('id', 'gradient-default')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%')
    };

    // Define gradient colors
    gradients.completed
      .append('stop').attr('offset', '0%').attr('stop-color', '#22c55e')
      .append('stop').attr('offset', '100%').attr('stop-color', '#16a34a');
    gradients.crawling
      .append('stop').attr('offset', '0%').attr('stop-color', '#007bff') /* brand-blue-500 */
      .append('stop').attr('offset', '100%').attr('stop-color', '#0056b3'); /* A darker shade of brand-blue */
    gradients.error
      .append('stop').attr('offset', '0%').attr('stop-color', '#ef4444')
      .append('stop').attr('offset', '100%').attr('stop-color', '#dc2626');
    gradients.default
      .append('stop').attr('offset', '0%').attr('stop-color', '#F77C21') /* accent-400 */
      .append('stop').attr('offset', '100%').attr('stop-color', '#C44A00'); /* accent-600 */

    // Card node dimensions to emulate the reference image
    const cardWidth = 170;
    const cardHeight = 180;
    const headerHeight = 26;
    const sectionHeights = { title: 44, description: 74, footer: 26 };

    // Create links with elbow connectors
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        const source = { x: d.source.x, y: d.source.y + cardWidth / 2 };
        const target = { x: d.target.x, y: d.target.y - cardWidth / 2 };
        const midY = (source.y + target.y) / 2;
        return `M${source.y},${source.x} C${midY},${source.x} ${midY},${target.x} ${target.y},${target.x}`;
      })
      .style('fill', 'none')
      .style('stroke', '#7aa0c4')
      .style('stroke-width', '2px')
      .style('stroke-opacity', '0.8')
      .style('transition', 'all 0.3s ease');

    // Create card nodes
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y - cardWidth / 2},${d.x - cardHeight / 2})`)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.3s ease');

    // Outer card
    nodes.append('rect')
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('width', cardWidth)
      .attr('height', cardHeight)
      .attr('fill', 'rgba(17, 24, 39, 0.6)')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 1.5)
      .attr('class', 'card-outer')
      .style('filter', 'drop-shadow(0 8px 20px rgba(0,0,0,0.25))');

    // Header bar and dots
    nodes.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', cardWidth)
      .attr('height', headerHeight)
      .attr('fill', 'rgba(255,255,255,0.05)')
      .attr('stroke', 'rgba(255,255,255,0.08)');

    const dots = nodes.append('g').attr('transform', 'translate(10,13)');
    dots.append('circle').attr('r', 3).attr('fill', '#9CA3AF');
    dots.append('circle').attr('cx', 8).attr('r', 3).attr('fill', '#9CA3AF');
    dots.append('circle').attr('cx', 16).attr('r', 3).attr('fill', '#9CA3AF');

    // Helper to compute safe title/labels
    const computeTitle = (d: d3.HierarchyPointNode<SitemapNode>) => {
      let title = d.data.title;
      if (!title || title === 'No Title' || title === 'Untitled Page') {
        try {
          const urlPath = new URL(d.data.url).pathname;
          const pathSegments = urlPath.split('/').filter(segment => segment.length > 0);
          if (pathSegments.length > 0) {
            const lastSegment = pathSegments[pathSegments.length - 1];
            title = lastSegment.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
            title = title.charAt(0).toUpperCase() + title.slice(1);
          }
        } catch (_) {}
      }
      if (!title) title = 'Page';
      return title;
    };

    const computeFooter = (d: d3.HierarchyPointNode<SitemapNode>) => {
      try {
        const hostname = new URL(d.data.url).hostname;
        return hostname.replace(/^www\./, '');
      } catch (_) {
        return 'Link';
      }
    };

    // Title section (purple)
    nodes.append('rect')
      .attr('x', 10)
      .attr('y', headerHeight + 6)
      .attr('width', cardWidth - 20)
      .attr('height', sectionHeights.title)
      .attr('rx', 6)
      .attr('fill', '#8b5cf6');

    nodes.append('text')
      .attr('x', cardWidth / 2)
      .attr('y', headerHeight + 6 + sectionHeights.title / 2 + 4)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .style('fill', '#ffffff')
      .text(d => {
        const t = computeTitle(d as any);
        return t.length > 28 ? t.substring(0, 28) + '…' : t;
      });

    // Description section (blue)
    nodes.append('rect')
      .attr('x', 10)
      .attr('y', headerHeight + 12 + sectionHeights.title)
      .attr('width', cardWidth - 20)
      .attr('height', sectionHeights.description)
      .attr('rx', 6)
      .attr('fill', '#60a5fa');

    nodes.append('text')
      .attr('x', cardWidth / 2)
      .attr('y', headerHeight + 12 + sectionHeights.title + 18)
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', '#0b122b')
      .text(d => (d.data.metaTags?.description ? d.data.metaTags.description : d.data.url))
      .call(text => text.each(function() {
        const self = d3.select(this);
        const textContent = self.text();
        const maxChars = 60;
        if (textContent.length > maxChars) {
          self.text(textContent.substring(0, maxChars) + '…');
        }
      }));

    // Footer section (green)
    nodes.append('rect')
      .attr('x', 10)
      .attr('y', cardHeight - sectionHeights.footer - 10)
      .attr('width', cardWidth - 20)
      .attr('height', sectionHeights.footer)
      .attr('rx', 6)
      .attr('fill', '#22c55e');

    nodes.append('text')
      .attr('x', cardWidth / 2)
      .attr('y', cardHeight - sectionHeights.footer - 10 + sectionHeights.footer / 2 + 4)
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('fill', '#083d19')
      .text(d => computeFooter(d as any));

    // Enhanced tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(17, 24, 39, 0.95)')
      .style('color', 'white')
      .style('padding', '12px 16px')
      .style('border-radius', '8px')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('backdrop-filter', 'blur(8px)')
      .style('border', '1px solid rgba(255, 255, 255, 0.1)')
      .style('box-shadow', '0 10px 25px -5px rgba(0, 0, 0, 0.3)')
      .style('max-width', '300px')
      .style('line-height', '1.4');

    // Add hover effects
    nodes
      .on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', d.children ? 10 : 8)
          .style('filter', 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))'); /* More pronounced shadow */

        tooltip.transition()
          .duration(200)
          .style('opacity', 1);

        const statusColor = {
          'pending': '#F77C21', /* Use accent color for pending */
          'completed': '#22c55e',
          'crawling': '#007bff', /* Use brand-blue color for crawling */
          'error': '#ef4444'
        }[d.data.status] || '#F77C21'; /* Default to accent-400 color */

        // Get improved title for tooltip
        let tooltipTitle = d.data.title;
        if (!tooltipTitle || tooltipTitle === 'No Title' || tooltipTitle === 'Untitled Page') {
          try {
            const urlPath = new URL(d.data.url).pathname;
            const pathSegments = urlPath.split('/').filter(segment => segment.length > 0);
            if (pathSegments.length > 0) {
              const lastSegment = pathSegments[pathSegments.length - 1];
              tooltipTitle = lastSegment.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
              tooltipTitle = tooltipTitle.charAt(0).toUpperCase() + tooltipTitle.slice(1);
            }
          } catch (e) {
            // URL parsing failed, use fallback
          }
        }
        if (!tooltipTitle || tooltipTitle === 'No Title' || tooltipTitle === 'Untitled Page') {
          tooltipTitle = 'Page';
        }

        tooltip.html(`
          <div style="margin-bottom: 8px;">
            <strong style="color: ${statusColor}">${tooltipTitle}</strong>
          </div>
          <div style="font-size: 11px; color: #d1d5db; margin-bottom: 4px;">
            ${d.data.url}
          </div>
          <div style="font-size: 11px; color: #9ca3af;">
            Status: <span style="color: ${statusColor}">${d.data.status}</span><br>
            Depth: ${d.data.depth}<br>
            ${d.data.lastModified ? `Modified: ${new Date(d.data.lastModified).toLocaleDateString()}` : ''}
            ${d.data.error ? `<br>Error: ${d.data.error}` : ''}
            ${d.data.wordCount ? `<br>Words: ${d.data.wordCount}` : ''}
            ${d.data.internalLinks ? `<br>Internal Links: ${d.data.internalLinks}` : ''}
            ${d.data.externalLinks ? `<br>External Links: ${d.data.externalLinks}` : ''}
            ${d.data.images ? `<br>Images: ${d.data.images}` : ''}
            ${d.data.h1Tags ? `<br>H1 Tags: ${d.data.h1Tags}` : ''}
            ${d.data.h2Tags ? `<br>H2 Tags: ${d.data.h2Tags}` : ''}
            ${d.data.h3Tags ? `<br>H3 Tags: ${d.data.h3Tags}` : ''}
            ${d.data.metaTags?.description ? `<br><br><strong>Description:</strong><br>${d.data.metaTags.description.substring(0, 100)}${d.data.metaTags.description.length > 100 ? '...' : ''}` : ''}
            ${d.data.metaTags?.keywords && d.data.metaTags.keywords.length > 0 ? `<br><strong>Keywords:</strong> ${d.data.metaTags.keywords.slice(0, 3).join(', ')}${d.data.metaTags.keywords.length > 3 ? '...' : ''}` : ''}
            ${d.data.metaTags?.canonical ? `<br><strong>Canonical:</strong> ${d.data.metaTags.canonical}` : ''}
            ${d.data.metaTags?.robots ? `<br><strong>Robots:</strong> ${d.data.metaTags.robots}` : ''}
            ${d.data.metaTags?.ogTitle ? `<br><strong>OG Title:</strong> ${d.data.metaTags.ogTitle}` : ''}
            ${d.data.metaTags?.twitterTitle ? `<br><strong>Twitter Title:</strong> ${d.data.metaTags.twitterTitle}` : ''}
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', d.children ? 8 : 6)
          .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Center the visualization properly
    const bounds = g.node()?.getBBox();
    if (bounds) {
      console.log('Bounds:', bounds);
      const scale = Math.min(
        (width - 120) / Math.max(bounds.width, 1), 
        (height - 120) / Math.max(bounds.height, 1)
      ) * 0.8;
      
      console.log('Scale:', scale);
      
      const transform = `translate(${
        (width - bounds.width * scale) / 2 - bounds.x * scale
      },${
        (height - bounds.height * scale) / 2 - bounds.y * scale
      }) scale(${scale})`;
      
      console.log('Transform:', transform);
      g.attr('transform', transform);
    } else {
      console.warn('No bounds found for tree visualization');
      
      // Add a simple test visualization to ensure something is visible
      g.append('rect')
        .attr('x', 10)
        .attr('y', 10)
        .attr('width', 100)
        .attr('height', 50)
        .attr('fill', '#007bff') /* Use brand-blue color */
        .attr('stroke', '#0056b3') /* Use darker brand-blue color */
        .attr('stroke-width', '2');
      
      g.append('text')
        .attr('x', 60)
        .attr('y', 35)
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .text('Test');
    }

    // Set up zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5]) // Min zoom 0.1x, max zoom 5x
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    // Apply zoom behavior to SVG
    svg.call(zoom);

    // Cleanup function
    return () => {
      tooltip.remove();
    };

  }, [data, width, height]);

  // Zoom control functions
  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy, 1.5
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy, 1 / 1.5
      );
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        d3.zoom<SVGSVGElement, unknown>().transform,
        d3.zoomIdentity
      );
    }
  };

  // Download functions
  const handleDownloadPNG = async () => {
    if (!svgRef.current) return;

    try {
      const svgElement = svgRef.current;
      const canvas = await html2canvas(svgElement.parentElement!, {
        background: '#0A1128',
        useCORS: true,
        allowTaint: true,
        width: width,
        height: height
      });

      const link = document.createElement('a');
      link.download = `sitemap-tree-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to generate PNG. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!svgRef.current) return;

    try {
      const svgElement = svgRef.current;
      const canvas = await html2canvas(svgElement.parentElement!, {
        background: '#0A1128',
        useCORS: true,
        allowTaint: true,
        width: width,
        height: height
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`sitemap-tree-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-brand-blue-500 rounded-lg flex items-center justify-center shadow-md transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white-500">Visual Tree View</h3>
        </div>
        <p className="text-gray-400 text-sm">Interactive visualization of your website structure</p>
      </div>
      
      <div className="bg-dark-blue-800/60 backdrop-blur-lg rounded-3xl border border-white/10 shadow-large p-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/20 shadow-sm">
              <span className="text-sm text-white-500/70 font-semibold">Zoom Controls:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 border border-white/20 shadow-sm text-gray-400 hover:text-brand-blue-500"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 border border-white/20 shadow-sm text-gray-400 hover:text-brand-blue-500"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 border border-white/20 shadow-sm text-gray-400 hover:text-brand-blue-500"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/20 shadow-sm">
              <span className="text-sm text-white-500/70 font-semibold">Export:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center gap-2 px-3 py-2 bg-brand-blue-900/40 hover:bg-brand-blue-800/50 text-brand-blue-100 rounded-lg transition-colors duration-200 text-sm font-semibold border border-brand-blue-700/50 shadow-sm"
                  title="Download as PNG"
                >
                  <FileImage className="w-4 h-4" />
                  PNG
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-3 py-2 bg-accent-900/40 hover:bg-accent-800/50 text-accent-100 rounded-lg transition-colors duration-200 text-sm font-semibold border border-accent-700/50 shadow-sm"
                  title="Download as PDF"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>
          </div>
          <div className="text-sm text-white-500/70 font-semibold bg-white/10 px-3 py-2 rounded-xl border border-white/20 shadow-sm">
            <span className="font-bold">Zoom Level:</span> {Math.round(zoomLevel * 100)}%
          </div>
        </div>

        {/* Zoom Instructions */}
        <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm">
          <p className="text-sm text-gray-400">
            <strong>Tip:</strong> Use mouse wheel to zoom, drag to pan, or use the zoom controls above.
          </p>
        </div>

        <div className="w-full overflow-auto">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="mx-auto cursor-grab active:cursor-grabbing bg-dark-blue-800/30 rounded-xl shadow-inner border border-white/10"
          />
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm p-4 bg-white/10 rounded-xl border border-white/20 shadow-soft">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent-500 rounded-full shadow-md"></div>
            <span className="text-white-500/70 font-medium">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success-500 rounded-full shadow-md"></div>
            <span className="text-white-500/70 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-brand-blue-500 rounded-full shadow-md"></div>
            <span className="text-white-500/70 font-medium">Crawling</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-md"></div>
            <span className="text-white-500/70 font-medium">Error</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapVisualizer;
