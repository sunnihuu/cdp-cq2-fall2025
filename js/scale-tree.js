// Collapsible D3 tree for Scale overlay
(function(){
  const toggleBtn = document.getElementById('toggle-scale');
  const overlay = document.getElementById('scale-overlay');
  const canvas = document.getElementById('scale-canvas');
  let svg = null;
  let tree, root, gLink, gNode;

  // Configuration
  const CFG = {
    width: Math.min(800, window.innerWidth * 0.85),
    height: 480,
    dx: 26,
    dy: 240,
    leftPad: 140,
    transitionDuration: 350,
    labelPadX: 10,
    labelPadY: 8,
    circleRadius: 6
  };

  const rootData = {
    name: "Scale & Translation:\nFrom Systems → Behavior",
    children: [
      {
        name: "Global food–climate\nsystems",
        children: [
          { name: "System: agriculture +\nprocessing + trade" },
          { name: "Signals: emissions\nfactors, subsidies,\nprice signals" },
          { name: "Levers: dietary shifts,\nprocurement standards" }
        ]
      },
      {
        name: "New York City",
        children: [
          { name: "System: distribution\ninfrastructure +\nregulation" },
          { name: "Signals: retail density,\nsupply-chain fragility" },
          { name: "Levers: policy,\nprocurement,\ninstitutional programs" }
        ]
      },
      {
        name: "Neighborhood-level\nvulnerability",
        children: [
          { name: "System: access +\naffordability +\nstorage capacity" },
          { name: "Signals: poverty,\nlow-storage proxies,\nfood availability" },
          { name: "Levers: targeted\ninterventions,\ncommunity networks" }
        ]
      },
      {
        name: "Behavioral\ninterface",
        children: [
          { name: "Function: translate\ndata → choices" },
          { name: "Mechanism: feedback,\nsubstitution pathways" },
          { name: "Outputs: actionable\nsuggestions + visibility" }
        ]
      },
      {
        name: "Everyday eating\nbehavior",
        children: [
          { name: "Unit: meals,\npurchases, routines" },
          { name: "Constraints: time,\nbudget, habit, access" },
          { name: "Impact: aggregated\ndemand → system\nchange" }
        ]
      }
    ]
  };

  function initChart() {
    if (typeof d3 === 'undefined') {
      console.error('D3 failed to load.');
      return;
    }

    tree = d3.tree().nodeSize([CFG.dx, CFG.dy]).separation(() => 1.5);
    root = d3.hierarchy(rootData);
    root.x0 = 0;
    root.y0 = 0;

    // Expand all nodes by default
    root.eachBefore(d => {
      if (d.children) {
        d._children = d.children;
        d.children = d._children;
      }
    });

    svg = d3.create('svg')
      .attr('width', CFG.width)
      .attr('height', CFG.height)
      .attr('viewBox', [0, 0, CFG.width, CFG.height])
      .attr('style', 'max-width: 100%; height: auto; font: 13px system-ui, sans-serif;');

    gLink = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#b0b0b0')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5);

    gNode = svg.append('g')
      .attr('cursor', 'pointer');

    canvas.innerHTML = '';
    canvas.appendChild(svg.node());

    update(root);
  }

  function update(source) {
    tree(root);

    // Compute bounds
    let left = root, right = root;
    root.eachBefore(d => {
      if (d.x < left.x) left = d;
      if (d.x > right.x) right = d;
    });

    const height = Math.max(CFG.height, right.x - left.x + CFG.dx * 8);
    svg.attr('height', height)
      .attr('viewBox', [0, left.x - CFG.dx * 2, CFG.width, height]);

    const transition = svg.transition().duration(CFG.transitionDuration).ease(d3.easeCubicInOut);

    // Update links
    const links = root.links();
    const link = gLink.selectAll('path').data(links, d => `${d.source.data.name}→${d.target.data.name}`);

    link.enter().append('path')
      .attr('d', d3.linkHorizontal().x(d => source.y0 + CFG.leftPad).y(d => source.x0))
      .merge(link)
      .transition(transition)
      .attr('d', d3.linkHorizontal()
        .x(d => d.y + CFG.leftPad)
        .y(d => d.x));

    link.exit().transition(transition).remove();

    // Update nodes
    const nodes = root.descendants();
    const node = gNode.selectAll('g').data(nodes, d => `${d.depth}:${d.data.name}`);

    const nodeEnter = node.enter().append('g')
      .attr('transform', d => `translate(${source.y0 + CFG.leftPad},${source.x0})`);

    // Circle
    nodeEnter.append('circle')
      .attr('r', CFG.circleRadius)
      .attr('fill', d => d._children && d.children ? '#7cb342' : '#fff')
      .attr('stroke', '#7cb342')
      .attr('stroke-width', 1.5);

    // Label group with background and text
    const labelGroup = nodeEnter.append('g').attr('class', 'label-group');

    const bg = labelGroup.append('rect')
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', '#f9f9f9')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 0.5);

    const text = labelGroup.append('text')
      .attr('dy', '0.32em')
      .attr('text-anchor', 'end')
      .attr('fill', '#222')
      .attr('font-size', '12px')
      .attr('font-weight', d => d.depth === 0 ? '600' : '400');

    // Render/update multi-line labels for both new and existing nodes
    node.merge(nodeEnter).each(function(d) {
      const txtSel = d3.select(this).select('text');
      const lines = String(d.data.name).split('\n');

      txtSel.selectAll('tspan').remove();
      lines.forEach((line, idx) => {
        txtSel.append('tspan')
          .attr('x', -12)
          .attr('dy', idx === 0 ? 0 : 14)
          .text(line);
      });

      // Compute and size background immediately
      const bbox = txtSel.node().getBBox();
      const bgSel = d3.select(this).select('rect');
      bgSel.attr('x', bbox.x - CFG.labelPadX)
        .attr('y', bbox.y - CFG.labelPadY)
        .attr('width', bbox.width + CFG.labelPadX * 2)
        .attr('height', bbox.height + CFG.labelPadY * 2);
    });

    // Merge and transition
    node.merge(nodeEnter)
      .on('click', (event, d) => {
        d.children = d.children ? null : d._children;
        update(d);
      })
      .transition(transition)
      .attr('transform', d => `translate(${d.y + CFG.leftPad},${d.x})`);

    node.exit().transition(transition).remove();

    // Store positions for next transition
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = overlay.style.display !== 'none';
      if (isOpen) {
        overlay.style.display = 'none';
        toggleBtn.textContent = 'Scale';
      } else {
        overlay.style.display = 'flex';
        toggleBtn.textContent = 'Close';
        if (!svg) {
          initChart();
        }
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
        toggleBtn.textContent = 'Scale';
      }
    });
  }
})();
