// ==========================================
// 1. العناصر الخاصة بالأفلام
// ==========================================
const movieTrigger = document.getElementById('btn-open-movies');
const moviesListOverlay = document.getElementById('tv-overlay-movies');
const movieListContainer = document.getElementById('movie-list');
const overlayTitle = moviesListOverlay.querySelector('h3');

const mainFrame = document.getElementById('main-tv-frame');
const moviePreviewPic = document.querySelector('.remote-side-movies .pic');

const btnOkMovies = document.getElementById('btn-ok-movies');
const btnCancelMovies = document.getElementById('btn-cancel-movies');
const btnUpMovies = document.querySelector('.btn-up-movies');
const btnDownMovies = document.querySelector('.btn-down-movies');

// ==========================================
// 2. العناصر الخاصة بالقنوات
// ==========================================
const tvTrigger = document.getElementById('btn-open-channels');
const overlay = document.getElementById('tv-overlay');

const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnOk = document.getElementById('btn-ok');
const btnCancel = document.getElementById('btn-cancel');

const channelItems = document.querySelectorAll('#channel-list li');
let currentIndex = 0;

// ==========================================
// 3. إدارة أفلام وتصنيفات السينما
// ==========================================
const allMoviesData = Array.from(movieListContainer.querySelectorAll('li')).map(li => ({
    type: li.getAttribute('data-type'),
    url: li.getAttribute('data-url'),
    img: li.querySelector('img').src,
    alt: li.querySelector('img').alt,
    title: li.querySelector('.movie-title').innerText
}));

const categories = [
    { id: 'family', title: 'أكشن', img: 'Action.jpg' },
    { id: 'drama', title: 'دراما', img: 'Drama.jpg' },
    { id: 'comedy', title: 'كوميديا', img: 'Comedy.jpg' },
    { id: 'romance', title: 'رومانسية', img: 'Romance.jpg' },
    { id: 'anime', title: 'أنمي', img: 'Anime.jpg' },
    { id: 'arabic', title: 'عربية', img: 'Arabic.jpg' },
    { id: 'series', title: 'سلاسل', img: 'Series.jpg' },
    { id: 'religious', title: 'دينية', img: 'Religious.jpg' }
];

let currentMode = 'categories'; 
let activeItems = [];
let activeIndex = 0;

function renderCategoriesUI() {
    currentMode = 'categories';
    overlayTitle.innerText = 'أنواع الأفلام';
    movieListContainer.innerHTML = '';

    categories.forEach((cat) => {
        const li = document.createElement('li');
        li.setAttribute('data-category-id', cat.id);
        li.innerHTML = `<img src="${cat.img}" alt="${cat.title}">`;
        movieListContainer.appendChild(li);
    });

    activeItems = document.querySelectorAll('#movie-list li');
    activeIndex = 0;
    updateSelectionUI();
}

function renderMoviesByCategoryUI(categoryId) {
    currentMode = 'movies';
    const categoryObj = categories.find(c => c.id === categoryId);
    overlayTitle.innerText = `أفلام ${categoryObj ? categoryObj.title : ''}`;
    
    movieListContainer.innerHTML = '';

    const filteredMovies = allMoviesData.filter(m => m.type === categoryId);

    filteredMovies.forEach(movie => {
        const li = document.createElement('li');
        li.setAttribute('data-url', movie.url);
        li.innerHTML = `
            <img src="${movie.img}" alt="${movie.alt}">
            <span class="movie-title">${movie.title}</span>
        `;
        movieListContainer.appendChild(li);
    });

    activeItems = document.querySelectorAll('#movie-list li');
    activeIndex = 0;
    updateSelectionUI();
}

function updateSelectionUI() {
    activeItems.forEach((item, index) => {
        const isActive = (index === activeIndex);
        item.classList.toggle('active', isActive);

        if (isActive) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const currentImg = item.querySelector('img');
            if (currentImg && moviePreviewPic) {
                moviePreviewPic.src = currentImg.src;
                moviePreviewPic.alt = currentImg.alt || 'معاينة';
            }
        }
    });
}

// أحداث الأفلام
movieTrigger.addEventListener('click', () => {
    moviesListOverlay.classList.remove('hidden');
    movieTrigger.classList.add('hidden');
    tvTrigger.classList.add('hidden');
    renderCategoriesUI();
});

btnCancelMovies.addEventListener('click', () => {
    if (currentMode === 'movies') {
        renderCategoriesUI();
    } else {
        moviesListOverlay.classList.add('hidden');
        movieTrigger.classList.remove('hidden');
        tvTrigger.classList.remove('hidden');
    }
});

if (btnDownMovies) {
    btnDownMovies.addEventListener('click', () => {
        if (activeIndex < activeItems.length - 1) {
            activeIndex++;
            updateSelectionUI();
        }
    });
}

if (btnUpMovies) {
    btnUpMovies.addEventListener('click', () => {
        if (activeIndex > 0) {
            activeIndex--;
            updateSelectionUI();
        }
    });
}

btnOkMovies.addEventListener('click', () => {
    if (activeItems.length === 0) return;

    if (currentMode === 'categories') {
        const selectedCatId = activeItems[activeIndex].getAttribute('data-category-id');
        renderMoviesByCategoryUI(selectedCatId);
    } else if (currentMode === 'movies') {
        const selectedMovie = activeItems[activeIndex];
        const newUrl = selectedMovie.getAttribute('data-url');
        
        if (mainFrame) {
            mainFrame.src = "about:blank";
            setTimeout(() => { mainFrame.src = newUrl; }, 300);
        }

        moviesListOverlay.classList.add('hidden');
        movieTrigger.classList.remove('hidden');
        tvTrigger.classList.remove('hidden');
    }
});

// ==========================================
// 4. إدارة القنوات الفضائية
// ==========================================
tvTrigger.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    tvTrigger.classList.add('hidden');
    movieTrigger.classList.add('hidden');
    updateMenuUI();
});

btnCancel.addEventListener('click', () => {
    overlay.classList.add('hidden');
    tvTrigger.classList.remove('hidden');
    movieTrigger.classList.remove('hidden');
});

btnUp.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateMenuUI();
    }
});

btnDown.addEventListener('click', () => {
    if (currentIndex < channelItems.length - 1) {
        currentIndex++;
        updateMenuUI();
    }
});

function updateMenuUI() {
    channelItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
        if (index === currentIndex) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

btnOk.addEventListener('click', () => {
    const selectedLi = channelItems[currentIndex];
    const newUrl = selectedLi.getAttribute('data-url');

    if (mainFrame && newUrl) {
        mainFrame.src = "about:blank";
        setTimeout(() => { mainFrame.src = newUrl; }, 300);
    }

    overlay.classList.add('hidden');
    tvTrigger.classList.remove('hidden');
    movieTrigger.classList.remove('hidden');
});