import "./style.css";
import { Cancel, Room } from "@material-ui/icons";
import { useState, useRef } from "react";
import mapService from "../../services/mapService";

function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await mapService.login(user);
      myStorage.setItem("user", res.data.username);
      setShowLogin(false);
      setCurrentUser(res.data.username);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="background">
      <div className="main-wrapper">
        <div className="logo">
          <Room />
          <span>Map Pinning Login</span>
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
            type="password"
            placeholder="password"
            ref={passwordRef}
            required
          />
          <button className="btn-login">Login</button>
          {error && <span className="error-alert">Something went wrong</span>}
        </form>
        <Cancel className="cancel-icon" onClick={() => setShowLogin(false)} />
      </div>
    </div>
  );
}

export default Login;
