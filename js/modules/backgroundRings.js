// ФАЙЛ: js/modules/backgroundRings.js
// НАЗНАЧЕНИЕ: пятнадцать колец, которые хаотично плавают по экрану в одной плоскости (треки 6–20)
// и отскакивают друг от друга.
// РАЗДЕЛЫ: 1 настройки и алфавиты; 2 кометы; 3 создание колец; 4 движение и столкновения; 5 подсветка трека.
// Десять колец олимпийских цветов (по два каждого) и пять медальных: золото, серебро, бронза, лёд, огонь.
// Все кольца чёткие и полноцветные, лежат поверх страницы и нажимаются в любой момент. Наведённое кольцо
// останавливается и чуть увеличивается, чтобы по нему было легко попасть. Столкновения упругие, как у бильярдных
// шаров: лёгкое кольцо отлетает сильнее тяжёлого. Движение считается по прошедшему времени и пишется только
// в transform. На скрытой вкладке движение стоит, при «уменьшить анимацию» кольца неподвижны.
// У одноцветных колец свой «инопланетный» алфавит: время от времени по ободу пробегает короткая комета из его знаков.
import {paintRing} from './ringArt.js';

// BEGIN SECTION 1 — настройки и алфавиты
const container = document.querySelector('.flying-rings-container');
const START_INDEX = 5; // летающие кольца отвечают за треки с 6-го по 20-й
const RINGS = [
    'blue', 'black', 'red', 'yellow', 'green',
    'blue', 'black', 'red', 'yellow', 'green',
    'gold', 'silver', 'bronze', 'ice', 'flame'
];
const MEDAL_NAMES = {gold: 'Gold ring', silver: 'Silver ring', bronze: 'Bronze ring', ice: 'Ice ring', flame: 'Flame ring'};
// Размер — доля олимпийского кольца в центре: эмблема всегда самая крупная, остальные хорошо видны
const SIZE_SHARE = [0.48, 0.66];
const SPEED = [26, 48]; // пикселей в секунду
// Диаметр кольца эмблемы на текущем экране (он сам меняется в CSS на телефонах и низких экранах)
const emblemRing = () => document.querySelector('.rings-wrapper .ring')?.offsetWidth || 200;
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const rand = (min, max) => min + Math.random() * (max - min);
let ringsData = [];
let frame = 0;
let last = 0;
let placedWidth = 0; // ширина экрана, по которой кольца расставлены в последний раз

// Пары одного цвета — кольца i и i + 5. У каждого из десяти свой «нереальный» алфавит (древние и редкие
// системы письма), знаки которого ничего не означают. Медальные кольца и так различаются цветом.
const ALPHABETS = [
    {chars: 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ', font: '"Segoe UI Historic", "Noto Sans Runic", serif'},
    {chars: 'ⴰⴱⴳⴷⴹⴻⴼⴽⵀⵃⵄⵅⵇⵉⵊⵍⵎⵏⵓⵔⵕⵖⵙⵚⵛⵜⵟⵡⵢⵣ', font: 'Ebrima, "Noto Sans Tifinagh", sans-serif'},
    {chars: 'ᐁᐃᐅᐊᐯᐱᐳᐸᑌᑎᑐᑕᑫᑭᑯᑲᒉᒋᒍᒐᒣᒥᒧᒪ', font: 'Gadugi, "Noto Sans Canadian Aboriginal", sans-serif'},
    {chars: 'ᚁᚂᚃᚄᚅᚆᚇᚈᚉᚊᚋᚌᚍᚎᚏᚐᚑᚒᚓᚔ', font: '"Segoe UI Historic", "Noto Sans Ogham", serif'},
    {chars: 'ⰀⰁⰂⰃⰄⰅⰆⰇⰈⰉⰊⰋⰌⰍⰎⰏⰐⰑⰒⰓⰔⰕⰖⰗⰘ', font: '"Segoe UI Historic", "Noto Sans Glagolitic", serif'},
    {chars: 'ᎠᎡᎢᎣᎤᎥᎦᎧᎨᎩᎪᎫᎬᎭᎮᎯᎰᎱᎲᎳᎴᎵᎶᎷᎸ', font: 'Gadugi, "Noto Sans Cherokee", serif'},
    {chars: '⌬⌭⌮⍜⍝⍟⍦⍧⍨⍩⎈⎉⏣⏥⏧⌖⌘⍾', font: '"Segoe UI Symbol", "Noto Sans Symbols", monospace'},
    {chars: 'ꔀꔁꔂꔃꔄꔅꔆꔇꔈꔉꔊꔋꔌꔍꔎꔏꔐꔑ', font: 'Ebrima, "Noto Sans Vai", sans-serif'},
    {chars: 'ሀሁሂሃሄህሆለሉሊላሌልሎሐሑሒሓሔሕሖ', font: 'Nyala, Ebrima, "Noto Sans Ethiopic", serif'},
    {chars: '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠿⡇⢸⣿', font: '"Segoe UI Symbol", "Noto Sans Symbols 2", monospace'}
];
const COMET_LENGTH = 6;      // знаков в пробегающей «комете»
const COMET_RUN_MS = 2600;   // за сколько комета обегает кольцо
const randomGlyph = (glyphs) => glyphs[Math.floor(Math.random() * glyphs.length)];
const SVG_NS = 'http://www.w3.org/2000/svg';
// END SECTION 1

// BEGIN SECTION 2 — кометы
// Короткая «комета» из нескольких знаков на ободе кольца (SVG textPath). Голова яркая, хвост гаснет.
function engraving(i) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('ring-ticker');
    const path = document.createElementNS(SVG_NS, 'path');
    path.id = `ring-ticker-path-${i}`;
    path.setAttribute('d', 'M50 5 a45 45 0 1 1 -0.01 0'); // линия знаков чуть внутри: сами знаки ложатся на обод
    path.setAttribute('fill', 'none');
    const text = document.createElementNS(SVG_NS, 'text');
    text.style.fontFamily = ALPHABETS[i].font;
    const textPath = document.createElementNS(SVG_NS, 'textPath');
    textPath.setAttribute('href', `#${path.id}`);
    for (let k = 0; k < COMET_LENGTH; k++) {
        const glyph = document.createElementNS(SVG_NS, 'tspan');
        glyph.setAttribute('fill-opacity', String(((k + 1) / COMET_LENGTH).toFixed(2))); // хвост → голова
        textPath.appendChild(glyph);
    }
    text.appendChild(textPath);
    svg.append(path, text);
    return svg;
}

// Пробег: комета обегает кольцо, на бегу её знаки перебираются, в конце она исчезает
function runComet(ring, alphabet) {
    const textPath = ring.querySelector('textPath');
    const glyphs = Array.from(alphabet);
    const spans = [...textPath.children];
    const begin = performance.now();
    let lastSwap = 0;
    ring.classList.add('ticker-on');
    const step = (now) => {
        const progress = (now - begin) / COMET_RUN_MS;
        if (progress >= 1 || document.hidden) {
            ring.classList.remove('ticker-on');
            return;
        }
        textPath.setAttribute('startOffset', `${(progress * 100).toFixed(2)}%`);
        if (now - lastSwap > 90) {           // перебор знаков, как бегущая строка
            lastSwap = now;
            spans.forEach(span => { span.textContent = randomGlyph(glyphs); });
        }
        requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// Время от времени, у каждого кольца в своё время
function scheduleTicker(ring, alphabet) {
    setTimeout(() => {
        if (!document.hidden && !motion.matches) runComet(ring, alphabet);
        scheduleTicker(ring, alphabet);
    }, rand(8000, 22000));
}
// END SECTION 2

export const backgroundRings = {
    // BEGIN SECTION 3 — создание колец
    init(onRingClickCallback) {
        if (!container) return;
        container.replaceChildren();
        ringsData = [];
        const base = emblemRing();
        RINGS.forEach((colour, i) => {
            const share = rand(SIZE_SHARE[0], SIZE_SHARE[1]);
            const size = Math.round(share * base);
            const trackIndex = START_INDEX + i;
            const ring = document.createElement('button');
            ring.type = 'button';
            ring.className = `flying-ring tube ${colour}`;
            ring.style.setProperty('--size', `${size}px`);
            const name = MEDAL_NAMES[colour] ? `${MEDAL_NAMES[colour]}: play` : 'Play';
            ring.setAttribute('aria-label', `${name} or pause track ${trackIndex + 1}`);
            ring.setAttribute('aria-pressed', 'false');
            // Enter и пробел у настоящей кнопки работают сами
            ring.addEventListener('click', event => {
                event.stopPropagation();
                onRingClickCallback(trackIndex);
            });
            const data = {element: ring, trackIndex, size, share, hovered: false, x: 0, y: 0, vx: 0, vy: 0,
                bobPhase: rand(0, Math.PI * 2)};
            // Наведённое (или выбранное с клавиатуры) кольцо замирает, чтобы по нему было легко попасть
            ring.addEventListener('pointerenter', () => { data.hovered = true; });
            ring.addEventListener('pointerleave', () => { data.hovered = false; });
            ring.addEventListener('focus', () => { data.hovered = true; });
            ring.addEventListener('blur', () => { data.hovered = false; });
            paintRing(ring, colour, 0.09); // объёмный обод в SVG
            if (i < ALPHABETS.length) {
                ring.appendChild(engraving(i));
                scheduleTicker(ring, ALPHABETS[i].chars);
            }
            container.appendChild(ring);
            this.place(data);
            const angle = rand(0, Math.PI * 2), speed = rand(SPEED[0], SPEED[1]);
            data.vx = Math.cos(angle) * speed;
            data.vy = Math.sin(angle) * speed;
            ringsData.push(data);
        });
        placedWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            const size = emblemRing();
            // Страница открылась в свёрнутом окне (ширина почти ноль) — расставляем кольца заново по всему экрану
            const replace = placedWidth < 300 && window.innerWidth >= 300;
            const placed = [];
            for (const ring of ringsData) {
                ring.size = Math.round(ring.share * size);
                ring.element.style.setProperty('--size', `${ring.size}px`);
                if (replace) this.place(ring, placed);
                placed.push(ring);
                ring.x = Math.min(ring.x, Math.max(0, window.innerWidth - ring.size));
                ring.y = Math.min(ring.y, Math.max(0, window.innerHeight - ring.size));
            }
            placedWidth = window.innerWidth;
            this.render(performance.now());
        }, {passive: true});
        document.addEventListener('visibilitychange', () => this.start());
        motion.addEventListener('change', () => this.start());
        this.render(performance.now());
        this.start();
    },

    // Случайное место, не налезающее на уже расставленные кольца
    place(data, others = ringsData) {
        const w = window.innerWidth, h = window.innerHeight;
        for (let attempt = 0; attempt < 40; attempt++) {
            data.x = rand(0, Math.max(1, w - data.size));
            data.y = rand(0, Math.max(1, h - data.size));
            const free = others.every(other => {
                const dx = (data.x + data.size / 2) - (other.x + other.size / 2);
                const dy = (data.y + data.size / 2) - (other.y + other.size / 2);
                return Math.hypot(dx, dy) > (data.size + other.size) / 2;
            });
            if (free) return;
        }
    },
    // END SECTION 3

    // BEGIN SECTION 4 — движение и столкновения
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
            if (ring.hovered) continue;
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
        this.collide();
        this.render(now);
        frame = requestAnimationFrame(next => this.tick(next));
    },

    // Упругие столкновения кругов: масса пропорциональна площади кольца, наведённое кольцо — неподвижная «стена»
    collide() {
        for (let i = 0; i < ringsData.length; i++) {
            for (let j = i + 1; j < ringsData.length; j++) {
                const a = ringsData[i], b = ringsData[j];
                const dx = (b.x + b.size / 2) - (a.x + a.size / 2);
                const dy = (b.y + b.size / 2) - (a.y + a.size / 2);
                const distance = Math.hypot(dx, dy) || 0.001;
                const minimum = (a.size + b.size) / 2;
                if (distance >= minimum) continue;
                const nx = dx / distance, ny = dy / distance;
                const ma = a.size * a.size, mb = b.size * b.size;
                // Раздвигаем, чтобы кольца не слипались; неподвижное кольцо не сдвигается
                const overlap = minimum - distance;
                const pushA = a.hovered ? 0 : b.hovered ? 1 : mb / (ma + mb);
                a.x -= nx * overlap * pushA;
                a.y -= ny * overlap * pushA;
                b.x += nx * overlap * (1 - pushA);
                b.y += ny * overlap * (1 - pushA);
                // Обмен импульсом вдоль линии центров
                const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
                if (relative >= 0) continue; // уже разлетаются
                if (a.hovered) { b.vx -= 2 * relative * nx; b.vy -= 2 * relative * ny; continue; }
                if (b.hovered) { a.vx += 2 * relative * nx; a.vy += 2 * relative * ny; continue; }
                const impulse = (2 * relative) / (ma + mb);
                a.vx += impulse * mb * nx;
                a.vy += impulse * mb * ny;
                b.vx -= impulse * ma * nx;
                b.vy -= impulse * ma * ny;
            }
        }
    },

    render(now) {
        const t = now / 1000;
        const still = motion.matches;
        for (const ring of ringsData) {
            const bob = still || ring.hovered ? 0 : Math.sin(t * 0.9 + ring.bobPhase) * 4; // лёгкое покачивание
            ring.element.style.transform = `translate3d(${ring.x.toFixed(1)}px, ${(ring.y + bob).toFixed(1)}px, 0)`;
        }
    },
    // END SECTION 4

    // BEGIN SECTION 5 — подсветка играющего трека
    syncLava(isPaused, currentTrackIndex) {
        ringsData.forEach(ring => {
            const active = !isPaused && ring.trackIndex === currentTrackIndex;
            ring.element.classList.toggle('lava-active', active);
            ring.element.setAttribute('aria-pressed', String(active));
        });
    }
    // END SECTION 5
};
