const initialState = {
  canvas: null,
  player: {
    xPosition: 375-(150/2),
    yPosition: 1334-(150*1.5)
  },
  initialPeopleSizes: 150,
  movement: 0
}

const gameController = (state = initialState, action) => {
  switch(action.type) {
    case "SET_CANVAS":
      return {
        ...state,
        canvas: action.payload
      }
    case "MOVE_PLAYER":
      return {
        ...state,
        player: {
          ...state.player,
          xPosition: state.player.xPosition + (action.payload.x)
        },
        movement: state.movement + (action.payload.y)
      }
    default:
      return state
  }
}


export default gameController
