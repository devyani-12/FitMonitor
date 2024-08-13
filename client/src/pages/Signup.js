import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { createUser } from "../utils/API";
import Auth from "../utils/auth";
import Header from "../components/Header";

export default function Signup() {
  const loggedIn = Auth.loggedIn();

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update state based on form input
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
      const response = await createUser(formState);

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
        {/* Username */}
        <label htmlFor="username">Username</label>
        <input
          className="form-input"
          value={formState.username}
          placeholder="Your username"
          name="username"
          type="text"
          onChange={handleChange}
        />

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

        {/* Signup Button */}
        <div className="btn-div">
          <button
            disabled={!(formState.username && formState.email && formState.password)}
            className="signup-btn mx-auto my-auto"
          >
            Sign Up
          </button>
        </div>

        {/* Login Link */}
        <p className="link-btn">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        {/* Error Alert */}
        {showAlert && <div className="err-message">Signup failed: {errorMessage}</div>}
      </form>
    </div>
  );
}
