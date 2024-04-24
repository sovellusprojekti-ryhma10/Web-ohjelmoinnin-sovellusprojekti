import { useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/useUser";
import Group from "../icons/group.png";
import Koti from "../icons/home.png";
import Profile from "../icons/profile.png";
import Shows from "../icons/shows.png";
import styles from "./Hamburger.css";

function Hambourger() {
    const { user } = useUser();

    // adding the states
    const [isActive, setIsActive] = useState(false);

    //add the active class
    const toggleActiveClass = () => {
        setIsActive(!isActive);
        console.log(isActive);
    };

    //clean up function to remove the active class
    const removeActive = () => {
        setIsActive(false);
    };

    return (
        <div className="hamburgernav">
            <MenuRoundedIcon
                className={`${isActive ? styles.active : "hide"}`}
                onClick={toggleActiveClass}
            />
            <MenuOpenRoundedIcon
                className={`hide ${isActive ? styles.active : "show"}`}
                onClick={toggleActiveClass}
            />

            <div
                className={`hamburger${isActive ? styles.active : "show"}`}
                onClick={toggleActiveClass}
            >
                {user && (
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
                )}
                <div className="selectBubble">
                    <img src={Shows} className="icon" alt="Schedule Icon" />{" "}
                    <p>
                        <Link to="/showtimes">Näytösajat</Link>
                    </p>
                </div>

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
                            <Link to="login">Login</Link>
                        </p>
                    )}
                    {user && <Link to="/logout">Logout</Link>}{" "}
                </div>
            </div>
        </div>
    );
}

export default Hambourger;
