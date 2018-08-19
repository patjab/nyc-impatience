import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { canvasWidth, canvasHeight } from './setupData'

class GameOverScreen extends Component {

  componentDidMount() {
    this.refs.frozenGameOver.onload = () => {
      this.refs.gameOverCanvas.getContext("2d").drawImage(this.refs.frozenGameOver, 0, 0, canvasWidth, canvasHeight)
    }
  }

  componentDidUpdate() {
    // console.log(this.refs.gameOverCanvas)
    // console.log(this.refs.frozenGameOver)
    // if ( this.refs.gameOverCanvas && this.refs.frozenGameOver ) {
    //   this.refs.gameOverCanvas.getContext("2d").drawImage(this.refs.frozenGameOver, 0, 0, canvasWidth, canvasHeight)
    // }
  }

  render() {
    return (
      <Fragment>
        <img src={this.props.gameOverImage} alt='frozenGameOver' ref='frozenGameOver' className='hidden'/>
        <canvas width={canvasWidth} height={canvasHeight} ref='gameOverCanvas' id='gameOverCanvas'></canvas>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gameOverImage: state.gameOverImage
  }
}

export default connect(mapStateToProps)(GameOverScreen)
