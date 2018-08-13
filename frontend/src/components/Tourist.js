import React, { Component } from 'react'
import { connect } from 'react-redux'

import { horizonLine, initialPlayerSize, playerStartY, canvasWidth } from '../setupData'

const Tourist = class extends Component {
  state = {
    positionX: canvasWidth/2,
    positionY: horizonLine,
    positionOnArray: 2,
    progressionMagnificatonTemp: 0,
    // positionY: horizonLine+(Math.trunc(Math.random()*500)),
    walkingCycle: 0
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
    const sizeOfSide = this.howBigShouldIBe()
    this.refs.touristImg.onload = () => {
      this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
    }
  }

  componentDidUpdate() {
    const sizeOfSide = this.howBigShouldIBe()
    this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)

    this.checkForCollision()
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

export default connect(mapStateToProps)(Tourist)
