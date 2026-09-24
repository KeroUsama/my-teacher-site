// 1. عند فتح الصفحة، نتأكد من حالة القفل
window.onload = function() {
    updateLocks();
};

// 2. دالة تُستدعى عند إتمام مهمة
function completeTask(taskNumber) {
    // حفظ تقدم الطالب في ذاكرة المتصفح
    localStorage.setItem('task' + taskNumber + '_done', 'true');
    
    // إظهار تنبيه بسيط
    alert('أحسنت! لقد أتممت المهمة ' + taskNumber);
    
    // تحديث حالة القفل للمهام التالية
    updateLocks();
}

// 3. دالة التحقق من التقدم وفتح المهام التالية
function updateLocks() {
    // المهمة 2 تُفتح فقط إذا تمت المهمة 1
    if (localStorage.getItem('task1_done') === 'true') {
        document.getElementById('task2').classList.remove('locked');
    }
    
    // المهمة 3 تُفتح فقط إذا تمت المهمة 2
    if (localStorage.getItem('task2_done') === 'true') {
        document.getElementById('task3').classList.remove('locked');
    }
}