import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// API keyt haetaan .envistä
const AUTH_TOKEN = process.env.REACT_APP_READ_ACCESS_TOKEN;
const API_KEY = process.env.REACT_APP_API_KEY;

// Lista mahdollisista genreistä joilla voi filtteröidä hakutuloksia
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

function MovieSearch( { setMediaType, mediaType } ) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [rating, setRating] = useState("");
  const [ratingComparison, setRatingComparison] = useState("Higher Than");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [selectedMovieIndexB, setSelectedMovieIndexB] = useState(
    selectedMovieIndex + 1
  );
  const [selectedMovieIndexC, setSelectedMovieIndexC] = useState(
    selectedMovieIndex + 2
  );
  const [selectedMovieIndexD, setSelectedMovieIndexD] = useState(
    selectedMovieIndex + 3
  );
  const handleSetMediaType = (type) => {
    setMediaType(type);
  };

  // Kutsutaan hakufunktio kun sivu latautuu niin saadaan lista tällä hetkellä pyörivistä elokuvista
  useEffect(() => {
    handleSearch(page);
  }, []);

  // Hakufunktio saa parametrina sivunumeron, eli miltä sivulta tulokset haetaan
  const handleSearch = async (pageNumber) => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: AUTH_TOKEN,
        },
      };

      // Jos hakupalkki on tyhjä, haetaan lista tällä hetkellä pyörivistä elokuvista. Muussa tapauksessa tehdään haku käyttäjän kirjoittamien hakusanojen perusteella
      let apiUrl;

      if (searchQuery === "") {
        apiUrl = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageNumber}&api_key=${API_KEY}`;
      } else {
        apiUrl = `https://api.themoviedb.org/3/search/${mediaType}?query=${searchQuery}&include_adult=false&language=en-US&page=${pageNumber}&api_key=${API_KEY}`;
      }

      const response = await fetch(apiUrl, options);

      const data = await response.json();

      // Filtteritoimintoja
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

        // Resetoidaan näytettävien elokuvien indexit
        resetMovieIndexes();

        filteredMovies = filteredMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          name: movie.name,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        }));

        setMovies(filteredMovies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Previous ja Next -painikkeita painellessa sivulla näkyvät hakutulokset vaihtuu. Kerrallaan näkyy neljä tulosta. Kun päästään sivun loppuun (tai peruutettaessa sivun alkuun), vaihdetaan sivua ja kutsutaan uudestaan hakufunktiota
  const handlePrevMovie = () => {
    if (selectedMovieIndexD === 3) {
      const prevPage = parseInt(page) - 1;
      setPage(prevPage);
      setSelectedMovieIndex(16);
      setSelectedMovieIndexB(17);
      setSelectedMovieIndexC(18);
      setSelectedMovieIndexD(19);
      handleSearch(prevPage);
    } else {
      setSelectedMovieIndex(selectedMovieIndex - 4);
      setSelectedMovieIndexB(selectedMovieIndexB - 4);
      setSelectedMovieIndexC(selectedMovieIndexC - 4);
      setSelectedMovieIndexD(selectedMovieIndexD - 4);
    }
  };

  const handleNextMovie = () => {
    if (selectedMovieIndexD === 19) {
      const nextPage = parseInt(page) + 1;
      setPage(nextPage);
      resetMovieIndexes();
      handleSearch(nextPage);
    } else {
      setSelectedMovieIndex(selectedMovieIndex + 4);
      setSelectedMovieIndexB(selectedMovieIndexB + 4);
      setSelectedMovieIndexC(selectedMovieIndexC + 4);
      setSelectedMovieIndexD(selectedMovieIndexD + 4);
    }
  };

  // Funktio resetoi näytettävien elokuvien indexit, käytetään sivua vaihdettaessa ja uutta hakua tehtäessä
  const resetMovieIndexes = () => {
    setSelectedMovieIndex(0);
    setSelectedMovieIndexB(1);
    setSelectedMovieIndexC(2);
    setSelectedMovieIndexD(3);
  };

  const resetPage = () => {
    setPage(1);
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
          placeholder="TMDB Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <select
          value={ratingComparison}
          onChange={(e) => setRatingComparison(e.target.value)}
        >
          <option value="higher">Higher Than</option>
          <option value="lower">Lower Than</option>
        </select>
        <select
          value={mediaType}
          onChange={(e) => {
            setMediaType(e.target.value); 
            handleSetMediaType(e.target.value);
          }}
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <button
          onClick={() => {
            handleSearch(page);
            resetPage();
          }}
        >
          Search
        </button>
      </div>
      {movies.length > 0 && (
        <>
          <div className="movie-info">
            <h2>{movies[selectedMovieIndex].title}</h2>
            <h2>{movies[selectedMovieIndex].name}</h2>
            {movies[selectedMovieIndex].poster_path && (
              <Link
                to={`/${mediaType}/${movies[selectedMovieIndex].id}`}
                key={movies[selectedMovieIndex].id}
                onClick={() => handleSetMediaType(mediaType)}
              >
                <img
                  src={movies[selectedMovieIndex].poster_path}
                  alt="Movie Poster"
                  style={{ maxHeight: "300px", width: "auto" }}
                />
              </Link>
            )}
          </div>
          <div className="movie-info-b">
            <h2>{movies[selectedMovieIndexB].title}</h2>
            <h2>{movies[selectedMovieIndexB].name}</h2>
            {movies[selectedMovieIndexB].poster_path && (
              <Link
                to={`/${mediaType}/${movies[selectedMovieIndexB].id}`}
                key={movies[selectedMovieIndexB].id}
              >
                <img
                  src={movies[selectedMovieIndexB].poster_path}
                  alt="Movie Poster"
                  style={{ maxHeight: "300px", width: "auto" }}
                />
              </Link>
            )}
          </div>
          <div className="movie-info-c">
            <h2>{movies[selectedMovieIndexC].title}</h2>
            <h2>{movies[selectedMovieIndexC].name}</h2>
            {movies[selectedMovieIndexC].poster_path && (
              <Link
                to={`/${mediaType}/${movies[selectedMovieIndexC].id}`}
                key={movies[selectedMovieIndexC].id}
              >
                <img
                  src={movies[selectedMovieIndexC].poster_path}
                  alt="Movie Poster"
                  style={{ maxHeight: "300px", width: "auto" }}
                />
              </Link>
            )}
          </div>
          <div className="movie-info-d">
            <h2>{movies[selectedMovieIndexD].title}</h2>
            <h2>{movies[selectedMovieIndexD].name}</h2>
            {movies[selectedMovieIndexD].poster_path && (
              <Link
                to={`/${mediaType}/${movies[selectedMovieIndexD].id}`}
                key={movies[selectedMovieIndexD].id}
              >
                <img
                  src={movies[selectedMovieIndexD].poster_path}
                  alt="Movie Poster"
                  style={{ maxHeight: "300px", width: "auto" }}
                />
              </Link>
            )}
          </div>
          <div className="navigation-buttons">
            <button onClick={handlePrevMovie}>Previous</button>
            <button onClick={handleNextMovie}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default MovieSearch;