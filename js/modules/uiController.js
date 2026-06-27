const icon = document.getElementById('zoich');
const rings = document.querySelectorAll('.ring');
const body = document.body;

export const uiController = {
    // Подсветка активных элементов в зависимости от состояния плеера
    syncLava(isPaused, currentTrackIndex) {
        // Сначала полностью очищаем лаву со всех олимпийских колец
        rings.forEach(ring => ring.classList.remove('lava-active'));

        if (!isPaused) {
            // Если индекс трека от 0 до 4 — это оригинальное олимпийское кольцо
            if (currentTrackIndex < 5) {
                if (rings[currentTrackIndex]) {
                    rings[currentTrackIndex].classList.add('lava-active');
                }
            } else {
                // Если индекс 5 и выше (летающее кольцо) — зажигаем ВСЕ 5 колец одновременно!
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
            ring.addEventListener('click', () => callback(index));
        });
    },

    // Регистрация клика по Зойчу
    bindZoichClick(callback) {
        icon.addEventListener('click', callback);
    }
};