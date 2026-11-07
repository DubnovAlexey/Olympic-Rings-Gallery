// ФАЙЛ: js/main.js
// НАЗНАЧЕНИЕ: связывает плеер с кольцами: олимпийская эмблема (треки 1–5) и пятнадцать колец, которые
// плавают по экрану (6–20); Зойч запускает и останавливает музыку.
import {audioPlayer} from './modules/audioPlayer.js';
import {uiController} from './modules/uiController.js';
import {backgroundRings} from './modules/backgroundRings.js';
import {paintEmblem} from './modules/ringArt.js';
import {beatPulse} from './modules/beatPulse.js';

audioPlayer.init();
paintEmblem();
beatPulse.init();

// Подсветка всех колец следует за реальным состоянием плеера, даже если старое play() завершилось позднее
const syncPlayerVisuals = () => {
    const paused = audioPlayer.isPaused();
    const index = audioPlayer.getCurrentIndex();
    uiController.syncLava(paused, index);
    backgroundRings.syncLava(paused, index);
    const status = audioPlayer.getPlaybackStatus?.();
    const mascot = document.getElementById('zoich');
    if (mascot) {
        mascot.classList.toggle('loading', status === 'loading'); // трек ещё грузится — Зойч мягко светится
        const label = status === 'unavailable' ? 'Audio unavailable. Select a ring to retry.'
            : status === 'blocked' ? 'Enable audio with a click or key press.' : 'Play or stop the current track';
        mascot.setAttribute('aria-label', label);
        mascot.setAttribute('title', label);
    }
};
// Ошибки media и остановка после обхода плейлиста обновляют то же видимое состояние, что и клик
audioPlayer.onPlaybackStateChange?.(syncPlayerVisuals);

// Прерванный запуск (play() перебит паузой или другим треком) — обычное дело, а не ошибка
const reportPlayError = (where) => (err) => {
    syncPlayerVisuals();
    if (err?.name !== 'AbortError') console.warn(where, err);
};
const loading = () => audioPlayer.getPlaybackStatus?.() === 'loading';

// Любое кольцо: свой трек играет — пауза, иначе включаем этот трек.
// Пока свой трек ещё грузится, повторное нажатие ничего не обрывает.
const handlePlayTrack = (index) => {
    beatPulse.wake(); // пульсация в такт: звук через Web Audio разрешён только в жесте пользователя
    const isCurrent = audioPlayer.getCurrentIndex() === index;
    if (isCurrent && loading()) return;
    if (isCurrent && !audioPlayer.isPaused()) {
        audioPlayer.pause();
        syncPlayerVisuals();
    } else {
        audioPlayer.play(index).then(syncPlayerVisuals).catch(reportPlayError('Error playing track:'));
    }
};

backgroundRings.init(handlePlayTrack);
uiController.bindRingClicks(handlePlayTrack);

// Зойч — общий старт/стоп текущего трека
uiController.bindZoichClick(() => {
    beatPulse.wake();
    if (loading()) return; // музыка уже запускается — второй щелчок её не обрывает
    if (audioPlayer.isPaused()) {
        audioPlayer.play().then(syncPlayerVisuals).catch(reportPlayError('Browser blocked Zoich interaction:'));
    } else {
        audioPlayer.stop();
        syncPlayerVisuals();
    }
});

// Трек закончился — играет следующий по списку (после 20-го снова первый)
audioPlayer.onTrackEnded((nextIndex) => {
    audioPlayer.play(nextIndex).then(syncPlayerVisuals).catch(error => {
        syncPlayerVisuals();
        console.warn('The next track could not start:', error);
    });
});
