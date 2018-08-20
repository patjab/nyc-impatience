import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { setThisCanvas, emptyGarbageOfTourists } from '../actions'
import { touristDensity, loudnessSpookLevel, loudnessRechargeInSeconds, canvasWidth, canvasHeight, backgroundMusicOn  } from '../setupData'
import { microphoneRunner, loudEnough } from '../mediaHelper/microphoneHelper.js'

import Path from './Path'
import Player from './Player'
import Tourist from './Tourist'
import Timer from './Timer'
import GameOverScreen from '../GameOverScreen'

class Canvas extends Component {

  state = {
    playerYelled: false,
    scaredTouristListener: null,
    hasPlayedYell: false
  }


  componentDidUpdate() {
    if (this.props.lives <= 0) {
      this.refs.backgroundMusic.pause()

      if ( !this.state.hasPlayedYell ) {
        this.refs.losingScream.play()
        this.setState({hasPlayedYell: true})
      }

      this.refs.gameOverMusic.play()
      this.refs.frozenGameOverScreen.onload = () => {
        this.refs.playArea.getContext("2d").drawImage(this.refs.frozenGameOverScreen, 0, 0, canvasWidth, canvasHeight)
        // this.refs.playArea.getContext("2d").clearRect(0, 0, canvasWidth, canvasHeight)

        console.log("GREY")
        let context = this.refs.playArea.getContext("2d")
        let canvas = this.refs.playArea
        this.grayScale(context, canvas)

        //add the function call in the imageObj.onload
        this.refs.frozenGameOverScreen.onload = () => {
            context.drawImage(this.refs.frozenGameOverScreen, 0, 0);
            this.grayScale(context, canvas);
        }

      }
    }
  }

  grayScale(context, canvas) {
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imgData.data

    let i = 0
    const pixelInterval = setInterval(() => {

        if ( i >= pixels.length ) {
          clearInterval(pixelInterval)
        } else {
          for ( let n = 0; n < 750*4; n+= 4 ) {
            const changeRed = 0.30
            const changeGreen = 0.60
            const changeBlue = 0.10
            const grayscale = (pixels[i] * changeRed) + (pixels[i+1] * changeGreen) + (pixels[i+2] * changeBlue)
            pixels[i] = grayscale        // red
            pixels[i+1] = grayscale        // green
            pixels[i+2] = grayscale        // blue
            i+= 4
          }
          context.putImageData(imgData, 0, 0)
        }

    }, 1)
  }


  backgroundMusicStart = (e) => {
    if ( e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if ( backgroundMusicOn ) {
        this.refs.backgroundMusic.play()
      }
      window.removeEventListener('keydown', this.backgroundMusicStart)
    }
  }

  scaredTouristListener = () => {
    microphoneRunner(loudnessSpookLevel)
    return setInterval( () => {
      if (loudEnough && !this.state.playerYelled ) {
        this.setState({playerYelled: true}, () => {
          for ( let tourist of this.props.touristRoaster ) {
            tourist.runningAnimation()
          }
          setTimeout( () => {
            this.setState({playerYelled: false})
          }, loudnessRechargeInSeconds * 1000)
        })
      }
    }, 1)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.backgroundMusicStart)
    const scaredTouristListener = this.scaredTouristListener()
    this.setState({scaredTouristListener: scaredTouristListener})
    this.props.setCanvas(this.refs.playArea)
  }

  componentWillUnmount() {
    clearInterval(this.state.scaredTouristListener)
  }

  renderTourists = (numberOfTourists) => {
    let tourists = []
    if (this.props.lives > 0) {
      for ( let i = 0; i < (numberOfTourists+this.props.stage); i++ ) {
        if ( !this.props.garbageOfTourists.includes(i) ) {
          tourists.push(<Tourist key={i} id={i} />)
        }
        else {
          numberOfTourists++
        }
      }
    }
    return tourists
  }

  render() {
    return (
      <Fragment>
        <audio src='../backgroundMusic.mp3' loop='true' ref='backgroundMusic'/ >
        <audio src='../gameOver.mp3' loop='true' ref='gameOverMusic'/ >
        <audio src='../losingScream.wav' ref='losingScream'/ >
        <Timer />
        <canvas width={canvasWidth} height={canvasHeight} ref='playArea' id='playArea' className={this.props.bumpingShake ? 'bumpingShake' : null}></canvas>
        { this.props.lives > 0 ?
          <Fragment>
            <Path />
            {this.renderTourists(touristDensity)}
            <Player />
          </Fragment>
          :
          <img src={this.props.gameOverImage} alt='frozenGameOverScreen' ref='frozenGameOverScreen' className='hidden'/>
        }
      </Fragment>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    garbageOfTourists: state.garbageOfTourists,
    lives: state.lives,
    touristRoaster: state.touristRoaster,
    stage: state.stage,
    bumpingShake: state.bumpingShake,
    gameOverImage: state.gameOverImage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas)),
    emptyGarbageOfTourists: () => dispatch(emptyGarbageOfTourists())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
