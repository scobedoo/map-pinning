import "./style.css";
import { Cancel, Room } from "@material-ui/icons";
import { useState, useRef } from "react";
import mapService from "../../services/mapService";

function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      await mapService.register(newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="background">
      <div className="main-wrapper">
        <div className="logo">
          <Room />
          <span>Map Pinning Register</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="username"
            ref={nameRef}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="email"
            ref={emailRef}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="password"
            ref={passwordRef}
            required
          />
          <button className="btn-register">Register</button>
          {success && (
            <span className="success-alert">
              Register Success. You can login now!
            </span>
          )}
          {error && <span className="error-alert">Something went wrong</span>}
        </form>
        <Cancel
          className="cancel-icon"
          onClick={() => setShowRegister(false)}
        />
      </div>
    </div>
  );
}

export default Register;
