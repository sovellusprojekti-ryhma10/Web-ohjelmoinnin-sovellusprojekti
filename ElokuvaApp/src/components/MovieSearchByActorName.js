import React, { useState } from 'react';

// API keys are retrieved from .env
const AUTH_TOKEN = process.env.REACT_APP_READ_ACCESS_TOKEN;
const API_KEY = process.env.REACT_APP_API_KEY;

function MovieSearchByActorName() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);

  // Function to handle actor search
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
        `https://api.themoviedb.org/3/search/person?query=${searchQuery}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`,
        options
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Map through each actor result and fetch their known movies
        const moviesPromises = data.results.map(async actor => {
          const moviesResponse = await fetch(
            `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${API_KEY}&language=en-US`,
            options
          );
          const moviesData = await moviesResponse.json();

          // Return object with actor's name and their known movies
          return {
            actorName: actor.name,
            movies: moviesData.cast.map(movie => ({
              id: movie.id,
              title: movie.title,
              overview: movie.overview,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`
            }))
          };
        });

        // Wait for all movie promises to resolve
        const updatedMovies = await Promise.all(moviesPromises);
        setMovies(updatedMovies);
        setSelectedMovieIndex(0);
      } else {
        setMovies([]);
        setSelectedMovieIndex(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to navigate to previous movie
  const handlePrevMovie = () => {
    setSelectedMovieIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  // Function to navigate to next movie
  const handleNextMovie = () => {
    setSelectedMovieIndex(prevIndex =>
      prevIndex < movies.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  return (
    <div className="App">
      <h1>Näyttelijähaku</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Hae elokuvia näyttelijän nimellä"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Hae</button>
      </div>
      {movies.length > 0 && (
        <div className="movie-info">
          <h2>{movies[selectedMovieIndex].actorName}</h2>
          <div className="movie-details">
            <h3>{movies[selectedMovieIndex].movies[selectedMovieIndex].title}</h3>
            <p>{movies[selectedMovieIndex].movies[selectedMovieIndex].overview}</p>
            <p>Julkaistu: {movies[selectedMovieIndex].movies[selectedMovieIndex].release_date}</p>
            <p>TMDB keskiarvo: {movies[selectedMovieIndex].movies[selectedMovieIndex].vote_average}</p>
            {movies[selectedMovieIndex].movies[selectedMovieIndex].poster_path && (
              <img
                src={movies[selectedMovieIndex].movies[selectedMovieIndex].poster_path}
                alt="Movie Poster"
                style={{ maxHeight: '500px', width: 'auto' }}
              />
            )}
          </div>
          <div className="navigation-buttons">
            <button onClick={handlePrevMovie} disabled={selectedMovieIndex === 0}>
              Edellinen
            </button>
            <button
              onClick={handleNextMovie}
              disabled={selectedMovieIndex === movies[selectedMovieIndex].movies.length - 1}
            >
              Seuraava
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearchByActorName;
