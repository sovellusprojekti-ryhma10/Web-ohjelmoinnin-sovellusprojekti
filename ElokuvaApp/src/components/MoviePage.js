import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

// API keyt haetaan .envistä
const AUTH_TOKEN = process.env.REACT_APP_READ_ACCESS_TOKEN;

function MoviePage() {
  const { movieID } = useParams(); // Leffan ID otetaan urlin parametreista
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    if (movieID) {
      const fetchMovieDetails = async () => {
        try {
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: AUTH_TOKEN
            }
          };

          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options);
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
          <h2>{movieDetails.title}</h2>
          <p>Genres: {movieDetails.genres && movieDetails.genres.map(genre => genre.name).join(', ')}</p>
          <p>Overview: {movieDetails.overview}</p>
          <p>Release Date: {movieDetails.release_date}</p>
          <p>Vote Average: {movieDetails.vote_average}</p>
          <img src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`} style={{ maxHeight: "300px", width: "auto" }} alt="Movie Poster" />
        </>
      )}
    </div>
  );
}

export default MoviePage;
