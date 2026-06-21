// === CUSTOM PORTFOLIO LOGIC & COMPONENT ANIMATIONS ===
const loadingDuration = 1000; // 2 seconds
let start = null;

function animateLoading(timestamp) {
    if (!start) start = timestamp;
    const activeRect = document.querySelector('.site-loading .active-dots');
    const inactiveRect = document.querySelector('.site-loading .inactive-dots');
    const counter = document.querySelector('.site-loading__progress div');
    const totalWidth = 200;

    const progress = timestamp - start;
    const percent = Math.min(Math.floor((progress / loadingDuration) * 100), 100);

    const blueWidth = percent / 100 * totalWidth;

    // Safe null checks to prevent runtime errors if SVG elements are absent or structured differently
    if (activeRect) {
        activeRect.setAttribute('width', blueWidth);
    }
    if (inactiveRect) {
        inactiveRect.setAttribute('x', blueWidth);
        inactiveRect.setAttribute('width', totalWidth - blueWidth);
    }
    if (counter) {
        counter.innerText = `${Math.floor(percent)}%`;
    }

    const xoxo = document.querySelector('.site-loading__xoxo');
    if (xoxo) {
        if (percent < 16) {
            xoxo.textContent = 'DON';
            xoxo.style.backgroundImage = 'none';
        } else if (percent < 33) {
            xoxo.textContent = '31';
            xoxo.style.backgroundImage = 'none';
        } else if (percent < 50) {
            xoxo.textContent = 'Damn';
            xoxo.style.backgroundImage = 'none';
        } else if (percent < 66) {
            xoxo.textContent = '!';
            xoxo.style.backgroundImage = 'none';
        }
    }

    if (percent < 100) {
        requestAnimationFrame(animateLoading);
    } else {
        // Auto-remove loading overlay after animation completes
        const loader = document.querySelector('.site-loading');
        if (loader) {
            loader.classList.add('loaded');
            document.body.classList.add('site-loaded');
            setTimeout(() => { loader.style.display = 'none'; }, 700);
        }
    }
}

window.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(animateLoading);

    // Safety fallback to ensure text animates if loader finishes early or fails
    setTimeout(() => {
        document.body.classList.add('site-loaded');
    }, 1200);

    // Contact Popup Toggle Logic
    const popup = document.querySelector('.site-tltr');

    function openPopup(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (popup) {
            popup.removeAttribute('inert');
            if (typeof popup.showModal === 'function') {
                popup.showModal();
            } else {
                popup.setAttribute('open', '');
            }
            document.body.style.overflow = 'hidden';
        }
    }

    function closePopup(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (popup) {
            popup.setAttribute('inert', '');
            if (typeof popup.close === 'function') {
                popup.close();
            } else {
                popup.removeAttribute('open');
            }
            document.body.style.overflow = '';
        }
    }

    // Bind triggers (Header, Navigation recent cases overlay, footer contact link, etc.)
    document.querySelectorAll('.site-header__main-cta, a[href="#contact"]').forEach(btn => {
        btn.addEventListener('click', openPopup);
        btn.addEventListener('pointerdown', openPopup);
    });

    // Close buttons in the native dialog
    const closeBtn = document.querySelector('.site-tltr__close button');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }

    const closeForm = document.querySelector('.site-tltr__close');
    if (closeForm) {
        closeForm.addEventListener('submit', closePopup);
    }

    // Close popup when clicking outside the content card
    if (popup) {
        popup.addEventListener('click', function (e) {
            if (e.target === popup) {
                closePopup(e);
            }
        });
    }
    // Premium Parallax and Scroll Zoom effect for hero header images
    const heroBlock = document.getElementById('hero-header-block_ab79f611da7c54b27559f55957d070dd');
    if (heroBlock) {
        const bgImg = heroBlock.querySelector('.hero-header__bg img');
        const darkener = heroBlock.querySelector('.hero-header__darkener');
        const content = heroBlock.querySelector('.hero-header__content');

        // Set initial scale so that it doesn't snap or crop awkwardly
        if (bgImg) bgImg.style.transform = 'scale(1.15)';

        // 1. Mouse move parallax (Interactive Depth Effect)
        heroBlock.addEventListener('mousemove', function (e) {
            const rect = heroBlock.getBoundingClientRect();
            const xPercent = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
            const yPercent = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

            // Background shifts in the direction of mouse
            if (bgImg && window.gsap) {
                window.gsap.to(bgImg, {
                    x: xPercent * 30,
                    y: yPercent * 15,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });

        // Reset position when mouse leaves the hero section
        heroBlock.addEventListener('mouseleave', function () {
            if (bgImg && window.gsap) {
                window.gsap.to(bgImg, { x: 0, y: 0, duration: 1, ease: 'power2.out' });
            }
        });

        // 2. Scroll Parallax & Zoom Effect
        window.addEventListener('scroll', function () {
            const scrollY = window.scrollY;
            const progress = Math.min(scrollY / 600, 1);

            if (bgImg) {
                bgImg.style.transform = `scale(${1.15 - progress * 0.15}) translateY(${progress * 60}px)`;
            }
            if (darkener) {
                darkener.style.opacity = Math.min(progress * 0.6, 0.6);
            }
            if (content) {
                content.style.opacity = Math.max(1 - progress * 2.5, 0);
                content.style.transform = `translateY(${progress * 40}px)`;
            }
        });
    }

    // Background Section Scroll Reveal Animation & Matrix Decode
    function triggerMatrixDecode(element) {
        const glyphs = "01010101010101010101010101010101<>[]{}/_+-*&^%$#@!X01";
        const targetText = element.getAttribute('data-value') || element.textContent;
        let iteration = 0;
        let interval = null;

        element.style.visibility = 'visible';
        clearInterval(interval);

        interval = setInterval(() => {
            element.textContent = targetText
                .split("")
                .map((char, index) => {
                    if (index < iteration) {
                        return targetText[index];
                    }
                    if (char === " ") return " ";
                    return glyphs[Math.floor(Math.random() * glyphs.length)];
                })
                .join("");

            if (iteration >= targetText.length) {
                clearInterval(interval);
                element.textContent = targetText;
                element.classList.add('matrix-decoded');
            }

            iteration += 1 / 3;
        }, 30);
    }

    const bgRevealEls = document.querySelectorAll('.bg-reveal');
    if (bgRevealEls.length > 0) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('matrix-decode-text')) {
                        triggerMatrixDecode(entry.target);
                    }
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        bgRevealEls.forEach(function (el) { revealObserver.observe(el); });
    }

    // ===== Floating Tag Cloud / Word Constellation =====
    (function () {
        const container = document.getElementById('skills-tagcloud');
        if (!container) return;

        const field = container.querySelector('.skills-tagcloud__field');
        const networkCanvas = container.querySelector('.skills-tagcloud__network');
        const networkCtx = networkCanvas.getContext('2d');

        // 5 Domain color palette — curated for sage/olive background contrast
        const domainColors = {
            languages: { line: 'rgba(184, 114, 61, 0.42)', pill: '#B8723D', accent: 'rgba(207, 134, 75, 0.12)' },  // warm copper
            aiml: { line: 'rgba(58, 142, 181, 0.42)', pill: '#3A8EB5', accent: 'rgba(86, 170, 210, 0.12)' },  // steel cyan
            frameworks: { line: 'rgba(160, 68, 68, 0.42)', pill: '#A04444', accent: 'rgba(180, 75, 75, 0.12)' },   // muted crimson
            cyber: { line: 'rgba(154, 142, 43, 0.42)', pill: '#9A8E2B', accent: 'rgba(195, 180, 50, 0.12)' },  // dark gold
            core: { line: 'rgba(90, 138, 90, 0.42)', pill: '#5A8A5A', accent: 'rgba(120, 165, 120, 0.12)' }  // forest sage
        };

        // All technical skills grouped by 5 resume domains
        const skillTags = [
            // ── Languages ──
            { text: '/java', tier: 'medium', domain: 'languages' },
            { text: '/python', tier: 'large', domain: 'languages' },
            { text: '/javascript', tier: 'medium', domain: 'languages' },
            // ── AI & Machine Learning ──
            { text: '/agentic-ai', tier: 'large', domain: 'aiml' },
            { text: '/aws-bedrock', tier: 'medium', domain: 'aiml' },
            { text: '/rag-pipeline', tier: 'medium', domain: 'aiml' },
            { text: '/computer-vision', tier: 'large', domain: 'aiml' },
            { text: '/efficientnet', tier: 'small', domain: 'aiml' },
            // ── Frameworks & Tools ──
            { text: '/react-18', tier: 'medium', domain: 'frameworks' },
            { text: '/fastapi', tier: 'medium', domain: 'frameworks' },
            { text: '/flask', tier: 'small', domain: 'frameworks' },
            { text: '/tailwind-css', tier: 'small', domain: 'frameworks' },
            { text: '/socket-io', tier: 'small', domain: 'frameworks' },
            { text: '/restful-apis', tier: 'medium', domain: 'frameworks' },
            { text: '/git', tier: 'small', domain: 'frameworks' },
            { text: '/linux', tier: 'small', domain: 'frameworks' },
            { text: '/chromadb', tier: 'medium', domain: 'frameworks' },
            // ── Cybersecurity ──
            { text: '/network-security', tier: 'large', domain: 'cyber' },
            { text: '/nmap', tier: 'small', domain: 'cyber' },
            { text: '/vulnerability-assessment', tier: 'large', domain: 'cyber' },
            { text: '/lateral-movement', tier: 'medium', domain: 'cyber' },
            { text: '/mitre-attck', tier: 'medium', domain: 'cyber' },
            { text: '/nvd-api', tier: 'small', domain: 'cyber' },
            // ── Core Competencies ──
            { text: '/dsa', tier: 'medium', domain: 'core' },
            { text: '/oop', tier: 'medium', domain: 'core' },
        ];

        const tierConfig = {
            large: {
                minSize: 2.2, maxSize: 3.5,
                opacity: 0.82, floatY: 18, floatX: 12
            },
            medium: {
                minSize: 1.3, maxSize: 1.8,
                opacity: 0.75, floatY: 15, floatX: 10
            },
            small: {
                minSize: 0.85, maxSize: 1.1,
                opacity: 0.48, floatY: 12, floatX: 8
            }
        };

        const isMobile = window.innerWidth <= 768;
        const parallaxReduction = isMobile ? 0.4 : 1.0;
        // Keep all 25 skills on both desktop and mobile to ensure all 5 domains are represented and visible
        const visibleTags = skillTags;

        // Tag instances
        const tags = [];
        let mouseX = 0, mouseY = 0;
        let currentMouseX = 0, currentMouseY = 0;
        const lerpFactor = 0.06;
        let hoveredTag = null;

        function createTagElement(skill, baseX, baseY, fontSize, cfg, parallaxFactor) {
            const floatDuration = 8 + Math.random() * 8; // gentle float duration
            const floatDelay = Math.random() * 5;
            const floatAmplitudeY = 8 + Math.random() * 8; // controlled float vertical range
            const floatAmplitudeX = 6 + Math.random() * 6; // controlled float horizontal range

            const el = document.createElement('div');
            el.className = 'skills-tagcloud__tag';
            el.setAttribute('data-domain', skill.domain);
            el.textContent = skill.text;
            el.style.fontSize = fontSize + 'rem';
            el.style.opacity = cfg.opacity;
            el.style.left = baseX + '%';
            el.style.top = baseY + '%';

            field.appendChild(el);

            tags.push({
                el, skill,
                baseX, baseY,
                fontSize,
                parallaxFactor,
                floatDuration,
                floatDelay,
                floatAmplitudeY,
                floatAmplitudeX,
                currentX: 0, currentY: 0,
                targetX: 0, targetY: 0,
                opacity: cfg.opacity
            });

            // Hover events
            el.addEventListener('mouseenter', () => {
                if (hoveredTag && hoveredTag !== el) {
                    hoveredTag.classList.remove('hovered');
                }
                el.classList.add('hovered');
                hoveredTag = el;
            });
            el.addEventListener('mouseleave', () => {
                el.classList.remove('hovered');
                hoveredTag = null;
            });
        }

        function initTags() {
            const w = container.clientWidth;
            const h = container.clientHeight;

            // Group tags by domain to lay them out in distinct vertical bands
            const domainGroups = {};
            visibleTags.forEach(tag => {
                const d = tag.domain;
                if (!domainGroups[d]) domainGroups[d] = [];
                domainGroups[d].push(tag);
            });

            // Define precise vertical bands for each domain to give them structure and prevent crossings
            const domainBands = {
                languages: { yStart: 7, yEnd: 21 },
                aiml: { yStart: 25, yEnd: 39 },
                frameworks: { yStart: 43, yEnd: 63 },
                cyber: { yStart: 67, yEnd: 83 },
                core: { yStart: 87, yEnd: 95 }
            };

            const sizeMultiplier = isMobile ? 0.75 : 1.0;
            const uniformFontSize = 1.35 * sizeMultiplier; // Consistent text size for all tags

            Object.keys(domainBands).forEach(domain => {
                const group = domainGroups[domain] || [];
                const band = domainBands[domain];
                const N = group.length;
                if (N === 0) return;

                const yRange = band.yEnd - band.yStart;

                if (N <= 4) {
                    // Single row layout with staggered vertical offset to look organic
                    group.forEach((skill, idx) => {
                        const cfg = tierConfig[skill.tier];
                        const fontSize = uniformFontSize;
                        const parallaxFactor = (skill.tier === 'large' ? 0.015 + Math.random() * 0.01 :
                            skill.tier === 'medium' ? 0.008 + Math.random() * 0.004 :
                                0.003 + Math.random() * 0.003) * parallaxReduction;

                        // X distribution: evenly spaced across container width (with safety margin to prevent edge overflow)
                        let baseX;
                        if (N === 1) {
                            baseX = 50;
                        } else {
                            baseX = 18 + idx * (64 / (N - 1));
                        }

                        // Alternate baseY slightly up and down within the band
                        const baseY = band.yStart + yRange * (idx % 2 === 0 ? 0.3 : 0.7);

                        createTagElement(skill, baseX, baseY, fontSize, cfg, parallaxFactor);
                    });
                } else {
                    // Two staggered rows for larger groups (e.g. 5, 6, 9 tags) to avoid horizontal clustering
                    const row1Count = Math.ceil(N / 2);
                    const row2Count = Math.floor(N / 2);

                    group.forEach((skill, idx) => {
                        const cfg = tierConfig[skill.tier];
                        const fontSize = uniformFontSize;
                        const parallaxFactor = (skill.tier === 'large' ? 0.015 + Math.random() * 0.01 :
                            skill.tier === 'medium' ? 0.008 + Math.random() * 0.004 :
                                0.003 + Math.random() * 0.003) * parallaxReduction;

                        let baseX, baseY;

                        if (idx < row1Count) {
                            // Row 1 (top half of the band)
                            baseY = band.yStart + yRange * 0.25;
                            if (row1Count === 1) {
                                baseX = 50;
                            } else {
                                baseX = 16 + idx * (68 / (row1Count - 1));
                            }
                        } else {
                            // Row 2 (bottom half of the band)
                            const row2Idx = idx - row1Count;
                            baseY = band.yStart + yRange * 0.75;
                            if (row2Count === 1) {
                                baseX = 50;
                            } else {
                                // Stagger X positions relative to Row 1
                                baseX = 22 + row2Idx * (56 / (row2Count - 1));
                            }
                        }

                        createTagElement(skill, baseX, baseY, fontSize, cfg, parallaxFactor);
                    });
                }
            });
        }

        // Draw domain-colored constellation network lines
        function drawNetwork() {
            const dpr = window.devicePixelRatio || 1;
            const w = container.clientWidth;
            const h = container.clientHeight;

            networkCtx.clearRect(0, 0, w * dpr, h * dpr);

            // Group tags by domain
            const domainGroups = {};
            tags.forEach(tag => {
                const d = tag.skill.domain;
                if (!domainGroups[d]) domainGroups[d] = [];
                domainGroups[d].push(tag);
            });

            // For each domain, draw connecting lines between its tags
            Object.keys(domainGroups).forEach(domain => {
                const group = domainGroups[domain];
                if (group.length < 2) return;

                const color = domainColors[domain];
                networkCtx.strokeStyle = color.line;
                networkCtx.lineWidth = 1.4;

                // Connect each tag to its 2 nearest same-domain neighbors
                group.forEach((tagA, i) => {
                    // Calculate screen positions from percentage
                    const ax = (tagA.baseX / 100) * w + tagA.currentX;
                    const ay = (tagA.baseY / 100) * h + tagA.currentY;

                    // Find nearest neighbors in same domain
                    const distances = group
                        .filter((_, j) => j !== i)
                        .map(tagB => {
                            const bx = (tagB.baseX / 100) * w + tagB.currentX;
                            const by = (tagB.baseY / 100) * h + tagB.currentY;
                            const dx = ax - bx;
                            const dy = ay - by;
                            return { tag: tagB, dist: Math.sqrt(dx * dx + dy * dy), bx, by };
                        })
                        .sort((a, b) => a.dist - b.dist);

                    // Connect to up to 2 nearest with organic curved lines
                    const maxConnections = Math.min(2, distances.length);
                    for (let c = 0; c < maxConnections; c++) {
                        const neighbor = distances[c];
                        if (neighbor.dist > w * 0.65) continue; // don't connect if too far

                        const bx = neighbor.bx;
                        const by = neighbor.by;

                        // Subtle bezier curve for organic feel
                        const midX = (ax + bx) / 2 + (Math.sin(i + c) * 25);
                        const midY = (ay + by) / 2 + (Math.cos(i + c) * 20);

                        networkCtx.beginPath();
                        networkCtx.moveTo(ax, ay);
                        networkCtx.quadraticCurveTo(midX, midY, bx, by);
                        networkCtx.stroke();
                    }
                });
            });

            // Also draw very faint background Voronoi web in neutral color
            networkCtx.strokeStyle = 'rgba(163, 167, 148, 0.06)';
            networkCtx.lineWidth = 0.6;
            const seedRng = (s) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
            const cols = Math.ceil(w / 150);
            const rows = Math.ceil(h / 150);
            const bgPoints = [];
            for (let r = -1; r <= rows + 1; r++) {
                for (let c = -1; c <= cols + 1; c++) {
                    const seed = r * 100 + c;
                    bgPoints.push({
                        x: c * 150 + 75 + (seedRng(seed * 7 + 3) - 0.5) * 100,
                        y: r * 150 + 75 + (seedRng(seed * 13 + 7) - 0.5) * 100
                    });
                }
            }
            for (let i = 0; i < bgPoints.length; i++) {
                for (let j = i + 1; j < bgPoints.length; j++) {
                    const dx = bgPoints[i].x - bgPoints[j].x;
                    const dy = bgPoints[i].y - bgPoints[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200 && dist > 50) {
                        networkCtx.beginPath();
                        networkCtx.moveTo(bgPoints[i].x, bgPoints[i].y);
                        networkCtx.lineTo(bgPoints[j].x, bgPoints[j].y);
                        networkCtx.stroke();
                    }
                }
            }
        }

        function resizeNetwork() {
            const dpr = window.devicePixelRatio || 1;
            const w = container.clientWidth;
            const h = container.clientHeight;
            networkCanvas.width = w * dpr;
            networkCanvas.height = h * dpr;
            networkCanvas.style.width = w + 'px';
            networkCanvas.style.height = h + 'px';
            networkCtx.scale(dpr, dpr);
            drawNetwork();
        }

        // Mouse tracking
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        container.addEventListener('mouseleave', () => {
            mouseX = container.clientWidth / 2;
            mouseY = container.clientHeight / 2;
        });

        // Frame counter for network redraw throttle
        let frameCount = 0;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            const w = container.clientWidth;
            const h = container.clientHeight;
            const now = performance.now() / 1000;

            // Smooth mouse lerp
            currentMouseX += (mouseX - currentMouseX) * lerpFactor;
            currentMouseY += (mouseY - currentMouseY) * lerpFactor;

            tags.forEach(tag => {
                // Ambient float: sine-wave
                const t = now + tag.floatDelay;
                const period = tag.floatDuration;
                const floatY = Math.sin((t / period) * Math.PI * 2) * tag.floatAmplitudeY;
                const floatX = Math.sin((t / period) * Math.PI * 2 * 0.7 + 1.3) * tag.floatAmplitudeX;

                // Parallax: opposite direction to mouse
                const dx = -(currentMouseX - w / 2) * tag.parallaxFactor;
                const dy = -(currentMouseY - h / 2) * tag.parallaxFactor;

                // Combined offset
                const totalX = floatX + dx;
                const totalY = floatY + dy;

                // Smooth lerp for final position
                tag.currentX += (totalX - tag.currentX) * 0.08;
                tag.currentY += (totalY - tag.currentY) * 0.08;

                const isHovered = tag.el.classList.contains('hovered');
                const scale = isHovered ? 1.06 : 1.0;
                tag.el.style.transform = `translate(-50%, -50%) translate(${tag.currentX}px, ${tag.currentY}px) scale(${scale})`;
            });

            // Redraw network lines every 4 frames (for performance + live position tracking)
            frameCount++;
            if (frameCount % 4 === 0) {
                networkCtx.save();
                const dpr = window.devicePixelRatio || 1;
                networkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                drawNetwork();
                networkCtx.restore();
            }
        }

        // Init
        mouseX = container.clientWidth / 2;
        mouseY = container.clientHeight / 2;
        currentMouseX = mouseX;
        currentMouseY = mouseY;

        initTags();
        resizeNetwork();
        animate();

        window.addEventListener('resize', () => {
            resizeNetwork();
        });
    })();
});


// === LEETCODE HEATMAP GENERATOR ===
(function generateLeetcodeHeatmap() {
    const container = document.getElementById('leetcode-heatmap-container');
    const monthsContainer = document.getElementById('leetcode-heatmap-months');
    if (!container) return;

    // LeetCode green palette
    const colors = [
        '#161b22',  // Level 0 (empty)
        '#0e4429',  // Level 1 (light)
        '#006d32',  // Level 2
        '#26a641',  // Level 3
        '#39d353'   // Level 4 (max)
    ];

    // Default stats (will be updated if API succeeds)
    let stats = {
        totalSubmissions: 696,
        totalActiveDays: 245,
        streak: 146,
        submissions: {}
    };

    // Calculate dates — last 52 weeks ending today
    const today = new Date();
    const todayDay = today.getDay(); // 0=Sun
    // Start date: go back 52 weeks from the start of this week
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - todayDay - (52 * 7));

    // Try fetching real data
    fetch('https://alfa-leetcode-api.onrender.com/Mridul_31/calendar')
        .then(res => {
            if (!res.ok) throw new Error('API request failed');
            return res.json();
        })
        .then(data => {
            if (data && data.submissionCalendar) {
                const rawCalendar = JSON.parse(data.submissionCalendar);
                stats.submissions = rawCalendar;
                stats.totalActiveDays = data.totalActiveDays || stats.totalActiveDays;
                stats.streak = data.streak || stats.streak;

                // Calculate submissions in the past one year
                const oneYearAgoSec = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);
                let sum = 0;
                for (const [timestamp, count] of Object.entries(rawCalendar)) {
                    if (parseInt(timestamp) >= oneYearAgoSec) {
                        sum += count;
                    }
                }
                stats.totalSubmissions = sum || stats.totalSubmissions;

                // Update UI elements
                updateHeader(stats);
                renderHeatmap(true);
            } else {
                useFallback();
            }
        })
        .catch(err => {
            console.warn('LeetCode API failed, using fallback data:', err);
            useFallback();
        });

    function useFallback() {
        // Generate mock data based on seed
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        let seed = today.getFullYear() * 1000 + dayOfYear;
        function seededRandom() {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }

        for (let c = 0; c < 53; c++) {
            for (let r = 0; r < 7; r++) {
                const cellDate = new Date(startDate);
                cellDate.setDate(cellDate.getDate() + c * 7 + r);
                const cellUtcMidnightSec = Math.floor(Date.UTC(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()) / 1000);

                if (cellDate > today) continue;

                let count = 0;
                if (cellDate.toDateString() === today.toDateString()) {
                    count = Math.floor(seededRandom() * 3) + 6; // Today always active
                } else {
                    const daysAgo = Math.floor((today - cellDate) / 86400000);
                    const recency = Math.max(0.3, 1 - (daysAgo / 365) * 0.5);
                    const wave = Math.sin(c * 0.15 + dayOfYear * 0.005) * Math.cos(r * 0.4) + Math.cos(c * 0.09) * 0.4;
                    const noise = seededRandom() * 1.4 - 0.5;
                    const score = (wave + noise) * recency;

                    if (score > 0.9) count = 8;
                    else if (score > 0.55) count = 5;
                    else if (score > 0.2) count = 2;
                    else if (score > -0.05) count = 1;
                }
                if (count > 0) {
                    stats.submissions[cellUtcMidnightSec] = count;
                }
            }
        }
        renderHeatmap(false);
    }

    function updateHeader(info) {
        // Update total submissions
        const titleEl = document.querySelector('.lc-heatmap__title');
        if (titleEl) {
            titleEl.innerHTML = `<strong>${info.totalSubmissions}</strong> submissions in the past one year`;
        }
        // Update stats
        const statsEl = document.querySelector('.lc-heatmap__stats');
        if (statsEl) {
            statsEl.innerHTML = `
                                                            <span>Total active days: <strong>${info.totalActiveDays}</strong></span>
                                                            <span>Max streak: <strong>${info.streak}</strong></span>
                                                        `;
        }
    }

    function renderHeatmap(isRealData) {
        container.innerHTML = '';
        if (monthsContainer) monthsContainer.innerHTML = '';

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        const cellSize = 11;
        const cellGap = 14;
        const cols = 53; // ~1 year of weeks
        const rows = 7;
        svg.setAttribute("viewBox", `0 0 ${cols * cellGap} ${rows * cellGap}`);
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", `${rows * cellGap}`);
        svg.style.display = "block";

        // Seeded random for tooltip variations (only used if fallback)
        let seed = 42;
        function seededRandom() {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }

        // Track months for labels
        const monthPositions = [];
        let lastMonth = -1;

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const cellDate = new Date(startDate);
                cellDate.setDate(cellDate.getDate() + c * 7 + r);
                const cellUtcMidnightSec = Math.floor(Date.UTC(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()) / 1000);

                // Track month labels (first row only)
                if (r === 0 && cellDate.getMonth() !== lastMonth) {
                    lastMonth = cellDate.getMonth();
                    monthPositions.push({ month: cellDate.toLocaleDateString('en-US', { month: 'short' }), x: c });
                }

                const rect = document.createElementNS(svgNS, "rect");
                rect.setAttribute("x", (c * cellGap).toString());
                rect.setAttribute("y", (r * cellGap).toString());
                rect.setAttribute("width", cellSize.toString());
                rect.setAttribute("height", cellSize.toString());
                rect.setAttribute("rx", "2");
                rect.setAttribute("ry", "2");

                let level = 0;
                const isFuture = cellDate > today;
                const count = stats.submissions[cellUtcMidnightSec] || 0;

                if (isFuture) {
                    level = 0;
                } else if (count === 0) {
                    level = 0;
                } else if (count <= 2) {
                    level = 1;
                } else if (count <= 5) {
                    level = 2;
                } else if (count <= 8) {
                    level = 3;
                } else {
                    level = 4;
                }

                rect.setAttribute("fill", colors[level]);

                // Tooltip
                const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const submissionsText = count === 0 ? 'No submissions' : `${count} submission${count > 1 ? 's' : ''}`;
                rect.innerHTML = `<title>${dateStr}: ${submissionsText}</title>`;

                rect.style.transition = "transform 0.12s ease, filter 0.12s ease";
                rect.style.cursor = "pointer";
                rect.style.transformOrigin = `${c * cellGap + cellSize / 2}px ${r * cellGap + cellSize / 2}px`;

                rect.addEventListener("mouseenter", () => {
                    rect.style.transform = "scale(1.4)";
                    rect.style.filter = "brightness(1.3) drop-shadow(0 0 4px " + colors[level] + ")";
                });
                rect.addEventListener("mouseleave", () => {
                    rect.style.transform = "none";
                    rect.style.filter = "none";
                });

                svg.appendChild(rect);
            }
        }

        container.appendChild(svg);

        // Render month labels
        if (monthsContainer) {
            const totalWidth = cols * cellGap;
            monthPositions.forEach((m, i) => {
                const span = document.createElement('span');
                span.textContent = m.month;
                const nextX = (i + 1 < monthPositions.length) ? monthPositions[i + 1].x : cols;
                const widthCols = nextX - m.x;
                span.style.width = ((widthCols / cols) * 100) + '%';
                span.style.textAlign = 'left';
                span.style.paddingLeft = '2px';
                monthsContainer.appendChild(span);
            });
        }
    }
})();


// === FEATURED WORK ACCORDION LOGIC (LamaLama Style) ===
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var rows = document.querySelectorAll('.featured-project-row');
        rows.forEach(function (row) {
            var header = row.querySelector('.featured-project-header');
            if (!header) return;

            header.addEventListener('click', function (e) {
                e.preventDefault();
                var isOpen = row.classList.contains('open');

                // Close all other rows
                rows.forEach(function (otherRow) {
                    if (otherRow !== row) {
                        otherRow.classList.remove('open');
                        var icon = otherRow.querySelector('.project-toggle-icon');
                        if (icon) icon.textContent = '( + )';
                    }
                });

                // Toggle current row
                if (isOpen) {
                    row.classList.remove('open');
                    var icon = row.querySelector('.project-toggle-icon');
                    if (icon) icon.textContent = '( + )';
                } else {
                    row.classList.add('open');
                    var icon = row.querySelector('.project-toggle-icon');
                    if (icon) icon.textContent = '( - )';

                    // Recalculate ScrollTrigger offsets after transition
                    setTimeout(function () {
                        if (typeof ScrollTrigger !== 'undefined') {
                            ScrollTrigger.refresh();
                        }
                    }, 400);
                }
            });
        });
    });
})();


// === ABOUT SECTION — Scroll-triggered reveal ===
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var aboutSection = document.getElementById('about-section');
        if (!aboutSection) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.02,
            rootMargin: '50px 0px 0px 0px'
        });

        observer.observe(aboutSection);
    });
})();

// === WATERFALL TEXT ANIMATION FOR ABOUT BIO ===
(function () {
    var bioEl = document.getElementById('about-bio-waterfall');
    if (!bioEl) return;

    // Assign staggered index to each word across all paragraphs
    var words = bioEl.querySelectorAll('.wf-word');
    words.forEach(function (word, i) {
        word.style.setProperty('--wf-i', i);
    });

    // Trigger waterfall when bio scrolls into view
    var wfObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                bioEl.classList.add('wf-visible');
                wfObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    wfObserver.observe(bioEl);
})();


// === ABOUT SECTION — INTERACTIVE WIREFRAME GLOBE (DEHRADUN - PENCIL STYLE) ===
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const canvas = document.getElementById('about-globe-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const labelEl = document.getElementById('about-globe-label');

        // Globe properties
        const R = 65; // Sphere radius
        const cx = 140; // Center X
        const cy = 110; // Center Y
        const tilt = -23 * Math.PI / 180; // Tilted Northern hemisphere
        let rotationY = 0; // Spin angle

        // Dehradun coordinates (lat: 30.3165 N, lon: 78.0322 E)
        const dehradunLat = 30.3165 * Math.PI / 180;
        const dehradunLon = 78.0322 * Math.PI / 180;

        // Decorative floating elements for sketchy background detail
        const miniGlobes = [
            { bx: 45, by: 165, r: 10, phase: Math.random() * 10, speed: 0.02, rot: 0 },
            { bx: 205, by: 40, r: 7, phase: Math.random() * 10, speed: 0.015, rot: 0 }
        ];

        const dustParticles = [];
        for (let i = 0; i < 15; i++) {
            dustParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.15 + 0.05
            });
        }

        // Generate sphere wireframe grid points (Denser grid for rich mesh look)
        // Parallels (latitudes)
        const parallels = [];
        const latSteps = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
        const lonPoints = 72; // denser circle points for smooth curve projections

        latSteps.forEach(latDeg => {
            const latRad = latDeg * Math.PI / 180;
            const parallelPoints = [];
            for (let i = 0; i <= lonPoints; i++) {
                const lonRad = (i * 360 / lonPoints) * Math.PI / 180;
                parallelPoints.push({
                    x: R * Math.cos(latRad) * Math.sin(lonRad),
                    y: -R * Math.sin(latRad),
                    z: R * Math.cos(latRad) * Math.cos(lonRad)
                });
            }
            parallels.push(parallelPoints);
        });

        // Meridians (longitudes)
        const meridians = [];
        const lonSteps = [];
        for (let i = 0; i < 24; i++) {
            lonSteps.push(i * 15);
        }
        const latPoints = 30; // points per meridian arc

        lonSteps.forEach(lonDeg => {
            const lonRad = lonDeg * Math.PI / 180;
            const meridianPoints = [];
            for (let i = 0; i <= latPoints; i++) {
                const latRad = (-90 + i * 180 / latPoints) * Math.PI / 180;
                meridianPoints.push({
                    x: R * Math.cos(latRad) * Math.sin(lonRad),
                    y: -R * Math.sin(latRad),
                    z: R * Math.cos(latRad) * Math.cos(lonRad)
                });
            }
            meridians.push(meridianPoints);
        });

        // Continental landmasses data loops (Latitude, Longitude) - Coarse Fallback
        const landmasses = [
            // Africa
            [
                [-34, 18], [-33, 26], [-20, 35], [5, 45], [11, 51],
                [12, 43], [30, 32], [32, 25], [35, 15], [36, 5],
                [35, -5], [32, -9], [15, -17], [5, -10], [4, 9],
                [-15, 12], [-30, 15], [-34, 18]
            ],
            // Eurasia (Europe + Asia + India)
            [
                [36, -6], [40, 15], [38, 22], [40, 30], [25, 38],
                [15, 45], [12, 54], [25, 60], [25, 68], [8, 77],
                [22, 88], [10, 105], [20, 110], [22, 115], [30, 122],
                [35, 140], [45, 142], [60, 165], [66, 170], [70, 180],
                [75, 140], [75, 100], [70, 70], [70, 40], [70, 25],
                [60, 10], [60, 5], [50, 0], [45, -5], [36, -6]
            ],
            // North America
            [
                [8, -77], [10, -83], [16, -95], [23, -110], [30, -115],
                [45, -125], [60, -145], [65, -165], [70, -160], [70, -120],
                [70, -80], [60, -60], [50, -55], [40, -74], [25, -80],
                [30, -85], [20, -90], [15, -95], [8, -77]
            ],
            // Greenland
            [
                [60, -45], [70, -30], [80, -20], [82, -60], [70, -70], [60, -45]
            ],
            // South America
            [
                [8, -77], [10, -65], [5, -55], [-5, -35], [-23, -43],
                [-35, -57], [-45, -65], [-55, -68], [-50, -75], [-30, -72],
                [-15, -75], [-5, -80], [0, -80], [8, -77]
            ],
            // Australia
            [
                [-22, 114], [-35, 115], [-35, 124], [-38, 140], [-38, 150],
                [-28, 153], [-15, 145], [-11, 142], [-12, 131], [-22, 114]
            ]
        ];

        // Use high-resolution country boundaries from countries-data.js if loaded, otherwise fall back to coarse boundaries
        const rawLandData = (window.EARTH_BOUNDARIES && window.EARTH_BOUNDARIES.length > 0)
            ? window.EARTH_BOUNDARIES
            : landmasses;

        // Pre-convert landmass coordinates to spherical points
        const projectedLandmasses = rawLandData.map(polygon => {
            return polygon.map(coord => {
                const latRad = coord[0] * Math.PI / 180;
                const lonRad = coord[1] * Math.PI / 180;
                return {
                    x: R * Math.cos(latRad) * Math.sin(lonRad),
                    y: -R * Math.sin(latRad),
                    z: R * Math.cos(latRad) * Math.cos(lonRad)
                };
            });
        });

        // Spin control variables for mouse/finger dragging
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;

        canvas.addEventListener('mousedown', function (e) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
        });

        window.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            rotationY += dx * 0.007; // spin speed factor
            dragStartX = e.clientX;
            dragStartY = e.clientY;
        });

        window.addEventListener('mouseup', function () {
            isDragging = false;
        });

        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length > 0) {
                isDragging = true;
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', function (e) {
            if (!isDragging || e.touches.length === 0) return;
            const dx = e.touches[0].clientX - dragStartX;
            const dy = e.touches[0].clientY - dragStartY;
            rotationY += dx * 0.007;
            dragStartX = e.touches[0].clientX;
            dragStartY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchend', function () {
            isDragging = false;
        });

        function rotateAndProject(point, rotY) {
            // 1. Rotate around Y axis (spin)
            const x1 = point.x * Math.cos(rotY) - point.z * Math.sin(rotY);
            const z1 = point.x * Math.sin(rotY) + point.z * Math.cos(rotY);

            // 2. Rotate around X axis (tilt)
            const y2 = point.y * Math.cos(tilt) - z1 * Math.sin(tilt);
            const z2 = point.y * Math.sin(tilt) + z1 * Math.cos(tilt);

            return {
                px: cx + x1,
                py: cy + y2,
                pz: z2 // z-depth for sorting
            };
        }

        // Helper to draw sketchy lines (multiple slightly displaced thin paths)
        function drawSketchyLine(x1, y1, x2, y2, opacity, thickness, strokes = 2) {
            const baseJitter = 0.5;
            for (let s = 0; s < strokes; s++) {
                ctx.beginPath();
                const j = s * 0.3;
                const offset1x = (Math.random() - 0.5) * (baseJitter + j);
                const offset1y = (Math.random() - 0.5) * (baseJitter + j);
                const offset2x = (Math.random() - 0.5) * (baseJitter + j);
                const offset2y = (Math.random() - 0.5) * (baseJitter + j);

                ctx.moveTo(x1 + offset1x, y1 + offset1y);
                ctx.lineTo(x2 + offset2x, y2 + offset2y);
                ctx.strokeStyle = `rgba(230, 229, 207, ${opacity})`;
                ctx.lineWidth = thickness;
                ctx.stroke();
            }
        }

        // Helper to draw sketchy circles
        function drawSketchyCircle(x, y, r, opacity, strokes = 2) {
            const baseJitter = 0.5;
            for (let s = 0; s < strokes; s++) {
                ctx.beginPath();
                const points = 36;
                const jitter = baseJitter + s * 0.3;
                for (let i = 0; i <= points; i++) {
                    const angle = (i * 360 / points) * Math.PI / 180;
                    const jr = r + (Math.random() - 0.5) * jitter;
                    const px = x + jr * Math.cos(angle);
                    const py = y + jr * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.strokeStyle = `rgba(230, 229, 207, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        // Helper to draw background mini globes (matching pencil style reference)
        function drawMiniGlobe(mg) {
            mg.phase += mg.speed;
            mg.rot += 0.005;
            const floatY = Math.sin(mg.phase) * 4;
            const y = mg.by + floatY;
            const x = mg.bx;

            // Sketched outline
            drawSketchyCircle(x, y, mg.r, 0.08, 2);

            // Elliptical grid lines
            ctx.strokeStyle = 'rgba(230, 229, 207, 0.04)';
            ctx.lineWidth = 0.4;

            // Parallel
            ctx.beginPath();
            ctx.ellipse(x, y, mg.r, mg.r * 0.45, 0.15, 0, Math.PI * 2);
            ctx.stroke();

            // Meridian
            ctx.beginPath();
            ctx.ellipse(x, y, mg.r * 0.45, mg.r, -0.1, 0, Math.PI * 2);
            ctx.stroke();
        }

        // High-performance Grid Line Renderer (Projects and draws the entire line in one batch)
        function drawGridLine(line, rotY) {
            const projected = line.map(p => {
                const proj = rotateAndProject(p, rotY);
                return { px: proj.px, py: proj.py, pz: proj.pz };
            });

            // Draw front parts (2 sketchy passes for pencil look)
            const frontStrokes = 2;
            const frontOpacity = 0.08;
            const frontThickness = 0.5;

            for (let s = 0; s < frontStrokes; s++) {
                ctx.beginPath();
                const jitter = 0.4 + s * 0.25;
                let isDrawing = false;

                for (let i = 0; i < projected.length; i++) {
                    const pt = projected[i];
                    if (pt.pz > 0) {
                        const jx = (Math.random() - 0.5) * jitter;
                        const jy = (Math.random() - 0.5) * jitter;
                        if (!isDrawing) {
                            ctx.moveTo(pt.px + jx, pt.py + jy);
                            isDrawing = true;
                        } else {
                            ctx.lineTo(pt.px + jx, pt.py + jy);
                        }
                    } else {
                        isDrawing = false;
                    }
                }
                ctx.strokeStyle = `rgba(230, 229, 207, ${frontOpacity})`;
                ctx.lineWidth = frontThickness;
                ctx.stroke();
            }

            // Draw back parts (fainter, 1 stroke, dashed look)
            const backOpacity = 0.02;
            if (backOpacity > 0) {
                ctx.beginPath();
                let isDrawing = false;
                for (let i = 0; i < projected.length; i++) {
                    const pt = projected[i];
                    if (pt.pz <= 0) {
                        if (!isDrawing) {
                            ctx.moveTo(pt.px, pt.py);
                            isDrawing = true;
                        } else {
                            ctx.lineTo(pt.px, pt.py);
                        }
                    } else {
                        isDrawing = false;
                    }
                }
                ctx.strokeStyle = `rgba(230, 229, 207, ${backOpacity})`;
                ctx.lineWidth = 0.4;
                ctx.stroke();
            }
        }

        // High-performance Landmass Polygon Renderer (Projects and draws the entire polygon in one batch)
        function drawLandmassPolygon(polygon, rotY) {
            const projected = polygon.map(p => {
                const proj = rotateAndProject(p, rotY);
                return { px: proj.px, py: proj.py, pz: proj.pz };
            });

            // Draw front outlines (2 sketchy strokes, bolder pencil graphite style)
            const frontStrokes = 2;
            const frontOpacity = 0.28;
            const frontThickness = 0.7;

            for (let s = 0; s < frontStrokes; s++) {
                ctx.beginPath();
                const jitter = 0.4 + s * 0.2;
                let isDrawing = false;

                for (let i = 0; i < projected.length; i++) {
                    const pt = projected[i];
                    if (pt.pz > 0) {
                        const jx = (Math.random() - 0.5) * jitter;
                        const jy = (Math.random() - 0.5) * jitter;
                        if (!isDrawing) {
                            ctx.moveTo(pt.px + jx, pt.py + jy);
                            isDrawing = true;
                        } else {
                            ctx.lineTo(pt.px + jx, pt.py + jy);
                        }
                    } else {
                        isDrawing = false;
                    }
                }
                ctx.strokeStyle = `rgba(230, 229, 207, ${frontOpacity})`;
                ctx.lineWidth = frontThickness;
                ctx.stroke();
            }

            // Draw back outlines (faint, 1 stroke)
            const backOpacity = 0.05;
            if (backOpacity > 0) {
                ctx.beginPath();
                let isDrawing = false;
                for (let i = 0; i < projected.length; i++) {
                    const pt = projected[i];
                    if (pt.pz <= 0) {
                        if (!isDrawing) {
                            ctx.moveTo(pt.px, pt.py);
                            isDrawing = true;
                        } else {
                            ctx.lineTo(pt.px, pt.py);
                        }
                    } else {
                        isDrawing = false;
                    }
                }
                ctx.strokeStyle = `rgba(230, 229, 207, ${backOpacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        function animateGlobe() {
            requestAnimationFrame(animateGlobe);

            // Increment rotationY only if the user is not actively dragging the globe
            if (!isDragging) {
                rotationY += 0.0025; // Slow, sketch-book rotation
            }

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Draw dust particles (background texture)
            dustParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(230, 229, 207, ${p.opacity})`;
                ctx.fill();
            });

            // 2. Draw background floating mini globes
            miniGlobes.forEach(drawMiniGlobe);

            // 3. Draw Main Globe Silhouette Circle (Sketchy - Bolder)
            drawSketchyCircle(cx, cy, R, 0.25, 3);

            // 3.5 Draw sketchy tick marks along the outer ring (Pencil compass effect)
            for (let angle = 0; angle < 360; angle += 15) {
                const rad = angle * Math.PI / 180;
                const x1 = cx + R * Math.cos(rad);
                const y1 = cy + R * Math.sin(rad);
                const x2 = cx + (R + 4) * Math.cos(rad);
                const y2 = cy + (R + 4) * Math.sin(rad);
                drawSketchyLine(x1, y1, x2, y2, 0.20, 0.7, 2);
            }

            // 4. Draw Parallels
            parallels.forEach(line => {
                drawGridLine(line, rotationY);
            });

            // 5. Draw Meridians
            meridians.forEach(line => {
                drawGridLine(line, rotationY);
            });

            // 5.5. Draw Earth Continents (Detailed Landmasses)
            projectedLandmasses.forEach(polygon => {
                drawLandmassPolygon(polygon, rotationY);
            });

            // 6. Calculate Dehradun position
            const dhPoint = {
                x: R * Math.cos(dehradunLat) * Math.sin(dehradunLon),
                y: -R * Math.sin(dehradunLat),
                z: R * Math.cos(dehradunLat) * Math.cos(dehradunLon)
            };

            const dhProj = rotateAndProject(dhPoint, rotationY);
            const isFront = dhProj.pz > 0;

            // Anchor coordinates of the label
            const labelAnchorX = 120;
            const labelAnchorY = 55;
            const elbowX = 135;
            const elbowY = 55;

            // Draw HUD indicator line (Sketchy)
            if (isFront) {
                // Solid sketchy yellow line - Bolder
                drawSketchyLine(dhProj.px, dhProj.py, elbowX, elbowY, 0.90, 1.2, 3);
                drawSketchyLine(elbowX, elbowY, labelAnchorX, labelAnchorY, 0.90, 1.2, 3);

                // Draw glowing Dehradun dot (hand sketched circular point - Bolder)
                drawSketchyCircle(dhProj.px, dhProj.py, 4.5, 0.9, 3);
                ctx.beginPath();
                ctx.arc(dhProj.px, dhProj.py, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#f1e500';
                ctx.shadowColor = '#f1e500';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0; // reset

                // Pulse ring - Bolder
                const pulseRadius = 4.0 + (Date.now() % 1000) / 100 * 0.7;
                const pulseOpacity = 1 - (Date.now() % 1000) / 1000;
                drawSketchyCircle(dhProj.px, dhProj.py, pulseRadius, pulseOpacity * 0.8, 2);

                if (labelEl) {
                    labelEl.style.opacity = '1';
                }
            } else {
                // Dashed sketched gray line
                ctx.beginPath();
                ctx.moveTo(dhProj.px, dhProj.py);
                ctx.lineTo(elbowX, elbowY);
                ctx.lineTo(labelAnchorX, labelAnchorY);
                ctx.strokeStyle = 'rgba(230, 229, 207, 0.12)';
                ctx.setLineDash([2, 2]);
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.setLineDash([]); // reset

                // Dimmed dot
                ctx.beginPath();
                ctx.arc(dhProj.px, dhProj.py, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(230, 229, 207, 0.25)';
                ctx.fill();

                if (labelEl) {
                    labelEl.style.opacity = '0.15';
                }
            }
        }

        // Start animate loop
        animateGlobe();

        // --- 3D Experience Cards Parallax Tilt ---
        (function init3DCardTilt() {
            const cards = document.querySelectorAll('.experience-card');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    // Max tilt angles
                    const maxRotateX = 8; // degrees
                    const maxRotateY = 8; // degrees

                    const rotateX = ((centerY - y) / centerY) * maxRotateX;
                    const rotateY = ((x - centerX) / centerX) * maxRotateY;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                });
            });
        })();
    });
})();

// === SMOOTH SCROLL FOR HASH LINKS ===
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();

                // Use Lenis smooth scrolling if available, otherwise fallback to native smooth scroll
                if (window.myLenis) {
                    window.myLenis.scrollTo(targetElement, {
                        offset: 0,
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    });
})();

