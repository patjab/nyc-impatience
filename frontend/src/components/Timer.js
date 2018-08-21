import React, { Component } from 'react'
import { connect } from 'react-redux'
import { canvasWidth, statusBarHeight } from '../setupData'
import { setGameOver, setGameOverImage, recordTimeFinished } from '../actions'

class Timer extends Component {
  state = {
    time: 0,
    willBeDone: false
  }

  formatTime() {
    return {minutes: Math.trunc((this.state.time/100)/60), seconds: Math.trunc((this.state.time/100) % (60)), milliseconds: this.state.time % 100}
  }

  formatMovement() {
    return this.state.willBeDone ? `${("00000" + Math.max.apply(null, this.props.streak)).slice(-6)}` : `${("00000" + this.props.movement).slice(-6)}`
  }

  drawStatusBar = () => {
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
    ctx.textAlign = 'center'
    ctx.font = "20px Geneva"
    ctx.fillStyle = "white"
    this.state.willBeDone ? ctx.fillText(`Distance`, 90, 30) : ctx.fillText(`Distance`, 90, 30)

    ctx.font = "36px Geneva"
    ctx.fillStyle = "red"
    ctx.fillText(`${this.formatMovement()}`, 90, 70)

    ctx.font = "20px Geneva"
    ctx.fillStyle = "white"
    ctx.fillText(`Speed`, 260, 30)

    ctx.font = "36px Geneva"
    ctx.fillStyle = "red"
    const speed = Math.trunc(this.props.movement/(this.state.time/100))
    const formattedSpeed = isNaN(speed) ? '---' : speed + ' sps'
    ctx.fillText(`${formattedSpeed}`, 260, 70)
    ctx.textAlign = 'left'

  }

  drawLives = (ctx) => {
    ctx.font = "20px Geneva"
    ctx.fillStyle = "white"
    ctx.fillText(`Lives`, 425, 30)

    const spacing = 10
    let cursorCoordinateX = 375
    const cursorCoordinateY = 45
    const lifeWidth = 40
    const lifeHeight = 30

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
    if (nextProps.lives <= 0) {
      this.setState({willBeDone: true})
    }
    return true
  }

  showGameOverScreen = () => {
    const gameOverImg = this.props.canvas.toDataURL("image/png")
    this.props.setGameOverImage(gameOverImg)
  }

  componentDidUpdate() {
    if (this.props.lives === 0) {
      this.props.recordTimeFinished(this.state.time)
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
    lives: state.lives,
    streak: state.streak,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGameOver: () => dispatch(setGameOver()),
    setGameOverImage: (image) => dispatch(setGameOverImage(image)),
    recordTimeFinished: (time) => dispatch(recordTimeFinished(time))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
