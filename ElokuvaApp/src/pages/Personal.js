import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Import Link
import "./Personal.css";
import "../index.css";
import { useUser } from "../context/useUser";

export default function Personal() {
  const { user } = useUser();

  return (
    <div>
      <h1>Tervetuloa, {user.username}!</h1>
      <div className="container">
        <div>
          <Link to="/Personal/FavoriteLists">
            <h2>Suosikkilistat</h2>
          </Link>
        </div>
        <div>
          <h2>Ryhmät</h2>
        </div>
      </div>
    </div>
  );
}
