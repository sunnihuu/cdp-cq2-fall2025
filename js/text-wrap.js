// Inserts line breaks after N words for targeted elements
(function(){
  function wrapElement(el, n){
    const text = el.textContent.trim();
    if (!text) return;
    const words = text.split(/\s+/);
    const lines = [];
    for(let i=0; i<words.length; i+=n){
      lines.push(words.slice(i, i+n).join(' '));
    }
    el.innerHTML = lines.join('<br>');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Wrap elements with explicit data attribute
    document.querySelectorAll('[data-wrap-words]').forEach(el => {
      const n = parseInt(el.getAttribute('data-wrap-words'), 10) || 4;
      wrapElement(el, n);
    });
    // Also wrap the main title link if present
    const titleLink = document.querySelector('.title a');
    if (titleLink) {
      wrapElement(titleLink, 4);
    }
  });
})();