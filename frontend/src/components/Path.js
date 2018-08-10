import React, { Component } from 'react'
import { connect } from 'react-redux'

class Path extends Component {
  horizonPosition = 400
  brickSpacingBetweenColAtEnd = 50
  brickSpacingBetweenRows = 1
  initialBrickSpacingBetweenRows = 1
  depthMultiplier = 0.001
  numOfBricksInARow = 10
  brickPerMovement = 0.10

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

    return Math.acos(numerator/denominator)
  }

  drawHorizontalRow = (ctx, row) => {
    ctx.beginPath()
    ctx.moveTo(0, row)
    ctx.lineTo(this.props.canvas.width, row)
    ctx.stroke()
  }

  drawVerticals = (ctx, previousPoints, currentPoints, shouldAlternateOdd) => {
    for ( let i = 0; i < previousPoints.length; i++ ) {
      if ( (shouldAlternateOdd && i % 2 === 0) || (!shouldAlternateOdd && i % 2 === 1 ) ) {
        ctx.beginPath()
        ctx.moveTo(previousPoints[i].x, previousPoints[i].y)
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
        ctx.stroke()
      }
    }
  }

  initializePreviousPoints = (centralX) => {
    let previousPoints = []
    for ( let i = 0; i <= this.numOfBricksInARow; i++ ) {
      previousPoints.push({x: centralX, y: this.horizonPosition})
    }
    return previousPoints
  }

  recordCurrentPoints = (horizontalPathLength, xStartOfHorizontalLines, row) => {
    let currentPoints = []
    for ( let brick = 0; brick <= this.numOfBricksInARow; brick++) {
      const widthOfBrick = horizontalPathLength/this.numOfBricksInARow
      currentPoints.push({x: xStartOfHorizontalLines+(brick*widthOfBrick), y: row})
    }
    return currentPoints
  }

  makeBricks = (ctx) => {
    const centralX = this.props.canvas.width/2
    const angleOfConvergence = this.findAngle()
    let shouldAlternateOdd = true

    let previousPoints = this.initializePreviousPoints()

    const rowsWithBrickBorders = []

    for ( let row = this.horizonPosition; row <= this.props.canvas.height; row += this.brickSpacingBetweenRows ) {
      const distanceFromHorizon = row - this.horizonPosition

      // BRICK STARTS: row
      // BRICK ENDS: row+this.brickSpacingBetweenRows
      // BRICK LENGTH Y: row+this.brickSpacingBetweenRows - row = this.brickSpacingBetweenRows
      // PROGRESS ON THE BRICK: this.brickSpacingBetweenRows * (this.state.movement * 0.50)
      // SO WE DONT OVERSTEP THE BRICK : (this.brickSpacingBetweenRows * (this.state.movement * 0.50)) % this.brickSpacingBetweenRows
      // ABSOLUTE PROGRESS ON THE BRICK: row + (this.brickSpacingBetweenRows * (this.state.movement * 0.50)) % this.brickSpacingBetweenRows

      let rowWithBorderBrick = row + (this.brickSpacingBetweenRows * (this.state.movement * this.brickPerMovement)) % this.brickSpacingBetweenRows

      // if ( (this.brickSpacingBetweenRows * (this.state.movement * 0.50)) > this.brickSpacingBetweenRows ) {
      //   rowsWithBrickBorders.push(Math.round(rowWithBorderBrick-1))
      // }
      rowsWithBrickBorders.push(Math.round(rowWithBorderBrick))

      this.brickSpacingBetweenRows = this.brickSpacingBetweenRows + (this.depthMultiplier*distanceFromHorizon)
    }

    for ( let row = this.horizonPosition; row < this.props.canvas.height; row++ ) {
      const distanceFromHorizon = row - this.horizonPosition
      if (rowsWithBrickBorders.includes(row)) {
        this.drawHorizontalRow(ctx, row)
        const horizontalPathLength = 2 * distanceFromHorizon * Math.tan(angleOfConvergence/2)
        const xStartOfHorizontalLines = (this.props.canvas.width - horizontalPathLength) / 2
        let currentPoints = this.recordCurrentPoints(horizontalPathLength, xStartOfHorizontalLines, row)
        this.drawVerticals(ctx, previousPoints, currentPoints, shouldAlternateOdd)

        previousPoints = [...currentPoints]
        shouldAlternateOdd = !shouldAlternateOdd
      }
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
        if ( this.state.movement - 1 >= 0 ) {
          this.setState({movement: this.state.movement - 1})
        }
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
