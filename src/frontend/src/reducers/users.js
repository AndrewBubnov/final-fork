import {
    SET_USER, SET_USER_POINTS, SET_ROLE, SET_SOCIAL_AUTH, MENU_TOGGLE,
    ERROR_POPUP_OPEN, SET_USER_NAME, SET_ERROR_MESSAGE, SET_USER_PHOTO,
    INITIAL_LOAD, SET_CURRENT_CAR_PHOTO, SET_USER_MODERATION_ARRAY, SET_PREVIOUS_ROUTE,
    SET_TOKEN_TIMEOUT, SET_TOKENS_FETCHING

} from '../actions/users'


const initialState = {

    allPointRequest: false,
    allPoints: [],
    user: {
        createdDate: '',
        modifiedDate: '',
        userId: '',
        userMail: '',
        userName: '',
        userPhone: '',
        userPhoto: '',
        userPoints: [],
        userCars: [],
        userRole: '',
        userIsOkUserPhoto: null,
        userIsOkCarPhoto: null,
        userTokenAccess: '',
        userTokenAccessTo: '',
        userTokenRefresh: '',
    },
    errorMessage: '',
    role: 'passenger',
    isAuthenticated: false,
    auth: null,
    topMenuOpen: false,
    errorPopupOpen: false,
    initialLoad: true,
    currentCarPhoto: '',
    moderated: [],
    previousRoute: ['/'],
    tokenRefreshTimeout: null,
    tokensAreFetching: false,
}

function users(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {...state, user: {...state.user, ...action.payload}, isAuthenticated: true}
        case SET_USER_POINTS:
            return {...state, user: {...state.user, userPoints: action.payload}}
        case SET_ROLE:
            return {...state, role: action.payload}
        case SET_SOCIAL_AUTH:
            return {...state, auth: action.payload}
        case MENU_TOGGLE:
            return {...state, topMenuOpen: action.payload}
        case ERROR_POPUP_OPEN:
            return {...state, errorPopupOpen: action.payload}
        case SET_USER_NAME:
            return {...state, user: action.payload}
        case SET_ERROR_MESSAGE:
            return {...state, errorMessage: action.payload}
        case SET_USER_PHOTO:
            return {...state, user: {...state.user, userPhoto: action.payload}}
        case INITIAL_LOAD:
            return {...state, initialLoad: action.payload}
        case SET_CURRENT_CAR_PHOTO:
            return {...state, currentCarPhoto: action.payload}
        case SET_USER_MODERATION_ARRAY:
            return {...state, moderated: action.payload}
        case SET_PREVIOUS_ROUTE:
            return {...state, previousRoute: [...state.previousRoute, action.payload]}
        case SET_TOKEN_TIMEOUT:
            return {...state, tokenRefreshTimeout: action.payload}
        case SET_TOKENS_FETCHING:
            return {...state, tokensAreFetching: action.payload}



        default:
            return {...state}
    }
}

export default users