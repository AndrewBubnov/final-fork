import React from 'react';
import {connect} from "react-redux";
import { setEndLocation, setMyCoordinates, setSearchedLocation, setTargetCoordinates, setClearMap } from "../../../actions/tripCreators";
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField'
import './LocationDrawer.css'




class LocationDrawer extends React.Component {
    state = {
        location: this.props.searchedLocation,
    };

    handleChange = (e) => {
        this.setState({location: e.target.value})
    }

    clearLocation = () => {
        this.props.setSearchedLocation('')
        this.props.setTargetCoordinates(null)
        this.props.setClearMap(true)
    }

    componentDidUpdate(prevProps){
        if (this.props.searchedLocation !== prevProps.searchedLocation){
            this.setState({location: this.props.searchedLocation})
        }
    }

    render() {
        const { location } = this.state
        return (
            <div>
                <Drawer anchor="top" open={this.props.searchedLocation.length > 0} onClose={this.clearLocation} >
                    <span className='location-drawer-header'>Use editable address</span>
                        <TextField
                        value={location}
                        onChange={this.handleChange}
                        autoComplete='off'
                        style={{width: '95%', margin: '0 auto'}}
                        />
                    <span className='location-drawer-header'>as a location for</span>
                    <div className='location-buttons-container'>
                        {!this.props.startLocation &&
                        <button
                            className='location-button'
                            onClick={() => {
                                this.props.setEndLocation(location, 'start');
                                this.props.setMyCoordinates(this.props.targetCoordinates)
                            }}
                        >
                            Start point
                        </button>
                        }
                    <button
                        className='location-button'
                        onClick={() => this.props.setEndLocation(location, 'end')}
                    >
                        End point
                    </button>
                    </div>
                </Drawer>
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        searchedLocation: state.trips.searchedLocation,
        startLocation: state.trips.startLocation,
        targetCoordinates: state.trips.targetCoordinates,
        myCoordinates: state.trips.myCoordinates,
    }
}


export default connect(mapStateToProps, {
    setEndLocation,
    setMyCoordinates,
    setSearchedLocation,
    setTargetCoordinates,
    setClearMap
})(LocationDrawer)