import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {setMainTrips, clearMainTripId} from "../../actions/tripCreators";
import Spinner from "../Spinner/Spinner";
import MainRender from "./MainRender/MainRender";


const Main = (props) => {

    const [checkboxArray, setCheckboxArray] = useState(null)
    const [joinIdArray, setJoinIdArray] = useState(null)
    const [tripPointNames, setTripPointNames] = useState(false)
    const [tripPointParams, setTripPointParams] = useState(false)
    const [userArray, setUserArray] = useState(false)
    const { mainTripParams, joinStatusArray, mainTripPointNames, mainTripUserArray, mainTripId } = props

    useEffect(() => {
        props.setMainTrips(mainTripId)
        return () => props.clearMainTripId()
    }, [mainTripId])

    useEffect(() => {
        if (joinStatusArray){
            const checkboxArray = props.joinStatusArray.map(item => {
                return !(item % 2 === 0);
            })
            setJoinIdArray(props.joinIdArray)
            setCheckboxArray(checkboxArray)
        }
    }, [joinStatusArray])

    useEffect(() => {
        if (mainTripPointNames){
            setTripPointNames(true)
        }
    }, [mainTripPointNames])

    useEffect(() => {
        if (mainTripParams){
            setTripPointParams(true)
        }
    }, [mainTripParams])

    useEffect(() => {
        if (mainTripUserArray){
            setUserArray(true)
        }
    }, [mainTripUserArray])


    let output = (
        <div style={{marginTop: 100}}>
            <Spinner/>
        </div>
    )
    if (tripPointParams && joinStatusArray && tripPointNames && userArray) {
        output = <MainRender
            mainTripPointNames={ mainTripPointNames }
            checkboxArray={ checkboxArray }
            joinIdArray={ joinIdArray }
            joinStatusArray={ joinStatusArray }
            mainTripParams={ mainTripParams }
            mainTripId={ mainTripId }
            mainTripUserArray={ mainTripUserArray }
            setMainTrips={ props.setMainTrips }
        />
    }

    return (
        output
    )

}

const mapStateToProps = (state) => {
    return {
        mainTripParams: state.trips.mainTripParams,
        joinStatusArray: state.trips.joinStatusArray,
        mainTripPointNames: state.trips.mainTripPointNames,
        mainTripUserArray: state.trips.mainTripUserArray,
        mainTripId: state.trips.mainTripId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMainTrips: (id) => dispatch(setMainTrips(id)),
        clearMainTripId: () => dispatch(clearMainTripId()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)


// import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import { setMainTrips, clearMainTripId } from "../../actions/tripCreators";
// import Spinner from "../Spinner/Spinner";
// import MainRender from "./MainRender/MainRender";
//
//
//
//
// class Main extends Component {
//     state = {
//         checkboxArray: null,
//         joinIdArray: null,
//         tripPointNames: false,
//         tripPointParams: false,
//         userArray: false,
//     }
//
//     componentDidUpdate(prevProps) {
//         if (this.props.mainTripId !== prevProps.mainTripId) {
//             this.props.setMainTrips(this.props.mainTripId)
//         }
//         if (this.props.joinStatusArray !== prevProps.joinStatusArray) {
//             const checkboxArray = this.props.joinStatusArray.map(item => {
//                 return !(item % 2 === 0);
//             })
//             this.setState({joinIdArray: this.props.joinIdArray, checkboxArray})
//         }
//         if (this.props.mainTripPointNames !== prevProps.mainTripPointNames){
//             this.setState({tripPointNames: true})
//         }
//         if (this.props.mainTripParams !== prevProps.mainTripParams){
//             this.setState({tripPointParams: true})
//         }
//         if (this.props.mainTripUserArray !== prevProps.mainTripUserArray){
//             this.setState({userArray: true})
//         }
//
//     }
//
//     componentWillUnmount(){
//         this.props.clearMainTripId()
//     }
//
//     componentDidMount() {
//         if (this.props.mainTripId) {
//             this.props.setMainTrips(this.props.mainTripId)
//         }
//     }
//
//     render() {
//         const { mainTripParams, joinStatusArray, mainTripPointNames, mainTripUserArray, mainTripId } = this.props
//         const { checkboxArray, joinIdArray, tripPointNames, tripPointParams, userArray } = this.state
//         let output = (
//             <div style={{marginTop: 100}}>
//                 <Spinner/>
//             </div>
//         )
//         if (tripPointParams && joinStatusArray && tripPointNames && userArray){
//            output = <MainRender
//                     mainTripPointNames={mainTripPointNames}
//                     checkboxArray={checkboxArray}
//                     joinIdArray={joinIdArray}
//                     joinStatusArray={joinStatusArray}
//                     mainTripParams={mainTripParams}
//                     mainTripId={mainTripId}
//                     mainTripUserArray={mainTripUserArray}
//                     setMainTrips={this.props.setMainTrips}
//                     />
//         }
//
//         return (
//             output
//         )
//     }
// }
//
// const mapStateToProps = (state) => {
//     return {
//         mainTripParams: state.trips.mainTripParams,
//         joinStatusArray: state.trips.joinStatusArray,
//         mainTripPointNames: state.trips.mainTripPointNames,
//         mainTripUserArray: state.trips.mainTripUserArray,
//         mainTripId: state.trips.mainTripId,
//     }
// }
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         setMainTrips: (id) => dispatch(setMainTrips(id)),
//         clearMainTripId: () => dispatch(clearMainTripId()),
//     }
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(Main)

