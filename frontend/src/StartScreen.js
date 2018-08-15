import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exitStartScreen } from './actions'
import { canvasWidth, canvasHeight } from './setupData'

class StartScreen extends Component {
  state = {
    choice: 0
  }

  userInputStartScreen = (e) => {
    if ( e.key === 'Enter' ) {
      if ( this.state.choice === 0 ) {
        this.props.exitStartScreen()
      } else if ( this.state.choice === 1 ) {
        alert("High Scores Not Available")
      } else if ( this.state.choice === 2 ) {
        alert("Information Not Available")
      }
    }

    if ( e.key === 'ArrowUp' ) {
      this.setState({choice: (this.state.choice-1)%3 })
    } else if ( e.key === 'ArrowDown' ) {
      this.setState({choice: (this.state.choice+1)%3 })
    }
  }

  userMenu = (ctx) => {
    ctx.textAlign = 'center'
    ctx.font = "100px Geneva"
    ctx.strokeText("New York", canvasWidth/2, canvasHeight/2 - 300)
    ctx.fillStyle = "black"
    ctx.fillText("New York", canvasWidth/2, canvasHeight/2 - 300)

    ctx.textAlign = 'center'
    ctx.font = "40px Geneva"
    ctx.fillText("Play Game", canvasWidth/2, canvasHeight/2 - 100)

    ctx.textAlign = 'center'
    ctx.font = "40px Geneva"
    ctx.fillText("High Scores", canvasWidth/2, canvasHeight/2)

    ctx.textAlign = 'center'
    ctx.font = "40px Geneva"
    ctx.fillText("Information", canvasWidth/2, canvasHeight/2 + 100)
  }

  choices = (ctx) => {
    ctx.clearRect(canvasWidth/2 - 180 - 30, canvasHeight/2 - 150, 45, 300)
    ctx.textAlign = 'center'
    ctx.strokeText(">", canvasWidth/2 - 180, (canvasHeight/2 - 100) + (this.state.choice * 100))
    ctx.fillStyle = "black"
  }

  componentDidMount() {
    window.addEventListener('keydown', this.userInputStartScreen)
    const ctx = this.refs.startScreen.getContext("2d")
    this.userMenu(ctx)
    this.choices(ctx)
  }

  componentDidUpdate() {
    const ctx = this.refs.startScreen.getContext("2d")
    this.choices(ctx)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.userInputStartScreen)
  }

  render() {
    return <canvas width={canvasWidth} height={canvasHeight} ref='startScreen'></canvas>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    exitStartScreen: () => dispatch(exitStartScreen())
  }
}

export default connect(null, mapDispatchToProps)(StartScreen)
