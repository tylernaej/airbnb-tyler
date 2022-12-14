// frontend/src/components/LoginFormModal/LoginForm.js
import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './LoginForm.css'

function LoginForm({setShowModal}) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect (() => {
    const errorsArray = []
    if(!credential) errorsArray.push("Username can't be empty")
    if(!password) errorsArray.push("Password can't be empty")
  }, [credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    dispatch(sessionActions.login({ credential, password }))
      .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (

    <form onSubmit={handleSubmit} className='login-form'>
      <h2 className="login-bar">Log in</h2>
      <h1 className="welcome-bar">Welcome to Airbnb</h1>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <div className="form-submission-fields">
        <label>
          {/* Username or Email */}
          <input
            placeholder="Username"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          {/* Password */}
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      <button type="submit" className="submit-button" onClick={handleSubmit}>Log In</button>
      </div>
    </form>
  );
}

export default LoginForm;