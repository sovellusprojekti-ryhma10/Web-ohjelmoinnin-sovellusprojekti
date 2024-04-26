import React, { useState } from "react";
import "./Login.css";
import "../index.css";
import { useUser } from "../context/useUser";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

import { useNavigate } from "react-router-dom";
 
export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useUser();
    const navigate = useNavigate(); // Use useNavigate for redirection

  const validate = async (e) => {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      try {
        const data = { username: username, password: password };
        await register(data);
        // Assuming the register function now handles redirection and alerts
      } catch (error) {
        if (error.response.status === 409) {
          toast.error("Tili on jo olemassa");
        }
        console.error("Error registering:", error);
        // Optionally, handle the error, e.g., by showing an error message
      }
    } else {
      toast.error("Täytä kaikki kentät");
    }
  };

  return (
    <div className="formcontent">
      <form id="create" onSubmit={validate}>
        <h1>Luo tili</h1>
        <h2>Käyttäjätiedot</h2>
        <div>
          <p className="formlabel">Käyttäjänimi</p>
          <input
            className="input"
            value={username}
            placeholder="Käyttäjänimi"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <p className="formlabel">Salasana </p>
          <input
            className="input"
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id="submit">Luo tili</button>
      </form>
      <p>
        Onko sinulla jo tili? <Link to="/login">Kirjaudu sisään</Link>
        </p>
    </div>
  );
}
