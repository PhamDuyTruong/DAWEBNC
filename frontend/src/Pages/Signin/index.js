import React, { useState, useEffect } from "react";
import "./styles.css";
import { useHistory, Link, useLocation } from "react-router-dom";
import bgSignin from "../../Assets/images/bgsignin.jpg";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  loginUserViaGG,
  loginUserViaFB,
} from "../../Actions/AuthAction";
import axios from "../../Services/axios";
import { Divider } from "antd";

function Signin(props) {
  const initialValues = {
    email: "",
    password: "",
  };
  const [user, setUser] = useState(props.user || {});
  const [valid, setValid] = useState(false);
  const [inValid, setInValid] = useState("");
  const { error } = useSelector((state) => state.login);
  console.log(error);
  // console.log(userLogin)
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("gg_login") === "true") {
      const code = params.get("code");
      if (code) {
        dispatch(loginUserViaGG({ code }));
      }
    } else {
      if (params.get("fb_login") === "true") {
        const code = params.get("code");
        if (code) {
          dispatch(loginUserViaFB({ code }));
        }
      }
    }
  }, []);

  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must not exceed 40 characters"),
    });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setUser((user) => ({
      ...user,
      [name]: value,
    }));
  };

  const handleUpdateStatus = async (user) => {
    try {
      const data = {
        username: user.username,
        phone: user.phone,
        email: user.email,
        profilePic: user.profilePic,
        isOnline: true,
      };
      const userInfo = JSON.parse(localStorage.getItem("user"));
      const method = "put";
      let url = `/user/me/status`;
      const headers = {
        "Content-Type": "application/json",
      };
      if (userInfo) {
        const { accessToken } = userInfo;
        headers.token = `Bearer ${accessToken}`;
      }

      await axios({ url, method, data, headers }).then((response) => {
        console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      handleUpdateStatus(userInfo);
    }
  }, [userInfo]);

  const handleSubmit = (value) => {
    const data = {
      email: value.email,
      password: value.password,
    };
    dispatch(loginUser(data));
  };

  return (
    <div className="SignIn mt-5">
      <div className="signin-label">
        <div className="label_img">
          <img className="label_img" src={bgSignin} alt="Travelgo" />
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
              Sign in
            </h3>
            <div className="form-holder singup-active">
              <Field
                name="email"
                type="text"
                className={
                  "signup-form-control" +
                  (errors.email && touched.email ? " is-invalid" : "")
                }
                placeholder="Input email"
                onKeyUp={handleChange}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-holder">
              <Field
                name="password"
                type="password"
                className={
                  "signup-form-control" +
                  (errors.password && touched.password ? " is-invalid" : "")
                }
                placeholder="Input password"
                onKeyUp={handleChange}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="w-full -mt-10 h-12 flex justify-end">
              <a
                href="/forgot-password"
                style={{ textDecoration: "none", marginTop: "20px" }}
                className=""
              >
                Forget Password ?
              </a>
            </div>

            {error ? (
              <p style={{ color: "#DC0000" }}>{error.response.data}</p>
            ) : (
              <></>
            )}
            <div className="form-login mt-4 flex justify-center">
              <button className="signup-submit" type="submit">
                Sign in
              </button>
            </div>
            <div className="w-full -mt-4 flex flex-col justify-center">
              <Divider>or</Divider>
              <div className="w-full -mt-4 flex justify-center items-center">
                <div className="flex-1">
                  <a
                    href="https://winshop-server.onrender.com/api/auth/google"
                    target="_blank"
                    class="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-3 text-sm text-center bg-red-500 text-white transition-colors duration-200 transform border rounded-lg dark:text-gray-300 dark:border-gray-300 hover:bg-gray-600 dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-google"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                    </svg>
                  </a>
                </div>
                <div className="flex-1">
                  <a
                    href="https://winshop-server.onrender.com/api/auth/facebook"
                    target="_blank"
                    class="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-3 text-sm text-center bg-blue-500 text-white transition-colors duration-200 transform border rounded-lg dark:text-gray-300 dark:border-gray-300 hover:bg-gray-600 dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-facebook"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p>
                Don't have account ?{" "}
                <span>
                  <Link to="/sign-up" style={{ textDecoration: "none" }}>
                    Sign up
                  </Link>
                </span>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signin;
