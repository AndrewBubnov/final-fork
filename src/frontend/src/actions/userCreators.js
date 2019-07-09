import {
    SET_USER, SET_USER_POINTS, SET_SOCIAL_AUTH, MENU_TOGGLE,
    ERROR_POPUP_OPEN, SET_ERROR_MESSAGE, SET_USER_MODERATION_ARRAY,
    USER_LOGOUT, INITIAL_LOAD, SET_USER_PHOTO, SET_CURRENT_CAR_PHOTO, SET_PREVIOUS_ROUTE,
    SET_TOKEN_TIMEOUT, REFRESH_TOKENS
} from './users'

import { callApi, setLocalStorage, removeTokens} from '../utils/utils'

import axios from 'axios'


//* *********************

export const checkAuthorizationByToken = () => async dispatch => {
    const accessToken = window.localStorage.getItem('iTripper_access_token');
    if (accessToken) {
        const accessTokenExpires = window.localStorage.getItem('iTripper_access_token_expires')
        const refreshTokenExpires = window.localStorage.getItem('iTripper_refresh_token_expires')
        if (refreshTokenExpires && (Date.now() > Date.parse(refreshTokenExpires))) {
            dispatch(logOut());
        } else if (accessTokenExpires && (Date.now() > Date.parse(accessTokenExpires))) {
            dispatch({type: REFRESH_TOKENS})
        }
    } else {
        dispatch(logOut())
    }
}
// * *********************

export const setAuthByToken = () => async dispatch => {
    const userToken = window.localStorage.getItem('iTripper_access_token');
    if (userToken) {
        dispatch({type: INITIAL_LOAD, payload: true})
        const accessTokenExpires = localStorage.getItem('iTripper_access_token_expires')
        const refreshTokenExpires = localStorage.getItem('iTripper_refresh_token_expires')
        if (refreshTokenExpires && (Date.now() > Date.parse(refreshTokenExpires))) {
            dispatch(logOut());
        } else if (accessTokenExpires && (Date.now() > Date.parse(accessTokenExpires))) {
            dispatch({type: REFRESH_TOKENS})
        }
        try {
            const response = await callApi('post', '/api/logins/signin', {userToken})
            setLocalStorage(response.data.userTokenAccess, response.data.userTokenRefresh)
            dispatch({type: SET_USER, payload: response.data})
        } catch (error) {
            dispatch(logOut())
            dispatch(errorPopupShow())
        }
    }
}

// * *********************

export const setAuthorization = (state, signType) => async dispatch => {
    let route = signType === 'log-in' ? 'signin' : 'signup'
    let data = null
    if (state.password) {
        data = {
            userLogin: state.login,
            userPassword: state.password,
            userPasswordNew: state.confirmPassword
        }
    }
    else {
        data = {
            userLogin: state.login,
            userToken: state.token,
        }
    }
    try {
        const response = await axios.post('/api/logins/' + route, data)
        console.log('response = ', response.data)
        setLocalStorage(response.data.userTokenAccess, response.data.userTokenRefresh)
        dispatch({type: SET_USER, payload: response.data})
        dispatch({type: INITIAL_LOAD, payload: true})
        dispatch(refreshTokensBySchedule())
    } catch (error) {
        dispatch(setErrorPopupOpen(true))
        dispatch(setErrorMessage(error.response.data))
    }
}
//* *********************

const refreshTokensBySchedule = () => dispatch => {
    const interval = setInterval(async () => {
        dispatch({type: REFRESH_TOKENS})
    }, 880000)
    dispatch ({type: SET_TOKEN_TIMEOUT, payload: interval})
    dispatch ({type: REFRESH_TOKENS})
}
//* *********************

export const setSocialAuth = (auth) => dispatch => {
    dispatch({type: SET_SOCIAL_AUTH, payload: auth})
}
//* **********************

export const logOut = () => (dispatch, getState) => {
    clearInterval(getState().users.tokenRefreshTimeout)
    dispatch({type: USER_LOGOUT})
    removeTokens()
}

//* **********************
export const topMenuToggle = (topMenuOpen) => dispatch => {
    dispatch({type: MENU_TOGGLE, payload: !topMenuOpen})
}

//* **********************

export const setErrorPopupOpen = (payload) => dispatch => {
    dispatch({type: ERROR_POPUP_OPEN, payload})
    if (!payload) dispatch(setErrorMessage(''))
}
//* **********************

export const setUserPoints = (payload) => dispatch => {
    callApi('put', '/api/userpoints', payload)
        .catch(err => dispatch(errorPopupShow()))
    dispatch({type: SET_USER_POINTS, payload})
}

//* **********************

export const setErrorMessage = (message) => dispatch => {
    dispatch({type: SET_ERROR_MESSAGE, payload: message})
}

//* **********************

export const setPhoto = (image, user, subject) => async dispatch => {
    dispatch({type: SET_USER, payload: user})
    let data = new FormData();
    data.append('fileUpload', image);
    try {
        const response = await callApi('put', 'api/images', data)
        if (subject === 'user'){
            dispatch({type: SET_USER_PHOTO, payload: response.data})
        } else {
            dispatch({type: SET_CURRENT_CAR_PHOTO, payload: response.data})
        }
    } catch (err) {
        dispatch(errorPopupShow())
    }
}
//* **********************

export const updateProfile = (user) => async dispatch => {
    dispatch({type: SET_USER, payload: user})
    try {
        const response = await  callApi('put', '/api/users', user)
        if (response.data) {
            dispatch({type: SET_USER, payload: response.data})
            setLocalStorage(response.data.userTokenAccess, response.data.userTokenRefresh)
        } else {
            dispatch(logOut())
        }
    } catch (err) {
        dispatch(errorPopupShow())
    }
}

//* **********************

export const confirmEmail = (email) => dispatch => {
    dispatch(setErrorPopupOpen(true))
    dispatch(setErrorMessage('You were sent an email with confirmation link on specified address. Please use it to confirm the email.'))
    callApi('post', 'api/logins/confirmemail', {userLogin: email})
        .catch(err => dispatch(errorPopupShow()))
}
//* **********************

export const errorPopupShow = (errorMessage) => dispatch => {
    dispatch(setErrorPopupOpen(true))
    dispatch(setErrorMessage(errorMessage || "Sorry, something's gone wrong on server. Please try again."))
}
//* **********************

export const restorePassword = (email) => dispatch =>{
    callApi('post', 'api/logins/email', {userLogin: email})
      .then(resp => console.log(resp))
      .catch(console.log)
}
//* **********************

export const setInitialLoadToFalse = () => dispatch => {
    dispatch({type: INITIAL_LOAD, payload: false})
}
//* **********************

export const clearCurrentCarPhoto = () => dispatch => {
    dispatch({type: SET_CURRENT_CAR_PHOTO, payload: ''})
}
//* **********************

export const setUserModerationArray = () => async dispatch => {
    try {
        const response = await callApi('get', 'api/users/moderationlist')
        const moderationArray = response.data.filter(item => item.userPhoto && item)
        dispatch({type: SET_USER_MODERATION_ARRAY, payload: moderationArray})
    } catch (error){
        console.log(error)
    }
}
//* **********************

export const moderatePhotos = (data) => (dispatch, getState) => {
    const newModerationArray = getState().users.moderated.filter(item => item.userId !== data.userId + '')
    dispatch({type: SET_USER_MODERATION_ARRAY, payload: newModerationArray})
    callApi('put', 'api/users/moderation', data)
        .catch(err => console.log(err))
}
//* **********************

export const setPreviousRoute = (route) => dispatch => {
    dispatch({type: SET_PREVIOUS_ROUTE, payload: route})
}
//* *********************

