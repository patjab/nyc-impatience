import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { horizonLine, initialPlayerSize, playerStartY, canvasHeight, nearnessSpook, rendingTouristRowsPercentage } from '../setupData'
import { addTouristToGarbage, addTouristToRoaster, removeTouristFromRoaster,
  resetPlayer, decreaseLife, recordStreak, forceUpdateOfPathForAnimation,
  forceUpdateOfPlayerForAnimation, changeMovementAbility, toggleBumpingShake } from '../actions'

const Tourist = class extends Component {
  state = {
    positionX: null,
    positionY: null,
    initialRow: null,
    initialCol: null,
    positionOnArray: null,
    walkingCycle: 0,
    initialSize: null,
    image: Math.trunc(Math.random() * 3),
    images: ['../touristA.png', '../tourist2.png', '../tourist3.png'],
    dontCallBumpAgain: false,
    mountedOnMovement: null,
    derivedStateOverride: false,
    touristUpdater: 0
  }

  findAngle = () => {
    const lengthOfGroundTriangle = this.props.canvas.height - this.horizonPosition
    const widthOfGroundTriangle = this.props.canvas.width/2

    const sideOfPath = Math.sqrt(Math.pow(lengthOfGroundTriangle, 2) + Math.pow(widthOfGroundTriangle, 2))
    const numerator = (2 * Math.pow(sideOfPath, 2)) - Math.pow(this.props.canvas.width, 2)
    const denominator = (2 * Math.pow(sideOfPath, 2))

    return Math.acos(numerator/denominator)
  }

  static getDerivedStateFromProps(props, state) {
    let chosenRow, chosenCol, startingSize, initialRow, initialCol, mountedOnMovement

    if (state.positionOnArray === null && props.centersOfBricks.length > 0 ) {
      initialRow = chosenRow = Math.trunc(Math.trunc(Math.random()*(props.centersOfBricks.length-1)) * rendingTouristRowsPercentage)
      initialCol = chosenCol = Math.trunc(Math.random()*(props.centersOfBricks[0].length-1))
      startingSize = (positionY - horizonLine) * ((initialPlayerSize)/(playerStartY - horizonLine))
      mountedOnMovement = props.movement
    } else if (state.positionOnArray !== null ) {
      const brickTransitionHelper = (Math.trunc(props.movementPerBrick * (props.movement) * 0.5) * 2) - (Math.trunc(props.movementPerBrick * (state.mountedOnMovement) * 0.5) * 2)
      // 0.5 because each cycle of bricks involves two rows since adjacent rows are not similar in style
      chosenRow = state.derivedStateOverride ? state.positionOnArray.row : (state.initialRow + brickTransitionHelper ) % props.centersOfBricks.length
      chosenCol = state.positionOnArray.col
    } else {
      return state
    }

    const positionX = props.centersOfBricks[chosenRow][chosenCol].x
    const positionY = props.centersOfBricks[chosenRow][chosenCol].y

    return {
      ...state,
      positionX: positionX,
      positionY: positionY,
      initialRow: initialRow || state.initialRow,
      initialCol: initialCol || state.initialCol,
      positionOnArray: {col: chosenCol, row: chosenRow},
      initialSize: startingSize || state.startingSize,
      mountedOnMovement: mountedOnMovement || state.mountedOnMovement
    }

  }

  howBigShouldIBe = () => {
    return (this.state.positionY - horizonLine) * ((initialPlayerSize)/(playerStartY - horizonLine))
  }

  runningAnimation = () => {
    const currentRow = this.state.positionOnArray.row
    const currentCol = this.state.positionOnArray.col
    let i = 1

    let animation = setInterval(() => {
      if ( this.state.positionOnArray.row <= 0 ) {
        clearInterval(animation)
        this.props.addTouristToGarbage(this.props.id)
      } else {
        this.setState({
          positionOnArray: {
            col: currentCol,
            row: currentRow-i
          },
          derivedStateOverride: true
        }, () => {
          for ( let tourist of this.props.touristRoaster ) {
            tourist.setState({touristUpdater: tourist.state.touristUpdater+1})
          }
          this.props.forceUpdateOfPathForAnimation()
          this.props.forceUpdateOfPlayerForAnimation()
          this.setState({touristUpdater: this.state.touristUpdater+1})
          i += 1
        })
      }
    }, 30)

  }

  checkForCollision = () => {
    const sizeOfSide = this.howBigShouldIBe()

    const lowerLeftTourist = {x: this.state.positionX, y: this.state.positionY + sizeOfSide}
    const lowerRightTourist = {x: this.state.positionX + sizeOfSide, y: this.state.positionY + sizeOfSide}
    const lowerLeftPlayer = {x: this.props.playerX, y: this.props.playerY + initialPlayerSize}
    const lowerRightPlayer = {x: this.props.playerX + initialPlayerSize, y: this.props.playerY + initialPlayerSize}

    let bumpOnTheLeft = (lowerLeftPlayer.x >= lowerLeftTourist.x && lowerLeftPlayer.x <= lowerRightTourist.x) && (Math.abs(lowerLeftPlayer.y - lowerLeftTourist.y) < nearnessSpook)
    let bumpOnTheRight = (lowerRightPlayer.x >= lowerLeftTourist.x && lowerRightPlayer.x <= lowerRightTourist.x) && (Math.abs(lowerLeftPlayer.y - lowerLeftTourist.y) < nearnessSpook)
    if ( (bumpOnTheLeft || bumpOnTheRight) && !this.state.dontCallBumpAgain ) {
      this.props.toggleBumpingShake()
      setTimeout(this.props.toggleBumpingShake, 1000)
      setTimeout(()=>this.props.changeMovementAbility(false), 1000)

      !this.refs.bumpSoundEl.paused ? this.refs.bumpSoundEl.pause() : null
      this.refs.bumpSoundEl.play()
      this.setState({dontCallBumpAgain: true}, () => {
        this.runningAnimation()
        this.props.recordStreak(this.props.movement)
        this.props.resetPlayer()
        this.props.decreaseLife()
      })
    }
  }

  checkIfTouristStillInView = () => {
    if (this.state.positionY) {
      if (this.state.positionY > (canvasHeight - (initialPlayerSize/2))) {
        this.props.addTouristToGarbage(this.props.id)
      }
    }
  }

  componentDidMount() {
    this.refs.touristImg.onload = () => {
      const sizeOfSide = this.state.initialSize
      try {
        this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
        this.props.addTouristToRoaster(this)
      } catch (err) {
        console.log("CANVAS ERROR BYPASSED")
      }
    }
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    const sizeOfSide = this.howBigShouldIBe()
    this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
    this.checkForCollision()
    this.checkIfTouristStillInView()
  }

  componentWillUnmount() {
    this.props.removeTouristFromRoaster(this.props.id)
  }

  render() {
    return (
      <Fragment>
        <audio src='../bump.wav' ref='bumpSoundEl'/>
        <img src={`${this.state.images[this.state.image]}`} ref='touristImg' className='hidden' alt='tourist'/>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    movement: state.movement,
    playerX: state.player.xPosition,
    playerY: state.player.yPosition,
    centersOfBricks: state.centersOfBricks,
    movementPerBrick: state.movementPerBrick,
    touristRoaster: state.touristRoaster
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTouristToRoaster: (tourist) => dispatch(addTouristToRoaster(tourist)),
    removeTouristFromRoaster: (id) => dispatch(removeTouristFromRoaster(id)),
    addTouristToGarbage: (id) => dispatch(addTouristToGarbage(id)),
    resetPlayer: () => dispatch(resetPlayer()),
    decreaseLife: () => dispatch(decreaseLife()),
    recordStreak: (streak) => dispatch(recordStreak(streak)),
    forceUpdateOfPathForAnimation: () => dispatch(forceUpdateOfPathForAnimation()),
    forceUpdateOfPlayerForAnimation: () => dispatch(forceUpdateOfPlayerForAnimation()),
    changeMovementAbility: (isDisabled) => dispatch(changeMovementAbility(isDisabled)),
    toggleBumpingShake: () => dispatch(toggleBumpingShake())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tourist)
