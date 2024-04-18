import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./SpecificList.css";

function SpecificList() {
  const { listId } = useParams();
  const [listContent, setListContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [shareableLink, setShareableLink] = useState("");

  useEffect(() => {
    const fetchListContent = async () => {
      try {
        if (user && user.token) {
          const response = await fetch(
            `http://localhost:3001/api/favorite-lists/${listId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Received data:", data);
          setListContent(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching list content:", error);
        setLoading(false);
      }
    };

    fetchListContent();
  }, [listId, user]);

  // Function to generate a shareable link for the public version of the list
  const generateShareableLink = async () => {
    if (!user) {
      alert("You must be logged in to share a list.");
      return;
    }

    try {
      // Corrected the URL to include the base URL
      const response = await fetch(
        `http://localhost:3001/api/favorite-lists/${listId}/share`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create public list");
      }

      const data = await response.json();
      console.log("Server response:", data);
      const publicListId = data.publicListId;
      const shareableLink = `http://localhost:3001/public-favorite-lists/${publicListId}/content`;
      setShareableLink(shareableLink);
      navigator.clipboard.writeText(shareableLink).then(
        function () {
          alert("Link copied to clipboard. Share your list with anyone!");
        },
        function (err) {
          console.error("Could not copy text: ", err);
        }
      );
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="specific-list-container">
      {listContent.map((item, index) => {
        const movies = JSON.parse(item.list_content);
        return (
          <div key={index} className="movie-list">
            <ul>
              {movies.map((movie, movieIndex) => (
                <li key={`${index}-${movieIndex}`}>
                  <img src={movie.movie_image} alt={movie.movie_name} />
                  <h3>{movie.movie_name}</h3>
                  <p>{movie.movie_description}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <button onClick={() => navigate("/")}>Lisää elokuvia</button>
      <button onClick={generateShareableLink}>Share List</button>
      <div>
        <p>Shareable Link:</p>
        <input type="text" value={shareableLink} readOnly />
        <button onClick={() => navigator.clipboard.writeText(shareableLink)}>
          Copy Link
        </button>
      </div>
    </div>
  );
}

export default SpecificList;
