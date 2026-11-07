# Olympic Rings Gallery

[English](#english) · [Русский](#russian) · [עברית](#hebrew)

<a name="english"></a>

## English

An art page where every ring plays its own track. A night-stadium sky with a slow aurora and sweeping floodlights surrounds the Olympic emblem, rings drift around it at three depths, and a medal carousel holds the newest tracks. Every ring is drawn as a metal tube with a highlight rather than a flat outline.

**Live demo:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

### Quick tour

Press any ring to play its track, press it again to pause; Zoich starts or stops the music. Spin the medal carousel with its arrows, a swipe or the ←/→ keys — its rings stand still in front for a few seconds, and a medal track that comes up in the playlist is turned to the front by itself. Move the mouse to see the drifting rings shift in depth. With Tab, focus shows a round glow around rings; Enter or Space plays and pauses.

Follow `js/main.js` into `backgroundRings.js`, `medalCarousel.js`, `audioPlayer.js`, `playlist.js` and `uiController.js` under `js/modules/`. These are browser ES modules; serve the folder over HTTP. Audio starts according to browser gesture rules.

The language links above switch the documentation; they do not translate the existing demo interface.

### How it is built

- Tracks 1–5 — the Olympic emblem (`js/modules/uiController.js`); the rings keep their real weaving.
- Tracks 6–15 — ten drifting rings on far, middle and near layers (`js/modules/backgroundRings.js`). Motion is time-based, written only to `transform`, follows the mouse with parallax and pauses on a hidden tab.
- Tracks 16–20 — the medal carousel: gold, silver, bronze, ice and flame (`js/modules/medalCarousel.js`).
- In time with the music (`js/modules/beatPulse.js`): Web Audio listens to the bass of the playing track; Zoich and the playing ring jump on strong beats and the fiery glow follows the bass. In silence or without Web Audio the timer-based pulse remains.
- Same-coloured drifting rings each have their own unreal alphabet: now and then a short comet of scrambling glyphs runs once around the ring and disappears. The emblem rings stay the largest on every screen.
- `js/modules/audioPlayer.js` and `js/modules/playlist.js` — playback and the track list; `js/main.js` connects everything. With reduced motion requested, the sky, the rings and the carousel stay still.

Keyboard controls: use Tab to reach a ring or the mascot, then Enter or Space to play/pause. The ring buttons expose their current state to assistive technology.

### Music

The sequential playlist includes all **20 local audio files** and loops after the final track. Every track now has its own ring: the emblem, the drifting rings and the medal carousel together cover all 20.

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

- Visual: audio-reactive glow of the playing ring after performance profiling.
- Engineering: permanent tests for the player and the carousel state.
- Functionality: add an optional local-track picker and audio-reactive rings after profiling; keep the current playlist unchanged.

---

<a name="russian"></a>

## Русский

Арт-страница, где каждое кольцо играет свой трек. Олимпийскую эмблему окружает ночной стадион с медленным сиянием и лучами прожекторов, вокруг на трёх глубинах летают кольца, а самые новые треки живут в медальной карусели. Каждое кольцо нарисовано как металлическая трубка с бликом, а не плоская обводка.

**Демо:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

### Быстрый просмотр

Нажмите на любое кольцо — заиграет его трек, повторное нажатие ставит паузу; Зойч включает и выключает музыку. Медальную карусель крутят стрелки, свайп или клавиши ←/→: кольца по очереди задерживаются впереди, а трек из карусели, до которого дошла очередь, сам поворачивает своё кольцо вперёд. Подвигайте мышью — летающие кольца сместятся по глубине. При навигации через Tab фокус показан круглым свечением; Enter и пробел запускают и останавливают трек.

Проследите `js/main.js` к `backgroundRings.js`, `medalCarousel.js`, `audioPlayer.js`, `playlist.js` и `uiController.js` в `js/modules/`. Это браузерные ES-модули: папку нужно отдавать по HTTP. Звук включается по правилам жеста браузера.

Языковые ссылки выше переключают документацию, а не переводят существующий интерфейс демо.

### Как устроено

- Треки 1–5 — олимпийская эмблема (`js/modules/uiController.js`), кольца сохраняют настоящее переплетение.
- Треки 6–15 — десять летающих колец на дальнем, среднем и ближнем слоях (`js/modules/backgroundRings.js`). Движение считается по времени, пишется только в `transform`, следует за мышью с параллаксом и останавливается на скрытой вкладке.
- Треки 16–20 — медальная карусель: золото, серебро, бронза, лёд и огонь (`js/modules/medalCarousel.js`).
- В такт музыке (`js/modules/beatPulse.js`): Web Audio слушает басы играющего трека, Зойч и играющее кольцо толкаются на сильных долях, огненное свечение следует за басами. В тишине или без Web Audio остаётся пульсация по таймеру.
- У одноцветных летающих колец свой «нереальный» алфавит: время от времени по ободу пробегает короткая комета из перебирающихся знаков и исчезает. Кольца эмблемы на любом экране остаются самыми крупными.
- `js/modules/audioPlayer.js` и `js/modules/playlist.js` — воспроизведение и список треков; `js/main.js` соединяет всё вместе. При «уменьшить анимацию» небо, кольца и карусель стоят на месте.

Управление с клавиатуры: Tab выбирает кольцо или талисман, Enter и пробел запускают или останавливают трек. Состояние колец доступно программам чтения с экрана.

### Музыка

Последовательный плейлист включает все **20 локальных аудиофайлов** и после последнего возвращается к началу. Теперь у каждого трека своё кольцо: эмблема, летающие кольца и медальная карусель вместе охватывают все 20.

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

- Визуал: свечение играющего кольца в такт музыке — после замеров производительности.
- Инженерия: постоянные тесты плеера и состояния карусели.
- Функции: необязательный выбор локального трека и реакция колец на звук после замеров; текущий плейлист сохранить.

---

<a name="hebrew"></a>

<div dir="rtl">

## עברית

דף אמנות שבו כל טבעת מנגנת רצועה משלה. סמל הטבעות האולימפי מוקף בשמי לילה של אצטדיון עם זוהר איטי וקרני זרקורים, טבעות מרחפות סביבו בשלושה עומקים, והרצועות החדשות ביותר נמצאות בקרוסלת המדליות. כל טבעת מצוירת כצינור מתכת עם ברק, ולא כקו מתאר שטוח.

**הדגמה:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

שליטה במקלדת: Tab בוחר טבעת או את הדמות, ו-Enter או רווח מפעילים או משהים את הרצועה. מצב הטבעות נגיש לקוראי מסך.

### סיור קצר

לחצו על טבעת כלשהי כדי לנגן את הרצועה שלה, ושוב כדי להשהות; זויץ׳ מפעיל ועוצר את המוזיקה. את קרוסלת המדליות מסובבים בחצים, בהחלקה או במקשי ←/→: כל טבעת נעצרת מלפנים לכמה שניות, ורצועה מהקרוסלה שהגיע תורה מסובבת את הטבעת שלה קדימה מעצמה. הזיזו את העכבר — הטבעות המרחפות זזות לפי העומק. בניווט עם Tab המיקוד מסומן בזוהר עגול; Enter ורווח מנגנים ומשהים.

עקבו מ־`js/main.js` אל `backgroundRings.js`, `medalCarousel.js`, `audioPlayer.js`, `playlist.js`, `uiController.js` בתוך `js/modules/`. אלה מודולי ES בדפדפן, ולכן יש להגיש את התיקייה ב־HTTP. שמע מתחיל בהתאם לכללי המחווה של הדפדפן. רצועות 1–5 — הסמל האולימפי, 6–15 — עשר טבעות מרחפות בשלוש שכבות עומק, 16–20 — קרוסלת המדליות: זהב, כסף, ארד, קרח ואש. Web Audio מאזין לבס של הרצועה: זויץ׳ והטבעת המתנגנת קופצים על הפעמות החזקות. לטבעות מרחפות באותו צבע יש אלפבית „לא אמיתי” משלהן: מדי פעם עוברת סביב הטבעת שובל קצר של סימנים מתחלפים ונעלם. כשמבוקשת הפחתת תנועה, השמיים, הטבעות והקרוסלה נשארים במקום.

קישורי השפה למעלה מחליפים את התיעוד, ולא מתרגמים את ממשק ההדגמה הקיים.

### מוזיקה

רשימת ההשמעה כוללת את כל **20 קובצי השמע המקומיים**, לפי הסדר ובחזרה להתחלה אחרי האחרון. עכשיו לכל רצועה יש טבעת משלה: הסמל, הטבעות המרחפות וקרוסלת המדליות מכסים יחד את כל 20.

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

- חזות: זוהר של הטבעת המתנגנת בקצב המוזיקה, לאחר מדידת ביצועים.
- הנדסה: בדיקות קבועות לנגן ולמצב הקרוסלה.
- יכולות: בחירת רצועה מקומית ותגובה של הטבעות לשמע לאחר מדידה; לשמור את רשימת ההשמעה הקיימת.

</div>
