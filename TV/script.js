const tvTrigger = document.getElementById('btn-open-channels');
const home = document.getElementById('btn-home');
const overlay = document.getElementById('tv-overlay');

const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnOk = document.getElementById('btn-ok');
const btnCancel = document.getElementById('btn-cancel');

const channelItems = document.querySelectorAll('#channel-list li');
const mainFrame = document.getElementById('main-tv-frame');
const channelDisplay = document.getElementById('channel-display');

let currentIndex = 0;

// فتح القائمة
tvTrigger.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    tvTrigger.classList.add('hidden');
    home.classList.add('hidden');
});

// إغلاق القائمة
btnCancel.addEventListener('click', () => {
    overlay.classList.add('hidden');
    tvTrigger.classList.remove('hidden');
    home.classList.remove('hidden');

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

// تحديث الشكل البصري للقائمة
function updateMenuUI() {
    channelItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
        if (index === currentIndex) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// --- أضف هاتين الدالتين في أي مكان أعلى الأحداث ---
function clearFrame(frame) {
    try {
        if (frame.contentWindow) {
            frame.contentWindow.stop();
        }
    } catch (e) {}
    
    frame.src = "about:blank";
    frame.removeAttribute('src');
}

function safeLoadStream(newUrl, displayTitle = null) {
    clearFrame(mainFrame);

    setTimeout(() => {
        mainFrame.setAttribute('src', newUrl);
        if (displayTitle && channelDisplay) {
            channelDisplay.innerText = displayTitle;
        }
    }, 300);
}

// --- الكود الجديد لـ btnOk ---
btnOk.addEventListener('click', () => {
    const selectedLi = channelItems[currentIndex];
    const newUrl = selectedLi.getAttribute('data-url');

    safeLoadStream(newUrl, selectedLi.innerText);

    overlay.classList.add('hidden');
    tvTrigger.classList.remove('hidden');
    home.classList.remove('hidden');
});

// --- أضف هذا الكود في نهاية ملف script.js ---
let isPageVisible = true;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        isPageVisible = false;
    } else {
        isPageVisible = true;
        if (mainFrame.src && mainFrame.src !== "about:blank") {
            const currentSrc = mainFrame.src;
            clearFrame(mainFrame);
            setTimeout(() => { mainFrame.src = currentSrc; }, 300);
        }
    }
});

// تنظيف الذاكرة تلقائياً كل 45 دقيقة لمنع تجمد الصوت والصورة
setInterval(() => {
    if (isPageVisible && mainFrame.src && mainFrame.src !== "about:blank") {
        const currentSrc = mainFrame.src;
        mainFrame.src = "about:blank";
        setTimeout(() => {
            mainFrame.src = currentSrc;
        }, 200);
    }
}, 45 * 60 * 1000);
