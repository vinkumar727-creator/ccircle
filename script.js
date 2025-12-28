/**
 * Chakhna Circle - Landing Page JavaScript
 * Handles age verification, navigation, and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const ageModal = document.getElementById('age-modal');
    const underageMessage = document.getElementById('underage-message');
    const mainContent = document.getElementById('main-content');
    const ageYesBtn = document.getElementById('age-yes');
    const ageNoBtn = document.getElementById('age-no');
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const waitlistForm = document.getElementById('waitlist-form');

    // Check if user has already verified age
    const ageVerified = sessionStorage.getItem('ageVerified');
    
    if (ageVerified === 'true') {
        showMainContent();
    } else if (ageVerified === 'false') {
        showUnderageMessage();
    }

    // Age verification handlers
    ageYesBtn.addEventListener('click', () => {
        sessionStorage.setItem('ageVerified', 'true');
        showMainContent();
    });

    ageNoBtn.addEventListener('click', () => {
        sessionStorage.setItem('ageVerified', 'false');
        showUnderageMessage();
    });

    function showMainContent() {
        ageModal.classList.add('hidden');
        underageMessage.classList.add('hidden');
        mainContent.classList.remove('hidden');
        initAnimations();
    }

    function showUnderageMessage() {
        ageModal.classList.add('hidden');
        mainContent.classList.add('hidden');
        underageMessage.classList.remove('hidden');
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Waitlist form submission
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = waitlistForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Show success feedback
            const btn = waitlistForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Thank You!';
            btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            // Reset form
            emailInput.value = '';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
            
            console.log('Waitlist signup:', email);
        });
    }

    // Scroll-triggered animations
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for elements in groups
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // Initialize animations if content is already visible
    if (!mainContent.classList.contains('hidden')) {
        initAnimations();
        initCountdown();
    }

    // Countdown Timer
    function initCountdown() {
        const launchDate = new Date('February 1, 2026 00:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = launchDate - now;
            
            // Elements might not exist if previous HTML step failed
            const elDays = document.getElementById('days');
            if (!elDays) return;

            if (distance < 0) {
                document.getElementById('days').textContent = '000';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(days).padStart(3, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Tier Benefits Interaction
    const tierData = {
        silver: {
            title: "Silver Circle Benefits",
            benefits: ["Access to Mobile Units", "1 Live Show / Month", "Community Access", "Standard Reservations"]
        },
        gold: {
            title: "Gold Circle Benefits",
            benefits: ["Lounge Access", "2 Live Shows / Month", "Priority Reservations", "Welcome Drink"]
        },
        platinum: {
            title: "Platinum Circle Benefits",
            benefits: ["Unlimited Lounge Access", "Unlimited Live Shows", "Private Event Bookings", "First Access to New Menus"]
        }
    };

    const tiers = document.querySelectorAll('.tier-teaser');
    const display = document.getElementById('tier-benefits-display');

    if (display) {
        function updateDisplay(tier) {
            const data = tierData[tier];
            if (!data) return;
            
            tiers.forEach(t => t.classList.remove('active'));
            const activeTier = document.querySelector(`.tier-teaser[data-tier="${tier}"]`);
            if(activeTier) activeTier.classList.add('active');

            display.innerHTML = `
                <div class="tier-detail-content">
                    <h3 class="tier-detail-title">${data.title}</h3>
                    <ul class="tier-detail-list">
                        ${data.benefits.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        tiers.forEach(t => {
            t.addEventListener('mouseenter', () => {
                const tier = t.getAttribute('data-tier');
                if(tier) updateDisplay(tier);
            });
            
            t.addEventListener('click', () => {
                const tier = t.getAttribute('data-tier');
                if(tier) updateDisplay(tier);
            });
        });

        // Set default selection
        updateDisplay('gold');
    }
});

// Golden Embers Particle System with Scroll Interaction
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let scrollSpeed = 0;
    let lastScrollY = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.baseVx = (Math.random() - 0.5) * 0.2;
            this.baseVy = -Math.random() * 0.6 - 0.2; // Base slow upward
            this.vx = this.baseVx;
            this.vy = this.baseVy;
            this.size = Math.random() * 3 + 1;
            this.alpha = Math.random() * 0.5 + 0.4;
            this.fadeSpeed = Math.random() * 0.0002 + 0.00005;
            this.color = Math.random() > 0.5 ? '212, 168, 79' : '139, 69, 19';
        }

        update() {
            // Apply scroll influence to velocity
            this.vy = this.baseVy - scrollSpeed * 0.1;
            this.vx = this.baseVx + (Math.random() - 0.5) * Math.abs(scrollSpeed) * 0.05;

            this.x += this.vx;
            this.y += this.vy;
            
            // Fade based on height
            if (this.y < height * 0.2) {
                 this.alpha -= 0.003;
            } else {
                 this.alpha -= this.fadeSpeed;
            }

            // Sway effect
            this.x += Math.sin(this.y * 0.005) * 0.05;

            // Reset if off screen or faded
            if (this.alpha <= 0 || this.y < -10 || this.y > height + 50) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
            
            // Subtle glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${this.color}, 0.5)`;
        }
    }

    function init() {
        resize();
        particles = [];
        const particleCount = window.innerWidth < 600 ? 50 : 100;
        for (let i = 0; i < particleCount; i++) {
            const p = new Particle();
            p.y = Math.random() * height;
            particles.push(p);
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Decay scroll speed over time for smooth effect
        scrollSpeed *= 0.95;
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    // Scroll listener to capture scroll speed
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollSpeed = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
    });

    window.addEventListener('resize', () => {
        resize();
        init();
    });

    init();
})();

