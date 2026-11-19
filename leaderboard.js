/* =========================================
   MOYO'S A-LEVEL CHEMISTRY
   LEADERBOARD
========================================= */


/* =========================================
   LEADERBOARD CONTROL
========================================= */

/*
   true  = students can see the leaderboard
   false = leaderboard is hidden from students
*/

const LEADERBOARD_ENABLED = false;


/* =========================================
   ACTIVE QUIZ VERSION
========================================= */

const QUIZ_VERSION = "TOPIC_02";


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
   ELEMENTS
========================================= */

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("error-message");

const retryButton =
    document.getElementById("retry-button");

const disabledMessage =
    document.getElementById("disabled-message");

const leaderboardSection =
    document.getElementById("leaderboard-section");

const podium =
    document.getElementById("podium");

const leaderboardList =
    document.getElementById("leaderboard-list");

const studentResult =
    document.getElementById("student-result");


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   FORMAT PERCENTAGE
========================================= */

function formatPercentage(value) {

    const number =
        Number(value);

    return Number.isInteger(number)
        ? `${number}%`
        : `${number.toFixed(1)}%`;
}


/* =========================================
   HIDE ALL STATES
========================================= */

function hideAllStates() {

    loading.style.display = "none";

    errorMessage.style.display = "none";

    disabledMessage.style.display = "none";

    leaderboardSection.style.display = "none";
}


/* =========================================
   SHOW DISABLED STATE
========================================= */

function showDisabledLeaderboard() {

    hideAllStates();

    disabledMessage.style.display =
        "block";
}


/* =========================================
   SHOW LOADING
========================================= */

function showLoading() {

    hideAllStates();

    loading.style.display =
        "block";
}


/* =========================================
   SHOW ERROR
========================================= */

function showError(message) {

    hideAllStates();

    errorMessage.style.display =
        "block";

    errorMessage
        .querySelector("p")
        .textContent = message;
}


/* =========================================
   SHOW LEADERBOARD
========================================= */

function showLeaderboard() {

    hideAllStates();

    leaderboardSection.style.display =
        "block";
}


/* =========================================
   LOAD LEADERBOARD
========================================= */

async function loadLeaderboard() {

    /*
       If the leaderboard is disabled,
       do not even contact Supabase.
    */

    if (!LEADERBOARD_ENABLED) {

        showDisabledLeaderboard();

        return;
    }


    showLoading();


    console.log(
        "Loading leaderboard..."
    );

    console.log(
        "Quiz version:",
        QUIZ_VERSION
    );


    /* =====================================
       SUPABASE REQUEST
    ===================================== */

    const requestPromise =
        supabaseClient
            .from("quiz_results")
            .select(
                "id, student_name, score, total_questions, percentage, quiz_version, submitted_at"
            )
            .eq(
                "quiz_version",
                QUIZ_VERSION
            )
            .order(
                "percentage",
                {
                    ascending: false
                }
            )
            .order(
                "submitted_at",
                {
                    ascending: true
                }
            );


    /* =====================================
       TIMEOUT
    ===================================== */

    const timeoutPromise =
        new Promise(function (resolve) {

            setTimeout(function () {

                resolve({
                    timeout: true
                });

            }, 8000);

        });


    const result =
        await Promise.race([
            requestPromise,
            timeoutPromise
        ]);


    /* =====================================
       TIMEOUT
    ===================================== */

    if (result.timeout) {

        console.error(
            "Leaderboard request timed out."
        );

        showError(
            "The leaderboard could not connect to the database."
        );

        return;
    }


    /* =====================================
       SUPABASE ERROR
    ===================================== */

    if (result.error) {

        console.error(
            "Supabase error:",
            result.error
        );

        showError(
            "Unable to load the leaderboard right now."
        );

        return;
    }


    /* =====================================
       DATA
    ===================================== */

    const data =
        result.data || [];


    console.log(
        "Leaderboard data:",
        data
    );


    /* =====================================
       EMPTY
    ===================================== */

    if (data.length === 0) {

        podium.innerHTML = "";

        leaderboardList.innerHTML = `
            <div class="empty-message">
                No results yet for this quiz.
            </div>
        `;

        studentResult.innerHTML = "";

        showLeaderboard();

        return;
    }


    /* =====================================
       RENDER
    ===================================== */

    renderPodium(data);

    renderLeaderboard(data);

    renderStudentResult(data);

    showLeaderboard();
}


/* =========================================
   RENDER PODIUM
========================================= */

function renderPodium(data) {

    podium.innerHTML = "";


    const topThree =
        data.slice(0, 3);


    topThree.forEach(function (student, index) {

        const position =
            index + 1;


        const card =
            document.createElement("div");


        card.className =
            "podium-card";


        if (position === 1) {

            card.classList.add("first");

        }


        card.innerHTML = `

            <span class="podium-rank">

                ${
                    position === 1
                        ? "🥇"
                        : position === 2
                            ? "🥈"
                            : "🥉"
                }

            </span>


            <span class="podium-name">

                ${escapeHTML(
                    student.student_name
                )}

            </span>


            <span class="podium-score">

                ${student.score}/${student.total_questions}

                ·

                ${formatPercentage(
                    student.percentage
                )}

            </span>

        `;


        podium.appendChild(card);

    });
}


/* =========================================
   RENDER FULL LEADERBOARD
========================================= */

function renderLeaderboard(data) {

    leaderboardList.innerHTML = "";


    data.forEach(function (student, index) {

        const rank =
            index + 1;


        const row =
            document.createElement("div");


        row.className =
            "leaderboard-row";


        row.innerHTML = `

            <div class="rank ${
                rank <= 3 ? "top" : ""
            }">

                ${rank}

            </div>


            <div class="student">

                ${escapeHTML(
                    student.student_name
                )}

            </div>


            <div class="score">

                ${student.score}/${student.total_questions}

            </div>


            <div class="percent">

                ${formatPercentage(
                    student.percentage
                )}

            </div>

        `;


        leaderboardList.appendChild(row);

    });
}


/* =========================================
   RENDER CURRENT STUDENT
========================================= */

function renderStudentResult(data) {

    studentResult.innerHTML = "";


    const savedResult =
        sessionStorage.getItem(
            "moyo_quiz_result"
        );


    if (!savedResult) {

        return;
    }


    let result;


    try {

        result =
            JSON.parse(savedResult);

    } catch (error) {

        return;
    }


    const studentName =
        String(
            result.studentName || ""
        )
        .trim()
        .toLowerCase();


    if (!studentName) {

        return;
    }


    const studentIndex =
        data.findIndex(function (student) {

            return String(
                student.student_name
            )
            .trim()
            .toLowerCase() ===
            studentName;

        });


    if (studentIndex === -1) {

        studentResult.innerHTML = `

            <div class="student-result-title">
                Your Result
            </div>

            <div class="student-result-rank">

                Your result has not appeared
                on the leaderboard yet.

            </div>

        `;

        return;
    }


    const student =
        data[studentIndex];


    studentResult.innerHTML = `

        <div class="student-result-title">
            Your Position
        </div>


        <div class="student-result-main">

            <div>

                <div class="student-result-name">

                    ${escapeHTML(
                        student.student_name
                    )}

                </div>


                <div class="student-result-rank">

                    Rank #${studentIndex + 1}

                </div>

            </div>


            <div class="student-result-score">

                ${student.score}/${student.total_questions}

                ·

                ${formatPercentage(
                    student.percentage
                )}

            </div>

        </div>

    `;
}


/* =========================================
   RETRY
========================================= */

retryButton.addEventListener(
    "click",
    function () {

        loadLeaderboard();

    }
);


/* =========================================
   START
========================================= */

loadLeaderboard();