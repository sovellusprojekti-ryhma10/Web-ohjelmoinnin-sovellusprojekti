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
    </div>
  );
}

export default SpecificList;
