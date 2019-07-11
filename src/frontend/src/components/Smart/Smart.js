import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {logOut, setUserPoints} from '../../actions/userCreators'
import {
    setEndLocation,
    setMyCoordinates,
    setSearchedLocation,
    setTargetCoordinates,
    setTrip
} from '../../actions/tripCreators'
import {withStyles} from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Slide from '@material-ui/core/Slide';
import SmartRoute from "./SmartRoute/SmartRoute";
import LiveSearch from "../LiveSearch/LiveSearch";
import Map from "../Map/Map";
import {theme} from '../../styles/styles'
import {smartStyles as styles} from '../../styles/styles'
import {smartStyle as style} from '../../styles/style'
import WeatherWidget from "./WeatherWidget/WeatherWidget";
import './Smart.css'


const Smart = (props) => {
    const [name, setName] = useState('')
    const [editing, setEditing] = useState('')
    const [adding, setAdding] = useState(false)
    const [value, setValue] = useState('')

    const handleName = ({target: {value}}) => {
        setName(value)
    }

    const handleRoute = (userPoint) => {
        if (!userPoint.userPointLatitude || !userPoint.userPointLongitude || userPoint.userPointLatitude === 0 || userPoint.userPointLongitude === 0) {
            handleEdit(userPoint)
        } else {
            props.setTargetCoordinates({
                latitude: userPoint.userPointLatitude,
                longitude: userPoint.userPointLongitude,
            })
            const address = userPoint.userPointAddress
            props.setEndLocation(address, 'end')
            props.history.push({pathname: '/newtrip', smart: true})
        }
    }


    const handleEdit = (item) => {
        setEditing(item.userPointId)
        setName(item.userPointName)
        setValue(item.userPointAddress)
        setAdding(false)
        props.setTargetCoordinates({
            latitude: item.userPointLatitude,
            longitude: item.userPointLongitude,
        })
    }


    const editClose = (pointId) => {
        const userPoints = props.userPoints
        let id = null
        if (pointId) {
            id = pointId
        } else {
            id = userPoints.length > 0 ?
                userPoints.find(item => item.userPointName === '<no point>').userPointId : 1
        }
        let newUserPoints = userPoints.map(item => {
            if (item.userPointId === id) {
                let pointAddress = props.searchedLocation || value
                return {
                    ...item,
                    userPointName: name,
                    userPointAddress: pointAddress,
                    userPointLatitude: props.targetCoordinates.latitude,
                    userPointLongitude: props.targetCoordinates.longitude,
                    pointNameEn: name,
                }
            } else {
                return item
            }
        })
        props.setUserPoints(newUserPoints)
        rejectEdit()
    }

    const rejectEdit = () => {
        props.setSearchedLocation('')
        setEditing('')
        setName('')
        setValue('')
        setAdding(false)
    }

    const addNewPoint = () => {
        setEditing('')
        setName('')
        setValue('')
        setAdding(true)
    }

    const handleDelete = (id) => {
        let newUserPoints = props.userPoints.map(item => {
            if (item.userPointId === id) {
                return {...item, userPointName: '<no point>', userPointAddress: ''}
            } else {
                return item
            }
        })
        props.setUserPoints(newUserPoints)
    }

    const locationFetchSuccess = (position) => {
        props.setMyCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }

    const locationFetchError = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };


    const tripsHistoryRedirect = () => {
        props.history.push('/mytrips')
    }

    const newTripRedirect = () => {
        props.history.push('/newtrip')
    }

    useEffect(() => {
        const options = {
            enableHighAccuracy: true
        };
        navigator.geolocation.getCurrentPosition(locationFetchSuccess, locationFetchError, options);
    }, [])


    useEffect(() => {
        if (props.mainTripId) props.history.push({pathname: '/main'})
    }, [props.mainTripId])


    const userPoints = props.userPoints
    const firstEmptyUserPoint = userPoints.find(item => item.userPointName === '<no point>')
    let adDisable = userPoints.indexOf(firstEmptyUserPoint) === -1

    let placesList = null
    if (adding) {
        placesList = (
            <div style={{width: '100%'}}>
                <span>add new favorite point</span>
                <LiveSearch
                    name={name}
                    handleInput={handleName}
                    editClose={() => editClose(null)}
                    setCoordinates={props.setTargetCoordinates}
                    setValue={setValue}
                    method='post'
                    url='/api/points/'
                    data={{pointSearchText: value}}
                    value={value}
                    rejectEdit={rejectEdit}
                />
                <Map/>
            </div>
        )
    } else if (editing) {
        placesList = (
            <div style={{width: '100%'}}>
                <span>edit this favorite point</span>
                <LiveSearch
                    name={name}
                    handleInput={handleName}
                    editClose={() => editClose(editing)}
                    setCoordinates={props.setTargetCoordinates}
                    setValue={setValue}
                    method='post'
                    url='/api/points/'
                    data={{pointSearchText: value}}
                    value={value}
                    rejectEdit={rejectEdit}
                />
                <Map/>
            </div>
        )
    } else placesList = userPoints.map((item, index) => {
        return (
            item.userPointName !== '<no point>' &&
            <div key={item.userPointId} style={style.smartContainer}>
                <SmartRoute
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleRoute={handleRoute}
                    index={index}
                />
            </div>
        )
    })
    let dependentButton = null
    if (!adding && !editing) {
        dependentButton = (
            <Slide direction="up" in={!adDisable} mountOnEnter unmountOnExit>
                <button
                    className='type-button add-smart-button'
                    onClick={addNewPoint}
                    disabled={adDisable}
                >
                    New quick trip
                </button>
            </Slide>
        )
    }

    return (
        <MuiThemeProvider theme={theme}>
            <WeatherWidget/>
            <div className="welcome-user">
                {!adding && !editing &&
                <>
                    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                        <div className="type-button-container">
                            <button className='type-button'
                                    onClick={newTripRedirect}
                            >
                                Plan new trip
                            </button>

                            <button className='type-button'
                                    onClick={tripsHistoryRedirect}
                            >
                                My trips
                            </button>
                        </div>
                    </Slide>
                    <span className="quick-trips">Quick trips ( long tap to edit/delete )</span>
                </>
                }
                {placesList}
                {dependentButton}
            </div>
        </MuiThemeProvider>
    )
}

const mapStateToProps = (state) => {
    return {
        userPoints: state.users.user.userPoints,
        userCars: state.users.user.userCars,
        mainTripId: state.trips.mainTripId,
        targetCoordinates: state.trips.targetCoordinates,
        searchedLocation: state.trips.searchedLocation,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch(logOut()),
        setUserPoints: (payload) => dispatch(setUserPoints(payload)),
        setTrip: (trip) => dispatch(setTrip(trip)),
        setMyCoordinates: (coords) => dispatch(setMyCoordinates(coords)),
        setTargetCoordinates: (coords) => dispatch(setTargetCoordinates(coords)),
        setSearchedLocation: (location) => dispatch(setSearchedLocation(location)),
        setEndLocation: (location, end) => dispatch(setEndLocation(location, end)),
    }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Smart))
