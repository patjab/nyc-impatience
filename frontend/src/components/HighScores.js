import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getHighScores } from '../adapter/adapter'
import { canvasHeight, canvasWidth } from '../setupData'

class HighScores extends Component {
  state = {
    topScores: null
  }

  componentDidMount() {
    getHighScores()
    .then(allScores => allScores.sort((score1, score2) => score2.distance - score1.distance))
    .then(sortedScores => sortedScores.slice(0, 10))
    .then(topScores => this.setState({topScores}))
  }

  componentDidUpdate() {
    const canvas = this.refs.highScores
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.rect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.closePath()

    if ( this.state.topScores ) {
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '50px Geneva'
      ctx.textAlign = 'center'

      let yCursor = 100

      ctx.fillText("HIGH SCORES", canvasWidth/2, yCursor)
      yCursor += 50
      yCursor += 12

      ctx.textAlign = 'left'

      ctx.font = '20px Geneva'
      ctx.fillText(`Total`, 350, yCursor)
      ctx.fillText(`Distance`, 450, yCursor)
      ctx.fillText(`Longest`, 550, yCursor)
      ctx.fillText(`Key`, 650, yCursor)
      yCursor += 24
      ctx.fillText(`Distance`, 350, yCursor)
      ctx.fillText(`Streak`, 450, yCursor)
      ctx.fillText(`Time`, 550, yCursor)
      ctx.fillText(`Changes`, 650, yCursor)
      yCursor += 12 + 36

      ctx.font = '30px Geneva'
      let i = 1
      for ( let scoreData of this.state.topScores ) {
        ctx.fillText(`${i}. ${scoreData.name}`, 40, yCursor)
        ctx.fillText(`${scoreData.distance}`, 350, yCursor)
        ctx.fillText(`${scoreData.longest_streak}`, 450, yCursor)
        ctx.fillText(`${scoreData.time_lasted}`, 550, yCursor)
        ctx.fillText(`${scoreData.direction_changes}`, 650, yCursor)
        yCursor += 12 + 36
        i++
      }
    }
  }

  render() {
    return <canvas width={canvasWidth} height={canvasHeight} ref='highScores'></canvas>
  }
}

export default connect()(HighScores)
