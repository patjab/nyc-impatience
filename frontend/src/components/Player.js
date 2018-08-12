import React, { Component } from 'react'
import { connect } from 'react-redux'

import { movePlayer, changeSpeed } from '../actions'

class Player extends Component {

  state = {
    speed: 4,
    walkingCycle: 0,
    walkingCollection: ['../player/0.png', '../player/0.png', '../player/1.png', '../player/1.png']
  }

  handleWalking = (e) => {
    if (e.keyCode === 32) {
      this.props.changeSpeed()
    }

    if (e.keyCode > 36 && e.keyCode < 41 ) {
      e.preventDefault()
      if (e.keyCode === 37 && this.props.player.xPosition - this.state.speed > 0) {
        this.props.moveLeft()
      } else if (e.keyCode === 38) {
        this.props.moveUp()
      }
      else if (e.keyCode === 39 && this.props.player.xPosition + this.state.speed + 50 < this.props.canvas.width) {
        this.props.moveRight()
      }
      else if (e.keyCode === 40 && this.props.movement > 0) {
        this.props.moveDown()
      }
      this.setState({walkingCycle: (this.state.walkingCycle+1) % this.state.walkingCollection.length})
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleWalking)

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
    movement: state.movement
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    moveUp: () => dispatch(movePlayer(0, 1)),
    moveDown: () => dispatch(movePlayer(0, -1)),
    moveLeft: () => {dispatch(movePlayer(-1, -2)); dispatch(movePlayer(-1, 2)); }, // CHEAP FIX BECAUSE SOMEHOW CHANGING MOVEMENT (X DIRECTION) IS THE ONLY WAY TO RERENDER
    moveRight: () => {dispatch(movePlayer(1, -2)); dispatch(movePlayer(0, 2)); },
    changeSpeed: () => dispatch(changeSpeed())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
