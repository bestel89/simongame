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
let sequenceArr; // to be initialised to an empty array to hold the random sequence
let turn;
let playerArr;
let playerCounter;
let highScore;
let td;
let newHighScore;

/*----- cached element references -----*/
const boardEl = document.getElementById('board');
const audioPlayer = new Audio();
const gameBtnEl = document.querySelector('button');
const messageEl = document.getElementById('message');
const counterEl = document.getElementById('counter');
const highScoreEl = document.getElementById('highScore');
const ctrEl = document.getElementById('ctr');

//Audio controls:
// audioPlayer.volume = .5;

/*----- classes -----*/


/*----- functions -----*/
/*----- RENDERING & FX functions -----*/

//initialise all state and then call compSequence()
function init() {
    sequenceArr = [];
    playerArr = [];
    turn = -1; //initialise to comp's turn
    playerCounter = 0;
    newHighScore = false;
    ///first turn things
    if (highScore === undefined) {
        highScore = 0;
        td = 'first';
    } else {};
    playSound('atn');
    updateCounter();
    render();
    compTurn(sequenceArr);
    td = 'next';
}

function render(arr) {
    renderStates();
    renderBgColor();
}

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

function playSound(name) {
    audioPlayer.src = sounds[name];
    audioPlayer.play();
}

function addPlayerClicking() {
    boardEl.addEventListener('mousedown', handleClick);
    boardEl.addEventListener('touchstart', handleClick);
}

function rmPlayerClicking() {
    boardEl.removeEventListener('mousedown', handleClick);
    boardEl.removeEventListener('touchstart', handleClick);
}

// good candidate for a ternary?
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

//MOVE inline??
function getNumUpTo3() {
  return Math.floor(Math.random() * 4);
}

function runConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
}

/*----- COMPUTER TURN functions -----*/
//Runs the computer's turn, delays start by 2 sec
function compTurn(arr) {
    rmPlayerClicking();
    playerArr = [];
    turn = -1;
    render();
    console.log(turn);
    setTimeout(() => {
        compSequence(arr);
    }, turnDelay[td].param1); 
}

//increases the comp array, calls Play Sequence, changes the turn
function compSequence(arr) {
    //takes the sequence array, adds a new number
    const newIdxItem = getNumUpTo3();
    arr.push(newIdxItem);
    //get difficulty level
    const diffLevel = getDiffLevel(arr);
    //renders the sequence for the play to visualise
    playSequence(arr, diffLevel);
    //change turn to player and calls render
    setTimeout(() => {
        turn = 1;
        console.log(turn);
        render();
        addPlayerClicking();
    }, DIFFICULTY[diffLevel].param1*arr.length); 
}

function playSequence(arr, diffLevel) {
    let btnToVis;
    diffLevel = getDiffLevel(arr);
    for (let i=0; i<arr.length; i++) {
        setTimeout(function timer() {
            btnToVis = document.getElementById(btnLookup[arr[i]].color);
            playSound(btnToVis.id);
            btnToVis.id = `${btnToVis.id}Clicked`;
            setTimeout(() => {
                const trimmedId = btnToVis.id.slice(0, 3);
                btnToVis.id = trimmedId;
            }, DIFFICULTY[diffLevel].param2);
        }, i * DIFFICULTY[diffLevel].param1);
    }
}

/*----- PLAYER TURN functions -----*/
function handleClick(evt) {
    //guards to prevent improper clicking
    if (evt.target.classList.value !== 'clrbtns') return;
    //else if button is actually clicked...
    addToPlayerArr(evt);
    //compare array
    compareArr(sequenceArr, playerArr);
    //render FX
    handleSound(evt);
    renderBtnClr(evt);
};

function addToPlayerArr(evt) {
    playerArr.push(arrLookup[evt.target.id]);
}

//BUG IN HERE - not identifying game over unless you get it wrong on the last turn or the first turn
//get arr length of player arr; compare arr length i of player arr with arr i of seq arr
function compareArr(sequenceArr, playerArr) {
    const idx = playerArr.length-1;
    if (sequenceArr[idx] !== playerArr[idx]) {
        gameOver();
        return;
    } else if (sequenceArr.length !== playerArr.length) {
        return;
    } else if (sequenceArr[idx] === playerArr[idx]) {
        updateCounter();
        compTurn(sequenceArr);
    }
}

function gameOver() {
    // if gameOver yields new high score, then do celebration, else red screen
    updateHighScore(playerCounter);
    console.log(`new high score is: ${newHighScore}`)
    if (newHighScore === true) {
        //celebrate
        runConfetti();
    }
    turn = null;
    rmPlayerClicking();
    render();
}

/*----- SCORING functions -----*/
function updateCounter() {
    if (playerCounter+1 < sequenceArr.length) {
        return;
    } else if (turn === null || turn === -1) {
        counterEl.innerText = 0;
    } else {
        playerCounter++;
        counterEl.innerText = playerCounter;
        if (turn === null) {
            counterEl.innerText = 0;
        }
    }
}


// NOT FULLY WORKING
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



//ideas
// none at this time

//bugs
// none at this time

