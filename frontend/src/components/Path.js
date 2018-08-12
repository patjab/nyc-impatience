import React, { Component } from 'react'
import { connect } from 'react-redux'

import { addBrickToList, addBrickRowList, updateExistingBrick, clearBrickRowList } from '../actions'

import { depthCoefficient, horizonLine } from '../setupData'

class Path extends Component {
  horizonPosition = horizonLine
  brickSpacingBetweenColAtEnd = 50
  brickSpacingBetweenRows = 1 // MAYBE should be in some form of state
  initialBrickSpacingBetweenRows = 1
  depthMultiplier = depthCoefficient
  numOfBricksInARow = 10
  brickPerMovement = 0.10

  static brickId = 0

  // ADD THIS.rowsWithBrickBorders

  // state = {
  //   movement: 0
  // }

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

  // CHEAP FIX need separation of concerns here
  bricksList = []
  drawVerticals = (ctx, previousPoints, currentPoints, shouldAlternateOdd) => {
    for ( let i = 1; i < previousPoints.length-1; i++ ) {
      if ( (shouldAlternateOdd && i % 2 === 0) || (!shouldAlternateOdd && i % 2 === 1 ) ) {
        ctx.beginPath()
        ctx.moveTo(previousPoints[i].x, previousPoints[i].y)
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
        ctx.stroke()

        const brickCenterX = ((previousPoints[i+1].x - previousPoints[i].x) / 2) + previousPoints[i].x
        const brickCenterY = ((currentPoints[i+1].y - previousPoints[i+1].y) / 2) + previousPoints[i+1].y

        if ( !this.bricksList.find(brick => brick.x === brickCenterX && brick.y === brickCenterY) && brickCenterX && brickCenterY) {
          this.bricksList.push({id: -1, x: brickCenterX, y: brickCenterY})
        }
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

  // NON-PRIORITY FIX: THIS CAN BE WRITTEN MORE MATHEMATICALLY ELEGANTLY
  getRows = () => {
    const rowsWithBrickBorders = []
    for ( let row = this.horizonPosition; row <= this.props.canvas.height; row += this.brickSpacingBetweenRows ) {
      const distanceFromHorizon = row - this.horizonPosition
      const percentageOfBrick = (this.props.movement * this.brickPerMovement) % 2
      const absoluteChunkOfBrick = this.brickSpacingBetweenRows * percentageOfBrick
      const rowWithBorderBrick = row + (absoluteChunkOfBrick)
      rowsWithBrickBorders.push(rowWithBorderBrick)
      this.brickSpacingBetweenRows = this.brickSpacingBetweenRows + (this.depthMultiplier * distanceFromHorizon)
    }
    rowsWithBrickBorders.push(this.props.canvas.height)
    rowsWithBrickBorders.sort((a,b)=>a-b)
    return rowsWithBrickBorders
  }

  makeBricks = (ctx) => {
    const angleOfConvergence = this.findAngle()
    let shouldAlternateOdd = true
    let previousPoints = this.initializePreviousPoints()
    this.rowsWithBrickBorders = this.getRows()

    for ( let row of this.rowsWithBrickBorders ) {
      const distanceFromHorizon = row - this.horizonPosition
        this.drawHorizontalRow(ctx, row)
        const horizontalPathLength = 2 * distanceFromHorizon * Math.tan(angleOfConvergence/2)
        const xStartOfHorizontalLines = (this.props.canvas.width - horizontalPathLength) / 2
        const currentPoints = this.recordCurrentPoints(horizontalPathLength, xStartOfHorizontalLines, row)
        this.drawVerticals(ctx, previousPoints, currentPoints, shouldAlternateOdd)

        previousPoints = [...currentPoints]
        shouldAlternateOdd = !shouldAlternateOdd
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

  componentDidUpdate() {
    const middleOfBricks = []
    for (let i = 1; i < this.rowsWithBrickBorders.length; i++) {
      middleOfBricks.push((this.rowsWithBrickBorders[i-1] + this.rowsWithBrickBorders[i])/2)
    }
    this.props.addBrickRowList(middleOfBricks)

    console.log(this.props.brickList)
    // INITIALIZE INITIAL BRICKS
    if ( this.props.brickList.length === 0 ) {
      for (let i = this.bricksList.length - 1; i > 0; i--) {
        this.props.addBrickToList({id: Path.brickId++, x: this.bricksList[i].x, y: this.bricksList[i].y})
      }
    }

    // CYCLE THESE TWO
    // UPDATE BRICK POSITIONS
    // updateExistingBrick



    // ADD NEW BRICKS FROM HORIZON

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
    canvas: state.canvas,
    movement: state.movement,
    currentBricks: state.centersOfBricks,
    brickList: state.brickList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addBrickToList: (brick) => dispatch(addBrickToList(brick)),
    addBrickRowList: (list) => dispatch(addBrickRowList(list)),
    clearBrickRows: () => dispatch(clearBrickRowList()),
    updateExistingBrick: (id, x, y) => dispatch(updateExistingBrick(id, x, y))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Path)
