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
import {theme} from '../../styles/styles'
import {smartStyles as styles} from '../../styles/styles'
import {smartStyle as style} from '../../styles/style'
import WeatherWidget from "./WeatherWidget/WeatherWidget";
import './Smart.css'
import EditAdd from "./EditAdd/EditAdd";


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


    const userPoints = props.userPoints
    const firstEmptyUserPoint = userPoints.find(item => item.userPointName === '<no point>')
    let adDisable = userPoints.indexOf(firstEmptyUserPoint) === -1

    let placesList = null
    if (adding) {
        placesList = (
            <EditAdd
                name={name}
                handleName={handleName}
                editClose={editClose}
                setCoordinates={props.setTargetCoordinates}
                setValue={setValue}
                value={value}
                rejectEdit={rejectEdit}
                header='add new favorite point'
            />
        )
    } else if (editing) {
        placesList = (
            <EditAdd
                name={name}
                handleName={handleName}
                editClose={editClose}
                setCoordinates={props.setTargetCoordinates}
                setValue={setValue}
                value={value}
                rejectEdit={rejectEdit}
                header='edit this favorite point'
                editing={editing}
            />
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
            {
                !adding && !editing &&
                <WeatherWidget/>
            }
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

export default withStyles(styles)(connect(mapStateToProps, {
    setEndLocation,
    setMyCoordinates,
    setSearchedLocation,
    setTargetCoordinates,
    setTrip,
    logOut,
    setUserPoints
})(Smart))


// import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {logOut, setUserPoints} from '../../actions/userCreators'
// import {
//   setEndLocation,
//   setMyCoordinates,
//   setSearchedLocation,
//   setTargetCoordinates,
//   setTrip
// } from '../../actions/tripCreators'
// import {withStyles} from '@material-ui/core/styles'
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
// import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
// import orange from '@material-ui/core/colors/orange'
// import Slide from '@material-ui/core/Slide';
// import SmartRoute from "./SmartRoute/SmartRoute";
// import LiveSearch from "../LiveSearch/LiveSearch";
// import Map from "../Map/Map";
// import './Smart.css'
// import WeatherWidget from "./WeatherWidget/WeatherWidget";
//
//
// const windowWidth = window.innerWidth <= 380 ? window.innerWidth : 380
//
//
// const styles = theme => ({
//   label: {
//     textTransform: 'capitalize'
//   },
//   root: {
//     height: 250,
//     flexGrow: 1,
//     width: '100%',
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//     width: windowWidth * 0.9
//   },
//   inputColor: {
//     color: '#fff',
//     width: '100%'
//   },
//   inputLabel: {
//     textAlign: 'center'
//   },
//   submit: {
//     background: '#fff',
//     borderRadius: 3,
//     border: 0,
//     color: '#f57c00',
//     height: 25,
//     padding: '0 10px',
//     marginLeft: 10,
//     marginTop: 20,
//     '&:focus': {
//       background: '#fff',
//       outline: 'none',
//       color: '#008000',
//     }
//   },
//   formControl: {
//     margin: theme.spacing(2),
//   },
// })
// const style = {
//   input: {
//     width: '100%',
//   },
//   radio: {
//     display: 'flex',
//     justifyContent: 'center'
//   },
//   smartContainer: {
//     display: 'flex',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 20
//   },
//   fullContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: windowWidth,
//     marginTop: 20
//   }
// }
//
// const theme = createMuiTheme({
//   palette: {
//     primary: orange
//   },
//   typography: {useNextVariants: true}
// })
//
//
// class Smart extends Component {
//   state = {
//     selectedId: 1,
//     name: '',
//     editing: '',
//     adding: false,
//     creatingTrip: false,
//     value: '',
//   };
//
//
//   handleInput = ({target: {name, value}}) => {
//     this.setState({[name]: value})
//   }
//
//   handleRoute = (userPoint) => {
//     if (!userPoint.userPointLatitude || !userPoint.userPointLongitude || userPoint.userPointLatitude === 0 || userPoint.userPointLongitude === 0) {
//       this.handleEdit(userPoint)
//     } else {
//       this.props.setTargetCoordinates({
//         latitude: userPoint.userPointLatitude,
//         longitude: userPoint.userPointLongitude,
//       })
//       const address = userPoint.userPointAddress
//       // this.props.setEndLocation(this.props.trips.myLocation, 'start')
//       this.props.setEndLocation(address, 'end')
//       this.props.history.push({pathname: '/newtrip', smart: true})
//     }
//   }
//
//
//   handleEdit = (item) => {
//     this.setState({
//       editing: item.userPointId,
//       name: item.userPointName,
//       value: item.userPointAddress,
//       adding: false
//     })
//     this.props.setTargetCoordinates({
//       latitude: item.userPointLatitude,
//       longitude: item.userPointLongitude,
//     })
//   }
//
//
//   editClose = (pointId) => {
//     const userPoints  = this.props.userPoints
//     let id = null
//     if (pointId) {
//       id = pointId
//     } else {
//       id = userPoints.length > 0 ?
//         userPoints.find(item => item.userPointName === '<no point>').userPointId : 1
//     }
//     let newUserPoints = userPoints.map(item => {
//       if (item.userPointId === id) {
//         let pointAddress = this.props.searchedLocation || this.state.value
//         return {
//           ...item,
//           userPointName: this.state.name,
//           userPointAddress: pointAddress,
//           userPointLatitude: this.props.targetCoordinates.latitude,
//           userPointLongitude: this.props.targetCoordinates.longitude,
//           pointNameEn: this.state.name,
//         }
//       } else {
//         return item
//       }
//     })
//     this.props.setUserPoints(newUserPoints)
//     this.rejectEdit()
//   }
//
//   rejectEdit = () => {
//     this.props.setSearchedLocation('')
//     this.setState({editing: '', name: '', value: '', adding: false})
//   }
//
//   addNewPoint = () => {
//     this.setState({adding: true, editing: '', name: '', value: ''})
//   }
//
//   handleDelete = (id) => {
//     let newUserPoints = this.props.userPoints.map(item => {
//       if (item.userPointId === id) {
//         return {...item, userPointName: '<no point>', userPointAddress: ''}
//       } else {
//         return item
//       }
//     })
//     this.props.setUserPoints(newUserPoints)
//   }
//
//   locationFetchSuccess = (position) => {
//     this.props.setMyCoordinates({
//       latitude: position.coords.latitude,
//       longitude: position.coords.longitude
//     })
//   }
//   locationFetchError = (err) => {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
//   };
//
//   setValue = (value) => {
//     this.setState({value})
//   }
//
//   tripsHistoryRedirect = () => {
//     this.props.history.push('/mytrips')
//   }
//
//   newTripRedirect = () => {
//     this.props.history.push('/newtrip')
//   }
//
//
//   componentDidMount() {
//     if (this.props.userCars.length === 1) this.setState({car: this.props.userCars[0]})
//     const options = {
//       enableHighAccuracy: true
//     };
//     navigator.geolocation.getCurrentPosition(this.locationFetchSuccess, this.locationFetchError, options);
//   }
//
//   componentDidUpdate(prevProps) {
//     if (this.props.mainTripId !== prevProps.mainTripId && this.props.mainTripId) {
//       this.props.history.push({pathname: '/main'})
//     }
//   }
//
//
//
//   render() {
//     const { name, value, editing, adding, creatingTrip } = this.state
//     const userPoints = this.props.userPoints
//     const firstEmptyUserPoint = userPoints.find(item => item.userPointName === '<no point>')
//     let adDisable = userPoints.indexOf(firstEmptyUserPoint) === -1
//
//     let placesList = null
//     if (adding) {
//       placesList = (
//         <div style={{width: '100%'}}>
//           <span>add new favorite point</span>
//           <LiveSearch
//             name={name}
//             handleInput={this.handleInput}
//             editClose={() => this.editClose(null)}
//             setCoordinates={this.props.setTargetCoordinates}
//             setValue={this.setValue}
//             method='post'
//             url='/api/points/'
//             data={{pointSearchText: value}}
//             value={value}
//             rejectEdit={this.rejectEdit}
//           />
//           <Map/>
//         </div>
//       )
//     } else if (editing) {
//       placesList = (
//         <div style={{width: '100%'}}>
//           <span>edit this favorite point</span>
//           <LiveSearch
//             name={name}
//             handleInput={this.handleInput}
//             editClose={() => this.editClose(editing)}
//             setCoordinates={this.props.setTargetCoordinates}
//             setValue={this.setValue}
//             method='post'
//             url='/api/points/'
//             data={{pointSearchText: value}}
//             value={value}
//             rejectEdit={this.rejectEdit}
//           />
//           <Map/>
//         </div>
//       )
//     } else placesList = userPoints.map((item, index) => {
//       return (
//         item.userPointName !== '<no point>' &&
//         <div key={item.userPointId} style={style.smartContainer}>
//           <SmartRoute
//             item={item}
//             handleDelete={this.handleDelete}
//             handleEdit={this.handleEdit}
//             handleRoute={this.handleRoute}
//             index={index}
//           />
//         </div>
//       )
//     })
//     let dependentButton = null
//     if (!adding && !editing) {
//       dependentButton = (
//         <Slide direction="up" in={!adDisable} mountOnEnter unmountOnExit>
//           <button
//             className='type-button add-smart-button'
//             onClick={this.addNewPoint}
//             disabled={adDisable}
//           >
//             New quick trip
//           </button>
//         </Slide>
//       )
//     }
//
//     return (
//       <MuiThemeProvider theme={theme}>
//         <WeatherWidget/>
//         <div className="welcome-user">
//           {!adding && !editing && !creatingTrip &&
//             <>
//               <Slide direction="down" in={true} mountOnEnter unmountOnExit>
//                 <div className="type-button-container">
//                   <button className='type-button'
//                           onClick={this.newTripRedirect}
//                   >
//                     Plan new trip
//                   </button>
//
//                   <button className='type-button'
//                           onClick={this.tripsHistoryRedirect}
//                   >
//                     My trips
//                   </button>
//                 </div>
//               </Slide>
//               <span className="quick-trips">Quick trips ( long tap to edit/delete )</span>
//             </>
//           }
//           {placesList}
//           {dependentButton}
//         </div>
//       </MuiThemeProvider>
//     )
//   }
// }
//
// const mapStateToProps = (state) => {
//   return {
//     userPoints: state.users.user.userPoints,
//     userCars: state.users.user.userCars,
//     mainTripId: state.trips.mainTripId,
//     targetCoordinates: state.trips.targetCoordinates,
//     searchedLocation: state.trips.searchedLocation,
//   }
// }
// const mapDispatchToProps = (dispatch) => {
//   return {
//     logOut: () => dispatch(logOut()),
//     setUserPoints: (payload) => dispatch(setUserPoints(payload)),
//     setTrip: (trip) => dispatch(setTrip(trip)),
//     setMyCoordinates: (coords) => dispatch(setMyCoordinates(coords)),
//     setTargetCoordinates: (coords) => dispatch(setTargetCoordinates(coords)),
//     setSearchedLocation: (location) => dispatch(setSearchedLocation(location)),
//     setEndLocation: (location, end) => dispatch(setEndLocation(location, end)),
//   }
// }
// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Smart))

