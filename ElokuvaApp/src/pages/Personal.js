import React, { useContext } from "react";
import "./Personal.css";
import { useUser } from "../context/useUser";
import { useNavigate } from "react-router-dom";

export default function Personal() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <h1>Tervetuloa, {user.username}</h1>
      <div className="container">
        <div>
          <h2>Suosikkilistat</h2>
          {/* Suosikkilistojen listaus */}
        </div>
        <div>
          <h2>Ryhmät</h2>
          {/* Ryhmälistaus */}
        </div>
      </div>
    </div>
  );
}
