import { playerStartX, playerStartY, walking, movementsPerStage } from '../setupData'

const initialState = {
  canvas: null,
  player: {
    xPosition: playerStartX,
    yPosition: playerStartY
  },
  playerRef: null,
  movement: 0,
  movementPerBrick: walking,
  centersOfBricks: [],
  garbageOfTourists: [],
  touristRoaster: [],
  streak: [],
  lives: 3,
  startScreenPresent: true,
  speed: 1,
  stage: 0,
  pathUpdater: 0,
  playerUpdater: 0,
  disabled: false,
  bumpingShake: false,
  gameOver: false
}

const gameController = (state = initialState, action) => {
  switch(action.type) {
    case "SET_CANVAS":
      return {
        ...state,
        canvas: action.payload
      }
    case "MOVE_PLAYER":
      const allowedMovement = state.movement !== 0 && state.movement + (action.payload.y * state.speed) < 0 ? 0 : state.movement + (action.payload.y * state.speed)
      if (state.lives > 0) {
        return {
          ...state,
          player: {
            ...state.player,
            xPosition: state.disabled ? state.player.xPosition : state.player.xPosition + (action.payload.x)
          },
          pathUpdater: state.pathUpdater + 1,
          movement: state.disabled ? state.movement : allowedMovement,
          stage: Math.trunc(allowedMovement/movementsPerStage)
        }
      } else {
        return state
      }
    case "INITIALIZE_BRICK_LIST":
      return {
        ...state,
        centersOfBricks: action.payload
      }
    case "CHANGE_SPEED":
      return {
        ...state,
        speed: action.payload
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
    case "RESET_PLAYER":
      return {
        ...state,
        disabled: true,
        movementPerBrick: walking
      }
    case "DECREASE_LIFE":
      return {
        ...state,
        lives: state.lives > -1 ? state.lives - 1 : 0
      }
    case "EXIT_START_SCREEN":
      return {
        ...state,
        startScreenPresent: false
      }
    case "RECORD_STREAK":
      return {
        ...state,
        streak: [...state.streak, action.payload]
      }
    case "FORCE_UPDATE_OF_PATH_FOR_ANIMATION":
      return {
        ...state,
        pathUpdater: state.pathUpdater + 1
      }
    case "FORCE_UPDATE_OF_PLAYER_FOR_ANIMATION":
      return {
        ...state,
        playerUpdater: state.playerUpdater + 1
      }
    case "CHANGE_MOVEMENT_ABILITY":
      return {
        ...state,
        disabled: action.payload
      }
    case "SET_PLAYER":
      return {
        ...state,
        playerRef: action.payload
      }
    case "TOGGLE_BUMPING_SHAKE":
      return {
        ...state,
        bumpingShake: !state.bumpingShake
      }
    case "SET_GAME_OVER":
      return {
        ...state,
        gameOver: true
      }
    default:
      return state
  }
}

export default gameController
