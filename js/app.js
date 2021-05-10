

/*Global variables used */

let openCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clock;
let matchedCards = 0;
const totalPairs = 8;


/*
 * Create a list that holds all of your cards
 */

const deck = document.querySelector('.deck');

deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (clickCheck(clickTarget)) {
    if (clockOff) {
    startTimer();
    clockOff = false;
  }}
  if (clickCheck(clickTarget)) {
    toggleCards(clickTarget);
    addOpenCards(clickTarget);
  }
    if (openCards.length === 2) {
        matchCheck(clickTarget);
        moveCounter();
        scoreCheck();
    }
});


/* made a function to shorten the check that a card should
only be toggled if it isn't already in the array and
is not matched */

function clickCheck(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    openCards.length < 2 &&
    !openCards.includes(clickTarget) &&
    !clickTarget.classList.contains('open') &&
    !clickTarget.classList.contains('show')
  );
}


/*function that toggles the card classes */

function toggleCards(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

/* a function that adds the targeted card into array for later use */

function addOpenCards(clickTarget) {
  openCards.push(clickTarget);
}

/* function that checks if the cards are a match and if they
are, a class name of 'match' is added and if not, the cards are
toggled again and also resets the array */

function matchCheck() {
  if (openCards[0].firstElementChild.className ===
    openCards[1].firstElementChild.className
) {
  openCards[0].classList.toggle('match');
  openCards[1].classList.toggle('match');
  openCards = [];
  matchedCards++;
  if (matchedCards === totalPairs) {
    gameOver();
  }
} else {
  setTimeout(() => {
  openCards[0].classList.remove('open');
  openCards[1].classList.remove('open');
  openCards[0].classList.remove('show');
  openCards[1].classList.remove('show');
  openCards = [];
}, 1000);
}}



/* Function used to turn the nodelist into an array that will
be used with the given shuffle  */

function deckShuffle() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
deckShuffle();



// Shuffle function from http://stackoverflow.com/a/2450976
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

/* Function that counts the number of moves for every 2 cards clicked */

function moveCounter() {
  const movesNumber = document.querySelector('.moves');
  moves = moves + 1;
  movesNumber.innerHTML = moves;
}


function scoreCheck() {
  if (moves === 16 || moves === 24) {
    hideStar();
  }
}

function hideStar() {
  const stars = document.querySelectorAll('.stars li');
  for (star of stars) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}


/* functions that start the time when a card is clicked within the deck*/

function startTimer() {
  clock = setInterval(() => {
  time = time + 1;
  displayTimer();
  }, 1000);
}


function displayTimer() {
  const timer = document.querySelector('.timer');
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timer.innerHTML = time;
  if (seconds < 10) {
/* I didn't use template literals on the first statement on purpose
to compare the two different structures. For studying purpose. */
      timer.innerHTML = minutes + ':0' + seconds;
}  else {
      timer.innerHTML = `${minutes}:${seconds}`;
  }
}

/*function to stop the clock */

function stopTimer() {
  clearInterval(clock);
}


/* function that toggles the Modal */
function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}


/*individual stats of the time, moves and stars earned when the
game is completed */
function modalStats() {
  const statTime = document.querySelector('.modal_time');
  const statMoves = document.querySelector('.modal_moves');
  const statStars = document.querySelector('.modal_stars');
  const actualStars = getStars();


  statTime.innerHTML = document.querySelector('.timer').innerHTML;
  statMoves.innerHTML = moves;
  statStars.innerHTML = actualStars;
}

/* function that gets the amount of stars remaining. Very similar
to the hideStar function */
function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCounter = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCounter++;
    }
  }
  return starCounter;
}

/* click event that restarts the game */
document.querySelector('.replay_button').addEventListener('click', function(e) {
  gameReset();
  toggleModal();
  cardReset();
});
/* click event that toggles the modal */
document.querySelector('.close_button').addEventListener('click', () => {
  toggleModal();
});

/*click event that also resets the game by clicking the restart icon */
document.querySelector('.restart').addEventListener('click', () => {
  gameReset();
  cardReset();
});

/*function that will reset the game */
function gameReset() {
  timersReset();
  movesReset();
  starsReset();
  deckShuffle()
  matchedCards = 0;
}

/*resets the timer of the game */
function timersReset() {
  stopTimer();
  clockOff = true;
  time = 0;
  displayTimer();
}

/*resets the number of moves taken back to 0 */
function movesReset() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

/*resets the stars */
function starsReset() {
  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

/* places the cards back in the 'close' position upon finishing or reseting
the game */
function cardReset() {
  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    card.className = 'card';
  }
}

/*function that determines the game is over wherein it stops the
time, displays the stats for the game and toggles the modal */
function gameOver() {
  stopTimer();
  modalStats();
  toggleModal();
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
