/*
Page-specific interactions and utilities
Complements main.js with additional page-level functionality
*/

/**
 * Utility: Get current page name
 */
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

/**
 * Utility: Check if on specific page
 */
function isOnPage(pageName) {
    return getCurrentPage() === pageName;
}

/**
 * Handle "To Top" button smooth scroll
 */
function initToTopButton() {
    const toTopBtn = document.getElementById('toTop');
    if (!toTopBtn) return;

    toTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Update table of contents active state based on scroll position
 * Highlights the currently visible section in the TOC sidebar
 */
function updateTOCActiveState() {
    const toc = document.querySelector('.toc');
    if (!toc) return;

    const sections = document.querySelectorAll('main .block[id]');
    const tocLinks = toc.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < 150) {
                currentSection = section.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Initialize page-specific features
 */
document.addEventListener('DOMContentLoaded', () => {
    initToTopButton();
    updateTOCActiveState();
    initVisualizations();
    initExpandableSections();
});

/**
 * Example: Add data visualization hooks
 * Usage: <div class="visualization" data-chart="chart-id"></div>
 */
function initVisualizations() {
    const visualizations = document.querySelectorAll('[data-chart]');
    
    visualizations.forEach(viz => {
        const chartId = viz.getAttribute('data-chart');
        // Chart initialization code would go here
        // e.g., D3.js, Plotly.js, or custom rendering
    });
}

/**
 * Example: Handle expandable sections
 * Usage: <div class="expandable" data-expanded="false">
 */
function initExpandableSections() {
    const expandables = document.querySelectorAll('.expandable');
    
    expandables.forEach(section => {
        const header = section.querySelector('h3, h4, h2');
        
        if (header) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                section.classList.toggle('expanded');
            });
        }
    });
}

// Export functions for use elsewhere
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentPage,
        isOnPage,
        initVisualizations,
        initExpandableSections
    };
}
