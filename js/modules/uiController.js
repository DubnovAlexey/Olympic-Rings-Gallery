const icon = document.getElementById('zoich');
const rings = document.querySelectorAll('.ring');
const body = document.body;

export const uiController = {
    // Подсветка активных элементов в зависимости от состояния плеера
    syncLava(isPaused, currentTrackIndex) {
        rings.forEach(ring => ring.classList.remove('lava-active'));

        if (!isPaused) {
            rings[currentTrackIndex].classList.add('lava-active');
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
            ring.addEventListener('click', () => callback(index));
        });
    },

    // Регистрация клика по Зойчу
    bindZoichClick(callback) {
        icon.addEventListener('click', callback);
    }
};