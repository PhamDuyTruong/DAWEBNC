import {
    GET_NOTIFICATION_SUCCESS,
    GET_NOTIFICATION_FAILURE,
    GET_NOTIFICATION_REQUEST,
    CREATE_NOTIFICATION_SUCCESS,
    CREATE_NOTIFICATION_FAILURE,
    CREATE_NOTIFICATION_REQUEST,
} from "../Constants/NotificationConstant";

const initialState = {
    notifications: [],
    isLoading: false,
    error: null,
};

function notificationReducer(state = initialState, action) {
    switch (action.type) {
        case GET_NOTIFICATION_REQUEST: {
            return { ...state, isLoading: true, error: null };
        }
        case GET_NOTIFICATION_SUCCESS: {
            return { ...state, isLoading: false, notifications: action.payload };
        }
        case GET_NOTIFICATION_FAILURE: {
            return { ...state, isLoading: false, error: action.error };
        }
        case CREATE_NOTIFICATION_REQUEST: {
            return { ...state, isLoading: true, error: null };
        }
        case CREATE_NOTIFICATION_SUCCESS: {
            return { ...state, isLoading: false, notifications: action.payload };
        }
        case CREATE_NOTIFICATION_FAILURE: {
            return { ...state, isLoading: false, error: action.error };
        }
        default:
            return state;
    }
}

export default notificationReducer;