/**
 * AuraConsult - Core Interaction Engine
 * This file handles all advanced DOM interactions, 
 * scroll monitoring, mathematics for 3D UI, and Intersection Observers.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Scroll Progress Bar Update
    // ==========================================
    const progressBar = document.querySelector('.scroll-progress');
    
    const updateScrollProgress = () => {
        // Calculate how far down the user has scrolled
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollLen = Math.round((scrollPx / winHeightPx) * 100);
        
        // Apply width to progress bar
        progressBar.style.width = scrollLen + "%";
    };

    window.addEventListener("scroll", updateScrollProgress);


    // ==========================================
    // 2. Dynamic Glass Navbar
    // ==========================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ==========================================
    // 3. Advanced Scroll Reveal using Intersection Observer
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Triggers slightly before element enters view
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class to trigger CSS transform and opacity
                entry.target.classList.add('active');
                // Unobserve to run animation only once
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // 4. Dynamic Number Counters (Stats Section)
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const countUp = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000; // 2 seconds total animation
        const frameRate = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counterInterval = setInterval(() => {
            frame++;
            // Ease-out calculation for smooth deceleration
            const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
            const currentCount = (target * progress).toFixed(target % 1 === 0 ? 0 : 1);
            
            el.innerText = currentCount;

            if (frame >= totalFrames) {
                clearInterval(counterInterval);
                el.innerText = target; // Ensure exact final value
            }
        }, frameRate);
    };

    // Observer to trigger counter ONLY when stats section is visible
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
    // 5. Advanced 3D Mouse Tilt Effect (Vanilla JS alternative to VanillaTilt)
    // ==========================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Get dimensions of the element
            const rect = card.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            
            // Get mouse position relative to element center
            const mouseX = e.clientX - rect.left - width / 2;
            const mouseY = e.clientY - rect.top - height / 2;

            // Calculate rotation degree based on mouse position (Max 10 degrees)
            const rotateX = (mouseY / (height / 2)) * -10;
            const rotateY = (mouseX / (width / 2)) * 10;

            // Apply transform - combining the card's original transform (if it's the hero mockup)
            let baseTransform = '';
            if (card.classList.contains('dashboard-mockup')) {
                // If it's the mockup, keep its base 3D perspective
                baseTransform = `perspective(1000px) `;
            } else {
                baseTransform = `perspective(1000px) scale(1.02) `;
            }

            card.style.transform = `${baseTransform} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Optional: Adjust border highlight based on mouse position to simulate lighting
            card.style.borderColor = `rgba(255, 255, 255, 0.2)`;
        });

        // Reset state on mouse leave
        card.addEventListener('mouseleave', () => {
            // Smooth transition back to original
            card.style.transition = 'transform 0.5s ease-out, border-color 0.5s';
            
            if (card.classList.contains('dashboard-mockup')) {
                card.style.transform = `perspective(1000px) rotateY(-15deg) rotateX(5deg)`;
            } else if (card.classList.contains('premium')) {
                 card.style.transform = `scale(1.05)`; // keep premium card slightly larger
            } else {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            }
            
            card.style.borderColor = `var(--glass-border)`;

            // Remove transition after animation so it doesn't lag on next mouseover
            setTimeout(() => {
                card.style.transition = 'transform 0.1s ease-out';
            }, 500);
        });
    });


    // ==========================================
    // 6. Parallax effect for floating dashboard widgets
    // ==========================================
    const heroSection = document.querySelector('.hero');
    const parallaxElements = document.querySelectorAll('.parallax');
    const parallaxReverse = document.querySelectorAll('.parallax-reverse');

    if (heroSection) {
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
        
        // Reset
        heroSection.addEventListener('mouseleave', () => {
            parallaxElements.forEach(el => { el.style.transform = `translate(0px, 0px)`; });
            parallaxReverse.forEach(el => { el.style.transform = `translate(0px, 0px)`; });
        });
    }
});