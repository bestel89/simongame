/*----- constants -----*/
const btnLookup = {
    red: {clickedClr: '--redL'},
    grn: {clickedClr: '--greenL'},
    yel: {clickedClr: '--yellowL'},
    blu: {clickedClr: '--blueL'},
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


/*----- cached element references -----*/
const boardEl = document.getElementById('board')
const redEl = document.getElementById('red');
const grnEl = document.getElementById('grn');
const yelEl = document.getElementById('yel');
const bluEl = document.getElementById('blu');
const audioPlayer = new Audio();

//Audio controls:
// audioPlayer.volume = .5;

/*----- classes -----*/


/*----- functions -----*/
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
    console.log(sounds[clickedBtn.id]);
    playSound(clickedBtn.id);
}

function playSound(name) {
    audioPlayer.src = sounds[name];
    audioPlayer.play();
}

/*----- eventListeners -----*/
boardEl.addEventListener('mousedown', handleClick)