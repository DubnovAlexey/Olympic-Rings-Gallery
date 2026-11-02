# Olympic Rings Gallery

[English](README.md) · [עברית](README.he.md) · **Русский**

Арт-проект: анимированные олимпийские кольца и музыкальный плейлист. Страницу собирают модули JavaScript — кольца на фоне, плеер, плейлист и интерфейс живут отдельно.

**Демо:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

## Как устроено

- `js/modules/backgroundRings.js` — анимированные кольца.
- `js/modules/audioPlayer.js` и `js/modules/playlist.js` — воспроизведение и список треков.
- `js/modules/uiController.js` — интерфейс; `js/main.js` соединяет всё вместе.

## Музыка

В плейлисте, среди прочего:

- Röyksopp & Robyn — «Monument»
- Ninetyfour. & Johanson — «Moonlit Plains» (Third Person Remix)
- Patrick Swayze — «She's Like the Wind»
- Stan Kolev — «Here in the Now»
- Bleu Soleil, Luiza — «Soleil Bleu»
- CamelPhat & Elderbrook — «Cola» (ZHU Remix)
- Pendulum — «Hold Your Colour»
- Billy Idol — «Eyes Without a Face»
- Chris Rea — «The Blue Cafe»

Музыка принадлежит авторам и используется только в этом некоммерческом учебном проекте. Если вы правообладатель и хотите, чтобы трек убрали, откройте issue — уберу.

## Стек

HTML5 · CSS3-анимации · модули JavaScript (ES modules) · `<audio>` · GitHub Pages

## Как запустить

Страница использует ES-модули, поэтому откройте её через локальный сервер (например, `npx serve .`).

## Планы

- Кнопка «свой трек»: посетитель включает свой mp3 со своего компьютера.
- Кольца, которые реагируют на музыку (анализатор Web Audio).
- Темы и полноэкранный режим.
