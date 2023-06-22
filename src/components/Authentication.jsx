import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./Authentication.css";

const Authentication = (props) => {
  const [authOption, setAuthOption] = useState(true);
  const changeOption = (e) => {
    e.preventDefault();
    if (e.target.value === "Login" && !authOption) {
      setAuthOption(true);
    } else if (e.target.value === "Register" && authOption) {
      setAuthOption(false);
    }
  };
  return (
    <div className="main-auth">
      <div className="auth-options">
        <div id="auth-login">
          <input type="button" value="Login" onClick={changeOption} />
        </div>
        <div id="auth-register">
          <input type="button" value="Register" onClick={changeOption} />
        </div>
      </div>
      <div className="auth-form">
        {authOption ? (
          <Login setUser={props.setUser} />
        ) : (
          <Register setUser={setAuthOption} />
        )}
      </div>
    </div>
  );
};

export default Authentication;
