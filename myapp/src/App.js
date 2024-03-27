import React, { useState, useEffect } from 'react';
import './App.css';


// API keyt ym.
const AUTH_TOKEN = process.env.REACT_APP_READ_ACCESS_TOKEN;
const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [posterUrl, setPosterUrl] = useState('');

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        if (movies.length > 0) {
          const movieId = movies[selectedMovieIndex].id;
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + AUTH_TOKEN
            }
          };

          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${API_KEY}`,
            options
          );
          const data = await response.json();

          if (data.posters && data.posters.length > 0) {
            const posterPath = data.posters[0].file_path;
            setPosterUrl(`https://image.tmdb.org/t/p/original${posterPath}`);
          } else {
            setPosterUrl('');
          }
        }
      } catch (error) {
        console.error('Error fetching poster:', error);
      }
    };

    fetchPoster();
  }, [selectedMovieIndex, movies]);

  const handleSearch = async () => {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: AUTH_TOKEN
        }
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1`,
        options
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setMovies(data.results);
        setSelectedMovieIndex(0);
      } else {
        setMovies([]);
        setSelectedMovieIndex(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePrevMovie = () => {
    setSelectedMovieIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextMovie = () => {
    setSelectedMovieIndex((prevIndex) => (prevIndex < movies.length - 1 ? prevIndex + 1 : prevIndex));
  };

  return (
    <div className="App">
      <h1>Movie Search</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {movies.length > 0 && (
        <div className="movie-info">
          <h2>{movies[selectedMovieIndex].original_title}</h2>
          <p>{movies[selectedMovieIndex].overview}</p>
          <p>Release Date: {movies[selectedMovieIndex].release_date}</p>
          <p>Vote Average: {movies[selectedMovieIndex].vote_average}</p>
          {posterUrl && <img src={posterUrl} alt="Movie Poster" style={{ height: '500px', width: 'auto' }}/>}
          <div className="navigation-buttons">
            <button onClick={handlePrevMovie} disabled={selectedMovieIndex === 0}>
              Previous
            </button>
            <button onClick={handleNextMovie} disabled={selectedMovieIndex === movies.length - 1}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
