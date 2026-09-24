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
    if (localStorage.getItem('task1_done') === 'true') {
        document.getElementById('task2').classList.remove('locked');
    }
    if (localStorage.getItem('task2_done') === 'true') {
        document.getElementById('task3').classList.remove('locked');
    }
}

function checkTask1() {
    const watched = document.getElementById('watched').checked;
    document.getElementById('btn1').disabled = !watched;
    localStorage.setItem('watched_video', watched);
}

function checkTask2() {
    const text = document.getElementById('homework1').value;
    const counter = document.getElementById('counter1');
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
    const selected = document.querySelector('input[name="q1"]:checked');
    document.getElementById('btn3').disabled = !selected;
    if (selected) {
        localStorage.setItem('quiz_answer', selected.value);
    }
}

function restoreState() {
    if (localStorage.getItem('watched_video') === 'true') {
        const el = document.getElementById('watched');
        if (el) { el.checked = true; checkTask1(); }
    }
    const hw = localStorage.getItem('homework1');
    if (hw) {
        const el = document.getElementById('homework1');
        if (el) { el.value = hw; checkTask2(); }
    }
    const ans = localStorage.getItem('quiz_answer');
    if (ans) {
        const radio = document.querySelector('input[name="q1"][value="' + ans + '"]');
        if (radio) { radio.checked = true; checkTask3(); }
    }
}
