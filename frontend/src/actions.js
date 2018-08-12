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

export const addBrickRowList = (brickRowList) => {
  return {
    type: "ADD_BRICK_ROW_LIST",
    payload: brickRowList
  }
}


export const addBrickToList = (brick) => {
  return {
    type: "ADD_BRICK_TO_LIST",
    payload: brick
  }
}

export const clearBrickRowList = () => {
  return {
    type: "CLEAR_BRICK_ROW_LIST"
  }
}

export const updateExistingBrick = (id, x, y) => {
  return {
    type: "UPDATE_EXISTING_BRICK",
    payload: {id, x, y}
  }
}
