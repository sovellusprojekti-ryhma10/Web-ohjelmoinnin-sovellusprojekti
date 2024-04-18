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

  return (
    <div>
      <h1>Tervetuloa, {user.username}!</h1>
      <div className="container">
        <div>
          <h2>Suosikkilistat</h2>
          <Link to="/Personal/FavoriteLists">
            <button>Mene suosikkilistoihin</button>
          </Link>
        </div>
        <div>
          <h2>Groups</h2>
          <div className="group-list" style={{ height: '300px', overflowY: 'scroll' }}>
          <ul>
            {groups.map(group => (
              <li key={group.group_id}>
                <span className="group-name1">{group.group_name}</span>
                <span className="created-by1">{group.creator_username}</span>
                <span className="group-description1" title={group.content}>Ryhmän kuvaus</span>
                <Link to={`/group/${group.group_id}`}>
                  <button>Mene ryhmänsivuille</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Personal;
