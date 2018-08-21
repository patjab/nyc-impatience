import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { setThisCanvas } from '../actions'
import { loudnessSpookLevel, loudnessRechargeInSeconds, canvasWidth, canvasHeight, backgroundMusicOn } from '../setupData'
import { microphoneRunner, loudEnough } from '../mediaHelper/microphoneHelper'

import GameStatistics from './GameStatistics'
import GamePlayScreen from './GamePlayScreen'

class Canvas extends Component {
  state = {
    playerYelled: false,
    scaredTouristListener: null,
    hasPlayedYell: false,
    doneGreyscale: false
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

  componentDidUpdate() {
    if (this.props.lives === 0) {
      this.refs.backgroundMusic.pause()
    }
  }

  render() {
    return (
      <Fragment>
        <audio src='../backgroundMusic.mp3' loop='true' ref='backgroundMusic'/ >
        <canvas width={canvasWidth} height={canvasHeight} ref='playArea' id='playArea' className={this.props.bumpingShake ? 'bumpingShake' : null}></canvas>
        { this.props.timeFinished === null ? <GamePlayScreen /> : <GameStatistics/> }
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    garbageOfTourists: state.garbageOfTourists,
    lives: state.lives,
    touristRoaster: state.touristRoaster,
    stage: state.stage,
    bumpingShake: state.bumpingShake,
    timeFinished: state.timeFinished
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
