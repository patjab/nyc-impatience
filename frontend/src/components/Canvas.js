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
        <canvas width={canvasWidth} height={canvasHeight} ref='playArea'></canvas>
        <Path />
        <Player />
        {this.renderTourists(5)}
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
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
