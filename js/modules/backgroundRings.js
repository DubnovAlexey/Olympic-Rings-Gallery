const container = document.querySelector('.flying-rings-container');

// Конфигурация фоновых колец
const TOTAL_RINGS = 10;
const START_INDEX = 5; // Летающие треки начинаются с 5-го индекса
const COLORS = ['blue', 'black', 'red', 'yellow', 'green'];

let ringsData = [];

export const backgroundRings = {
    init(onRingClickCallback) {
        if (!container) return;

        container.innerHTML = '';
        ringsData = [];

        for (let i = 0; i < TOTAL_RINGS; i++) {
            const ringElement = document.createElement('div');
            ringElement.classList.add('flying-ring');

            // При TOTAL_RINGS = 10, цвета распределятся ровно по 2 штуки каждого цвета!
            const fixedColor = COLORS[i % COLORS.length];
            ringElement.classList.add(fixedColor);

            const trackIndex = START_INDEX + i;

            // Генерируем случайные начальные позиции с учетом нового размера колец (110px)
            const x = Math.random() * (window.innerWidth - 130) + 10;
            const y = Math.random() * (window.innerHeight - 130) + 10;

            const vx = (Math.random() - 0.5) * 1.5;
            const vy = (Math.random() - 0.5) * 1.5;

            ringElement.style.left = '0px';
            ringElement.style.top = '0px';

            ringElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие (bubbling) события к фону
                onRingClickCallback(trackIndex);
            });

            container.appendChild(ringElement);

            ringsData.push({
                element: ringElement,
                trackIndex: trackIndex,
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                size: 110 // Указываем точный новый размер 110px для правильного отскока от стен
            });
        }

        this.updatePhysics();
    },

    updatePhysics() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        ringsData.forEach(ring => {
            // Обсчитываем движение по осям
            ring.x += ring.vx;
            ring.y += ring.vy;

            // Отскок от левой/правой стены
            if (ring.x <= 0) {
                ring.vx = -ring.vx;
                ring.x = 0;
            } else if (ring.x + ring.size >= width) {
                ring.vx = -ring.vx;
                ring.x = width - ring.size;
            }

            // Отскок от верхней/нижней стены
            if (ring.y <= 0) {
                ring.vy = -ring.vy;
                ring.y = 0;
            } else if (ring.y + ring.size >= height) {
                ring.vy = -ring.vy;
                ring.y = height - ring.size;
            }

            // Применяем координаты через left и top, чтобы не конфликтовать с transform анимации покачивания!
            ring.element.style.left = `${ring.x}px`;
            ring.element.style.top = `${ring.y}px`;
        });

        // Запрашиваем следующий кадр анимации
        requestAnimationFrame(() => this.updatePhysics());
    },

    syncLava(isPaused, currentTrackIndex) {
        ringsData.forEach(ring => {
            ring.element.classList.remove('lava-active');

            // Зажигаем индивидуальное летающее кольцо, если по нему кликнули
            if (!isPaused && ring.trackIndex === currentTrackIndex) {
                ring.element.classList.add('lava-active');
            }
        });
    }
};