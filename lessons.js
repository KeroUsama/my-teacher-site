const lessonsData = [
    {
        id: 1,
        title: "الدرس الأول: الأساسيات",
        tasks: [
            {
                type: "video",
                title: "المهمة 1: مشاهدة الفيديو التمهيدي",
                description: "اتفرج على الفيديو ده كويس عشان تفهم أساسيات الدرس.",
                videoId: "-tCl_QkUTQ8",
                poster: ""
            },
            {
                type: "homework",
                title: "المهمة 2: حل الواجب الأول",
                question: "اشرح بجملتين إيه اللي فهمته من الفيديو.",
                minChars: 20
            },
            {
                type: "quiz",
                title: "المهمة 3: اختبر نفسك",
                question: "اختار الإجابة الصحيحة:",
                options: [
                    { value: "a", text: "You" },
                    { value: "b", text: "Me" },
                    { value: "c", text: "Both" }
                ],
                correctAnswer: "b"
            }
        ]
    }
];
