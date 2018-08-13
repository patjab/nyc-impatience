import React, { Component } from 'react'
import { connect } from 'react-redux'

import { horizonLine, initialPlayerSize, playerStartY, canvasWidth } from '../setupData'

const Tourist = class extends Component {
  state = {
    positionX: canvasWidth/2,
    positionY: horizonLine+1,
    walkingCycle: 0
  }

  mysteryCoefficient = 150/784

  // PRIORITY FIX THIS IS WRONG AND NEEDS FIXING
  // ATTEMPT THIS NEXT:
  // EACH SUCCEEDING ROW OF BRICKS IS ALWAYS BIGGER BY DEPTHMULTIPLIER X DISTANCEFROMHORIZON
  howBigShouldIBe = () => {
    return (this.state.positionY - horizonLine) * ((initialPlayerSize)/(playerStartY - horizonLine))
  }

  progressionMagnification = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault()
      if (e.keyCode === 38 ) {
        this.setState({positionY: this.state.positionY+1})
      } else if (e.keyCode === 40) {
        this.setState({positionY: this.state.positionY-1})
      }
    }
    // else {
    //   // this.setState({walkingCycle: this.state.walkingCycle % 4}) // CHEAP FIX force component to rerender so that it may access componentDidUpdate's characteristics of increasing/decreasing
    // }

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
      console.log("BUMP")
    } else {
      console.log("NOT BUMP")
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.progressionMagnification)
    // const sizeOfSide = this.props.initialPeopleSizes*this.props.movement*this.mysteryCoefficient
    const sizeOfSide = this.howBigShouldIBe()
    this.refs.touristImg.onload = () => {
      this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
    }
  }

  componentDidUpdate() {
    // const sizeOfSide = this.props.initialPeopleSizes*this.props.movement*this.mysteryCoefficient
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
    playerY: state.player.yPosition
  }
}

export default connect(mapStateToProps)(Tourist)
