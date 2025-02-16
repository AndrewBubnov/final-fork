import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { setTargetCoordinates, setMyCoordinates, setClearMap, setTrip, setEndLocation } from '../../actions/tripCreators';
import { errorPopupShow } from '../../actions/userCreators';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Map from '../Map/Map';
import LocationDrawer from './LocationDrawer/LocationDrawer';
import ForDateTimePickers from './ForDateTimePickers/ForDateTimePickers';
import AutoSuggestions from '../AutoSuggestions/AutoSuggestions'
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import CapacitySelect from "../CapacitySelect/CapacitySelect";
import {theme} from '../../styles/styles'
import {newTripStyles as styles} from '../../styles/styles'
import {newTripStyle as style} from '../../styles/style'
import './NewTrip.css';


class NewTrip extends Component {

    state = {
        valueFrom: this.props.trips.startLocation,
        valueTo: this.props.trips.finishLocation,
        car: '',
        role: 'passenger',
        tripTime: new Date().toISOString(),
        userCarSitsQty: 0,
    }

    handleCapacity = (userCarSitsQty) => {
        this.setState({ userCarSitsQty })
    }

    handleRadio = event => {
        this.setState({role: event.target.value})
    };

    handleInput = ({target: {name, value}}) => {
        this.setState({[name]: value})
    }

    setValueFrom = (valueFrom) => {
        this.setState({
            valueFrom
        })
        this.props.setEndLocation(valueFrom, 'start')
    }

    setValueTo = (valueTo) => {
        this.setState({
            valueTo
        })
        this.props.setEndLocation(valueTo, 'end')
    }

    getIntermediate = () => new Promise((resolve) => {
        let check = () => {
            if (this.props.trips.intermediatePoints.length > 0) {
                resolve(this.props.trips.intermediatePoints)
            } else {
                setTimeout(check, 10)
            }
        }
        setTimeout(check, 10)
    })


    submitRoute = () => {
        if (this.props.userIsOkUserPhoto && this.props.userIsOkCarPhoto) {
            const startPoint = {
                tripPointName: this.state.valueFrom,
                tripPointLatitude: this.props.trips.myCoordinates.latitude,
                tripPointLongitude: this.props.trips.myCoordinates.longitude,
                tripPointSequence: 0,
            }
            const endPoint = {
                tripPointName: this.state.valueTo,
                tripPointLatitude: this.props.trips.targetCoordinates.latitude,
                tripPointLongitude: this.props.trips.targetCoordinates.longitude,
                tripPointSequence: 0,
            }
            this.getIntermediate()
                .then(res => {
                    let tripPoint = []
                    tripPoint.push(startPoint)
                    tripPoint = tripPoint.concat(res)
                    endPoint.tripPointSequence = tripPoint.length
                    tripPoint.push(endPoint)
                    let currentCar = this.props.userCars.length === 1 ? this.props.userCars[0] : this.state.car
                    const userCarId = this.state.role === 'driver' ? currentCar.userCarId : null
                    let result = this.setTimeWithTimezoneOffset(this.state.tripTime)
                    let trip = {
                        userCar: {
                            userCarId,
                        },
                        tripPoint,
                        tripDateTime: result,
                        userCarSitsQty: this.state.userCarSitsQty,
                    }
                    this.props.setTrip(trip)
                })

            this.props.history.push({pathname: '/main'})
        } else {
            this.props.errorPopupShow(`Unfortunately the photos you provided have not been moderated yet. You can not
            register routes and look through other user routes so far. Please contact service team.`)
        }
        this.clearRoute()
    }

    setTripTime = (time) =>{
      this.setState({
        tripTime: time
      })
    }

    setTimeWithTimezoneOffset = (currentTime) => {
      let tempDate = new Date(currentTime)
      return new Date(tempDate.getTime() - tempDate.getTimezoneOffset()*60000)
    }

    rejectRoute = () => {
        this.clearRoute()
        const previousRoute = this.props.previousRoute
        if (previousRoute[previousRoute.length - 2] === '/smart' || previousRoute[previousRoute.length - 2] === '/mytrips') {
            this.props.history.push({pathname: previousRoute[previousRoute.length - 2]})
        }

    }

    clearRoute = () => {
        this.setState({valueFrom: '', valueTo: ''})
        this.props.setClearMap(true)
        this.props.setEndLocation('', 'start');
        this.props.setEndLocation('', 'end');
        this.props.setTargetCoordinates(null);
        this.props.setMyCoordinates(null);
    }

    componentDidUpdate(prevProps) {
        if (this.props.trips.startLocation !== prevProps.trips.startLocation
            || this.props.trips.finishLocation !== prevProps.trips.finishLocation) {
            this.setState({valueFrom: this.props.trips.startLocation, valueTo: this.props.trips.finishLocation})
        }
        if (this.props.trips.myLocation !== prevProps.trips.myLocation){
            this.props.setEndLocation(this.props.trips.myLocation, 'start')
        }
    }

    componentDidMount(){
        const previousRoute = this.props.previousRoute
        if (previousRoute[previousRoute.length - 1] !== '/smart') this.props.setMyCoordinates(null);
    }


    render() {
        const { classes } = this.props;
        const { smart } = this.props.location
        const { role, car, valueFrom, valueTo, tripTime, userCarSitsQty } = this.state

        let currentCar = this.props.userCars.length === 1 ? this.props.userCars[0] : car

        const createTrip = this.props.trips.myCoordinates ? 'create new trip from your current position' : 'create new trip'
        const carList = this.props.userCars.map((item) => {
            return <MenuItem value={item} key={item.userCarId}>{item.userCarName + ' ' + item.userCarColour}</MenuItem>
        })
        return (
            <div className='trip-container'>
                <Map
                    height={230}
                    marginTop={'0px'}
                    showSmartRoute={true}
                    smart={smart}
                />
                <LocationDrawer/>
                <div className='new-trip'>
                    <span>{ createTrip }</span>
                    <MuiThemeProvider theme={theme}>
                    <AutoSuggestions
                        label='Start point'
                        setCoordinates={this.props.setMyCoordinates}
                        setValue={this.setValueFrom}
                        method='post'
                        url='/api/points'
                        data={{pointSearchText: this.state.valueFrom}}
                        value={valueFrom}
                        rejectEdit={this.rejectEdit}
                    />
                    <AutoSuggestions
                        label='End point'
                        setCoordinates={this.props.setTargetCoordinates}
                        setValue={this.setValueTo}
                        method='post'
                        url='/api/points'
                        data={{pointSearchText: this.state.valueTo}}
                        value={valueTo}
                        rejectEdit={this.rejectEdit}
                    />
                    <ForDateTimePickers setTripTime={this.setTripTime} tripTime={tripTime}/>

                        <RadioGroup
                            aria-label="position"
                            name="position"
                            value={role}
                            onChange={this.handleRadio}
                            row
                            style={style.radio}
                        >
                            <FormControlLabel
                                value="passenger"
                                control={<Radio color="primary"/>}
                                label="passenger"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                value="driver"
                                control={<Radio color="primary"/>}
                                label="driver"
                                labelPlacement="top" color="primary"
                            />
                        </RadioGroup>

                    {this.state.role === 'driver' &&
                    <div className='driver-container'>
                        <FormControl >
                            <InputLabel
                                style={{color: '#fff'}}>{currentCar.length === 0 ? 'Your car*' : ''}</InputLabel>
                            <Select
                                value={currentCar}
                                onChange={this.handleInput}
                                name="car"
                                inputProps={{
                                    classes: {
                                        root: classes.inputColor
                                    }
                                }}
                                className={classes.selectEmpty}
                                style={{width: 260}}
                            >
                                {carList}
                            </Select>
                        </FormControl>
                        <CapacitySelect
                            maxCount={currentCar.userCarSitsQty}
                            setSeatCapacity={this.handleCapacity}
                            capacity={userCarSitsQty}
                        />
                    </div>
                    }
                    </MuiThemeProvider>

                    <div className="trip-btn-container">
                        <Button
                            onClick={this.submitRoute}
                            classes={{
                                root: classes.acceptButton,
                                label: classes.label
                            }}
                            disabled={valueFrom.length === 0 || valueTo.length === 0 || (role === 'driver' && (currentCar.length === 0 || userCarSitsQty === 0))}
                        >
                            Accept
                        </Button>
                        <Button
                            onClick={this.rejectRoute}
                            classes={{
                                root: classes.rejectButton,
                                label: classes.label
                            }}
                        >
                            Reject
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userCars: state.users.user.userCars,
        userIsOkUserPhoto: state.users.user.userIsOkUserPhoto,
        userIsOkCarPhoto: state.users.user.userIsOkCarPhoto,
        previousRoute: state.users.previousRoute,
        trips: state.trips,
    }
}


export default withStyles(styles)(connect(mapStateToProps, {
    setTargetCoordinates,
    setMyCoordinates,
    setClearMap,
    setTrip,
    setEndLocation,
    errorPopupShow
})(NewTrip));
