import React, { useState } from "react";
import "./Login.css";
import "../index.css";
import { useUser } from "../context/useUser";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useUser();

  const validate = async (e) => {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      try {
        const data = { username: username, password: password };
        await register(data);
      } catch (error) {
        console.error("Error registering:", error);
      }
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