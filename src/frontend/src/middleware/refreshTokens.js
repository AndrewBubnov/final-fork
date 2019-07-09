import axios from "axios/index";
import { setLocalStorage } from "../utils/utils";
import { REFRESH_TOKENS, SET_TOKENS_FETCHING } from "../actions/users";

export const refreshTokens = (store) => (next) => async (action) => {

    if (action.type === REFRESH_TOKENS && !store.tokensAreFetching) {
        const data = {userTokenRefresh: localStorage.getItem('iTripper_refresh_token')}
        try {
            store.dispatch({type: SET_TOKENS_FETCHING, payload: true})
            const res = await axios.post('/api/usertokens', data)
            if (res.data) {
                setLocalStorage(res.data.userTokenAccess, res.data.userTokenRefresh)
            }
        } catch (err) {
            console.log(err)
        } finally {
            store.dispatch({type: SET_TOKENS_FETCHING, payload: false})
        }
    }
    next(action)
}
