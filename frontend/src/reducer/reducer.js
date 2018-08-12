import { playerStartX, playerStartY } from '../setupData'

const initialState = {
  canvas: null,
  player: {
    xPosition: playerStartX,
    yPosition: playerStartY
  },
  initialPeopleSizes: 150, // POSSIBLY move this to setupData
  movement: 0,
  brickFellOffScreen: false,
  brickRowList: [],
  brickList: []
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
    case "ADD_BRICK_ROW_LIST":
      return {
        ...state,
        brickRowList: action.payload
      }
    case "ADD_BRICK_TO_LIST":
      return {
        ...state,
        brickList: [...state.brickList, action.payload]
      }
    case "UPDATE_EXISTING_BRICK":
      return {
        ...state,
        brickList: [...[...state.brickList].filter(brick => brick.id !== action.payload.id), {id: action.payload.id, x: action.payload.x, y: action.payload.y}]
      }
    case "CLEAR_BRICK_ROW_LIST":
      return {
        ...state,
        rowsWithBrickBorders: []
      }
    default:
      return state
  }
}

export default gameController
