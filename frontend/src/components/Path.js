import React, { Component } from 'react'
import { connect } from 'react-redux'

class Path extends Component {
  horizonPosition = 400
  brickSpacing = 1
  depthMultiplier = 1.1

  drawPathBackground = (ctx) => {
    ctx.rect(0, this.horizonPosition, this.props.canvas.width, this.props.canvas.height)
    ctx.fillStyle = '#CBCBCB'
    ctx.fill()
  }

  makeBricks = (ctx) => {
    const centralX = this.props.canvas.width/2
    const centralY = this.props.canvas.height/2

    for ( let row = this.horizonPosition; row < this.props.canvas.height; row += this.brickSpacing ) {
      ctx.beginPath()
      ctx.moveTo(0, row)
      ctx.lineTo(this.props.canvas.width, row)
      ctx.stroke()
      this.brickSpacing *= this.depthMultiplier
    }

    for ( let diagonal = 0; diagonal <= this.props.canvas.width; diagonal+=50 ) {
      ctx.beginPath()
      ctx.moveTo(centralX, this.horizonPosition)
      ctx.lineTo(diagonal, this.props.canvas.height)
      ctx.stroke()
    }
  }

  makeSideStructures = (ctx) => {
    const centralX = this.props.canvas.width/2
    const centralY = this.props.canvas.height/2

    const sideStructuresColor = '#0CBE00'

    ctx.beginPath()
    ctx.moveTo(0, this.props.canvas.height)
    ctx.lineTo(centralX, this.horizonPosition)
    ctx.lineTo(0, this.horizonPosition)
    // ctx.fillStyle = sideStructuresColor
    // ctx.fill()
    // ctx.stroke()
    // ctx.closePath()
    //
    // ctx.beginPath()
    ctx.moveTo(this.props.canvas.width, this.props.canvas.height)
    ctx.lineTo(centralX, this.horizonPosition)
    ctx.lineTo(this.props.canvas.width, this.horizonPosition)
    ctx.fillStyle = sideStructuresColor
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  }

  render() {
    const ctx = this.props.canvas && this.props.canvas.getContext("2d")
    if (ctx) {
      this.drawPathBackground(ctx)
      this.makeBricks(ctx)
      this.makeSideStructures(ctx)
    }
    return <div></div>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas
  }
}

export default connect(mapStateToProps)(Path)
