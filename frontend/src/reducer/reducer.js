import { playerStartX, playerStartY } from '../setupData'

const initialState = {
  canvas: null,
  player: {
    xPosition: playerStartX,
    yPosition: playerStartY
  },
  initialPeopleSizes: 150, // POSSIBLY move this to setupData
  movement: 0,
  centersOfBricks: []
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
    case "ADD_BRICK_TO_LIST":
      return {
        ...state,
        centersOfBricks: [...state.centersOfBricks, {x: action.payload.x, y: action.payload.y}]
      }
    default:
      return state
  }
}


export default gameController
