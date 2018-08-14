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
  garbageOfTourists: [],
  touristRoaster: [],
  signalTimeOut: false
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
        movement: state.movement !== 0 && state.movement - action.payload.y < 0 ? 0 : state.movement + action.payload.y
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
    case "ADD_TOURIST_TO_GARBAGE":
      return {
        ...state,
        garbageOfTourists: [...state.garbageOfTourists, action.payload]
      }
    case "ADD_TOURIST_TO_ROASTER":
      return {
        ...state,
        touristRoaster: [...state.touristRoaster, action.payload]
      }
    case "EMPTY_GARBAGE_OF_TOURISTS":
      return {
        ...state,
        garbageOfTourists: []
      }
    case "EMPTY_TOURIST_ROASTER":
      return {
        ...state,
        touristRoaster: []
      }
    case "REMOVE_TOURIST_FROM_ROASTER":
      return {
        ...state,
        touristRoaster: state.touristRoaster.filter(tourist => action.payload !== tourist.props.id)
      }
    case "SIGNAL_TIME_OUT":
      return {
        ...state,
        signalTimeOut: true
      }
    case "RESET_PLAYER":
      return {
        ...state,
        player: {
          xPosition: playerStartX,
          yPosition: playerStartY
        },
        initialPeopleSizes: 150, // POSSIBLY move this to setupData
        movement: 0,
        movementPerBrick: walking,
        signalTimeOut: false
      }
    default:
      return state
  }
}


export default gameController
