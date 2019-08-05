import React, { Component } from "react";
import DateFnsUtils from "@date-io/date-fns"
import {withStyles} from '@material-ui/core/styles'
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

class ForDateTimePickers extends Component {

  handleDateTimeChange = newDateTime => {
    this.props.setTripTime(newDateTime)
  }

  render(){
      const {classes} = this.props
    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            className = 'date-picker'
            style ={{
              width:'30%',
              paddingRight: 20,
            }}
            InputProps={{ className: classes.input }}
            autoFocus={true}
            value={this.props.tripTime}
            onChange={this.handleDateTimeChange}
            autoOk={true}
          />
          <TimePicker
            style= {{
              width:'18%',
              paddingLeft: 20,
            }}
            InputProps={{ className: classes.input }}
            value={this.props.tripTime}
            ampm={false}
            minutesStep = {5}
            onChange={this.handleDateTimeChange}
            autoOk={true}
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

const styles = theme => ({
    input: {
        color: '#fff',
    }
});
export default withStyles(styles)(ForDateTimePickers);