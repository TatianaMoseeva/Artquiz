const options = [
    {
        correct: 1,
        title: 'The Son of Man',
        buttons: [
            'René Magritte',
            'Andy Warhol',
            'Salvador Dali',
            'Frida Kahlo'
        ]
    },
    {
        correct: 4,
        title: 'The Sistine Madonna',
        buttons: [
            'Michelangelo',
            'Titian',
            'Sandro Botticelli',
            'Raphael'
        ] 
    },
    {
        correct: 2,
        title: 'Sunflowers',
        buttons: [
            'Claude Monet',
            'Vincent van Gogh',
            'Pablo Picasso',
            'Paul Gauguin'
        ] 
    },
    {
        correct: 1,
        title: 'American Gothic',
        buttons: [
            'Grant Wood',
            'Thomas Hart Benton',
            'John Steuart Curry',
            'Jackson Pollock'
        ] 
    },
    {
        correct: 3,
        title: 'Composition with Red Blue and Yellow',
        buttons: [
            'Wassily Kandinsky',
            'Kazimir Malevich',
            'Piet Mondrian',
            'Mark Rothko'
        ]
    },
    {
        correct: 2,
        title: 'Girl with a Pearl Earring',
        buttons: [
            'Rembrandt',
            'Johannes Vermeer',
            'Pieter de Hooch',
            'Jan Steen'
        ]
    },
    {
        correct: 2,
        title: 'The Dream',
        buttons: [
            'Paul Cézanne',
            'Pablo Picasso',
            'Georges Braque',
            'Diego Rivera'
        ]
    },
    {
        correct: 1,
        title: 'The Arnolfini Portrait',
        buttons: [
            'Jan van Eyck',
            'Hieronymus Bosch',
            'Albrecht Dürer',
            'Pieter Bruegel the Elder'
        ]
    }
];


let variants = document.querySelector('.variants'),
    seq = document.querySelector('.sequence'),
    overlay = document.querySelector('.overlay'),
    score = document.querySelector('.finish__score'),
    playAgain = document.querySelector('#play'),
    viewResults = document.querySelector('#results'),
    wrapper = document.querySelector('.wrapper');

let opts = document.createElement('div'),
    answer = document.createElement('p'),
    reply = document.createElement('p'),
    next = document.createElement('button');

let k = 0;
let userAnswers = [];
let correctAnswersCounter = 0;


function loadImage(path) {
    return new Promise (function(resolve, reject) { 
        let painting = document.querySelector('#painting');
        painting.src = path;

        painting.addEventListener('load', function() {
            resolve(painting);
        });
        painting.addEventListener('error', function() {
            reject(new Error('image load error'));
        });      
    });
}

function addOptions() {
    let arr = options[k]['buttons'];
    k++;
    seq.textContent = k + ' / ' + options.length;
    loadImage('img/' + k + '.png').then(
        function() {
            variants.appendChild(opts);
        },
        function(error) {
            console.log(error);
        }
    );
    for (let j = 0; j < arr.length; j++) {
        let opt = document.createElement('button');
        opt.textContent = arr[j];
        opt.dataset.num = j+1;
        opt.classList.add('option');
        opts.appendChild(opt);
    }
    opts.addEventListener('click', receiveAnswer);
}

addOptions();


function receiveAnswer(e) {
    if (e.target.matches('button')) {
        userAnswers.push(e.target.textContent);
        checkAnswer(e.target);
        displayCorrectOption();
        showNextStep();
        opts.removeEventListener('click', receiveAnswer);
    }
}

function displayCorrectOption() {
    let authorName = extractCorrectAuthor(k);
    answer.textContent = options[k-1]['title'] + ' was created by ' + authorName;
    answer.classList.add('answer');
    variants.appendChild(answer);
}

function extractCorrectAuthor(counter) {
    let names = options[counter-1]['buttons'];
    let correct = options[counter-1]['correct'];
    return names[correct-1];
}

function checkAnswer(elem) {
    if (elem.dataset.num == options[k-1]['correct']) {
        correctAnswersCounter+= 1;

        elem.classList.add('right');
        reply.classList.remove('incorrect');
        reply.classList.add('correct');
        reply.textContent = 'Correct!';
    } else {
        elem.classList.add('wrong');
        reply.classList.remove('correct'); 
        reply.classList.add('incorrect');
        reply.textContent = 'Incorrect :(';
    }
    variants.appendChild(reply); 
}

function showNextStep() {
    if (k < options.length) {
        next.textContent = 'Next question';
        next.classList.add('next');
        variants.appendChild(next);
    } else {
        setTimeout (finishGame, 700);
    }
}

function finishGame() { 
    overlay.style.display = 'block';
    score.textContent = 'Your score: ' + correctAnswersCounter + '/' + options.length;
}

next.addEventListener('click', function() {
    if (k < options.length) {
        showNextQuestion();
        opts.addEventListener('click', receiveAnswer);
    }
});

function showNextQuestion() {
    variants.innerHTML = '';
    opts.innerHTML = '';
    variants.appendChild(opts);
    addOptions();
}

playAgain.addEventListener('click', function() {
    overlay.style.display = 'none';
    correctAnswersCounter = 0;
    k = 0;
    userAnswers = [];
    showNextQuestion();
});


viewResults.addEventListener('click', function() {
    overlay.style.display = 'none';
    wrapper.innerHTML = '';
    seq.innerHTML = '';
    fillResults();
});

function fillResults() {
    for (let i = 1; i <= options.length; i++) {
        let resultsItem = document.createElement('div');
        resultsItem.classList.add('results__item');

        let img = document.createElement('img');
        img.src = 'img/' + i + '.png';
        img.classList.add('results__img');
        resultsItem.appendChild(img);
        
        let answersWrap = document.createElement('div');

        let title = document.createElement('p');
        title.textContent = `'` + options[i-1]['title'] + `'`;
        answersWrap.appendChild(title);

        let correctAnswer = document.createElement('p');
        correctAnswer.textContent = 'Artist: ' + extractCorrectAuthor(i);
        answersWrap.appendChild(correctAnswer);

        let userAnswer = document.createElement('p');
        userAnswer.textContent = 'Your answer: ' +  userAnswers[i-1];
        highlightAnswer(userAnswer, i);
        answersWrap.appendChild(userAnswer);

        resultsItem.appendChild(answersWrap);
        wrapper.appendChild(resultsItem);
    }
}

function highlightAnswer(answer, counter) {
    if (userAnswers[counter-1] == extractCorrectAuthor(counter)) {
        answer.style.color = '#0E6621';
    } else {
        answer.style.color = '#A41209';
    }
}