let currentQuestionIndex = 0;
let flashcardData;
const flashcardContainer = document.getElementById('flashcardContainer');

async function loadFlashCard(template) {
    try {
        flashcardData = JSON.parse(template);
        flashcardContainer.innerHTML = '';
        const loadFlashcardSection = document.querySelector('.load-flashcard');
        loadFlashcardSection.style.display = 'none';
        flashcardContainer.style.display = 'block';
        displayQuestion();
    } catch (error) {
        alert('Failed to load flashcard. Please ensure your template is valid JSON.');
    }
}

async function generateFlashcards() {
    const prompt = encodeURIComponent(document.getElementById('flaskcardtemplate').value);

    try {
        const response = await fetch(`/generate_flashcards/${prompt}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate flashcards.');
        }
        const flashcardData = await response.json();
        loadFlashCard(JSON.stringify(flashcardData))
    } catch (error) {
        alert(error.message);
    }
}

function displayQuestion() {
    const flashcardContainer = document.getElementById('flashcardContainer');
    flashcardContainer.innerHTML = '';
    const item = flashcardData.questions[currentQuestionIndex];

    const flashcard = document.createElement('div');
    flashcard.classList.add('flashcard');

    const questionElement = document.createElement('div');
    questionElement.classList.add('container-top');
    questionElement.innerHTML = `<p class="flashcard-question">${item.Question}</p>`;
    flashcard.appendChild(questionElement);

    const answersContainer = document.createElement('div');
    answersContainer.classList.add('container-answers');

    const buttonClasses = ['green', 'red', 'blue', 'orange'];
    let index = 0;

    for (const [key, value] of Object.entries(item.Answers)) {
        const answerButton = document.createElement('button');
        answerButton.id = `answer-${key}`;
        answerButton.classList.add('container-answers-button', buttonClasses[index]);
        answerButton.innerText = value;

        answerButton.addEventListener('click', () => {
            const feedbackBox = document.createElement('div');
            feedbackBox.classList.add('feedback-box');
            feedbackBox.innerText = key === item.Answer ? 'Correct' : 'Incorrect';
            feedbackBox.classList.add(key === item.Answer ? 'correct' : 'incorrect');
            document.body.appendChild(feedbackBox);
            setTimeout(() => {
                feedbackBox.classList.add('fade-out');
                setTimeout(() => feedbackBox.remove(), 500);
            }, 2000);
            currentQuestionIndex++;
            if (currentQuestionIndex >= flashcardData.questions.length) {
                currentQuestionIndex = 0;
            }
            displayQuestion();
        });

        answersContainer.appendChild(answerButton);
        index++;
    }

    flashcard.appendChild(answersContainer);
    flashcardContainer.appendChild(flashcard);
}

document.addEventListener('DOMContentLoaded', () => {
    flashcardContainer.style.display = 'none';
    const LoadButton = document.getElementById('loadButton');
    if (LoadButton) {
        LoadButton.addEventListener('click', generateFlashcards);
    }
});

const style = document.createElement('style');
style.innerHTML = `
.feedback-box {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    border-radius: 5px;
    color: white;
    z-index: 1000;
    transition: opacity 0.5s ease-in-out;
}
.correct {
    background-color: rgb(91, 255, 91);
}
.incorrect {
    background-color: rgb(255, 91, 91);
}
.fade-out {
    opacity: 0;
}
`;
document.head.appendChild(style);
