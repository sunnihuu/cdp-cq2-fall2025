export function renderWorkflowStrip(containerId, workflowData){
  const container = document.getElementById(containerId);
  if(!container) return;

  container.innerHTML = "";

  const W = container.clientWidth || 900;
  const H = Math.max(220, container.clientHeight || 260);
  const margin = {top: 26, right: 24, bottom: 28, left: 24};

  const steps = workflowData.steps;
  const r = Math.min(40, Math.max(28, Math.floor((W - margin.left - margin.right) / (steps.length * 2.6))));
  const y = Math.floor(H/2);

  // tooltip (absolute in container)
  const tooltip = document.createElement("div");
  tooltip.className = "chart-tooltip";
  tooltip.style.display = "none";
  container.appendChild(tooltip);

  let pinned = null;

  const svg = d3.create("svg")
    .attr("width", W)
    .attr("height", H)
    .attr("viewBox", [0,0,W,H])
    .style("max-width","100%")
    .style("height","auto");

  // background clickable to unpin
  svg.append("rect")
    .attr("x",0).attr("y",0).attr("width",W).attr("height",H)
    .attr("fill","#fafaf9")
    .attr("opacity", 1)
    .on("click", () => {
      pinned = null;
      tooltip.style.display = "none";
    });

  const x = d3.scalePoint()
    .domain(steps.map(d=>d.id))
    .range([margin.left + r, W - margin.right - r])
    .padding(0.5);

  // links
  svg.append("g")
    .attr("fill","none")
    .attr("stroke","#d8d8d8")
    .attr("stroke-width",2)
    .attr("stroke-opacity",0.55)
    .selectAll("line")
    .data(workflowData.links)
    .join("line")
      .attr("x1", d => x(d.source))
      .attr("x2", d => x(d.target))
      .attr("y1", y)
      .attr("y2", y);

  const node = svg.append("g")
    .selectAll("g")
    .data(steps)
    .join("g")
      .attr("transform", d => `translate(${x(d.id)},${y})`)
      .style("cursor","pointer");

  // circle
  node.append("circle")
    .attr("r", r)
    .attr("fill", d => d.id === "targets" ? "#f2f7eb" : "#f5f5f5")
    .attr("stroke", d => d.id === "targets" ? "#a8c48a" : "#d8d8d8")
    .attr("stroke-width", 2)
    .attr("fill-opacity", 0.95);

  // label (short)
  node.append("text")
    .attr("text-anchor","middle")
    .attr("font-size", 13)
    .attr("font-weight", 650)
    .attr("fill","#222")
    .attr("dy","0.35em")
    .text(d => d.short);

  // sublabel
  node.append("text")
    .attr("text-anchor","middle")
    .attr("font-size", 10)
    .attr("font-weight", 400)
    .attr("fill","#666")
    .attr("dy", `${r*0.85}px`)
    .text(d => d.label);

  function showTooltip(evt, d){
    const rect = container.getBoundingClientRect();
    const px = evt.clientX - rect.left;
    const py = evt.clientY - rect.top;

    tooltip.innerHTML = `
      <div><strong>${d.label}</strong></div>
      <ul>${d.detail.map(x=>`<li>${x}</li>`).join("")}</ul>
      <div class="aff">${d.affordance}</div>
    `;
    tooltip.style.display = "block";

    const tw = tooltip.offsetWidth || 240;
    const th = tooltip.offsetHeight || 140;
    const left = Math.min(Math.max(10, px + 12), W - tw - 10);
    const top  = Math.min(Math.max(10, py - th - 12), H - th - 10);

    tooltip.style.left = `${left}px`;
    tooltip.style.top  = `${top}px`;
  }

  node
    .on("mouseenter", (evt,d) => { if(!pinned) showTooltip(evt,d); })
    .on("mousemove", (evt,d) => { if(!pinned) showTooltip(evt,d); })
    .on("mouseleave", () => { if(!pinned) tooltip.style.display="none"; })
    .on("click", (evt,d) => {
      evt.stopPropagation();
      if(pinned && pinned.id === d.id){
        pinned = null;
        tooltip.style.display = "none";
      } else {
        pinned = d;
        showTooltip(evt,d);
      }
    });

  // caption
  svg.append("text")
    .attr("x", W/2)
    .attr("y", H - 10)
    .attr("text-anchor","middle")
    .attr("font-size", 10)
    .attr("fill","#666")
    .text("Hover or click a step to view details. Click empty space to close.");

  container.appendChild(svg.node());
}
