import React, { useState } from "react";

// API keyt haetaan .envistä
const AUTH_TOKEN = process.env.REACT_APP_READ_ACCESS_TOKEN;
const API_KEY = process.env.REACT_APP_API_KEY;

const genreOptions = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [rating, setRating] = useState("");
  const [ratingComparison, setRatingComparison] = useState("equal");
  const [mediaType, setMediaType] = useState("movie");
  const [movies, setMovies] = useState([]);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);

  // Käyttäjän painaessa 'Search', rakennetaan kysely TMDB:n APIin ja näytetään sieltä palautuvan listan ensimmäisen leffan tiedot
  const handleSearch = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: AUTH_TOKEN,
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/search/${mediaType}?query=${searchQuery}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`,
        options
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        let filteredMovies = data.results.filter((movie) => {
          if (
            selectedGenre &&
            !movie.genre_ids.includes(parseInt(selectedGenre))
          )
            return false;
          if (releaseYear && !movie.release_date.includes(releaseYear))
            return false;
          if (rating) {
            if (
              ratingComparison === "equal" &&
              movie.vote_average !== parseFloat(rating)
            )
              return false;
            if (
              ratingComparison === "higher" &&
              movie.vote_average <= parseFloat(rating)
            )
              return false;
            if (
              ratingComparison === "lower" &&
              movie.vote_average >= parseFloat(rating)
            )
              return false;
          }
          return true;
        });

        filteredMovies = filteredMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        }));

        setMovies(filteredMovies);
        setSelectedMovieIndex(0);
      } else {
        setMovies([]);
        setSelectedMovieIndex(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // lisätty funktio joka lisää haetun elokuvan käyttäjän suosikkeihin.
  const handleSaveMovie = async () => {
    const currentMovie = movies[selectedMovieIndex];
    try {
      const response = await fetch("YOUR_BACKEND_ENDPOINT_HERE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentMovie),
      });

      if (!response.ok) {
        throw new Error("Failed to add movie to favorites");
      }
      console.log("Movie added to favorites");
    } catch (error) {
      console.error("Error adding movie to favorites:", error);
    }
  };

  // Buttoneilla voi navigoida hakutuloksia eteen- ja taaksepäin
  const handlePrevMovie = () => {
    setSelectedMovieIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const handleNextMovie = () => {
    setSelectedMovieIndex((prevIndex) =>
      prevIndex < movies.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  return (
    <div className="App">
      <h1>Movie Search</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie or TV show..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Select Genre</option>
          {genreOptions.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Release Year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <select
          value={ratingComparison}
          onChange={(e) => setRatingComparison(e.target.value)}
        >
          <option value="equal">Equal</option>
          <option value="higher">Higher Than</option>
          <option value="lower">Lower Than</option>
        </select>
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      {movies.length > 0 && (
        <div className="movie-info">
          <h2>{movies[selectedMovieIndex].title}</h2>
          <p>{movies[selectedMovieIndex].overview}</p>
          <p>Release Date: {movies[selectedMovieIndex].release_date}</p>
          <p>Vote Average: {movies[selectedMovieIndex].vote_average}</p>
          {movies[selectedMovieIndex].poster_path && (
            <img
              src={movies[selectedMovieIndex].poster_path}
              alt="Movie Poster"
              style={{ maxHeight: "500px", width: "auto" }}
            />
          )}

          <button onClick={handleSaveMovie}>Add to favorites</button>

          <div className="navigation-buttons">
            <button
              onClick={handlePrevMovie}
              disabled={selectedMovieIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNextMovie}
              disabled={selectedMovieIndex === movies.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;
