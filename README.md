# Olympic Rings Gallery

[English](#english) · [Русский](#russian) · [עברית](#hebrew)

<a name="english"></a>

## English

An art project: animated Olympic rings with a music playlist. The page is built by JavaScript modules — the rings in the background, the player, the playlist and the interface are separate parts.

**Live demo:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

### Quick tour

Select a ring, switch tracks and use the playback controls. Repeat with Tab and Enter/Space to inspect keyboard access and the current playback state.

Follow `js/main.js` into `backgroundRings.js`, `audioPlayer.js`, `playlist.js` and `uiController.js` under `js/modules/`. These are browser ES modules; serve the folder over HTTP. Audio starts according to browser gesture rules.

The language links above switch the documentation; they do not translate the existing demo interface.

### How it is built

- `js/modules/backgroundRings.js` — the animated rings.
- `js/modules/audioPlayer.js` and `js/modules/playlist.js` — playback and the track list.
- `js/modules/uiController.js` — the interface; `js/main.js` connects everything.

Keyboard controls: use Tab to reach a ring or the mascot, then Enter or Space to play/pause. The ring buttons expose their current state to assistive technology.

### Music

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

### Tech stack

HTML5 · CSS3 animations · JavaScript ES modules · `<audio>` · GitHub Pages

### Run locally

The page uses ES modules, so open it through a local web server (for example `npx serve .`).

### Planned improvements

These are proposals, not currently implemented features.

- Visual: refine small control labels and focus indication; provide a quieter reduced-motion composition.
- Engineering: add explicit animation pause/resume and time-based motion, with permanent player race tests.
- Functionality: add an optional local-track picker and audio-reactive rings after profiling; keep the current playlist unchanged.

---

<a name="russian"></a>

## Русский

Арт-проект: анимированные олимпийские кольца и музыкальный плейлист. Страницу собирают модули JavaScript — кольца на фоне, плеер, плейлист и интерфейс живут отдельно.

**Демо:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

### Быстрый просмотр

Выберите кольцо, переключите трек и воспользуйтесь управлением плеера. Повторите через Tab и Enter/пробел, проверяя клавиатуру и состояние воспроизведения.

Проследите `js/main.js` к `backgroundRings.js`, `audioPlayer.js`, `playlist.js` и `uiController.js` в `js/modules/`. Это браузерные ES-модули: папку нужно отдавать по HTTP. Звук включается по правилам жеста браузера.

Языковые ссылки выше переключают документацию, а не переводят существующий интерфейс демо.

### Как устроено

- `js/modules/backgroundRings.js` — анимированные кольца.
- `js/modules/audioPlayer.js` и `js/modules/playlist.js` — воспроизведение и список треков.
- `js/modules/uiController.js` — интерфейс; `js/main.js` соединяет всё вместе.

Управление с клавиатуры: Tab выбирает кольцо или талисман, Enter и пробел запускают или останавливают трек. Состояние колец доступно программам чтения с экрана.

### Музыка

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

### Стек

HTML5 · CSS3-анимации · модули JavaScript (ES modules) · `<audio>` · GitHub Pages

### Как запустить

Страница использует ES-модули, поэтому откройте её через локальный сервер (например, `npx serve .`).

### План развития

Это предложения, а не уже реализованные возможности.

- Визуал: уточнить мелкие подписи и индикацию фокуса, добавить спокойный вариант reduced motion.
- Инженерия: явная пауза/возобновление анимации и движение по времени, постоянные тесты гонок плеера.
- Функции: необязательный выбор локального трека и реакция колец на звук после замеров; текущий плейлист сохранить.

---

<a name="hebrew"></a>

<div dir="rtl">

## עברית

פרויקט אמנות: טבעות אולימפיות מונפשות ורשימת השמעה מוזיקלית. הדף בנוי ממודולים של JavaScript — הטבעות, הנגן, רשימת ההשמעה והממשק.

**הדגמה:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

שליטה במקלדת: Tab בוחר טבעת או את הדמות, ו-Enter או רווח מפעילים או משהים את הרצועה. מצב הטבעות נגיש לקוראי מסך.

### סיור קצר

בחרו טבעת, החליפו רצועה ונסו את פקדי הנגן. חזרו על כך עם Tab ו־Enter/רווח כדי לבדוק נגישות מקלדת ומצב ניגון.

עקבו מ־`js/main.js` אל `backgroundRings.js`, `audioPlayer.js`, `playlist.js`, `uiController.js` בתוך `js/modules/`. אלה מודולי ES בדפדפן, ולכן יש להגיש את התיקייה ב־HTTP. שמע מתחיל בהתאם לכללי המחווה של הדפדפן.

קישורי השפה למעלה מחליפים את התיעוד, ולא מתרגמים את ממשק ההדגמה הקיים.

### מוזיקה

ברשימת ההשמעה, בין היתר:

- Röyksopp & Robyn — "Monument"
- Ninetyfour. & Johanson — "Moonlit Plains" (Third Person Remix)
- Patrick Swayze — "She's Like the Wind"
- Stan Kolev — "Here in the Now"
- Bleu Soleil, Luiza — "Soleil Bleu"
- CamelPhat & Elderbrook — "Cola" (ZHU Remix)
- Pendulum — "Hold Your Colour"
- Billy Idol — "Eyes Without a Face"
- Chris Rea — "The Blue Cafe"

המוזיקה שייכת ליוצריה ומשמשת רק בפרויקט לימודי לא מסחרי זה. בעלי זכויות שרוצים שרצועה תוסר מוזמנים לפתוח issue ואסיר אותה.

### טכנולוגיות

HTML5 · CSS3 · JavaScript (ES modules) · GitHub Pages

### הרצה מקומית

יש לפתוח את הדף דרך שרת מקומי (למשל `npx serve .`).

### שיפורים מתוכננים

אלה הצעות, לא יכולות שכבר מומשו.

- חזות: לשפר כיתובים קטנים וחיווי מיקוד ולהציע קומפוזיציה רגועה בהפחתת תנועה.
- הנדסה: השהיה וחידוש מפורשים לאנימציה, תנועה לפי זמן ובדיקות קבועות למרוצי הנגן.
- יכולות: בחירת רצועה מקומית ותגובה של הטבעות לשמע לאחר מדידה; לשמור את רשימת ההשמעה הקיימת.

</div>
