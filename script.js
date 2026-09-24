// ==========================================
// عند فتح الصفحة
// ==========================================
window.onload = function() {
    renderAllLessons();
    restoreAllStates();
    updateAllProgress();
};

// ==========================================
// بناء الدروس
// ==========================================
function renderAllLessons() {
    var container = document.getElementById('lessons-container');
    var html = '';
    
    lessonsData.forEach(function(lesson) {
        html += '<div class="lesson" id="lesson-' + lesson.id + '">';
        html += '<h2 class="lesson-title">' + lesson.title + '</h2>';
        
        // شريط تقدم الدرس
        html += '<div class="progress-container">';
        html += '<div class="progress-info">';
        html += '<span>تقدمك في الدرس</span>';
        html += '<span class="progress-text" id="progress-text-' + lesson.id + '">0%</span>';
        html += '</div>';
        html += '<div class="progress-bar">';
        html += '<div class="progress-fill" id="progress-fill-' + lesson.id + '"></div>';
        html += '</div>';
        html += '</div>';
        
        // المهام
        lesson.tasks.forEach(function(task, index) {
            html += renderTask(lesson.id, index, task);
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

// ==========================================
// بناء مهمة واحدة
// ==========================================
function renderTask(lessonId, taskIndex, task) {
    var taskNum = taskIndex + 1;
    var key = 'l' + lessonId + '-t' + taskNum;
    var lockedClass = taskIndex === 0 ? '' : ' locked';
    
    var html = '<div class="task' + lockedClass + '" id="task-' + key + '">';
    html += '<h2>' + task.title + '</h2>';
    
    if (task.type === 'video') {
        html += '<p>' + task.description + '</p>';
        html += '<div class="video-box">';
        html += '<iframe src="https://www.youtube.com/embed/' + task.videoId + '?rel=0&modestbranding=1" ';
        html += 'title="' + task.title + '" allowfullscreen ';
        html += 'referrerpolicy="strict-origin-when-cross-origin"></iframe>';
        html += '</div>';
        html += '<label class="confirm-box">';
        html += '<input type="checkbox" id="' + key + '-watched" onchange="checkVideo(\'' + key + '\')">';
        html += '<span>شاهدت الفيديو بالكامل ✅</span>';
        html += '</label>';
        html += '<button id="' + key + '-btn" onclick="completeTask(' + lessonId + ', ' + taskNum + ')" disabled>أتممت المهمة ✅</button>';
    }
    
    if (task.type === 'homework') {
        html += '<p>' + task.question + '</p>';
        html += '<textarea id="' + key + '-text" rows="5" ';
        html += 'placeholder="اكتب إجابتك هنا (' + task.minChars + ' حرف على الأقل)..." ';
        html += 'oninput="checkHomework(\'' + key + '\', ' + task.minChars + ')"></textarea>';
        html += '<div class="counter" id="' + key + '-counter">0 / ' + task.minChars + ' حرف</div>';
        html += '<button id="' + key + '-btn" onclick="completeTask(' + lessonId + ', ' + taskNum + ')" disabled>أتممت المهمة ✅</button>';
    }
    
    if (task.type === 'quiz') {
        html += '<p>' + task.question + '</p>';
        html += '<div class="quiz">';
        task.options.forEach(function(opt) {
            html += '<label>';
            html += '<input type="radio" name="' + key + '-q" value="' + opt.value + '" ';
            html += 'onchange="checkQuiz(\'' + key + '\')">';
            html += opt.text;
            html += '</label>';
        });
        html += '</div>';
        html += '<button id="' + key + '-btn" onclick="completeTask(' + lessonId + ', ' + taskNum + ')" disabled>أتممت المهمة ✅</button>';
    }
    
    html += '</div>';
    return html;
}

// ==========================================
// التحقق: الفيديو
// ==========================================
function checkVideo(key) {
    var checked = document.getElementById(key + '-watched').checked;
    document.getElementById(key + '-btn').disabled = !checked;
    localStorage.setItem(key + '-watched', checked);
}

// ==========================================
// التحقق: الواجب
// ==========================================
function checkHomework(key, minChars) {
    var text = document.getElementById(key + '-text').value;
    var counter = document.getElementById(key + '-counter');
    counter.textContent = text.length + ' / ' + minChars + ' حرف';
    localStorage.setItem(key + '-text', text);
    
    if (text.length >= minChars) {
        counter.classList.add('done');
        document.getElementById(key + '-btn').disabled = false;
    } else {
        counter.classList.remove('done');
        document.getElementById(key + '-btn').disabled = true;
    }
}

// ==========================================
// التحقق: الاختيار
// ==========================================
function checkQuiz(key) {
    var selected = document.querySelector('input[name="' + key + '-q"]:checked');
    document.getElementById(key + '-btn').disabled = !selected;
    if (selected) {
        localStorage.setItem(key + '-answer', selected.value);
    }
}

// ==========================================
// إتمام مهمة
// ==========================================
function completeTask(lessonId, taskNum) {
    var key = 'l' + lessonId + '-t' + taskNum;
    localStorage.setItem(key + '-done', 'true');
    alert('أحسنت! لقد أتممت المهمة ' + taskNum + ' 🎉');
    
    var lesson = lessonsData.find(function(l) { return l.id === lessonId; });
    unlockNextTask(lessonId, taskNum, lesson.tasks.length);
    updateLessonProgress(lessonId, lesson.tasks.length);
}

// ==========================================
// فتح المهمة التالية
// ==========================================
function unlockNextTask(lessonId, currentTaskNum, totalTasks) {
    if (currentTaskNum < totalTasks) {
        var nextKey = 'l' + lessonId + '-t' + (currentTaskNum + 1);
        var nextTask = document.getElementById('task-' + nextKey);
        if (nextTask) nextTask.classList.remove('locked');
    }
}

// ==========================================
// تحديث تقدم درس واحد
// ==========================================
function updateLessonProgress(lessonId, totalTasks) {
    var done = 0;
    for (var i = 1; i <= totalTasks; i++) {
        if (localStorage.getItem('l' + lessonId + '-t' + i + '-done') === 'true') done++;
    }
    var percent = Math.round((done / totalTasks) * 100);
    
    var fill = document.getElementById('progress-fill-' + lessonId);
    var text = document.getElementById('progress-text-' + lessonId);
    if (fill) fill.style.width = percent + '%';
    if (text) text.textContent = percent + '%';
}

// ==========================================
// تحديث كل الدروس
// ==========================================
function updateAllProgress() {
    lessonsData.forEach(function(lesson) {
        updateLessonProgress(lesson.id, lesson.tasks.length);
    });
}

// ==========================================
// استرجاع الحالة عند إعادة تحميل الصفحة
// ==========================================
function restoreAllStates() {
    lessonsData.forEach(function(lesson) {
        lesson.tasks.forEach(function(task, index) {
            var taskNum = index + 1;
            var key = 'l' + lesson.id + '-t' + taskNum;
            
            // فتح المهام المكتملة
            if (localStorage.getItem(key + '-done') === 'true') {
                unlockNextTask(lesson.id, taskNum, lesson.tasks.length);
            }
            
            // استرجاع حالة الفيديو
            if (task.type === 'video' && localStorage.getItem(key + '-watched') === 'true') {
                var el = document.getElementById(key + '-watched');
                if (el) { el.checked = true; checkVideo(key); }
            }
            
            // استرجاع نص الواجب
            if (task.type === 'homework') {
                var text = localStorage.getItem(key + '-text');
                if (text) {
                    var el = document.getElementById(key + '-text');
                    if (el) { el.value = text; checkHomework(key, task.minChars); }
                }
            }
            
            // استرجاع إجابة الاختيار
            if (task.type === 'quiz') {
                var ans = localStorage.getItem(key + '-answer');
                if (ans) {
                    var radio = document.querySelector('input[name="' + key + '-q"][value="' + ans + '"]');
                    if (radio) { radio.checked = true; checkQuiz(key); }
                }
            }
        });
    });
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
