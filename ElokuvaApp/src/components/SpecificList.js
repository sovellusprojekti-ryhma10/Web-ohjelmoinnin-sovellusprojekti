import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./SpecificList.css";

function SpecificList() {
  const { listId } = useParams();
  const [listContent, setListContent] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
          console.log("Raw data from API:", data);
          // Assuming the API response is an array of objects, each with a list_content property
          setListContent(data);
        }
      } catch (error) {
        console.error("Error fetching list content:", error);
      }
    };

    fetchListContent();
  }, [listId, user]);

  const navigateToMovieSearch = () => {
    navigate("/");
  };

  if (!listContent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="specific-list-container">
      <ul>
        {listContent.map((item, index) =>
          item.list_content.map((movie, movieIndex) => (
            <li key={`${index}-${movieIndex}`}>{movie.movie_name}</li>
          ))
        )}
      </ul>
      <button onClick={navigateToMovieSearch}>Lisää elokuvia</button>
    </div>
  );
}

export default SpecificList;
