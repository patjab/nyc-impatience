import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { initializeBrickList } from '../actions'

import { depthMultiplier, horizonLine, numOfBricksInARow } from '../setupData'


class Path extends Component {
  horizonPosition = horizonLine
  brickSpacingBetweenRows = 1 // MAYBE should be in some form of state
  initialBrickSpacingBetweenRows = 1

  cfBricksList = []

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
  drawVerticals = (ctx, previousPoints, currentPoints, shouldAlternateOdd) => {
    const bricksList = []

    let previousY

    for ( let i = 0; i < previousPoints.length-1; i++ ) {
      if ( (shouldAlternateOdd && i % 2 === 0) || (!shouldAlternateOdd && i % 2 === 1 )  ) {
        ctx.beginPath()
        ctx.moveTo(previousPoints[i].x, previousPoints[i].y)
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
        ctx.strokeStyle = '#000000'
        ctx.stroke()
      }

      if ( true ) {
        const brickCenterX = ((previousPoints[i+1].x - previousPoints[i].x) / 2) + previousPoints[i].x
        const brickCenterY = ((currentPoints[i+1].y - previousPoints[i+1].y) / 2) + previousPoints[i+1].y

        if ( previousY === brickCenterY ) {
          bricksList[bricksList.length-1].push({x: brickCenterX, y: brickCenterY})
        } else {
          bricksList.push([{x: brickCenterX, y: brickCenterY}])
        }

        previousY = brickCenterY
      }

    }
    return bricksList
  }

  recordCurrentPoints = (horizontalPathLength, xStartOfHorizontalLines, row) => {
    let currentPoints = []
    for ( let brick = 0; brick <= numOfBricksInARow; brick++) {
      const widthOfBrick = horizontalPathLength/numOfBricksInARow
      currentPoints.push({x: xStartOfHorizontalLines+(brick*widthOfBrick), y: row})
    }
    return currentPoints
  }

  getRows = () => {
    const rowsWithBrickBorders = []
    for ( let row = this.horizonPosition; row <= this.props.canvas.height; row += this.brickSpacingBetweenRows ) {
      const distanceFromHorizon = row - this.horizonPosition
      const percentageOfBrick = (this.props.movement * this.props.movementPerBrick) % 2
      const absoluteChunkOfBrick = this.brickSpacingBetweenRows * percentageOfBrick
      const rowWithBorderBrick = row + (absoluteChunkOfBrick)
      rowsWithBrickBorders.push(rowWithBorderBrick)
      this.brickSpacingBetweenRows = this.brickSpacingBetweenRows + (depthMultiplier*distanceFromHorizon)
    }
    rowsWithBrickBorders.push(this.props.canvas.height)
    rowsWithBrickBorders.sort((a,b)=>a-b)
    return rowsWithBrickBorders
  }

  makeBricks = (ctx) => {
    const angleOfConvergence = this.findAngle()
    let shouldAlternateOdd = true
    let previousPoints = []
    const rowsWithBrickBorders = this.getRows()

    let bricksList = []

    for ( let row of rowsWithBrickBorders ) {
      const distanceFromHorizon = row - this.horizonPosition
      this.drawHorizontalRow(ctx, row)
      const horizontalPathLength = 2 * distanceFromHorizon * Math.tan(angleOfConvergence/2)
      const xStartOfHorizontalLines = (this.props.canvas.width - horizontalPathLength) / 2
      const currentPoints = this.recordCurrentPoints(horizontalPathLength, xStartOfHorizontalLines, row)
      const bricksListInRow = this.drawVerticals(ctx, previousPoints, currentPoints, shouldAlternateOdd)

      bricksList = [...bricksList, ...bricksListInRow]

      previousPoints = [...currentPoints]
      shouldAlternateOdd = !shouldAlternateOdd
    }

    // FIX IMPURE
    this.brickSpacingBetweenRows = this.initialBrickSpacingBetweenRows
    this.cfBricksList = bricksList
    return bricksList
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.centersOfBricks && this.props.centersOfBricks.length === 0) {
      this.props.initializeBrickList(this.cfBricksList)
    }

    if (prevProps.movement !== this.props.movement) {
      this.props.initializeBrickList(this.cfBricksList)
    }
  }

  render() {
    const ctx = this.props.canvas && this.props.canvas.getContext("2d")
    if (ctx) {
      this.drawPathBackground(ctx)
      this.makeBricks(ctx)
      this.makeSideStructures(ctx)
    }
    return <Fragment></Fragment>
  }
}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    movement: state.movement,
    centersOfBricks: state.centersOfBricks,
    movementPerBrick: state.movementPerBrick,
    pathUpdater: state.pathUpdater
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeBrickList: (brickList) => dispatch(initializeBrickList(brickList))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Path)
