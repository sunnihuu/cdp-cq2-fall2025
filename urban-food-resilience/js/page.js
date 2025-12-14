/*
Page-specific interactions and utilities
Complements main.js with additional page-level functionality
*/

/**
 * Initialize page-specific features
 */
document.addEventListener('DOMContentLoaded', () => {
    // Page-specific initialization can be added here
    // Examples: chart rendering, map loading, tab management
});

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
