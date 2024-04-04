import { Link } from "react-router-dom";
import "./Navbar.css";
import React from "react";

import Group from "../icons/group.png";
import Search from "../icons/search.png";

export default function Navbar() {

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
                       <Link to="/login">Login</Link>
                        <Link to="/logout">Logout</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
