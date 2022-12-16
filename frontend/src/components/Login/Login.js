import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let loginObj = {};
    loginObj.username = email;
    loginObj.password = pass;
    console.log(loginObj);
    fetch("/login", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(loginObj),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.login) {
          console.log(`Logged in as userID: ${data.userID}`);
          alert(`Logged in as userID: ${data.userID}`);
          props.sendUserID(data.userID);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter email here"
          id="email"
          name="email"
        />
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          className="input"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        <button type="submit" className="button">
          Login
        </button>
      </form>
      <button
        className="button"
        onClick={() => {
          navigate("/register");
        }}
      >
        Don't have an account? Register here.
      </button>
    </div>
  );
};

export default Login;
