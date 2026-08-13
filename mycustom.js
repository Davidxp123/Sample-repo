/**
 * ==========================================
 * AuraConsult - Advanced Interaction Engine
 * ==========================================
 * Enhanced with particle effects, advanced animations,
 * dynamic modals, smooth scrolling, and full interactivity
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // DEVICE DETECTION
    // ==========================================
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth <= 768;

    // ==========================================
    // PARTICLE CANVAS BACKGROUND
    // ==========================================
    const particleCanvas = document.getElementById('particle-canvas');
    
    if (particleCanvas && !isMobile) {
        const ctx = particleCanvas.getContext('2d');
        let particlesArray = [];
        let animationId;

        // Set canvas size
        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > particleCanvas.width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y > particleCanvas.height || this.y < 0) {
                    this.speedY = -this.speedY;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        function initParticles() {
            particlesArray = [];
            const numberOfParticles = Math.floor((particleCanvas.width * particleCanvas.height) / 15000);
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        // Animate particles
        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Connect nearby particles
            for (let i = 0; i < particlesArray.length; i++) {
                for (let j = i + 1; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animateParticles();
            }
        });
    }

    // ==========================================
    // MOBILE HAMBURGER MENU
    // ==========================================
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            
            // Animate hamburger lines
            const spans = mobileBtn.querySelectorAll('span');
            if (isActive) {
                spans[0].style.transform = 'rotate(45deg) translate(9px, 9px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(9px, -9px)';
                body.style.overflow = 'hidden';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                body.style.overflow = '';
            }
        });

        // Close menu when link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const spans = mobileBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                const spans = mobileBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                body.style.overflow = '';
            }
        });
    }

    // ==========================================
    // TOAST NOTIFICATION SYSTEM
    // ==========================================
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toast-close');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');

    function showToast(title, message, duration = 4000) {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            hideToast();
        }, duration);
    }

    function hideToast() {
        toast.classList.remove('show');
    }

    if (toastClose) {
        toastClose.addEventListener('click', hideToast);
    }

    // ==========================================
    // INTERACTIVE GLOBAL MODAL
    // ==========================================
    const modal = document.getElementById('global-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalIcon = document.getElementById('modal-icon');
    const modalForm = document.getElementById('modal-form');
    const modalSuccess = document.getElementById('modal-success');
    const triggerButtons = document.querySelectorAll('.trigger-modal');

    // Modal icons based on action type
    const modalIcons = {
        'Login': '🔐',
        'Sign Up': '🚀',
        'Start Free Trial': '🎯',
        'Book Demo': '📅',
        'Contact Sales': '💼',
        'Subscribe': '💳',
        'Video': '▶️',
        'Case Study': '📊',
        'Integration': '🔗',
        'default': '✨'
    };

    // Open Modal
    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const actionType = btn.getAttribute('data-action') || 'Action';
            const customIcon = btn.getAttribute('data-icon');
            
            // Set modal icon
            if (customIcon) {
                modalIcon.textContent = customIcon;
            } else {
                // Find matching icon
                let icon = modalIcons.default;
                for (let key in modalIcons) {
                    if (actionType.includes(key)) {
                        icon = modalIcons[key];
                        break;
                    }
                }
                modalIcon.textContent = icon;
            }
            
            // Set modal content
            modalTitle.textContent = actionType;
            
            // Customize description based on action
            if (actionType.includes('Trial') || actionType.includes('Sign Up')) {
                modalDesc.textContent = 'Start your 14-day free trial today. No credit card required. Get instant access to all premium features.';
            } else if (actionType.includes('Demo')) {
                modalDesc.textContent = 'Schedule a personalized demo with our team. We\'ll show you how AuraConsult can transform your consulting business.';
            } else if (actionType.includes('Sales')) {
                modalDesc.textContent = 'Connect with our enterprise sales team to discuss custom solutions for your organization.';
            } else if (actionType.includes('Video')) {
                modalDesc.textContent = 'Watch this inspiring success story from one of our clients. See how they achieved remarkable results.';
            } else if (actionType.includes('Case Study')) {
                modalDesc.textContent = 'Explore detailed insights into how this company leveraged AuraConsult to achieve 10x growth.';
            } else {
                modalDesc.textContent = 'Fill out the form below and our team will get back to you within 24 hours.';
            }
            
            // Reset form
            modalForm.style.display = 'flex';
            modalSuccess.classList.remove('show');
            modalForm.reset();
            
            modal.classList.add('active');
            body.style.overflow = 'hidden';
            
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const spans = mobileBtn.querySelectorAll('span');
                spans.forEach(span => span.style.transform = 'none');
            }

            // Show toast notification
            showToast('Modal Opened', `Opening: ${actionType}`, 2000);
        });
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        body.style.overflow = '';
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle Modal Form Submission
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = modalForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Hide form, show success
                modalForm.style.display = 'none';
                modalSuccess.classList.add('show');
                
                // Reset button
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;

                // Show toast
                showToast('Success!', 'Your request has been submitted successfully.', 3000);

                // Auto close after 3 seconds
                setTimeout(() => {
                    closeModal();
                }, 3000);
            }, 2000);
        });
    }

    // ==========================================
    // NEWSLETTER FORM
    // ==========================================
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            showToast('Subscribed!', `Thanks for subscribing with ${email}!`, 3000);
            newsletterForm.reset();
        });
    }

    // ==========================================
    // SMOOTH SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignore if it's just "#" or triggers modal
            if (href === '#' || this.classList.contains('trigger-modal')) {
                return;
            }
            
            e.preventDefault();
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ==========================================
    // SCROLL PROGRESS BAR & NAVBAR
    // ==========================================
    const progressBar = document.querySelector('.scroll-progress');
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    
    function updateScrollProgress() {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = Math.round((scrollPx / winHeightPx) * 100);
        
        if (progressBar) {
            progressBar.style.width = scrollPercentage + "%";
        }

        // Navbar background
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top button
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    }

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress(); // Initial call

    // Back to Top functionality
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // ANIMATED COUNTERS
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2500;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const isDecimal = target % 1 !== 0;
        const decimals = isDecimal ? 1 : 0;

        const counterInterval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = (target * easeOutProgress).toFixed(decimals);
            
            element.textContent = currentValue;

            if (frame >= totalFrames) {
                clearInterval(counterInterval);
                element.textContent = target.toFixed(decimals);
            }
        }, frameRate);
    }

    const statsSection = document.querySelector('.stats-section');
    
    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 3D TILT EFFECT (Desktop Only)
    // ==========================================
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const mouseX = e.clientX - rect.left - width / 2;
                const mouseY = e.clientY - rect.top - height / 2;
                
                const rotateX = (mouseY / (height / 2)) * -10;
                const rotateY = (mouseX / (width / 2)) * 10;

                let baseTransform = 'perspective(1000px)';
                
                if (card.classList.contains('dashboard-mockup')) {
                    baseTransform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                } else if (card.classList.contains('premium')) {
                    baseTransform += ` scale(1.07) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                } else {
                    baseTransform += ` scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }

                card.style.transform = baseTransform;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s ease-out';
                
                if (card.classList.contains('dashboard-mockup')) {
                    card.style.transform = 'perspective(1000px) rotateY(-15deg) rotateX(8deg)';
                } else if (card.classList.contains('premium')) {
                    card.style.transform = 'scale(1.05)';
                } else {
                    card.style.transform = 'perspective(1000px) scale(1)';
                }
                
                setTimeout(() => {
                    card.style.transition = 'transform 0.1s ease-out';
                }, 500);
            });
        });

        // Parallax effect for hero widgets
        const heroSection = document.querySelector('.hero');
        const parallaxElements = document.querySelectorAll('.parallax');
        const parallaxReverse = document.querySelectorAll('.parallax-reverse');

        if (heroSection && (parallaxElements.length > 0 || parallaxReverse.length > 0)) {
            heroSection.addEventListener('mousemove', (e) => {
                const x = (window.innerWidth - e.pageX) / 90;
                const y = (window.innerHeight - e.pageY) / 90;
                
                parallaxElements.forEach(el => {
                    el.style.transform = `translate(${x}px, ${y}px)`;
                });
                
                parallaxReverse.forEach(el => {
                    el.style.transform = `translate(-${x}px, -${y}px)`;
                });
            });
            
            heroSection.addEventListener('mouseleave', () => {
                parallaxElements.forEach(el => {
                    el.style.transform = 'translate(0px, 0px)';
                });
                parallaxReverse.forEach(el => {
                    el.style.transform = 'translate(0px, 0px)';
                });
            });
        }
    }

    // ==========================================
    // FEATURE SHOWCASE TABS
    // ==========================================
    const showcaseTabs = document.querySelectorAll('.showcase-tab');
    const showcaseItems = document.querySelectorAll('.showcase-item');

    showcaseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active from all tabs
            showcaseTabs.forEach(t => t.classList.remove('active'));
            showcaseItems.forEach(item => item.classList.remove('active'));
            
            // Add active to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.querySelector(`.showcase-item[data-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ==========================================
    // WORKFLOW DEMO TIMELINE
    // ==========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            timelineItems.forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            
            showToast('Timeline Updated', `Viewing step ${index + 1}`, 2000);
        });
    });

    // Auto-progress timeline
    if (timelineItems.length > 0) {
        let currentStep = 0;
        setInterval(() => {
            timelineItems.forEach(t => t.classList.remove('active'));
            timelineItems[currentStep].classList.add('active');
            currentStep = (currentStep + 1) % timelineItems.length;
        }, 4000);
    }

    // ==========================================
    // PRICING TOGGLE (Monthly/Annual)
    // ==========================================
    const billingToggle = document.getElementById('billing-toggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');

    if (billingToggle) {
        billingToggle.addEventListener('change', (e) => {
            const isAnnual = e.target.checked;
            
            monthlyPrices.forEach(price => {
                price.style.display = isAnnual ? 'none' : 'inline';
            });
            
            annualPrices.forEach(price => {
                price.style.display = isAnnual ? 'inline' : 'none';
            });

            showToast(
                'Billing Updated', 
                isAnnual ? 'Switched to Annual billing (Save 20%)' : 'Switched to Monthly billing',
                2000
            );
        });
    }

    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                    const answer = faq.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = null;
                    }
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                }
            });
        }
    });

    // ==========================================
    // TYPING EFFECT FOR HERO TITLE
    // ==========================================
    const typingElement = document.querySelector('.typing-effect');
    
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        typingElement.style.borderRight = '3px solid var(--primary)';
        
        let charIndex = 0;
        
        function typeText() {
            if (charIndex < text.length) {
                typingElement.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, 100);
            } else {
                // Blinking cursor effect
                setTimeout(() => {
                    typingElement.style.borderRight = 'none';
                }, 500);
            }
        }
        
        // Start typing after a delay
        setTimeout(typeText, 500);
    }

    // ==========================================
    // INTERACTIVE STAT BARS
    // ==========================================
    const statBars = document.querySelectorAll('.stat-bar-fill');
    
    if (statBars.length > 0 && statsSection) {
        const statBarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.getPropertyValue('--width');
                    bar.style.width = width;
                    statBarObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        statBars.forEach(bar => {
            bar.style.width = '0';
            statBarObserver.observe(bar);
        });
    }

    // ==========================================
    // COMPANY LOGO INTERACTIONS
    // ==========================================
    const companyLogos = document.querySelectorAll('.company-logo');
    
    companyLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            const companyName = logo.querySelector('.company-name')?.textContent || 
                              logo.textContent.trim();
            showToast('Case Study', `Click to view ${companyName}'s success story`, 2000);
        });
    });

    // ==========================================
    // INTEGRATION CARDS INTERACTION
    // ==========================================
    const integrationCards = document.querySelectorAll('.integration-card');
    
    integrationCards.forEach(card => {
        card.addEventListener('click', () => {
            const integrationName = card.querySelector('h4')?.textContent || 'Integration';
            showToast('Integration', `${integrationName} integration coming soon!`, 2500);
        });
    });

    // ==========================================
    // FEATURE CARD HOVER EFFECTS
    // ==========================================
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const featureType = card.getAttribute('data-feature');
            if (featureType) {
                // Add extra glow or animation based on feature type
                card.style.boxShadow = '0 20px 60px rgba(0, 240, 255, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });

    // ==========================================
    // PRICE CARD SELECTION
    // ==========================================
    const priceCards = document.querySelectorAll('.price-card');
    
    priceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on button
            if (e.target.closest('button')) return;
            
            priceCards.forEach(c => c.style.transform = '');
            card.style.transform = card.classList.contains('premium') ? 
                'scale(1.08)' : 'scale(1.03)';
            
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
        });
    });

    // ==========================================
    // TESTIMONIAL CARD INTERACTIONS
    // ==========================================
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const reviewerName = card.querySelector('.reviewer h4')?.textContent;
            if (reviewerName) {
                card.style.borderColor = 'rgba(0, 240, 255, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = '';
        });
    });

    // ==========================================
    // VIDEO TESTIMONIAL PLAYBACK
    // ==========================================
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoTitle = card.querySelector('.video-info h4')?.textContent || 'Video';
            showToast('Video Player', `Playing: ${videoTitle}`, 2500);
            
            // Animate play button
            const playButton = card.querySelector('.play-button');
            if (playButton) {
                playButton.style.transform = 'translate(-50%, -50%) scale(0.8)';
                setTimeout(() => {
                    playButton.style.transform = '';
                }, 200);
            }
        });
    });

    // ==========================================
    // DYNAMIC GRADIENT ANIMATIONS
    // ==========================================
    const textGradients = document.querySelectorAll('.text-gradient');
    
    textGradients.forEach(gradient => {
        gradient.addEventListener('mouseenter', () => {
            gradient.style.animationDuration = '2s';
        });
        
        gradient.addEventListener('mouseleave', () => {
            gradient.style.animationDuration = '5s';
        });
    });

    // ==========================================
    // SCROLL-BASED ANIMATIONS
    // ==========================================
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        // Hide/show navbar on scroll
        if (navbar) {
            if (scrollDirection === 'down' && currentScrollY > 300) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });

    // ==========================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================
    
    // Lazy load images (if any added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================
    document.addEventListener('keydown', (e) => {
        // Navigate FAQs with arrow keys
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const activeFaq = document.querySelector('.faq-item.active');
            if (activeFaq) {
                e.preventDefault();
                const allFaqs = Array.from(faqItems);
                const currentIndex = allFaqs.indexOf(activeFaq);
                
                let nextIndex;
                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % allFaqs.length;
                } else {
                    nextIndex = currentIndex - 1 < 0 ? allFaqs.length - 1 : currentIndex - 1;
                }
                
                allFaqs[nextIndex].querySelector('.faq-question')?.click();
            }
        }
    });

    // ==========================================
    // EASTER EGGS & FUN INTERACTIONS
    // ==========================================
    let clickCount = 0;
    const logo = document.querySelector('.logo');
    
    if (logo) {
        logo.addEventListener('click', (e) => {
            clickCount++;
            
            if (clickCount === 5) {
                showToast('🎉 Easter Egg!', 'You found a secret! You\'re awesome!', 4000);
                
                // Confetti effect
                const colors = ['#00f0ff', '#ff0076', '#8b5cf6'];
                for (let i = 0; i < 50; i++) {
                    setTimeout(() => {
                        createConfetti(e.clientX, e.clientY, colors[Math.floor(Math.random() * colors.length)]);
                    }, i * 30);
                }
                
                clickCount = 0;
            }
        });
    }

    function createConfetti(x, y, color) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = color;
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10001';
        confetti.style.borderRadius = '50%';
        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let posX = x;
        let posY = y;
        let opacity = 1;

        function animate() {
            vy += 0.5; // gravity
            posX += vx;
            posY += vy;
            opacity -= 0.02;

            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        }

        animate();
    }

    // ==========================================
    // KONAMI CODE EASTER EGG
    // ==========================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateKonamiMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateKonamiMode() {
        showToast('🎮 Konami Code!', 'Ultra mode activated! Enjoy the show!', 5000);
        
        // Add rainbow effect to all glass panels
        const glassPanels = document.querySelectorAll('.glass-panel');
        glassPanels.forEach((panel, index) => {
            setTimeout(() => {
                panel.style.animation = 'rainbowBorder 3s linear infinite';
                panel.style.borderWidth = '2px';
            }, index * 100);
        });

        // Create CSS animation for rainbow border
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbowBorder {
                0% { border-color: #ff0076; }
                16% { border-color: #ff9d00; }
                33% { border-color: #00f0ff; }
                50% { border-color: #0057ff; }
                66% { border-color: #8b5cf6; }
                83% { border-color: #ff0076; }
                100% { border-color: #ff0076; }
            }
        `;
        document.head.appendChild(style);

        // Reset after 10 seconds
        setTimeout(() => {
            glassPanels.forEach(panel => {
                panel.style.animation = '';
                panel.style.borderWidth = '';
            });
            style.remove();
        }, 10000);
    }

    // ==========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==========================================
    
    // Focus trap for modal
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    modal?.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll(focusableElements);
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Announce page changes for screen readers
    function announceChange(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    }

    // ==========================================
    // INITIALIZATION COMPLETE
    // ==========================================
    console.log('%c🎨 AuraConsult Initialized Successfully!', 'color: #00f0ff; font-size: 16px; font-weight: bold;');
    console.log('%c✨ All interactive features are ready!', 'color: #ff0076; font-size: 12px;');
    
    // Show welcome toast after page loads
    setTimeout(() => {
        showToast('Welcome to AuraConsult! 🚀', 'Explore our elite consulting platform.', 4000);
    }, 1000);

    // ==========================================
    // PERFORMANCE MONITORING
    // ==========================================
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.renderTime || entry.loadTime);
                }
            }
        });
        
        try {
            perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // Browser doesn't support LCP
        }
    }

});

// ==========================================
// UTILITY FUNCTIONS (Global Scope)
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Generate random number in range
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

console.log('%c💎 AuraConsult - Premium Features Loaded', 'background: linear-gradient(135deg, #00f0ff, #ff0076); color: white; padding: 10px 20px; border-radius: 5px; font-size: 14px; font-weight: bold;');