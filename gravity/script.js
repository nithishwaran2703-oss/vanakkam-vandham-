document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Animation
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 1500);
        }
        triggerHeroAnimations();
    }, 2000);

    // 2. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Use requestAnimationFrame for follower to avoid jank
        requestAnimationFrame(() => {
            // A bit of lag for the follower
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });
    });

    // Hover states for cursor
    const interactiveSelectors = 'a, button, .gallery-card, .accordion-header, .filter-btn, .close-modal, .floating-wa';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorFollower.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorFollower.classList.remove('hovered');
        });
    });

    // 3. Magnetic Buttons
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const strength = this.getAttribute('data-strength') || 20;
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x / rect.width * strength}px, ${y / rect.height * strength}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. Hero Animations (Triggered after loader)
    function triggerHeroAnimations() {
        const lineContents = document.querySelectorAll('.line-content');
        lineContents.forEach((el, index) => {
            setTimeout(() => el.classList.add('visible'), index * 200 + 300);
        });

        const fadeUps = document.querySelectorAll('.hero-content .reveal-text');
        fadeUps.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200 + 900);
        });
    }

    // 5. Scroll Animations & Counters
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2500;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.ceil(current) + (target === 100 ? '' : '+');
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target + (target === 100 ? '' : '+');
            }
        };
        updateCounter();
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counters
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    if(!counter.classList.contains('counted')) {
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => scrollObserver.observe(el));

    // 6. 3D Tilt Effect on Gallery Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        const inner = card.querySelector('.card-inner');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    });

    // 7. Parallax Image inside Cards on Scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Navbar
        const navbar = document.querySelector('.navbar');
        if (scrolled > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        
        // Image Parallax
        document.querySelectorAll('.parallax-img').forEach(img => {
            const parent = img.parentElement.parentElement; // tilt-card
            const rect = parent.getBoundingClientRect();
            
            // If card is in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yOffset = (rect.top / window.innerHeight) * 10; // Move up to 10%
                img.style.transform = `translateY(${yOffset}%)`;
            }
        });
    });

    // Hero Parallax on mouse move
    const hero = document.querySelector('.hero');
    const heroBgImg = document.querySelector('.hero .bg-img');
    if (hero && heroBgImg) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            requestAnimationFrame(() => {
                heroBgImg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
            });
        });
        hero.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => heroBgImg.style.transform = `scale(1.1) translate(0px, 0px)`);
        });
    }

    // 8. Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => card.style.display = 'none', 400);
                }
            });
            // Re-trigger scroll observer to ensure visible ones show
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        });
    });

    // 9. Accordion Services
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = acc.classList.contains('active');
            accordions.forEach(other => other.classList.remove('active'));
            if (!isActive) acc.classList.add('active');
        });
    });

    // 9b. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(other => other.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // 10. Modal Stylist
    const modal = document.getElementById('stylistModal');
    const openBtn = document.getElementById('openStylist');
    const closeBtn = document.querySelector('.close-modal');
    const genBtn = document.getElementById('generateBtn');
    const modalBody = document.getElementById('modalBody');

    openBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });

    genBtn.addEventListener('click', () => {
        genBtn.innerText = "Generating Magic...";
        setTimeout(() => {
            modalBody.innerHTML = `
                <div style="background: rgba(212,175,55,0.1); padding: 25px; border-radius: 20px; border: 1px solid var(--accent-gold); transform: scale(0.9); opacity: 0; animation: popIn 0.5s forwards cubic-bezier(0.16, 1, 0.3, 1);">
                    <h4 style="color: var(--primary-maroon); font-family: var(--font-serif); margin-bottom: 15px; font-size: 1.4rem;">Our Vision For You:</h4>
                    <p style="color: var(--text-dark); line-height: 1.8; font-size: 1.05rem;">Based on your unique inputs, we envision a spectacular open-air setup featuring lush marigold and jasmine drapes intertwining with geometric golden mandap pillars. We will enhance the ambiance with warm ambient uplighting and traditional brass diyas lining the walkway to create an unforgettable, majestic aura.</p>
                </div>
                <button class="btn-primary magnetic" data-strength="20" style="width: 100%; margin-top: 25px; padding: 1.2rem;" onclick="window.open('https://wa.me/919788742627', '_blank')">Discuss with Team on WhatsApp</button>
            `;
            // Add keyframes for popIn dynamically
            if (!document.getElementById('popInStyles')) {
                const style = document.createElement('style');
                style.id = 'popInStyles';
                style.innerHTML = `@keyframes popIn { to { transform: scale(1); opacity: 1; } }`;
                document.head.appendChild(style);
            }
            
            // Re-bind magnetics for new button
            const newMag = modalBody.querySelector('.magnetic');
            if(newMag) {
                newMag.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const strength = this.getAttribute('data-strength') || 20;
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    this.style.transform = `translate(${x / rect.width * strength}px, ${y / rect.height * strength}px)`;
                });
                newMag.addEventListener('mouseleave', function() {
                    this.style.transform = `translate(0px, 0px)`;
                });
            }
        }, 1800);
    });

    // 11. Canvas Particle System
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedY = Math.random() * 0.5 + 0.2;
                this.speedX = (Math.random() - 0.5) * 0.4;
                // Mix of gold and maroon hues
                const isGold = Math.random() > 0.3;
                this.color = isGold ? `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2})` : `rgba(128, 0, 0, ${Math.random() * 0.3 + 0.1})`;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                // Gentle sway
                this.x += Math.sin(this.y * 0.01) * 0.5;

                if (this.y > h) {
                    this.y = -10;
                    this.x = Math.random() * w;
                }
                if (this.x > w || this.x < 0) {
                    this.speedX *= -1;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = window.innerWidth < 768 ? 40 : 100;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();

        const animateParticles = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }
});
