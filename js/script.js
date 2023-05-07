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
}

const DIFFICULTY = {
    'easy': {param1: 1000, param2: 500},
    'normal': {param1: 1000*0.8, param2: 500*0.8},
    'hard': {param1: 1000*0.6, param2: 500*0.6},
    'vhard': {param1: 1000*0.4, param2: 500*0.4}
}

/*----- app's state (variables) -----*/
let sequenceArr; // to be initialised to an empty array to hold the random sequence
let turn;
let playerArr;
let playerCounter;
let highScore;

/*----- cached element references -----*/
const boardEl = document.getElementById('board');
const audioPlayer = new Audio();
const gameBtnEl = document.querySelector('button');
const messageEl = document.getElementById('message');
const counterEl = document.getElementById('counter');
const highScoreEl = document.getElementById('highScore');

//Audio controls:
// audioPlayer.volume = .5;

/*----- classes -----*/


/*----- functions -----*/

//initialise all state and then call compSequence()
function init() {
    sequenceArr = [];
    playerArr = [];
    turn = -1; //initialise to comp's turn
    playerCounter = 0;
    if (highScore === undefined) {
        highScore = 0;
    } else {/*do nothing*/};
    updateCounter();
    render();
    compTurn(sequenceArr);
}

function compTurn(arr) {
    setTimeout(() => {
        playerArr = [];
        turn = -1;
        render();
        compSequence(arr)
    }, 2000); 
}

function render(arr) {
    renderStates();
    changeBgColor();
    currentState(arr);
}

function currentState(arr) {
    // console.log(arr);
    // console.log(turn);
}

function renderStates() {
    gameBtnEl.innerText = 'RESTART';
    if (turn === -1) {
        messageEl.innerText = 'Computer turn...'
    } else if (turn === 1) {
        messageEl.innerText = 'Player turn...'
    } else if (turn === null) {
        messageEl.innerText = 'GAME OVER! Click RESTART to try again!'
    }
}

function changeBgColor() {
    if (turn === -1 || turn === 1) {
        document.querySelector("body").style.transitionDuration = "3s";
        document.querySelector('body').style.backgroundColor = '#001700'
    } else if (turn === null) {
        document.querySelector("body").style.transitionDuration = "1s";
        document.querySelector('body').style.backgroundColor = '#A11800';
    }
}

function compSequence(arr) {
    //takes the sequence array, adds a new number
    const newIdxItem = getNumUpTo3();
    arr.push(newIdxItem);
    //get difficulty level
    const diffLevel = getDiffLevel(arr);
    console.log(`difficulty level: ${diffLevel}`);
    //renders the sequence for the play to visualise
    playSequence(arr, diffLevel);
    //change turn to player and calls render
    setTimeout(() => {
        turn = 1;
        render();
    }, DIFFICULTY[diffLevel].param1*arr.length); 
    addPlayerClicking();
    console.log(`difficulty level: ${diffLevel}`);
}

function playSequence(arr, diffLevel) {
    let btnToVis;
    diffLevel = getDiffLevel(arr);
    console.log(`difficulty level: ${diffLevel}`);
    for (let i=0; i<arr.length; i++) {
        console.log(DIFFICULTY[diffLevel].param1);
        setTimeout(function timer() {
            btnToVis = document.getElementById(btnLookup[arr[i]].color);
            playSound(btnToVis.id);
            btnToVis.id = `${btnToVis.id}Clicked`;
            console.log(diffLevel);
            setTimeout(() => {
                const trimmedId = btnToVis.id.slice(0, 3);
                btnToVis.id = trimmedId;
            }, DIFFICULTY[diffLevel].param2);
        }, i * DIFFICULTY[diffLevel].param1);
    }
}


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

function compareArr(sequenceArr, playerArr) {
    for (let i=0; i<sequenceArr.length; i++) {
        if (sequenceArr[i] !== playerArr[i]) {
            gameOver();
            return;
        } else if (sequenceArr[i] === playerArr[i]) {
            if (sequenceArr.length !== playerArr.length) {
                return;
            } else if (i+1 === sequenceArr.length) {
                updateCounter();
                rmPlayerClicking();
                compTurn(sequenceArr);
            }
        };
    }
    
}

function gameOver() {
    turn = null;
    rmPlayerClicking();
    updateHighScore(playerCounter, highScore);
    render();
}

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

function updateHighScore(playerCounter, highScore) {
    console.log(playerCounter, highScore);
    if(playerCounter >= highScoreEl.innerText) {
        highScoreEl.innerText = playerCounter;
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

function getNumUpTo3() {
  return Math.floor(Math.random() * 4);
}

/*----- eventListeners -----*/
gameBtnEl.addEventListener('click', init);
gameBtnEl.addEventListener('touchstart', init);



//ideas
// 2) celebration if new high score

//bugs
// 1) can break game if you click during comp sequence



