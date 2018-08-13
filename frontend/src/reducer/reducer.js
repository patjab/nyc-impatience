import { playerStartX, playerStartY, walking } from '../setupData'

const initialState = {
  canvas: null,
  player: {
    xPosition: playerStartX,
    yPosition: playerStartY
  },
  initialPeopleSizes: 150, // POSSIBLY move this to setupData
  movement: 0,
  movementPerBrick: walking,
  centersOfBricks: [],
  currentTourists: []
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
    case "INITIALIZE_BRICK_LIST":
      return {
        ...state,
        centersOfBricks: action.payload
      }
    case "CHANGE_SPEED":
      return {
        ...state,
        movementPerBrick: action.payload
      }
    case "ADD_TOURIST": 
      return {
        ...state,
        currentTourists: [...state.currentTourists, action.payload]
      }
    default:
      return state
  }
}


export default gameController
