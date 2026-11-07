// ФАЙЛ: js/modules/beatPulse.js
// НАЗНАЧЕНИЕ: пульсация в такт музыке. Web Audio слушает басы играющего трека и пишет две CSS-переменные
// только тем элементам, которые пульсируют (Зойч, играющие кольца, огненная рамка), — не всей странице:
// изменение переменной у <body> заставляло браузер каждый кадр пересчитывать стили всей страницы, отсюда подвисания.
//   --beat  — короткий толчок на сильной доле (1 → плавно к 0), им пульсируют Зойч и играющее кольцо;
//   --level — сглаженная громкость басов (0…1), от неё разгорается свечение.
// РАЗДЕЛЫ: 1 подключение анализатора; 2 поиск сильной доли; 3 жизненный цикл.
// Пока анализатор не слышит музыку (или при «уменьшить анимацию»), страница пульсирует прежними CSS-анимациями.
// Звук идёт по цепочке <audio> → анализатор → динамики, поэтому контекст будим в жесте пользователя (wake).

// BEGIN SECTION 1 — подключение анализатора
const audio = document.getElementById('my-audio');
const body = document.body;
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let context = null, analyser = null, samples = null, frame = 0, failed = false;
let average = 0, beat = 0, target = 0, level = 0, lastBeat = 0, lastSound = 0;

function connect() {
    if (context || failed || !audio) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        context = new AudioContextClass();
        const source = context.createMediaElementSource(audio);
        source.connect(context.destination);          // звук идёт в динамики как прежде
        const bass = context.createBiquadFilter();    // отдельная ветка: только басы ниже 150 Гц
        bass.type = 'lowpass';
        bass.frequency.value = 150;
        analyser = context.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(bass).connect(analyser);
        samples = new Float32Array(analyser.fftSize);
    } catch (error) {
        failed = true;          // нет Web Audio — остаётся пульсация по CSS
        context = null;
        console.warn('Beat sync is unavailable:', error);
    }
}
// END SECTION 1

// BEGIN SECTION 2 — поиск сильной доли
// Линейная энергия басов (ниже 150 Гц) сравнивается со своим скользящим средним: резкий скачок — это удар.
// Пороги проверены на треках плейлиста (OfflineAudioContext): удары находятся в темпе музыки.
function tick(now) {
    frame = 0;
    if (!analyser || audio.paused || document.hidden) { relax(); return; }
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
    const energy = sum / samples.length;              // средний квадрат — энергия басов в этом кадре
    // Слышим музыку — пульсируем в такт; полторы секунды тишины (беззвучно, тихое вступление) —
    // возвращаем прежнюю пульсацию по таймеру, чтобы Зойч не замирал
    if (energy > 1e-4) lastSound = now;
    const live = now - lastSound < 1500;
    if (live !== body.classList.contains('beat-sync')) body.classList.toggle('beat-sync', live); // только при смене
    average += (energy - average) * 0.05;
    level += (Math.min(1, Math.sqrt(energy) * 4) - level) * 0.25;
    if (energy > average * 1.5 && energy > 2e-4 && now - lastBeat > 230) {
        target = 1;
        lastBeat = now;
    }
    // Мягкий толчок: быстро нарастает и плавно спадает — без резких скачков, которые выглядят как дрожь
    beat += (target - beat) * 0.35;
    target *= 0.82;
    paint(beat.toFixed(3), level.toFixed(3));
    frame = requestAnimationFrame(tick);
}

// Пишем значения только пульсирующим элементам; тем, кто перестал пульсировать, убираем их
let painted = new Set();
function paint(beatValue, levelValue) {
    const now = new Set(document.querySelectorAll('.zoich.playing, .ring.lava-active, .flying-ring.lava-active, .magma-frame'));
    for (const element of painted) {
        if (!now.has(element)) { element.style.removeProperty('--beat'); element.style.removeProperty('--level'); }
    }
    for (const element of now) {
        element.style.setProperty('--beat', beatValue);
        element.style.setProperty('--level', levelValue);
    }
    painted = now;
}

function relax() {
    beat = 0;
    target = 0;
    body.classList.remove('beat-sync');
    for (const element of painted) { element.style.removeProperty('--beat'); element.style.removeProperty('--level'); }
    painted = new Set();
}
// END SECTION 2

// BEGIN SECTION 3 — жизненный цикл
function start() {
    if (frame || !analyser || motion.matches) return;
    frame = requestAnimationFrame(tick);
}

export const beatPulse = {
    // Вызывается прямо в обработчике клика: только так браузер разрешает запустить звук через Web Audio
    wake() {
        if (motion.matches) return;
        connect();
        if (context && context.state === 'suspended') context.resume().catch(() => {});
    },

    init() {
        if (!audio) return;
        audio.addEventListener('playing', () => {
            if (context && context.state === 'suspended') context.resume().catch(() => {});
            start();
        });
        audio.addEventListener('pause', relax);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
        motion.addEventListener('change', () => {
            if (motion.matches) relax();
            else start();
        });
    }
};
// END SECTION 3
