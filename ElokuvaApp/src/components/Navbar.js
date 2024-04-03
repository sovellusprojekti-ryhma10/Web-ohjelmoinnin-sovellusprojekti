import { Link } from "react-router-dom";
import "./Navbar.css";
import React from "react";

import { useUser } from "../context/useUser";
import { useNavigate } from "react-router-dom";
import Group from "../icons/group.png";
import Search from "../icons/search.png";

export default function Navbar() {
    const { user } = useUser();
    return (
        <nav>
            <div className="navbar">
                <h1>Elokuva-sivusto</h1>
                <p>Löydä elokuva</p>
                <ul>
                    <li>
                        <Search/><Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/weather">Weather</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        {user === null && <Link to="/login">Login</Link>}
                        {user && <Link to="/logout">Logout</Link>}
                    </li>
                </ul>
            </div>
        </nav>
    );
}
