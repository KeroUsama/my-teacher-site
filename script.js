// ==========================================
// عند فتح الصفحة
// ==========================================
window.onload = function() {
    if (typeof lessonsData === 'undefined' || !lessonsData.length) {
        console.error('❌ lessonsData مش موجود أو فاضي');
        return;
    }
    renderAllLessons();
    restoreAllStates();
    updateAllProgress();
};

// ==========================================
// بناء الدروس
// ==========================================
function renderAllLessons() {
    var container = document.getElementById('lessons-container');
    if (!container) return;
    
    var html = '';
    
    lessonsData.forEach(function(lesson) {
        html += '<div class="lesson" id="lesson-' + lesson.id + '">';
        html += '<h2 class="lesson-title">' + lesson.title + '</h2>';
        
        html += '<div class="progress-container">';
        html += '<div class="progress-info">';
        html += '<span>تقدمك في الدرس</span>';
        html += '<span class="progress-text" id="progress-text-' + lesson.id + '">0%</span>';
        html += '</div>';
        html += '<div class="progress-bar">';
        html += '<div class="progress-fill" id="progress-fill-' + lesson.id + '"></div>';
        html += '</div>';
        html += '</div>';
        
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
        
        var posterUrl = task.poster ? task.poster : 'https://img.youtube.com/vi/' + task.videoId + '/maxresdefault.jpg';
        
        html += '<div class="video-wrapper" id="video-wrapper-' + key + '" oncontextmenu="return false;">';
        html += '<div class="video-overlay" id="video-overlay-' + key + '" onclick="playVideo(\'' + key + '\', \'' + task.videoId + '\')">';
        html += '<img src="' + posterUrl + '" alt="' + task.title + '" class="video-poster">';
        html += '<div class="play-button">▶</div>';
        html += '</div>';
        html += '<div class="video-player hidden" id="video-player-' + key + '"></div>';
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
        html += '<div class="quiz" id="' + key + '-quiz" data-correct="' + task.correctAnswer + '">';
        task.options.forEach(function(opt) {
            html += '<label>';
            html += '<input type="radio" name="' + key + '-q" value="' + opt.value + '" ';
            html += 'onchange="checkQuiz(\'' + key + '\')">';
            html += opt.text;
            html += '</label>';
        });
        html += '</div>';
        html += '<div class="quiz-feedback" id="' + key + '-feedback"></div>';
        html += '<button id="' + key + '-btn" onclick="completeTask(' + lessonId + ', ' + taskNum + ')" disabled>أتممت المهمة ✅</button>';
    }
    
    html += '</div>';
    return html;
}

// ==========================================
// تشغيل الفيديو مع حماية
// ==========================================
function playVideo(key, videoId) {
    var overlay = document.getElementById('video-overlay-' + key);
    var player = document.getElementById('video-player-' + key);
    
    if (overlay) overlay.style.display = 'none';
    
    if (player) {
        player.classList.remove('hidden');
        player.innerHTML = '';
        
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId + 
                     '?autoplay=1&rel=0&modestbranding=1&fs=1&showinfo=0&iv_load_policy=3&cc_load_policy=0';
        iframe.title = 'مشغل الفيديو';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        player.appendChild(iframe);
        
        var bottomShield = document.createElement('div');
        bottomShield.className = 'video-bottom-shield';
        bottomShield.onclick = function(e) { e.stopPropagation(); };
        player.appendChild(bottomShield);
    }
}

// ==========================================
// التحقق: الفيديو
// ==========================================
function checkVideo(key) {
    var el = document.getElementById(key + '-watched');
    var btn = document.getElementById(key + '-btn');
    if (!el || !btn) return;
    
    var checked = el.checked;
    btn.disabled = !checked;
    localStorage.setItem(key + '-watched', checked);
}

// ==========================================
// التحقق: الواجب
// ==========================================
function checkHomework(key, minChars) {
    var textEl = document.getElementById(key + '-text');
    var counter = document.getElementById(key + '-counter');
    var btn = document.getElementById(key + '-btn');
    if (!textEl || !counter || !btn) return;
    
    var text = textEl.value;
    counter.textContent = text.length + ' / ' + minChars + ' حرف';
    localStorage.setItem(key + '-text', text);
    
    if (text.length >= minChars) {
        counter.classList.add('done');
        btn.disabled = false;
    } else {
        counter.classList.remove('done');
        btn.disabled = true;
    }
}

// ==========================================
// التحقق: الاختيار مع تصحيح تلقائي
// ==========================================
function checkQuiz(key) {
    var quiz = document.getElementById(key + '-quiz');
    var feedback = document.getElementById(key + '-feedback');
    var btn = document.getElementById(key + '-btn');
    if (!quiz || !feedback || !btn) return;
    
    var correct = quiz.getAttribute('data-correct');
    var selected = document.querySelector('input[name="' + key + '-q"]:checked');
    
    quiz.querySelectorAll('label').forEach(function(label) {
        label.classList.remove('correct', 'incorrect');
    });
    
    if (!selected) {
        btn.disabled = true;
        feedback.textContent = '';
        return;
    }
    
    if (selected.value === correct) {
        btn.disabled = false;
        selected.parentElement.classList.add('correct');
        feedback.textContent = '✅ إجابة صحيحة!';
        feedback.style.color = '#4A9D7E';
        localStorage.setItem(key + '-answer', selected.value);
    } else {
        btn.disabled = true;
        selected.parentElement.classList.add('incorrect');
        feedback.textContent = '❌ إجابة خاطئة، حاول تاني.';
        feedback.style.color = '#E74C3C';
    }
}

// ==========================================
// إتمام مهمة
// ==========================================
function completeTask(lessonId, taskNum) {
    var key = 'l' + lessonId + '-t' + taskNum;
    
    if (localStorage.getItem(key + '-done') === 'true') {
        return;
    }
    
    localStorage.setItem(key + '-done', 'true');
    alert('أحسنت! لقد أتممت المهمة ' + taskNum + ' 🎉');
    
    markTaskDone(key);
    
    var lesson = lessonsData.find(function(l) { return l.id === lessonId; });
    if (!lesson) return;
    
    unlockNextTask(lessonId, taskNum, lesson.tasks.length);
    updateLessonProgress(lessonId, lesson.tasks.length);
}

// ==========================================
// علّم المهمة كمكتملة
// ==========================================
function markTaskDone(key) {
    var task = document.getElementById('task-' + key);
    var btn = document.getElementById(key + '-btn');
    
    if (task) task.classList.add('completed');
    if (btn) {
        btn.disabled = true;
        btn.textContent = '✅ تمت المهمة';
    }
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
            var isDone = localStorage.getItem(key + '-done') === 'true';
            
            if (isDone) {
                markTaskDone(key);
                unlockNextTask(lesson.id, taskNum, lesson.tasks.length);
                return;
            }
            
            if (task.type === 'video' && localStorage.getItem(key + '-watched') === 'true') {
                var el = document.getElementById(key + '-watched');
                if (el) { el.checked = true; checkVideo(key); }
            }
            
            if (task.type === 'homework') {
                var text = localStorage.getItem(key + '-text');
                if (text) {
                    var el = document.getElementById(key + '-text');
                    if (el) { el.value = text; checkHomework(key, task.minChars); }
                }
            }
            
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
