import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { setThisCanvas } from '../actions'

import Path from './Path'
import Player from './Player'
import Tourist from './Tourist'

import { canvasWidth, canvasHeight, horizonLine } from '../setupData'


class Canvas extends Component {

  componentDidMount() {
    this.props.setCanvas(this.refs.playArea)
  }

  renderTourists = (numberOfTourists) => {
    const xCenter = this.refs.playArea/2
    let tourists = []
    for ( let i = 0; i < numberOfTourists; i++ ) {
      tourists.push(<Tourist xPos={xCenter} yPos={horizonLine+1+(Math.random()*(canvasHeight-horizonLine-1))} key={i}/>)
    }
    return tourists
  }

  render() {
    return (
      <Fragment>
        <canvas width={canvasWidth} height={canvasHeight} ref='playArea'></canvas>
        <Path />
        <Player />
        {this.renderTourists(5)}
      </Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas))
  }
}

export default connect(null, mapDispatchToProps)(Canvas)
