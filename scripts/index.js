/* ============================================
   KDMN STUDIO - INTERACTIVE BEHAVIORS
   ============================================ */

/* ============================================
   CANVAS GRAIN EFFECT
   Static grain with scroll movement
   ============================================ */

function initGrainEffect() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.opacity = '0.15';
    
    document.body.appendChild(canvas);
    
    let offsetX = 0;
    let offsetY = 0;
    let scrollY = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateStaticGrain();
    }
    
    // Create a larger grain texture that we'll pan across
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = 512;
    grainCanvas.height = 512;
    const grainCtx = grainCanvas.getContext('2d');
    
    function generateStaticGrain() {
        const imageData = grainCtx.createImageData(grainCanvas.width, grainCanvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const grain = Math.random() * 255;
            data[i] = grain;     // Red
            data[i + 1] = grain; // Green
            data[i + 2] = grain; // Blue
            data[i + 3] = 255;   // Alpha
        }
        
        grainCtx.putImageData(imageData, 0, 0);
    }
    
    function renderGrain() {
        // Calculate offset based only on scroll position
        offsetX = (scrollY * 0.1) % grainCanvas.width;
        offsetY = (scrollY * 0.15) % grainCanvas.height;
        
        // Tile the grain pattern with offset
        for (let x = -1; x < Math.ceil(canvas.width / grainCanvas.width) + 1; x++) {
            for (let y = -1; y < Math.ceil(canvas.height / grainCanvas.height) + 1; y++) {
                ctx.drawImage(
                    grainCanvas,
                    x * grainCanvas.width - offsetX,
                    y * grainCanvas.height - offsetY
                );
            }
        }
        
        requestAnimationFrame(renderGrain);
    }
    
    // Track scroll only
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    renderGrain();
}

// Initialize grain effect when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrainEffect);
} else {
    initGrainEffect();
}

document.addEventListener('DOMContentLoaded', function() {
    
    /* ============================================
       GALLERY IMAGE TAP TOGGLE (MOBILE ONLY)
       Desktop uses CSS hover, mobile uses tap toggle
       ============================================ */
    
    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        const galleryCards = document.querySelectorAll('.Gallery-card-content');
        
        galleryCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Toggle 'active' class on tap
                this.classList.toggle('active');
                
                // Optional: Close other cards when one is opened
                // Uncomment below if you want only one card active at a time
                /*
                galleryCards.forEach(otherCard => {
                    if (otherCard !== this) {
                        otherCard.classList.remove('active');
                    }
                });
                */
            });
        });
    }
    
    /* ============================================
       CONTACT FORM SUBMISSION
       Basic form handling with validation
       ============================================ */
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.email-input');
            const email = emailInput.value.trim();
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Success feedback
            alert('Thank you for your interest! We\'ll be in touch soon.');
            
            // Reset form
            emailInput.value = '';
            
            // Here you would typically send the data to a server
            // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify({ email }) })
        });
    }
    
    /* ============================================
       NAVBAR AUTO-HIDE ON SCROLL (OPTIONAL)
       Uncomment to enable navbar hide/show on scroll
       ============================================ */
    
    /*
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            // At top of page - always show
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    */
    
    /* ============================================
       SMOOTH SCROLL ENHANCEMENT
       Already handled by CSS, but can be enhanced here
       ============================================ */
    
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Let CSS smooth scroll handle it, but we can add offset for fixed navbar
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    /* ============================================
       INTERSECTION OBSERVER FOR ANIMATIONS
       Optional: Add fade-in effects as sections scroll into view
       ============================================ */
    
    /*
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    */
    
});

/* ============================================
   CONSOLE BRANDING
   ============================================ */
console.log('%cKDMN STUDIO', 'font-size: 3rem; font-weight: bold; color: #EAC56A; text-shadow: 3px 3px 0 #264653;');
console.log('%cDigital Innovation • Experimental Design', 'font-size: 1rem; color: #2A9D8F;');