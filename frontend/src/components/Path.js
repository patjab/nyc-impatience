import React, { Component } from 'react'
import { connect } from 'react-redux'

class Path extends Component {
  horizonPosition = 400
  brickSpacingBetweenColAtEnd = 50
  brickSpacingBetweenRows = 1
  initialBrickSpacingBetweenRows = 1
  depthMultiplier = 1.1
  numOfBricksInARow = 10

  state = {
    movement: 0
  }

  drawPathBackground = (ctx) => {
    ctx.rect(0, this.horizonPosition, this.props.canvas.width, this.props.canvas.height)
    ctx.fillStyle = '#CBCBCB'
    ctx.fill()
  }

  findAngle = () => {
    const lengthOfGroundTriangle = this.props.canvas.height - this.horizonPosition
    const widthOfGroundTriangle = this.props.canvas.width/2

    const sideOfPath = Math.sqrt(Math.pow(lengthOfGroundTriangle, 2) + Math.pow(widthOfGroundTriangle, 2))
    const numerator = (2 * Math.pow(sideOfPath, 2)) - Math.pow(this.props.canvas.width, 2)
    const denominator = (2 * Math.pow(sideOfPath, 2))

    const angleOfTruth = Math.acos(numerator/denominator)

    return angleOfTruth
  }

  makeBricks = (ctx) => {
    console.log("CALLED MAKE BRICKS")
    const centralX = this.props.canvas.width/2

    const angleOfTruth = this.findAngle()

    // This is responsible for alternating the bricks in each row (so their vertical border is on the previous row's brick middle)
    let shouldAlternateOdd = true

    let previousPoints = []
    for ( let i = 0; i <= this.numOfBricksInARow; i++ ) {
      previousPoints.push({x: centralX, y: this.horizonPosition})
    }
    let currentPoints = []

    for ( let row = this.horizonPosition + this.state.movement; row <= this.props.canvas.height; row += this.brickSpacingBetweenRows ) {
      console.log(row)
      const distanceFromHorizon = row - this.horizonPosition
      const horizontalPathLength = 2 * distanceFromHorizon * Math.tan(angleOfTruth/2)
      const xStartOfHorizontalLines = (this.props.canvas.width - horizontalPathLength) / 2

      ctx.beginPath()
      ctx.moveTo(xStartOfHorizontalLines, row)
      ctx.lineTo(xStartOfHorizontalLines + horizontalPathLength, row)
      ctx.stroke()
      this.brickSpacingBetweenRows *= this.depthMultiplier

      for ( let brick = 0; brick <= this.numOfBricksInARow; brick++) {
        const widthOfBrick = horizontalPathLength/this.numOfBricksInARow
        currentPoints.push({x: xStartOfHorizontalLines+(brick*widthOfBrick), y: row})
      }

      for ( let i = 0; i < previousPoints.length; i++ ) {
        if ( (shouldAlternateOdd && i % 2 === 0) || (!shouldAlternateOdd && i % 2 === 1 ) ) {
          ctx.beginPath()
          ctx.moveTo(previousPoints[i].x, previousPoints[i].y)
          ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
          ctx.stroke()
        }
      }

      previousPoints = [...currentPoints]
      currentPoints = []

      shouldAlternateOdd = !shouldAlternateOdd

      // DIRTY MANIPULATION FOR THE NEAREST BRICKS
      // if ( row + this.brickSpacingBetweenRows > this.props.canvas.height ) {
      //   row = this.props.canvas.height - this.brickSpacingBetweenRows
      // }
    }

    this.brickSpacingBetweenRows = this.initialBrickSpacingBetweenRows
  }

  makeSideStructures = (ctx) => {
    const centralX = this.props.canvas.width/2
    const sideStructuresColor = '#0CBE00'

    ctx.beginPath()
    ctx.moveTo(0, this.props.canvas.height)
    ctx.lineTo(centralX, this.horizonPosition)
    ctx.lineTo(0, this.horizonPosition)
    ctx.moveTo(this.props.canvas.width, this.props.canvas.height)
    ctx.lineTo(centralX, this.horizonPosition)
    ctx.lineTo(this.props.canvas.width, this.horizonPosition)
    ctx.fillStyle = sideStructuresColor
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  }

  handleWalking = (e) => {
    if (e.keyCode > 36 && e.keyCode < 41 ) {
      e.preventDefault()
      if (e.keyCode === 37) {
      } else if (e.keyCode === 38) {
        this.setState({movement: this.state.movement + 1})
      } else if (e.keyCode === 39) {
      } else if (e.keyCode === 40) {
      }
    }

  }

  render() {
    const ctx = this.props.canvas && this.props.canvas.getContext("2d")
    if (ctx) {
      this.drawPathBackground(ctx)
      this.makeBricks(ctx)
      this.makeSideStructures(ctx)
      window.addEventListener('keydown', this.handleWalking)
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
