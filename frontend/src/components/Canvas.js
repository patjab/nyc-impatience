import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { setThisCanvas } from '../actions'

import Path from './Path'
import Player from './Player'
import Tourist from './Tourist'

import { canvasWidth, canvasHeight } from '../setupData'


class Canvas extends Component {

  componentDidMount() {
    this.props.setCanvas(this.refs.playArea)
  }

  render() {
    return (
      <Fragment>
        <canvas width={canvasWidth} height={canvasHeight} ref='playArea'></canvas>
        <Path />
        <Player />
        <Tourist />
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
