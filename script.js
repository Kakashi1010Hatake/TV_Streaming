const tvTrigger = document.getElementById('btn-open-channels');
const overlay = document.getElementById('tv-overlay');

const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnOk = document.getElementById('btn-ok');
const btnCancel = document.getElementById('btn-cancel');

const channelItems = document.querySelectorAll('#channel-list li');
const mainFrame = document.getElementById('main-tv-frame');
const channelDisplay = document.getElementById('channel-display');

const movieTrigger = document.getElementById('btn-open-movies');
const moviesList = document.getElementById('tv-overlay-movies');

// const btnUpMovies = document.getElementById('btn-up-movies');
// const btnDownMovies = document.getElementById('btn-down-movies');
const btnOkMovies = document.getElementById('btn-ok-movies');
const btnCancelMovies = document.getElementById('btn-cancel-movies');

let currentIndex = 0;

// فتح القائمة
tvTrigger.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    tvTrigger.classList.add('hidden');
    movieTrigger.classList.add('hidden');
});

// إغلاق القائمة
btnCancel.addEventListener('click', () => {
    overlay.classList.add('hidden');
    tvTrigger.classList.remove('hidden');
    movieTrigger.classList.remove('hidden');

    // إعادة حماية الشاشة تلقائياً عند الإغلاق (لزيادة الأمان)
    glassLayer.classList.remove('allow-click');
    btnUnlock.classList.remove('active-mode');
});

// التنقل للأعلى
btnUp.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateMenuUI();
    }
});

// التنقل للأسفل
btnDown.addEventListener('click', () => {
    if (currentIndex < channelItems.length - 1) {
        currentIndex++;
        updateMenuUI();
    }
});

// // تشغيل القناة عند ضغط OK
// btnOk.addEventListener('click', () => {
//     const selectedLi = channelItems[currentIndex];
//     const newUrl = selectedLi.getAttribute('data-url');

//     // تصفير الإطار لقتل أي عمليات سابقة (تحرير الرام)
//     mainFrame.src = "about:blank";

//     // تحميل الرابط الجديد بعد مهلة قصيرة جداً
//     setTimeout(() => {
//         mainFrame.src = newUrl;
//         channelDisplay.innerText = selectedLi.innerText;
//     }, 50);

//     // إغلاق التحكم
//     overlay.classList.add('hidden');
//     tvTrigger.classList.remove('hidden');
//     movieTrigger.classList.remove('hidden');
// });

// تحديث الشكل البصري للقائمة
function updateMenuUI() {
    channelItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
        if (index === currentIndex) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}



// فتح الأفلام
movieTrigger.addEventListener('click', () => {
    moviesList.classList.remove('hidden');
    tvTrigger.classList.add('hidden');
    movieTrigger.classList.add('hidden');
});

// إغلاق الأفلام
btnCancelMovies.addEventListener('click', () => {
    moviesList.classList.add('hidden');
    tvTrigger.classList.remove('hidden');
    movieTrigger.classList.remove('hidden');

    // إعادة حماية الشاشة تلقائياً عند الإغلاق (لزيادة الأمان)
    glassLayer.classList.remove('allow-click');
    btnUnlock.classList.remove('active-mode');
});

const movieItems = document.querySelectorAll('#movie-list li');
const btnRightMovies = document.querySelector('.btn-up-movies');
const btnLeftMovies = document.querySelector('.btn-down-movies');

let movieIndex = 0;

// تحديث التحديد البصري للأفلام
function updateMoviesUI() {
    movieItems.forEach((item, index) => {
        item.classList.toggle('active', index === movieIndex);
        if (index === movieIndex) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// حركة اليسار (التالي) واليمين (السابق)
btnLeftMovies.addEventListener('click', () => {
    if (movieIndex < movieItems.length - 1) {
        movieIndex++;
        updateMoviesUI();
    }
});

btnRightMovies.addEventListener('click', () => {
    if (movieIndex > 0) {
        movieIndex--;
        updateMoviesUI();
    }
});

// // تشغيل الفيلم عند ضغط OK
// btnOkMovies.addEventListener('click', () => {
//     const selectedMovie = movieItems[movieIndex];
//     const newUrl = selectedMovie.getAttribute('data-url');

//     mainFrame.src = "about:blank";

//     setTimeout(() => {
//         mainFrame.src = newUrl;
//     }, 50);

//     moviesList.classList.add('hidden');
//     tvTrigger.classList.remove('hidden');
//     movieTrigger.classList.remove('hidden');
// });

// --- أضف هاتين الدالتين في أي مكان أعلى الأحداث ---
function clearFrame(frame) {
    try {
        if (frame.contentWindow) {
            frame.contentWindow.stop();
        }
    } catch (e) {}
    
    frame.removeAttribute('src');
    frame.src = "about:blank";
}

function safeLoadStream(newUrl, displayTitle = null) {
    clearFrame(mainFrame);

    setTimeout(() => {
        mainFrame.src = newUrl;
        if (displayTitle && channelDisplay) {
            channelDisplay.innerText = displayTitle;
        }
    }, 200);
}

// --- الكود الجديد لـ btnOk ---
btnOk.addEventListener('click', () => {
    const selectedLi = channelItems[currentIndex];
    const newUrl = selectedLi.getAttribute('data-url');

    safeLoadStream(newUrl, selectedLi.innerText);

    overlay.classList.add('hidden');
    tvTrigger.classList.remove('hidden');
    movieTrigger.classList.remove('hidden');
});

// --- الكود الجديد لـ btnOkMovies ---
btnOkMovies.addEventListener('click', () => {
    const selectedMovie = movieItems[movieIndex];
    const newUrl = selectedMovie.getAttribute('data-url');

    safeLoadStream(newUrl);

    moviesList.classList.add('hidden');
    tvTrigger.classList.remove('hidden');
    movieTrigger.classList.remove('hidden');
});