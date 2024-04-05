import "./Navbar.css";
import React from "react";
import { Link } from "react-router-dom";
import Group from "../icons/group.png";
import Search from "../icons/search.png";

export default function Navbar() {

    return (
        <nav>
            <div className="navbar">
                <h1>Elokuva-sivusto</h1>
                <p>Löydä elokuva</p>
                <div>
                    <div className="selectBubble">
                       <p>d</p>
                    </div>
                    <div className="selectBubble">
                    <p>d</p>
                    </div>
                    <div className="selectBubble">
                    <p>d</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}
