import {
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  REGISTER_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOG_OUT,
  FORGOT_PASSWORD_FAILURE,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_REQUEST,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_REQUEST,
  ACTIVATE_FAILURE,
  ACTIVATE_SUCCESS,
  ACTIVATE_REQUEST,
} from "../Constants/AuthContstant";
import authApi from "../Services/authApi";
import Swal from "sweetalert2";

export const registerUser = (value) => {
  return async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
      const { data } = await authApi.registerUser(value);
      dispatch({ type: REGISTER_SUCCESS, payload: data });
      // Swal.fire(
      //   "Sign up successfully!",
      //   "Return back to signin page!",
      //   "Success"
      // ).then((result) => {
      //   if (result.isConfirmed) {
      //     window.location.href = "/sign-in";
      //   }
      // });
    } catch (error) {
      dispatch({ type: REGISTER_FAILURE, payload: error });
    }
  };
};

export const activateUser = (value) => {
  return async (dispatch) => {
    dispatch({ type: ACTIVATE_REQUEST });
    try {
      const { data } = await authApi.sendActiveAccountMail(value);
      dispatch({ type: ACTIVATE_SUCCESS, payload: data });
      Swal.fire(
        "Sign up successfully!",
        "Return back to signin page!",
        "Success"
      ).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/sign-in";
        }
      });
    } catch (error) {
      dispatch({ type: ACTIVATE_FAILURE, payload: error });
    }
  };
};

export const loginUser = (value) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const { data } = await authApi.loginUser(value);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: LOGIN_SUCCESS, payload: data });
      Swal.fire(
        "Sign in successfully !!!",
        "Wish you have a good experience at Edu Elearning",
        "Success"
      ).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/classroom";
        }
      });
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error });
    }
  };
};

export const loginUserViaGG = (value) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      console.log(value);
      const { data } = await authApi.logInUserViaGoogle(value);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: LOGIN_SUCCESS, payload: data });
      Swal.fire(
        "Sign in successfully !!!",
        "Wish you have a good experience at Booking4T",
        "Success"
      ).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/";
        }
      });
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error });
    }
  };
};

export const loginUserViaFB = (value) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      console.log(value);
      const { data } = await authApi.logInUserViaFacebook(value);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: LOGIN_SUCCESS, payload: data });
      Swal.fire(
        "Sign in successfully !!!",
        "Wish you have a good experience at Booking4T",
        "Success"
      ).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/";
        }
      });
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error });
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("user");
    dispatch({ type: LOG_OUT });
    Swal.fire("Log out successfully!", "Success").then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
  };
};

export const forgetPassword = (value) => {
  return async (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    try {
      const { data } = await authApi.forgotPassword(value);
      dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
    } catch (error) {
      console.log(error);
      dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: error });
    }
  };
};

export const resetPassword = (value) => {
  return async (dispatch) => {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    try {
      const { data } = await authApi.resetPassword(value);
      dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.message });
      Swal.fire(
        "Reset Password successfully !!!",
        "Log in again to experience interesting stuff at Booking4T",
        "Success"
      ).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/sign-in";
        }
      });
    } catch (error) {
      dispatch({ type: RESET_PASSWORD_FAILURE, payload: error });
    }
  };
};
