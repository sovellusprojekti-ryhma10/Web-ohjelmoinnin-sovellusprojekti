import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./MoviePage.css";
import { UserContext } from "../context/UserContext";

function MoviePage() {
  const { movieID, mediaType } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const { user } = useContext(UserContext);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${movieID}?language=en-US&api_key=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovieDetails();
  }, [movieID, mediaType, API_KEY]);

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

  const handleAddToFavoriteList = async () => {
    try {
      // Ensure a list has been selected
      if (!selectedListId) {
        throw new Error("No list selected");
      }

      // Prepare the content to be added to the favorite list
      const listContent = [
        {
          movie_name: movieDetails.title || movieDetails.name,
        },
      ];

      // Send the request to the correct endpoint
      const response = await fetch(
        `http://localhost:3001/api/favorite-lists/${selectedListId}/content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ list_content: listContent }),
        }
      );
      if (!response.ok) throw new Error("Failed to add to favorites");

      // Clear selected list
      setSelectedListId("");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <div className="movie-details">
      {movieDetails && (
        <>
          <img
            src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
            style={{ maxHeight: "300px", width: "auto" }}
            alt="Movie Poster"
          />
          <div className="description-container">
            <h2>{movieDetails.title || movieDetails.name}</h2>
            <p>
              Genres:{" "}
              {movieDetails.genres &&
                movieDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p>Overview: {movieDetails.overview}</p>
            <p>Release Date: {movieDetails.release_date}</p>
            <p>Vote Average: {movieDetails.vote_average}</p>
          </div>
          {user && (
            <>
              <select
                value={selectedListId}
                onChange={(e) => {
                  console.log("Dropdown value changed:", e.target.value); // Debugging line
                  setSelectedListId(e.target.value);
                }}
              >
                <option value="">Valitse suosikkilista</option>
                {favoriteLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.favorite_list_name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddToFavoriteList}>
                Lisää suosikkilistaan
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MoviePage;
