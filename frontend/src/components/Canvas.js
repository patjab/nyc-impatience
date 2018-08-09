import React, { Component } from 'react'

import { connect } from 'react-redux'
import { setThisCanvas } from '../actions'

class Canvas extends Component {
  canvasWidth = 750
  canvasHeight = 1334


  componentDidMount() {
    this.props.setCanvas(this.refs.playArea)
  }

  render() {
    return (
      <canvas width={this.canvasWidth} height={this.canvasHeight} ref='playArea'></canvas>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas))
  }
}

export default connect(null, mapDispatchToProps)(Canvas)
