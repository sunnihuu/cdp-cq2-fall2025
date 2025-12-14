/*
Simple interactions only.
No heavy animations.
Used to gently guide reading.
*/

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

/**
 * Subtle header fade on scroll
 */
document.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (header) {
    if (window.scrollY > 50) {
      header.style.opacity = "0.9";
    } else {
      header.style.opacity = "1";
    }
  }
});

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavLink();
});

// Update active link on page load (for browser back button)
window.addEventListener('pageshow', updateActiveNavLink);
