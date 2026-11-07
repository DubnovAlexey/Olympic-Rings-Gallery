// ФАЙЛ: js/modules/beat.js
// НАЗНАЧЕНИЕ: один общий ритм для всего, что пульсирует под музыку (Зойч, кольца, магма по краям).
// Часы ритма запускаются вместе с музыкой. Кольцо, которое загорелось позже, не прыгает в середину волны:
// оно сразу светится, а расти начинает с ближайшего «выдоха», вместе со всеми. Поэтому всё дышит в один такт,
// без сбоев и рывков.

let origin = null; // когда началась пульсация (null — музыка молчит)

// Длительность одного вдоха (и одного выдоха) берётся из CSS (--beat в css/style.css)
const beatMs = () => (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--beat')) || 1.3) * 1000;

// Встроить элемент (и всё, что внутри него) в общий ритм
export function joinBeat(element) {
    if (!element) return;
    const now = performance.now();
    if (origin === null) origin = now;            // первый, кто начал пульсировать, запускает часы
    const cycle = beatMs() * 2;                   // вдох + выдох
    const passed = (now - origin) % cycle;
    const delay = passed < 60 ? -passed : cycle - passed; // только что начали — сразу; иначе ждём начала волны
    element.style.setProperty('--beat-delay', `${delay.toFixed(0)}ms`);
}

// Музыка остановилась — следующий запуск начнёт ритм заново
export function stopBeat() { origin = null; }

// Пульсация закончилась — элемент плавно опускается в обычный размер, а не падает в него одним кадром.
// Текущий размер на кадр закрепляется прямо на элементе, потом CSS-переход (transition) возвращает его.
export function settle(element, property) {
    if (!element) return;
    const value = getComputedStyle(element)[property];
    if (!value || value === 'none') return;
    element.style[property] = value;
    requestAnimationFrame(() => requestAnimationFrame(() => { element.style[property] = ''; }));
}

// Свечение гаснет плавно с того места, где его застала остановка (иначе оно пропадает одним кадром).
// pseudoElement — '::before' или '::after', если свечение нарисовано на псевдоэлементе.
export function fadeOut(element, pseudoElement) {
    if (!element?.animate) return;
    const from = Number(getComputedStyle(element, pseudoElement || null).opacity);
    if (!from) return;
    try {
        element.animate([{opacity: from}, {opacity: 0}], {duration: 700, easing: 'ease-out', ...(pseudoElement ? {pseudoElement} : {})});
    } catch { /* старый браузер: свечение просто погаснет */ }
}
