import React, { useState } from "react";
import "./Login.css";
import "../index.css";
import { useUser } from "../context/useUser";
import { Link } from "react-router-dom";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useUser();
  const error = ''
  const validate = async (e) => {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      try {
        const data = { username: username, password: password };
        await register(data);
      } catch (error) {
        if (error === 409) {

          alert("account already exists");
        }

        console.error("Error registering:", error);
      }
    } else {
      alert("Täytä kaikki kentät");
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
      <Link className="linksign" to="/Remove">
        Poista tili
      </Link>
    </div>
  );
}
