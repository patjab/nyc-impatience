import React, { Component } from 'react'
import { connect } from 'react-redux'

import { horizonLine, initialPlayerSize, depthCoefficient, playerStartX, playerStartY, canvasWidth, canvasHeight } from '../setupData'

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
    } else {
      this.setState({walkingCycle: this.state.walkingCycle % 4}) // CHEAP FIX force component to rerender so that it may access componentDidUpdate's characteristics of increasing/decreasing
    }

  }

  checkForCollision = () => {
    const sizeOfSide = this.howBigShouldIBe()
    let xConditional = this.state.positionX > this.props.playerX && this.state.positionX + sizeOfSide < this.props.playerX
    let yConditional = this.state.positionY > this.props.playerY && this.state.positionY + sizeOfSide < this.props.playerY

    console.log("TOURIST X ", this.state.positionX)
    console.log("TOURIST Y ", this.state.positionY)
    console.log("PLAYER X ", this.props.playerX)
    console.log("PLAYER Y ", this.props.playerY)

    console.log(xConditional)
    console.log(yConditional)  
    console.log(sizeOfSide)

    if ( xConditional && yConditional ) {
      alert("BUMP")
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.progressionMagnification)
    console.log('event listener attached?')
    // const sizeOfSide = this.props.initialPeopleSizes*this.props.movement*this.mysteryCoefficient
    const sizeOfSide = this.howBigShouldIBe()
    console.log(sizeOfSide, this.state.positionX, this.state.positionY)
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
