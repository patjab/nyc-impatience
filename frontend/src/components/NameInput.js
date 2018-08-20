import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { canvasWidth } from '../setupData'
import { setName } from '../actions'

class NameInput extends Component {
  state = {
    nameInput: "",
    flashingBlankInterval: null
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleNameInput)
  }

  handleNameInput = (e) => {
    if ( e.keyCode >= 65 && e.keyCode <= 90 && this.state.nameInput.length < 16 ) {
      this.setState({nameInput: this.state.nameInput + e.key}, this.showNameOnScreen)
    }
    if ( e.keyCode === 8 ) {
      this.setState({nameInput: this.state.nameInput.slice(0, -1)}, this.showNameOnScreen)
    }

    if ( e.keyCode === 13 ) {
      this.props.setName(this.state.nameInput)
    }
  }

  showNameOnScreen = () => {
    const ctx = this.props.canvas.getContext("2d")

    ctx.beginPath()
    ctx.rect(100, 990, canvasWidth - (100*2), 70)
    ctx.fillStyle = "#000000"
    ctx.fill()
    // ctx.strokeStyle = '#FFFFFF'
    // ctx.lineWidth=3
    // ctx.stroke()
    ctx.closePath()

    ctx.textAlign = 'center'
    ctx.fillStyle = '#3390FF'
    ctx.font = '50px Geneva'
    ctx.fillText(this.state.nameInput, canvasWidth/2, 1045)
  }

  render() {
    return <Fragment></Fragment>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setName: (name) => dispatch(setName(name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NameInput)
