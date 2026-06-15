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
        initTeamOperatingCore();
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
/* ==========================================================================
   TEAM OPERATING CORE INTERACTIVE ENGINE
   ========================================================================== */
function initTeamOperatingCore() {
    const container = document.querySelector('.cinematic-stage-container');
    const nodes = document.querySelectorAll('.cinematic-node');
    const centerMember = document.getElementById('cinematic-center-member');
    const centerPortraits = centerMember ? centerMember.querySelectorAll('.center-portrait-wrapper') : [];
    const infoPanel = document.getElementById('cinematic-info-panel');
    const infoWrappers = infoPanel ? infoPanel.querySelectorAll('.info-content-wrapper') : [];
    
    if (!container || !infoPanel || nodes.length === 0) return;
    
    const teamData = {
        siddhi: {
            name: "Siddhi Kawade",
            role: "Frontend Engineering & User Experience",
            experience: "2 Years Experience",
            img: "assets/team/siddhi-k.png",
            connections: ["vishwanath"]
        },
        vishwanath: {
            name: "Vishwanath Hatti",
            role: "Full-Stack Development & Platform Architecture",
            experience: "4 Years Experience",
            img: "assets/team/vishwanath-hatti.png",
            connections: ["siddhi", "prathmesh"]
        },
        prathmesh: {
            name: "Prathmesh Ghatmal",
            role: "Product Engineering & Technology Strategy",
            experience: "4 Years Experience",
            img: "assets/team/prathmesh.png",
            connections: ["vishwanath", "anish"]
        },
        anish: {
            name: "Anish",
            role: "AI/ML Engineering & Automation",
            experience: "4 Years Experience",
            img: "assets/team/anish.png",
            connections: ["prathmesh", "anurag"]
        },
        anurag: {
            name: "Anurag Kumar Goutam",
            role: "AI/ML Engineering & Intelligent Systems",
            experience: "3 Years Experience",
            img: "assets/team/anurag-team.png",
            connections: ["anish", "datta"]
        },
        datta: {
            name: "Datta Panchal",
            role: "Full-Stack Systems Engineering",
            experience: "3 Years Experience",
            img: "assets/team/datta-team.png",
            connections: ["anurag", "siddhi"]
        }
    };

    // Pre-map stacked DOM elements for O(1) loop lookups
    const infoWrappersMap = {};
    infoWrappers.forEach(el => {
        infoWrappersMap[el.getAttribute('data-member')] = el;
    });

    // Dynamically inject Connected Specialists buttons inside info wrappers
    infoWrappers.forEach(infoEl => {
        const key = infoEl.getAttribute('data-member');
        const data = teamData[key];
        if (data && data.connections) {
            let connSection = document.createElement('div');
            connSection.className = 'panel-profile-related';
            
            let label = document.createElement('span');
            label.className = 'related-label';
            label.innerHTML = `<i data-lucide="link" class="related-icon"></i> CONNECTED`;
            connSection.appendChild(label);
            
            let list = document.createElement('div');
            list.className = 'related-buttons';
            
            data.connections.forEach(connKey => {
                const connData = teamData[connKey];
                if (connData) {
                    let btn = document.createElement('button');
                    btn.className = 'btn-related';
                    btn.setAttribute('data-target', connKey);
                    btn.innerHTML = `${connData.name.split(' ')[0]} <i data-lucide="arrow-right" class="btn-icon"></i>`;
                    
                    // Clicking a connection button snaps the orbit to that node (top-center, theta = 3 * Math.PI / 2)
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const targetIndex = Array.from(nodes).findIndex(node => node.getAttribute('data-member') === connKey);
                        if (targetIndex !== -1) {
                            isUserInteracting = true;
                            prevActiveIndex = activeNodeIndex;
                            activeNodeIndex = targetIndex;
                            if (autoRotateTimeout) clearTimeout(autoRotateTimeout);

                            // Snap to top-center position (theta = 3 * Math.PI / 2)
                            const target = (3 * Math.PI / 2) - (targetIndex * 2 * Math.PI / numNodes);
                            let diff = target - angle;
                            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
                            targetAngle = angle + diff;
                        }
                    });
                    list.appendChild(btn);
                }
            });
            connSection.appendChild(list);
            infoEl.appendChild(connSection);
        }
    });
    // Re-trigger Lucide icons rendering for the new connection icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const numNodes = nodes.length;
    let angle = 0; // Current base rotation angle (radians)
    let targetAngle = null; // Target angle when snapping to a node
    let isUserInteracting = false;
    let activeNodeIndex = -1; // Track active node index (-1 means none)
    let speedMultiplier = 1.0; // Slow rotation damping multiplier
    let autoRotateTimeout = null;
    let lastActiveIndex = -1;
    let prevActiveIndex = -1;
    let animationFrameId = null;

    let cx = 0, cy = 0, rx = 0, ry = 95;
    const nodeWidth = 100;
    const nodeHeight = 100;

    function updateDimensions() {
        const rect = container.getBoundingClientRect();
        cx = rect.width / 2;
        // Perfect visual centering vertically (orbit center matches stage center)
        cy = rect.height / 2;
        // Perfect circle of radius 240px on desktop (20% size increase), scaling down on smaller screens
        const maxRadius = Math.min(rect.width * 0.38, 240);
        rx = maxRadius;
        ry = maxRadius;

        // Sync rings dimensions with the exact mathematical ellipse
        const ring1 = container.querySelector('.ring-1');
        const ring2 = container.querySelector('.ring-2');
        if (ring1) {
            ring1.style.width = `${rx * 2}px`;
            ring1.style.height = `${ry * 2}px`;
            ring1.style.top = `${cy}px`;
            ring1.style.left = `${cx}px`;
        }
        if (ring2) {
            ring2.style.width = `${rx * 2.2}px`;
            ring2.style.height = `${ry * 2.2}px`;
            ring2.style.top = `${cy}px`;
            ring2.style.left = `${cx}px`;
        }

        // Sync the vertical connector line connecting the center card to the active top-center node
        const connector = container.querySelector('.cinematic-connector-line');
        if (connector) {
            connector.style.height = `${ry}px`;
            connector.style.top = `${cy - ry}px`;
            connector.style.left = `${cx}px`;
        }
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    function tick() {
        if (window.innerWidth <= 768) {
            // Mobile Mode: clear all inline styles and stop the loop calculations
            nodes.forEach(node => {
                node.removeAttribute('style');
                node.classList.remove('active-preview');
            });
            infoWrappers.forEach(el => el.removeAttribute('style'));
            animationFrameId = requestAnimationFrame(tick);
            return;
        }

        // Damping speed to 0.0 when active node is selected to stop auto rotation
        const targetMultiplier = activeNodeIndex !== -1 ? 0.0 : 1.0;
        speedMultiplier += (targetMultiplier - speedMultiplier) * 0.05;

        // LERP / Physics logic
        if (isUserInteracting && targetAngle !== null) {
            const diff = targetAngle - angle;
            angle += diff * 0.035; // softened LERP snap physics

            if (Math.abs(diff) < 0.001) {
                angle = targetAngle;
                targetAngle = null;
            }
        } else {
            // Premium, luxury-tech auto rotation (one full rotation every ~35 seconds)
            angle += 0.003 * speedMultiplier;
        }

        let activeIndex = activeNodeIndex;

        // Trigger updates if the active node changes
        if (activeIndex !== -1 && activeIndex !== lastActiveIndex) {
            prevActiveIndex = lastActiveIndex;
            lastActiveIndex = activeIndex;

            const activeKey = nodes[activeIndex].getAttribute('data-member');
            infoPanel.setAttribute('data-active', activeKey);
        }

        // Compute transition factor t based on angular distance of the active node from top-center
        let t = 0;
        if (activeIndex !== -1) {
            const theta = angle + (activeIndex * 2 * Math.PI / numNodes);
            let diff = theta - (3 * Math.PI / 2);
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            const minDist = Math.abs(diff);
            const transitionZone = Math.PI / 3; // 60 degrees transition zone
            if (minDist < transitionZone) {
                t = 1 - (minDist / transitionZone);
                t = t * t * (3 - 2 * t); // Easing curve
            }
        }

        // Update central pulsing core and connector line visibility
        const centralCore = container.querySelector('#cinematic-central-core');
        const connectorLine = container.querySelector('.cinematic-connector-line');

        if (activeIndex === -1) {
            if (centralCore) centralCore.style.opacity = 1;
            if (connectorLine) connectorLine.style.opacity = 0;
            infoPanel.style.opacity = 0;
            infoPanel.style.pointerEvents = 'none';
        } else {
            if (centralCore) centralCore.style.opacity = 1 - t;
            if (connectorLine) connectorLine.style.opacity = t;
            infoPanel.style.opacity = t;
            infoPanel.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
        }

        nodes.forEach((node, index) => {
            const key = node.getAttribute('data-member');
            const info = infoWrappersMap[key];

            const theta = angle + (index * 2 * Math.PI / numNodes);
            const x = cx + rx * Math.cos(theta);
            const y = cy + ry * Math.sin(theta);
            
            // Depth coordinate [-1, 1]. Inverting sin(theta) puts top-center (3 * PI / 2) at z = 1 (foreground)
            const z = -Math.sin(theta); 

            // Z-indexing: Active top-center node has z = 1, sits closest to the front
            const nodeZIndex = z > 0 ? Math.round(z * 95) + 105 : Math.round((z + 1) * 45) + 10;

            const normZ = (z + 1) / 2; // Normalize [-1, 1] to [0, 1]
            
            // Base scale from depth (range: 0.76 at back to 0.80 at front)
            let nodeScale = 0.76 + 0.04 * normZ;
            
            // Apply scale swelling boost (up to 1.0x) as the node approaches active top-center position
            if (activeIndex !== -1) {
                if (index === activeIndex) {
                    nodeScale = nodeScale + 0.2 * t; // Active is 1.0x (exactly 25% larger than 0.80x inactive nodes)
                    node.classList.add('active-preview');
                } else if (index === prevActiveIndex) {
                    nodeScale = nodeScale + 0.2 * (1 - t);
                    node.classList.remove('active-preview');
                } else {
                    node.classList.remove('active-preview');
                }
            } else {
                node.classList.remove('active-preview');
            }

            // Inactive nodes fade out when a node is selected, else they stay fully visible
            const baseOpacity = activeIndex !== -1
                ? (index === activeIndex ? (0.55 + 0.1 * normZ) + 0.35 * t : (0.45 + 0.15 * normZ) * (1 - 0.25 * t))
                : 0.55 + 0.15 * normZ;
            const blurVal = activeIndex !== -1
                ? (index === activeIndex ? (1.0 * (1 - normZ)) * (1 - t) : 1.0 * (1 - normZ) + 0.2 + 0.8 * t)
                : 1.0 * (1 - normZ);
            const grayscaleVal = activeIndex !== -1
                ? (index === activeIndex ? (0.3 * (1 - normZ)) * (1 - t) : 0.3 * (1 - normZ) + 0.1 + 0.4 * t)
                : 0.3 * (1 - normZ);

            node.style.transform = `translate3d(${x - nodeWidth / 2}px, ${y - nodeHeight / 2}px, 0) scale(${nodeScale})`;
            node.style.zIndex = nodeZIndex;
            node.style.opacity = baseOpacity;
            node.style.filter = `blur(${blurVal}px) grayscale(${grayscaleVal})`;

            // Info panel cross-fade & translation slide
            if (info) {
                if (activeIndex !== -1 && index === activeIndex) {
                    info.style.opacity = t;
                    info.style.transform = `translate(-50%, -50%) translateY(${(1 - t) * 12}px)`;
                    info.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
                    info.classList.add('active');
                    info.classList.remove('outgoing');
                } else if (activeIndex !== -1 && index === prevActiveIndex) {
                    info.style.opacity = 1 - t;
                    info.style.transform = `translate(-50%, -50%) translateY(${t * -12}px)`;
                    info.style.pointerEvents = 'none';
                    info.classList.remove('active');
                    info.classList.add('outgoing');
                } else {
                    info.style.opacity = 0;
                    info.style.transform = 'translate(-50%, -50%) translateY(15px)';
                    info.style.pointerEvents = 'none';
                    info.classList.remove('active');
                    info.classList.remove('outgoing');
                }
            }
        });

        animationFrameId = requestAnimationFrame(tick);
    }

    // Background click resets selection and resumes auto-rotation
    container.addEventListener('click', (e) => {
        if (e.target === container || e.target.classList.contains('cinematic-orbit-ring') || e.target.classList.contains('cinematic-connector-line')) {
            prevActiveIndex = activeNodeIndex;
            activeNodeIndex = -1;
            isUserInteracting = false;
            targetAngle = null;
            if (autoRotateTimeout) clearTimeout(autoRotateTimeout);
        }
    });

    // Bind event listeners for desktop orbit interaction
    nodes.forEach((node, index) => {
        const toggleNodeActive = () => {
            if (window.innerWidth <= 768) return;

            if (activeNodeIndex === index) {
                // Clicking the already active node collapses it
                prevActiveIndex = activeNodeIndex;
                activeNodeIndex = -1;
                isUserInteracting = false;
                targetAngle = null;
                if (autoRotateTimeout) clearTimeout(autoRotateTimeout);
            } else {
                // Clicking an inactive node expands it and centers it
                isUserInteracting = true;
                prevActiveIndex = activeNodeIndex;
                activeNodeIndex = index;
                if (autoRotateTimeout) clearTimeout(autoRotateTimeout);

                // Calculate target angle to bring this node to the top-center (theta = 3 * Math.PI / 2)
                const target = (3 * Math.PI / 2) - (index * 2 * Math.PI / numNodes);

                // Shortest angle path interpolation
                let diff = target - angle;
                diff = Math.atan2(Math.sin(diff), Math.cos(diff));
                targetAngle = angle + diff;
            }
        };

        node.addEventListener('click', toggleNodeActive);
    });

    animationFrameId = requestAnimationFrame(tick);
}
