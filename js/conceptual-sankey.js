// Conceptual Framework Sankey: Food as Climate Infrastructure
// Based on D3 Sankey pattern with academic framework focus
(function () {
  if (typeof d3 === "undefined") {
    console.error("D3 not loaded");
    return;
  }

  const container = document.getElementById('conceptual-framework-diagram');
  if (!container) {
    console.error("Container 'conceptual-framework-diagram' not found");
    return;
  }

  console.log("Initializing Sankey diagram...");

  // ===== CONFIGURATION =====
  const width = Math.min(1000, window.innerWidth * 0.92);
  const height = 500;

  const CFG = {
    // Dimensions
    width: width,
    height: height,
    nodeWidth: 15,
    nodePadding: 60,
    // Color palette: minimal, academic
    nodeColor: '#e8e8e8',
    linkColor: '#999',
    linkOpacity: 0.25,
    interventionColor: '#7cb342',  // Website accent
    interventionHighlight: '#f5f9f2',
    backgroundColor: '#fafaf9',
    textColor: '#1a1a1a',
    fontFamily: '"Lexend Deca", sans-serif'
  };

  // ===== DATA: CONCEPTUAL FRAMEWORK =====
  const data = {
    nodes: [
      // Column 0: Drivers
      { name: "Carbon", category: "driver" },
      { name: "Infrastructure", category: "driver" },
      { name: "Inequality", category: "driver" },
      { name: "Risk", category: "driver" },
      // Column 1: Global Systems
      { name: "Global food–climate systems", category: "system" },
      // Column 2: Urban Translation
      { name: "Urban food infrastructure & policy (NYC)", category: "translation" },
      // Column 3: Neighborhood Vulnerability
      { name: "Neighborhood vulnerability", category: "vulnerability" },
      // Column 4: Behavioral Interface (INTERVENTION)
      { name: "Behavioral interface", category: "intervention" },
      // Column 5: Outcome
      { name: "Everyday eating behavior", category: "outcome" }
    ],
    links: [
      // Drivers → Global Systems
      { source: "Carbon", target: "Global food–climate systems", value: 1 },
      { source: "Infrastructure", target: "Global food–climate systems", value: 1 },
      { source: "Inequality", target: "Global food–climate systems", value: 1 },
      { source: "Risk", target: "Global food–climate systems", value: 1 },
      // Global Systems → Urban Translation
      { source: "Global food–climate systems", target: "Urban food infrastructure & policy (NYC)", value: 1 },
      // Urban Translation → Neighborhood Vulnerability
      { source: "Urban food infrastructure & policy (NYC)", target: "Neighborhood vulnerability", value: 1 },
      // Neighborhood Vulnerability → Behavioral Interface
      { source: "Neighborhood vulnerability", target: "Behavioral interface", value: 1 },
      // Behavioral Interface → Outcome
      { source: "Behavioral interface", target: "Everyday eating behavior", value: 1 }
    ]
  };

  // ===== INITIALIZE SANKEY =====
  if (typeof d3.sankey !== "function") {
    console.error("d3.sankey not available - d3-sankey module may not be loaded");
    // Fallback: try to load d3-sankey dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/d3-sankey@0.12";
    script.onload = function () {
      console.log("d3-sankey loaded dynamically");
      location.reload();
    };
    document.head.appendChild(script);
    return;
  }

  const sankey = d3
    .sankey()
    .nodeId(d => d.name)
    .nodeAlign(d3.sankeyLeft)
    .nodeWidth(CFG.nodeWidth)
    .nodePadding(CFG.nodePadding)
    .extent([[0, 0], [width, height]]);

  console.log("Sankey initialized");

  // Apply Sankey layout
  const { nodes, links } = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  console.log("Nodes:", nodes.length, "Links:", links.length);

  // ===== CREATE SVG =====
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("font-family", CFG.fontFamily)
    .style("user-select", "none");

  // Background
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", CFG.backgroundColor);

  // ===== RENDER LINKS =====
  const linkGroup = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", CFG.linkOpacity);

  const linkPaths = linkGroup
    .selectAll(".link")
    .data(links)
    .join("path")
    .attr("class", "link")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", CFG.linkColor)
    .attr("stroke-width", d => Math.max(1, d.width));

  // Add title to links (optional tooltip)
  linkPaths
    .append("title")
    .text(d => `${d.source.name} → ${d.target.name}`);

  // ===== RENDER NODES =====
  const nodeGroup = svg
    .append("g");

  const nodeRects = nodeGroup
    .selectAll(".node")
    .data(nodes)
    .join("rect")
    .attr("class", "node")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", (d) =>
      d.category === "intervention" ? CFG.interventionHighlight : CFG.nodeColor
    )
    .attr("stroke", (d) =>
      d.category === "intervention" ? CFG.interventionColor : CFG.linkColor
    )
    .attr("stroke-width", (d) => (d.category === "intervention" ? 2.2 : 1.2))
    .attr("cursor", "pointer");

  // Add titles to nodes
  nodeRects
    .append("title")
    .text(d => d.name);

  // ===== RENDER LABELS =====
  const labelGroup = svg
    .append("g")
    .style("font-size", "12px")
    .style("font-weight", 500);

  labelGroup
    .selectAll(".node-label")
    .data(nodes)
    .join("text")
    .attr("class", "node-label")
    .attr("x", d => (d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8))
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => (d.x0 < width / 2 ? "start" : "end"))
    .attr("fill", CFG.textColor)
    .text(d => d.name);

  // ===== HOVER INTERACTIONS =====
  nodeRects
    .on("mouseenter", function (event, d) {
      // Dim all links
      linkPaths.attr("stroke-opacity", CFG.linkOpacity * 0.2);

      // Highlight connected links
      linkPaths.attr("stroke-opacity", (link) => {
        if (link.source === d || link.target === d) {
          return CFG.linkOpacity * 1.2;
        }
        return CFG.linkOpacity * 0.2;
      });

      // Dim unrelated nodes
      nodeRects.attr("opacity", (node) => {
        if (node === d) return 1;
        // Check if connected (incoming or outgoing)
        const connected =
          links.some(l => l.source === d && l.target === node) ||
          links.some(l => l.source === node && l.target === d);
        return connected ? 1 : 0.3;
      });

      labelGroup
        .selectAll(".node-label")
        .attr("opacity", (node) => {
          if (node === d) return 1;
          const connected =
            links.some(l => l.source === d && l.target === node) ||
            links.some(l => l.source === node && l.target === d);
          return connected ? 1 : 0.3;
        });
    })
    .on("mouseleave", function () {
      // Restore default opacities
      linkPaths.attr("stroke-opacity", CFG.linkOpacity);
      nodeRects.attr("opacity", 1);
      labelGroup.selectAll(".node-label").attr("opacity", 1);
    });

  console.log("Sankey diagram rendered successfully");
})();
