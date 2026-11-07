# Olympic Rings Gallery

[English](#english) · [Русский](#русский) · [עברית](#עברית)

<a name="english"></a>

## English

An art page where every ring plays its own track. A play of light flows across the screen from a light edge to a deep blue one and back, giving the space its depth; the Olympic emblem stands in the centre and fifteen rings float around it. Every ring is drawn as SVG with a light-to-dark rim and a narrow shine, so it looks volumetric while its edge stays sharp.

**Live demo:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

### Quick tour

Press any ring to play its track, press it again to pause; Zoich starts or stops the music. A floating ring stops under the mouse and grows a little, so it is easy to hit. With Tab, focus shows a round glow; Enter or Space plays and pauses.

Follow `js/main.js` into `ringArt.js`, `backgroundRings.js`, `audioPlayer.js`, `playlist.js`, `uiController.js` and `beat.js` under `js/modules/`. These are browser ES modules; serve the folder over HTTP. Audio starts according to browser gesture rules.

The language links above switch the documentation; they do not translate the existing demo interface.

### How it is built

- Tracks 1–5 — the Olympic emblem (`js/modules/uiController.js`); the rings keep their real weaving.
- Tracks 6–20 — fifteen rings floating flat across the screen (`js/modules/backgroundRings.js`): two of each Olympic colour plus gold, silver, bronze, ice and flame. They bounce off the edges, off each other like billiard balls and off the centre with Zoich and the emblem, so nothing covers the emblem; motion is time-based, written only to `transform`, and pauses on a hidden tab.
- While music plays, Zoich, the playing ring and the magma-glowing screen edges share one deep, steady pulse: a slow sine-wave swell and settle, with the fire around them flaring on every swell. A ring that lights up later joins the same beat at the start of the next wave, and when the music stops everything settles and fades out instead of snapping back (`js/modules/beat.js`).
- Same-coloured floating rings each have their own unreal alphabet: every 30–40 seconds its glyphs type themselves in around the whole rim, run one lap and fade out one by one. The glyphs are large, white and outlined, so they read on any ring colour. The emblem rings stay the largest on every screen.
- `js/modules/ringArt.js` draws every ring; `js/modules/audioPlayer.js` and `js/modules/playlist.js` — playback and the track list; `js/main.js` connects everything. With reduced motion requested, the sky and the rings stay still.

Keyboard controls: use Tab to reach a ring or the mascot, then Enter or Space to play/pause. The ring buttons expose their current state to assistive technology.

### Music

The sequential playlist includes all **20 local audio files** and loops after the final track. Every track has its own ring: the emblem holds tracks 1–5, the floating rings 6–20.

Every track and its ring (names come from the files' own tags and names; the missing ones will be added):

| # | Ring | Track |
|---|---|---|
| 1 | Emblem · blue | Röyksopp & Robyn — "Monument" |
| 2 | Emblem · black | Ninetyfour. & Johanson — "Moonlit Plains" (Third Person Remix) |
| 3 | Emblem · yellow | Patrick Swayze — "She's Like the Wind" |
| 4 | Emblem · red | Stan Kolev — "Here in the Now" |
| 5 | Emblem · green | Chris Everett — "Cuba" (Chill Lounge version) |
| 6 | Floating · blue | Bleu Soleil, Luiza — "Soleil Bleu" |
| 7 | Floating · black | Bob Moses, ZHU — "Desire" (Vintage Culture & Kiko Franco remix) |
| 8 | Floating · red | *title to be added* |
| 9 | Floating · yellow | CamelPhat & Elderbrook — "Cola" (ZHU Remix) |
| 10 | Floating · green | *title to be added* |
| 11 | Floating · blue | Pendulum — "Hold Your Colour" |
| 12 | Floating · black | *title to be added* |
| 13 | Floating · red | Billy Idol — "Eyes Without a Face" |
| 14 | Floating · yellow | Radiohead — "Everything in Its Right Place" |
| 15 | Floating · green | Chris Rea — "The Blue Cafe" |
| 16 | Gold | Cigarettes After Sex — "Nothing’s Gonna Hurt You Baby" |
| 17 | Silver | Moby — "I Like It" |
| 18 | Bronze | 7Б — "Молодые ветра" |
| 19 | Ice | Chris Rea — "I Just Wanna Be with You" |
| 20 | Flame | Leonard Cohen — "I'm Your Man" |

The music belongs to its authors and is used only in this non-commercial study project. If you hold the rights to a track and want it removed, please open an issue and I will remove it.

### Tech stack

HTML5 · CSS3 animations · JavaScript ES modules · `<audio>` · GitHub Pages

### Run locally

The page uses ES modules, so open it through a local web server (for example `npx serve .`).

### Planned improvements

These are proposals, not currently implemented features.

- Visual: audio-reactive glow of the playing ring after performance profiling.
- Engineering: permanent tests for the player and the ring collisions.
- Functionality: add an optional local-track picker and audio-reactive rings after profiling; keep the current playlist unchanged.

---

<a name="russian"></a>

## Русский

Арт-страница, где каждое кольцо играет свой трек. По экрану перетекает игра света — от светлого края к тёмно-синему и обратно, — она и даёт пространству глубину; в центре олимпийская эмблема, вокруг плавают пятнадцать колец. Каждое кольцо нарисовано в SVG: обод от светлого к тёмному и узкий блик, поэтому оно выглядит объёмным, а край остаётся резким.

**Демо:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

### Быстрый просмотр

Нажмите на любое кольцо — заиграет его трек, повторное нажатие ставит паузу; Зойч включает и выключает музыку. Летающее кольцо под мышью останавливается и немного увеличивается, чтобы по нему было легко попасть. При навигации через Tab фокус показан круглым свечением; Enter и пробел запускают и останавливают трек.

Проследите `js/main.js` к `ringArt.js`, `backgroundRings.js`, `audioPlayer.js`, `playlist.js`, `uiController.js` и `beat.js` в `js/modules/`. Это браузерные ES-модули: папку нужно отдавать по HTTP. Звук включается по правилам жеста браузера.

Языковые ссылки выше переключают документацию, а не переводят существующий интерфейс демо.

### Как устроено

- Треки 1–5 — олимпийская эмблема (`js/modules/uiController.js`), кольца сохраняют настоящее переплетение.
- Треки 6–20 — пятнадцать колец, которые плавают по экрану в одной плоскости (`js/modules/backgroundRings.js`): по два каждого олимпийского цвета, а также золото, серебро, бронза, лёд и огонь. Они отскакивают от краёв, друг от друга, как бильярдные шары, и от центра с Зойчем и эмблемой, поэтому эмблему ничто не закрывает; движение считается по времени, пишется только в `transform` и стоит на скрытой вкладке.
- Пока играет музыка, Зойч, играющее кольцо и края экрана (они светятся, как магма) дышат одной глубокой ровной пульсацией: медленно, по синусоиде, набухают и опадают, а огонь вокруг них разгорается на каждом подъёме. Кольцо, которое загорелось позже, встраивается в тот же такт с начала следующей волны; когда музыка останавливается, всё плавно опускается и гаснет, а не обрывается (`js/modules/beat.js`).
- У одноцветных колец свой «нереальный» алфавит: раз в 30–40 секунд его знаки набираются по всему ободу, делают один оборот и гаснут по одному. Знаки крупные, белые, с тёмной обводкой — читаются на кольце любого цвета. Кольца эмблемы на любом экране остаются самыми крупными.
- `js/modules/ringArt.js` рисует все кольца; `js/modules/audioPlayer.js` и `js/modules/playlist.js` — воспроизведение и список треков; `js/main.js` соединяет всё вместе. При «уменьшить анимацию» небо и кольца стоят на месте.

Управление с клавиатуры: Tab выбирает кольцо или талисман, Enter и пробел запускают или останавливают трек. Состояние колец доступно программам чтения с экрана.

### Музыка

Последовательный плейлист включает все **20 локальных аудиофайлов** и после последнего возвращается к началу. У каждого трека своё кольцо: в эмблеме треки 1–5, летающие кольца — 6–20.

Все треки и их кольца (названия взяты из тегов и имён самих файлов; недостающие будут добавлены):

| № | Кольцо | Трек |
|---|---|---|
| 1 | Эмблема · синее | Röyksopp & Robyn — "Monument" |
| 2 | Эмблема · чёрное | Ninetyfour. & Johanson — "Moonlit Plains" (Third Person Remix) |
| 3 | Эмблема · жёлтое | Patrick Swayze — "She's Like the Wind" |
| 4 | Эмблема · красное | Stan Kolev — "Here in the Now" |
| 5 | Эмблема · зелёное | Chris Everett — "Cuba" (Chill Lounge version) |
| 6 | Летающее · синее | Bleu Soleil, Luiza — "Soleil Bleu" |
| 7 | Летающее · чёрное | Bob Moses, ZHU — "Desire" (Vintage Culture & Kiko Franco remix) |
| 8 | Летающее · красное | *название уточняется* |
| 9 | Летающее · жёлтое | CamelPhat & Elderbrook — "Cola" (ZHU Remix) |
| 10 | Летающее · зелёное | *название уточняется* |
| 11 | Летающее · синее | Pendulum — "Hold Your Colour" |
| 12 | Летающее · чёрное | *название уточняется* |
| 13 | Летающее · красное | Billy Idol — "Eyes Without a Face" |
| 14 | Летающее · жёлтое | Radiohead — "Everything in Its Right Place" |
| 15 | Летающее · зелёное | Chris Rea — "The Blue Cafe" |
| 16 | Золотое | Cigarettes After Sex — "Nothing’s Gonna Hurt You Baby" |
| 17 | Серебряное | Moby — "I Like It" |
| 18 | Бронзовое | 7Б — "Молодые ветра" |
| 19 | Ледяное | Chris Rea — "I Just Wanna Be with You" |
| 20 | Огненное | Leonard Cohen — "I'm Your Man" |

Музыка принадлежит авторам и используется только в этом некоммерческом учебном проекте. Если вы правообладатель и хотите, чтобы трек убрали, откройте issue — уберу.

### Стек

HTML5 · CSS3-анимации · модули JavaScript (ES modules) · `<audio>` · GitHub Pages

### Как запустить

Страница использует ES-модули, поэтому откройте её через локальный сервер (например, `npx serve .`).

### План развития

Это предложения, а не уже реализованные возможности.

- Визуал: свечение играющего кольца в такт музыке — после замеров производительности.
- Инженерия: постоянные тесты плеера и столкновений колец.
- Функции: необязательный выбор локального трека и реакция колец на звук после замеров; текущий плейлист сохранить.

---

<a name="hebrew"></a>

<div dir="rtl">

## עברית

דף אמנות שבו כל טבעת מנגנת רצועה משלה. משחק אור זורם על המסך מקצה בהיר אל כחול עמוק ובחזרה ונותן לחלל עומק; במרכז הסמל האולימפי, וסביבו מרחפות חמש־עשרה טבעות. כל טבעת מצוירת ב־SVG עם שפה מבהיר לכהה וברק צר, ולכן היא נראית תלת־ממדית והקצה נשאר חד.

**הדגמה:** https://dubnovalexey.github.io/Olympic-Rings-Gallery/

שליטה במקלדת: Tab בוחר טבעת או את הדמות, ו-Enter או רווח מפעילים או משהים את הרצועה. מצב הטבעות נגיש לקוראי מסך.

### סיור קצר

לחצו על טבעת כלשהי כדי לנגן את הרצועה שלה, ושוב כדי להשהות; זויץ׳ מפעיל ועוצר את המוזיקה. טבעת מרחפת נעצרת מתחת לעכבר וגדלה מעט, כדי שיהיה קל לפגוע בה. בניווט עם Tab המיקוד מסומן בזוהר עגול; Enter ורווח מנגנים ומשהים.

עקבו מ־`js/main.js` אל `ringArt.js`, `backgroundRings.js`, `audioPlayer.js`, `playlist.js`, `uiController.js`, `beat.js` בתוך `js/modules/`. אלה מודולי ES בדפדפן, ולכן יש להגיש את התיקייה ב־HTTP. רצועות 1–5 — הסמל האולימפי, 6–20 — חמש־עשרה טבעות שמרחפות במישור אחד, מתנגשות זו בזו כמו כדורי ביליארד וקופצות לאחור מהמרכז עם זויץ׳ והסמל, כך ששום דבר לא מסתיר את הסמל. בזמן שהמוזיקה מתנגנת, זויץ׳, הטבעת המתנגנת ושולי המסך הזוהרים כמו מאגמה פועמים בדופק אחד עמוק ואחיד: מתנפחים ושוקעים לאט, כמו גל סינוס, והאש סביבם מתלקחת בכל התנפחות. טבעת שנדלקת מאוחר יותר מצטרפת לאותו קצב בתחילת הגל הבא, וכשהמוזיקה נעצרת הכול שוקע ודועך בהדרגה במקום להיקטע (`js/modules/beat.js`). לטבעות באותו צבע יש אלפבית „לא אמיתי” משלהן: כל 30–40 שניות הסימנים שלו מוקלדים סביב כל השפה, מקיפים אותה פעם אחת ונכבים אחד אחרי השני. הסימנים גדולים, לבנים ומודגשים בקו מתאר, ולכן קריאים על טבעת בכל צבע.

קישורי השפה למעלה מחליפים את התיעוד, ולא מתרגמים את ממשק ההדגמה הקיים.

### מוזיקה

רשימת ההשמעה כוללת את כל **20 קובצי השמע המקומיים**, לפי הסדר ובחזרה להתחלה אחרי האחרון. לכל רצועה יש טבעת משלה: בסמל רצועות 1–5, בטבעות המרחפות 6–20.

כל הרצועות והטבעות שלהן (השמות נלקחו מהתגיות ומשמות הקבצים; החסרים יתווספו):

| # | טבעת | רצועה |
|---|---|---|
| 1 | סמל · כחולה | Röyksopp & Robyn — "Monument" |
| 2 | סמל · שחורה | Ninetyfour. & Johanson — "Moonlit Plains" (Third Person Remix) |
| 3 | סמל · צהובה | Patrick Swayze — "She's Like the Wind" |
| 4 | סמל · אדומה | Stan Kolev — "Here in the Now" |
| 5 | סמל · ירוקה | Chris Everett — "Cuba" (Chill Lounge version) |
| 6 | מרחפת · כחולה | Bleu Soleil, Luiza — "Soleil Bleu" |
| 7 | מרחפת · שחורה | Bob Moses, ZHU — "Desire" (Vintage Culture & Kiko Franco remix) |
| 8 | מרחפת · אדומה | *השם יתווסף* |
| 9 | מרחפת · צהובה | CamelPhat & Elderbrook — "Cola" (ZHU Remix) |
| 10 | מרחפת · ירוקה | *השם יתווסף* |
| 11 | מרחפת · כחולה | Pendulum — "Hold Your Colour" |
| 12 | מרחפת · שחורה | *השם יתווסף* |
| 13 | מרחפת · אדומה | Billy Idol — "Eyes Without a Face" |
| 14 | מרחפת · צהובה | Radiohead — "Everything in Its Right Place" |
| 15 | מרחפת · ירוקה | Chris Rea — "The Blue Cafe" |
| 16 | זהב | Cigarettes After Sex — "Nothing’s Gonna Hurt You Baby" |
| 17 | כסף | Moby — "I Like It" |
| 18 | ארד | 7Б — "Молодые ветра" |
| 19 | קרח | Chris Rea — "I Just Wanna Be with You" |
| 20 | אש | Leonard Cohen — "I'm Your Man" |

המוזיקה שייכת ליוצריה ומשמשת רק בפרויקט לימודי לא מסחרי זה. בעלי זכויות שרוצים שרצועה תוסר מוזמנים לפתוח issue ואסיר אותה.

### טכנולוגיות

HTML5 · CSS3 · JavaScript (ES modules) · GitHub Pages

### הרצה מקומית

יש לפתוח את הדף דרך שרת מקומי (למשל `npx serve .`).

### שיפורים מתוכננים

אלה הצעות, לא יכולות שכבר מומשו.

- חזות: זוהר של הטבעת המתנגנת בקצב המוזיקה, לאחר מדידת ביצועים.
- הנדסה: בדיקות קבועות לנגן ולהתנגשויות הטבעות.
- יכולות: בחירת רצועה מקומית ותגובה של הטבעות לשמע לאחר מדידה; לשמור את רשימת ההשמעה הקיימת.

</div>
