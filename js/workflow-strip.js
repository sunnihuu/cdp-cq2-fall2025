import { computationalWorkflow } from "./workflow-data.js";

// Computational Workflow Strip - Thesis Version
// Five equal circles horizontally arranged with subtle connectors and hover tooltips

export function renderWorkflowStrip(containerId) {
  const data = computationalWorkflow;
  const el = document.getElementById(containerId);
  if (!el) {
    console.error("Container not found:", containerId);
    return null;
  }

  const width = el.clientWidth || 980;
  const height = el.clientHeight || 180;

  const cfg = {
    margin: { top: 28, right: 24, bottom: 40, left: 24 },
    circleRadius: 38,
    gap: 36,
    arrowColor: "#bcbcbc",
    circleFill: "#f5f5f5",
    circleStroke: "#d8d8d8",
    circleStrokeWidth: 1.4,
    titleColor: "#444",
    subtitleColor: "#888",
    hintColor: "#666",
    labelFont: '"Lexend Deca", sans-serif'
  };

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", `width: 100%; height: auto; font-family: ${cfg.labelFont};`);

  // Title + subtitle
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", cfg.margin.top - 14)
    .attr("text-anchor", "middle")
    .attr("font-size", 16)
    .attr("font-weight", 600)
    .attr("fill", cfg.titleColor)
    .text(data.title);

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", cfg.margin.top + 2)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("fill", cfg.subtitleColor)
    .text(data.subtitle);

  const inner = svg.append("g")
    .attr("transform", `translate(${cfg.margin.left},${cfg.margin.top + 22})`);

  // Compute positions
  const totalCircleWidth = data.steps.length * (cfg.circleRadius * 2) + (data.steps.length - 1) * cfg.gap;
  const startX = (width - cfg.margin.left - cfg.margin.right - totalCircleWidth) / 2;

  const positions = data.steps.map((s, i) => {
    const cx = startX + i * ((cfg.circleRadius * 2) + cfg.gap) + cfg.circleRadius;
    const cy = (height - cfg.margin.top - cfg.margin.bottom) / 2;
    return { ...s, cx, cy };
  });

  // Connectors (lines with subtle arrows)
  positions.forEach((p, i) => {
    if (i === positions.length - 1) return;
    const next = positions[i + 1];
    const x1 = p.cx + cfg.circleRadius + 6;
    const x2 = next.cx - cfg.circleRadius - 6;
    const y = p.cy;

    // line
    inner.append("line")
      .attr("x1", x1)
      .attr("y1", y)
      .attr("x2", x2)
      .attr("y2", y)
      .attr("stroke", cfg.arrowColor)
      .attr("stroke-width", 1);

    // small arrowhead
    inner.append("path")
      .attr("d", `M ${x2 - 8},${y - 4} L ${x2},${y} L ${x2 - 8},${y + 4}`)
      .attr("fill", "none")
      .attr("stroke", cfg.arrowColor)
      .attr("stroke-width", 1);
  });

  // Circles
  const node = inner.selectAll("g.node")
    .data(positions)
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.cx},${d.cy})`)
    .style("cursor", "default");

  node.append("circle")
    .attr("r", cfg.circleRadius)
    .attr("fill", cfg.circleFill)
    .attr("stroke", cfg.circleStroke)
    .attr("stroke-width", cfg.circleStrokeWidth)
    .attr("fill-opacity", 0.22)
    .attr("stroke-opacity", 0.35)
    .on("mouseenter", function() {
      d3.select(this)
        .transition()
        .duration(180)
        .attr("fill-opacity", 0.28)
        .attr("stroke-opacity", 0.5);
    })
    .on("mouseleave", function() {
      d3.select(this)
        .transition()
        .duration(180)
        .attr("fill-opacity", 0.22)
        .attr("stroke-opacity", 0.35);
    });

  node.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", 12)
    .attr("font-weight", 500)
    .attr("fill", "#333")
    .text(d => d.label);

  // Tooltips via title
  node.append("title")
    .text(d => d.detail.join("\n"));

  // Bridge caption under the last circle
  const last = positions[positions.length - 1];
  inner.append("text")
    .attr("x", last.cx)
    .attr("y", last.cy + cfg.circleRadius + 20)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("fill", "#666")
    .text(data.bridge);

  // Bottom hint
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("fill", cfg.hintColor)
    .text(data.hint);

  console.log("✓ Computational Workflow strip rendered");

  // Append to container and return node
  el.appendChild(svg.node());
  return svg.node();
}

