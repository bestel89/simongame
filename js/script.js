/*----- constants -----*/
const btnLookup = {
    0: {color: 'red'},
    1: {color: 'grn'},
    2: {color: 'yel'},
    3: {color: 'blu'},
};

const arrLookup = {
    'red': 0,
    'grn': 1, 
    'yel': 2,
    'blu': 3,
};

const sounds = {
    'red': 'sounds/btn1.mp3',
    'grn': 'sounds/btn2.mp3',
    'yel': 'sounds/btn3.mp3',
    'blu': 'sounds/btn4.mp3',
    'err': 'sounds/error.mp3',
    'atn': 'sounds/atn.mp3',
    'bon': 'sounds/bon.mp3',
}

const DIFFICULTY = {
    'easy': {param1: 1000, param2: 500},
    'normal': {param1: 1000*0.8, param2: 500*0.8},
    'hard': {param1: 1000*0.6, param2: 500*0.6},
    'vhard': {param1: 1000*0.4, param2: 500*0.4}
}

const turnDelay = {
    'first': {param1: 4500},
    'next': {param1: 2000},
}

/*----- app's state (variables) -----*/
let sequenceArr; //holds computer array/sequence
let turn; //keeps track of the turn
let playerArr; //stores the player's array, which is reset each turn
let playerCounter; //the variable that stores the count during each player turn
let highScore; //the variable that stores the high score (not stored locally or retained after the session)
let td; //turn delay
let newHighScore; //is true if a new high score is reached

/*----- cached element references -----*/
const boardEl = document.getElementById('board');
const audioPlayer = new Audio();
const gameBtnEl = document.querySelector('button');
const messageEl = document.getElementById('message');
const counterEl = document.getElementById('counter');
const highScoreEl = document.getElementById('highScore');
const ctrEl = document.getElementById('ctr');

/*----- functions -----*/
// !RENDERING & FX functions

//initialise all state and then kicks off the computer's turn
function init() {
    //initialises variables
    sequenceArr = [];
    playerArr = [];
    playerCounter = 0;
    newHighScore = false;
    turn = -1;
    //set the high score to 0 if only on first game & set the time delay to 'first' because of the audio sound being 4s
    if (highScore === undefined) {
        highScore = 0;
        td = 'first';
    } else {};
    //plays sound at start of game
    playSound('atn');
    //resets counter at start of game
    updateCounter();
    //renders messages at start of game
    render();
    //starts the computer turn
    compTurn(sequenceArr);
    //sets the time delay for subsequent turns
    td = 'next';
}

//MAIN RENDER FUNCTION
function render(arr) {
    renderStates();
    renderBgColor();
}

//renders messages
function renderStates() {
    gameBtnEl.innerText = 'RESTART';
    if (turn === -1) {
        messageEl.innerText = 'Computer turn...'
    } else if (turn === 1) {
        messageEl.innerText = 'Player turn...'
    } else if (newHighScore === true) {
        messageEl.innerText = 'GAME OVER! But you got a NEW HIGH SCORE!'
    } else if (turn === null) {
        messageEl.innerText = 'GAME OVER! Click RESTART to try again!'
    }
}

//renders background colours on the game for game over etc.
function renderBgColor() {
    if (turn === -1 || turn === 1 || newHighScore === true) {
        document.querySelector("body").style.transitionDuration = "3s";
        document.querySelector('body').style.backgroundColor = 'var(--green-bg)';
        ctrEl.style.transitionDuration = "3s";
        ctrEl.style.borderColor = 'var(--green-bg)';
    } else if (turn === null) {
        document.querySelector("body").style.transitionDuration = "1s";
        document.querySelector('body').style.backgroundColor = 'var(--red-go)';
        ctrEl.style.transitionDuration = "1s";
        ctrEl.style.borderColor = 'var(--red-go';
    }
}

//plays any sound you request it to providing you pass it the name of the sound and its in the correct data object
function playSound(name) {
    audioPlayer.src = sounds[name];
    audioPlayer.play();
}

//allows you to add functionality for clicking the buttons (player turn)
function addPlayerClicking() {
    boardEl.addEventListener('mousedown', handleClick);
    boardEl.addEventListener('touchstart', handleClick);
}

//removes functionality for player clicking buttons (comp turn)
function rmPlayerClicking() {
    boardEl.removeEventListener('mousedown', handleClick);
    boardEl.removeEventListener('touchstart', handleClick);
}

//supports the adjustment of the speed/difficulty level, to enable the game to speed up as the turns progress
function getDiffLevel(arr) {
    if (arr.length > 12) {
        return 'vhard';
    } else if (arr.length > 8) {
        return 'hard';
    } else if (arr.length > 4) {
        return 'normal';
    } else {
        return 'easy';
    }
}

//gets a random number 0,1,2,4 - supports generation of the computer array
function getNumUpTo3() {
    return Math.floor(Math.random() * 4);
}

//TAKEN OFF INTERNET AND IMPLEMENTED - https://confetti.js.org/more.html
function runConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
}

//! COMPUTER TURN functions
//Runs the computer's turn, delays start by 2 sec
function compTurn(arr) {
    //stops the player from clicking buttons
    rmPlayerClicking();
    //sets player array to empty array
    playerArr = [];
    //resets turn to computer turn
    turn = -1;
    //renders messages
    render();
    //delays the comp sequence function depending on whether its the start of the game or not due to the audio
    setTimeout(() => {
        compSequence(arr);
    }, turnDelay[td].param1); 
}

//increases the comp array, calls Play Sequence, changes the turn
function compSequence(arr) {
    //takes the sequence array, adds a new number
    const newIdxItem = getNumUpTo3();
    arr.push(newIdxItem);
    //get difficulty level based on the array length
    const diffLevel = getDiffLevel(arr);
    //renders the sequence for the play to visualise
    playSequence(arr, diffLevel);
    //change turn to player and calls render, adds player functionality to click buttons, has to be delayed proportionately to the array length
    setTimeout(() => {
        turn = 1;
        render();
        addPlayerClicking();
    }, DIFFICULTY[diffLevel].param1*arr.length); 
}

function playSequence(arr, diffLevel) {
    //variable for the button we want to visualise
    let btnToVis;
    //get difficulty level
    diffLevel = getDiffLevel(arr);
    //iterate through comp array and visualise the computer's button clicks, lights, sounds
    for (let i=0; i<arr.length; i++) {
        //difficulty level / progression through the game impacts the speed of the comp sequence
        setTimeout(function timer() {
            //change ID to implement a 'clicked' state in the CSS
            btnToVis = document.getElementById(btnLookup[arr[i]].color);
            playSound(btnToVis.id);
            btnToVis.id = `${btnToVis.id}Clicked`;
            setTimeout(() => {
                //change back to original ID by slicing the ID back to what it was
                const trimmedId = btnToVis.id.slice(0, 3);
                btnToVis.id = trimmedId;
            }, DIFFICULTY[diffLevel].param2);
        }, i * DIFFICULTY[diffLevel].param1);
    }
}

//! PLAYER TURN functions
function handleClick(evt) {
    //guards to prevent improper clicking
    if (evt.target.classList.value !== 'clrbtns') return;
    //else if button is actually clicked, add that button to the player array
    addToPlayerArr(evt);
    //immediately compare the comp array and player array to check if we have a 'game over', or a correct button click
    compareArr(sequenceArr, playerArr);
    //render the button click color FX, sounds etc.
    handleSound(evt);
    renderBtnClr(evt);
};

//function to push the button clicked to the player array
function addToPlayerArr(evt) {
    playerArr.push(arrLookup[evt.target.id]);
}

//function to 'light up' the button the player clicks - reusing functionality from the comp sequence
function renderBtnClr(evt) {
    //get the current clicked button and change its ID to make the styling brighter
    let clickedBtn = document.getElementById(`${evt.target.id}`)
    clickedBtn.id = `${evt.target.id}Clicked`;
    //set a timeout to change ID back to original after a timer
    setTimeout(() => {
        const trimmedId = clickedBtn.id.slice(0, 3);
        clickedBtn.id = trimmedId;
    }, 500);
}

//plays the correct sound depending on logic when player clicks a button on their turn
function handleSound(evt) {
    const clickedBtn = document.getElementById(`${evt.target.id}`)
    if (turn !== null) {
        playSound(clickedBtn.id);
    } else if (newHighScore === true) {
        playSound('bon');
    } else if (turn === null) {
        playSound('err');
    }
}
//critical function - main logic for comparing the button the player clicks with the comp array, and making sure you get the right next outcome
function compareArr(sequenceArr, playerArr) {
    //defines the idx in the array that was last introduced
    const idx = playerArr.length-1;
    //if the player clicks the wrong button, then its game over
    if (sequenceArr[idx] !== playerArr[idx]) {
        gameOver();
        return;
    // if the arrays are not the same length, then don't do anything yet (ie. let the player click another button)
    } else if (sequenceArr.length !== playerArr.length) {
        return;
    //if the button the player has clicked matches the corresponding idx in the comp array, and the arrays are the same length, then the turn is over, and it can go back to the comp's turn
    } else if (sequenceArr[idx] === playerArr[idx]) {
        //update the counter after each player turn
        updateCounter();
        //run the computer's turn
        compTurn(sequenceArr);
    }
}

function gameOver() {
    // if gameOver yields new high score, then do celebration, else give the red themed game over screen
    //update high score depending on the player counter
    updateHighScore(playerCounter);
    //if new high score, then celebrate with confetti and different sound
    if (newHighScore === true) {
        runConfetti();
    }
    //change the turn to null as its game over
    turn = null;
    //remove player ability to click buttons
    rmPlayerClicking();
    //render messages
    render();
}

//! SCORING functions
function updateCounter() {
    //guard
    if (playerCounter+1 < sequenceArr.length) {
        return;
    //no visible count on computer turn or in between games
    } else if (turn === null || turn === -1) {
        counterEl.innerText = 0;
    //increase the counter, change the inner text of the html element to visualise the counter
    } else {
        playerCounter++;
        counterEl.innerText = playerCounter;
        if (turn === null) {
            counterEl.innerText = 0;
        }
    }
}

//update the high score html element based on if there is a new high score
function updateHighScore(playerCounter) {
    if(playerCounter > highScore) {
        highScore = playerCounter;
        highScoreEl.innerText = highScore;
        newHighScore = true;
    } 
    return highScore;
}

/*----- eventListeners -----*/
gameBtnEl.addEventListener('click', init);
gameBtnEl.addEventListener('touchstart', init);




//! KNOWN BUGS
//? Doesn't seem to function well on a phone, it is responsive, but the button clicks /events don't seem to work the same