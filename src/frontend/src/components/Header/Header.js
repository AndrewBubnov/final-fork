import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Drawer from './Drawer/Drawer'
import DrawerButton from './DrawerButton/DrawerButton'
import ArrowBack from '@material-ui/icons/ArrowBack';
import './Header.css'


const Header = ({ previousRoute, userName, history, color }) => {
    const handleBack = () => {
        if (previousRoute[previousRoute.length - 2] !== '/') {
            history.push({pathname: previousRoute[previousRoute.length - 2]})
        }
    }

    return (
        <div className="header">
            <div className='arrow-back' style={{color}}>
                <ArrowBack
                    onClick={handleBack}
                />
            </div>
            <DrawerButton
                color={color}
            />
            <Drawer/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userName: state.users.user.userName,
        previousRoute: state.users.previousRoute,
        color: state.trips.hamburgerColor,
    }
}

export default withRouter(connect(mapStateToProps, null)(Header))