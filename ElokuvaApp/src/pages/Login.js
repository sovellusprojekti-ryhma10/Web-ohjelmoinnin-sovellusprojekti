import { useNavigate } from "react-router-dom";
import "./Login.css";
import React, { useState } from "react";
import { useUser } from "../context/useUser";
import "../index.css";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

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
        } catch (error) {
         console.error("Error logging in:", error);
      }
    } else {
      toast.error("Täytä kaikki kentät");
    }
  };



  return (
    <div className="formcontent">
      <form id="login-form" onSubmit={validate}>
        <h1>Kirjaudu</h1>
        <h2>Käyttäjätiedot</h2>
        <div>
<<<<<<< HEAD
           <p className="formlabel">Käyttäjänimi</p>
 
=======
          <label htmlFor="username-input" className="formlabel">
            Käyttäjänimi
          </label>
>>>>>>> 780cb2b009d262ff1900f6befaee19b4bd9d5af2
          <input
            className="input"
            value={username}
            placeholder="Käyttäjänimi"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
<<<<<<< HEAD
           <p className="formlabel">Salasana </p>
 
=======
          <label htmlFor="password-input" className="formlabel">
            Salasana
          </label>
>>>>>>> 780cb2b009d262ff1900f6befaee19b4bd9d5af2
          <input
            className="input"
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id="login-submit" type="submit">
          Kirjaudu
        </button>
      </form>
      <div id="accounts">
      <Link className="linksign" to="/CreateAcc">
        Luo tili
      </Link>
      <Link className="linksign" to="/Remove">
        Poista tili
      </Link>
      </div>
    </div>
  );
}
