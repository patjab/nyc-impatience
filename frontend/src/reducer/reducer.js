const initialState = {
  canvas: null
}

const gameController = (state = initialState, action) => {
  switch(action.type) {
    case "SET_CANVAS":
      return {
        ...state,
        canvas: action.payload
      }
    default:
      return state
  }
}


export default gameController
