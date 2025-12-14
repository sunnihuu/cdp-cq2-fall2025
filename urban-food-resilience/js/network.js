// D3.js Force-Directed Network for Five Navigation Nodes

// Data structure for the five pages
const data = {
  nodes: [
    { id: "project", group: 1, label: "Project", url: "project.html" },
    { id: "computation", group: 2, label: "Computation", url: "computation.html" },
    { id: "design", group: 3, label: "Design", url: "design.html" },
    { id: "precedents", group: 4, label: "Precedents", url: "precedents.html" },
    { id: "proof", group: 5, label: "Proof", url: "proof.html" }
  ],
  links: [
    { source: "project", target: "computation", value: 1 },
    { source: "computation", target: "design", value: 1 },
    { source: "design", target: "precedents", value: 1 },
    { source: "precedents", target: "proof", value: 1 },
    { source: "proof", target: "project", value: 1 }
  ]
};

function createNetwork() {
  const container = document.getElementById('network-container');
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  // Color scale - black and white theme
  const color = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5])
    .range(['#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080']);

  // Create copies of data
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));

  // Create force simulation with stronger forces
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-800))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(40).strength(0.9))
    .alphaDecay(0.02)
    .velocityDecay(0.3)
    .on("tick", ticked);

  // Create SVG
  const svg = d3.select("#network-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add links
  const link = svg.append("g")
    .attr("stroke", "#000000")
    .attr("stroke-opacity", 0.4)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 2);

  // Add node groups (circles + text)
  const nodeGroup = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("click", (event, d) => {
      window.location.href = d.url;
    })
    .style("cursor", "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"8\" fill=\"%237cb342\" opacity=\"0.6\"/></svg>') 16 16, pointer");

  // Add circles to nodes
  const node = nodeGroup.append("circle")
    .attr("r", 28)
    .attr("fill", d => color(d.group))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 3);

  // Add labels to nodes
  const label = nodeGroup.append("text")
    .text(d => d.label)
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("font-size", "11px")
    .attr("font-weight", "600")
    .attr("fill", "#ffffff")
    .attr("pointer-events", "none")
    .style("user-select", "none");

  // Add hover effects with bigger size
  nodeGroup
    .on("mouseenter", function(event, d) {
      d3.select(this).select("circle")
        .transition()
        .duration(300)
        .ease(d3.easeElastic)
        .attr("r", 45);
      
      d3.select(this).select("text")
        .transition()
        .duration(300)
        .attr("font-size", "14px");
    })
    .on("mouseleave", function(event, d) {
      d3.select(this).select("circle")
        .transition()
        .duration(300)
        .ease(d3.easeElastic)
        .attr("r", 28);
      
      d3.select(this).select("text")
        .transition()
        .duration(300)
        .attr("font-size", "11px");
    });

  // Update positions on tick
  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeGroup
      .attr("transform", d => `translate(${d.x},${d.y})`);
  }

  // Idle animation - pulse effect
  let isDragging = false;
  
  function startIdleAnimation() {
    if (!isDragging) {
      nodeGroup.selectAll("circle")
        .transition()
        .duration(2000)
        .ease(d3.easeSinInOut)
        .attr("r", function() { return 28 + Math.random() * 8; })
        .transition()
        .duration(2000)
        .ease(d3.easeSinInOut)
        .attr("r", 28)
        .on("end", function() {
          if (!isDragging) startIdleAnimation();
        });
      
      // Gentle random movement
      simulation.alphaTarget(0.05).restart();
      setTimeout(() => {
        if (!isDragging) simulation.alphaTarget(0);
      }, 1000);
    }
  }
  
  // Start idle animation after initial settlement
  setTimeout(startIdleAnimation, 3000);

  // Drag functions with stronger force feedback
  function dragstarted(event) {
    isDragging = true;
    if (!event.active) simulation.alphaTarget(0.5).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
    
    // Make dragged node bigger
    d3.select(event.sourceEvent.target.parentNode).select("circle")
      .transition()
      .duration(200)
      .attr("r", 50);
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    isDragging = false;
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
    
    // Return node to normal size
    d3.select(event.sourceEvent.target.parentNode).select("circle")
      .transition()
      .duration(300)
      .ease(d3.easeElastic)
      .attr("r", 28);
    
    // Restart idle animation
    setTimeout(startIdleAnimation, 2000);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    svg.attr("width", newWidth).attr("height", newHeight);
    svg.attr("viewBox", [0, 0, newWidth, newHeight]);
    simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
    simulation.alpha(0.3).restart();
  });
}

// Initialize network when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createNetwork);
} else {
  createNetwork();
}
