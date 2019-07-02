import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Drawer from './Drawer/Drawer'
import DrawerButton from './DrawerButton/DrawerButton'
import ArrowBack from '@material-ui/icons/ArrowBack';
import './Header.css'


const Header = ({ previousRoute, userName, history }) => {
    const handleBack = () => {
        if (previousRoute[previousRoute.length - 2] !== '/') {
            history.push({pathname: previousRoute[previousRoute.length - 2]})
        }
    }

    let greeting = userName ? userName : 'friend'
    return (
        <div className="header">
            <div className='arrow-back'>
                <ArrowBack
                    onClick={handleBack}
                />
            </div>
            Welcome, {greeting}
            <DrawerButton/>
            <Drawer/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userName: state.users.user.userName,
        previousRoute: state.users.previousRoute,
    }
}

export default withRouter(connect(mapStateToProps, null)(Header))