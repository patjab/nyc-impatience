import React, { Component } from 'react'
import { connect } from 'react-redux'

import { horizonLine, initialPlayerSize, playerStartY, canvasWidth, depthCoefficient } from '../setupData'

const Tourist = class extends Component {
  brickSpacingBetweenRows = 1 // MAYBE should be in some form of state
  depthMultiplier = depthCoefficient
  horizonPosition = horizonLine
  brickPerMovement = 0.10
  blueParrotInTheSky = 0

  state = {
    positionX: canvasWidth/2,
    walkingCycle: 0,
    positionOnArray: 0,
    previousPositionY: -1
  }

  mysteryCoefficient = 150/784

  truncate = (number, decimalPlaces = 0) => {
    return Math.trunc(number*Math.pow(10, decimalPlaces))/Math.pow(10, decimalPlaces)
  }

  // PRIORITY FIX THIS IS WRONG AND NEEDS FIXING
  // ATTEMPT THIS NEXT:
  // EACH SUCCEEDING ROW OF BRICKS IS ALWAYS BIGGER BY DEPTHMULTIPLIER X DISTANCEFROMHORIZON
  howBigShouldIBe = () => {
    return (this.props.rowsWithBrickBorders[this.state.positionOnArray] - horizonLine) * ((initialPlayerSize)/(playerStartY - horizonLine))
  }

  progressionMagnification = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault()
      if (e.keyCode === 38 ) {
        if (this.blueParrotInTheSky % 20 === 0) {
          this.setState({positionOnArray: this.state.positionOnArray+1})
        }

      } else if (e.keyCode === 40) {
        this.setState({positionOnArray: this.state.positionOnArray-1})
      }
    }

  }

  // FIX: LATER JUST CHANGE FOR LEG COLLISION INSTEAD OF FULL SQUARE COLLISION
  checkForCollision = () => {
    const sizeOfSide = this.howBigShouldIBe()
    const positionY = this.props.rowsWithBrickBorders[this.state.positionOnArray]

    const lowerLeftTouristX = this.state.positionX
    const lowerLeftTouristY = positionY + sizeOfSide
    const lowerRightTouristX = this.state.positionX + sizeOfSide
    const upperLeftTouristY = positionY

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
    const sizeOfSide = this.howBigShouldIBe()
    this.refs.touristImg.onload = () => {
      this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.props.rowsWithBrickBorders[this.state.positionOnArray], sizeOfSide, sizeOfSide)
    }
  }

  componentDidUpdate() {
    const sizeOfSide = this.howBigShouldIBe()
    const positionY = this.props.rowsWithBrickBorders[this.state.positionOnArray]

    this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, positionY, sizeOfSide, sizeOfSide)
    this.checkForCollision()
  }

  render() {
    // console.log(this.props.rowsWithBrickBorders)
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
    rowsWithBrickBorders: state.brickRowList
  }
}

export default connect(mapStateToProps)(Tourist)
