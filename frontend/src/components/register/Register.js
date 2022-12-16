import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [response, setResponse] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let registerObj = {};
    registerObj.username = email;
    registerObj.password = pass;
    console.log(registerObj);
    fetch("/register", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(registerObj),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        // {success:true/false, exists: true/false}
        if (data.success){
          setResponse("Account Created!");
        }else{
          if (data.exists){
            setResponse("Account Already Exists");
          }else{
            setResponse("Unknown Error: Please Try Again");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
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
          Register
        </button>
      </form>
      <div>
        {response}
      </div>
      <button
        className="button"
        onClick={() => {
          navigate("/login");
        }}
      >
        Already have an account? Log in here.
      </button>
    </div>
  );
};

export default Register;
