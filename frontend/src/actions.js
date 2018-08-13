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

export const changeSpeed = () => {
  return {
    type: "CHANGE_SPEED"
  }
}

export const addBrickToList = (x, y) => {
  return {
    type: "ADD_BRICK_TO_LIST",
    payload: {x, y}
  }
}
