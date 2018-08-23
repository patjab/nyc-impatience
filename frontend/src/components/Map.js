import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { recordGameStatistics, changeCurrentScreen } from '../actions'
import { canvasWidth, canvasHeight, marginAroundStats, paddingAroundStats } from '../setupData'
import { recordHighScore } from '../adapter/adapter'

class Map extends Component {
  drawMap = (ctx) => {
    const mapMargins = 0
    const widthOfMap = canvasWidth - (mapMargins*2)
    const heightOfMap = 150
    ctx.beginPath()
    ctx.rect(mapMargins, canvasHeight - mapMargins - heightOfMap, widthOfMap, heightOfMap)
    ctx.fillStyle = "#000000"
    ctx.fill()
    ctx.closePath()


    const startOfMap = 50
    const endOfMap = canvasWidth - 50
    const yPositionOfMap = canvasHeight - 100
    ctx.beginPath()
    ctx.moveTo(startOfMap, yPositionOfMap)
    ctx.lineTo(endOfMap, yPositionOfMap)
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.closePath()


    const percentOf5000 = this.props.movement % 5000
    const lengthOfMap = (endOfMap - startOfMap)
    const pixelLengthOfCurrentProgress = (percentOf5000*lengthOfMap) / 5000
    ctx.beginPath()
    ctx.moveTo(startOfMap, yPositionOfMap)
    ctx.lineTo(startOfMap + pixelLengthOfCurrentProgress, yPositionOfMap)
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.closePath()


    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1


  }

  componentDidMount() {
    const canvas = this.props.canvas
    console.log(canvas)
    if (canvas) {
      const ctx = canvas.getContext("2d")
      this.drawMap(ctx)
    }
  }

  componentDidUpdate() {
    const canvas = this.props.canvas
    const ctx = canvas.getContext("2d")
    this.drawMap(ctx)
  }



  render() {
    return <Fragment></Fragment>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    movement: state.movement,
    player: state.player,
    mapUpdater: state.mapUpdater
  }
}

export default connect(mapStateToProps)(Map)
