// Starfield particle system for immersive space background
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateStars();
    }

    generateStars() {
        this.stars = [];
        const numStars = Math.floor((this.canvas.width * this.canvas.height) / 2000);
        
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                alpha: Math.random() * 0.5 + 0.5,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            // Twinkle effect
            star.twinkle += 0.1;
            star.alpha = 0.5 + Math.sin(star.twinkle) * 0.3;
            
            // Move stars slowly
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
            
            // Draw star with glow
            const gradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
            gradient.addColorStop(0, `rgba(255,255,255,${star.alpha})`);
            gradient.addColorStop(0.4, `rgba(255,255,255,${star.alpha * 0.3})`);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Main star
            this.ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize starfield
let starfield;
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starsCanvas');
    if (canvas) {
        starfield = new Starfield(canvas);
    }
});
