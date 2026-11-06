# Olympic Rings Gallery

**English** · [עברית](README.he.md) · [Русский](README.ru.md)

An art project: animated Olympic rings with a music playlist. The page is built by JavaScript modules — the rings in the background, the player, the playlist and the interface are separate parts.

**Live demo:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

## How it is built

- `js/modules/backgroundRings.js` — the animated rings.
- `js/modules/audioPlayer.js` and `js/modules/playlist.js` — playback and the track list.
- `js/modules/uiController.js` — the interface; `js/main.js` connects everything.

Keyboard controls: use Tab to reach a ring or the mascot, then Enter or Space to play/pause. The ring buttons expose their current state to assistive technology.

## Music

Tracks in the playlist include:

- Röyksopp & Robyn — "Monument"
- Ninetyfour. & Johanson — "Moonlit Plains" (Third Person Remix)
- Patrick Swayze — "She's Like the Wind"
- Stan Kolev — "Here in the Now"
- Bleu Soleil, Luiza — "Soleil Bleu"
- CamelPhat & Elderbrook — "Cola" (ZHU Remix)
- Pendulum — "Hold Your Colour"
- Billy Idol — "Eyes Without a Face"
- Chris Rea — "The Blue Cafe"

The music belongs to its authors and is used only in this non-commercial study project. If you hold the rights to a track and want it removed, please open an issue and I will remove it.

## Tech stack

HTML5 · CSS3 animations · JavaScript ES modules · `<audio>` · GitHub Pages

## Run locally

The page uses ES modules, so open it through a local web server (for example `npx serve .`).

## Roadmap

- A "play your own track" button: a visitor plays their own mp3 from their computer.
- Rings that react to the music (Web Audio analyser).
- Themes and a full-screen mode.
