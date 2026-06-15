/* ==========================================================================
   SKILLI CORE SCRIPTS - GSAP, CANVAS, LENIS, AND MICRO-INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Futuristic Loading Sequence
    runPreloader(() => {
        // Callback after preloader finishes
        initSmoothScrolling();
        initCustomCursor();
        initHeroCanvas();
        initScrollReveals();
        initApproachSVGLine();
        initEcosystemNetwork();
        initTestimonialSlider();
        initInteractiveGlows();
        initMagneticElements();
        initNavbarToggle();
    });
});

/* ==========================================================================
   FUTURISTIC LOADING SCREEN ENGINE
   ========================================================================== */
function runPreloader(callback) {
    const preloader = document.getElementById('preloader');
    const percentEl = document.getElementById('progress-percent');
    const bar = document.getElementById('progress-bar');
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    let progress = 0;
    let lineIdx = 0;

    // Show terminal lines sequentially
    const lineInterval = setInterval(() => {
        if (lineIdx < terminalLines.length) {
            terminalLines[lineIdx].classList.add('active');
            lineIdx++;
        } else {
            clearInterval(lineInterval);
        }
    }, 450);

    // Increase loader percentage
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 4) + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Fade out preloader
            setTimeout(() => {
                preloader.style.opacity = 0;
                setTimeout(() => {
                    preloader.style.display = 'none';
                    if (callback) callback();
                }, 600);
            }, 600);
        }
        percentEl.textContent = progress;
        bar.style.width = `${progress}%`;
    }, 35);
}

/* ==========================================================================
   SMOOTH SCROLLING (Lenis & GSAP Coordination)
   ========================================================================== */
let lenis;
function initSmoothScrolling() {
    if (!window.Lenis) return;
    
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0
    });

    lenis.on('scroll', () => {
        if (window.ScrollTrigger) {
            ScrollTrigger.update();
        }
    });

    // Connect Lenis to GSAP ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

/* ==========================================================================
   CUSTOM FLOATING CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const ring = cursor.querySelector('.cursor-ring');
    const dot = cursor.querySelector('.cursor-dot');
    const label = cursor.querySelector('.cursor-label');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: mouse.x, y: mouse.y };
    let dotPos = { x: mouse.x, y: mouse.y };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Smoothing trailing animation
    function updateCursor() {
        // Interpolation (lerp)
        ringPos.x += (mouse.x - ringPos.x) * 0.15;
        ringPos.y += (mouse.y - ringPos.y) * 0.15;
        
        dotPos.x += (mouse.x - dotPos.x) * 0.4;
        dotPos.y += (mouse.y - dotPos.y) * 0.4;

        ring.style.left = `${ringPos.x}px`;
        ring.style.top = `${ringPos.y}px`;
        
        dot.style.left = `${dotPos.x}px`;
        dot.style.top = `${dotPos.y}px`;
        
        label.style.left = `${dotPos.x}px`;
        label.style.top = `${dotPos.y}px`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover listeners
    // 1. Regular Hover (Links/Buttons)
    const hoverables = document.querySelectorAll('a, button, .filter-btn, .nav-logo');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering-link');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering-link');
        });
    });

    // 2. SOLVE Hover (Problem cards)
    const problemCards = document.querySelectorAll('.problem-card');
    problemCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering-solve');
            label.textContent = card.getAttribute('data-hover-label') || 'SOLVE';
        });
        card.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering-solve');
        });
    });

    // 3. VIEW Hover (Project cases)
    const projectCases = document.querySelectorAll('.project-case');
    projectCases.forEach(project => {
        project.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering-view');
            label.textContent = 'VIEW';
        });
        project.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering-view');
        });
    });
}

/* ==========================================================================
   CANVAS HERO BACKGROUND (Interactive Particles & Network Mesh)
   ========================================================================== */
function initHeroCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(60, Math.floor(width / 20));
    const connectionDist = 120;
    let mouse = { x: -1000, y: -1000, active: false };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1;
            this.baseColor = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(157, 78, 221, 0.4)';
            this.color = this.baseColor;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce bounds
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Repel from mouse
            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                    this.color = 'rgba(0, 240, 255, 0.8)';
                } else {
                    this.color = this.baseColor;
                }
            } else {
                this.color = this.baseColor;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Spawn Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Canvas Animation Loop
    function loop() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connection lines
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.15;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}

/* ==========================================================================
   GSAP SCROLLTRIGGER REVEALS & METRICS COUNTERS
   ========================================================================== */
function initScrollReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Fade reveal
    gsap.utils.toArray('.reveal-fade').forEach(el => {
        gsap.fromTo(el, {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Scale reveal
    gsap.utils.toArray('.reveal-scale').forEach(el => {
        gsap.fromTo(el, {
            opacity: 0,
            scale: 0.95,
            y: 30
        }, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Slide reveals
    gsap.utils.toArray('.reveal-slide-left').forEach(el => {
        gsap.fromTo(el, {
            opacity: 0,
            x: -50
        }, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    gsap.utils.toArray('.reveal-slide-right').forEach(el => {
        gsap.fromTo(el, {
            opacity: 0,
            x: 50
        }, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Storytelling section vertical progress line fill
    gsap.fromTo('#story-progress-fill', {
        height: '0%'
    }, {
        height: '100%',
        scrollTrigger: {
            trigger: '.storytelling',
            start: 'top 35%',
            end: 'bottom 60%',
            scrub: true
        }
    });

    // Story block node active toggling
    gsap.utils.toArray('.story-block').forEach(block => {
        ScrollTrigger.create({
            trigger: block,
            start: 'top 65%',
            onEnter: () => block.classList.add('active'),
            onLeaveBack: () => block.classList.remove('active')
        });
    });

    // Animate trust terminal metrics meter bars
    gsap.utils.toArray('.m-fill').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%'; // Reset to zero for animate trigger
        
        gsap.to(bar, {
            width: targetWidth,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 85%'
            }
        });
    });

    // Animate metric numbers (Results section)
    gsap.utils.toArray('.res-num').forEach(num => {
        const targetVal = parseFloat(num.getAttribute('data-target'));
        gsap.fromTo(num, {
            innerText: 0
        }, {
            innerText: targetVal,
            duration: 2.5,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: num,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
}

/* ==========================================================================
   HOW WE WORK TIMELINE SVG PATHWAY CALCULATOR
   ========================================================================== */
function initApproachSVGLine() {
    const activePath = document.getElementById('approach-path-active');
    const backgroundPath = document.getElementById('approach-path');
    const wrapper = document.querySelector('.approach-wrapper');
    const cards = document.querySelectorAll('.approach-card');

    if (!activePath || cards.length === 0 || window.innerWidth < 768) return;

    function drawPath() {
        const wrapperRect = wrapper.getBoundingClientRect();
        let pathData = '';

        cards.forEach((card, idx) => {
            const cardRect = card.getBoundingClientRect();
            // Calculate coordinates relative to wrapper
            const x = card.offsetLeft + card.offsetWidth / 2;
            const y = card.offsetTop + card.offsetHeight / 2;

            if (idx === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                const prevCard = cards[idx - 1];
                const prevY = prevCard.offsetTop + prevCard.offsetHeight / 2;
                
                // Draw circuit-style trace curves
                const midY = prevY + (y - prevY) / 2;
                pathData += ` C ${prevCard.offsetLeft + prevCard.offsetWidth/2} ${midY}, ${x} ${midY}, ${x} ${y}`;
            }
        });

        backgroundPath.setAttribute('d', pathData);
        activePath.setAttribute('d', pathData);

        // Path Length configuration for GSAP stroke animation
        const pathLength = activePath.getTotalLength();
        activePath.style.strokeDasharray = pathLength;
        activePath.style.strokeDashoffset = pathLength;

        // Sync stroke fill animation with scroll position
        gsap.to(activePath, {
            strokeDashoffset: 0,
            scrollTrigger: {
                trigger: wrapper,
                start: 'top 35%',
                end: 'bottom 65%',
                scrub: true
            }
        });
    }

    drawPath();
    window.addEventListener('resize', drawPath);

    // Toggle active class on cards when scrolling through them
    cards.forEach(card => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 60%',
            onEnter: () => card.classList.add('active'),
            onLeaveBack: () => card.classList.remove('active')
        });
    });
}

/* ==========================================================================
   TECHNOLOGY ECOSYSTEM WEB CONNECTOR (Canvas network logotype)
   ========================================================================== */
function initEcosystemNetwork() {
    const container = document.querySelector('.ecosystem-network-container');
    const canvas = document.getElementById('ecosystem-canvas');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = container.offsetWidth;
    let height = canvas.height = container.offsetHeight;

    const nodes = document.querySelectorAll('.tech-node');
    let nodeCoords = [];

    // Map initial absolute coordinate positions of html nodes relative to parent
    function mapNodes() {
        nodeCoords = [];
        nodes.forEach(node => {
            const x = node.offsetLeft + node.offsetWidth / 2;
            const y = node.offsetTop + node.offsetHeight / 2;
            nodeCoords.push({
                el: node,
                x: x,
                y: y,
                category: node.getAttribute('data-category'),
                active: true
            });
        });
    }

    window.addEventListener('resize', () => {
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;
        mapNodes();
    });

    mapNodes();

    // Redraw ecosystem circuit-link map
    function drawEcosystemLines() {
        ctx.clearRect(0, 0, width, height);

        // Map latest node center coordinates
        nodeCoords.forEach(node => {
            node.x = node.el.offsetLeft + node.el.offsetWidth / 2;
            node.y = node.el.offsetTop + node.el.offsetHeight / 2;
            node.active = window.getComputedStyle(node.el).opacity !== '0.15';
        });

        // Loop pairs to draw connection line mesh
        for (let i = 0; i < nodeCoords.length; i++) {
            const n1 = nodeCoords[i];
            if (!n1.active) continue;

            for (let j = i + 1; j < nodeCoords.length; j++) {
                const n2 = nodeCoords[j];
                if (!n2.active) continue;

                // Restrict links to close nodes
                const dx = n1.x - n2.x;
                const dy = n1.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 180) {
                    const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
                    gradient.addColorStop(0, getCategoryColor(n1.category, 0.2));
                    gradient.addColorStop(1, getCategoryColor(n2.category, 0.2));

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawEcosystemLines);
    }
    
    // Helper to fetch colors mapped inside style.css
    function getCategoryColor(category, alpha = 1) {
        switch (category) {
            case 'frontend': return `rgba(0, 240, 255, ${alpha})`;
            case 'backend': return `rgba(157, 78, 221, ${alpha})`;
            case 'mobile': return `rgba(255, 0, 85, ${alpha})`;
            case 'database': return `rgba(57, 255, 20, ${alpha})`;
            default: return `rgba(255, 255, 255, ${alpha})`;
        }
    }

    drawEcosystemLines();

    // Filter engine
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Toggle active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply opacity styles based on category match
            nodes.forEach(node => {
                const category = node.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    node.style.opacity = '1';
                    node.style.transform = 'scale(1)';
                    node.style.pointerEvents = 'auto';
                } else {
                    node.style.opacity = '0.15';
                    node.style.transform = 'scale(0.85)';
                    node.style.pointerEvents = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   TESTIMONIAL CAROUSEL ENGINE (Swipeable and Dot-navigation)
   ========================================================================== */
function initTestimonialSlider() {
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');

    if (!track || slides.length === 0) return;

    let currentIdx = 0;
    const slideCount = slides.length;

    // Dynamically spawn dot indicators
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateTrack() {
        track.style.transform = `translateX(-${currentIdx * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIdx);
        });
    }

    function goToSlide(idx) {
        currentIdx = idx;
        updateTrack();
    }

    function nextSlide() {
        currentIdx = (currentIdx + 1) % slideCount;
        updateTrack();
    }

    function prevSlide() {
        currentIdx = (currentIdx - 1 + slideCount) % slideCount;
        updateTrack();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Support mobile touch events
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (startX - endX > swipeThreshold) {
            nextSlide(); // Swiped left
        } else if (endX - startX > swipeThreshold) {
            prevSlide(); // Swiped right
        }
    }
}

/* ==========================================================================
   INTERACTIVE CARDS MAGNETIC CURSOR GLOWS
   ========================================================================== */
function initInteractiveGlows() {
    const glowCards = document.querySelectorAll('.magnetic-glow-card');
    glowCards.forEach(card => {
        const glow = card.querySelector('.card-glow-element');
        if (!glow) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        });
    });
}

/* ==========================================================================
   MAGNETIC INTERACTION COEFFICIENT
   ========================================================================== */
function initMagneticElements() {
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(el => {
        const child = el.querySelector('span') || el;
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Relative coordinates from center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Animate wrapper element pull towards coordinate
            gsap.to(el, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Animate text/inner elements faster to create split depth
            gsap.to(child, {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to([el, child], {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1.1, 0.4)'
            });
        });
    });
}

/* ==========================================================================
   RESPONSIVE NAVBAR AND HAMBURGER TOGGLING
   ========================================================================== */
function initNavbarToggle() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
        
        // Disable scroll when mobile menu is open
        if (menu.classList.contains('active')) {
            if (lenis) lenis.stop();
        } else {
            if (lenis) lenis.start();
        }
    });

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            if (lenis) lenis.start();

            // Intercept link for smooth anchor scroll
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl && lenis) {
                    lenis.scrollTo(targetEl, {
                        offset: -80, // Offset for navbar header
                        duration: 1.2
                    });
                }
            }
        });
    });
}
