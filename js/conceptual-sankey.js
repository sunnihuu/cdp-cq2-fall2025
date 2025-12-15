// Conceptual Sankey diagram using ESM imports of D3 and d3-sankey
// Exports: renderConceptSankey(containerId, data)
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { sankey, sankeyLinkHorizontal } from 'https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/+esm';

export function renderConceptSankey(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear previous
  container.innerHTML = "";

  const rect0 = container.getBoundingClientRect();
  const W = Math.max(640, Math.floor(rect0.width || container.clientWidth || (container.parentElement ? container.parentElement.clientWidth : 900) || 900));
  const H = Math.max(420, Math.floor(rect0.height || container.clientHeight || (container.parentElement ? container.parentElement.clientHeight : window.innerHeight * 0.7) || 560));
  const m = { top: 10, right: 10, bottom: 30, left: 10 };

  // Colors
  const nodeFill = (d) => (d.category === 'levers' ? '#f2f7eb' : '#f6f6f4');
  const nodeStroke = (d) => (d.category === 'levers' ? '#a8c48a' : '#d7d7d5');
  const linkColor = '#bfbfbf';
  const linkHi = (d) => (d.source.category === 'levers' || d.target.category === 'levers' ? '#a8c48a' : '#8e8e8e');

  // Use names in links and let sankey resolve them via nodeId
  const nodes = data.nodes.map(d => ({ ...d }));
  const links = data.links.map(l => ({ ...l }));

  const sk = sankey()
    .nodeId(d => d.name)
    .nodeWidth(14)
    .nodePadding(16)
    .nodeAlign((node, n) => (node.col ? node.col - 1 : 0))
    .extent([[m.left, m.top], [W - m.right, H - m.bottom]]);

  const graph = sk({ nodes, links });

  const svg = d3.create('svg')
    .attr('width', W)
    .attr('height', H)
    .attr('viewBox', [0, 0, W, H])
    .style('max-width', '100%')
    .style('height', 'auto');

  // Append early so text measurement (getBBox) works reliably
  container.appendChild(svg.node());

  const defs = d3.select(container).select('svg').append('defs');

  // Links
  const link = svg.append('g')
    .attr('fill', 'none')
    .selectAll('path')
    .data(graph.links)
    .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', linkColor)
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', d => Math.max(1, d.width));

  // Nodes
  const node = svg.append('g')
    .selectAll('g')
    .data(graph.nodes)
    .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .style('cursor', 'default');

  node.append('rect')
    .attr('width', d => Math.max(1, d.x1 - d.x0))
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('fill', d => nodeFill(d))
    .attr('stroke', d => nodeStroke(d))
    .attr('stroke-width', 1.2)
    .attr('rx', 3).attr('ry', 3);

  // Labels: placed outside nodes; wrap to max 2 lines
  const labelGroup = d3.select(container).select('svg').append('g').attr('font-family', 'inherit');
  const lineHeight = 14;
  const maxLines = 2;
  const labelWidth = 160; // wrap width for labels

  function wrapText(g, text, x, y, align) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = [];
    const measurer = labelGroup.append('text').attr('font-size', 12).attr('opacity', 0);
    for (const w of words) {
      const testLine = [...line, w].join(' ');
      measurer.text(testLine);
      const width = measurer.node().getBBox().width;
      if (width > labelWidth && line.length) {
        lines.push(line.join(' '));
        line = [w];
        if (lines.length >= maxLines) break;
      } else {
        line = testLine.split(' ');
      }
    }
    if (lines.length < maxLines && line.length) lines.push(line.join(' '));
    measurer.remove();

    const group = g.append('g').attr('transform', `translate(${x},${y})`).attr('text-anchor', align);
    lines.forEach((L, i) => {
      group.append('text')
        .attr('font-size', 12)
        .attr('fill', '#333')
        .attr('dy', `${i * lineHeight - ((lines.length - 1) * lineHeight)/2}px`)
        .text(L);
    });
    return group;
  }

  // Create a quick index from node name to connected links
  const linksBySource = d3.group(graph.links, d => d.source.name);
  const linksByTarget = d3.group(graph.links, d => d.target.name);

  // Labels attached after nodes so they sit on top
  const labels = labelGroup.selectAll('g.label')
    .data(graph.nodes)
    .join('g')
      .attr('class', 'label')
      .each(function(d){
        const h = d.y1 - d.y0;
        if (h < 14) return; // hide labels for tiny nodes
        const cx = (d.x0 + d.x1) / 2;
        const cy = (d.y0 + d.y1) / 2;
        const leftSide = d.col >= 4; // last column label to the left
        const x = leftSide ? d.x0 - 8 : d.x1 + 8;
        const anchor = leftSide ? 'end' : 'start';
        wrapText(d3.select(this), d.name, x, cy, anchor);
      });

  // Hover interactions: highlight connected links and nodes
  function setDimmed(dim) {
    link.transition().duration(120).attr('stroke-opacity', dim ? 0.12 : 0.35);
    node.select('rect').transition().duration(120).attr('opacity', dim ? 0.8 : 1);
    labels.transition().duration(120).attr('opacity', dim ? 0.8 : 1);
  }

  node.on('mouseenter', function(evt, nd){
    setDimmed(true);
    const outs = linksBySource.get(nd.name) || [];
    const ins  = linksByTarget.get(nd.name) || [];
    const related = new Set([nd.name]);
    outs.forEach(d => { related.add(d.target.name); });
    ins.forEach(d => { related.add(d.source.name); });

    link.filter(d => d.source.name === nd.name || d.target.name === nd.name)
      .raise()
      .transition().duration(120)
      .attr('stroke', d => linkHi(d))
      .attr('stroke-opacity', 0.9);

    node.select('rect').filter(d => related.has(d.name))
      .transition().duration(120)
      .attr('stroke-width', 1.6)
      .attr('stroke', d => d.category === 'levers' ? '#94b873' : '#9a9a9a');
  })
  .on('mouseleave', function(){
    link.transition().duration(160)
      .attr('stroke', linkColor)
      .attr('stroke-opacity', 0.35);
    node.select('rect').transition().duration(160)
      .attr('stroke', d => nodeStroke(d))
      .attr('stroke-width', 1.2);
    setDimmed(false);
  });

  // already appended
}
