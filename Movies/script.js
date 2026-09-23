const movieTrigger = document.getElementById('btn-open-movies');
const home = document.getElementById('btn-home');
const moviesListOverlay = document.getElementById('tv-overlay-movies');
const movieListContainer = document.getElementById('movie-list');
const overlayTitle = moviesListOverlay.querySelector('h3');

const mainFrame = document.getElementById('main-tv-frame');
const moviePreviewPic = document.querySelector('.remote-side-movies .pic');

const btnOkMovies = document.getElementById('btn-ok-movies');
const btnCancelMovies = document.getElementById('btn-cancel-movies');

const btnUpMovies = document.querySelector('.btn-up-movies');
const btnDownMovies = document.querySelector('.btn-down-movies');

// 1. حفظ جميع الأفلام الموجودة في الـ HTML الأصلي في الذاكرة قبل أي تعديل
const allMoviesData = Array.from(movieListContainer.querySelectorAll('li')).map(li => ({
    type: li.getAttribute('data-type'),
    url: li.getAttribute('data-url'),
    img: li.querySelector('img').src,
    alt: li.querySelector('img').alt,
    title: li.querySelector('.movie-title').innerText
}));

// 2. قائمة التصنيفات بأسمائها وصورها
const categories = [
    { id: 'family', title: 'أكشن', img: 'Action.jpg' },
    { id: 'drama', title: 'دراما', img: 'Drama.jpg' },
    { id: 'comedy', title: 'كودميديا', img: 'Comedy.jpg' },
    { id: 'romance', title: 'رومانسية', img: 'Romance.jpg' },
    { id: 'anime', title: 'أنمي', img: 'Anime.jpg' },
    { id: 'arabic', title: 'عربية', img: 'Arabic.jpg' },
    { id: 'series', title: 'سلاسل', img: 'Series.jpg' },
    { id: 'religious', title: 'دينية', img: 'Religious.jpg' }
];

let currentMode = 'categories'; // 'categories' أو 'movies'
let activeItems = [];
let activeIndex = 0;

// --- عرض قائمة التصنيفات ---
function renderCategoriesUI() {
    currentMode = 'categories';
    overlayTitle.innerText = 'أنواع الأفلام';
    movieListContainer.innerHTML = '';

    categories.forEach((cat) => {
        const li = document.createElement('li');
        li.setAttribute('data-category-id', cat.id);
        li.innerHTML = `
            <img src="${cat.img}" alt="${cat.title}">
        `;
        movieListContainer.appendChild(li);
    });

    activeItems = document.querySelectorAll('#movie-list li');
    activeIndex = 0;
    updateSelectionUI();
}

// --- عرض أفلام تصنيف محدد ---
function renderMoviesByCategoryUI(categoryId) {
    currentMode = 'movies';
    const categoryObj = categories.find(c => c.id === categoryId);
    overlayTitle.innerText = `أفلام ${categoryObj ? categoryObj.title : ''}`;
    
    movieListContainer.innerHTML = '';

    // تصفية الأفلام بناءً على التصنيف المختار من الذاكرة
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

// --- تحديث التحديد والصورة المعاينة ---
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

// --- الأحداث الخاصة بالزر والريموت ---
movieTrigger.addEventListener('click', () => {
    moviesListOverlay.classList.remove('hidden');
    movieTrigger.classList.add('hidden');
    home.classList.add('hidden');
    renderCategoriesUI();
});

btnCancelMovies.addEventListener('click', () => {
    if (currentMode === 'movies') {
        renderCategoriesUI();
    } else {
        moviesListOverlay.classList.add('hidden');
        movieTrigger.classList.remove('hidden');
        home.classList.remove('hidden');
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
        home.classList.remove('hidden');
    }
});