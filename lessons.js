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
    },
    {
        id: 2,
        title: "الدرس التاني: التطبيق العملي",
        tasks: [
            {
                type: "video",
                title: "المهمة 1: مشاهدة الفيديو التطبيقي",
                description: "اتفرج على الفيديو ده عشان تشوف التطبيق العملي للدرس.",
                videoId: "-tCl_QkUTQ8",
                poster: ""
            },
            {
                type: "homework",
                title: "المهمة 2: اكتب ملخصك",
                question: "اكتب ملخص بسيط عن اللي فهمته من الفيديو التطبيقي.",
                minChars: 30
            },
            {
                type: "quiz",
                title: "المهمة 3: اختبر نفسك",
                question: "اختار الإجابة الصحيحة:",
                options: [
                    { value: "a", text: "الإجابة الأولى" },
                    { value: "b", text: "الإجابة التانية" },
                    { value: "c", text: "الإجابة التالتة" }
                ],
                correctAnswer: "a"
            }
        ]
    }
];
