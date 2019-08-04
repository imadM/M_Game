/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

let stars = document.querySelectorAll('.star');
var movesCount = document.querySelector('.moves-count');
var moves_n = document.querySelector('.moves-text');
var timerHours = document.querySelector('#timer .hours');
var timerMins = document.querySelector('#timer .minutes');
var timerSeconds = document.querySelector('#timer .seconds');
var restartBtn = document.querySelector('#restart');
var modal = document.querySelector('#simpleModal');
var modalCloseBtn = document.querySelector('.modal-close-btn');
var modalReplayBtn = document.querySelector('.modal-replay-btn');
var modalMoves = document.querySelector('.modal-body .moves-count');
var modalHours = document.querySelector('.modal-body .hours');
var modalMins = document.querySelector('.modal-body .mins');
var modalSeconds = document.querySelector('.modal-body .seconds');
var modalRating = document.querySelector('.modal-body .rating');
const deck = document.querySelector('.deck');

const cards = [].slice.call(deck.children);

/*
 * Create a list that holds all of your cards
 */

let cardSymbols = ['btc', 'btc', 'delicious',  'delicious',  'docker',   'docker', 'fort-awesome',  'fort-awesome',
                  'hotjar', 'hotjar','linux',  'linux', 'git-square',  'git-square', 'grav','grav'];

// opened cards
let openCards = [];

let rating = 3;
let moves , matches , elapsedSeconds , hour , min , sec = 0;

// Timer
let timer = undefined;

// Game status
let gameStarted = false;


//  attached to cards
restartBtn.addEventListener('click', restartGame);
modalReplayBtn.addEventListener('click', restartGame);

// Click event listener attached to x button to close modal
modalCloseBtn.addEventListener('click', closeModal);
deck.addEventListener('click', openCard);


// Start new game
restartGame();

// add 'open' & 'show' classes to card
function openCard(event) {
    startTimer();
    var target = event.target;
    const parent = target.parentElement;
    if (parent.classList.contains('card')) {
        target = parent;
    }

    if (!openCards.includes(target)) {
        target.classList.add('open', 'show');
        openCards.push(target);
        checkMatch();
    }
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(setTime, 1000);

/***********
I tried this code to show  timer with milliseconds, but with no luck
https://stackoverflow.com/a/32307612


        var startTime2 = Date.now();
        var interval = setInterval(function() {
            var elapsedTime = Date.now() - startTime2;
            document.getElementById("timer2").innerHTML = (elapsedTime / 1000).toFixed(1);
        }, 90);
***********/


    }
}

function stopTimer() {
    gameStarted = false;
    clearInterval(timer);
}

function setTime() {
    let remainderSeconds = ++elapsedSeconds;
    hour = parseInt(remainderSeconds / 3600);
    timerHours.textContent = stringifyTime(hour);
    remainderSeconds = remainderSeconds % 3600;
    min = parseInt(remainderSeconds / 60)
    timerMins.textContent = stringifyTime(min);
    remainderSeconds = remainderSeconds % 60;
    sec = remainderSeconds;
    timerSeconds.textContent = stringifyTime(sec);
}

//  remove 'open' & 'show' classes to card
function closeCard(card) {
    setTimeout(() => {
        card.classList.remove('open', 'show');
    }, 500)
}

//  add 'match' class to card
function matchCard(card) {
    setTimeout(() => {
        card.classList.add('match', 'bounceIn');
    }, 500)
}

function checkMatch() {
    const length = openCards.length;
    if (length === 2) {
        const last = openCards[1];
        const preLast = openCards[0];

        if (last.children[0].classList.toString() ===
            preLast.children[0].classList.toString()) {
            matches++;
            matchCard(last);
            matchCard(preLast);
        } else {
            closeCard(last);
            closeCard(preLast);
        }
        incrementMove();
        openCards = [];
        //checkGameWin
        if (matches === 8) {
            stopTimer();
            openModal();
        }

    }
}

function incrementMove() {
    moves++;
    movesCount.textContent = moves;
    if (moves === 1) {
        moves_n.textContent = ' Move';
    } else {
        moves_n.textContent = ' Moves';
    }
    determineRating();
}



function determineRating() {
    if (moves === 17) {
        rating--;
        stars[2].classList.add('empty-star');
    } else if (moves === 26) {
        rating--;
        stars[1].classList.add('empty-star');
    } else if (moves === 34) {
        rating--;
        stars[0].classList.add('empty-star');
    }
}





function restartGame() {
    closeModal();
    resetScore();
    resetDeck();
}

function resetScore() {
    rating = 3;
    stars.forEach(star => removeClassByPrefix(star, 'empty-star'));
    moves = 0;
    movesCount.textContent = moves;
    matches = 0;
    //  time
    elapsedSeconds = 0;
    hour = 0;
    min = 0;
    sec = 0;
    timerHours.textContent = '00';
    timerMins.textContent = '00';
    timerSeconds.textContent = '00';
    // Stop timer
    stopTimer();
}

function resetDeck() {
    openCards = [];
    // Shuffle symbols
    cardSymbols = shuffle(cardSymbols);
    // Iterate over all cards
    cards.forEach((card, index) => {
        // Remove classes
        card.classList.remove('open', 'show', 'match', 'bounceIn');
        // Remove symbols
        removeClassByPrefix(card.children[0], 'fa-');

        // Attach new symbols to cards
        const symbol = `fa-${cardSymbols[index]}`;
        card.children[0].classList.add(symbol);
    });
}

function openModal() {
    modalHours.textContent = hour > 0 ? `${hour} hours, ` : '';
    modalMins.textContent = min > 0 ? `${min} minutes, ` : '';
    modalSeconds.textContent = `${sec} seconds`;
    modalMoves.textContent = `${moves} moves`;
    modalRating.textContent = rating;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

/*  Helper functions  */

/*
* @description Removes element's class based on pattern
*/
function removeClassByPrefix(el, prefix, replace = '') {
    var regx = new RegExp('\\b' + prefix + '(.*)?\\b', 'g');
    el.className = el.className.replace(regx, replace);
    return el;
}

/*
* @description Shuffle elements of array
*
* Shuffle function from http://stackoverflow.com/a/2450976
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
* @description Convert min, hour & seconds into string
*
* Shuffle function from http://stackoverflow.com/a/2450976
*/
function stringifyTime(val) {
    var valString = val + '';
    return valString.length >= 2 ? `${val}` : `0${val}`;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
