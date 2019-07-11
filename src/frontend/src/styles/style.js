import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import orange from "@material-ui/core/colors/orange";

const windowWidth = window.innerWidth <= 380 ? window.innerWidth : 380

const theme = createMuiTheme({
    palette: {
        primary: orange
    },
    typography: {useNextVariants: true}
})

export const loginStyle = {
    input: {
        width: '100%',
    },
    button: {
        margin: theme.spacing(1),
        marginTop: '30px'
    },
    radio: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center'
    }
}
//*******************************

export const smartStyle = {
    input: {
        width: '100%',
    },
    radio: {
        display: 'flex',
        justifyContent: 'center'
    },
    smartContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 30
    },
    fullContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: windowWidth,
        marginTop: 30
    }
}
//*******************************

export const profileStyle = {
    input: {
        width: '100%',
    },
}
//*******************************

export const newTripStyle = {
    radio: {
        display: 'flex',
        justifyContent: 'center',
        height: 60,
        marginTop: 15,
    },
}

