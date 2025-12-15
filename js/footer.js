// Unified footer component for all pages
export function initFooter() {
  // Check if footer already exists
  if (document.querySelector('.unified-footer')) return;

  // Create footer container
  const footer = document.createElement('footer');
  footer.className = 'unified-footer';
  footer.innerHTML = `
    <div class="footer-left">Sunni Hu</div>
    <div class="footer-right">Columbia University GSAPP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Computational Design Practice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Colloquium 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall 2025</div>
  `;
  
  document.body.appendChild(footer);
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooter);
} else {
  initFooter();
}
