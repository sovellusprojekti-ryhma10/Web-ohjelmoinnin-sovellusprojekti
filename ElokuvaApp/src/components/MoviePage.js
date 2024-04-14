import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MoviePage.css";


// API keyt haetaan .envistä
const AUTH_TOKEN = process.env.REACT_APP_READ_ACCESS_TOKEN;
const API_KEY = process.env.REACT_APP_API_KEY;

function MoviePage() {
  // Mediatyypin arvo on joko 'movie' tai 'tv' ja valitaan MovieSearch -sivulla, josta se tulee tähän funktioon
  const { movieID, mediaType } = useParams(); // Leffan ID otetaan urlin parametreista
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    if (movieID) {
      const fetchMovieDetails = async () => {
        try {
          const options = {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: AUTH_TOKEN,
            },
          };

          console.log(mediaType);


          const response = await fetch(
            `https://api.themoviedb.org/3/${mediaType}/${movieID}?language=en-US&api_key=${API_KEY}`,
            options
          );
          const data = await response.json();
          setMovieDetails(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchMovieDetails();
    }
  }, [movieID]);

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
            <h2>{movieDetails.title}</h2>
            <h2>{movieDetails.name}</h2>
            <p>
              Genres:{" "}
              {movieDetails.genres &&
                movieDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p>Overview: {movieDetails.overview}</p>
            <p>Release Date: {movieDetails.release_date}</p>
            <p>Vote Average: {movieDetails.vote_average}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default MoviePage;