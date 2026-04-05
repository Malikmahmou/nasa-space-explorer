// Main JavaScript for NASA Space Explorer
// Handles: Dark mode, API calls, parallax, smooth scroll, navigation

class NASAExplorer {
    constructor() {
        this.apodApiKey = 'DEMO_KEY'; // Replace with your NASA API key
        this.marsApiKey = 'DEMO_KEY';
        this.init();
    }

    init() {
        this.setupDarkMode();
        this.setupParallax();
        this.setupSmoothScroll();
        this.setupNavigation();
        this.loadAPOD();
        this.loadMarsRoverPreview();
    }

    setupDarkMode() {
        const toggle = document.getElementById('darkToggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
            });
            
            // Load saved preference
            if (localStorage.getItem('darkMode') === 'true') {
                document.documentElement.classList.add('dark');
            }
        }
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-speed') || 0;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupNavigation() {
        // Mobile menu toggle (if added later)
        // Highlight active page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a[href]');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('text-blue-400', 'font-semibold');
            }
        });
    }

    async loadAPOD() {
        const container = document.getElementById('apodContainer');
        if (!container) return;

        try {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="loading inline-block mb-4"></div>
                    <p class="text-lg opacity-75">Loading Astronomy Picture of the Day...</p>
                </div>
            `;

            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${this.apodApiKey}`);
            const data = await response.json();

            document.getElementById('apodTitle').textContent = data.title;
            document.getElementById('apodExplanation').textContent = data.explanation.substring(0, 300) + '...';
            document.getElementById('apodDate').textContent = `Date: ${data.date} | Copyright: ${data.copyright || 'Public Domain'}`;
            document.getElementById('apodImage').src = data.url || data.hdurl;
            document.getElementById('apodImage').alt = data.title;

            // Full container after load
            container.innerHTML = `
                <div class="space-y-6">
                    <h3 id="apodTitle" class="text-3xl font-bold">${data.title}</h3>
                    <p id="apodExplanation" class="text-lg opacity-90">${data.explanation.substring(0, 300)}...</p>
                    <p class="text-sm opacity-70" id="apodDate">Date: ${data.date} | Copyright: ${data.copyright || 'Public Domain'}</p>
                </div>
                <img id="apodImage" class="w-full rounded-2xl shadow-2xl animate-pulse-glow" src="${data.url || data.hdurl}" alt="${data.title}">
            `;
        } catch (error) {
            console.error('APOD fetch error:', error);
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-lg opacity-75">Unable to load APOD. Using demo image.</p>
                    <img class="w-96 mx-auto rounded-2xl shadow-2xl mt-8" src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=2370&amp;q=80" alt="Demo space image">
                </div>
            `;
        }
    }

    async loadMarsRoverPreview() {
        // This can be expanded in gallery.html
        console.log('Mars Rover API ready for gallery page');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NASAExplorer();
});

// Service Worker for performance (PWA ready)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
