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
import { useSession, signIn, signOut } from "next-auth/react"; // Importa solo lo necesario de next-auth/react
import { MarkGithubIcon } from "@primer/octicons-react";

const Signin = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const [loginGithub, setLoginGithub] = useState(false);
  const { email, password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();
  const { data: session } = useSession();

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
    let newAvatar =
      "https://res.cloudinary.com/ddtwmoh7j/image/upload/v1700484068/avatar_user_edwqfe.png";

    if (newCurrentUser?.avatar) {
      newAvatar = newCurrentUser.avatar;
    }
    const currentUser = {
      name: newCurrentUser.given_name,
      last_name: newCurrentUser.family_name,
      phone_number: " ",
      address: " ",
      country_of_residence: " ",
      email: newCurrentUser.email,
      password: "123456",
      cf_password: "123456",
      avatar: newAvatar,
    };
    console.log("currentUser ", currentUser);

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
    if (session) {
      const { email, name, image } = session.user;
      const currentUser = {
        email,
        given_name: name,
        family_name: " ",
        avatar: image,
      };
      userRegister(currentUser);
    }
  }, [session]);

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);

  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <div className="container-fluid">
        <Head>
          <title>Sign in Page</title>
        </Head>

        <div className="login-ecommerce">
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

            <button type="submit" className="btn btn-dark w-100">
              Login
            </button>
          </form>

          <div className="mx-auto bt-integration ">
            <button
              className="btn btn-dark flex-grow-1 me-2 d-flex align-items-center justify-content-center w-100"
              onClick={() => {
                signIn("github");
                console.log("enter");
              }}
            >
              <MarkGithubIcon size={16} className="me-2 mr-2" />
              Sign in with GitHub
            </button>

            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
                const newCurrentUser = jwt.decode(
                  credentialResponse.credential
                );
                userRegister(newCurrentUser);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              useOneTap
            />
          </div>
          <div className="register">
            <p className="my-2">You don't have an account?</p>

            <Link href="/register">
              <button className=" btn btn-dark mt-2">Register Now</button>
            </Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signin;
