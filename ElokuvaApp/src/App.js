import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";


// API keyt haetaan .envistä
const AUTH_TOKEN = process.env.REACT_APP_READ_ACCESS_TOKEN;
const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
    const [searchQuery, setSearchQuery] = useState("");
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
                `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`,
                options
            );

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const updatedMovies = data.results.map((movie) => ({
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
                }));
                setMovies(updatedMovies);
                setSelectedMovieIndex(0);
            } else {
                setMovies([]);
                setSelectedMovieIndex(0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
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
  ///////////////////////////////////////
  // Tässä on uusi koodi rendattavaksi //
  ///////////////////////////////////////
    return (
        <div className="App">
           <Navbar></Navbar>
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
                    <h2>{movies[selectedMovieIndex].title}</h2>
                    <p>{movies[selectedMovieIndex].overview}</p>
                    <p>
                        Release Date: {movies[selectedMovieIndex].release_date}
                    </p>
                    <p>
                        Vote Average: {movies[selectedMovieIndex].vote_average}
                    </p>
                    {movies[selectedMovieIndex].poster_path && (
                        <img
                            src={movies[selectedMovieIndex].poster_path}
                            alt="Movie Poster"
                            style={{ maxHeight: "500px", width: "auto" }}
                        />
                    )}
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

export default App;
