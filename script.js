const clothesData = [
    { id: 1, name: "Chamarra Roja", icon: "🧥" },
    { id: 2, name: "Tenis Azules", icon: "👟" },
    { id: 3, name: "Reloj de Plata", icon: "⌚" },
    { id: 4, name: "Gorra Negra", icon: "🧢" },
    { id: 5, name: "Mochila Verde", icon: "🎒" }
];

const postersData = [
    { id: 3, name: "Brenda Bautista", img: "ROSTROS/BRENDA-BAUTISTA-PINEDA.jpeg" },
    { id: 1, name: "Abraham Gomez", img: "ROSTROS/ABRAHAM-GOMEZ-MOSQUEDA.jpeg" },
    { id: 5, name: "Dulce Velazquez", img: "ROSTROS/DULCE-VELAZQUEZ-PEREZ.jpeg" },
    { id: 2, name: "Bartola Castaneda", img: "ROSTROS/BARTOLA-CASTANEDA-PEREZ.jpeg" },
    { id: 4, name: "Carlos Daniel", img: "ROSTROS/CARLOS-DANIEL-DOMINGUEZ-PEREZ.jpg" }
];

let topItems = [...clothesData];
let bottomItems = [...postersData];

let topIndex = 0;
let bottomIndex = 0;

let isAnimating = false;

const topCarousel = document.getElementById('top-carousel');
const bottomCarousel = document.getElementById('bottom-carousel');
const matchStatus = document.getElementById('match-status');
const topIndicator = document.querySelector('.top-wrapper .selection-indicator');
const bottomIndicator = document.querySelector('.bottom-wrapper .selection-indicator');
const victoryScreen = document.getElementById('victory-screen');

function renderCarousel(container, items, currentIndex, isTop) {
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<div class="item-card active"><div class="icon">✨</div><div class="name">Vacío</div></div>';
        return;
    }

    const n = items.length;
    
    items.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'item-card';
        
        let visualContent = item.img 
            ? `<div class="image-container"><img src="${item.img}" alt="${item.name}"></div>`
            : `<div class="icon">${item.icon}</div>`;

        el.innerHTML = `
            ${visualContent}
            <div class="name">${item.name}</div>
        `;

        // Calculate relative position considering circularity
        let diff = i - currentIndex;
        
        // Handle wrapping for visual continuity
        if (diff < -Math.floor(n/2)) diff += n;
        if (diff > Math.floor(n/2)) diff -= n;

        if (diff === 0) {
            el.classList.add('active');
        } else if (diff === -1 || (diff < 0 && n === 2)) {
            el.classList.add('prev');
        } else if (diff === 1 || (diff > 0 && n === 2)) {
            el.classList.add('next');
        } else if (diff < -1) {
            el.classList.add('hidden-left');
        } else if (diff > 1) {
            el.classList.add('hidden-right');
        }

        container.appendChild(el);
    });
}

function updateUI() {
    renderCarousel(topCarousel, topItems, topIndex, true);
    renderCarousel(bottomCarousel, bottomItems, bottomIndex, false);
}

function moveTop(dir) {
    if (topItems.length <= 1 || isAnimating) return;
    topIndex = (topIndex + dir + topItems.length) % topItems.length;
    updateUI();
}

function moveBottom(dir) {
    if (bottomItems.length <= 1 || isAnimating) return;
    bottomIndex = (bottomIndex + dir + bottomItems.length) % bottomItems.length;
    updateUI();
}

function showStatus(msg, type) {
    matchStatus.textContent = msg;
    matchStatus.className = `match-status show ${type}`;
    setTimeout(() => {
        matchStatus.classList.remove('show');
    }, 1500);
}

function handleMatch() {
    if (topItems.length === 0 || bottomItems.length === 0 || isAnimating) return;

    const topItem = topItems[topIndex];
    const bottomItem = bottomItems[bottomIndex];

    isAnimating = true;

    if (topItem.id === bottomItem.id) {
        // MATCH!
        showStatus('¡COINCIDENCIA!', 'success');
        topIndicator.classList.add('success');
        bottomIndicator.classList.add('success');

        const activeTop = topCarousel.querySelector('.active');
        const activeBottom = bottomCarousel.querySelector('.active');
        
        if (activeTop) activeTop.classList.add('matched-top');
        if (activeBottom) activeBottom.classList.add('matched-bottom');

        setTimeout(() => {
            topItems.splice(topIndex, 1);
            bottomItems.splice(bottomIndex, 1);
            
            // Adjust indices
            if (topItems.length > 0) topIndex = topIndex % topItems.length;
            if (bottomItems.length > 0) bottomIndex = bottomIndex % bottomItems.length;

            topIndicator.classList.remove('success');
            bottomIndicator.classList.remove('success');
            
            updateUI();
            isAnimating = false;

            checkWinCondition();
        }, 800);

    } else {
        // NO MATCH
        showStatus('ERROR', 'error');
        topIndicator.classList.add('error', 'shake');
        bottomIndicator.classList.add('error', 'shake');

        setTimeout(() => {
            topIndicator.classList.remove('error', 'shake');
            bottomIndicator.classList.remove('error', 'shake');
            isAnimating = false;
        }, 400);
    }
}

function checkWinCondition() {
    if (topItems.length === 0 && bottomItems.length === 0) {
        setTimeout(() => {
            victoryScreen.classList.remove('hidden');
        }, 500);
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'a':
            moveTop(-1);
            break;
        case 'd':
            moveTop(1);
            break;
        case 'arrowleft':
            moveBottom(-1);
            break;
        case 'arrowright':
            moveBottom(1);
            break;
        case ' ':
            e.preventDefault(); // Prevent scrolling
            handleMatch();
            break;
    }
});

// Initialize
updateUI();
