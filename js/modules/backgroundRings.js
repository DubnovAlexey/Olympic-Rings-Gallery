// ФАЙЛ: js/modules/backgroundRings.js
// НАЗНАЧЕНИЕ: десять летающих колец (треки 6–15) на трёх глубинах — дальние меньше, бледнее и медленнее.
// РАЗДЕЛЫ: 1 настройки; 2 создание колец; 3 движение по времени; 4 подсветка играющего трека.
// Движение считается по прошедшему времени (одинаковая скорость на 60 и 120 Гц) и пишется только в transform,
// поэтому браузер не пересчитывает раскладку страницы в каждом кадре. Кольца слегка разворачиваются в 3D и
// смещаются за мышью тем сильнее, чем ближе слой. На скрытой вкладке движение останавливается, при
// «уменьшить анимацию» кольца стоят на месте.

// BEGIN SECTION 1 — настройки
const container = document.querySelector('.flying-rings-container');
const TOTAL_RINGS = 10;
const START_INDEX = 5; // летающие кольца отвечают за треки с 6-го по 15-й
const COLORS = ['blue', 'black', 'red', 'yellow', 'green'];
// far — дальний слой, near — ближний: размер, скорость (px/с), сила параллакса, наклон
const LAYERS = [
    {name: 'far', size: [58, 74], speed: 16, parallax: 10},
    {name: 'mid', size: [88, 108], speed: 28, parallax: 22},
    {name: 'near', size: [118, 138], speed: 42, parallax: 38}
];
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const rand = (min, max) => min + Math.random() * (max - min);
let ringsData = [];
let frame = 0;
let last = 0;
const pointer = {x: 0, y: 0, smoothX: 0, smoothY: 0};
// END SECTION 1

export const backgroundRings = {
    // BEGIN SECTION 2 — создание колец
    init(onRingClickCallback) {
        if (!container) return;
        container.replaceChildren();
        ringsData = [];
        for (let i = 0; i < TOTAL_RINGS; i++) {
            const layer = LAYERS[i % LAYERS.length];
            const size = Math.round(rand(layer.size[0], layer.size[1]));
            const trackIndex = START_INDEX + i;
            const ring = document.createElement('button');
            ring.type = 'button';
            ring.className = `flying-ring tube ${COLORS[i % COLORS.length]} depth-${layer.name}`;
            ring.style.setProperty('--size', `${size}px`);
            ring.setAttribute('aria-label', `Play or pause track ${trackIndex + 1}`);
            ring.setAttribute('aria-pressed', 'false');
            // Enter и пробел у настоящей кнопки работают сами
            ring.addEventListener('click', event => {
                event.stopPropagation();
                onRingClickCallback(trackIndex);
            });
            container.appendChild(ring);
            const angle = rand(0, Math.PI * 2);
            ringsData.push({
                element: ring, trackIndex, layer, size,
                x: rand(10, Math.max(20, window.innerWidth - size - 10)),
                y: rand(10, Math.max(20, window.innerHeight - size - 10)),
                vx: Math.cos(angle) * layer.speed, vy: Math.sin(angle) * layer.speed,
                tiltPhase: rand(0, Math.PI * 2), tiltSpeed: rand(0.25, 0.6), bobPhase: rand(0, Math.PI * 2)
            });
        }
        window.addEventListener('pointermove', event => {
            pointer.x = event.clientX / window.innerWidth - 0.5;
            pointer.y = event.clientY / window.innerHeight - 0.5;
        }, {passive: true});
        window.addEventListener('resize', () => this.render(performance.now()), {passive: true});
        document.addEventListener('visibilitychange', () => this.start());
        motion.addEventListener('change', () => this.start());
        this.render(performance.now());
        this.start();
    },
    // END SECTION 2

    // BEGIN SECTION 3 — движение по времени
    start() {
        if (frame || document.hidden || motion.matches) return;
        last = performance.now();
        frame = requestAnimationFrame(now => this.tick(now));
    },

    tick(now) {
        frame = 0;
        if (document.hidden || motion.matches) return;
        const dt = Math.min(0.05, (now - last) / 1000); // после долгой паузы не «телепортируемся»
        last = now;
        const width = window.innerWidth, height = window.innerHeight;
        for (const ring of ringsData) {
            ring.x += ring.vx * dt;
            ring.y += ring.vy * dt;
            if (ring.x <= 0 || ring.x + ring.size >= width) {
                ring.vx = Math.abs(ring.vx) * (ring.x <= 0 ? 1 : -1);
                ring.x = Math.min(Math.max(ring.x, 0), width - ring.size);
            }
            if (ring.y <= 0 || ring.y + ring.size >= height) {
                ring.vy = Math.abs(ring.vy) * (ring.y <= 0 ? 1 : -1);
                ring.y = Math.min(Math.max(ring.y, 0), height - ring.size);
            }
        }
        this.render(now);
        frame = requestAnimationFrame(next => this.tick(next));
    },

    render(now) {
        // Плавное следование за мышью: каждый кадр проходим часть пути до указателя
        pointer.smoothX += (pointer.x - pointer.smoothX) * 0.06;
        pointer.smoothY += (pointer.y - pointer.smoothY) * 0.06;
        const t = now / 1000;
        const still = motion.matches;
        for (const ring of ringsData) {
            const px = still ? 0 : -pointer.smoothX * ring.layer.parallax;
            const py = still ? 0 : -pointer.smoothY * ring.layer.parallax;
            const bob = still ? 0 : Math.sin(t * 0.9 + ring.bobPhase) * 6;
            const tiltX = still ? 0 : Math.sin(t * ring.tiltSpeed + ring.tiltPhase) * 28;
            const tiltY = still ? 0 : Math.cos(t * ring.tiltSpeed * 0.8 + ring.tiltPhase) * 34;
            ring.element.style.transform =
                `translate3d(${(ring.x + px).toFixed(1)}px, ${(ring.y + py + bob).toFixed(1)}px, 0) ` +
                `rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg)`;
        }
    },
    // END SECTION 3

    // BEGIN SECTION 4 — подсветка играющего трека
    syncLava(isPaused, currentTrackIndex) {
        ringsData.forEach(ring => {
            const active = !isPaused && ring.trackIndex === currentTrackIndex;
            ring.element.classList.toggle('lava-active', active);
            ring.element.setAttribute('aria-pressed', String(active));
        });
    }
    // END SECTION 4
};
