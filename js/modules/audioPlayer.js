import { playlist } from './playlist.js';

const audio = document.getElementById('my-audio');
let currentTrackIndex = 0;

export const audioPlayer = {
    init() {
        this.loadTrack(currentTrackIndex);
    },

    loadTrack(index) {
        currentTrackIndex = index;
        audio.src = playlist[index];
    },

    play(index = currentTrackIndex) {
        if (currentTrackIndex !== index || !audio.src) {
            this.loadTrack(index);
        }

        // Возвращаем нативный (native) Promise
        return audio.play();
    },

    pause() {
        audio.pause();
    },

    stop() {
        audio.pause();
        audio.currentTime = 0;
    },

    getCurrentIndex() {
        return currentTrackIndex;
    },

    isPaused() {
        return audio.paused;
    },

    onTrackEnded(callback) {
        audio.addEventListener('ended', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            this.loadTrack(currentTrackIndex);
            callback(currentTrackIndex);
        });
    }
};