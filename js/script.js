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
    'gst': '',
    'gov': '',
}

/*----- app's state (variables) -----*/
let sequenceArr; // to be initialised to an empty array to hold the random sequence
let turn;
let playerArr;

/*----- cached element references -----*/
const boardEl = document.getElementById('board');
const audioPlayer = new Audio();
const gameBtnEl = document.querySelector('button');
const messageEl = document.getElementById('message');

//Audio controls:
// audioPlayer.volume = .5;

/*----- classes -----*/


/*----- functions -----*/

//initialise all state and then call compSequence()
function init() {
    sequenceArr = [];
    playerArr = [];
    turn = -1; //initialise to comp's turn
    render();
    compTurn(sequenceArr);
}

function compTurn(arr) {
    console.log(`compTurn function fired`)
    setTimeout(() => {
        playerArr = [];
        turn = -1;
        render();
        compSequence(arr);
    }, 2000); //run the compsequence
}

function render(arr) {
    renderMessages();
    currentState(arr);
}

function currentState(arr) {
    // console.log(arr);
    // console.log(turn);
}

function renderMessages() {
    if (turn === -1) {
        messageEl.innerText = 'Computer turn...'
    } else if (turn === 1) {
        messageEl.innerText = 'Player turn...'
    } else if (turn === null) {
        messageEl.innerText = 'GAME OVER! Click PLAY GAME to try again!'
    }
}

function compSequence(arr) {
    console.log(`compSequence function fired`)
    console.log(`sequence arr is: ${arr}`)
    //takes the sequence array, adds a new number
    const newIdxItem = getNumUpTo3();
    arr.push(newIdxItem);
    //renders the sequence for the play to visualise
    console.log(`sequence arr is: ${arr}`)
    playSequence(arr);
    console.log(`sequence arr is: ${arr}`)
    //change turn to player and calls render
    setTimeout(() => {
        turn = 1;
        // console.log(`turn: ${turn}`)
        render();
    }, 1000*arr.length); 
    addPlayerClicking();
    console.log(`sequence arr is: ${arr}`)
}

function playSequence(arr) {
    console.log(`playSequence function fired`)
    //for each number in the sequence, convert it to a color and render the correct special FX
    let btnToVis;
    for (let i=0; i<arr.length; i++) {
        setTimeout(function timer() {
            btnToVis = document.getElementById(btnLookup[arr[i]].color);
            playSound(btnToVis.id);
            btnToVis.id = `${btnToVis.id}Clicked`;
            setTimeout(() => {
                // console.log(`btnToVis ID is equal to ${btnToVis.id}`);
                const trimmedId = btnToVis.id.slice(0, 3);
                btnToVis.id = trimmedId;
                // console.log(`btnToVis ID is equal to ${btnToVis.id}`);
            }, 500);
        }, i * 1000);
    }
}

function getNumUpTo3() {
  return Math.floor(Math.random() * 4);
}

function handleClick(evt) {
    console.log(`handleClick function fired`)
    //guards to prevent improper clicking
    if (evt.target.classList.value !== 'clrbtns') return;
    //else if button is actually clicked...
    addToPlayerArr(evt);
    //only compare the array if the player has clicked enough buttons
    compareArr(sequenceArr, playerArr);
    handleSound(evt);
    renderBtnClr(evt);
};

function addToPlayerArr(evt) {
    playerArr.push(arrLookup[evt.target.id]);
}

function compareArr(sequenceArr, playerArr) {
    console.log(`compareArr function fired`);
    console.log(`sequenceArr: ${sequenceArr}`);
    console.log(`playerArr: ${playerArr}`);
    //guards - only compare the array if they are the same length
    if (sequenceArr.length !== playerArr.length) return;
    //compare the arrays
    for (let i=1; i<=sequenceArr.length; i++) {
        if (sequenceArr[i] !== playerArr[i]) {
            gameOver();
            rmPlayerClicking();
            console.log('a fired')
        } else if (sequenceArr[i] === playerArr[i]) {
            console.log('b fired', i, sequenceArr.length)
            if (i === sequenceArr.length) {
                rmPlayerClicking();
                console.log(sequenceArr);
                compTurn(sequenceArr);
                console.log('c fired')
            }
        };
    }
    
}

function gameOver() {
    console.log('the game is over!!!!!!');
    turn = null;
    render();
    // playSound('err');   //FIX THIS
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
    playSound(clickedBtn.id);
}

function playSound(name) {
    audioPlayer.src = sounds[name];
    audioPlayer.play();
}

function addPlayerClicking() {
    console.log(`addPlayerClicking function fired`)
    boardEl.addEventListener('mousedown', handleClick);
}

function rmPlayerClicking() {
    console.log(`removePlayerClicking function fired`)
    boardEl.removeEventListener('mousedown', handleClick);
}


// test();

/*----- eventListeners -----*/
gameBtnEl.addEventListener('click', init);