import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Personal.css';
import { useUser } from "../context/useUser";

const Personal = () => {
  const { user } = useUser();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:3001/group/user/all', {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }); 

      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const data = await response.json();
      setGroups(data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Haluatko varmasti poistaa käyttäjätilisi?")) {
      console.log("User confirmed account deletion.");
      // adding some stuff to help remove account
      console.log(user.token);
      try {
        const response = await fetch("http://localhost:3001/user/delete", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response received:", response);

        if (!response.ok) {
          console.error("Failed to delete account:", response.statusText);
          throw new Error("Failed to delete account");
        }

        const responseData = await response.json();
        console.log("Response data:", responseData);

        alert("Käyttäjätili poistettu");
        window.location.href = "/login";
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Virhe tiliä poistaessa");
      }
    } else {
      console.log("User cancelled account deletion.");
    }
  };

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
          <div
            className="group-list"
            style={{ height: "300px", overflowY: "scroll" }}
          >
            <ul>
              {groups.map((group) => (
                <li key={group.group_id}>
                  <span className="group-name1">{group.group_name}</span>
                  <span className="created-by1">{group.creator_username}</span>
                  <span className="group-description1" title={group.content}>
                    Ryhmän kuvaus
                  </span>
                  <Link to={`/group/${group.group_id}`}>
                    <button>Mene ryhmänsivuille</button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 onClick={handleDeleteAccount} style={{ cursor: "pointer" }}>
            Poista käyttäjätili
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Personal;
