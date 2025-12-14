// Simple interactive scope & scale graph for Project Overview
(function(){
  const container = document.getElementById('scope-graph');
  const detail = document.getElementById('graph-detail');
  if (!container) return;

  const copy = {
    global: 'Explore global food–climate interactions: emissions, supply chains, and diet scenarios at planetary scale.',
    nyc: 'Zoom to New York City: municipal inventories, procurement policies, and regional supply relationships.',
    neighborhood: 'Focus on neighborhood-level vulnerability: consumption density, storage capacity, poverty, and access.',
    behavior: 'Translate to everyday eating behavior: low-carbon choices, waste triage, and resilience habits.'
  };

  function setActive(id){
    container.querySelectorAll('.graph-node').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === id);
    });
    detail.textContent = copy[id] || '';
  }

  // Initialize
  setActive('global');

  // Event listeners
  container.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList.contains('graph-node')) {
      setActive(target.dataset.id);
    }
  });
})();
