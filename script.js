const menuTrigger = document.getElementById('menu-trigger');
const overlay = document.getElementById('tv-overlay');
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnOk = document.getElementById('btn-ok');

const channelItems = document.querySelectorAll('#channel-list li');
const mainFrame = document.getElementById('main-tv-frame');
const channelDisplay = document.getElementById('channel-display');

const btnCancel = document.getElementById('btn-cancel');

let currentIndex = 0;

// فتح القائمة
menuTrigger.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    menuTrigger.classList.add('hidden');
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

const videoWrapper = document.getElementById('video-wrapper');

btnOk.addEventListener('click', () => {
    const selectedLi = channelItems[currentIndex];
    const newUrl = selectedLi.getAttribute('data-url');
    const isCustomSize = selectedLi.getAttribute('data-custom-size') === 'true';

    // تصفير الإطار لقتل أي عمليات سابقة (تحرير الرام)
    mainFrame.src = "about:blank";

    // تغيير كلاس الحاوية حسب نوع القناة
    if (isCustomSize) {
        videoWrapper.classList.add('custom-size');
    } else {
        videoWrapper.classList.remove('custom-size');
    }

    // تحميل الرابط الجديد بعد مهلة قصيرة
    setTimeout(() => {
        mainFrame.src = newUrl;
        if (channelDisplay) channelDisplay.innerText = selectedLi.innerText;
    }, 50);

    // إغلاق الواجهة
    overlay.classList.add('hidden');
    menuTrigger.classList.remove('hidden');
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

// وظيفة زر الإلغاء: إغفاء القائمة والعودة للمشاهدة
btnCancel.addEventListener('click', () => {
    // إخفاء الواجهة بالكامل
    overlay.classList.add('hidden');
    // إظهار زر فتح القائمة الأصلي
    menuTrigger.classList.remove('hidden');
    
    // إعادة حماية الشاشة تلقائياً عند الإغلاق (لزيادة الأمان)
    glassLayer.classList.remove('allow-click');
    btnUnlock.classList.remove('active-mode');
});
