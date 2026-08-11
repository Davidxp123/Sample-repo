/**
 * AuraConsult - Core Interaction Engine
 * Upgraded with dynamic modals, smooth scrolling, mobile nav, and touch optimizations.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Check if user is on a touch device (to disable heavy mouse events)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    // ==========================================
    // 1. Mobile Hamburger Menu Logic
    // ==========================================
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Simple animation for hamburger lines
        mobileBtn.children[0].style.transform = mobileMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        mobileBtn.children[1].style.opacity = mobileMenu.classList.contains('active') ? '0' : '1';
        mobileBtn.children[2].style.transform = mobileMenu.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileBtn.children[0].style.transform = 'none';
            mobileBtn.children[1].style.opacity = '1';
            mobileBtn.children[2].style.transform = 'none';
        });
    });

    // ==========================================
    // 2. Interactive Global Modal Logic
    // ==========================================
    const modal = document.getElementById('global-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const triggerButtons = document.querySelectorAll('.trigger-modal');
    const modalForm = document.getElementById('modal-form');

    // Open Modal
    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default anchor jump
            const actionType = btn.getAttribute('data-action') || 'Action';
            
            // Dynamically change modal text based on button clicked
            modalTitle.innerText = `${actionType}`;
            
            modal.classList.add('active');
            
            // Close mobile menu if open
            if(mobileMenu.classList.contains('active')){
                mobileMenu.classList.remove('active');
                mobileBtn.children[0].style.transform = 'none';
                mobileBtn.children[1].style.opacity = '1';
                mobileBtn.children[2].style.transform = 'none';
            }
        });
    });

    // Close Modal logic
    const closeTheModal = () => modal.classList.remove('active');
    
    closeModal.addEventListener('click', closeTheModal);
    
    // Close modal if clicking outside the panel
    modal.addEventListener('click', (e) => {
        if(e.target === modal) closeTheModal();
    });

    // Handle Form submissions (Prevent page reload for dummy form)
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        modalTitle.innerText = "Success!";
        document.getElementById('modal-desc').innerText = "Your request has been processed successfully.";
        modalForm.style.display = "none";
        
        // Reset modal after 3 seconds
        setTimeout(() => {
            closeTheModal();
            setTimeout(() => {
                modalForm.style.display = "block";
                document.getElementById('modal-desc').innerText = "This is a dynamic interactive element. In a live production environment, this would redirect you or open a specific form.";
                modalForm.reset();
            }, 500); // reset after transition finishes
        }, 2000);
    });

    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Thanks for subscribing to AuraConsult updates!");
        e.target.reset();
    });


    // ==========================================
    // 3. Smooth Scrolling for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Ignore if it's just "#" (used for modal triggers)
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Scroll accounting for fixed header
                const headerOffset = 80; 
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
    // 4. Scroll Progress & Dynamic Navbar
    // ==========================================
    const progressBar = document.querySelector('.scroll-progress');
    const navbar = document.getElementById('navbar');
    
    window.addEventListener("scroll", () => {
        // Progress bar
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollLen = Math.round((scrollPx / winHeightPx) * 100);
        progressBar.style.width = scrollLen + "%";

        // Navbar bg
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ==========================================
    // 5. Advanced Scroll Reveal using Intersection Observer
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', 
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // 6. Dynamic Number Counters
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const countUp = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2500; 
        const frameRate = 1000 / 60; 
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counterInterval = setInterval(() => {
            frame++;
            const progress = 1 - Math.pow(1 - frame / totalFrames, 3); // Cubic ease-out
            const currentCount = (target * progress).toFixed(target % 1 === 0 ? 0 : 1);
            
            el.innerText = currentCount;

            if (frame >= totalFrames) {
                clearInterval(counterInterval);
                el.innerText = target; 
            }
        }, frameRate);
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                counters.forEach(counter => countUp(counter));
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }


    // ==========================================
    // 7. 3D Mouse Tilt & Parallax (Disabled on touch devices for performance)
    // ==========================================
    if (!isTouchDevice) {
        // Tilt Cards
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const mouseX = e.clientX - rect.left - width / 2;
                const mouseY = e.clientY - rect.top - height / 2;
                
                // Max rotation degree
                const rotateX = (mouseY / (height / 2)) * -8;
                const rotateY = (mouseX / (width / 2)) * 8;

                let baseTransform = card.classList.contains('dashboard-mockup') 
                    ? `perspective(1000px) ` 
                    : `perspective(1000px) scale(1.02) `;

                card.style.transform = `${baseTransform} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                card.style.borderColor = `rgba(255, 255, 255, 0.2)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s ease-out, border-color 0.5s';
                
                if (card.classList.contains('dashboard-mockup')) {
                    card.style.transform = `perspective(1000px) rotateY(-15deg) rotateX(5deg)`;
                } else if (card.classList.contains('premium')) {
                     card.style.transform = `scale(1.05)`; 
                } else {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
                }
                
                card.style.borderColor = `var(--glass-border)`;
                setTimeout(() => card.style.transition = 'transform 0.1s ease-out', 500);
            });
        });

        // Parallax widgets in Hero
        const heroSection = document.querySelector('.hero');
        const parallaxElements = document.querySelectorAll('.parallax');
        const parallaxReverse = document.querySelectorAll('.parallax-reverse');

        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const x = (window.innerWidth - e.pageX) / 90;
                const y = (window.innerHeight - e.pageY) / 90;
                parallaxElements.forEach(el => el.style.transform = `translate(${x}px, ${y}px)`);
                parallaxReverse.forEach(el => el.style.transform = `translate(-${x}px, -${y}px)`);
            });
            
            heroSection.addEventListener('mouseleave', () => {
                parallaxElements.forEach(el => el.style.transform = `translate(0px, 0px)`);
                parallaxReverse.forEach(el => el.style.transform = `translate(0px, 0px)`);
            });
        }
    }
});