import React, { Component } from 'react'
import { connect } from 'react-redux'

class Player extends Component {
  render() {
    return (
      <img></img>
    )
  }
}

mapStateToProps = (state) => {
  return {
    canvas: state.canvas
  }
}


export default connect(mapStateToProps)(Player)
