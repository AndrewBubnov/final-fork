import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import useForm from '../../hooks/useForm'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import {setAuthorization, setSocialAuth, setAuthByToken, errorPopupShow} from '../../actions/userCreators'
import {setMainTripIdFromStorage} from '../../actions/tripCreators'
import {withStyles} from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment';
import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Link from '@material-ui/core/Link';
import {theme} from '../../styles/styles'
import {loginStyles as styles} from '../../styles/styles'
import {loginStyle as style} from '../../styles/style'
import './Login.css'


firebase.initializeApp({
    apiKey: 'AIzaSyDx0_JsSsE45hOx_XKwpVptROViTneTVbA',
    authDomain: 'social-auth-7.firebaseapp.com'
})

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
}

const phoneNumber = /^\+?[0-9]{10}/;
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const Login = (props) => {

    const [signType, setSignType] = useState('log-in')
    const [passwordIsHidden, setPasswordIsHidden] = useState(true)
    const [firebaseAuthed, setFirebaseAuthed] = useState(false)
    let initialInputs = {
        login: '',
        password: '',
    }
    const [error, setError] = useState({
        login: '',
        password: '',
        confirmPassword: '',
    })

    if (signType !== 'log-in') initialInputs.confirmPassword = ''

    const [user, setUser] = useForm(initialInputs)

    const loginInput = useRef()


    const onBlur = ({target: {name}}) => {
        validate(name)
    }

    const onFocus = ({target: {name}}) => {
        setError({...error, [name]: ''})
    }

    const validate = (name) => {
        const {login, password, confirmPassword} = user
        if (name === 'login') {
            if (!(phoneNumber.test(login.split('-').join('')) || email.test(login.toLowerCase()))) {
                setError({...error, login: 'Please enter valid email or phone number'})
            }
        }
        if (name === 'password' && password.length < 5) {
            setError({...error, password: 'Password has to be 5 characters at least'})
        }
        if (name === 'confirmPassword' && password !== confirmPassword) {
            setError({...error, password: 'Passwords do not match'})
        }
    }

    const handleRadio = event => {
        setSignType(event.target.value)
        loginInput.current.focus();
    };


    useEffect(() => {
        props.setAuthByToken();
        if (localStorage.getItem('tripId') && localStorage.getItem('iTripper_page') === '/main') {
            props.setMainTripIdFromStorage()
        }
        firebase.auth().onAuthStateChanged(authenticated => {
            if (authenticated && !firebaseAuthed) {
                setFirebaseAuthed(true)
            }
        })
    }, [])

    useEffect(() => {
        let mounted = true
        if (firebaseAuthed) {
            let token = null
            firebase.auth().currentUser.getIdToken()
                .then(result => {
                    token = result
                    if (mounted) {
                        const user = {login: firebase.auth().currentUser.email, token}
                        setAuth(user)
                    }
                })
                .catch(err => props.errorPopupShow())
        }
        return () => {
            mounted = false;
        };
    }, [firebaseAuthed])

    useEffect(() => {
        if (props.isAuthenticated) {
            let path = null
            if (signType === 'log-in') {
                if (localStorage.getItem('iTripper_page')) {
                    path = localStorage.getItem('iTripper_page')
                } else {
                    path = '/smart'
                }
            } else path = '/profile'
            props.history.push({pathname: path})
        }
    }, [props.isAuthenticated])


    const setAuth = (user) => {
        props.setAuthorization(user, signType)
        if (firebase.auth()) props.setSocialAuth(firebase.auth())
    }

    const togglePasswordMask = () => {
        setPasswordIsHidden(!passwordIsHidden);
    }


    const {classes} = props
    const {login, password, confirmPassword} = user
    const allChecks = (phoneNumber.test(login.split('-').join('')) || email.test(login.toLowerCase())) &&
        ((signType === 'log-in' && login !== '' && password.length >= 5) ||
            (signType === 'register' && login !== '' && password.length >= 5 && password === confirmPassword))

    const inputs = Object.keys(initialInputs).map(item => {
        let label = ''
        let inputProps = {}
        let autoFocus = false
        let inputRef = undefined
        const type = item === 'login' ? 'text' : (passwordIsHidden ? 'password' : 'text')
        if (item === 'login') {
            label = "Phone or email"
            autoFocus = true
            inputRef = loginInput
            inputProps = {
                classes: {
                    input: classes.inputColor
                }
            }
        } else {
            inputProps = {
                classes: {
                    input: classes.inputColor
                },
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Toggle password visibility"
                            className={classes.eye}
                            onClick={togglePasswordMask}
                        >
                            {passwordIsHidden ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                ),
            }
            if (item === 'password') {
                label = "Password"
            } else if (item === 'confirmPassword') {
                label = "Confirm password"
            }
        }

        return (
            <TextField
                key={item}
                type={type}
                label={label}
                autoFocus={autoFocus}
                style={style.input}
                autoComplete="off"
                name={item}
                value={user[item]}
                onChange={setUser}
                onBlur={onBlur}
                onFocus={onFocus}
                error={error[item].length > 0}
                helperText={error[item]}
                inputRef={inputRef}
                InputProps={inputProps}
            />
        )
    })
    return (
        <div className="login-container">
            <MuiThemeProvider theme={theme}>
                <RadioGroup
                    aria-label="position"
                    name="position"
                    value={signType}
                    onChange={handleRadio}
                    row
                    style={style.radio}
                >
                    <FormControlLabel
                        value="log-in"
                        control={<Radio color="primary"/>}
                        label="Log in"
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        value="register"
                        control={<Radio color="primary"/>}
                        label="Register"
                        labelPlacement="top" color="primary"
                    />
                </RadioGroup>

                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                />

                {signType === 'log-in' && <span>or</span>}

                {inputs}

                {signType === 'log-in' &&
                <Link href={'/restore_password'} className={classes.link}>
                    forgot password?
                </Link>
                }
                <Button onClick={() => setAuth(user)}
                        disabled={!allChecks}
                        style={style.button}
                        classes={{
                            root: classes.root,
                            label: classes.label
                        }}
                >
                    Submit
                </Button>
            </MuiThemeProvider>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.users.isAuthenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuthorization: (state, signType) => dispatch(setAuthorization(state, signType)),
        setSocialAuth: (auth) => dispatch(setSocialAuth(auth)),
        setAuthByToken: () => dispatch(setAuthByToken()),
        setMainTripIdFromStorage: () => dispatch(setMainTripIdFromStorage()),
        errorPopupShow: () => dispatch(errorPopupShow()),
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Login))
