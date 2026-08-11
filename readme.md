# AuraConsult - The Elite Consulting OS 

A fully responsive, highly interactive, deep-sea/cyberpunk glassmorphic landing page designed for a SaaS consulting platform. Built entirely with Vanilla Web Technologies. No dependencies, no frameworks.

## 🌟 Upgraded Features

- **Global Interactive Modal System:** Every button and link is fully functional. "Dummy" links (like *Log In, Contact Us, Privacy Policy*) now trigger a sleek, dynamic popup modal instead of doing nothing. 
- **True Responsiveness:** Intelligently stacks CSS Grid layouts, replaces desktop navigation with an animated Hamburger Mobile Menu, and hides complex 3D desktop elements on smaller screens to prioritize mobile UX.
- **Smart Touch Optimization:** The JavaScript engine detects if a user is on a touch device (phones/tablets) and safely turns off intensive mouse-movement calculations (3D tilts/parallax) to save battery and ensure 60fps scrolling.
- **Flawless Internal Routing:** Added the missing *Workflow* and *Testimonials* sections. All Navbar links use JavaScript to calculate smooth-scrolling offsets, ensuring the fixed Navbar doesn't overlap section titles.
- **Counting Observers & Scroll Reveal:** UI elements slide up gracefully, and statistics count up dynamically strictly when they enter the user's viewport.

## 🛠 File Structure & Logic

1. **`index.html`**: Contains the semantic structure. Added a hidden `div.modal-overlay` that acts as our global popup container.
2. **`style.css`**: Extensive Media Queries (`@media (max-width: ...)`) to handle grid adjustments. Features custom scrollbars, gradient text, and intricate glassmorphism (`backdrop-filter`).
3. **`mycustom.js`**:
    - **Modal Controller:** Intercepts clicks on classes `.trigger-modal`, reads the `data-action`, and populates the modal title.
    - **Mobile Menu Controller:** Toggles the hamburger icon animation and handles menu slide-downs.
    - **Smooth Scroll API:** Hijacks `a[href^="#"]` clicks to calculate exact scrolling positions.
    - **VanillaTilt Engine:** Does complex DOM client rectangle math to apply `rotateX` and `rotateY` transforms natively.

