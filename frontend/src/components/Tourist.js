import React, { Component } from 'react'
import { connect } from 'react-redux'

const Tourist = class extends Component {
  state = {
    positionX: 375-(150/2),
    positionY: 700,
    walkingCycle: 0
  }

  mysteryCoefficient = 0.01

  progressionMagnification = () => {
    this.setState({walkingCycle: this.state.walkingCycle % 4}) // CHEAP FIX force component to rerender so that it may access componentDidUpdate's characteristics of increasing/decreasing
  }

  componentDidMount() {
    window.addEventListener('keydown', this.progressionMagnification)
    const sizeOfSide = this.props.initialPeopleSizes*this.props.movement*this.mysteryCoefficient
    console.log("TOURIST MOUNTED", sizeOfSide)
    this.refs.touristImg.onload = () => {
      this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
    }
  }

  componentDidUpdate() {
    const sizeOfSide = this.props.initialPeopleSizes*this.props.movement*this.mysteryCoefficient
    this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
    console.log("TOURIST UPDATED", this.props.canvas.getContext("2d"), this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide)
  }

  render() {
    return <img src='../tourist.png' ref='touristImg' className='hidden'/>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    initialPeopleSizes: state.initialPeopleSizes,
    movement: state.movement
  }
}

export default connect(mapStateToProps)(Tourist)
