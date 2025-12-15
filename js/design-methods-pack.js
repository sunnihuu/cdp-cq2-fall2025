// Design Methods Circle Packing Diagram - Academic Thesis Version
// Optimized for visual hierarchy, label clarity, and zoom interaction

const designMethodsData = {
  name: "Design Methods",
  value: 100,
  children: [
    {
      name: "Analytical",
      value: 25,
      children: [
        {
          name: "Spatial reasoning",
          value: 8,
          children: [
            { name: "Threshold reading", value: 4 },
            { name: "Comparative overlays", value: 4 }
          ]
        },
        {
          name: "Index-as-argument",
          value: 9,
          children: [
            { name: "Synthesis narrative", value: 9 }
          ]
        }
      ]
    },
    {
      name: "Behavioral",
      value: 25,
      children: [
        {
          name: "Decision conditions",
          value: 8,
          children: [
            { name: "Constraints framing", value: 4 },
            { name: "Substitution pathways", value: 4 }
          ]
        },
        {
          name: "Feedback design",
          value: 9,
          children: [
            { name: "Cues + friction", value: 9 }
          ]
        }
      ]
    },
    {
      name: "Interface-driven",
      value: 25,
      children: [
        {
          name: "Translation layer",
          value: 8,
          children: [
            { name: "Legibility patterns", value: 4 },
            { name: "Actionability heuristics", value: 4 }
          ]
        },
        {
          name: "Interaction grammar",
          value: 9,
          children: [
            { name: "Hover highlight", value: 4 },
            { name: "Scenario toggles", value: 5 }
          ]
        }
      ]
    },
    {
      name: "Community-scale",
      value: 15,
      children: [
        {
          name: "Neighborhood scenarios",
          value: 7,
          children: [
            { name: "Localized interventions", value: 7 }
          ]
        },
        {
          name: "Institutional pathways",
          value: 8,
          children: [
            { name: "Procurement levers", value: 8 }
          ]
        }
      ]
    },
    {
      name: "Speculative",
      value: 10,
      children: [
        {
          name: "Futures",
          value: 10,
          children: [
            { name: "Risk & agency", value: 10 }
          ]
        }
      ]
    }
  ]
};

function renderDesignMethodsPack(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found:", containerId);
    return;
  }

  // Configuration
  const width = container.clientWidth || 900;
  const height = container.clientHeight || 900;
  const margin = 40;
  
  const colors = {
    background: "#fafaf9",
    defaultFill: "#f5f5f5",
    defaultStroke: "#d8d8d8",
    accentFill: "#f2f7eb",
    accentStroke: "#a8c48a",
    text: "#444",
    textMuted: "#bbb",
    hover: "#e8e8e8"
  };

  const labelThreshold = 20; // Minimum radius to show label
  
  // Helper: Determine if label should be visible (thesis safe - tight rules)
  function labelVisible(d, focus) {
    // Show top-level categories when at root view
    if (d.depth === 1 && focus === root) return true;
    // Show direct children when zoomed into a category
    if (d.parent === focus && d.r > 20) return true;
    // Show the focus node itself (if not root)
    if (d === focus && d.depth > 0) return true;
    return false;
  }

  // Helper: Get circle opacity based on focus relationship
  function getCircleOpacity(node, focusNode, state = 'default') {
    if (state === 'hover-lineage') {
      return { fill: 0.12, stroke: 0.35 };
    }
    if (state === 'hover-non-lineage') {
      return { fill: 0.05, stroke: 0.15 };
    }
    // Default state - check if node is focus or lineage
    const isFocus = node === focusNode;
    const isLineage = node.parent === focusNode || focusNode.parent === node || node.ancestors().includes(focusNode);
    
    if (isFocus) {
      return { fill: 0.18, stroke: 0.6 };
    }
    if (isLineage) {
      return { fill: 0.12, stroke: 0.35 };
    }
    return { fill: 0.05, stroke: 0.15 };
  }

  // Helper: Get label styling based on depth
  function getLabelStyle(depth, isZoomed = false) {
    if (depth === 1) {
      return {
        fontSize: isZoomed ? "16px" : "14px",
        fontWeight: 600,
        color: "#222"
      };
    }
    return {
      fontSize: isZoomed ? "12px" : "11px",
      fontWeight: 400,
      color: "#444"
    };
  }

  // Helper: Get node color based on focus state
  function getNodeColor(node, focusNode, hoverLineage = null) {
    // Show green accent only when Behavioral is focused or in hover lineage
    const isBehavioral = node.data.name === "Behavioral" || node.data.short === "Behavioral";
    const shouldShowAccent = isBehavioral && (
      node === focusNode || 
      (hoverLineage && hoverLineage.includes(node))
    );
    
    if (shouldShowAccent) {
      return { fill: colors.accentFill, stroke: colors.accentStroke };
    }
    return { fill: colors.defaultFill, stroke: colors.defaultStroke };
  }

  // Helper: Wrap text into multiple lines
  function wrapText(selection, maxWidth, maxLines = 2) {
    selection.each(function(d) {
      const text = d3.select(this);
      const displayText = d.data.short ?? d.data.name;
      const words = displayText.split(/\s+/).filter(Boolean);
      
      text.text(null);
      
      if (words.length === 0) return;
      
      let line = [];
      let lineNumber = 0;
      let tspan = text.append("tspan")
        .attr("x", 0)
        .attr("dy", 0);

      for (const word of words) {
        line.push(word);
        tspan.text(line.join(" "));
        
        if (tspan.node().getComputedTextLength() > maxWidth && line.length > 1) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          lineNumber += 1;
          
          if (lineNumber >= maxLines - 1) {
            tspan.text(tspan.text() + "…");
            break;
          }
          
          tspan = text.append("tspan")
            .attr("x", 0)
            .attr("dy", "1.2em")
            .text(word);
        }
      }

      // Center text vertically
      const tspans = text.selectAll("tspan");
      const lineCount = tspans.size();
      
      if (lineCount > 1) {
        tspans.attr("dy", (_, i) => i === 0 ? `-${(lineCount - 1) * 0.5}em` : "1.2em");
      } else {
        tspans.attr("dy", "0.35em");
      }
    });
  }

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("background", colors.background)
    .style("font-family", '"Lexend Deca", sans-serif');

  // Hierarchy
  const hierarchy = d3
    .hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  // Pack layout
  const pack = d3.pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);

  const root = pack(hierarchy);

  // State management
  let focus = root;
  let view = [root.x, root.y, root.r * 2 + margin];

  // Background for zoom out
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", colors.background)
    .attr("opacity", 0)
    .attr("pointer-events", "all")
    .on("click", (event) => {
      event.stopPropagation();
      if (focus !== root) {
        zoom(root);
      }
    });

  // Groups
  const containerGroup = svg
    .append("g")
    .attr("transform", `translate(${margin},${margin})`);

  // Create node groups (circle + label together)
  const nodes = containerGroup
    .selectAll("g.node")
    .data(root.descendants().filter(d => d.parent))
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  // Render circles
  const circles = nodes
    .append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => getNodeColor(d, focus).fill)
    .attr("stroke", d => getNodeColor(d, focus).stroke)
    .attr("stroke-width", d => d.depth === 1 ? 2.5 : 1.2)
    .attr("fill-opacity", d => {
      const opacity = getCircleOpacity(d, focus);
      return opacity.fill;
    })
    .attr("stroke-opacity", d => {
      const opacity = getCircleOpacity(d, focus);
      return opacity.stroke;
    })
    .attr("cursor", d => d.children && d.children.length > 0 ? "pointer" : "default")
    .attr("class", "design-method-circle");

  // Add tooltips
  nodes
    .append("title")
    .text(d => d.ancestors().map(a => a.data.name).reverse().join(" → "));

  // Render labels (in the same group as circles)
  const labels = nodes
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", d => d.depth === 1 ? "14px" : "11px")
    .attr("font-weight", d => d.depth === 1 ? 600 : 400)
    .attr("fill", d => d.depth === 1 ? "#222" : "#444")
    .attr("opacity", d => labelVisible(d, focus) ? 1 : 0)
    .attr("pointer-events", "none")
    .call(sel => {
      sel.each(function(d) {
        const maxWidth = Math.max(35, d.r * 1.5);
        wrapText(d3.select(this), maxWidth, 2);
      });
    });

  // Node interactions
  nodes
    .on("click", (event, d) => {
      event.stopPropagation();
      if (d.children && d.children.length > 0) {
        zoom(d);
      }
    })
    .on("mouseenter", (event, d) => {
      const lineage = d.ancestors();
      
      // Highlight lineage circles and show accent color
      circles.each(function(n) {
        const isLineage = lineage.includes(n);
        const opacity = getCircleOpacity(n, focus, isLineage ? 'hover-lineage' : 'hover-non-lineage');
        const color = getNodeColor(n, focus, lineage);
        d3.select(this)
          .attr("fill", color.fill)
          .attr("stroke", color.stroke)
          .attr("fill-opacity", opacity.fill)
          .attr("stroke-opacity", opacity.stroke);
      });

      // Highlight lineage labels
      labels.each(function(n) {
        const isLineage = lineage.includes(n);
        d3.select(this)
          .attr("font-weight", isLineage ? (n.depth === 1 ? 600 : 500) : (n.depth === 1 ? 600 : 400));
      });
    })
    .on("mouseleave", () => {
      circles.each(function(n) {
        const opacity = getCircleOpacity(n, focus);
        const color = getNodeColor(n, focus);
        d3.select(this)
          .attr("fill", color.fill)
          .attr("stroke", color.stroke)
          .attr("fill-opacity", opacity.fill)
          .attr("stroke-opacity", opacity.stroke);
      });

      labels.each(function(n) {
        d3.select(this)
          .attr("opacity", labelVisible(n, focus) ? 1 : 0)
          .attr("font-weight", n.depth === 1 ? 600 : 400);
      });
    });

  // Zoom function - smooth transition
  function zoomTo(v) {
    const k = (width - margin * 2) / v[2];

    // Transform node groups (circles and labels move together)
    nodes
      .transition()
      .duration(600)
      .ease(d3.easeCubicInOut)
      .attr("transform", d => {
        const x = (d.x - v[0]) * k;
        const y = (d.y - v[1]) * k;
        return `translate(${x},${y}) scale(${1})`;
      });

    // Update label font sizes and visibility during zoom
    labels
      .transition()
      .duration(600)
      .ease(d3.easeCubicInOut)
      .attr("font-size", d => {
        const displayRadius = d.r * k;
        if (d.depth === 1) {
          return displayRadius > labelThreshold * 1.5 ? "16px" : "14px";
        }
        return displayRadius > labelThreshold * 1.5 ? "12px" : "11px";
      })
      .attr("opacity", d => {
        const displayRadius = d.r * k;
        const visible = labelVisible(d, focus);
        return visible && displayRadius > labelThreshold ? 1 : 0;
      })
      .on("end", function(d) {
        // Re-wrap text after zoom with new sizes
        const displayRadius = d.r * k;
        if (displayRadius > labelThreshold && labelVisible(d, focus)) {
          const maxWidth = Math.max(30, displayRadius * 1.4);
          wrapText(d3.select(this), maxWidth, 2);
        }
      });

    // Update styles after transition
    setTimeout(() => {
      labels.each(function(n) {
        d3.select(this)
          .attr("opacity", labelVisible(n, focus) ? 1 : 0)
          .attr("font-weight", n.depth === 1 ? 600 : 400);
      });

      circles.each(function(n) {
        const opacity = getCircleOpacity(n, focus);
        const color = getNodeColor(n, focus);
        d3.select(this)
          .attr("fill", color.fill)
          .attr("stroke", color.stroke)
          .attr("fill-opacity", opacity.fill)
          .attr("stroke-opacity", opacity.stroke);
      });
    }, 650);
  }

  function zoom(d) {
    focus = d;
    view = [d.x, d.y, d.r * 2 + margin];
    zoomTo(view);
  }

  // Add title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", 16)
    .attr("font-weight", 600)
    .attr("fill", colors.text)
    .text("Design Methods");

  // Add interaction hint
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 8)
    .attr("text-anchor", "middle")
    .attr("font-size", 9)
    .attr("fill", colors.textMuted)
    .text("Click circles to zoom | Click background to zoom out");

  console.log("✓ Design Methods circle packing diagram (optimized) rendered");
}

// Auto-initialize with D3 ready check
function initializeWhenReady() {
  if (typeof d3 === "undefined") {
    console.warn("D3 not loaded yet, retrying...");
    setTimeout(initializeWhenReady, 100);
    return;
  }

  const container = document.getElementById("design-methods-pack");
  if (!container) {
    console.error("Container not found");
    return;
  }

  // Give the container time to render
  setTimeout(() => {
    renderDesignMethodsPack("design-methods-pack", designMethodsData);
  }, 100);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWhenReady);
} else {
  initializeWhenReady();
}
