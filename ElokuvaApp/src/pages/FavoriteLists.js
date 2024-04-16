import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./FavoriteLists.css";
import { UserContext } from "../context/UserContext";

function FavoriteLists() {
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchFavoriteLists = async () => {
      try {
        if (user && user.token) {
          const response = await fetch(
            "http://localhost:3001/api/favorite-lists",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
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

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/favorite-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ favorite_list_name: newListName }),
      });
      if (!response.ok) throw new Error("Failed to create list");
      const newList = await response.json();
      setFavoriteLists([...favoriteLists, newList]);
      setNewListName(""); // Clear the input field
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/favorite-lists/${listId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete list");
      setFavoriteLists(favoriteLists.filter((list) => list.id !== listId));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <div className="favorite-lists">
      <h1>Suosikkilistat</h1>
      <form onSubmit={handleCreateList}>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Uusi suosikkilista"
        />
        <button type="submit">Luo</button>
      </form>
      <ul>
        {favoriteLists.map((list, index) => (
          <li key={list.id || index}>
            <Link to={`/personal/favoriteLists/${list.id}`}>
              {list.favorite_list_name}
            </Link>
            <button onClick={() => handleDeleteList(list.id)}>Poista</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteLists;
