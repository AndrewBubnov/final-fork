import React, {Component} from 'react'
import './DrawerButton.css'
import {connect} from 'react-redux'
import { topMenuToggle } from '../../../actions/userCreators'

class DrawerButton extends Component {
    state ={
      buttonClicked: false
    };

    buttonToggle = () => {
      this.setState({buttonClicked: true})
    };

    render () {
      const {color} = this.props
      let firstClass = ''
      let secondClass = ''
      let thirdClass = ''
      if (this.state.buttonClicked) {
        if (this.props.open) {
          firstClass = 'hamburger first-in'
          secondClass = 'hamburger second-in'
          thirdClass = 'hamburger third-in'
        } else {
          firstClass = 'hamburger first-out'
          secondClass = 'hamburger second-out'
          thirdClass = 'hamburger third-out'
        }
      } else {
        firstClass = 'hamburger first-start'
        secondClass = 'hamburger'
        thirdClass = 'hamburger third-start'
      }
      return (
        <div onClick={() => { this.props.topMenuToggle(this.props.open); this.buttonToggle() }} className="hamburger-button">
          <div className={firstClass} style={{backgroundColor: color}}>
          </div>
          <div className={secondClass} style={{backgroundColor: color}}>
          </div>
          <div className={thirdClass} style={{backgroundColor: color}}>
          </div>
        </div>
      )
    }
}
const mapStateToProps = (state) => {
  return {
    open: state.users.topMenuOpen
  }
}

export default connect(mapStateToProps, { topMenuToggle })(DrawerButton)
