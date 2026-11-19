/* =========================================
   MOYO'S A-LEVEL CHEMISTRY
   Homepage
========================================= */


/* QUIZ SETTINGS */

const QUIZ_SETTINGS = {
    topic: "Chemistry Challenge",
    questions: 40,
    duration: 30,

    // Change this whenever you create a completely new quiz.
    version: "TOPIC_02",

    // Change this when you want a new access code.
    accessCode: "MOYO101"
};


/* UPDATE QUIZ INFORMATION */

const questionCount = document.getElementById("question-count");
const quizDuration = document.getElementById("quiz-duration");

if (questionCount) {
    questionCount.textContent = QUIZ_SETTINGS.questions;
}

if (quizDuration) {
    quizDuration.textContent = `${QUIZ_SETTINGS.duration} min`;
}


/* =========================================
   SCIENTIST QUOTES
========================================= */

const scientistQuotes = [
    {
        quote: "The important thing is to never stop questioning.",
        name: "Albert Einstein"
    },

    {
        quote: "Nothing in life is to be feared, it is only to be understood.",
        name: "Marie Curie"
    },

    {
        quote: "Science is the knowledge of consequences, and dependence of one fact upon another.",
        name: "Thomas Hobbes"
    },

    {
        quote: "The science of today is the technology of tomorrow.",
        name: "Edward Teller"
    },

    {
        quote: "Somewhere, something incredible is waiting to be known.",
        name: "Carl Sagan"
    },

    {
        quote: "The true laboratory is the mind, where behind illusions we uncover the laws of truth.",
        name: "Jagadish Chandra Bose"
    }
];


const quoteElement = document.getElementById("scientist-quote");
const nameElement = document.getElementById("scientist-name");
const dots = document.querySelectorAll(".quote-dots span");

let currentQuote = 0;


/* SHOW QUOTE */

function showQuote(index) {

    if (!quoteElement || !nameElement) {
        return;
    }

    quoteElement.style.opacity = "0";
    nameElement.style.opacity = "0";

    setTimeout(() => {

        quoteElement.textContent =
            scientistQuotes[index].quote;

        nameElement.textContent =
            `— ${scientistQuotes[index].name}`;

        quoteElement.style.opacity = "1";
        nameElement.style.opacity = "1";

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

    }, 250);
}


/* CHANGE QUOTE EVERY 6 SECONDS */

setInterval(() => {

    currentQuote++;

    if (currentQuote >= scientistQuotes.length) {
        currentQuote = 0;
    }

    showQuote(currentQuote);

}, 6000);


/* INITIAL QUOTE */

showQuote(currentQuote);