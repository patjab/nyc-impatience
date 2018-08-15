import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exitStartScreen } from './actions'
import { canvasWidth, canvasHeight } from './setupData'

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n
}

class StartScreen extends Component {
  state = {
    choice: 0
  }

  userInputStartScreen = (e) => {
    if ( e.key === 'Enter' ) {
      if ( this.state.choice === 0 ) {
        this.props.exitStartScreen()
        // fix DOM manipulation
        if (!document.querySelector('#startAudio')) {
          const audioEl = document.createElement('audio')
          audioEl.setAttribute('id', 'startAudio')
          audioEl.src = './start.wav'
          audioEl.play()
        } else {
          document.querySelector('#startAudio').play()
        }
        // fix DOM manipulation
      } else if ( this.state.choice === 1 ) {
        alert("High Scores Not Available")
      } else if ( this.state.choice === 2 ) {
        alert("Information Not Available")
      }
    }

    if ( e.key === 'ArrowUp' || e.key === 'ArrowDown' ) {
      if ( e.key === 'ArrowUp' ) {
        this.setState({choice: (this.state.choice-1).mod(3)})
      } else if ( e.key === 'ArrowDown' ) {
        this.setState({choice: (this.state.choice+1).mod(3)})
      }
      // fix DOM manipulation
      if (!document.querySelector('#selectAudio')) {
        const audioEl = document.createElement('audio')
        audioEl.setAttribute('id', 'selectAudio')
        audioEl.src = './select.wav'
        audioEl.play()
      } else {
        document.querySelector('#selectAudio').play()
      }
      // fix DOM manipulation
    }

  }

  userMenu = (ctx) => {
    ctx.textAlign = 'center'
    ctx.font = "100px Impact"
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
