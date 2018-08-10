import React, { Component, Fragment} from 'react'

import './App.css'

import Canvas from './components/Canvas'
import Path from './components/Path'

class App extends Component {
  render() {
    return (
      <Fragment>
        <Canvas />
      </Fragment>
    )
  }
}

export default App
