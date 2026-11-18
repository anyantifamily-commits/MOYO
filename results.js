/* =========================================
   MOYO'S A-LEVEL CHEMISTRY
   RESULTS
========================================= */


/* =========================================
   GET SAVED RESULT
========================================= */

const savedResult =
    sessionStorage.getItem(
        "moyo_quiz_result"
    );


/*
   If there is no saved result,
   return to the quiz.
*/

if (!savedResult) {

    window.location.href =
        "quiz.html";

}


/* =========================================
   PARSE RESULT
========================================= */

const result =
    JSON.parse(savedResult);


/* =========================================
   DOM ELEMENTS
========================================= */

const studentName =
    document.getElementById(
        "student-name"
    );

const percentage =
    document.getElementById(
        "percentage"
    );

const correctCount =
    document.getElementById(
        "correct-count"
    );

const incorrectCount =
    document.getElementById(
        "incorrect-count"
    );

const totalCount =
    document.getElementById(
        "total-count"
    );

const performanceMessage =
    document.getElementById(
        "performance-message"
    );

const reviewContainer =
    document.getElementById(
        "review-container"
    );

const reviewCount =
    document.getElementById(
        "review-count"
    );

const scoreCircle =
    document.querySelector(
        ".score-circle"
    );


/* =========================================
   DISPLAY BASIC RESULT
========================================= */

studentName.textContent =
    result.studentName;


percentage.textContent =
    `${result.percentage}%`;


correctCount.textContent =
    result.score;


incorrectCount.textContent =
    result.total -
    result.score;


totalCount.textContent =
    result.total;


reviewCount.textContent =
    `${result.total} questions`;


/* =========================================
   SCORE CIRCLE
========================================= */

scoreCircle.style.setProperty(
    "--score",
    `${result.percentage}%`
);


/* =========================================
   PERFORMANCE MESSAGE
========================================= */

function getPerformanceMessage(
    score
) {

    if (score >= 80) {

        return "Excellent work. Your Chemistry foundation is looking strong.";

    }


    if (score >= 70) {

        return "Very good performance. Keep sharpening your understanding.";

    }


    if (score >= 60) {

        return "Good effort. A little more revision can take you even further.";

    }


    if (score >= 50) {

        return "You passed. Keep practicing and strengthen the areas you missed.";

    }


    return "Keep learning. Every question is another opportunity to improve.";

}


performanceMessage.textContent =
    getPerformanceMessage(
        result.percentage
    );


/* =========================================
   REVIEW ANSWERS
========================================= */

function renderReview() {

    reviewContainer.innerHTML =
        "";


    /*
       Questions are saved inside the result
       by quiz.js.

       There is NO separate question bank
       here.
    */

    if (
        !Array.isArray(
            result.questions
        )
    ) {

        reviewContainer.innerHTML = `
            <div class="review-item incorrect">
                <p class="review-question">
                    Answer review is unavailable for this attempt.
                </p>
            </div>
        `;

        return;

    }


    result.questions.forEach(
        function (
            question,
            index
        ) {

            const selectedAnswer =
                result.answers[index];


            const isCorrect =
                selectedAnswer ===
                question.answer;


            /* =================================
               REVIEW ITEM
            ================================= */

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                `review-item ${
                    isCorrect
                        ? "correct"
                        : "incorrect"
                }`;


            /* =================================
               QUESTION
            ================================= */

            const questionElement =
                document.createElement(
                    "p"
                );


            questionElement.className =
                "review-question";


            questionElement.textContent =
                `${index + 1}. ${question.question}`;


            /* =================================
               META
            ================================= */

            const meta =
                document.createElement(
                    "div"
                );


            meta.className =
                "review-meta";


            const status =
                document.createElement(
                    "span"
                );


            status.className =
                "review-status";


            status.textContent =
                isCorrect
                    ? "Correct"
                    : "Incorrect";


            meta.appendChild(
                status
            );


            /* =================================
               STUDENT ANSWER
            ================================= */

            const answer =
                document.createElement(
                    "p"
                );


            answer.className =
                "review-answer";


            if (
                selectedAnswer === null ||
                selectedAnswer === undefined
            ) {

                answer.innerHTML =
                    `Your answer: <strong>Not answered</strong>`;

            } else {

                const selectedOption =
                    question.options[
                        selectedAnswer
                    ];


                answer.innerHTML =
                    `Your answer: <strong>${escapeHTML(
                        selectedOption
                    )}</strong>`;

            }


            /* =================================
               APPEND BASIC CONTENT
            ================================= */

            item.appendChild(
                questionElement
            );

            item.appendChild(
                meta
            );

            item.appendChild(
                answer
            );


            /* =================================
               CORRECT ANSWER
            ================================= */

            if (!isCorrect) {

                const correctAnswer =
                    document.createElement(
                        "p"
                    );


                correctAnswer.className =
                    "review-answer";


                const correctOption =
                    question.options[
                        question.answer
                    ];


                correctAnswer.innerHTML =
                    `Correct answer: <strong>${escapeHTML(
                        correctOption
                    )}</strong>`;


                item.appendChild(
                    correctAnswer
                );

            }


            reviewContainer.appendChild(
                item
            );

        }
    );

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}


/* =========================================
   RENDER
========================================= */

renderReview();