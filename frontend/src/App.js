import React, { Component} from 'react'
import { connect } from 'react-redux'
import StartScreen from './StartScreen'
import Canvas from './components/Canvas'

import './App.css'


class App extends Component {
  render() {
    return (
      this.props.startScreenPresent ? <StartScreen/> : <Canvas />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    startScreenPresent: state.startScreenPresent
  }
}

export default connect(mapStateToProps)(App)
