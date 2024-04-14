import React, { useEffect } from "react";
import { useUser } from "../context/useUser"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

export default function Logout() {
 const { setUser } = useUser();
 const navigate = useNavigate();

 useEffect(() => {
    // Clear the user state
    setUser(null);
    // Remove the user object from sessionStorage
    sessionStorage.removeItem("user");
    // Navigate to the login page
    navigate("/login");
 }, [setUser, navigate]);

 return <p>You have logged out.</p>;
}
