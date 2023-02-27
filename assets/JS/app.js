
// Module pattern for the gameboard
const Gameboard = (() => {
  let _board = ['', '', '', '', '', '', '', '', ''];
})

//Module pattern for the display
const DisplayController = (() => {

})

// Factory function for the players
const PlayerFactory = (name, mark) => {
  return {
    name,
    mark,
  }
};

