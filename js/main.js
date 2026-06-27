import {audioPlayer} from './modules/audioPlayer.js';
import {uiController} from './modules/uiController.js';
import {backgroundRings} from './modules/backgroundRings.js';

// Инициализируем плеер при старте
audioPlayer.init();

// Общая функция для запуска любого трека (хоть статичного, хоть летающего)
const handlePlayTrack = (index) => {
    const isCurrent = audioPlayer.getCurrentIndex() === index;

    // Если кликнули на текущий играющий трек — ставим на паузу
    if (isCurrent && !audioPlayer.isPaused()) {
        audioPlayer.pause();
        // Гасим лаву и на олимпийских, и на фоновых кольцах
        uiController.syncLava(true, index);
        backgroundRings.syncLava(true, index);
    } else {
        // Во всех остальных случаях — гарантированно включаем звук
        audioPlayer.play(index).then(() => {
            // Зажигаем лаву там, где нужно
            uiController.syncLava(false, index);
            backgroundRings.syncLava(false, index);
        }).catch(err => {
            console.error("Error playing track:", err);
        });
    }
};

// 1. Инициализируем летающие кольца и передаем им общее действие при клике
backgroundRings.init((clickedTrackIndex) => {
    handlePlayTrack(clickedTrackIndex);
});

// 2. Связываем клики по олимпийским кольцам с общей логикой
uiController.bindRingClicks((clickedIndex) => {
    handlePlayTrack(clickedIndex);
});

// 3. Связываем клик по Зойчу с Мастер-логикой (Старт/Стоп)
uiController.bindZoichClick(() => {
    const currentIndex = audioPlayer.getCurrentIndex();

    if (audioPlayer.isPaused()) {
        // Если плеер стоял на паузе — запускаем текущий сохранённый трек
        audioPlayer.play().then(() => {
            uiController.syncLava(false, currentIndex);
            backgroundRings.syncLava(false, currentIndex);
        }).catch(err => {
            console.error("Browser blocked Zoich interaction:", err);
        });
    } else {
        // Если играл — полностью останавливаем всё
        audioPlayer.stop();
        uiController.syncLava(true, currentIndex);
        backgroundRings.syncLava(true, currentIndex);
    }
});

// 4. Отслеживаем автоматическое окончание трека
audioPlayer.onTrackEnded((nextIndex) => {
    audioPlayer.play(nextIndex).then(() => {
        uiController.syncLava(false, nextIndex);
        backgroundRings.syncLava(false, nextIndex);
    });
});