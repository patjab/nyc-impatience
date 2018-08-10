import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { setThisCanvas } from '../actions'

import Path from './Path'

import Player from './Player'


class Canvas extends Component {
  canvasWidth = 750
  canvasHeight = 1334
  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight

  componentDidMount() {
    this.props.setCanvas(this.refs.playArea)
  }

  render() {
    return (
      <Fragment>
        <canvas width={this.canvasWidth} height={this.canvasHeight} ref='playArea'></canvas>
        <Path />
        <Player />
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
