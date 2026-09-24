window.onload = function() {
    updateLocks();
    restoreState();
};

function completeTask(taskNumber) {
    localStorage.setItem('task' + taskNumber + '_done', 'true');
    alert('أحسنت! لقد أتممت المهمة ' + taskNumber + ' 🎉');
    updateLocks();
}

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

function checkTask1() {
    var watched = document.getElementById('watched').checked;
    document.getElementById('btn1').disabled = !watched;
    localStorage.setItem('watched_video', watched);
}

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

function checkTask3() {
    var selected = document.querySelector('input[name="q1"]:checked');
    document.getElementById('btn3').disabled = !selected;
    if (selected) {
        localStorage.setItem('quiz_answer', selected.value);
    }
}

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
