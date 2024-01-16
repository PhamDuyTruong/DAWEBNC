import {
  GET_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_FAILURE,
  GET_NOTIFICATION_REQUEST,
  CREATE_NOTIFICATION_SUCCESS,
  CREATE_NOTIFICATION_FAILURE,
  CREATE_NOTIFICATION_REQUEST,
} from "../Constants/NotificationConstant";
import notificationApi from "../Services/notificationApi";

export const getNotifications = (receiverId) => {
  return async (dispatch) => {
    dispatch({ type: GET_NOTIFICATION_REQUEST });
    try {
      const { data } = await notificationApi.getNotifications(receiverId);
      dispatch({ type: GET_NOTIFICATION_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_NOTIFICATION_FAILURE, payload: error });
    }
  };
};

export const createNotification = (value) => {
  console.log(value);
  return async (dispatch) => {
    dispatch({ type: CREATE_NOTIFICATION_REQUEST });
    try {
      const { data } = await notificationApi.createNotification(value);

      dispatch({ type: CREATE_NOTIFICATION_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: CREATE_NOTIFICATION_FAILURE, payload: error });
    }
  };
};
