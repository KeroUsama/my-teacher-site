// ==========================================
// عند فتح الصفحة
// ==========================================
window.onload = function() {
    updateLocks();
    restoreState();
    updateProgress();
};

// ==========================================
// تشغيل الفيديو
// ==========================================
function playVideo(key, videoId) {
    var overlay = document.getElementById('video-overlay-' + key);
    var player = document.getElementById('video-player-' + key);
    
    if (overlay) overlay.style.display = 'none';
    
    if (player) {
        player.classList.remove('hidden');
        
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1&fs=1';
        iframe.title = 'مشغل الفيديو';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        
        player.appendChild(iframe);
    }
}

// ==========================================
// إتمام مهمة
// ==========================================
function completeTask(taskNumber) {
    localStorage.setItem('task' + taskNumber + '_done', 'true');
    alert('أحسنت! لقد أتممت المهمة ' + taskNumber + ' 🎉');
    updateLocks();
    updateProgress();
}

// ==========================================
// فتح المهام التالية
// ==========================================
function updateLocks() {
    var t2 = document.getElementById('task2');
    var t3 = document.getElementById('task3');
    if (t2 && localStorage.getItem('task1_done') === 'true') {
        t2.classList.remove('locked');
    }
    if (t3 && localStorage.getItem('task2_done') === 'true') {
        t3.classList.remove('locked');
    }
}

// ==========================================
// التحقق من المهمة 1 (الفيديو)
// ==========================================
function checkTask1() {
    var watched = document.getElementById('watched').checked;
    document.getElementById('btn1').disabled = !watched;
    localStorage.setItem('watched_video', watched);
}

// ==========================================
// التحقق من المهمة 2 (الواجب)
// ==========================================
function checkTask2() {
    var text = document.getElementById('homework1').value;
    var counter = document.getElementById('counter1');
    counter.textContent = text.length + ' / 20 حرف';
    localStorage.setItem('homework1', text);
    if (text.length >= 20) {
        counter.classList.add('done');
        document.getElementById('btn2').disabled = false;
    } else {
        counter.classList.remove('done');
        document.getElementById('btn2').disabled = true;
    }
}

// ==========================================
// التحقق من المهمة 3 (الاختيار)
// ==========================================
function checkTask3() {
    var selected = document.querySelector('input[name="q1"]:checked');
    document.getElementById('btn3').disabled = !selected;
    if (selected) {
        localStorage.setItem('quiz_answer', selected.value);
    }
}

// ==========================================
// استرجاع الحالة عند إعادة تحميل الصفحة
// ==========================================
function restoreState() {
    if (localStorage.getItem('watched_video') === 'true') {
        var el = document.getElementById('watched');
        if (el) { el.checked = true; checkTask1(); }
    }
    var hw = localStorage.getItem('homework1');
    if (hw) {
        var hwEl = document.getElementById('homework1');
        if (hwEl) { hwEl.value = hw; checkTask2(); }
    }
    var ans = localStorage.getItem('quiz_answer');
    if (ans) {
        var radio = document.querySelector('input[name="q1"][value="' + ans + '"]');
        if (radio) { radio.checked = true; checkTask3(); }
    }
}

// ==========================================
// تحديث شريط التقدم
// ==========================================
function updateProgress() {
    var done = 0;
    if (localStorage.getItem('task1_done') === 'true') done++;
    if (localStorage.getItem('task2_done') === 'true') done++;
    if (localStorage.getItem('task3_done') === 'true') done++;

    var percent = Math.round((done / 3) * 100);

    var fill = document.getElementById('progress-fill');
    var text = document.getElementById('progress-text');

    if (fill) fill.style.width = percent + '%';
    if (text) text.textContent = percent + '%';
}

// ==========================================
// إعادة تعيين التقدم
// ==========================================
function resetProgress() {
    if (confirm('هل أنت متأكد؟ سيتم مسح كل تقدمك والبدء من الأول.')) {
        localStorage.clear();
        location.reload();
    }
}
