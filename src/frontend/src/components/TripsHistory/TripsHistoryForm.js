import React, {Component} from 'react';
import { connect } from 'react-redux'
import TripsHistory from './TripsHistory'
import {withStyles} from "@material-ui/core/styles/index";
import Button from '@material-ui/core/Button'
import {tripsHistoryFormStyles as styles} from '../../styles/styles'
import './TripsHistoryForm.css'



class TripsHistoryForm extends Component {

    newTripRedirect = () =>{
        this.props.history.push({pathname:'/newtrip'})
    }

    redirectOnMain = () => {
        this.props.history.push({pathname:'/main'})
    }

    render() {
        const { classes } = this.props
        return (
            <div className='trip-history'>
                <div className="trip-history-container" style={{marginTop:70}}>
                    <span className='trip-history-header'>my trips</span>
                    <div className="new-trip-button">
                        <Button
                            onClick={this.newTripRedirect}
                            classes={{
                                root: classes.typeButtons,
                                label: classes.label
                            }}
                        >
                            Plan New Trip
                        </Button>
                    </div>
                    <TripsHistory redirectOnMain={this.redirectOnMain}/>

                </div>
            </div>
        );
    }
}

export default withStyles(styles)(connect()(TripsHistoryForm));
