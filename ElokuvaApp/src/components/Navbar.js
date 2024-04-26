import "./Navbar.css";
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/useUser";
import Group from "../icons/group.png";
import Search from "../icons/search.png";
import Koti from "../icons/home.png";
import Profile from "../icons/profile.png";
import Shows from "../icons/shows.png";
import Hambourger from "./Hambourger.js";

/**
 * Renders the navigation bar component.
 * @returns {JSX.Element} The rendered navigation bar.
 */
export default function Navbar() {
  const { user } = useUser();

  /**
   * Handles the logout functionality.
   */
  const handleLogout = () => {
    sessionStorage.removeItem("user");

    // Redirect to the login page
    window.location.href = "/login";
  };

  return (
    <nav>
      <Hambourger />
      <div className="navbar">
        <h1>Elokuva-sivusto</h1>
        <p>Löydä elokuva</p>
        <div>
          <div className="selectBubble">
            <img src={Search} className="icon" alt="find Icon" />{" "}
            <p>
              {" "}
              <Link to="/">Etsi elokuvaa </Link>
            </p>
          </div>
          <div className="selectBubble">
            <img src={Shows} className="icon" alt="Schedule Icon" />{" "}
            <p>
              <Link to="/showtimes">Näytösajat</Link>
            </p>
          </div>
        </div>
        <br></br>
        <br></br>
        {user && (
          <>
            <p>Käyttäjät</p>
            <div className="selectBubble">
              <img
                src={Profile}
                className="icon"
                alt="Profile Icon"
              />
              <p>
                <Link to="Personal">Oma sivu</Link>
              </p>
            </div>
          </>
        )}
        <div className="selectBubble">
          <img src={Group} className="icon" alt="Group Icon" />
          <p>
            <Link to="Group">Etsi ryhmiä</Link>
          </p>{" "}
        </div>
        <div className="selectBubble">
          <img src={Koti} className="icon" alt="Home Icon" />{" "}
          {user === null && (
            <p>
              {" "}
              <Link to="login">Kirjaudu</Link>
            </p>
          )}
          {user && (
            <p className="logout-button" onClick={handleLogout}>
              Uloskirjaudu
            </p>
          )}
        </div>
      </div>
    </nav>
  );
}
