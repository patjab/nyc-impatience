import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { setThisCanvas, emptyGarbageOfTourists } from '../actions'
import { touristDensity } from '../setupData'

import Path from './Path'
import Player from './Player'
import Tourist from './Tourist'
import Timer from './Timer'

import { canvasWidth, canvasHeight } from '../setupData'

class Canvas extends Component {
  somethingDimensions = 483
  componentDidUpdate() {
    this.refs.playArea.getContext("2d").drawImage(this.refs.nySkyline, -40, 0, canvasWidth+70, this.somethingDimensions)
    if ( this.props.garbageOfTourists.length === touristDensity ) {
      this.props.emptyGarbageOfTourists()
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      if (!document.querySelector("#backgroundMusic")) {
        const backgroundMusicEl = document.createElement("audio")
        backgroundMusicEl.setAttribute("id", "backgroundMusic")
        backgroundMusicEl.src = '../backgroundMusic.mp3'
        document.head.appendChild(backgroundMusicEl)
        backgroundMusicEl.play()
      }
    })

    this.props.setCanvas(this.refs.playArea)
    this.refs.nySkyline.onload = () => {
      this.refs.playArea.getContext("2d").drawImage(this.refs.nySkyline, -40, 0, canvasWidth+70, this.somethingDimensions)
    }

  }

  renderTourists = (numberOfTourists) => {
    let tourists = []
    for ( let i = 0; i < numberOfTourists; i++ ) {
      if ( !this.props.garbageOfTourists.includes(i) ) {
        tourists.push(<Tourist key={i} id={i} />)
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
        <Player />
        {this.renderTourists(touristDensity)}
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    garbageOfTourists: state.garbageOfTourists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas)),
    emptyGarbageOfTourists: () => dispatch(emptyGarbageOfTourists())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
