import React, { Component } from 'react'
import { connect } from 'react-redux'

import { movePlayer, changeSpeed } from '../actions'
import { walking, running, shiftingSpeed } from '../setupData'

class Player extends Component {
  diagonalMapSimultaneous = []
  stillHoldingUp = false
  goodForMultipleUps = false

  state = {
    speed: 4,
    walkingCycle: 0,
    walkingCollection: ['../player/0.png', '../player/0.png', '../player/1.png', '../player/1.png']
  }

  handleWalking = (e) => {
    this.diagonalMapSimultaneous[e.keyCode] = e.type === 'keydown'
    this.setState({walkingCycle: (this.state.walkingCycle+1) % this.state.walkingCollection.length})

    // REMEMBER TO FIX - MAKE SURE FUNCTION ONLY CHANGES STATE IN RESPONSE TO ARROW KEYS AND NOTHING ELSE
    this.stillHoldingUp = e.keyCode === 38 ? true : false

    const upperLeft = this.diagonalMapSimultaneous[37] && this.diagonalMapSimultaneous[38]
    const upperRight = this.diagonalMapSimultaneous[38] && this.diagonalMapSimultaneous[39]

    if ((!upperLeft && !upperRight) && (e.keyCode > 36 && e.keyCode < 41) || (e.key === 's') ) {
      e.preventDefault()
      if (e.keyCode === 37 && this.props.player.xPosition - this.state.speed > 0) { this.props.moveLeft() }
      else if (e.keyCode === 38) { this.props.moveUp() }
      else if (e.keyCode === 39 && this.props.player.xPosition + this.state.speed + 50 < this.props.canvas.width) { this.props.moveRight() }
      else if (e.keyCode === 40) { this.props.moveDown() }
      else if (e.key === 's') { this.props.movementPerBrick === walking ? this.props.changeSpeed(running) : this.props.changeSpeed(walking) }
      this.setState({walkingCycle: (this.state.walkingCycle+1) % this.state.walkingCollection.length})
    }

    upperLeft ? this.props.moveUpLeft() : (upperRight ? this.props.moveUpRight() : null)
  }

  syntheticListenerForRelease = () => {
    const syntheticConstant = 40
    setInterval(() => {
      if (this.goodForMultipleUps && this.diagonalMapSimultaneous[38] ) {
        this.props.moveUp()
        this.props.touristRoaster.forEach(tourist => tourist.progressionMagnification({keyCode: 38, preventDefault: ()=>null}))
        this.setState({walkingCycle: (this.state.walkingCycle+1) % this.state.walkingCollection.length})
      }
    }, syntheticConstant)
  }

  releaseCriteria = (e) => {
    this.diagonalMapSimultaneous[e.keyCode] = e.type === 'keydown'
    this.setState({walkingCycle: (this.state.walkingCycle+1) % this.state.walkingCollection.length})

    this.stillHoldingUp = e.key !== 'ArrowUp'
    if ( (e.key === 'ArrowLeft' && this.stillHoldingUp) || (e.key === 'ArrowRight' && this.stillHoldingUp) ) {
      this.goodForMultipleUps = true
    } else if (e.key === 'ArrowUp') {
      this.goodForMultipleUps = false
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleWalking)
    this.syntheticListenerForRelease()
    window.addEventListener('keyup', this.releaseCriteria)

    if (this.refs.playerImg && this.props.canvas && this.props.canvas.getContext("2d")) {
      this.refs.playerImg.onload = () => {
        const ctx = this.props.canvas.getContext("2d")
        ctx.drawImage(this.refs.playerImg, this.props.player.xPosition, this.props.player.yPosition, this.props.initialPeopleSizes, this.props.initialPeopleSizes)
      }
    }
  }

  componentDidUpdate() {
    this.refs.playerImg.src = this.state.walkingCollection[this.state.walkingCycle]
    this.props.canvas.getContext("2d").drawImage(this.refs.playerImg, this.props.player.xPosition, this.props.player.yPosition, this.props.initialPeopleSizes, this.props.initialPeopleSizes)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleWalking)
    window.removeEventListener('keyup', this.releaseCriteria)
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
    movementPerBrick: state.movementPerBrick,
    touristRoaster: state.touristRoaster
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    moveUp: () => dispatch(movePlayer(0, 1)),
    moveDown: () => dispatch(movePlayer(0, -1)),
    moveLeft: () => {dispatch(movePlayer(-shiftingSpeed, -0.5)); dispatch(movePlayer(0, 0.5)); }, // CHEAP FIX BECAUSE SOMEHOW CHANGING MOVEMENT (X DIRECTION) IS THE ONLY WAY TO RERENDER
    moveRight: () => {dispatch(movePlayer(shiftingSpeed, -0.5)); dispatch(movePlayer(0, 0.5)); },
    moveUpLeft: () => dispatch(movePlayer(-shiftingSpeed, 1)),
    moveUpRight: () => dispatch(movePlayer(shiftingSpeed, 1)),
    changeSpeed: (speed) => dispatch(changeSpeed(speed))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
