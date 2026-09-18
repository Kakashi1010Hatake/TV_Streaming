const menuTrigger = document.getElementById('menu-trigger');
const overlay = document.getElementById('tv-overlay');
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnOk = document.getElementById('btn-ok');

const channelItems = document.querySelectorAll('#channel-list li');
const videoWrapper = document.getElementById('video-wrapper');
const channelDisplay = document.getElementById('channel-display');
const btnCancel = document.getElementById('btn-cancel');

let currentIndex = 0;
let hlsPlayer = null; // الاحتفاظ بمشغل HLS لتنظيفه لاحقاً

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

// اختيار القناة وتشغيلها مع تحرير ذاكرة RAM التلفزيون
btnOk.addEventListener('click', () => {
    const selectedLi = channelItems[currentIndex];
    const newUrl = selectedLi.getAttribute('data-url');
    const isCustomSize = selectedLi.getAttribute('data-custom-size') === 'true';

    // 1. تدوير/ضبط حجم الحاوية
    if (isCustomSize) {
        videoWrapper.classList.add('custom-size');
    } else {
        videoWrapper.classList.remove('custom-size');
    }

    // 2. تنظيف العناصر القديمة لتفريغ الذاكرة بالكامل
    cleanVideoWrapper();

    // 3. التحقق مما إذا كانت القناة رابط بث مباشر .m3u8
    if (newUrl.includes('.m3u8')) {
        createHlsVideoPlayer(newUrl);
    } else {
        createCleanIframe(newUrl);
    }

    if (channelDisplay) channelDisplay.innerText = selectedLi.innerText;

    // إغلاق الواجهة
    overlay.classList.add('hidden');
    menuTrigger.classList.remove('hidden');
});

// تفريغ وتدمير العناصر القديمة من الذاكرة
function cleanVideoWrapper() {
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }
    videoWrapper.innerHTML = ''; // مسح كلي للـ DOM
}

// إنشاء iFrame جديد وتفريغ القديم
function createCleanIframe(url) {
    const iframe = document.createElement('iframe');
    iframe.id = 'main-tv-frame';
    iframe.src = url;
    iframe.allow = 'autoplay; encrypted-media; fullscreen';
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    iframe.allowFullscreen = true;
    
    videoWrapper.appendChild(iframe);
}

// تشغيل روابط HLS (.m3u8) عبر عنصر video مخصص
function createHlsVideoPlayer(m3u8Url) {
    const video = document.createElement('video');
    video.id = 'main-tv-video';
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.border = 'none';

    videoWrapper.appendChild(video);

    if (Hls.isSupported()) {
        hlsPlayer = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        hlsPlayer.loadSource(m3u8Url);
        hlsPlayer.attachMedia(video);
        hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {
                video.muted = true;
                video.play();
            });
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = m3u8Url;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    }
}

// تحديث الشكل البصري للقائمة
function updateMenuUI() {
    channelItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
        if (index === currentIndex) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// وظيفة زر الإلغاء: إخفاء القائمة والعودة للمشاهدة
btnCancel.addEventListener('click', () => {
    overlay.classList.add('hidden');
    menuTrigger.classList.remove('hidden');

    // التحقق من وجود العناصر وتجنب الأخطاء في حال عدم التثبيت بالصفحة
    const glassLayer = document.getElementById('glass-layer');
    const btnUnlock = document.getElementById('btn-unlock');

    if (glassLayer) glassLayer.classList.remove('allow-click');
    if (btnUnlock) btnUnlock.classList.remove('active-mode');
});
