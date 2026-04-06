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

// تشغيل القناة عند ضغط OK
btnOk.addEventListener('click', () => {
    const selectedLi = channelItems[currentIndex];
    const newUrl = selectedLi.getAttribute('data-url');

    // تصفير الإطار لقتل أي عمليات سابقة (تحرير الرام)
    mainFrame.src = "about:blank";

    // تحميل الرابط الجديد بعد مهلة قصيرة جداً
    setTimeout(() => {
        mainFrame.src = newUrl;
        channelDisplay.innerText = selectedLi.innerText;
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