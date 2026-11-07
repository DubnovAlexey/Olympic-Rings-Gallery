import {fadeOut, joinBeat, settle, stopBeat} from './beat.js';

const icon = document.getElementById('zoich');
const rings = document.querySelectorAll('.ring');
const body = document.body;

export const uiController = {
    // Подсветка активных элементов в зависимости от состояния плеера.
    // Класс меняется только у тех, чьё состояние правда изменилось: уже пульсирующее кольцо не перезапускается.
    syncLava(isPaused, currentTrackIndex) {
        rings.forEach((ring, index) => {
            // Трек 1–5 — светится своё олимпийское кольцо; треки других колец зажигают всю эмблему
            const lit = !isPaused && (currentTrackIndex >= 5 || currentTrackIndex === index);
            const wasLit = ring.classList.contains('lava-active');
            if (lit && !wasLit) joinBeat(ring);
            if (!lit && wasLit) { settle(ring, 'scale'); fadeOut(ring, '::before'); }
            ring.classList.toggle('lava-active', lit);
            ring.setAttribute('aria-pressed', String(!isPaused && currentTrackIndex === index));
        });

        if (!isPaused && !icon.classList.contains('playing')) {
            joinBeat(icon.parentElement);                   // Зойч и огонь вокруг него
            joinBeat(document.querySelector('.magma-frame')); // свечение по краям экрана
        }
        if (isPaused && icon.classList.contains('playing')) {      // музыка остановилась: всё плавно затихает
            settle(icon, 'scale');
            fadeOut(icon.parentElement, '::after');                 // огонь вокруг Зойча
            fadeOut(document.querySelector('.magma-frame'));        // магма по краям экрана
            stopBeat();
        }
        icon.classList.toggle('playing', !isPaused);
        body.classList.toggle('lava-music-active', !isPaused);
    },

    // Регистрация кликов по кольцам
    bindRingClicks(callback) {
        rings.forEach((ring, index) => {
            ring.tabIndex = 0;
            ring.setAttribute('role', 'button');
            ring.setAttribute('aria-label', `Play or pause track ${index + 1}`);
            ring.setAttribute('aria-pressed', 'false');
            ring.addEventListener('click', () => callback(index));
            ring.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback(index); }
            });
        });
    },

    // Регистрация клика по Зойчу
    bindZoichClick(callback) {
        icon.tabIndex = 0;
        icon.setAttribute('role', 'button');
        icon.setAttribute('aria-label', 'Play or stop the current track');
        icon.addEventListener('click', callback);
        icon.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback(); }
        });
    }
};