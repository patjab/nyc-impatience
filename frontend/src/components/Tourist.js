import React, { Component } from 'react'
import { connect } from 'react-redux'

const Tourist = class extends Component {
  state = {
    positionX: 375-(150/2),
    positionY: 700,
    walkingCycle: 0
  }

  handleWalking = () => {
    this.setState({walkingCycle: this.state.walkingCycle % 4})
  }

  componentDidMount() {

    window.addEventListener('keydown', this.handleWalking)

    const sizeOfSide = this.props.initialPeopleSizes*this.props.progressMultiplier*this.props.backgroundMagnification
    console.log("TOURIST MOUNTED", sizeOfSide)
    this.refs.touristImg.onload = () => {
      this.props.canvas.getContext("2d").drawImage(this.refs.touristImg, this.state.positionX, this.state.positionY, sizeOfSide, sizeOfSide)
    }
  }

  componentDidUpdate() {
    const sizeOfSide = this.props.initialPeopleSizes*this.props.progressMultiplier*this.props.backgroundMagnification
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
    backgroundMagnification: state.backgroundMagnification,
    progressMultiplier: state.progressMultiplier,
    initialPeopleSizes: state.initialPeopleSizes
  }
}

export default connect(mapStateToProps)(Tourist)
