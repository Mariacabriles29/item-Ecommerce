import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwt from "jsonwebtoken";
import valid from "../utils/valid";

const Signin = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const userRegister = async (newCurrentUser) => {
    const errMsg = valid(
      newCurrentUser.given_name,
      newCurrentUser.family_name,
      " ",
      " ",
      " ",
      newCurrentUser.email,
      "123456",
      "123456"
    );

    if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const currentUser = {
      name: newCurrentUser.given_name,
      last_name: newCurrentUser.family_name,
      phone_number: " ",
      address: " ",
      country_of_residence: " ",
      email: newCurrentUser.email,
      password: "123456",
      cf_password: "123456",
    };

    const res = await postData("auth/register", currentUser);

    if (res.success) {
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      signInGoogle({ email: newCurrentUser.email, password: "123456" });
    } else {
      setUserData({ email: newCurrentUser.email, password: "123456" });
      signInGoogle({ email: newCurrentUser.email, password: "123456" });
    }
  };

  const signInGoogle = async (newUser) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData("auth/login", newUser);

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    dispatch({ type: "NOTIFY", payload: { success: res.msg } });

    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });

    Cookie.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });

    localStorage.setItem("firstLogin", true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData("auth/login", userData);

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    dispatch({ type: "NOTIFY", payload: { success: res.msg } });

    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });

    Cookie.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });

    localStorage.setItem("firstLogin", true);
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);
  //304531247476-58f940f3b0dgrupg95cdo8b51fspupdv.apps.googleusercontent.com
  return (
    <GoogleOAuthProvider clientId="304531247476-58f940f3b0dgrupg95cdo8b51fspupdv.apps.googleusercontent.com">
      <div>
        <Head>
          <title>Sign in Page</title>
        </Head>

        <div />

        <form
          className="mx-auto my-4"
          style={{ maxWidth: "500px" }}
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              value={email}
              onChange={handleChangeInput}
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={password}
              onChange={handleChangeInput}
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100"
            onClick={() => signIn}
          >
            Login
          </button>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);

              const newCurrentUser = jwt.decode(credentialResponse.credential);
              userRegister(newCurrentUser);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />

          <p className="my-2">
            You don't have an account?{" "}
            <Link href="/register">
              <button style={{ color: "crimson" }}>Register Now</button>
            </Link>
          </p>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signin;
