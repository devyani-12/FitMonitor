import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { loginUser } from "../utils/API";
import Auth from "../utils/auth";
import Header from "../components/Header";

export default function Login() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loggedIn = Auth.loggedIn();

  // Update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(false);

    try {
      const response = await loginUser(formState);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const { token } = await response.json();
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
      setShowAlert(true);
    } finally {
      setFormState({ password: "" });
    }
  };

  // If the user is logged in, redirect to the home page
  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
      <Header />
      <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">
        {/* Email */}
        <label htmlFor="email">Email</label>
        <input
          className="form-input"
          value={formState.email}
          placeholder="youremail@gmail.com"
          name="email"
          type="email"
          onChange={handleChange}
        />

        {/* Password */}
        <label htmlFor="password">Password</label>
        <input
          className="form-input"
          value={formState.password}
          placeholder="********"
          name="password"
          type="password"
          onChange={handleChange}
        />

        {/* Login Button */}
        <div className="btn-div">
          <button
            disabled={!(formState.email && formState.password)}
            className="signup-btn mx-auto my-auto"
          >
            Login
          </button>
        </div>

        {/* Signup Link */}
        <p className="link-btn">
          New to FitMonitor? <Link to="/signup">Create one</Link>
        </p>

        {/* Error Alert */}
        {showAlert && <div className="err-message">Login failed: {errorMessage}</div>}
      </form>
    </div>
  );
}