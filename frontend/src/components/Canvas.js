import React, { Component } from 'react'

import { connect } from 'react-redux'
import { setThisCanvas } from '../actions'

class Canvas extends Component {
  componentDidMount() {
    this.props.setCanvas(this.refs.playArea)
    // const styling =
    // `background: url('../timesSquare.jpg');
    // background-size: 1000px 1000px;
    // background-position: top;
    // background-repeat: no-repeat;
    // background-color: black;`
    // this.refs.playArea.style = styling

  }

  render() {
    return (
      <canvas width='750' height='1334' ref='playArea'></canvas>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas))
  }
}

export default connect(null, mapDispatchToProps)(Canvas)
