import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 65,
    }
}));

export default function ControlledOpenSelect({ maxCount, setSeatCapacity, capacity }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const seatArray = Array.from({length: maxCount}, (item, index) => (`${index + 1} seat`))

    function handleChange({target: {value}}){
        setSeatCapacity(value + 1);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleOpen() {
        setOpen(true);
    }

    const output = seatArray.map((item, index) => (
        <MenuItem key={index} value={index}>{item}</MenuItem>
    ))


    return (
        <form autoComplete="off">
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="demo-controlled-open-select">Seats</InputLabel>
                <Select
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={capacity - 1}
                    onChange={handleChange}
                    inputProps={{
                        id: 'demo-controlled-open-select',
                    }}
                    style={{color: '#fff'}}
                >
                    {output}
                </Select>
            </FormControl>
        </form>
    );
}
