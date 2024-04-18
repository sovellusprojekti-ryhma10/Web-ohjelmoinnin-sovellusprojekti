import React, { useState, useEffect, useContext  } from 'react';

import './GroupSearchPage.css'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/useUser";


const GroupSearchPage = () => {
  const { user } = useUser();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [writeBoxText, setWriteBoxText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);
  const navigate = useNavigate();
  


  useEffect(() => {
    fetchGroups(currentPage);

    const handleScroll = (event) => {
      const delta = Math.sign(event.deltaY); // Check the direction of the scroll
      setScrollPosition((prevPosition) => prevPosition + delta * 50);
    };

    document.addEventListener('wheel', handleScroll);

    return () => {
      document.removeEventListener('wheel', handleScroll);
    };
  }, []);

  // Function to fetch groups from the backend
  const fetchGroups = async (currentPage) => {
    try { 
      const response = await fetch(
        `http://localhost:3001/group/all?currentPage=${currentPage}&perPage=${perPage}`,)
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      console.log(data);
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleJoinGroup = async (event, group_name) => {
    try {
      console.log(group_name);
      const response = await fetch(`http://localhost:3001/group/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_name: group_name })
      });
      if (!response.ok) {
        throw new Error('Failed to join group');
      }
      const groupId = await response.json();

      // testissä
      navigate(`/group/${groupId}`);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };
  

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/group/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_name: writeBoxText})
      });
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      // Fetch groups again after creating a new group to get the updated list
      fetchGroups();
      setWriteBoxText(''); // Clear the text box
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleWriteBoxChange = (event) => {
    setWriteBoxText(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchGroups(page);
  };

  const filteredGroups = groups.filter(group =>
    group.group_name && group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="group-search-container">
      <h2>Ryhmät</h2>

      <div className="group-insides1"> 

      <div className="input-group">
        <h3>Ryhmän nimi</h3>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />    
      </div>

      <div className="headers-container">
      <span className='headers'><p>Ryhmän nimi</p></span>
      <span className='headers2'><p>Ryhmän luoja</p></span>
      <span className='headers3'><p>Ryhmän kuvaus</p></span>
    </div>
    <div className="group-list" style={{ height: '300px', overflowY: 'scroll' }}>
        <ul>
          {filteredGroups.map(group => (
            <li key={group.id}>
              <span className="group-name">{group.group_name}</span>
              <span className="created-by">{group.created_by_username}</span>
              <span className="group-description" title={group.content}>Ryhmän kuvaus</span>
              <button className="button-join" onClick={(event) => handleJoinGroup(event, group.group_name)}>Liity ryhmään</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Edellinen sivu
        </button>
        <button onClick={() => handlePageChange(currentPage + 1)}>Seuraava sivu</button>
      </div>
      <div className="input-group">
        <h4>Luo uusi ryhmä</h4>
        <input
          type="text"
          placeholder="Ryhmän nimi"
          value={writeBoxText}
          onChange={handleWriteBoxChange}
        />
        <button onClick={handleButtonClick}>Luo ryhmä</button>
      </div>
    </div>
    </div>

  );
};


export default GroupSearchPage;
