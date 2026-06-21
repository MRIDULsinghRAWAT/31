/**
 * scroll-engine.js
 * Premium Smooth Scrolling & Scroll-Triggered Animations
 * Uses Lenis (Smooth Scroll) + GSAP + ScrollTrigger
 */

(function () {
    'use strict';

    // Initialize on DOMContentLoaded to ensure smooth scrolling starts immediately
    document.addEventListener('DOMContentLoaded', function () {
        // --- 1. Library Availability Check ---
        if (typeof lenis === 'undefined' && typeof Lenis === 'undefined') {
            console.warn('Lenis library not loaded. Smooth scrolling disabled.');
            initScrollAnimations(false);
            return;
        }

        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded. Animations disabled.');
            return;
        }

        // --- 2. Initialize Lenis Smooth Scrolling ---
        // Handle constructor name variations (Lenis vs lenis)
        const LenisConstructor = typeof Lenis !== 'undefined' ? Lenis : lenis;
        const lenisInstance = new LenisConstructor({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium exponential easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.0,
            smoothTouch: false, // let mobile keep native touch scrolling
            touchMultiplier: 2.0,
            infinite: false,
        });

        // Sync ScrollTrigger with Lenis
        lenisInstance.on('scroll', ScrollTrigger.update);

        // Tell GSAP to update Lenis on tick
        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });

        // Disable lag smoothing in GSAP to prevent sync jank
        gsap.ticker.lagSmoothing(0);

        // Make Lenis instance globally accessible if needed
        window.myLenis = lenisInstance;

        // --- 3. Initialize Animations ---
        initScrollAnimations(true);
    });

    // Refresh ScrollTrigger positions after all page images and assets are fully loaded
    window.addEventListener('load', function () {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });

    /**
     * Initializes all GSAP and ScrollTrigger scroll-linked animations
     * @param {boolean} lenisLoaded Whether smooth scrolling is enabled
     */
    function initScrollAnimations(lenisLoaded) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // --- A. Dynamic Scroll Progress Bar ---
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        document.body.appendChild(progressBar);

        gsap.to(progressBar, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.1
            }
        });

        // --- B. About (Info) Section Animations ---
        const aboutSection = document.querySelector('.about-info-section');
        if (aboutSection) {
            // Photo & Meta Left-column slide-up
            gsap.from('.about-info__left', {
                scrollTrigger: {
                    trigger: '.about-info-section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            });

            // Ambient yellow glow entry scaling
            gsap.from('.about-info__glow', {
                scrollTrigger: {
                    trigger: '.about-info-section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                scale: 0.6,
                opacity: 0,
                duration: 1.8,
                ease: 'elastic.out(1, 0.75)'
            });

            // Skills category grids stagger fade-in
            if (document.querySelector('.about-info__skill-col')) {
                gsap.from('.about-info__skill-col', {
                    scrollTrigger: {
                        trigger: '.about-info__skills-grid',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: 40,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        }

        // --- C. Projects List Entry Animations ---
        const projectItems = gsap.utils.toArray('.project-item-container');
        if (projectItems.length > 0) {
            projectItems.forEach((item, index) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    x: 60,
                    opacity: 0,
                    duration: 0.9,
                    delay: index * 0.05,
                    ease: 'power3.out'
                });
            });
        }

        // --- D. Background Section (Experience & Achievements) ---
        const expCards = gsap.utils.toArray('.experience-card');
        if (expCards.length > 0) {
            expCards.forEach((card) => {
                // Entrance reveal
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1.0,
                    ease: 'power3.out'
                });

                // Subtle parallax shift while scrolling (only on desktop/larger screens)
                if (window.innerWidth > 768) {
                    gsap.to(card, {
                        y: -25,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    });
                }
            });
        }

        // Technical skills network canvas scale-up entry
        const tagCloud = document.getElementById('skills-tagcloud');
        if (tagCloud) {
            gsap.from(tagCloud, {
                scrollTrigger: {
                    trigger: tagCloud,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                scale: 0.92,
                opacity: 0,
                duration: 1.2,
                ease: 'power2.out'
            });
        }

        // --- E. Teaser Contact & Footer Animations ---
        const contactSection = document.querySelector('.teaser-contact');
        if (contactSection) {
            // Container scaling and opacity
            gsap.from(contactSection, {
                scrollTrigger: {
                    trigger: contactSection,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                scale: 0.96,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            });

            // Contact header parallax shift
            const contactHeader = contactSection.querySelector('.teaser-contact__hl');
            if (contactHeader && window.innerWidth > 768) {
                gsap.to(contactHeader, {
                    y: -30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: contactSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }
        }

        // --- F. Cinematic Overlay Blocks Entrance ---
        const cinematicBlocks = gsap.utils.toArray('.cinematic-block-wrapper');
        if (cinematicBlocks.length > 0) {
            gsap.from(cinematicBlocks, {
                scrollTrigger: {
                    trigger: '.video-container',
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                },
                scale: 0.75,
                opacity: 0,
                y: 35,
                stagger: {
                    amount: 0.8,
                    from: "random"
                },
                duration: 1.3,
                ease: 'power4.out'
            });
        }

        // --- G. Cinematic Overlay Blocks Hover Centering Animation ---
        // Disabled fly-to-center effect to align with standard grid layout
        /*
        const wrappers = document.querySelectorAll('.cinematic-block-wrapper');
        const container = document.querySelector('.cinematic-overlay-container');

        if (wrappers.length > 0 && container) {
            wrappers.forEach(wrapper => {
                const block = wrapper.querySelector('.cinematic-block');
                if (!block) return;

                wrapper.addEventListener('mouseenter', () => {
                    if (window.innerWidth < 768) return; // Skip on mobile

                    // Get dimensions
                    const containerRect = container.getBoundingClientRect();
                    const wrapperRect = wrapper.getBoundingClientRect();
                    
                    // Calculate center of container relative to wrapper
                    const containerCenterX = containerRect.left + containerRect.width / 2;
                    const containerCenterY = containerRect.top + containerRect.height / 2;
                    
                    const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
                    const wrapperCenterY = wrapperRect.top + wrapperRect.height / 2;
                    
                    const deltaX = containerCenterX - wrapperCenterX;
                    const deltaY = containerCenterY - wrapperCenterY;
                    
                    // Determine aspect ratio of the image/video
                    const img = block.querySelector('img, video');
                    let R = 16 / 9; // Default to 16:9 for placeholders
                    
                    if (img) {
                        if (img.tagName.toLowerCase() === 'img') {
                            if (img.naturalWidth) {
                                R = img.naturalWidth / img.naturalHeight;
                            } else if (img.src.includes('v1') || img.src.includes('v2')) {
                                R = 9 / 16;
                            } else if (img.src.includes('v3') || img.src.includes('v4')) {
                                R = 3 / 4;
                            }
                        } else if (img.tagName.toLowerCase() === 'video' && img.videoWidth) {
                            R = img.videoWidth / img.videoHeight;
                        }
                    }

                    // Calculate the exact scale factor to occupy exactly 75% of container height
                    // Formula: scale = 0.75 * containerHeight * R / wrapperWidth
                    const hoverScale = (0.75 * containerRect.height * R) / wrapperRect.width;

                    gsap.to(block, {
                        x: deltaX,
                        y: deltaY,
                        scale: hoverScale,
                        duration: 0.6,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                });

                wrapper.addEventListener('mouseleave', () => {
                    if (window.innerWidth < 768) return;

                    // Return to original position and scale
                    gsap.to(block, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                });
            });
        }
        */
    }
})();
