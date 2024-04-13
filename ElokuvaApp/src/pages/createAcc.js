import "./Login.css";
import React, { useState } from "react";
import "../index.css";
import register from "../context/UserProvider";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validate = (e) => {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      const data = { user: username, pw: password };
      register(data);
    }
  };

  return (
    <div className="formcontent">
      <form id="create" onSubmit={validate}>
        <h1>Luo tili</h1>
        <h2>Käyttäjätiedot</h2>
        <div>
          <p className="formlabel">Username</p>
          <input
            className="input"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <p className="formlabel">Password </p>
          <input
            className="input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id="submit">Create account</button>
      </form>
    </div>
  );
}
