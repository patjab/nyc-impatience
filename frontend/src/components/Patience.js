import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { canvasWidth, statusBarHeight, initialPatience } from '../setupData'
import { setGameOver, setGameOverImage, recordTimeFinished } from '../actions'

class Patience extends Component {

  // componentDidMount() {
  //   const canvas = this.props.canvas
  //   const ctx = canvas.getContext("2d")
  //   if (canvas) {
  //     this.drawLivesMeter(ctx)
  //   }
  // }

  componentDidUpdate() {
    const canvas = this.props.canvas
    const ctx = canvas.getContext("2d")
    if (canvas) {
      this.drawLivesMeter(ctx)
    }
  }

  formatPercentage = () => {
    if (Math.round(this.props.patience * 10000/initialPatience) / 100 > 99.4) {
      return 100
    } else if (Math.round(this.props.patience * 10000/initialPatience) / 100 < 0) {
      return 0
    } else {
      return Math.round(this.props.patience * 10000/initialPatience) / 100
    }
  }

  drawLivesMeter = (ctx) => {
    ctx.clearRect(canvasWidth*0.30, 0, canvasWidth*0.40, statusBarHeight)
    ctx.fillStyle = 'black'
    ctx.fillRect(canvasWidth*0.30, 0, canvasWidth*0.40, statusBarHeight)

    ctx.font = "20px Geneva"
    ctx.fillStyle = "white"
    ctx.textAlign = 'center'
    ctx.fillText(`Patience`, canvasWidth/2, 30)

    ctx.beginPath()
    ctx.fillStyle = "grey"
    ctx.fillRect(250, 40, initialPatience, 30)
    ctx.closePath()

    ctx.beginPath()

    if (this.formatPercentage() > 50) {
      ctx.fillStyle = "green"
    } else if (this.formatPercentage() < 50 && this.formatPercentage() >= 25) {
      ctx.fillStyle = "yellow"
    } else {
      ctx.fillStyle = "red"
    }
    
    ctx.fillRect(250, 40, this.props.patience, 30)
    ctx.closePath()
    ctx.fillStyle = "white"
    ctx.fillText(`${this.formatPercentage()}%`, canvasWidth/2, 62)

    // ctx.fillStyle = "white"
    // ctx.fillText(`${Math.round(this.props.patience * 10000/initialPatience) / 100}%`, canvasWidth/2, 62)

  }

  render() {
    return <Fragment></Fragment>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    lives: state.lives,
    patience: state.patience
  }
}

export default connect(mapStateToProps)(Patience)
