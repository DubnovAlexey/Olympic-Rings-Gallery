const icon = document.getElementById('zoich');
const rings = document.querySelectorAll('.ring');
const body = document.body;

export const uiController = {
    // Подсветка активных элементов в зависимости от состояния плеера
    syncLava(isPaused, currentTrackIndex) {
        // Сначала полностью очищаем лаву со всех олимпийских колец
        rings.forEach((ring, index) => {
            ring.classList.remove('lava-active');
            ring.setAttribute('aria-pressed', String(!isPaused && currentTrackIndex === index));
        });

        if (!isPaused) {
            // Трек 1–5 — светится своё олимпийское кольцо; треки других колец зажигают всю эмблему
            if (currentTrackIndex < 5) {
                if (rings[currentTrackIndex]) {
                    rings[currentTrackIndex].classList.add('lava-active');
                }
            } else {
                rings.forEach(ring => ring.classList.add('lava-active'));
            }

            icon.classList.add('playing');
            body.classList.add('lava-music-active');
        } else {
            icon.classList.remove('playing');
            body.classList.remove('lava-music-active');
        }
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