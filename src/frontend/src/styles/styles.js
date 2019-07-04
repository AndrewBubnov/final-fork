import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import orange from "@material-ui/core/colors/orange";

const windowWidth = window.innerWidth <= 380 ? window.innerWidth : 380

//*******************************

export const theme = createMuiTheme({
    palette: {
        primary: orange
    },
    typography: {useNextVariants: true}
})
//*******************************

export const smartStyles = theme => ({
    label: {
        textTransform: 'capitalize'
    },
    root: {
        height: 250,
        flexGrow: 1,
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        width: windowWidth * 0.9
    },
    inputColor: {
        color: '#fff',
        width: '100%'
    },
    inputLabel: {
        textAlign: 'center'
    },
    submit: {
        background: '#fff',
        borderRadius: 3,
        border: 0,
        color: '#f57c00',
        height: 25,
        padding: '0 10px',
        marginLeft: 10,
        marginTop: 20,
        '&:focus': {
            background: '#fff',
            outline: 'none',
            color: '#008000',
        }
    },
    formControl: {
        margin: theme.spacing(2),
    },
})
//*******************************

export const loginStyles = theme => ({
    inputColor: {
        color: '#fff',
        width: '100%',
    },
    root: {
        background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 30,
        padding: '0 30px'
    },
    label: {
        textTransform: 'capitalize'
    },
    eye: {
        cursor: 'pointer',
        color: '#3E4566',
        '&:focus': {
            outline: 'none',
        }
    },
    link: {
        marginTop: 30,
        color: '#262626',
    },
})
//*******************************

export const profileStyles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    inputColor: {
        color: '#fff',
        width: '100%',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    root: {
        background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 30,
        padding: 0,
        marginTop: 30,
    },
    label: {
        textTransform: 'capitalize'
    },
    addButton: {
        borderRadius: 3,
        border: '1px solid #fff',
        color: '#fff',
        height: 30,
        width: '47%',
        padding: 0,
    },
    submitButton: {
        background: '#fff',
        borderRadius: 3,
        border: 0,
        color: 'green',
        height: 25,
        padding: '0 10px',
        marginLeft: 10,
        marginTop: 20,
        '&:focus': {
            background: '#fff',
            outline: 'none',
            color: '#008000',
        }
    },
    rejectButton: {
        background: '#fff',
        borderRadius: 3,
        border: 0,
        color: 'red',
        height: 25,
        padding: '0 10px',
        marginLeft: 10,
        marginTop: 20,
        '&:focus': {
            background: '#fff',
            outline: 'none',
            color: '#008000',
        }
    },
})
//*******************************

export const newTripStyles = theme => ({
    acceptButton: {
        borderRadius: 3,
        background: '#fff',
        color: '#008000',
        height: 30,
        padding: 0,
        width: '40%',
        '&:focus': {
            background: '#fff',
            outline: 'none',
        },
        '&:active': {
            background: '#fff',
            outline: 'none',
        },
    },
    rejectButton: {
        borderRadius: 3,
        background: '#fff',
        color: '#FC0500',
        height: 30,
        padding: 0,
        width: '40%',
        '&:focus': {
            background: '#fff',
            outline: 'none',
        },
        '&:active': {
            background: '#fff',
            outline: 'none',
        },
    },
    label: {
        textTransform: 'capitalize'
    },
    root: {
        width: '120%',
        marginTop: 20,
        background: 'transparent',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 135,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        width: windowWidth * 0.9
    },
    inputColor: {
        color: '#fff',
    },
    formControl: {
        width: 200,
    },
})
//*******************************

export const mainRenderStyles = theme => ({
    rectangle: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },
    root: {
        width: '85%',
        borderRadius: 4,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    expandIcon: {
        color: '#1A1A1A',
    },
    details: {
        display: 'block',
    },
    routeButton: {
        background: '#fff',
        borderRadius: 4,
        color: '#f57c00',
        height: 30,
        padding: '0 30px',
        '&:focus': {
            background: '#fff',
            outline: 'none',
        }
    },
    refreshButton: {
        background: '#fff',
        borderRadius: 4,
        color: '#f57c00',
        height: 30,
        padding: '0 60px',
        '&:focus': {
            background: '#fff',
            outline: 'none',
        },
        '&:active': {
            background: '#fff',
            outline: 'none',
        },
    },
    label: {
        textTransform: 'capitalize'
    },
});
//*******************************

export const tripsHistoryStyles = theme => ({
    label: {
        textTransform: 'capitalize'
    },
    root: {
        width: '100%',
        marginTop: 20,
        background: 'transparent',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 135,
    },
    iconButton: {
        padding: 0,
        color:'#464d73',
        '&:focus': {
            outline: 'none'
        }
    }
})
//*******************************

export const tripsHistoryFormStyles = theme => ({
    typeButtons: {
        borderRadius: 4,
        border: '1px solid #fff',
        color: '#fff',
        height: 30,
        padding: 0,
        width: '47%'
    },
})
