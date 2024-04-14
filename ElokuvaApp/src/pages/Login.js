import { useNavigate } from "react-router-dom";
import "./Login.css";
import React, { useState } from "react";
import { useUser } from "../context/useUser";
import "../index.css";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validate = async (e) => {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      try {
        const data = { username: username, password: password };
        await login(data);
        navigate("/");
      } catch (error) {
        console.error("Error logging in:", error);
      }
    }
  };

  return (
    <div className="formcontent">
      <form id="login-form" onSubmit={validate}>
        <h1>Kirjaudu</h1>
        <h2>Käyttäjätiedot</h2>
        <div>
          <label htmlFor="username-input" className="formlabel">
            Username
          </label>
          <input
            id="username-input"
            className="input"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password-input" className="formlabel">
            Password
          </label>
          <input
            id="password-input"
            className="input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id="login-submit" type="submit">
          Kirjaudu
        </button>
        <button id="delete-account-submit">Poista tili</button>
      </form>
      <Link className="linksign" to="/CreateAcc">
        Luo tili
      </Link>
    </div>
  );
}
