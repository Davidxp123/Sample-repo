document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Scroll Reveal Animation using Intersection Observer
    // This creates the beautiful effect of elements sliding and fading in as you scroll down
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once it's visible if you only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-anim');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // 2. Dynamic Glass Navbar on Scroll
    // Increases the blur and shadow of the navbar when the user scrolls down
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Super Cool Interactive Mouse Parallax Effect on Hero Cards
    // Makes the floating glass cards react slightly to user mouse movement
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const heroSection = document.querySelector('.hero');

    heroSection.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        parallaxElements.forEach((el, index) => {
            // Give different cards different movement speeds
            const speed = index === 0 ? 0.03 : 0.06;
            
            // Calculate distance from center
            const moveX = (x - centerX) * speed;
            const moveY = (y - centerY) * speed;

            // Apply movement on top of existing CSS animations
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // Reset transform when mouse leaves hero section
    heroSection.addEventListener('mouseleave', () => {
        parallaxElements.forEach(el => {
            el.style.transform = `translate(0px, 0px)`;
            // CSS transition will smoothly return it to the normal float animation
            el.style.transition = "transform 0.5s ease-out"; 
            
            // Remove transition after it resets so mousemove works smoothly again
            setTimeout(() => {
                el.style.transition = "";
            }, 500);
        });
    });
});