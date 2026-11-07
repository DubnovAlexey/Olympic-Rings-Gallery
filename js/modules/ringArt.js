// ФАЙЛ: js/modules/ringArt.js
// НАЗНАЧЕНИЕ: объёмный рисунок кольца в SVG. Обод — градиент от светлого блика (сверху слева) через основной
// цвет к тени (снизу справа), поверх — узкий блеск. SVG браузер сглаживает сам, поэтому край чистый и резкий.
// РАЗДЕЛЫ: 1 цвета; 2 рисунок одного кольца; 3 эмблема с переплетением.

// BEGIN SECTION 1 — цвета
const BASE = {
    blue: '#0081c8', black: '#1d1d1f', red: '#ee334e', yellow: '#fcb131', green: '#00a651',
    gold: '#d4a017', silver: '#aeb8c2', bronze: '#b06a35', ice: '#5cc8f5', flame: '#ff5a1f'
};
const SVG_NS = 'http://www.w3.org/2000/svg';
let uid = 0;

// Смешивает цвет с белым (amount > 0) или чёрным (amount < 0)
function shade(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const channels = [n >> 16, (n >> 8) & 255, n & 255].map(c =>
        Math.round(amount > 0 ? c + (255 - c) * amount : c * (1 + amount)));
    return `#${channels.map(c => c.toString(16).padStart(2, '0')).join('')}`;
}
// END SECTION 1

// BEGIN SECTION 2 — рисунок одного кольца
// strokeShare — толщина обода как доля диаметра (эмблема 0.075, летающие кольца 0.09)
export function ringSvg(colour, strokeShare) {
    const base = BASE[colour] || '#888888';
    const id = `ring-art-${uid++}`;
    const width = strokeShare * 100;
    const radius = 50 - width / 2;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('ring-art');
    const light = colour === 'black' ? '#7b7f8c' : shade(base, 0.55);
    const dark = colour === 'black' ? '#000000' : shade(base, -0.45);
    svg.innerHTML = // постоянная разметка из чисел и цветов этого файла, без данных пользователя
        `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0" stop-color="${light}"/><stop offset=".42" stop-color="${base}"/>` +
        `<stop offset=".7" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>` +
        `<circle cx="50" cy="50" r="${radius}" fill="none" stroke="url(#${id})" stroke-width="${width}"/>` +
        // узкий блеск на верхней левой четверти — «металл» и объём
        `<circle cx="50" cy="50" r="${radius - width * 0.18}" fill="none" stroke="rgba(255,255,255,.55)" ` +
        `stroke-width="${width * 0.22}" stroke-linecap="round" pathLength="100" stroke-dasharray="16 84" ` +
        `stroke-dashoffset="-56"/>` +
        // тонкая тёмная линия по внутреннему краю — обод кажется трубкой, а не плоской лентой
        `<circle cx="50" cy="50" r="${radius - width / 2 + 0.4}" fill="none" stroke="rgba(0,0,0,.22)" stroke-width=".8"/>`;
    return svg;
}

export function paintRing(element, colour, strokeShare) {
    element.prepend(ringSvg(colour, strokeShare));
}
// END SECTION 2

// BEGIN SECTION 3 — эмблема с переплетением
// Верхние кольца повторно рисуют короткие дуги поверх нижних — так кольца «сплетаются», как на эмблеме
const WEAVE = {
    blue: ['inset(45% 30% 25% 35%)'],
    black: ['inset(60% 60% 5% 5%)', 'inset(45% 30% 25% 35%)'],
    red: ['inset(60% 60% 5% 5%)']
};

export function paintEmblem() {
    document.querySelectorAll('.rings-wrapper .ring').forEach(ring => {
        const colour = ['blue', 'black', 'red', 'yellow', 'green'].find(name => ring.classList.contains(name));
        paintRing(ring, colour, 0.075);
        (WEAVE[colour] || []).forEach(clip => {
            const piece = document.createElement('span');
            piece.className = 'weave';
            piece.style.clipPath = clip;
            piece.appendChild(ringSvg(colour, 0.075));
            ring.appendChild(piece);
        });
    });
}
// END SECTION 3
