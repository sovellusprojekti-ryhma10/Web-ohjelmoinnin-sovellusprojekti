import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./MoviePage.css";
import { UserContext } from "../context/UserContext";

function MoviePage() {
  const { movieID, mediaType } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const { user } = useContext(UserContext);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (!movieID) {
          throw new Error("Movie ID is undefined");
        }
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
    const fetchRatings = async () => {
      try {
        const url = `http://localhost:3001/movie_ratings/${movieID}`;
        console.log("Fetching ratings from:", url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched ratings:", data);
        setRatings(data.ratings); // Assuming data has a structure like { ratings: [], content: [] }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };
  
    if (movieID) {
      fetchRatings();
    }
  }, [movieID]);  

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
      if (!selectedListId) {
        throw new Error("No list selected");
      }

      // Include movie's name, image, and description in the content to be added
      const listContent = [
        {
          movie_name: movieDetails.title || movieDetails.name,
          movie_image: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`,
          movie_description: movieDetails.overview,
        },
      ];

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
      <div className="ratings-container">
        <h3>Ratings:</h3>
        <ul>
          {ratings.map((rating, index) => (
            <li key={index}>
              {/* Render rating as stars */}
              {/* Assuming rating is a number from 1 to 5 */}
              {Array.from({ length: rating.rating }, (_, i) => (
                <span key={i}>★</span>
              ))}
              {/* Render other rating details like username, review, submission date */}
              <p>Username: {rating.username}</p>
              <p>Review: {rating.review}</p>
              <p>Submission Date: {rating.submission_date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
    
  );
}

export default MoviePage;
