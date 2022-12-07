import React from "react";
import { useState } from "react";
import "./Login.css";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [register, setRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let loginObj = new Object();
    loginObj.username = email;
    loginObj.password = pass;
    console.log(loginObj);
    if (register) {
      fetch("/register", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(loginObj),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } else {
      fetch("/login", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(loginObj),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => {
          res.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{register ? "Register" : "Login"}</h2>
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
          {register ? "Register" : "Login"}
        </button>
      </form>
      <button className="button" onClick={() => setRegister(!register)}>
        {register
          ? "Already have an account? Log in here."
          : "Don't have an account? Register here."}
      </button>
    </div>
  );
}
