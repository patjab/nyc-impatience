export const setThisCanvas = (canvas) => {
  return {
    type: "SET_CANVAS",
    payload: canvas
  }
}

export const movePlayer = (x, y) => {
  return {
    type: "MOVE_PLAYER",
    payload: {x, y}
  }
}

export const changeSpeed = (speed) => {
  return {
    type: "CHANGE_SPEED",
    payload: speed
  }
}

export const initializeBrickList = (brickList) => {
  return {
    type: "INITIALIZE_BRICK_LIST",
    payload: brickList
  }
}

export const addTourist = (tourist) => {
  return {
    type: "ADD_TOURIST",
    payload: tourist
  }
}
