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

  const deleteMovie = async (movieName, movieImage, movieDescription) => {
    try {
      if (user && user.token) {
        // Assuming listContent is an array of objects where each object represents a movie
        // Filter out the specific movie instance
        const updatedListContent = listContent.filter(
          (movie) =>
            movie.movie_name !== movieName ||
            movie.movie_image !== movieImage ||
            movie.movie_description !== movieDescription
        );

        // Convert the updated listContent back into a JSON string
        const updatedListContentJSON = JSON.stringify(updatedListContent);

        const response = await fetch(
          `http://localhost:3001/api/favorite-lists/${listId}/movies`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
            body: updatedListContentJSON, // Send the JSON string
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete movie");
        }
        // Assuming the server responds with the updated list content
        const updatedListContentResponse = await response.json();
        setListContent(updatedListContentResponse);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="specific-list-container">
      <ul>
        {listContent.map((item, index) =>
          item.list_content.map((movie, movieIndex) => (
            <li key={`${index}-${movieIndex}`}>
              <img src={movie.movie_image} alt={movie.movie_name} />
              <h3>{movie.movie_name}</h3>
              <p>{movie.movie_description}</p>
              <button
                onClick={() =>
                  deleteMovie(
                    movie.movie_name,
                    movie.movie_image,
                    movie.movie_description
                  )
                }
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
      <button onClick={() => navigate("/")}>Lisää elokuvia</button>
    </div>
  );
}

export default SpecificList;
