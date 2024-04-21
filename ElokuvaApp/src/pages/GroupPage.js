import React, { useState, useEffect } from 'react';
import { useParams, Link  } from 'react-router-dom';
import './GroupPage.css'; 
import { useUser } from "../context/useUser";

const GroupPage = () => {
  const { user } = useUser();
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [description, setDescription] = useState('');
  const [groupLists, setGroupLists] = useState([]);
  const [movies, setMovies] = useState([]);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/group/${groupId}`, {
          headers: {
        Authorization: `Bearer ${user.token}`
      }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch group information');
        }
        const data = await response.json();
        console.log(data);
        setGroupInfo(data);
      } catch (error) {
        console.error('Error fetching group information:', error);
      }
    };

    fetchGroupInfo();
  }, [groupId]);

  useEffect(() => {
    const fetchGroupPageContent = async () => {
        try {
            const response = await fetch("http://localhost:3001/group/get/pages/content", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ groupId }), 
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data); 
            setGroupLists(data);
            fetchMovies(data); 
        } catch (error) {
            console.error("Error fetching group content list:", error);
        }
    };

    fetchGroupPageContent();
}, [groupId, user]);

useEffect(() => {
  fetchMovies(groupLists);
}, [groupLists]);

const fetchMovies = async (data) => {
  try {
      const movieIds = data.map((movie) => movie.movie_id);
      const moviesData = await Promise.all(
          movieIds.map(async (movieId) => {
              const response = await fetch(
                  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
              );
              if (!response.ok) {
                  throw new Error(`Failed to fetch movie with ID ${movieId}`);
              }
              return response.json();
          })
      );
      setMovies(moviesData);
  } catch (error) {
      console.error("Error fetching movies:", error);
  }
};

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDescriptionSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/description`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, groupId }),
      });
      if (!response.ok) {
        throw new Error('Failed to save description');
      }

      setGroupInfo(prevGroupInfo => ({
        ...prevGroupInfo,
        groupData: [{ content: description }],
      }));

      setDescription('');
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };

  const handleRemoveFromGroup = async (memberName, request) => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/remove/person`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, memberName }),
      });
      if (!response.ok) {
        throw new Error('Failed to update member status');
      }
      console.log(`Marking ${memberName} as removed from the group`);
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };
  const handleAddToGroup = async (request) => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/make/member`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ groupId, request }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user to group');
      }
      console.log(`Marking ${request} as member`);
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const handleGiveAdmin = async (memberName) => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/make/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({groupId, memberName }),
      });
      if (!response.ok) {
        throw new Error('Failed to update member to admin');
      }
      console.log(`Marking ${memberName} as admin`);
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const handleRemoveAdmin = async (admin) => {
    const memberName = admin;
    console.log(admin);
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/remove/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({groupId, memberName}),
      });
      if (!response.ok) {
        throw new Error('Failed to update admin to member');
      }
      console.log(`removing  ${admin}s admin rights`);
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };
  const handleDeleteGroup = async () => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/remove/group`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({groupId}),
      });
      if (!response.ok) {
        throw new Error('Failed to remove group');
      }
      console.log(`removed group`);
    } catch (error) {
      console.error('Error removing group:', error);
    }
  };

  if (!groupInfo) {
    return <div>Loading...</div>;
  }

  const { groupName, createdBy, groupData, groupMembers, isAdmin, groupAdmins, requestToJoin, isCreatedBy } = groupInfo;
  const content = groupData.length > 0 ? groupData[0].content : "No content available";
  console.log(groupName, createdBy, groupData);

  return (
    <div className="group-page-body">

        <div className="group-movies-time-container">
        <h1>Ryhmän nimi: {groupName}</h1>
        <h2>Näytösajat</h2>
        <p>Esimerkki aika 15.00</p>
        <p>Esimerkki aika 15.00</p>
        <p>Esimerkki aika 15.00</p>
        <p>Esimerkki aika 15.00</p>
        <p>Esimerkki aika 15.00</p>
        </div>
        <div class="group-container">

          <div className="group-movies-container">
      <h2>Elokuvat</h2>
        {movies.map((movie) => (
          <div key={movie.id} className="group-movie-info">
            <Link to={`/movie/${movie.id}`} key={movie.id}>
            <h3>{movie.title}</h3>
            </Link>
          </div>
        ))}
        </div>

        
    <div className="group-page-container">
      <h2>Käyttäjät</h2>
      
      {requestToJoin.map((request, index) => (
  <div key={index}>
    <span>{request}</span>

    {isAdmin && (
      <>
        <button onClick={() => handleAddToGroup(request)}>Hyväksy pyyntö</button>
        <button onClick={() => handleRemoveFromGroup(request)}>Hylkää pyyntö</button>
      </>
    )}

  </div> 
  ))}
      {isAdmin && (
            <>
      <p>Pyytää liittymään ryhmään:</p>
      </>
          )}

      <p>Ryhmä Jäsenet:</p>
      {groupMembers.map((member, index) => (
  <div key={index}>
    <span>{member}</span>
    {isAdmin && (
      <>
        <button onClick={() => handleRemoveFromGroup(member)}>poista ryhmästä</button>
          <button onClick={() => handleGiveAdmin(member)}>anna admin</button>
          </>
          )}

  </div> 
))}
      {groupAdmins.map((admin, index) => (
  <div key={index}>
    <span>{admin}</span>

    {isAdmin && (
      <>
        <button onClick={() => handleRemoveFromGroup(admin)}>poista ryhmästä</button>
        <button onClick={() => handleRemoveAdmin(admin)}>poista admin</button>
      </>
    )}
  </div> 
))}


      <div className="description">
      {isAdmin && (
            <>
            <p>Ryhmän kuvaus: {content}</p>
      <textarea
        defaultValue={content} 
        onChange={handleDescriptionChange}
        placeholder="Type description here..."
      />
      <button onClick={handleDescriptionSubmit}>Submit Description</button>
      </>
          )}
          <div>
          <button onClick={handleDeleteGroup}>Poista Ryhmä</button>
          </div>
          </div>
    </div>
    </div>
    </div>
  );
};


export default GroupPage;
