import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseSetup";
import "./Login.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };
  const loginUser = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        props.setUser(userCredentials.user.uid);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="login-form">
      <form onSubmit={loginUser}>
        <input name="email" type="email" onChange={updateEmail} />
        <input name="password" type="password" onChange={updatePassword} />
        <input id="submit-btn" type="submit" />
      </form>
    </div>
  );
};

export default Login;
