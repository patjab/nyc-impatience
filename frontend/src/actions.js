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

export const signalTimeOut = () => {
  return {
    type: "SIGNAL_TIME_OUT"
  }
}

export const addTouristToRoaster = (tourist) => {
  return {
    type: "ADD_TOURIST_TO_ROASTER",
    payload: tourist
  }
}

export const removeTouristFromRoaster = (id) => {
  return {
    type: "REMOVE_TOURIST_FROM_ROASTER",
    payload: id
  }
}

export const emptyTouristRoaster = () => {
  return {
    type: "EMPTY_TOURIST_ROASTER"
  }
}

export const playerBroughtBack = () => {
  return {
    type: "PLAYER_BROUGHT_BACK"
  }
}

export const resetPlayer = () => {
  return {
    type: "RESET_PLAYER"
  }
}

export const decreaseLife = () => {
  return {
    type: "DECREASE_LIFE"
  }
}

export const exitStartScreen = () => {
  return {
    type: "EXIT_START_SCREEN"
  }
}

export const recordStreak = (streak) => {
  return {
    type: "RECORD_STREAK",
    payload: streak
  }
}
