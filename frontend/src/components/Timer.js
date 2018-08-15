import React, { Component } from 'react'
import { connect } from 'react-redux'

import { signalTimeOut } from '../actions'

import { canvasHeight, canvasWidth } from '../setupData'

class Timer extends Component {
  state = {
    time: 0,
    level: 1,
    willBeDone: false
  }

  formatTime() {
    return {minutes: Math.trunc((this.state.time/100)/60), seconds: Math.trunc((this.state.time/100) % (60)), milliseconds: this.state.time % 100}
  }

  formatMovement() {
    return `${("00000" + this.props.movement).slice(-6)}`
  }

  drawStatusBar = () => {
    const statusBarHeight = 100

    const ctx = this.props.canvas ? this.props.canvas.getContext("2d") : null
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, statusBarHeight)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvasWidth, statusBarHeight)

      this.drawLives(ctx)
      this.drawStepsCounter(ctx)
      this.drawTime(ctx)
    }
  }

  drawTime = (ctx) => {
    const currentTime = this.formatTime()

    ctx.font = "20px Geneva"
    ctx.fillStyle = "white"
    ctx.fillText(`Time`, canvasWidth-140, 30)

    ctx.font = "36px Geneva"
    ctx.fillStyle = "red"
    ctx.fillText(`${("0" + currentTime.minutes).slice(-2)}:${("0" + currentTime.seconds).slice(-2)}.${("0" + currentTime.milliseconds).slice(-2)}`, canvasWidth-200, 70)
  }

  drawStepsCounter = (ctx) => {
    ctx.font = "20px Geneva"
    ctx.fillStyle = "white"
    ctx.fillText(`Steps Without Crashing`, 20, 30)

    ctx.font = "36px Geneva"
    ctx.fillStyle = "red"
    ctx.fillText(`${this.formatMovement()}`, 60, 70)
  }

  drawLives = (ctx) => {
    ctx.font = "20px Geneva"
    ctx.fillStyle = "white"
    ctx.fillText(`Lives`, 375, 30)

    const spacing = 10
    let cursorCoordinateX = 290
    const cursorCoordinateY = 45
    const lifeWidth = 60
    const lifeHeight = 40

    for ( let i = 0; i < this.props.lives; i++ ) {
      this.props.canvas.getContext("2d").drawImage(this.refs.lifeSymbol, cursorCoordinateX, cursorCoordinateY, lifeWidth, lifeHeight)
      cursorCoordinateX += spacing + lifeWidth
    }
  }

  incrementTime = (e) => {
    if ( e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setInterval(() => this.setState({time: this.state.time + 1}), 10)
      window.removeEventListener('keydown', this.incrementTime)
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.incrementTime)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.willBeDone) { return false }
    if (nextProps.lives <= 0) { this.setState({willBeDone: true}) }
    return true
  }

  showGameOverScreen = () => {
    const ctx = this.props.canvas.getContext("2d")
    ctx.font = "200px Geneva"
    ctx.fillStyle = "red"
    ctx.textAlign = 'center'
    ctx.fillText(`GAME`, canvasWidth/2, canvasHeight/2 - 110)
    ctx.fillText(`OVER`, canvasWidth/2, canvasHeight/2 + 110)
    ctx.textAlign = 'left'
  }

  componentDidUpdate() {
    if (this.props.lives === 0) {
      window.addEventListener('keydown', (e) => e.stopPropagation(), true)
      window.addEventListener('keyup', (e) => e.stopPropagation(), true)
      this.showGameOverScreen()
    }
  }

  render() {
    this.drawStatusBar()
    return <img src='../life.png' ref='lifeSymbol' className='hidden' alt='lifeSymbol'/>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    movement: state.movement,
    lives: state.lives
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signalTimeOut: () => dispatch(signalTimeOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
