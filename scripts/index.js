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
    initStars();
    animateStars();
});

window.addEventListener('resize', () => {
    initStars();
});

// Hero section parallax effect
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    heroSection.style.transform = `translateY(${rate}px) scale(${1 + scrolled * -0.0005})`;
});

// Three.js Warp Effect for Hero Section
class ThreeJSWarpEffect {
    constructor() {
        this.container = document.getElementById('three-js-container');
        this.heroSection = document.querySelector('.hero-section');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 1;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Create plane geometry with high subdivision for smooth warping
        const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
        
        // Create shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { value: null },
                warpMouseX: { value: 0 },
                warpMouseY: { value: 0 },
                warpRadius: { value: 0.15 },
                warpStrength: { value: 0.08 },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D texture;
                uniform float warpMouseX;
                uniform float warpMouseY;
                uniform float warpRadius;
                uniform float warpStrength;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    vec2 uv = vUv;
                    
                    // Mouse position in UV space
                    vec2 mousePos = vec2(warpMouseX, warpMouseY);
                    
                    // Distance from current pixel to mouse
                    vec2 delta = uv - mousePos;
                    float distance = length(delta);
                    
                    // Apply warp effect
                    if (distance < warpRadius) {
                        float ratio = (warpRadius - distance) / warpRadius;
                        float smoothFalloff = sin(ratio * 3.14159) * 0.5;
                        vec2 distortion = normalize(delta) * smoothFalloff * warpStrength;
                        uv += distortion;
                    }
                    
                    // Sample and output texture
                    gl_FragColor = texture2D(texture, uv);
                }
            `,
            transparent: true
        });
        
        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
        
        // Load texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('images/background.jpg', (texture) => {
            material.uniforms.texture.value = texture;
        }, undefined, (error) => {
            console.warn('Could not load background image for three.js warp:', error);
        });
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
    }
    
    setupEventListeners() {
        this.heroSection.addEventListener('mousemove', (e) => {
            const rect = this.heroSection.getBoundingClientRect();
            this.targetMouseX = (e.clientX - rect.left) / rect.width;
            this.targetMouseY = 1.0 - ((e.clientY - rect.top) / rect.height);
        });
        
        this.heroSection.addEventListener('mouseleave', () => {
            this.targetMouseX = -1;
            this.targetMouseY = -1;
        });
        
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth interpolation for mouse position
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;
        
        // Update shader uniforms
        this.mesh.material.uniforms.warpMouseX.value = this.mouseX;
        this.mesh.material.uniforms.warpMouseY.value = this.mouseY;
        this.mesh.material.uniforms.time.value += 0.016;
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize three.js warp effect when page loads
window.addEventListener('load', () => {
    // Check if running on file:// protocol
    if (window.location.protocol !== 'file:') {
        new ThreeJSWarpEffect();
    }
});