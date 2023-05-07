/*----- constants -----*/
const btnLookup = {
    0: {color: 'red'},
    1: {color: 'grn'},
    2: {color: 'yel'},
    3: {color: 'blu'},
};

const sounds = {
    red: 'sounds/btn1.mp3',
    grn: 'sounds/btn2.mp3',
    yel: 'sounds/btn3.mp3',
    blu: 'sounds/btn4.mp3',
    gst: '',
    gov: '',
}

/*----- app's state (variables) -----*/
let sequenceArr; // to be initialised to an empty array to hold the random sequence
let turn;

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
init();

function init() {
    sequenceArr = [];
    turn = null; //initialise to computer turn
}

function gameStart(sequenceArr) {
    turn = -1
    render(sequenceArr); //render messages only atm
    compSequence(sequenceArr); //run the compsequence
}

function render(arr) {
    renderMessages();
    currentState(arr);
}

function currentState(arr) {
    console.log(arr);
    console.log(turn);
}

function renderMessages() {
    if (turn === -1) {
        messageEl.innerText = 'Computer turn...'
    } else if (turn === 1) {
        messageEl.innerText = 'Player turn...'
    } else if (turn === null) {
        messageEl.innerText = 'GAME OVER'
    }
}

function compSequence(sequenceArr) {
    //takes the sequence array, adds a new number
    const newIdxItem = getNumUpTo3();
    sequenceArr.push(newIdxItem);
    //renders the sequence for the play to visualise
    playSequence(sequenceArr);
    //change turn to player and calls render
    setTimeout(() => {
        turn = 1;
        // console.log(`turn: ${turn}`)
        render();
    }, 1000*sequenceArr.length);    
}

function playSequence(arr) {
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
    //guards to prevent improper clicking
    if (evt.target.classList.value !== 'clrbtns') return;
    //else if button is actually clicked...
    handleSound(evt);
    renderBtnClr(evt);
};

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


// function test() {
//     for (let i = 1; i < 10; i++) {
//         setTimeout(function timer() {
//           console.log("hello world");
//         }, i * 1000);
//       }
// }

// test();

/*----- eventListeners -----*/
boardEl.addEventListener('mousedown', handleClick);
gameBtnEl.addEventListener('click', gameStart);