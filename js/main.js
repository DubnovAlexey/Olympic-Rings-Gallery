const icon = document.getElementById('zoich');
const audio = document.getElementById('my-audio');
const rings = document.querySelectorAll('.ring');

const playlist = [
    "music/track1.mp3",
    "music/track2.mp3",
    "music/track3.mp3",
    "music/track4.mp3",
    "music/track5.mp3"
];

let currentTrackIndex = 0;

function loadTrack(index) {
    audio.src = playlist[index];
}

/* --- ЦЕНТРАЛЬНОЕ УПРАВЛЕНИЕ ВСЕЙ ЛАВОЙ НА СТРАНИЦЕ --- */
function syncLavaWithTrack() {
    rings.forEach(ring => ring.classList.remove('lava-active'));

    if (!audio.paused) {
        rings[currentTrackIndex].classList.add('lava-active');
        icon.classList.add('playing');
        document.body.classList.add('lava-music-active');
    } else {
        icon.classList.remove('playing');
        document.body.classList.remove('lava-music-active');
    }
}

// Инициализируем первый трек при загрузке страницы
loadTrack(currentTrackIndex);

// Клик по кольцам (пульт управления)
rings.forEach((ring, index) => {
    ring.addEventListener('click', () => {
        if (currentTrackIndex === index) {
            if (audio.paused) {
                // Если трек тот же, но стоял на паузе — подстрахуемся и перезагрузим src для браузера
                loadTrack(currentTrackIndex);
                audio.play().catch(err => console.log("Ошибка воспроизведения кольца:", err));
            } else {
                return; // Если уже играет, ничего не делаем
            }
        } else {
            // Переключение на другое кольцо
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            audio.play().catch(err => console.log("Ошибка воспроизведения кольца:", err));
        }
        syncLavaWithTrack();
    });
});

// Клик по Зойчу (Мастер-кнопка Пауза/Старт)
icon.addEventListener('click', () => {
    if (audio.paused) {
        // ЖЕСТКАЯ ПОДСТРАХОВКА: перед запуском обновляем src текущего трека.
        // Это заставляет браузер понять, что запуск происходит СЕЙЧАС от клика пользователя.
        loadTrack(currentTrackIndex);

        audio.play()
            .then(() => {
                syncLavaWithTrack();
            })
            .catch(err => {
                console.error("Браузер заблокировал Зойча:", err);
            });
    } else {
        // Если музыка ИГРАЕТ, Зойч сбрасывает её в ноль и останавливает
        audio.pause();
        audio.currentTime = 0;
        syncLavaWithTrack();
    }
});

// Авто переключение треков по окончании
audio.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audio.play().catch(err => console.log("Ошибка авто переключения:", err));
    syncLavaWithTrack();
});