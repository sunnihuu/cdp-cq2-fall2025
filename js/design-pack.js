export function renderDesignPack(containerId, data){
  const container = document.getElementById(containerId);
  if(!container) return;

  container.innerHTML = "";

  const width = container.clientWidth || 900;
  const height = Math.max(420, container.clientHeight || 520);
  const margin = 2;

  const colors = {
    bg: "#fafaf9",
    fill: "#f5f5f5",
    stroke: "#d8d8d8",
    accentFill: "#f2f7eb",
    accentStroke: "#a8c48a",
    text: "#222",
    text2: "#444",
    muted: "#666"
  };

  // tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "chart-tooltip";
  tooltip.style.display = "none";
  container.appendChild(tooltip);

  function showTip(evt, d){
    const rect = container.getBoundingClientRect();
    const px = evt.clientX - rect.left;
    const py = evt.clientY - rect.top;
    const path = d.ancestors().map(a=>a.data.name).reverse().join(" → ");
    tooltip.innerHTML = `<div><strong>${d.data.name}</strong></div><div class="aff">${path}</div>`;
    tooltip.style.display = "block";
    const tw = tooltip.offsetWidth || 240;
    const th = tooltip.offsetHeight || 80;
    tooltip.style.left = `${Math.min(Math.max(10, px + 12), width - tw - 10)}px`;
    tooltip.style.top  = `${Math.min(Math.max(10, py - th - 12), height - th - 10)}px`;
  }

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-margin, -margin, width, height])
    .style("max-width", "100%")
    .style("height", "auto")
    .style("font-family", "Lexend Deca, system-ui, sans-serif");

  // background for zoom-out
  svg.append("rect")
    .attr("x",0).attr("y",0).attr("width",width).attr("height",height)
    .attr("fill", colors.bg)
    .attr("opacity", 1)
    .attr("pointer-events","all");

  const root = d3.hierarchy(data)
    .sum(d => d.value ?? 1)
    .sort((a,b)=> (b.value??0) - (a.value??0));

  const pack = d3.pack()
    .size([width - margin*2, height - margin*2])
    .padding(4);

  pack(root);

  let focus = root;
  let view;

  const g = svg.append("g").attr("transform", `translate(${margin},${margin})`);

  const nodes = g.selectAll("g.node")
    .data(root.descendants().filter(d => d.depth > 0))
    .join("g")
      .attr("class","node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", d => d.children ? "pointer" : "default");

  const circles = nodes.append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => (d.depth===1 && d.data.name==="Behavioral") ? colors.accentFill : colors.fill)
    .attr("stroke", d => (d.depth===1 && d.data.name==="Behavioral") ? colors.accentStroke : colors.stroke)
    .attr("stroke-width", d => d.depth===1 ? 2.2 : 1.1)
    .attr("fill-opacity", d => d.depth===1 ? 0.14 : 0.06)
    .attr("stroke-opacity", d => d.depth===1 ? 0.35 : 0.15);

  // label gating
  function labelVisible(d){
    if(d.depth===1 && focus===root) return true;
    if(d===focus && d.depth>0) return true;
    if(d.parent===focus && d.r > 18) return true;
    return false;
  }

  function wrapText(textSel, maxWidth, maxLines=2){
    textSel.each(function(d){
      const text = d3.select(this);
      const words = String(d.data.name).split(/\s+/).filter(Boolean);
      text.text(null);

      let line = [];
      let lineNumber = 0;
      let tspan = text.append("tspan").attr("x",0).attr("dy","0.35em");

      for(const w of words){
        line.push(w);
        tspan.text(line.join(" "));
        if(tspan.node().getComputedTextLength() > maxWidth && line.length>1){
          line.pop();
          tspan.text(line.join(" "));
          line = [w];
          lineNumber += 1;
          if(lineNumber >= maxLines){
            tspan.text(tspan.text().replace(/\s+\S+$/,"…"));
            break;
          }
          tspan = text.append("tspan").attr("x",0).attr("dy","1.15em").text(w);
        }
      }
    });
  }

  const labels = nodes.append("text")
    .attr("text-anchor","middle")
    .attr("fill", d => d.depth===1 ? colors.text : colors.text2)
    .attr("font-weight", d => d.depth===1 ? 650 : 420)
    .attr("font-size", d => d.depth===1 ? 14 : 11)
    .attr("pointer-events","none")
    .style("display", d => labelVisible(d) ? "block" : "none")
    .attr("opacity", d => labelVisible(d) ? 1 : 0)
    .each(function(d){
      const maxW = Math.max(42, d.r * 1.3);
      wrapText(d3.select(this), maxW, 2);
    });

  // hover lineage highlight
  nodes
    .on("mouseenter", (evt,d)=>{
      const lineage = d.ancestors();
      circles
        .attr("fill-opacity", n => lineage.includes(n) ? 0.14 : 0.05)
        .attr("stroke-opacity", n => lineage.includes(n) ? 0.40 : 0.12);

      showTip(evt, d);
    })
    .on("mousemove", (evt,d)=> showTip(evt,d))
    .on("mouseleave", ()=>{
      tooltip.style.display = "none";
      circles
        .attr("fill-opacity", n => (n.depth===1 ? 0.14 : 0.06))
        .attr("stroke-opacity", n => (n.depth===1 ? 0.35 : 0.15));
    });

  svg.on("click", ()=>{
    if(focus !== root) zoom(root);
  });

  nodes.on("click", (evt,d)=>{
    evt.stopPropagation();
    if(d.children) zoom(d);
  });

  function zoomTo(v){
    const k = (width - margin*2) / v[2];
    view = v;

    nodes.attr("transform", d => `translate(${(d.x - v[0])*k},${(d.y - v[1])*k})`);
    circles.attr("r", d => d.r * k);

    labels
      .style("display", d => (labelVisible(d) && d.r*k > 18) ? "block" : "none")
      .attr("opacity", d => (labelVisible(d) && d.r*k > 18) ? 1 : 0)
      .each(function(d){
        if(labelVisible(d) && d.r*k > 18){
          const maxW = Math.max(42, d.r*k * 1.35);
          wrapText(d3.select(this), maxW, 2);
        }
      });
  }

  function zoom(d){
    focus = d;
    const transition = svg.transition()
      .duration(650)
      .ease(d3.easeCubicInOut)
      .tween("zoom", ()=>{
        const i = d3.interpolateZoom(view || [root.x,root.y,root.r*2+margin], [focus.x,focus.y,focus.r*2+margin]);
        return t => zoomTo(i(t));
      });

    transition.on("end", ()=>{
      // optional
    });
  }

  // initial view
  zoomTo([root.x, root.y, root.r*2 + margin]);

  // caption
  svg.append("text")
    .attr("x", width/2)
    .attr("y", height - 10)
    .attr("text-anchor","middle")
    .attr("font-size", 10)
    .attr("fill", colors.muted)
    .text("Click a method to explore; click background to return.");

  container.appendChild(svg.node());
}
