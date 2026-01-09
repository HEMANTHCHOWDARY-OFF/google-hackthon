/**
 * Animation Utilities for PrepTracker
 * Centralized animation controller with accessibility support
 */

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Animate a number counter from start to end
 * @param {HTMLElement} element - Target element
 * @param {number} end - End value
 * @param {number} duration - Animation duration in ms
 * @param {string} suffix - Optional suffix (e.g., '%', 'h')
 */
export function animateCounter(element, end, duration = 2000, suffix = '') {
    if (prefersReducedMotion) {
        element.textContent = end + suffix;
        return;
    }

    const start = 0;
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const current = start + (end - start) * easeProgress;
        element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Typing effect for text
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in ms per character
 */
export function typeText(element, text, speed = 50) {
    if (prefersReducedMotion) {
        element.textContent = text;
        element.style.opacity = '1';
        return;
    }

    element.textContent = '';
    element.style.opacity = '1';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

/**
 * Add shimmer effect to element
 * @param {HTMLElement} element - Target element
 */
export function addShimmerEffect(element) {
    if (prefersReducedMotion) return;

    element.classList.add('shimmer-effect');
}

/**
 * Staggered fade-in animation for multiple elements
 * @param {NodeList|Array} elements - Elements to animate
 * @param {number} delay - Delay between each element in ms
 */
export function staggeredFadeIn(elements, delay = 100) {
    if (prefersReducedMotion) {
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * delay);
    });
}

/**
 * Animate progress bar fill
 * @param {HTMLElement} progressBar - Progress bar element
 * @param {number} targetWidth - Target width percentage
 * @param {number} duration - Animation duration in ms
 */
export function animateProgressBar(progressBar, targetWidth, duration = 1500) {
    if (prefersReducedMotion) {
        progressBar.style.width = targetWidth + '%';
        return;
    }

    progressBar.style.width = '0%';
    progressBar.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

    // Trigger reflow
    progressBar.offsetHeight;

    setTimeout(() => {
        progressBar.style.width = targetWidth + '%';
    }, 50);
}

/**
 * Intersection Observer for scroll animations
 * @param {string} selector - CSS selector for elements to observe
 * @param {string} animationClass - Class to add when element is visible
 */
export function observeScrollAnimations(selector, animationClass = 'fade-in-up') {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });
}

/**
 * Create ripple effect on button click
 * @param {Event} event - Click event
 */
export function createRipple(event) {
    if (prefersReducedMotion) return;

    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Add ripple effect to all buttons
 */
export function initializeRippleEffects() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.btn, button').forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });
}

/**
 * Pulse animation for elements
 * @param {HTMLElement} element - Element to pulse
 * @param {number} duration - Pulse duration in ms
 */
export function pulseElement(element, duration = 1000) {
    if (prefersReducedMotion) return;

    element.style.animation = `pulse ${duration}ms ease-in-out`;

    setTimeout(() => {
        element.style.animation = '';
    }, duration);
}

/**
 * Initialize all animations on page load
 */
export function initializeAnimations() {
    // Add reduced motion class to body if needed
    if (prefersReducedMotion) {
        document.body.classList.add('reduce-motion');
    }

    // Initialize ripple effects
    initializeRippleEffects();

    // Observe scroll animations
    // observeScrollAnimations('.doc-card', 'fade-in-up');
}
