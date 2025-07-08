// Code system removed

// Quiz structure: 3 levels, each with 5 questions
const quizLevels = [
    [ // Level 1
        {
            question: "Who is Mario's brother?",
            answers: ["Luigi", "Peach", "Bowser", "Yoshi"],
            correct: 0
        },
        {
            question: "Which item makes Mario grow?",
            answers: ["Fire Flower", "Super Mushroom", "Star", "Coin"],
            correct: 1
        },
        {
            question: "What color is Mario's hat?",
            answers: ["Red", "Green", "Blue", "Yellow"],
            correct: 0
        },
        {
            question: "What is Mario's profession?",
            answers: ["Plumber", "Carpenter", "Doctor", "Chef"],
            correct: 0
        },
        {
            question: "What is the name of Mario's dinosaur friend?",
            answers: ["Yoshi", "Donkey Kong", "Wario", "Daisy"],
            correct: 0
        }
    ],
    [ // Level 2
        {
            question: "Who is the princess Mario often saves?",
            answers: ["Peach", "Rosalina", "Daisy", "Pauline"],
            correct: 0
        },
        {
            question: "Which enemy is brown and mushroom-shaped?",
            answers: ["Goomba", "Koopa", "Shy Guy", "Boo"],
            correct: 0
        },
        {
            question: "Which power-up lets Mario shoot fireballs?",
            answers: ["Fire Flower", "Super Star", "Mushroom", "Leaf"],
            correct: 0
        },
        {
            question: "What is the name of Mario's brother?",
            answers: ["Luigi", "Wario", "Toad", "Bowser"],
            correct: 0
        },
        {
            question: "Which game console did Super Mario 64 debut on?",
            answers: ["Nintendo 64", "Super Nintendo", "GameCube", "Wii"],
            correct: 0
        }
    ],
    [ // Level 3
        {
            question: "Which character is this? (Silhouette)",
            answers: ["Mario", "Luigi", "Toad", "Bowser"],
            correct: 3,
            silhouette: true
        },
        {
            question: "What is Bowser's main goal?",
            answers: ["Kidnap Peach", "Eat cake", "Win a race", "Collect coins"],
            correct: 0
        },
        {
            question: "Which Mario Kart item targets the leader?",
            answers: ["Blue Shell", "Banana", "Mushroom", "Red Shell"],
            correct: 0
        },
        {
            question: "Who is the princess of Sarasaland?",
            answers: ["Daisy", "Peach", "Rosalina", "Toadette"],
            correct: 0
        },
        {
            question: "Which power-up gives Mario a raccoon tail?",
            answers: ["Super Leaf", "Fire Flower", "Star", "Cape Feather"],
            correct: 0
        }
    ]
];


// Mario Red theme only
const marioRed = {
    name: 'Mario Red',
    primary: '#e63946',
    accent: '#fff',
    background: 'linear-gradient(135deg, #e63946 60%, #ff1744 100%)',
    text: '#fff',
    nav: 'rgba(230,57,70,0.7)'
};

// Only Mario Red theme, static application
function applyTheme() {
    document.body.style.background = marioRed.background;
    document.body.style.color = marioRed.text;
    // Navbar/header
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.background = marioRed.nav;
        navbar.style.color = marioRed.text;
    }
    const sidebar = document.querySelector('#coinSidebar');
    if (sidebar) {
        sidebar.style.background = marioRed.nav;
    }
    const header = document.querySelector('.header');
    if (header) {
        header.style.background = marioRed.nav;
        header.style.color = marioRed.text;
    }
    // Question text and answers
    const questionText = document.querySelector('.question-text');
    if (questionText) questionText.style.color = marioRed.text;
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.style.color = marioRed.text;
        btn.style.background = marioRed.primary;
        btn.style.borderColor = marioRed.accent;
    });
    // Modal/shop
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.background = marioRed.background;
        modal.style.color = marioRed.text;
    }
}

window.quizLevels = quizLevels;
window.applyTheme = applyTheme;