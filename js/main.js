// ФАЙЛ: js/main.js
// НАЗНАЧЕНИЕ: связывает плеер с тремя группами колец: олимпийская эмблема (треки 1–5),
// летающие кольца (6–15) и медальная карусель (16–20); Зойч запускает и останавливает музыку.
import {audioPlayer} from './modules/audioPlayer.js';
import {uiController} from './modules/uiController.js';
import {backgroundRings} from './modules/backgroundRings.js';
import {medalCarousel} from './modules/medalCarousel.js';
import {beatPulse} from './modules/beatPulse.js';

audioPlayer.init();
beatPulse.init();

// Подсветка всех колец следует за реальным состоянием плеера, даже если старое play() завершилось позднее
const syncPlayerVisuals = () => {
    const paused = audioPlayer.isPaused();
    const index = audioPlayer.getCurrentIndex();
    uiController.syncLava(paused, index);
    backgroundRings.syncLava(paused, index);
    medalCarousel.syncLava(paused, index);
    const status = audioPlayer.getPlaybackStatus?.();
    const mascot = document.getElementById('zoich');
    if (mascot) {
        const label = status === 'unavailable' ? 'Audio unavailable. Select a ring to retry.'
            : status === 'blocked' ? 'Enable audio with a click or key press.' : 'Play or stop the current track';
        mascot.setAttribute('aria-label', label);
        mascot.setAttribute('title', label);
    }
};
// Ошибки media и остановка после обхода плейлиста обновляют то же видимое состояние, что и клик
audioPlayer.onPlaybackStateChange?.(syncPlayerVisuals);

// Любое кольцо: свой трек играет — пауза, иначе включаем этот трек
const handlePlayTrack = (index) => {
    beatPulse.wake(); // пульсация в такт: звук через Web Audio разрешён только в жесте пользователя
    const isCurrent = audioPlayer.getCurrentIndex() === index;
    if (isCurrent && (!audioPlayer.isPaused() || audioPlayer.getPlaybackStatus?.() === 'loading')) {
        audioPlayer.pause();
        syncPlayerVisuals();
    } else {
        audioPlayer.play(index).then(syncPlayerVisuals).catch(err => {
            syncPlayerVisuals();
            console.error('Error playing track:', err);
        });
    }
};

backgroundRings.init(handlePlayTrack);
medalCarousel.init(handlePlayTrack);
uiController.bindRingClicks(handlePlayTrack);

// Зойч — общий старт/стоп текущего трека
uiController.bindZoichClick(() => {
    beatPulse.wake();
    if (audioPlayer.isPaused() && audioPlayer.getPlaybackStatus?.() !== 'loading') {
        audioPlayer.play().then(syncPlayerVisuals).catch(err => {
            syncPlayerVisuals();
            console.error('Browser blocked Zoich interaction:', err);
        });
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
