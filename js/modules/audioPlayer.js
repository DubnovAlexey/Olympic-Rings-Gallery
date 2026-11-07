// ФАЙЛ: js/modules/audioPlayer.js
// НАЗНАЧЕНИЕ: Последовательное воспроизведение, пользовательская пауза и ограниченный обход media-ошибок.
// РАЗДЕЛЫ: Состояние; статус/переход; media listeners; публичное управление.
import { playlist } from './playlist.js';

const audio = document.getElementById('my-audio');
let currentTrackIndex = 0;
let wantedPlaying = false;
let playbackGeneration = 0;
let errorAdvanceTimer = null;
let automaticAdvance = false;
let listenersBound = false;
let endedCallback = null;
let stateCallback = null;
let playbackStatus = 'idle';
const failedTracks = new Set();

// НАЧАЛО ФУНКЦИИ cancelErrorAdvance
function cancelErrorAdvance() {
    if (errorAdvanceTimer !== null) clearTimeout(errorAdvanceTimer);
    errorAdvanceTimer = null;
}
// КОНЕЦ ФУНКЦИИ cancelErrorAdvance

// НАЧАЛО ФУНКЦИИ setPlaybackStatus
function setPlaybackStatus(status) {
    playbackStatus = status;
    audio.setAttribute('data-playback-status', status);
    stateCallback?.();
}
// КОНЕЦ ФУНКЦИИ setPlaybackStatus

// НАЧАЛО ФУНКЦИИ advanceTrack
function advanceTrack() {
    audioPlayer.loadTrack(currentTrackIndex + 1);
    automaticAdvance = true;
    try {
        if (endedCallback) endedCallback(currentTrackIndex);
        else audioPlayer.play().catch(() => {});
    } finally { automaticAdvance = false; }
}
// КОНЕЦ ФУНКЦИИ advanceTrack

// НАЧАЛО ФУНКЦИИ handleMediaFailure
function handleMediaFailure() {
    if (!wantedPlaying || audio.error?.code === 1) return;
    // После смены src браузер ещё может сообщать currentSrc предыдущего запроса.
    if (audio.currentSrc && audio.currentSrc !== audio.src) return;
    if (failedTracks.has(currentTrackIndex) && errorAdvanceTimer !== null) return;
    failedTracks.add(currentTrackIndex);
    cancelErrorAdvance();
    if (failedTracks.size >= playlist.length) {
        wantedPlaying = false;
        playbackGeneration++;
        audio.pause();
        setPlaybackStatus('unavailable');
        return;
    }
    const generation = playbackGeneration;
    setPlaybackStatus('loading');
    errorAdvanceTimer = setTimeout(() => {
        errorAdvanceTimer = null;
        if (wantedPlaying && generation === playbackGeneration) advanceTrack();
    }, 500);
}
// КОНЕЦ ФУНКЦИИ handleMediaFailure

export const audioPlayer = {
    // НАЧАЛО ФУНКЦИИ init
    init() {
        if (!listenersBound) {
            listenersBound = true;
            audio.loop = false;
            audio.addEventListener('playing', () => {
                if (!wantedPlaying) { audio.pause(); return; }
                setPlaybackStatus('playing');
            });
            audio.addEventListener('ended', () => {
                if (!wantedPlaying || audio.ended === false) return;
                failedTracks.clear();
                advanceTrack();
            });
            audio.addEventListener('error', handleMediaFailure);
            if (typeof window !== 'undefined') {
                window.addEventListener('pagehide', () => this.pause());
            }
        }
        this.loadTrack(currentTrackIndex);
    },
    // КОНЕЦ ФУНКЦИИ init

    // НАЧАЛО ФУНКЦИИ loadTrack
    loadTrack(index) {
        playbackGeneration++;
        cancelErrorAdvance();
        currentTrackIndex = ((index % playlist.length) + playlist.length) % playlist.length;
        audio.src = playlist[currentTrackIndex];
    },
    // КОНЕЦ ФУНКЦИИ loadTrack

    // НАЧАЛО ФУНКЦИИ play
    play(index = currentTrackIndex) {
        if (!automaticAdvance) failedTracks.clear();
        cancelErrorAdvance();
        playbackGeneration++;
        wantedPlaying = true;
        if (currentTrackIndex !== index || !audio.src) this.loadTrack(index);
        const generation = playbackGeneration;
        let attempt;
        try { attempt = audio.play(); }
        catch (error) { attempt = Promise.reject(error); }
        // Статус — уже после play(): смена src на миг ставит паузу, и картинка не должна решить, что музыка
        // остановилась (иначе Зойч и кольца на каждом новом треке начинали бы пульсацию заново, рывком)
        setPlaybackStatus('loading');
        return Promise.resolve(attempt).then(() => {
            if (generation !== playbackGeneration) return;
            if (!wantedPlaying) { audio.pause(); return; }
            setPlaybackStatus('playing');
        }).catch(error => {
            if (generation === playbackGeneration && wantedPlaying) {
                if (error?.name === 'NotAllowedError') {
                    wantedPlaying = false;
                    cancelErrorAdvance();
                    setPlaybackStatus('blocked');
                } else if (error?.name === 'NotSupportedError' || audio.error) handleMediaFailure();
            }
            throw error;
        });
    },
    // КОНЕЦ ФУНКЦИИ play

    // НАЧАЛО ФУНКЦИИ pause
    pause() {
        wantedPlaying = false;
        playbackGeneration++;
        cancelErrorAdvance();
        audio.pause();
        setPlaybackStatus('paused');
    },
    // КОНЕЦ ФУНКЦИИ pause

    // НАЧАЛО ФУНКЦИИ stop
    stop() {
        this.pause();
        audio.currentTime = 0;
    },
    // КОНЕЦ ФУНКЦИИ stop

    getCurrentIndex() { return currentTrackIndex; },
    isPaused() { return audio.paused; },
    getPlaybackStatus() { return playbackStatus; },
    onPlaybackStateChange(callback) { stateCallback = callback; },
    onTrackEnded(callback) { endedCallback = callback; },
};
