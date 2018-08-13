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
      tourists.push(<Tourist key={i} id={i} />)
    }
    return tourists
  }

  // renderTouristsWithCheck = (numberOfTourists) => {
  //   const stillMounted = []
  //   const touristsColl = this.renderTourists(numberOfTourists)
  //   for ( let tourist1 of touristsColl) {
  //     console.log(this.props)
  //     if ( this.props.currentTourists.map(tourist2 => tourist2.props.id).includes(tourist1.props.id) ) {
  //       stillMounted.push(tourist1)
  //     }
  //   }
  //   console.log(stillMounted)
  //   return stillMounted
  // }


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
    currentTourists: state.currentTourists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
