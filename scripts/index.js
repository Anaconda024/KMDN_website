// Auto-hiding Navigation Bar
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Confetti Trail Effect
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvasContainer.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '1';

let particles = [];
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;
let mouseMoveTimer;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.color = color;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.1 - 0.05;
        this.shape = Math.random() > 0.5 ? 'circle' : 'square';
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.1; // Gravity
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
        this.size *= 0.99;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        ctx.restore();
    }
}

const colors = [
    '#FF3366', // Primary pink
    '#33CCFF', // Secondary cyan
    '#FFCC00', // Accent yellow
    '#FF6633', // Orange
    '#33FF66', // Green
    '#9966FF'  // Purple
];

function createConfetti(x, y) {
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0 || particles[i].size <= 0) {
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animateParticles);
}

// Mouse movement detection - confetti effect removed

// Card hover effects with imprint
const profileCards = document.querySelectorAll('.profile-card');
const portfolioCards = document.querySelectorAll('.portfolio-card');

profileCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const imprint = document.createElement('div');
        imprint.className = 'card-imprint';
        
        imprint.style.width = `${rect.width}px`;
        imprint.style.height = `${rect.height}px`;
        imprint.style.left = `${rect.left + 15}px`;
        imprint.style.top = `${rect.top + 15}px`;
        imprint.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(imprint);
        
        setTimeout(() => {
            imprint.style.opacity = '0';
            imprint.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (imprint.parentNode) {
                    imprint.parentNode.removeChild(imprint);
                }
            }, 400);
        }, 100);
    });
});

// Starfield animation for portfolio
const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas.getContext('2d');
let stars = [];

function initStars() {
    starsCanvas.width = starsCanvas.parentElement.clientWidth;
    starsCanvas.height = starsCanvas.parentElement.clientHeight;
    
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * starsCanvas.width,
            y: Math.random() * starsCanvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.5 ? '#33CCFF' : '#FFFFFF',
            twinkleSpeed: Math.random() * 0.05 + 0.02,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }
}

function animateStars() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    
    const time = Date.now() * 0.001;
    
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > starsCanvas.height) {
            star.y = 0;
            star.x = Math.random() * starsCanvas.width;
        }
        
        const alpha = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        starsCtx.fillStyle = star.color;
        starsCtx.globalAlpha = alpha;
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        starsCtx.fill();
    });
    
    requestAnimationFrame(animateStars);
}

// Form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = contactForm.querySelector('.email-input');
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    if (emailInput.value) {
        submitBtn.textContent = 'SENT!';
        submitBtn.style.background = '#33FF66';
        submitBtn.style.color = '#222222';
        
        // Create celebration confetti
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createConfetti(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 20);
        }
        
        setTimeout(() => {
            submitBtn.textContent = 'Send';
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            emailInput.value = '';
        }, 3000);
    }
});

// Initialize everything
window.addEventListener('load', () => {
    resizeCanvas();
    initStars();
    animateParticles();
    animateStars();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
});

// Add some initial confetti for fun
setTimeout(() => {
    for (let i = 0; i < 30; i++) {
        createConfetti(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight
        );
    }
}, 1000);

// Add click confetti
document.addEventListener('click', (e) => {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createConfetti(e.clientX, e.clientY);
        }, i * 50);
    }
});

// Hero section parallax effect
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    heroSection.style.transform = `translateY(${rate}px) scale(${1 + scrolled * -0.0005})`;
});

// Bubble Magnification Effect for Hero Section
// Warp Effect for Hero Section Background
const heroSection = document.querySelector('.hero-section');
const heroBgImage = document.getElementById('hero-bg-image');
const warpCanvas = document.getElementById('warpCanvas');
const warpCtx = warpCanvas.getContext('2d');

// Warp effect settings (using your 50px radius and 40 strength example)
let isWarpEnabled = true;
let warpRadius = 50;
let warpStrength = 40;
let warpMouseX = -1000;
let warpMouseY = -1000;
let warpBackgroundImage = null;

function initWarpCanvas() {
    const rect = heroSection.getBoundingClientRect();
    warpCanvas.width = rect.width;
    warpCanvas.height = rect.height;
    
    // Load the background image for warping
    warpBackgroundImage = new Image();
    warpBackgroundImage.crossOrigin = "anonymous";
    warpBackgroundImage.src = 'images/background.jpeg'; // Ensure this matches your actual image path
    warpBackgroundImage.onload = () => {
        drawWarpEffect();
    };
}

function handleWarpMouseMove(e) {
    if (!isWarpEnabled) return;
    
    const rect = heroSection.getBoundingClientRect();
    warpMouseX = e.clientX - rect.left;
    warpMouseY = e.clientY - rect.top;
    drawWarpEffect();
}

function handleWarpMouseLeave() {
    warpMouseX = -1000;
    warpMouseY = -1000;
    drawWarpEffect();
}

function drawWarpEffect() {
    if (!warpBackgroundImage || !warpBackgroundImage.complete) return;
    
    warpCtx.clearRect(0, 0, warpCanvas.width, warpCanvas.height);
    
    // Create image data for warping
    const imageData = warpCtx.createImageData(warpCanvas.width, warpCanvas.height);
    
    // Draw background image to a temporary canvas for sampling
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = warpCanvas.width;
    tempCanvas.height = warpCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.drawImage(warpBackgroundImage, 0, 0, warpCanvas.width, warpCanvas.height);
    const sourceData = tempCtx.getImageData(0, 0, warpCanvas.width, warpCanvas.height);
    
    // Apply sink/warp effect (subtle liquid-like distortion)
    for (let y = 0; y < warpCanvas.height; y += 2) { // Step by 2 for performance
        for (let x = 0; x < warpCanvas.width; x += 2) {
            let sourceX = x;
            let sourceY = y;
            
            // Calculate distance from mouse
            const dx = x - warpMouseX;
            const dy = y - warpMouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < warpRadius) {
                // Calculate distortion based on distance
                const ratio = (warpRadius - distance) / warpRadius;
                const distortion = Math.sin(ratio * Math.PI) * warpStrength;
                
                // Apply sink effect - pull pixels toward center
                sourceX = x + (dx / distance) * distortion;
                sourceY = y + (dy / distance) * distortion;
                
                // Add some wave-like variation for liquid effect
                const waveX = Math.sin(y * 0.02 + Date.now() * 0.001) * 2;
                const waveY = Math.cos(x * 0.02 + Date.now() * 0.001) * 2;
                sourceX += waveX * ratio;
                sourceY += waveY * ratio;
            }
            
            // Clamp source coordinates
            sourceX = Math.max(0, Math.min(warpCanvas.width - 1, Math.round(sourceX)));
            sourceY = Math.max(0, Math.min(warpCanvas.height - 1, Math.round(sourceY)));
            
            // Copy pixel from source to destination
            const destIndex = (y * warpCanvas.width + x) * 4;
            const sourceIndex = (sourceY * warpCanvas.width + sourceX) * 4;
            
            imageData.data[destIndex] = sourceData.data[sourceIndex];
            imageData.data[destIndex + 1] = sourceData.data[sourceIndex + 1];
            imageData.data[destIndex + 2] = sourceData.data[sourceIndex + 2];
            imageData.data[destIndex + 3] = sourceData.data[sourceIndex + 3];
            
            // Fill neighboring pixels for smoother effect (simple bilinear)
            if (x + 1 < warpCanvas.width) {
                const nextDestIndex = (y * warpCanvas.width + (x + 1)) * 4;
                imageData.data[nextDestIndex] = sourceData.data[sourceIndex];
                imageData.data[nextDestIndex + 1] = sourceData.data[sourceIndex + 1];
                imageData.data[nextDestIndex + 2] = sourceData.data[sourceIndex + 2];
                imageData.data[nextDestIndex + 3] = sourceData.data[sourceIndex + 3];
            }
            
            if (y + 1 < warpCanvas.height) {
                const belowDestIndex = ((y + 1) * warpCanvas.width + x) * 4;
                imageData.data[belowDestIndex] = sourceData.data[sourceIndex];
                imageData.data[belowDestIndex + 1] = sourceData.data[sourceIndex + 1];
                imageData.data[belowDestIndex + 2] = sourceData.data[sourceIndex + 2];
                imageData.data[belowDestIndex + 3] = sourceData.data[sourceIndex + 3];
            }
        }
    }
    
    warpCtx.putImageData(imageData, 0, 0);
    
    // Add subtle glow effect at warp center
    if (warpMouseX > 0 && warpMouseX < warpCanvas.width && 
        warpMouseY > 0 && warpMouseY < warpCanvas.height) {
        const gradient = warpCtx.createRadialGradient(
            warpMouseX, warpMouseY, 0,
            warpMouseX, warpMouseY, warpRadius
        );
        gradient.addColorStop(0, 'rgba(51, 204, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(51, 204, 255, 0)');
        
        warpCtx.fillStyle = gradient;
        warpCtx.fillRect(0, 0, warpCanvas.width, warpCanvas.height);
    }
}

// Initialize the warp effect
function initWarpEffect() {
    initWarpCanvas();
    
    // Mouse effects disabled on hero section
    // No event listeners added to prevent mouse interactions
}

// Update the initialization function
window.addEventListener('load', () => {
    resizeCanvas();
    initStars();
    animateStars();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
});