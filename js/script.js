/*----- constants -----*/
const btnLookup = {
    red: {hoverClr: '#eb4723'},
    grn: {hoverClr: '#1aad49'},
    yel: {hoverClr: '#faed34'},
    blu: {hoverClr: '#169ae0'},
  };

/*----- app's state (variables) -----*/


/*----- cached element references -----*/
document.getElementById('board').addEventListener('click', handleClick)

/*----- classes -----*/


/*----- functions -----*/
function handleClick(evt) {
    // //guards
    if (evt.target.classList.value !== 'clrbtns') return;
    // // console.log(evt.target.classList.value)
    let clickedClr = btnLookup[evt.target.id].hoverClr;
    document.getElementById(`${evt.target.id}`).style.backgroundColor = clickedClr;
};

/*----- eventListeners -----*/
