/* =========================================
   MOYO'S A-LEVEL CHEMISTRY
   QUIZ ENGINE
========================================= */


/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
    "https://nyaxublavisbkbxcxxqc.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OiRIQXo8SQjm6ZeT7VXtoA_RqaK2p74";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================
   QUIZ SETTINGS
========================================= */

const QUIZ_SETTINGS = {

    topic: "Chemistry Challenge",

    questions: 40,

    duration: 30,

    /*
       CHANGE THIS FOR A NEW QUIZ.

       TOPIC_01
       TOPIC_02
       TOPIC_03
       etc.
    */

    version: "TOPIC_03",

    accessCode: "MOYO101",

    /*
       false = one attempt per browser
       true  = retakes allowed
    */

    allowRetakes: false

};


/* =========================================
   QUESTIONS
========================================= */

/*
   THIS IS THE ONLY QUESTION BANK.

   Edit questions here.

   answer:
   0 = A
   1 = B
   2 = C
   3 = D
*/


const QUESTIONS = [

    {
        question:
            "Which of the following particles determines the identity of an element?",

        options: [
            "Neutrons",
            "Protons",
            "Electrons",
            "Nucleons"
        ],

        answer: 1
    },


    {
        question:
            "What is the electronic configuration of sodium (Na), atomic number 11?",

        options: [
            "2, 8, 1",
            "2, 7, 2",
            "2, 8, 2",
            "2, 6, 3"
        ],

        answer: 0
    },


    {
        question:
            "Which type of bonding involves the electrostatic attraction between oppositely charged ions?",

        options: [
            "Covalent bonding",
            "Metallic bonding",
            "Ionic bonding",
            "Hydrogen bonding"
        ],

        answer: 2
    },


    {
        question:
            "Which of the following has the highest electronegativity?",

        options: [
            "Oxygen",
            "Chlorine",
            "Fluorine",
            "Nitrogen"
        ],

        answer: 2
    },


    {
        question:
            "What is the oxidation state of oxygen in H₂O?",

        options: [
            "+2",
            "-2",
            "+1",
            "-1"
        ],

        answer: 1
    }

];


/* =========================================
   TEMPORARY TEST QUESTION FILLER
========================================= */

while (
    QUESTIONS.length <
    QUIZ_SETTINGS.questions
) {

    const original =
        QUESTIONS[
            QUESTIONS.length % 5
        ];

    QUESTIONS.push({

        question:
            original.question,

        options:
            [...original.options],

        answer:
            original.answer

    });

}


/* =========================================
   DOM ELEMENTS
========================================= */

const accessScreen =
    document.getElementById(
        "access-screen"
    );

const quizScreen =
    document.getElementById(
        "quiz-screen"
    );

const accessForm =
    document.getElementById(
        "access-form"
    );

const studentNameInput =
    document.getElementById(
        "student-name"
    );

const accessCodeInput =
    document.getElementById(
        "access-code"
    );

const accessError =
    document.getElementById(
        "access-error"
    );

const questionText =
    document.getElementById(
        "question-text"
    );

const optionsContainer =
    document.getElementById(
        "options-container"
    );

const currentQuestionElement =
    document.getElementById(
        "current-question"
    );

const totalQuestionElement =
    document.getElementById(
        "total-question"
    );

const questionNumberElement =
    document.getElementById(
        "question-number"
    );

const studentDisplay =
    document.getElementById(
        "student-display"
    );

const progressBar =
    document.getElementById(
        "progress-bar"
    );

const timerElement =
    document.getElementById(
        "timer"
    );

const previousButton =
    document.getElementById(
        "previous-button"
    );

const nextButton =
    document.getElementById(
        "next-button"
    );

const submitContainer =
    document.getElementById(
        "submit-container"
    );

const submitButton =
    document.getElementById(
        "submit-button"
    );

const submitModal =
    document.getElementById(
        "submit-modal"
    );

const cancelSubmit =
    document.getElementById(
        "cancel-submit"
    );

const confirmSubmit =
    document.getElementById(
        "confirm-submit"
    );


/* =========================================
   STATE
========================================= */

let studentName = "";

let currentQuestionIndex = 0;

let selectedAnswers =
    new Array(
        QUESTIONS.length
    ).fill(null);

let timeRemaining =
    QUIZ_SETTINGS.duration * 60;

let timerInterval = null;


/* =========================================
   BROWSER STORAGE KEYS
========================================= */

const BROWSER_ATTEMPT_KEY =
    "moyo_quiz_completed_" +
    QUIZ_SETTINGS.version;


const BROWSER_RESULT_KEY =
    "moyo_quiz_browser_result_" +
    QUIZ_SETTINGS.version;


/* =========================================
   INITIAL SETUP
========================================= */

const accessQuestionCount =
    document.getElementById(
        "access-question-count"
    );


if (accessQuestionCount) {

    accessQuestionCount.textContent =
        QUESTIONS.length;

}


const accessDuration =
    document.getElementById(
        "access-duration"
    );


if (accessDuration) {

    accessDuration.textContent =
        `${QUIZ_SETTINGS.duration} min`;

}


totalQuestionElement.textContent =
    QUESTIONS.length;


/* =========================================
   BROWSER ATTEMPT CHECK
========================================= */

function hasBrowserCompletedQuiz() {

    return (
        localStorage.getItem(
            BROWSER_ATTEMPT_KEY
        ) === "true"
    );

}


/* =========================================
   SAVE BROWSER ATTEMPT
========================================= */

function markBrowserAsCompleted() {

    localStorage.setItem(
        BROWSER_ATTEMPT_KEY,
        "true"
    );

}


/* =========================================
   SAVE BROWSER RESULT
========================================= */

function saveBrowserResult(
    result
) {

    localStorage.setItem(
        BROWSER_RESULT_KEY,
        JSON.stringify(
            result
        )
    );

}


/* =========================================
   GET BROWSER RESULT
========================================= */

function getBrowserResult() {

    const saved =
        localStorage.getItem(
            BROWSER_RESULT_KEY
        );


    if (!saved) {

        return null;

    }


    try {

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "Could not read saved result:",
            error
        );

        return null;

    }

}


/* =========================================
   ACCESS FORM
========================================= */

accessForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            studentNameInput.value.trim();

        const code =
            accessCodeInput.value.trim();


        clearError();


        /* =====================================
           CHECK NAME
        ===================================== */

        if (name.length < 2) {

            showError(
                "Please enter your full name."
            );

            return;

        }


        /* =====================================
           CHECK ACCESS CODE
        ===================================== */

        if (
            code.toUpperCase() !==
            QUIZ_SETTINGS.accessCode.toUpperCase()
        ) {

            showError(
                "Incorrect access code. Please check the code and try again."
            );

            return;

        }


        /* =====================================
           BROWSER ATTEMPT CHECK
        ===================================== */

        if (
            !QUIZ_SETTINGS.allowRetakes &&
            hasBrowserCompletedQuiz()
        ) {

            const savedResult =
                getBrowserResult();


            /*
               The browser has already
               completed this quiz.

               The name entered now does
               NOT matter.
            */

            if (savedResult) {

                sessionStorage.setItem(
                    "moyo_quiz_result",
                    JSON.stringify(
                        savedResult
                    )
                );


                sessionStorage.setItem(
                    "moyo_student_name",
                    savedResult.studentName
                );

            }


            window.location.href =
                "results.html";


            return;

        }


        /* =====================================
           SAVE NAME
        ===================================== */

        studentName =
            name;


        sessionStorage.setItem(
            "moyo_student_name",
            studentName
        );


        /* =====================================
           START QUIZ
        ===================================== */

        startQuiz();

    }
);


/* =========================================
   ERROR FUNCTIONS
========================================= */

function showError(message) {

    accessError.textContent =
        message;

    accessError.classList.add(
        "show"
    );

}


function clearError() {

    accessError.textContent =
        "";

    accessError.classList.remove(
        "show"
    );

}


/* =========================================
   START QUIZ
========================================= */

function startQuiz() {

    accessScreen.classList.remove(
        "active"
    );

    quizScreen.classList.add(
        "active"
    );


    studentDisplay.textContent =
        studentName;


    currentQuestionIndex = 0;


    selectedAnswers =
        new Array(
            QUESTIONS.length
        ).fill(null);


    timeRemaining =
        QUIZ_SETTINGS.duration *
        60;


    startTimer();

    renderQuestion();

}


/* =========================================
   RENDER QUESTION
========================================= */

function renderQuestion() {

    const question =
        QUESTIONS[
            currentQuestionIndex
        ];


    const questionNumber =
        currentQuestionIndex + 1;


    currentQuestionElement.textContent =
        questionNumber;


    questionNumberElement.textContent =
        `QUESTION ${String(
            questionNumber
        ).padStart(
            2,
            "0"
        )}`;


    questionText.textContent =
        question.question;


    optionsContainer.innerHTML =
        "";


    question.options.forEach(
        function (
            option,
            index
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "option";


            if (
                selectedAnswers[
                    currentQuestionIndex
                ] === index
            ) {

                button.classList.add(
                    "selected"
                );

            }


            const letter =
                document.createElement(
                    "span"
                );


            letter.className =
                "option-letter";


            letter.textContent =
                String.fromCharCode(
                    65 + index
                );


            const text =
                document.createElement(
                    "span"
                );


            text.className =
                "option-text";


            text.textContent =
                option;


            button.appendChild(
                letter
            );

            button.appendChild(
                text
            );


            button.addEventListener(
                "click",
                function () {

                    selectAnswer(
                        index
                    );

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );


    const progress =
        (
            (
                currentQuestionIndex +
                1
            ) /
            QUESTIONS.length
        ) * 100;


    progressBar.style.width =
        `${progress}%`;


    previousButton.disabled =
        currentQuestionIndex === 0;


    if (
        currentQuestionIndex ===
        QUESTIONS.length - 1
    ) {

        nextButton.textContent =
            "Finish →";

        submitContainer.classList.add(
            "show"
        );

    } else {

        nextButton.textContent =
            "Next →";

        submitContainer.classList.remove(
            "show"
        );

    }

}


/* =========================================
   SELECT ANSWER
========================================= */

function selectAnswer(index) {

    selectedAnswers[
        currentQuestionIndex
    ] = index;


    renderQuestion();

}


/* =========================================
   NEXT
========================================= */

nextButton.addEventListener(
    "click",
    function () {

        if (
            currentQuestionIndex <
            QUESTIONS.length - 1
        ) {

            currentQuestionIndex++;

            renderQuestion();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } else {

            openSubmitModal();

        }

    }
);


/* =========================================
   PREVIOUS
========================================= */

previousButton.addEventListener(
    "click",
    function () {

        if (
            currentQuestionIndex > 0
        ) {

            currentQuestionIndex--;

            renderQuestion();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }
);


/* =========================================
   TIMER
========================================= */

function startTimer() {

    clearInterval(
        timerInterval
    );


    updateTimer();


    timerInterval =
        setInterval(
            function () {

                timeRemaining--;

                updateTimer();


                if (
                    timeRemaining <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );

                    submitQuiz();

                }

            },
            1000
        );

}


/* =========================================
   UPDATE TIMER
========================================= */

function updateTimer() {

    const minutes =
        Math.floor(
            timeRemaining / 60
        );


    const seconds =
        timeRemaining % 60;


    timerElement.textContent =
        `${String(
            minutes
        ).padStart(
            2,
            "0"
        )}:${String(
            seconds
        ).padStart(
            2,
            "0"
        )}`;


    if (
        timeRemaining <= 300
    ) {

        timerElement.classList.add(
            "warning"
        );

    } else {

        timerElement.classList.remove(
            "warning"
        );

    }

}


/* =========================================
   SUBMIT MODAL
========================================= */

submitButton.addEventListener(
    "click",
    openSubmitModal
);


function openSubmitModal() {

    submitModal.classList.add(
        "show"
    );

}


cancelSubmit.addEventListener(
    "click",
    function () {

        submitModal.classList.remove(
            "show"
        );

    }
);


confirmSubmit.addEventListener(
    "click",
    function () {

        submitQuiz();

    }
);


/* =========================================
   SUBMIT QUIZ
========================================= */

async function submitQuiz() {

    clearInterval(
        timerInterval
    );


    submitModal.classList.remove(
        "show"
    );


    /*
       Prevent accidental double submission.
    */

    confirmSubmit.disabled = true;


    /* =====================================
       CALCULATE SCORE
    ===================================== */

    let score = 0;


    QUESTIONS.forEach(
        function (
            question,
            index
        ) {

            if (
                selectedAnswers[index] ===
                question.answer
            ) {

                score++;

            }

        }
    );


    /* =====================================
       PERCENTAGE
    ===================================== */

    const percentage =
        Math.round(
            (
                score /
                QUESTIONS.length
            ) * 100
        );


    /* =====================================
       SAVE QUESTIONS FOR RESULTS
    ===================================== */

    const resultQuestions =
        QUESTIONS.map(
            function (question) {

                return {

                    question:
                        question.question,

                    options:
                        [...question.options],

                    answer:
                        question.answer

                };

            }
        );


    /* =====================================
       CREATE RESULT
    ===================================== */

    const result = {

        studentName:
            studentName,

        score:
            score,

        total:
            QUESTIONS.length,

        percentage:
            percentage,

        answers:
            [...selectedAnswers],

        questions:
            resultQuestions,

        quizVersion:
            QUIZ_SETTINGS.version,

        submittedAt:
            new Date().toISOString()

    };


    /* =====================================
       SAVE RESULT LOCALLY
    ===================================== */

    /*
       VERY IMPORTANT:

       We save the result AND lock the
       browser BEFORE contacting Supabase.

       Therefore Supabase cannot prevent
       the student from seeing results.
    */

    if (
        !QUIZ_SETTINGS.allowRetakes
    ) {

        markBrowserAsCompleted();

        saveBrowserResult(
            result
        );

    }


    sessionStorage.setItem(
        "moyo_quiz_result",
        JSON.stringify(
            result
        )
    );


    /* =====================================
       SAVE TO SUPABASE
    ===================================== */

    const studentKey =
        studentName
            .trim()
            .toLowerCase()
            .replace(
                /\s+/g,
                " "
            );


    let supabaseError = null;


    try {

        const response =
            await Promise.race([

                supabaseClient
                    .from("quiz_results")
                    .insert({

                        student_name:
                            studentName,

                        student_key:
                            studentKey,

                        score:
                            score,

                        total_questions:
                            QUESTIONS.length,

                        percentage:
                            percentage,

                        quiz_version:
                            QUIZ_SETTINGS.version

                    }),

                new Promise(
                    function (resolve) {

                        setTimeout(
                            function () {

                                resolve({

                                    error: {
                                        message:
                                            "Supabase request timed out."

                                    }

                                });

                            },
                            8000
                        );

                    }
                )

            ]);


        supabaseError =
            response.error || null;


    } catch (error) {

        supabaseError =
            error;

    }


    /* =====================================
       LOG SUPABASE ERROR
    ===================================== */

    if (supabaseError) {

        console.error(
            "Supabase submission error:",
            supabaseError
        );

    }


    /* =====================================
       ALWAYS GO TO RESULTS
    ===================================== */

    /*
       The result is already safely stored
       locally and in sessionStorage.

       Supabase success/failure must not
       trap the student on the quiz page.
    */

    window.location.href =
        "results.html";

}