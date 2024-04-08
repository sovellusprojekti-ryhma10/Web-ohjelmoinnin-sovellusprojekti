import "./Navbar.css";
import React from "react";
import { Link } from "react-router-dom";

import UserProvider from '../context/UserProvider'
import PrivateRoute from '../pages/PrivateRoute'

import Group from "../icons/group.png";
import Search from "../icons/search.png";
import Grouppage from "../icons/groupPage.png";
import Koti from '../icons/home.png';
import Profile from '../icons/profile.png';
import Settings from '../icons/settings.png';
import Shows from '../icons/shows.png';
import Sort from '../icons/sort.png';

export default function Navbar() {

    return (
        <nav>

            <div className="navbar">
        
                <h1>Elokuva-sivusto</h1>
                <p>Löydä elokuva</p>
                <div>
                    <div className="selectBubble">
                    <img src={Search} className="icon" alt="find Icon" />  <p> <Link to="/">Etsi elokuvaa </Link></p>
                    </div>
                    <div className="selectBubble">
                    <img src={Shows} className="icon" alt="Schedule Icon" />   <p>Aikataulut</p>
                    </div>

                </div>
                <br></br>
                <br></br>
                <p>Käyttäjät</p>
                <div className="selectBubble">
                    <img src={Profile} className="icon" alt="Profile Icon" />   <p>Etsi käyttäjiä</p>
                    </div>
                    <div className="selectBubble">
                    <img src={Group} className="icon" alt="Group Icon" />   <p>Etsi ryhmiä</p>
                    </div>
                    <div className="selectBubble">
                    <img src={Koti} className="icon" alt="Home Icon" />  <p>  <Link to="login">Login</Link></p>
                </div>
            </div>

        </nav>
    );
}
