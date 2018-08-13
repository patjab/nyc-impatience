import React, { Component } from 'react'
import { connect } from 'react-redux'

import { horizonLine, initialPlayerSize, playerStartY, canvasHeight } from '../setupData'
import { addTourist } from '../actions'

const Tourist = class extends Component {
  state = {
    positionX: null,
    positionY: null,
    positionOnArray: null,
    progressionMagnificatonTemp: 0,
    walkingCycle: 0,
    initialSize: null,
    unmountMe: false
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
    if (state.positionOnArray === null && state.positionX === null && state.positionY === null && state.initialSize === null && props.centersOfBricks.length > 0) {
      const randomPositionOnArray = 40 + Math.trunc(Math.random() * props.centersOfBricks.length - 40)
      const positionX = props.centersOfBricks[randomPositionOnArray].x
      const positionY = props.centersOfBricks[randomPositionOnArray].y
      const startingSize = (positionY - horizonLine) * ((initialPlayerSize)/(playerStartY - horizonLine))

      return {
        ...state,
        positionX: positionX,
        positionY: positionY,
        positionOnArray: randomPositionOnArray,
        initialSize: startingSize
      }
    } else {
      return state
    }
  }

  // PRIORITY FIX THIS IS WRONG AND NEEDS FIXING
  // ATTEMPT THIS NEXT:
  // EACH SUCCEEDING ROW OF BRICKS IS ALWAYS BIGGER BY DEPTHMULTIPLIER X DISTANCEFROMHORIZON
  howBigShouldIBe = () => {
    return (this.state.positionY - horizonLine) * ((initialPlayerSize)/(playerStartY - horizonLine))
  }

  pythagoreanHelper = (a, b) => {
    return Math.sqrt(Math.pow(a,2) + Math.pow(b,2))
  }

  progressionMagnification = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault()
      const projectedIndex = this.state.positionOnArray + (Math.trunc(this.props.movement*0.5*this.props.movementPerBrick)*9)
      const locusRangeFinder = 100
      const centerOfBricks = this.props.centersOfBricks
      .filter(brick => Math.abs(brick.x - this.state.positionX) < locusRangeFinder && Math.abs(brick.y - this.state.positionY) < locusRangeFinder)
      .sort((brick1, brick2) => {
        const distanceToBrick1 = this.pythagoreanHelper((brick1.x - this.state.positionX), (brick1.y - this.state.positionY))
        const distanceToBrick2 = this.pythagoreanHelper((brick2.x - this.state.positionX), (brick2.y - this.state.positionY))
        return distanceToBrick1 - distanceToBrick2
      })
      const refinedIndex = this.props.centersOfBricks.indexOf(centerOfBricks[0])
      const index = projectedIndex !== refinedIndex ? refinedIndex : projectedIndex
      const nextPosition = this.props.centersOfBricks[index]
      this.setState({positionX: nextPosition.x, positionY: nextPosition.y})
    }
  }

  checkForCollision = () => {
    const sizeOfSide = this.howBigShouldIBe()

    const lowerLeftTouristX = this.state.positionX
    const lowerLeftTouristY = this.state.positionY + sizeOfSide
    const lowerRightTouristX = this.state.positionX + sizeOfSide
    const upperLeftTouristY = this.state.positionY

    const upperLeftPlayerX = this.props.playerX
    const upperLeftPlayerY = this.props.playerY
    const upperRightPlayerX = this.props.playerX + initialPlayerSize
    const lowerLeftPlayerY = this.props.playerY + initialPlayerSize

    let xConditional = (lowerRightTouristX >= upperLeftPlayerX && lowerRightTouristX <= upperRightPlayerX) || (lowerLeftTouristX >= upperLeftPlayerX && lowerLeftTouristX <= upperRightPlayerX)
    let yConditional = (upperLeftPlayerY <= lowerLeftTouristY) && (lowerLeftPlayerY >= upperLeftTouristY)

    if ( xConditional && yConditional ) {
      // console.log("BUMP")
    } else {
      // console.log("NOT BUMP")
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.progressionMagnification)
    this.refs.touristImg.onload = () => {
      const sizeOfSide = this.state.initialSize
      this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
    }
    this.props.addTourist(this)
  }

  componentDidUpdate() {
    const sizeOfSide = this.howBigShouldIBe()
    this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
    this.checkForCollision()

    if (this.state.positionY) {
      if (this.state.positionY > (canvasHeight - (initialPlayerSize/2))) {
        console.log("unmount me", this.props.id)
        return null
      }
    }
  }

  render() {
    return <img src='../tourist.png' ref='touristImg' className='hidden' alt='tourist'/>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    initialPeopleSizes: state.initialPeopleSizes,
    movement: state.movement,
    playerX: state.player.xPosition,
    playerY: state.player.yPosition,
    centersOfBricks: state.centersOfBricks,
    movementPerBrick: state.movementPerBrick
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTourist: (tourist) => dispatch(addTourist(tourist))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tourist)
