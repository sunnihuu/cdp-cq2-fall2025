/**
 * Urban Food Resilience Atlas - Main JavaScript
 * Minimal interactions for scroll effects and navigation
 */

// ============================================
// Utilities
// ============================================

/**
 * Check if an element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * Debounce function to limit event firing
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Navigation Highlighting
// ============================================

/**
 * Update active navigation link based on current page
 */
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ============================================
// Scroll Effects
// ============================================

/**
 * Add subtle fade-in effect to content blocks on scroll
 */
function initScrollEffects() {
    const contentBlocks = document.querySelectorAll('.content-block, .card');
    
    const revealOnScroll = debounce(() => {
        contentBlocks.forEach(block => {
            if (isElementInViewport(block)) {
                block.style.opacity = '1';
                block.style.transform = 'translateY(0)';
            }
        });
    }, 50);
    
    // Initialize styles
    contentBlocks.forEach(block => {
        block.style.opacity = '0.8';
        block.style.transform = 'translateY(10px)';
        block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on load
}

// ============================================
// Image Toggle (if images are present)
// ============================================

/**
 * Toggle image display for interactive visualization
 */
function initImageToggles() {
    const toggleButtons = document.querySelectorAll('.image-toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetImage = document.getElementById(targetId);
            
            if (targetImage) {
                targetImage.classList.toggle('hidden');
                button.textContent = targetImage.classList.contains('hidden') 
                    ? 'Show' 
                    : 'Hide';
            }
        });
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

/**
 * Handle smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// Initialize All Functions
// ============================================

/**
 * Run initialization when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavLink();
    initScrollEffects();
    initImageToggles();
    initSmoothScroll();
    
    // Log initialization for debugging
    console.log('Urban Food Resilience Atlas initialized');
});

// Update active link on page load (for browser back button)
window.addEventListener('pageshow', updateActiveNavLink);

/**
 * Keyboard navigation helper
 * Press 'n' for next page, 'p' for previous in sequence
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'n') {
        // Navigate to next page in sequence
        const pageSequence = [
            'index.html',
            'project.html',
            'methods.html',
            'proof.html',
            'data.html',
            'precedents.html',
            'bibliography.html'
        ];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentIndex = pageSequence.indexOf(currentPage);
        if (currentIndex < pageSequence.length - 1) {
            window.location.href = pageSequence[currentIndex + 1];
        }
    } else if (e.key === 'p') {
        // Navigate to previous page in sequence
        const pageSequence = [
            'index.html',
            'project.html',
            'methods.html',
            'proof.html',
            'data.html',
            'precedents.html',
            'bibliography.html'
        ];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentIndex = pageSequence.indexOf(currentPage);
        if (currentIndex > 0) {
            window.location.href = pageSequence[currentIndex - 1];
        }
    }
});
