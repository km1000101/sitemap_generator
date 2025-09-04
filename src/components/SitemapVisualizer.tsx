import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SitemapNode } from '../types';
import { AlertCircle, CheckCircle, Clock, ZoomIn, ZoomOut, RotateCcw, Download, FileImage, FileText } from 'lucide-react';
import { RealisticChartIcon } from './RealisticIcons';
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
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [localData, setLocalData] = useState<SitemapNode[]>(data);

  // keep local editable copy in sync when incoming data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    if (!localData || localData.length === 0 || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Card node dimensions to emulate the reference image (moved up for layout spacing)
    const cardWidth = 170;
    const cardHeight = 180;
    const headerHeight = 26;
    const sectionHeights = { title: 44, description: 74, footer: 26 };

    // Create hierarchical data structure
    const root = d3.hierarchy(localData[0]);

    // Set up the tree layout with explicit node size and separation for neat spacing
    const horizontalGap = 120; // extra space between columns
    const verticalGap = 60; // extra space between siblings vertically
    const treeLayout = d3.tree<SitemapNode>()
      .nodeSize([cardHeight + verticalGap, cardWidth + horizontalGap])
      .separation((a, b) => (a.parent === b.parent ? 1.4 : 1.8));

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

    // Card styling continues below using the same dimensions defined earlier

    // Helper to compute safe title/labels (placed early for use by header text)
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

    // Single-word display title extractor
    const computeOneWordTitle = (d: d3.HierarchyPointNode<SitemapNode>) => {
      // Prefer URL path segment to ensure slugs like "about"/"contact" map directly
      try {
        const urlPath = new URL(d.data.url).pathname;
        const pathSegments = urlPath.split('/').filter(segment => segment.length > 0);
        if (pathSegments.length > 0) {
          const lastSegment = pathSegments[pathSegments.length - 1];
          const noExt = lastSegment.replace(/\.[^/.]+$/, '');
          const normalized = noExt.replace(/[-_]+/g, ' ').trim();
          if (normalized.length > 0) {
            const firstToken = normalized.split(/\s+/)[0];
            return firstToken.toLowerCase();
          }
        }
      } catch (_) {}

      // Fallback to first word of explicit title
      if (d.data.title) {
        const first = d.data.title.trim().split(/\s+/)[0];
        if (first) return first.toLowerCase();
      }

      // Fallback to keyword if present
      const kw = d.data.metaTags?.keywords;
      if (kw && kw.length > 0) {
        const first = String(kw[0]).trim().split(/\s+/)[0];
        if (first) return first.toLowerCase();
      }

      return 'page';
    };

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

    // Helper: inline editor for text inside boxes
    const startInlineEdit = (
      group: d3.Selection<SVGGElement, any, any, any>,
      d: any,
      field: 'title' | 'description',
      box: { x: number; y: number; width: number; height: number },
      onDone?: () => void
    ) => {
      // Remove existing editor on this node if any
      group.selectAll('.inline-editor').remove();

      const initialValue = field === 'title'
        ? (d.data.title || '')
        : (d.data.metaTags?.description || d.data.url || '');

      const editor = group
        .append('foreignObject')
        .attr('class', 'inline-editor')
        .attr('x', box.x)
        .attr('y', box.y)
        .attr('width', box.width)
        .attr('height', box.height)
        .style('overflow', 'visible');

      const div = (editor
        .append('xhtml:div') as any)
        .style('width', `${box.width - 8}px`)
        .style('height', `${box.height - 8}px`)
        .style('padding', '4px')
        .style('outline', 'none')
        .style('border-radius', '6px')
        .style('background', field === 'title' ? 'rgba(139,92,246,0.2)' : 'rgba(96,165,250,0.2)')
        .style('color', field === 'title' ? '#ffffff' : '#0b122b')
        .style('font-weight', field === 'title' ? '700' : '600')
        .style('font-size', field === 'title' ? '12px' : '11px')
        .attr('contenteditable', 'true')
        .text(initialValue);

      // focus caret at end
      setTimeout(() => {
        const el = (div.node() as HTMLElement);
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }, 0);

      const commit = () => {
        const newValue = (div.text() as string).trim();
        if (field === 'title') {
          d.data.title = newValue || d.data.title;
        } else {
          if (!d.data.metaTags) d.data.metaTags = {} as any;
          d.data.metaTags.description = newValue || d.data.metaTags.description;
        }
        editor.remove();
        setLocalData(prev => [...prev]);
        if (onDone) onDone();
      };

      (div.node() as HTMLElement).addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        } else if (e.key === 'Escape') {
          editor.remove();
        }
      });
      (div.node() as HTMLElement).addEventListener('blur', () => commit());
    };

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

    // Header title (single-word page name in white, centered)
    nodes.append('text')
      .attr('class', 'header-title')
      .attr('x', cardWidth / 2)
      .attr('y', headerHeight / 2 + 4)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .style('fill', '#ffffff')
      .style('pointer-events', 'none')
      .text(d => {
        const t = computeOneWordTitle(d as any);
        return t.length > 36 ? t.substring(0, 36) + '…' : t;
      });

    // Node action buttons (add child / delete)
    const actionGroup = nodes.append('g').attr('transform', `translate(${cardWidth - 36}, 6)`);
    // Add button
    const addBtn = actionGroup.append('g').style('cursor', 'pointer');
    addBtn
      .append('rect')
      .attr('width', 16)
      .attr('height', 16)
      .attr('rx', 4)
      .attr('fill', 'rgba(34,197,94,0.15)')
      .attr('stroke', 'rgba(34,197,94,0.6)');
    addBtn
      .append('text')
      .attr('x', 8)
      .attr('y', 11)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', '#22c55e')
      .text('+');
    addBtn.on('click', (event, d: any) => {
      event.stopPropagation();
      const title = window.prompt('New child page title:', 'New Page');
      if (title === null) return;
      const url = window.prompt('New child URL:', '/new-page') || '/new-page';
      const newNode: SitemapNode = {
        url,
        title: title || 'New Page',
        depth: (d.data.depth || 0) + 1,
        children: [],
        status: 'pending'
      } as SitemapNode;
      d.data.children = Array.isArray(d.data.children) ? d.data.children : [];
      d.data.children.push(newNode);
      // trigger rerender
      setLocalData(prev => [...prev]);
    });

    // Delete button (hidden for root)
    const delGroup = nodes.append('g').attr('transform', `translate(${cardWidth - 18}, 6)`);
    const delBtn = delGroup.append('g').style('cursor', 'pointer');
    delBtn
      .append('rect')
      .attr('width', 16)
      .attr('height', 16)
      .attr('rx', 4)
      .attr('fill', 'rgba(239,68,68,0.15)')
      .attr('stroke', 'rgba(239,68,68,0.6)');
    delBtn
      .append('text')
      .attr('x', 8)
      .attr('y', 11)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', '#ef4444')
      .text('×');
    delBtn.on('click', (event, d: any) => {
      event.stopPropagation();
      if (!d.parent) {
        alert('Cannot delete the root node.');
        return;
      }
      const confirmed = window.confirm(`Delete "${d.data.title || d.data.url}" and its children?`);
      if (!confirmed) return;
      const parentChildren = d.parent.data.children || [];
      const idx = parentChildren.indexOf(d.data);
      if (idx >= 0) {
        parentChildren.splice(idx, 1);
        setLocalData(prev => [...prev]);
      }
    });

    // (moved earlier)

    // Title section (purple)
    nodes.append('rect')
      .attr('x', 10)
      .attr('y', headerHeight + 6)
      .attr('width', cardWidth - 20)
      .attr('height', sectionHeights.title)
      .attr('rx', 6)
      .attr('fill', '#8b5cf6')
      .attr('class', 'title-rect');

    const titleDisplay = nodes.append('foreignObject')
      .attr('class', 'title-display')
      .attr('x', 10)
      .attr('y', headerHeight + 6)
      .attr('width', cardWidth - 20)
      .attr('height', sectionHeights.title);

    titleDisplay
      .append('xhtml:div')
      .style('width', `${cardWidth - 20}px`)
      .style('min-height', `${sectionHeights.title}px`)
      .style('overflow-wrap', 'break-word')
      .style('text-align', 'center')
      .style('color', '#ffffff')
      .style('font-weight', '700')
      .style('font-size', '12px')
      .style('line-height', '16px')
      .style('padding', '6px 6px 4px')
      .text(d => computeOneWordTitle(d as any));

    titleDisplay.on('dblclick', (event, d: any) => {
      event.stopPropagation();
      const group = d3.select((event.currentTarget as SVGForeignObjectElement).parentNode as SVGGElement);
      startInlineEdit(group, d, 'title', {
        x: 10,
        y: headerHeight + 6,
        width: cardWidth - 20,
        height: sectionHeights.title
      });
    });

    // Description section (blue)
    nodes.append('rect')
      .attr('x', 10)
      .attr('y', headerHeight + 12 + sectionHeights.title)
      .attr('width', cardWidth - 20)
      .attr('height', sectionHeights.description)
      .attr('rx', 6)
      .attr('fill', '#60a5fa')
      .attr('class', 'desc-rect');

    const descDisplay = nodes.append('foreignObject')
      .attr('class', 'desc-display')
      .attr('x', 10)
      .attr('y', headerHeight + 12 + sectionHeights.title)
      .attr('width', cardWidth - 20)
      .attr('height', sectionHeights.description);

    descDisplay
      .append('xhtml:div')
      .style('width', `${cardWidth - 20}px`)
      .style('overflow-wrap', 'break-word')
      .style('padding', '8px 10px')
      .style('text-align', 'center')
      .style('color', '#0b122b')
      .style('font-weight', '600')
      .style('font-size', '11px')
      .text(d => (d.data.metaTags?.description ? d.data.metaTags.description : d.data.url));

    descDisplay.on('dblclick', (event, d: any) => {
      event.stopPropagation();
      const group = d3.select((event.currentTarget as SVGForeignObjectElement).parentNode as SVGGElement);
      startInlineEdit(group, d, 'description', {
        x: 10,
        y: headerHeight + 12 + sectionHeights.title,
        width: cardWidth - 20,
        height: sectionHeights.description
      });
    });

    // Footer section (green)
    nodes.append('rect')
      .attr('x', 10)
      .attr('y', cardHeight - sectionHeights.footer - 10)
      .attr('width', cardWidth - 20)
      .attr('height', sectionHeights.footer)
      .attr('rx', 6)
      .attr('fill', '#22c55e')
      .attr('class', 'footer-rect');

    nodes.append('text')
      .attr('x', cardWidth / 2)
      .attr('y', cardHeight - sectionHeights.footer - 10 + sectionHeights.footer / 2 + 4)
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('fill', '#083d19')
      .attr('class', 'footer-text')
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

    // After initial render, expand nodes to fit their content
    nodes.each(function(d: any) {
      const group = d3.select(this);
      const titleFO = group.select<SVGForeignObjectElement>('foreignObject.title-display');
      const titleDiv = group.select<HTMLElement>('foreignObject.title-display > div');
      const descFO = group.select<SVGForeignObjectElement>('foreignObject.desc-display');
      const descDiv = group.select<HTMLElement>('foreignObject.desc-display > div');

      const measuredTitle = (titleDiv.node() as HTMLElement)?.scrollHeight || sectionHeights.title;
      const measuredDesc = (descDiv.node() as HTMLElement)?.scrollHeight || sectionHeights.description;
      const titleH = Math.max(sectionHeights.title, measuredTitle);
      const descH = Math.max(24, measuredDesc);

      titleFO.attr('height', titleH);
      group.select<SVGRectElement>('rect.title-rect').attr('height', titleH);
      descFO
        .attr('y', headerHeight + 12 + sectionHeights.title + (titleH - sectionHeights.title))
        .attr('height', descH);
      group.select<SVGRectElement>('rect.desc-rect')
        .attr('y', headerHeight + 12 + sectionHeights.title + (titleH - sectionHeights.title))
        .attr('height', descH);

      const totalHeight = headerHeight + 6 + titleH + 12 + descH + 10 + sectionHeights.footer + 10;
      d.data.__cardHeight = totalHeight;

      // Resize card and reposition footer
      group.select<SVGRectElement>('rect.card-outer').attr('height', totalHeight);
      group.select<SVGRectElement>('rect.footer-rect').attr('y', totalHeight - sectionHeights.footer - 10);
      group.select<SVGTextElement>('text.footer-text').attr('y', totalHeight - sectionHeights.footer - 10 + sectionHeights.footer / 2 + 4);

      // Recenter node vertically based on new height
      group.attr('transform', `translate(${d.y - cardWidth / 2},${d.x - totalHeight / 2})`);
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
    zoomRef.current = zoom;

    // Cleanup function
    return () => {
      tooltip.remove();
    };

  }, [localData, width, height]);

  // Zoom control functions
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomRef.current.scaleBy as any, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomRef.current.scaleBy as any, 1 / 1.5);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomRef.current.transform as any, d3.zoomIdentity);
    }
  };

  // Download functions
  const handleDownloadPNG = async () => {
    if (!svgRef.current) return;

    try {
      const svgElement = svgRef.current;
      const canvas = await html2canvas(svgElement.parentElement!, {
        background: '#000000',
        useCORS: true,
        allowTaint: true,
        scale: 3,
        width: width,
        height: height
      } as any);

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
      const captureTarget = svgElement.parentElement!; // container with background and padding

      // Hide tooltips/interactive overlays during capture
      const tooltips = Array.from(document.querySelectorAll('.tooltip')) as HTMLElement[];
      tooltips.forEach(t => (t.style.display = 'none'));

      // Ensure a white background to avoid dark/transparent PDF
      const previousBg = captureTarget.style.background;
      captureTarget.style.background = '#ffffff';

      // Render at high scale for crispness
      const canvas = await html2canvas(captureTarget, {
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        scale: 4,
        width: captureTarget.scrollWidth,
        height: captureTarget.scrollHeight,
        windowWidth: captureTarget.scrollWidth,
        windowHeight: captureTarget.scrollHeight
      } as any);

      // Restore styles
      captureTarget.style.background = previousBg;
      tooltips.forEach(t => (t.style.display = ''));

      const imgData = canvas.toDataURL('image/png');

      // PDF setup with margins and header
      const pdf = new jsPDF({
        orientation: (captureTarget.scrollWidth >= captureTarget.scrollHeight) ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // mm
      const headerHeight = 10; // mm

      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2 - headerHeight;

      const imgWidthMm = usableWidth;
      const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

      // Header
      pdf.setFontSize(12);
      pdf.setTextColor(20);
      const title = 'Sitemap Visual Tree';
      const dateStr = new Date().toLocaleString();
      pdf.text(title, margin, margin + 6);
      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text(dateStr, pageWidth - margin, margin + 6, { align: 'right' as any });

      // Add image, paginate if taller than one page
      let yOffset = margin + headerHeight;
      let remainingHeight = imgHeightMm;
      let imgY = 0;

      // We reuse the same image and shift it up for each subsequent page
      pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidthMm, imgHeightMm);
      remainingHeight -= usableHeight;
      imgY = remainingHeight * -1; // tracked for clarity

      while (remainingHeight > 0) {
        pdf.addPage();
        // Header on each page
        pdf.setFontSize(12);
        pdf.setTextColor(20);
        pdf.text(title, margin, margin + 6);
        pdf.setFontSize(9);
        pdf.setTextColor(100);
        pdf.text(dateStr, pageWidth - margin, margin + 6, { align: 'right' as any });

        const position = (remainingHeight - imgHeightMm) + (margin + headerHeight);
        pdf.addImage(imgData, 'PNG', margin, position, imgWidthMm, imgHeightMm);
        remainingHeight -= usableHeight;
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
            <RealisticChartIcon width={20} height={20} />
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
