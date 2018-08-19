import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { setThisCanvas, emptyGarbageOfTourists } from '../actions'
import { touristDensity, loudnessSpookLevel, loudnessRechargeInSeconds, canvasWidth, canvasHeight  } from '../setupData'
import { microphoneRunner, loudEnough } from '../mediaHelper/microphoneHelper.js'

import Path from './Path'
import Player from './Player'
import Tourist from './Tourist'
import Timer from './Timer'

class Canvas extends Component {

  state = {
    playerYelled: false,
    scaredTouristListener: null
  }

  skylineWidth = canvasWidth+70
  skylineHeight = 483
  skylineStartX = -40
  skylineStartY = 0
  componentDidUpdate() {
    this.refs.playArea.getContext("2d").drawImage(this.refs.nySkyline, this.skylineStartX, this.skylineStartY, this.skylineWidth, this.skylineHeight)
  }

  backgroundMusicStart = (e) => {
    if ( e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      this.refs.backgroundMusic.play()
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
    this.refs.nySkyline.onload = () => {
      this.refs.playArea.getContext("2d").drawImage(this.refs.nySkyline, this.skylineStartX, this.skylineStartY, this.skylineWidth, this.skylineHeight)
    }
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
        <img src='../nyBackground.png' ref='nySkyline' className='hidden' alt='nySkyline'/>
        {
          this.props.bumpingShake ?
          <canvas width={canvasWidth} height={canvasHeight} ref='playArea' id='playArea' className="bumpingShake"></canvas>
          :
          <canvas width={canvasWidth} height={canvasHeight} ref='playArea' id='playArea'></canvas>
        }
        <Timer />
        <Path />
        {this.props.lives !== 0 ? <Player /> : null}
        {this.renderTourists(touristDensity)}
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
    bumpingShake: state.bumpingShake
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas)),
    emptyGarbageOfTourists: () => dispatch(emptyGarbageOfTourists())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
