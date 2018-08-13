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

export const addTouristToGarbage = (id) => {
  return {
    type: "ADD_TOURIST_TO_GARBAGE",
    payload: id
  }
}

export const emptyGarbageOfTourists = (id) => {
  return {
    type: "EMPTY_GARBAGE_OF_TOURISTS"
  }
}
