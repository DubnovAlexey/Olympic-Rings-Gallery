import { audioPlayer } from './modules/audioPlayer.js';
import { uiController } from './modules/uiController.js';

// Инициализируем плеер при старте
audioPlayer.init();

// Связываем клики по кольцам с логикой плеера
uiController.bindRingClicks(async (clickedIndex) => {
    const isCurrent = audioPlayer.getCurrentIndex() === clickedIndex;

    // Если кликнули на текущее кольцо И оно СЕЙЧАС ИГРАЕТ — ставим на паузу
    if (isCurrent && !audioPlayer.isPaused()) {
        audioPlayer.pause();
        uiController.syncLava(true, clickedIndex);
    } else {
        // try/catch для линейного чтения кода
        try {
            await audioPlayer.play(clickedIndex);
            uiController.syncLava(false, clickedIndex);
        } catch (err) {
            console.error("Error playing ring track:", err);
        }
    }
});

// Связываем клик по Зойчу с Мастер-логикой (Старт/Стоп)
uiController.bindZoichClick(async () => {
    if (audioPlayer.isPaused()) {
        try {
            await audioPlayer.play();
            uiController.syncLava(false, audioPlayer.getCurrentIndex());
        } catch (err) {
            console.error("Browser blocked Zoich interaction:", err);
        }
    } else {
        // Если играл — полностью останавливаем
        audioPlayer.stop();
        uiController.syncLava(true, audioPlayer.getCurrentIndex());
    }
});

// Отслеживаем автоматическое окончание трека
audioPlayer.onTrackEnded(async (nextIndex) => {
    try {
        await audioPlayer.play(nextIndex);
        uiController.syncLava(false, nextIndex);
    } catch (err) {
        console.error("Error on track auto-advance:", err);
    }
});