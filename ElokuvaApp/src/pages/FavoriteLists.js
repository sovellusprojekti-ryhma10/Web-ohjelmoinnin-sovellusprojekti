import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./FavoriteLists.css";
import { UserContext } from "../context/UserContext";

function FavoriteLists() {
  const [favoriteLists, setFavoriteLists] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchFavoriteLists = async () => {
      try {
        if (user && user.token) {
          const response = await fetch("http://localhost:3001/api/favorite-lists", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setFavoriteLists(data);
        }
      } catch (error) {
        console.error("Error fetching favorite lists:", error);
      }
    };

    fetchFavoriteLists();
  }, [user]);

  return (
    <div className="favorite-lists">
      <h1>Suosikkilistat</h1>
      <ul>
        {favoriteLists.map((list, index) => (
          <li key={list.id || index}>
            <Link to={`/personal/favoriteLists/${list.id}`}>
              {list.favorite_list_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteLists;


