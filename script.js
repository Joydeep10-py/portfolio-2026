document.addEventListener('DOMContentLoaded', () => {
    // ==================== DOM ELEMENTS ====================
    const preloader = document.getElementById('preloader');
    const preloaderProgress = document.getElementById('preloaderProgress');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const revealElements = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.stat-number');
    const skillFills = document.querySelectorAll('.skill-fill');
    const contactForm = document.getElementById('contactForm');
    const backToTop = document.getElementById('backToTop');
    const fabBackToTop = document.getElementById('fabBackToTop');
    const typewriterElement = document.getElementById('typewriter');
    const scrollProgress = document.getElementById('scrollProgress');
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const projectFilters = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const tiltCards = document.querySelectorAll('.tilt-card');
    const magneticElements = document.querySelectorAll('.magnetic');

    // ==================== PRELOADER ====================
    let progress = 0;
    const preloaderInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(preloaderInterval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                initAnimations();
            }, 400);
        }
        preloaderProgress.style.width = progress + '%';
    }, 100);

    // ==================== THEME TOGGLE ====================
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }

    themeToggle?.addEventListener('click', toggleTheme);
    themeToggleMobile?.addEventListener('click', toggleTheme);

    // ==================== CUSTOM CURSOR ====================
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover states
    const hoverTargets = document.querySelectorAll('a, button, .magnetic, input, textarea, .filter-btn');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    // ==================== MAGNETIC EFFECT ====================
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (!isTouchDevice) {
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    // ==================== 3D TILT EFFECT ====================
    if (!isTouchDevice) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
                card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
            });
        });
    }

    // ==================== SCROLL PROGRESS ====================
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        scrollProgress.style.transform = `scaleX(${progress})`;
    }

    // ==================== MOBILE MENU ====================
    function openMobileMenu() {
        menuToggle.classList.add('active');
        sidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileOverlay.addEventListener('click', closeMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // ==================== SMOOTH SCROLLING ====================
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 20;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ==================== ACTIVE SIDEBAR ON SCROLL ====================
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        if (scrollPos < sections[0].offsetTop - 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('a[href="#home"]')?.classList.add('active');
        }
    }

    window.addEventListener('scroll', () => {
        updateActiveNav();
        updateScrollProgress();
    });

    // ==================== SCROLL REVEAL ANIMATIONS ====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                    
                    const counter = entry.target.querySelector('.stat-number');
                    if (counter && !counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateCounter(counter);
                    }
                    
                    const skillBar = entry.target.querySelector('.skill-fill');
                    if (skillBar) {
                        setTimeout(() => skillBar.classList.add('active'), 300);
                        animateSkillBar(skillBar);
                    }
                }, index * 100);
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const skillsBarsSection = document.querySelector('.skills-bars');
    if (skillsBarsSection) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fills = entry.target.querySelectorAll('.skill-fill');
                    fills.forEach((fill, index) => {
                        setTimeout(() => {
                            fill.classList.add('active');
                            animateSkillBar(fill);
                        }, index * 150);
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        skillObserver.observe(skillsBarsSection);
    }

    // ==================== COUNTER ANIMATION ====================
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeOut * target);
            counter.textContent = currentValue;
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    }

    const statCards = document.querySelectorAll('.stat-card');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.stat-number');
                if (counter && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    animateCounter(counter);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statCards.forEach(card => counterObserver.observe(card));

    // ==================== SKILL BAR ANIMATION ====================
    function animateSkillBar(fill) {
        const width = fill.getAttribute('data-width');
        if (width) {
            setTimeout(() => {
                fill.style.width = width + '%';
            }, 200);
        }
    }

    // ==================== TYPING EFFECT ====================
    const typeStrings = [
        "Machine Learning Engineer",
        "Data Scientist",
        "AI Developer",
        "Problem Solver"
    ];
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeWriter() {
        if (!typewriterElement) return;
        const currentString = typeStrings[stringIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentString.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentString.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentString.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % typeStrings.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // ==================== PROJECT FILTERING ====================
    projectFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            projectFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = '';
                    }, index * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==================== CONTACT FORM ====================
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isValid = true;
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('error'));

            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                nameInput.closest('.form-group').classList.add('error');
                isValid = false;
            }

            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.closest('.form-group').classList.add('error');
                isValid = false;
            }

            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                messageInput.closest('.form-group').classList.add('error');
                isValid = false;
            }

            if (!isValid) return;

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="btn-text">Sending...</span>';
            btn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    btn.innerHTML = '<span class="btn-text">Message Sent!</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                    btn.style.background = '#22c55e';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 4000);
                } else {
                    throw new Error('Failed');
                }
            } catch (err) {
                btn.innerHTML = '<span class="btn-text">Failed. Try again.</span>';
                btn.style.background = '#ef4444';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });

        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.closest('.form-group').classList.remove('error');
            });
        });
    }

    // ==================== BACK TO TOP ====================
    function toggleBackToTop() {
        const show = window.scrollY > 600;
        backToTop.style.opacity = show ? '1' : '0';
        backToTop.style.pointerEvents = show ? 'all' : 'none';
        
        if (show) {
            fabBackToTop.classList.add('visible');
        } else {
            fabBackToTop.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    backToTop.addEventListener('click', scrollToTop);
    fabBackToTop.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();

    // ==================== PARALLAX EFFECT ====================
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        if (heroBg && window.innerWidth > 768) {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // ==================== PARTICLE CANVAS ====================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 138, 87, 0.4)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[j].x - p.x;
                    const dy = particles[j].y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 138, 87, ${0.15 * (1 - dist / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });
            
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==================== INITIAL ANIMATIONS ====================
    function initAnimations() {
        const heroReveals = document.querySelectorAll('.hero .reveal');
        heroReveals.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, 200 + (index * 150));
        });
        
        setTimeout(typeWriter, 1000);
    }

    // ==================== PERFORMANCE ====================
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateActiveNav();
            resizeCanvas?.();
        }, 250);
    });

    console.log('%c Joydeep Samanta Portfolio ', 'background: linear-gradient(135deg, #FF8A57, #FF6B9D); color: #070B14; font-size: 20px; font-weight: bold; padding: 12px 24px; border-radius: 12px;');
    console.log('%c Built with passion using pure HTML, CSS & JavaScript ', 'color: #FF8A57; font-size: 12px;');
});