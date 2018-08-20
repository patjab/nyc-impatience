import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import StartScreen from './StartScreen'
import Canvas from './components/Canvas'
import HighScores from './components/HighScores'

import './App.css'

class App extends Component {
  render() {
    if (this.props.startScreenPresent) {
      return (
        <Fragment>
          <StartScreen />
          <HighScores />
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Canvas />
          <HighScores />
        </Fragment>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    startScreenPresent: state.startScreenPresent
  }
}

export default connect(mapStateToProps)(App)
