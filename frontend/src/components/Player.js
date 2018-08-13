import React, { Component } from 'react'
import { connect } from 'react-redux'

import { movePlayer, changeSpeed } from '../actions'
import { walking, running, shiftingSpeed } from '../setupData'

class Player extends Component {

  state = {
    speed: 4,
    walkingCycle: 0,
    walkingCollection: ['../player/0.png', '../player/0.png', '../player/1.png', '../player/1.png']
  }

  handleWalking = (e) => {
    const upperLeft = this.diagonalMap[37] && this.diagonalMap[38]
    const upperRight= this.diagonalMap[38] && this.diagonalMap[39]

    if ((!upperLeft && !upperRight) && (e.keyCode > 36 && e.keyCode < 41) || (e.key === 's') ) {
      e.preventDefault()
      if (e.keyCode === 37 && this.props.player.xPosition - this.state.speed > 0) { this.props.moveLeft() }
      else if (e.keyCode === 38) { this.props.moveUp() }
      else if (e.keyCode === 39 && this.props.player.xPosition + this.state.speed + 50 < this.props.canvas.width) { this.props.moveRight() }
      else if (e.keyCode === 40) { this.props.moveDown() }
      else if (e.key === 's') { this.props.movementPerBrick === walking ? this.props.changeSpeed(running) : this.props.changeSpeed(walking) }
      this.setState({walkingCycle: (this.state.walkingCycle+1) % this.state.walkingCollection.length})
    }

    if ( upperLeft ) {
      this.props.moveUpLeft()
    } else if ( upperRight ) {
      this.props.moveUpRight()
    }
  }

  diagonalMap = []
  handleDiagonalWalking = (e) => {
    this.diagonalMap[e.keyCode] = e.type === 'keydown'
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleWalking)

    // FIX merge the event listeners
    window.addEventListener('keydown', this.handleDiagonalWalking)
    window.addEventListener('keyup', this.handleDiagonalWalking)


    this.refs.playerImg.onload = () => {
      const ctx = this.props.canvas.getContext("2d")
      ctx.drawImage(this.refs.playerImg, this.props.player.xPosition, this.props.player.yPosition, this.props.initialPeopleSizes, this.props.initialPeopleSizes)
    }
  }

  componentDidUpdate() {
    this.refs.playerImg.src = this.state.walkingCollection[this.state.walkingCycle]
    this.props.canvas.getContext("2d").drawImage(this.refs.playerImg, this.props.player.xPosition, this.props.player.yPosition, this.props.initialPeopleSizes, this.props.initialPeopleSizes)
  }

  render() {
    const currentImageSrc = this.state.walkingCollection[this.state.walkingCycle]
    return (
      <img src={currentImageSrc} ref='playerImg' className='hidden' alt='player'/>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    player: state.player,
    initialPeopleSizes: state.initialPeopleSizes,
    movementPerBrick: state.movementPerBrick
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    moveUp: () => dispatch(movePlayer(0, 1)),
    moveDown: () => dispatch(movePlayer(0, -1)),
    moveLeft: () => {dispatch(movePlayer(-shiftingSpeed, 0)); dispatch(movePlayer(0, 2)); }, // CHEAP FIX BECAUSE SOMEHOW CHANGING MOVEMENT (X DIRECTION) IS THE ONLY WAY TO RERENDER
    moveRight: () => {dispatch(movePlayer(shiftingSpeed, 0)); dispatch(movePlayer(0, 2)); },
    moveUpLeft: () => dispatch(movePlayer(-shiftingSpeed, 1)),
    moveUpRight: () => dispatch(movePlayer(shiftingSpeed, 1)),
    changeSpeed: (speed) => dispatch(changeSpeed(speed))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
