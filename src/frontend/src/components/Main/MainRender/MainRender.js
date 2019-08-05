import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setCurrentMainTripParams, setUserMainTripShown, setMainTrips, sendJoinTripRequest} from "../../../actions/tripCreators";
// import {sendJoinTripRequest} from '../../../utils/utils'
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button'
import Map from '../../Map/Map'
import Checkbox from '@material-ui/core/Checkbox';
import MainRoute from './MainRoute/MainRoute'
import {mainRenderStyles as styles} from '../../../styles/styles'
import './MainRender.css'



class MainRender extends Component {
    state = {
        checkboxArray: this.props.checkboxArray,
        joinStatusArray: this.props.joinStatusArray,
    }

    setJoinStatusArray = (joinStatusArray, index) => {
        this.setState({joinStatusArray}, () => {
            const joinTrip = {
                tripPassengerDriverTripId: this.props.mainTripId,
                tripPassengerTripId: this.props.joinIdArray[index],
                tripPassengerJoinStatus: this.state.joinStatusArray[index]
            }
            this.props.sendJoinTripRequest(joinTrip)
        })
    }

    handleChange = (index) => event => {
        const joinStatusArray = [...this.state.joinStatusArray]
        const checkboxArray = [...this.state.checkboxArray]
        if (!this.props.joinRequestIsLoaded){
            checkboxArray[index] = event.target.checked
            this.setState({checkboxArray})
            if (joinStatusArray[index] === 0) {
                joinStatusArray[index] = 1
                this.setJoinStatusArray(joinStatusArray, index)
            }
            else if (joinStatusArray[index] === 1) {
                joinStatusArray[index] = 0
                this.setJoinStatusArray(joinStatusArray, index)
            }
            else if (joinStatusArray[index] === 2) {
                joinStatusArray[index] = 3
                this.setJoinStatusArray(joinStatusArray, index)
            }
            else if (joinStatusArray[index] === 3) {
                joinStatusArray[index] = 0
                this.setJoinStatusArray(joinStatusArray, index)
            }
        }


    }

    componentDidUpdate(prevProps) {
        if (this.props.joinStatusArray !== prevProps.joinStatusArray) {
            this.setState({joinStatusArray: this.props.joinStatusArray})
        }
    }


    render() {
        const {classes, mainTripParams, mainTripPointNames, mainTripUserArray, mainTripId} = this.props
        const routesArray = [...mainTripPointNames]
        routesArray.splice(0, 1)
        const routesList = routesArray.map((item, index) => {
                if (mainTripUserArray && mainTripUserArray[index]) {
                    return (
                        <div className={classes.rectangle} key={index}>
                            <MainRoute
                                setCurrentMainTripParams={this.props.setCurrentMainTripParams}
                                mainTripParams={mainTripParams}
                                index={index}
                                joinStatusArray={this.state.joinStatusArray}
                                mainTripUserArray={mainTripUserArray}
                                item={item}
                                setUserMainTripShown={this.props.setUserMainTripShown}
                            />
                            <Checkbox
                                onChange={this.handleChange(index)}
                                checked={this.state.checkboxArray[index]}
                                style={{color: '#fff'}}
                            />
                        </div>
                    )
                } else return null
            }
        )
        return (
            <>
                <Map
                    height={250}
                    showMainRoute={true}
                    marginTop={'0px'}
                />
                <div style={{width: '100%', margin: '20px 0'}}>
                    <div className='main-buttons-container'>
                        {
                            routesList.length > 0 &&
                            <Button
                                onClick={() => this.props.setUserMainTripShown(true)}
                                classes={{
                                    root: classes.routeButton,
                                    label: classes.label
                                }}
                            >
                                My route
                            </Button>
                        }
                        <Button
                            onClick={() => this.props.setMainTrips(mainTripId)}
                            classes={{
                                root: classes.refreshButton,
                                label: classes.label
                            }}
                        >
                            Refresh
                        </Button>
                    </div>
                    {
                        routesList.length > 0 ? routesList :
                            <span style={{color: '#fff'}}>Unfortunately you have no matching routes now</span>
                    }
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        joinRequestIsLoaded: state.trips.joinRequestIsLoaded
    }
}

MainRender.propTypes = {
    mainTripPointNames: PropTypes.array,
    mainTripParams: PropTypes.array,
    mainTripUserArray: PropTypes.array,
    classes: PropTypes.object,
}


export default withStyles(styles)(connect(mapStateToProps, {
    setCurrentMainTripParams,
    setUserMainTripShown,
    setMainTrips,
    sendJoinTripRequest
})(MainRender))
