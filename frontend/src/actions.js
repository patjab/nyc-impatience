export const setThisCanvas = (canvas) => {
  return {
    type: "SET_CANVAS",
    payload: canvas
  }
}

export const movePlayer = (x, y) => {
  console.log("INSIDE MOVE PLAYER")
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
