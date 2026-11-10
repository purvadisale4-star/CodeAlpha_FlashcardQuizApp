// Default flashcards
const defaultCards = [
    {
        question: "What is HTML?",
        answer: "HTML stands for HyperText Markup Language."
    },
    {
        question: "What is CSS?",
        answer: "CSS stands for Cascading Style Sheets."
    },
    {
        question: "What is JavaScript?",
        answer: "JavaScript is a programming language used to make websites interactive."
    },
    {
        question: "What is an algorithm?",
        answer: "An algorithm is a step-by-step procedure to solve a problem."
    },
    {
        question: "What is a variable?",
        answer: "A variable is a named container used to store data."
    }
];

// Load saved cards or use default cards
let cards;

try {
    const savedCards = localStorage.getItem("flashcards");
    cards = savedCards ? JSON.parse(savedCards) : defaultCards;
    if (!Array.isArray(cards) ||
        !cards.every(card =>
            card && typeof card.question === "string" &&
            typeof card.answer === "string"
        )) {
        cards = defaultCards;
    }
} catch (error) {
    cards = defaultCards;
}

let currentIndex = 0;
let showingAnswer = false;
let editingIndex = null;

// Get HTML elements
const cardLabel = document.getElementById("card-label");
const cardContent = document.getElementById("card-content");
const progress = document.getElementById("progress");

const showAnswerBtn = document.getElementById("showAnswerBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const cardForm = document.getElementById("cardForm");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const message = document.getElementById("message");

// Save cards in browser storage
function saveCards() {
    localStorage.setItem("flashcards", JSON.stringify(cards));
}

// Display current flashcard
function displayCard() {
    if (cards.length === 0) {
        cardLabel.textContent = "NO FLASHCARDS";
        cardContent.textContent = "Add a new flashcard to begin.";
        progress.textContent = "No cards available";
        showAnswerBtn.disabled = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        editBtn.disabled = true;
        deleteBtn.disabled = true;
        return;
    }

    showAnswerBtn.disabled = false;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    editBtn.disabled = false;
    deleteBtn.disabled = false;

    const card = cards[currentIndex];

    cardLabel.textContent = showingAnswer ? "ANSWER" : "QUESTION";
    cardContent.textContent = showingAnswer
        ? card.answer
        : card.question;

    showAnswerBtn.textContent = showingAnswer
        ? "Show Question"
        : "Show Answer";

    progress.textContent =
        `Card ${currentIndex + 1} of ${cards.length}`;
}

// Show or hide answer
showAnswerBtn.addEventListener("click", function () {
    showingAnswer = !showingAnswer;
    displayCard();
});

// Next card
nextBtn.addEventListener("click", function () {
    if (cards.length === 0) return;

    currentIndex = (currentIndex + 1) % cards.length;
    showingAnswer = false;
    displayCard();
});

// Previous card
prevBtn.addEventListener("click", function () {
    if (cards.length === 0) return;

    currentIndex =
        (currentIndex - 1 + cards.length) % cards.length;

    showingAnswer = false;
    displayCard();
});

// Add or update flashcard
cardForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) {
        message.textContent = "Please fill in both fields.";
        return;
    }

    if (editingIndex !== null) {
        cards[editingIndex] = { question, answer };
        currentIndex = editingIndex;
        message.textContent = "Flashcard updated successfully!";
    } else {
        cards.push({ question, answer });
        currentIndex = cards.length - 1;
        message.textContent = "New flashcard added successfully!";
    }

    saveCards();
    resetForm();
    showingAnswer = false;
    displayCard();
});

// Edit current flashcard
editBtn.addEventListener("click", function () {
    if (cards.length === 0) return;

    editingIndex = currentIndex;

    questionInput.value = cards[currentIndex].question;
    answerInput.value = cards[currentIndex].answer;

    saveBtn.textContent = "Update Flashcard";
    cancelBtn.hidden = false;

    message.textContent = "Edit your flashcard below.";
});

// Delete current flashcard
deleteBtn.addEventListener("click", function () {
    if (cards.length === 0) return;

    const confirmDelete = confirm(
        "Are you sure you want to delete this flashcard?"
    );

    if (!confirmDelete) return;

    cards.splice(currentIndex, 1);

    if (currentIndex >= cards.length) {
        currentIndex = Math.max(0, cards.length - 1);
    }

    saveCards();
    resetForm();
    showingAnswer = false;
    displayCard();

    message.textContent = "Flashcard deleted successfully!";
});

// Reset form
function resetForm() {
    cardForm.reset();
    editingIndex = null;
    saveBtn.textContent = "Add Flashcard";
    cancelBtn.hidden = true;
}

// Cancel editing
cancelBtn.addEventListener("click", function () {
    resetForm();
    message.textContent = "Editing cancelled.";
});

// Initial display
displayCard();