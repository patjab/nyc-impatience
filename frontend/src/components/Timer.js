import React, { Component } from 'react'
import { connect } from 'react-redux'

import { signalTimeOut } from '../actions'

import { canvasWidth, canvasHeight } from '../setupData'

class Timer extends Component {
  state = {
    time: 0
  }

  formatTime() {
    return {minutes: Math.trunc((this.state.time/100)/60), seconds: Math.trunc((this.state.time/100) % (60)), milliseconds: this.state.time % 100}
  }

  drawTimer = () => {
    const ctx = this.props.canvas ? this.props.canvas.getContext("2d") : null
    if (ctx) {
      ctx.clearRect(canvasWidth-250, 0, 300, 100)
      ctx.font = "30px Geneva"
      ctx.fillStyle = "red"
      const currentTime = this.formatTime()
      ctx.fillText(`Time: ${("0" + currentTime.minutes).slice(-2)}:${("0" + currentTime.seconds).slice(-2)}.${("0" + currentTime.milliseconds).slice(-2)}`, canvasWidth-250, 30)
    }
  }

  componentDidMount() {
    setInterval(() => this.setState({time: this.state.time + 1}), 10)
  }

  render() {
    this.drawTimer()
    return <div></div>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signalTimeOut: () => dispatch(signalTimeOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
