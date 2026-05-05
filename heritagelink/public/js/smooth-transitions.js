// ============================================
// SMOOTH PAGE TRANSITIONS
// ============================================

class SmoothTransitions {
    constructor() {
        this.init();
    }

    init() {
        this.createTransitionOverlay();
        this.setupPageTransitions();
        this.setupStaggerAnimations();
        this.setupScrollAnimations();
        this.setupFormAnimations();
    }

    // Create transition overlay element
    createTransitionOverlay() {
        if (document.querySelector('.page-transition')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="spinner"></div>
                <p style="margin-top: 1rem; font-weight: 600;">Loading...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    // Setup smooth page transitions for navigation
    setupPageTransitions() {
        // Intercept all internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Skip external links, anchors, and special links
            if (!href || 
                href.startsWith('#') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:') || 
                href.includes('://') ||
                link.target === '_blank' ||
                link.hasAttribute('download')) {
                return;
            }

            // Skip if it's the same page
            if (href === window.location.pathname) return;

            e.preventDefault();
            this.navigateWithTransition(href);
        });

        // Handle form submissions with transitions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.method.toLowerCase() === 'post') {
                this.showTransition();
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.navigateWithTransition(window.location.pathname, false);
        });
    }

    // Navigate with smooth transition
    navigateWithTransition(url, pushState = true) {
        this.showTransition();
        
        setTimeout(() => {
            if (pushState) {
                history.pushState(null, '', url);
            }
            window.location.href = url;
        }, 200);
    }

    // Show transition overlay
    showTransition() {
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
    }

    // Hide transition overlay
    hideTransition() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }

    // Setup stagger animations for lists and grids
    setupStaggerAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        item.classList.add('stagger-item');
                        item.style.animationDelay = `${index * 0.1}s`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe common container classes
        const containers = document.querySelectorAll(
            '.quick-actions, .features-grid, .destinations-grid, .events-grid, ' +
            '.artisan-grid, .product-grid, .nav-menu, .admin-cards'
        );
        
        containers.forEach(container => observer.observe(container));
    }

    // Setup scroll-triggered animations
    setupScrollAnimations() {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Add scroll animation to sections
        const sections = document.querySelectorAll(
            'section, .hero, .features, .content-section, .form-card'
        );
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            scrollObserver.observe(section);
        });
    }

    // Setup form input animations
    setupFormAnimations() {
        // Floating label effect
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });

        // Button loading states
        const buttons = document.querySelectorAll('button[type="submit"], .btn-submit');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.add('loading');
                button.style.pointerEvents = 'none';
                
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                // Reset after 5 seconds if no page change
                setTimeout(() => {
                    button.classList.remove('loading');
                    button.style.pointerEvents = '';
                    button.innerHTML = originalText;
                }, 5000);
            });
        });
    }

    // Add smooth hover effects to cards
    addCardHoverEffects() {
        const cards = document.querySelectorAll(
            '.card, .action-card, .place-card, .event-card, .product-card, .artisan-card'
        );
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });
    }

    // Smooth scroll to element
    scrollTo(element, offset = 0) {
        const targetElement = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Add ripple effect to buttons
    addRippleEffect() {
        const buttons = document.querySelectorAll('button, .btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation CSS
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize smooth transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const transitions = new SmoothTransitions();
    
    // Hide transition overlay after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            transitions.hideTransition();
        }, 100);
    });
    
    // Add additional effects
    setTimeout(() => {
        transitions.addCardHoverEffects();
        transitions.addRippleEffect();
    }, 500);
});

// Export for use in other scripts
window.SmoothTransitions = SmoothTransitions;