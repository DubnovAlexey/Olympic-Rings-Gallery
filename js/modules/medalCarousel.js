// ФАЙЛ: js/modules/medalCarousel.js
// НАЗНАЧЕНИЕ: «медальная карусель» — пять новых колец (золото, серебро, бронза, лёд, огонь) для треков 16–20.
// РАЗДЕЛЫ: 1 настройки; 2 разметка; 3 вращение и плавный поворот; 4 мышь, палец, клавиатура; 5 подсветка трека.
// Кольца стоят по кругу в 3D; каждое по очереди выходит вперёд и задерживается там на несколько секунд. Стрелки, свайп и клавиши ←/→ поворачивают карусель,
// нажатие на кольцо включает его трек и выводит кольцо вперёд. При наведении, фокусе и «уменьшить анимацию»
// самостоятельное вращение останавливается.

// BEGIN SECTION 1 — настройки
const MEDALS = [
    {id: 'gold', name: 'Gold ring'},
    {id: 'silver', name: 'Silver ring'},
    {id: 'bronze', name: 'Bronze ring'},
    {id: 'ice', name: 'Ice ring'},
    {id: 'flame', name: 'Flame ring'}
];
const START_INDEX = 15; // треки с 16-го по 20-й
const STEP = 360 / MEDALS.length;
const AUTO_STEP_MS = 3500; // сколько кольцо стоит впереди, прежде чем карусель повернётся дальше
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
// END SECTION 1

let track = null, caption = null, rings = [];
let angle = 0, target = null, frame = 0, last = 0, hold = false, playingIndex = -1, restSince = 0;

// Угол, при котором кольцо с номером i стоит прямо перед зрителем
const frontAngle = (i) => -i * STEP;
const normalize = (value) => ((value % 360) + 540) % 360 - 180; // в диапазон -180…180

function frontIndex() {
    let best = 0, bestDistance = 999;
    rings.forEach((_, i) => {
        const distance = Math.abs(normalize(angle - frontAngle(i)));
        if (distance < bestDistance) { best = i; bestDistance = distance; }
    });
    return best;
}

// Кольцо, к которому карусель едет сейчас (или стоит впереди): от него считаются шаги стрелок,
// поэтому два быстрых нажатия дают два шага, а не один
function aimedIndex() {
    if (target === null) return frontIndex();
    let best = 0, bestDistance = 999;
    rings.forEach((_, i) => {
        const distance = Math.abs(normalize(target - frontAngle(i)));
        if (distance < bestDistance) { best = i; bestDistance = distance; }
    });
    return best;
}

export const medalCarousel = {
    // BEGIN SECTION 2 — разметка
    init(onRingClick) {
        track = document.getElementById('medalTrack');
        caption = document.getElementById('medalCaption');
        const root = document.querySelector('.medal-carousel');
        if (!track || !root) return;
        rings = MEDALS.map((medal, i) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `medal-ring tube ${medal.id}`;
            button.dataset.index = String(i);
            button.setAttribute('aria-label', `${medal.name}: play or pause track ${START_INDEX + i + 1}`);
            button.setAttribute('aria-pressed', 'false');
            button.addEventListener('click', () => {
                if (dragMoved) return; // это был свайп, а не нажатие
                this.rotateTo(i);
                onRingClick(START_INDEX + i);
            });
            track.appendChild(button);
            return button;
        });
        root.querySelector('.carousel-btn.prev')?.addEventListener('click', () => this.rotateTo(aimedIndex() - 1));
        root.querySelector('.carousel-btn.next')?.addEventListener('click', () => this.rotateTo(aimedIndex() + 1));
        root.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); this.rotateTo(aimedIndex() - 1, true); }
            if (event.key === 'ArrowRight') { event.preventDefault(); this.rotateTo(aimedIndex() + 1, true); }
        });
        root.addEventListener('pointerenter', () => { hold = true; });
        root.addEventListener('pointerleave', () => { hold = false; this.start(); });
        root.addEventListener('focusin', () => { hold = true; });
        root.addEventListener('focusout', () => { hold = false; this.start(); });
        this.bindDrag(root);
        document.addEventListener('visibilitychange', () => this.start());
        motion.addEventListener('change', () => { this.render(); this.start(); });
        this.render();
        this.start();
    },
    // END SECTION 2

    // BEGIN SECTION 3 — вращение и плавный поворот
    rotateTo(index, focus = false) {
        const i = ((index % rings.length) + rings.length) % rings.length;
        // Поворачиваем коротким путём от того места, куда уже едем, чтобы не крутиться лишний круг
        const from = target ?? angle;
        target = from + normalize(frontAngle(i) - from);
        if (motion.matches) { angle = target; target = null; this.render(); }
        if (focus) rings[i].focus({preventScroll: true});
        this.start();
    },

    start() {
        if (frame || document.hidden || !track) return;
        last = performance.now();
        frame = requestAnimationFrame(now => this.tick(now));
    },

    tick(now) {
        frame = 0;
        if (document.hidden) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        let moving = false;
        if (target !== null) {
            const rest = target - angle;
            angle += rest * Math.min(1, dt * 7); // мягкое торможение у цели
            if (Math.abs(rest) < 0.05) { angle = target; target = null; restSince = now; }
            moving = true;
        } else if (!hold && !dragging && !motion.matches && playingIndex < 0) {
            // Пауза впереди, потом плавный шаг к следующему кольцу
            if (!restSince) restSince = now;
            if (now - restSince > AUTO_STEP_MS) {
                restSince = 0;
                target = angle + normalize(frontAngle(frontIndex() + 1) - angle);
            }
            moving = true;
        }
        this.render();
        if (moving || dragging) frame = requestAnimationFrame(next => this.tick(next));
    },

    render() {
        if (!track) return;
        const front = frontIndex();
        rings.forEach((ring, i) => {
            const a = angle + i * STEP;
            const radians = a * Math.PI / 180;
            const depth = (Math.cos(radians) + 1) / 2; // 1 — впереди, 0 — сзади
            ring.style.transform = `rotateY(${a.toFixed(2)}deg) translateZ(var(--radius)) rotateY(${(-a).toFixed(2)}deg) scale(${(0.62 + depth * 0.38).toFixed(3)})`;
            ring.style.opacity = (0.35 + depth * 0.65).toFixed(3);
            ring.style.zIndex = String(Math.round(depth * 100));
            ring.style.filter = `brightness(${(0.6 + depth * 0.4).toFixed(3)})`; // дальние темнее, но не размыты
            ring.classList.toggle('is-front', i === front);
        });
        if (caption) {
            const medal = MEDALS[front];
            const state = playingIndex === front ? ' — now playing' : '';
            caption.textContent = `${medal.name} · track ${START_INDEX + front + 1}${state}`;
        }
    },
    // END SECTION 3

    // BEGIN SECTION 4 — мышь и палец
    bindDrag(root) {
        const stage = root.querySelector('.carousel-stage');
        if (!stage) return;
        let startX = 0, startAngle = 0, pointerId = null;
        stage.addEventListener('pointerdown', event => {
            pointerId = event.pointerId;
            startX = event.clientX;
            startAngle = angle;
            dragging = true;
            dragMoved = false;
            target = null;
            this.start();
        });
        window.addEventListener('pointermove', event => {
            if (!dragging || event.pointerId !== pointerId) return;
            const dx = event.clientX - startX;
            if (Math.abs(dx) > 6) dragMoved = true;
            angle = startAngle + dx * 0.4;
        });
        const end = event => {
            if (!dragging || event.pointerId !== pointerId) return;
            dragging = false;
            pointerId = null;
            if (dragMoved) this.rotateTo(frontIndex()); // доводим ближайшее кольцо вперёд
            setTimeout(() => { dragMoved = false; }, 0);
        };
        window.addEventListener('pointerup', end);
        window.addEventListener('pointercancel', end);
    },
    // END SECTION 4

    // BEGIN SECTION 5 — подсветка играющего трека
    syncLava(isPaused, currentTrackIndex) {
        const local = currentTrackIndex - START_INDEX;
        playingIndex = !isPaused && local >= 0 && local < rings.length ? local : -1;
        rings.forEach((ring, i) => {
            ring.classList.toggle('lava-active', i === playingIndex);
            ring.setAttribute('aria-pressed', String(i === playingIndex));
        });
        // Трек из карусели дошёл до очереди сам — выводим его кольцо вперёд
        if (playingIndex >= 0 && frontIndex() !== playingIndex) this.rotateTo(playingIndex);
        else this.render();
    }
    // END SECTION 5
};

let dragging = false, dragMoved = false;
