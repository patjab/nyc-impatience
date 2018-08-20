import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { setThisCanvas, emptyGarbageOfTourists } from '../actions'
import { touristDensity, loudnessSpookLevel, loudnessRechargeInSeconds, canvasWidth,
  canvasHeight, backgroundMusicOn, marginAroundStats, paddingAroundStats } from '../setupData'
import { microphoneRunner, loudEnough } from '../mediaHelper/microphoneHelper.js'

import Path from './Path'
import Player from './Player'
import Tourist from './Tourist'
import Timer from './Timer'

class Canvas extends Component {

  state = {
    playerYelled: false,
    scaredTouristListener: null,
    hasPlayedYell: false,
    doneGreyscale: false
  }

  displayStats = () => {
    let yCursor = 130

    const ctx = this.refs.playArea.getContext("2d")
    ctx.textAlign = 'center'
    ctx.font = "50px Geneva"
    ctx.fillStyle = "white"
    ctx.fillText(`GAME OVER`, canvasWidth/2, yCursor)

    let sectionPadding = 20
    const availableSpaceOuterLength = canvasWidth - (marginAroundStats*2)
    const availableSpaceInnerLength = availableSpaceOuterLength - (paddingAroundStats*2)

    const marginAroundPictures = 10
    const numberOfMargins = this.props.bumpedImages.length-1
    const spaceAvailableToAllImages = availableSpaceInnerLength - (numberOfMargins*marginAroundPictures)
    const imageWidth = spaceAvailableToAllImages/this.props.bumpedImages.length
    const proportionalSizeImage = imageWidth/canvasWidth
    const imageHeight = proportionalSizeImage * canvasHeight

    let imageCursorX = marginAroundStats + paddingAroundStats
    console.log("B: ", yCursor)
    let imageCursorY = yCursor + sectionPadding // separate due to ASYNC behavior
    yCursor += sectionPadding
    console.log("A: ", yCursor)

    const imageArray = []
    for (let img64 of this.props.bumpedImages) {
      const image = new Image()
      image.src = img64
      image.onload = function() {
        console.log(yCursor)
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight, imageCursorX, imageCursorY, imageWidth, imageHeight)
        imageCursorX += imageWidth + marginAroundPictures
      }
    }

    yCursor += imageHeight + sectionPadding
    ctx.font = "20px Geneva"
    ctx.fillStyle = "white"
    ctx.fillText(`You bumped into these tourists`, canvasWidth/2, yCursor)
    yCursor += sectionPadding
    sectionPadding = 50

    ctx.font = "35px Geneva"
    yCursor += sectionPadding
    const afterColon = 10
    const spacing = 40
    const colorOfData = 'red'

    const indivStreaks = []
    for (let i = 0; i < this.props.streak.length; i++) {
      if ( i === 0 ) {
        indivStreaks.push(this.props.streak[0])
      } else {
        indivStreaks.push(this.props.streak[i] - this.props.streak[i-1])
      }
    }

    const recordData = {
      distance: indivStreaks.reduce((a,b) => a+b),
      averageSpeed: indivStreaks.reduce((a,b) => a+b) / (this.props.timeFinished/100),
      timeLasted: this.props.timeFinished,
      longestStreak: Math.max(...indivStreaks),
      shortestStreak: Math.min(...indivStreaks),
      directionChanges: this.props.changeInDirectionCounter,
      directionChangesPerSec: this.props.changeInDirectionCounter / (this.props.timeFinished/100)
    }

    ctx.textAlign = 'right'
    ctx.fillStyle = 'white'
    ctx.fillText(`Distance`, canvasWidth/2 - afterColon, yCursor)
    ctx.textAlign = 'left'
    ctx.fillStyle = colorOfData
    ctx.fillText(`${recordData.distance} steps`, canvasWidth/2 + afterColon, yCursor)
    yCursor += spacing

    ctx.textAlign = 'right'
    ctx.fillStyle = 'white'
    ctx.fillText(`Average Speed`, canvasWidth/2 - afterColon, yCursor)
    ctx.textAlign = 'left'
    ctx.fillStyle = colorOfData
    ctx.fillText(`${Math.round(recordData.averageSpeed * 100) / 100} steps/s`, canvasWidth/2 + afterColon, yCursor)
    yCursor += spacing

    ctx.textAlign = 'right'
    ctx.fillStyle = 'white'
    ctx.fillText(`Time Lasted`, canvasWidth/2 - afterColon, yCursor)
    ctx.textAlign = 'left'
    ctx.fillStyle = colorOfData
    ctx.fillText(`${Math.round(recordData.timeLasted) / 100} seconds`, canvasWidth/2 + afterColon, yCursor)
    yCursor += spacing

    ctx.textAlign = 'right'
    ctx.fillStyle = 'white'
    ctx.fillText(`Longest Streak`, canvasWidth/2 - afterColon, yCursor)
    ctx.textAlign = 'left'
    ctx.fillStyle = colorOfData
    ctx.fillText(`${recordData.longestStreak} steps`, canvasWidth/2 + afterColon, yCursor)
    yCursor += spacing

    ctx.textAlign = 'right'
    ctx.fillStyle = 'white'
    ctx.fillText(`Shortest Streak`, canvasWidth/2 - afterColon, yCursor)
    ctx.textAlign = 'left'
    ctx.fillStyle = colorOfData
    ctx.fillText(`${recordData.shortestStreak} steps`, canvasWidth/2 + afterColon, yCursor)
    yCursor += spacing

    ctx.textAlign = 'right'
    ctx.fillStyle = 'white'
    ctx.fillText(`Direction Δs`, canvasWidth/2 - afterColon, yCursor)
    ctx.textAlign = 'left'
    ctx.fillStyle = colorOfData
    ctx.fillText(`${recordData.directionChanges}`, canvasWidth/2 + afterColon, yCursor)
    yCursor += spacing

    ctx.textAlign = 'right'
    ctx.fillStyle = 'white'
    ctx.fillText(`Δs/second`, canvasWidth/2 - afterColon, yCursor)
    ctx.textAlign = 'left'
    ctx.fillStyle = colorOfData
    ctx.fillText(`${Math.round(recordData.directionChangesPerSec * 100) / 100}`, canvasWidth/2 + afterColon, yCursor)
    yCursor += spacing

  }

  componentDidUpdate() {
    if (this.props.lives <= 0 && this.state.doneGreyscale) {
      let ctx = this.refs.playArea.getContext("2d")

      let i = 0
      let squareWidth, squareHeight
      const maximumWidth = canvasWidth - marginAroundStats
      const maximumHeight = canvasHeight - marginAroundStats
      const startingDimension = 5
      const gameOverSquareAnimation = setInterval(() => {
        if ( squareHeight > maximumHeight ) {
          clearInterval(gameOverSquareAnimation)
          this.displayStats()
        } else {
          squareWidth = squareWidth < maximumWidth ? startingDimension + i : maximumWidth
          squareHeight = startingDimension + i

          const xPosition = (canvasWidth/2) - (squareWidth/2)
          const yPosition = (canvasHeight/2) - (squareHeight/2)

          ctx.beginPath()
          ctx.rect(xPosition, yPosition, squareWidth, squareHeight)
          ctx.fillStyle = "#000000"
          ctx.fill()
          ctx.closePath()

          i += 5
        }
      }, 1)
    }

    if (this.props.lives <= 0 && !this.state.doneGreyscale) {
      this.refs.backgroundMusic.pause()

      if ( !this.state.hasPlayedYell ) {
        this.refs.losingScream.play()
        this.setState({hasPlayedYell: true})
      }

      this.refs.gameOverMusic.play()
      this.refs.frozenGameOverScreen.onload = () => {
        this.refs.playArea.getContext("2d").drawImage(this.refs.frozenGameOverScreen, 0, 0, canvasWidth, canvasHeight)
        // this.refs.playArea.getContext("2d").clearRect(0, 0, canvasWidth, canvasHeight)

        let context = this.refs.playArea.getContext("2d")
        let canvas = this.refs.playArea
        this.grayScale(context, canvas)

        //add the function call in the imageObj.onload
        this.refs.frozenGameOverScreen.onload = () => {
            context.drawImage(this.refs.frozenGameOverScreen, 0, 0);
            this.grayScale(context, canvas);
        }

      }
    }
  }

  grayScale(context, canvas) {
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imgData.data

    let i = 0
    const pixelInterval = setInterval(() => {

        if ( i >= pixels.length ) {
          clearInterval(pixelInterval)
          this.setState({doneGreyscale: true})
        } else {
          for ( let n = 0; n < (canvasWidth*4)*2; n+= 4 ) {
            const changeRed = 0.30
            const changeGreen = 0.60
            const changeBlue = 0.10
            const grayscale = (pixels[i] * changeRed) + (pixels[i+1] * changeGreen) + (pixels[i+2] * changeBlue)
            pixels[i] = grayscale        // red
            pixels[i+1] = grayscale        // green
            pixels[i+2] = grayscale        // blue
            i+= 4
          }
          context.putImageData(imgData, 0, 0)
        }

    }, 1)
  }


  backgroundMusicStart = (e) => {
    if ( e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if ( backgroundMusicOn ) {
        this.refs.backgroundMusic.play()
      }
      window.removeEventListener('keydown', this.backgroundMusicStart)
    }
  }

  scaredTouristListener = () => {
    microphoneRunner(loudnessSpookLevel)
    return setInterval( () => {
      if (loudEnough && !this.state.playerYelled ) {
        this.setState({playerYelled: true}, () => {
          for ( let tourist of this.props.touristRoaster ) {
            tourist.runningAnimation()
          }
          setTimeout( () => {
            this.setState({playerYelled: false})
          }, loudnessRechargeInSeconds * 1000)
        })
      }
    }, 1)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.backgroundMusicStart)
    const scaredTouristListener = this.scaredTouristListener()
    this.setState({scaredTouristListener: scaredTouristListener})
    this.props.setCanvas(this.refs.playArea)
  }

  componentWillUnmount() {
    clearInterval(this.state.scaredTouristListener)
  }

  renderTourists = (numberOfTourists) => {
    let tourists = []
    if (this.props.lives > 0) {
      for ( let i = 0; i < (numberOfTourists+this.props.stage); i++ ) {
        if ( !this.props.garbageOfTourists.includes(i) ) {
          tourists.push(<Tourist key={i} id={i} />)
        }
        else {
          numberOfTourists++
        }
      }
    }
    return tourists
  }

  render() {
    return (
      <Fragment>
        <audio src='../backgroundMusic.mp3' loop='true' ref='backgroundMusic'/ >
        <audio src='../gameOver.mp3' loop='true' ref='gameOverMusic'/ >
        <audio src='../losingScream.wav' ref='losingScream'/ >
        <Timer />
        <canvas width={canvasWidth} height={canvasHeight} ref='playArea' id='playArea' className={this.props.bumpingShake ? 'bumpingShake' : null}></canvas>
        { this.props.lives > 0 ?
          <Fragment>
            <Path />
            {this.renderTourists(touristDensity)}
            <Player />
          </Fragment>
          :
          <img src={this.props.gameOverImage} alt='frozenGameOverScreen' ref='frozenGameOverScreen' className='hidden'/>
        }
      </Fragment>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    canvas: state.canvas,
    garbageOfTourists: state.garbageOfTourists,
    lives: state.lives,
    touristRoaster: state.touristRoaster,
    stage: state.stage,
    bumpingShake: state.bumpingShake,
    gameOverImage: state.gameOverImage,
    bumpedImages: state.bumpedImages,
    streak: state.streak,
    timeFinished: state.timeFinished,
    changeInDirectionCounter: state.changeInDirectionCounter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvas: (canvas) => dispatch(setThisCanvas(canvas)),
    emptyGarbageOfTourists: () => dispatch(emptyGarbageOfTourists())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
