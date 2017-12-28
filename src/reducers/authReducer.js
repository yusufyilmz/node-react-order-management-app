import {
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR,
} from '../actions/types';

// import { browserHistory } from 'react-router-dom';

const INITIAL_STATE = {
    error: null,
    authenticated: false
}

export function authReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case AUTH_USER:
            return { ...state, error: '', authenticated: action.payload };
        case UNAUTH_USER:
            return { ...state, authenticated: false };
        case AUTH_ERROR:
            return { ...state, authenticated: false, error: action.payload };
        // case FETCH_MESSAGE:
        //     return { ...state, message: action.payload };
    }

    return state;
}

