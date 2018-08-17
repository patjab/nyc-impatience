import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { setThisCanvas, emptyGarbageOfTourists } from '../actions'
import { touristDensity, movementsPerStage } from '../setupData'

import Path from './Path'
import Player from './Player'
import Tourist from './Tourist'
import Timer from './Timer'

import { canvasWidth, canvasHeight } from '../setupData'

class Canvas extends Component {
  somethingDimensions = 483
  componentDidUpdate() {
    console.log("CANVAS DID UPDATE")
    this.refs.playArea.getContext("2d").drawImage(this.refs.nySkyline, -40, 0, canvasWidth+70, this.somethingDimensions)
  }

  backgroundMusicStart = (e) => {
    if ( e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (!document.querySelector("#backgroundMusic")) {
        const backgroundMusicEl = document.createElement("audio")
        backgroundMusicEl.setAttribute("id", "backgroundMusic")
        backgroundMusicEl.setAttribute("loop", "true")
        backgroundMusicEl.src = '../backgroundMusic.mp3'
        document.head.appendChild(backgroundMusicEl)
        backgroundMusicEl.play()
      } else {
        document.querySelector("backgroundMusic").play()
      }
      window.removeEventListener('keydown', this.backgroundMusicStart)
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.backgroundMusicStart)

    this.props.setCanvas(this.refs.playArea)
    this.refs.nySkyline.onload = () => {
      this.refs.playArea.getContext("2d").drawImage(this.refs.nySkyline, -40, 0, canvasWidth+70, this.somethingDimensions)
    }

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
        <img src='../nyBackground.png' ref='nySkyline' className='hidden' alt='nySkyline'/>
        <canvas width={canvasWidth} height={canvasHeight} ref='playArea'></canvas>
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
    stage: state.stage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas)),
    emptyGarbageOfTourists: () => dispatch(emptyGarbageOfTourists())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
