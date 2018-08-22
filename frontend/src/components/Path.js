import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { initializeBrickList } from '../actions'
import { depthMultiplier, horizonLine, numOfBricksInARow, brickColor, brickBorderColor,
  sideAreaColor, statusBarHeight, canvasWidth, canvasHeight } from '../setupData'

class Path extends Component {
  horizonPosition = horizonLine
  brickSpacingBetweenRows = 1 // MAYBE should be in some form of state
  initialBrickSpacingBetweenRows = 1

  cfBricksList = []

  drawPathBackground = (ctx) => {
    ctx.rect(0, this.horizonPosition, this.props.canvas.width, this.props.canvas.height)
    ctx.fillStyle = brickColor
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
        ctx.strokeStyle = brickBorderColor
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

  static getInitialRow = () => {
    const rowsWithBrickBorders = []
    let spacing = 1
    for ( let row = horizonLine; row <= canvasHeight; row += spacing ) {
      const distanceFromHorizon = row - horizonLine
      rowsWithBrickBorders.push(row)
      spacing += (depthMultiplier*distanceFromHorizon)
    }
    rowsWithBrickBorders.push(canvasHeight)
    rowsWithBrickBorders.sort((a,b)=>a-b)
    return rowsWithBrickBorders
  }

  makeBricks = (ctx) => {
    const angleOfConvergence = this.findAngle()
    let shouldAlternateOdd = true
    let previousPoints = []
    this.rowsWithBrickBorders = this.getRows()

    let bricksList = []

    for ( let row of this.rowsWithBrickBorders ) {
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
    const centralX = canvasWidth/2
    const centralY = canvasHeight/2
    const buildingColor = '#BD8F51'
    const otherBuildingColor = '#9A5900'

    const topLeftRoadX = 0.95*centralX
    const bottomLeftRoadY = 0.40*canvasHeight
    const topRoadWidth = (canvasWidth/2) - topLeftRoadX
    const bottomRoadWidth = canvasHeight - bottomLeftRoadY

    // START BUILDING
    ctx.fillStyle = buildingColor
    ctx.beginPath()
    ctx.moveTo(this.props.canvas.width, this.props.canvas.height)
    ctx.lineTo(centralX, this.horizonPosition)
    ctx.lineTo(this.props.canvas.width, this.horizonPosition)
    ctx.lineTo(this.props.canvas.width, this.props.canvas.height)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.rect(centralX, statusBarHeight, canvasWidth/2, horizonLine - statusBarHeight)
    ctx.fillStyle = buildingColor
    ctx.fill()
    ctx.closePath()
    // END BUILDING

    //this.rowsWithBrickBorders[107])
    // ctx.moveTo(0, this.rowsWithBrickBorders[107])
    // ctx.lineTo(canvasWidth, this.rowsWithBrickBorders[107])
    // ctx.strokeStyle = 'red'
    // ctx.stroke()


    // START ROAD
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.moveTo(0, this.props.canvas.height)
    ctx.lineTo(centralX, this.horizonPosition)
    ctx.lineTo(0, this.horizonPosition)
    ctx.closePath()
    ctx.fill()
    // END ROAD

    // START SIDEWALK ON THE OTHER SIDE
    ctx.fillStyle = brickColor
    ctx.beginPath()
    ctx.moveTo(0, horizonLine)
    ctx.lineTo(0, bottomLeftRoadY)
    ctx.lineTo(topLeftRoadX, horizonLine)
    ctx.closePath()
    ctx.fill()
    // END SIDEWALK ON THE OTHER SIDE

    // START BUILDING ON OTHER SIDE
    ctx.fillStyle = otherBuildingColor
    ctx.beginPath()
    ctx.rect(0, statusBarHeight, centralX*0.90, horizonLine - statusBarHeight)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = otherBuildingColor
    ctx.beginPath()
    ctx.moveTo(0, horizonLine)
    ctx.lineTo(centralX*0.90, horizonLine)
    ctx.lineTo(0, 500)
    ctx.closePath()
    ctx.fill()
    // END BUILDING ON THE OTHER SIDE




    const middleOfRoadX = topLeftRoadX + (topRoadWidth/2)

    // // START STREET DIVIDERS
    // ctx.beginPath()
    //
    //
    // for ( let i = 103; i > 0; i-- ) {
    //   ctx.strokeStyle = 'white'
    //   ctx.moveTo(middleOfRoadX, horizonLine)
    //   const divider1End = Path.getInitialRow()[103]
    //   const slope = -1 * ((divider1End - horizonLine) / (middleOfRoadX))
    //   ctx.lineTo(0, divider1End )
    //   ctx.lineWidth = 5
    //   ctx.stroke()
    //   ctx.closePath()
    // }
    //
    //
    //
    //
    // ctx.beginPath()
    // ctx.strokeStyle = 'white'
    // ctx.moveTo(middleOfRoadX, horizonLine)
    // const divider2End = canvasHeight - (0.90*bottomRoadWidth)
    // ctx.lineTo(0, divider2End )
    // ctx.stroke()
    // ctx.closePath()
    // ctx.lineWidth = 1
    // // END STREET DIVIDERS

    ctx.setLineDash([])
    ctx.fillStyle = sideAreaColor
    ctx.beginPath()

    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }

  skylineWidth = canvasWidth+80
  skylineHeight = 483
  skylineStartX = -55
  skylineStartY = 20

  componentDidMount () {
    // this.refs.nySkyline.onload = () => {
    //   this.props.canvas.getContext("2d").drawImage(this.refs.nySkyline, this.skylineStartX, this.skylineStartY, this.skylineWidth, this.skylineHeight)
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.canvas && this.refs.nySkyline) {
    //   this.props.canvas.getContext("2d").drawImage(this.refs.nySkyline, this.skylineStartX, this.skylineStartY, this.skylineWidth, this.skylineHeight)
    // }
    if ((this.props.centersOfBricks && this.props.centersOfBricks.length === 0) || prevProps.movement !== this.props.movement) {
      this.props.initializeBrickList(this.cfBricksList)
    }
  }

  drawSky(ctx) {
    ctx.rect(0, statusBarHeight, canvasWidth, horizonLine - statusBarHeight)
    ctx.fillStyle = '#6BD7FF'
    ctx.fill()
  }

  render() {
    const ctx = this.props.canvas && this.props.canvas.getContext("2d")
    if (ctx) {
      this.drawPathBackground(ctx)
      this.makeBricks(ctx)
      this.drawSky(ctx)
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
