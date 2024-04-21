import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./MoviePage.css";
import { UserContext } from "../context/UserContext";

function MoviePage() {
  const { movieID, mediaType } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [groupLists, setGroupLists] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [selectedListId2, setSelectedListId2] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
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
      setRatings(data.ratings); 
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    const fetchGroupLists = async () => {
      try {
        if (user && user.token) {
          const response = await fetch(
            "http://localhost:3001/group/names",
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
          console.log(data.groups); // Check the structure of data
          setGroupLists(data.groups); // Set the correct property
        }
      } catch (error) {
        console.error("Error fetching favorite lists:", error);
      }
    };
    

    fetchGroupLists();
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

  const handleRatingChange = (rating) => {
    setUserRating(rating);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleAddToGroup = async () => {
    try {
      console.log(selectedListId2, movieID);
      const response = await fetch(`http://localhost:3001/group/pages/content`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movie_id: movieID, group_name: selectedListId2 })
      });
      if (!response.ok) {
        throw new Error('Failed to adding content to group pages');
      }
      setSelectedListId2("");

    } catch (error) {
      console.error('Error adding content to group pages:', error);
    }
  };

  const handleSubmitRating = async () => {
    try {
      if (!userRating || !reviewText) {
        throw new Error("Please provide a rating and review text");
      }

      const response = await fetch(
        `http://localhost:3001/movie_ratings/${movieID}/add_rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            username: user.username,
            rating: userRating,
            review: reviewText,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to submit rating");

      fetchRatings();
      setUserRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error submitting rating:", error);
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
              Genret:{" "}
              {movieDetails.genres &&
                movieDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p>Kuvaus: {movieDetails.overview}</p>
            <p>Julkaistu: {movieDetails.release_date}</p>
            <p>TMDB Keskiarvo: {movieDetails.vote_average}</p>
          </div>
          {user && (
            <>
              <select
                value={selectedListId}
                onChange={(e) => {
                  console.log("Dropdown value changed:", e.target.value); // Debuggausta
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
{user && (
  <>
    <select
      value={selectedListId2}
      onChange={(e) => {
        console.log("Dropdown value changed:", e.target.value);
        setSelectedListId2(e.target.value);
      }}
    >
      <option value="">Valitse Ryhmä</option>
      {groupLists.map((group) => (
        <option key={group.group_id} value={group.group_name}>
          {group.group_name}
        </option>
      ))}
    </select>
    <button onClick={handleAddToGroup}>
      Lisää ryhmään
    </button>
  </>
)}
          
        </>
      )}
      <div>
        
      </div>
      <div className="ratings-container">
        <h3>Arvostelut:</h3>
        <div className="reviews-box">
          <ul>
            {ratings.map((rating, index) => (
              <li key={index}>
                <div className="star-container">
                  {Array.from({ length: rating.rating }, (_, i) => (
                    <span key={i} className="star filled">
                      ★
                    </span>
                  ))}
                </div>
                <p>Käyttäjä: {rating.username}</p>
                <p>Arvostelu: {rating.review}</p>
                <p>
                  Päivämäärä:{" "}
                  {new Date(rating.submission_date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {user && (
          <>
            <div className="rating-container">
              <span>Arviosi: </span>
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`star ${rating <= userRating ? "filled" : ""}`}
                  onClick={() => handleRatingChange(rating)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={handleReviewTextChange}
              placeholder="Kirjoita arvostelu"
            />
            <button onClick={handleSubmitRating}>Lisää arvostelu</button>
          </>
        )}
      </div>
    </div>
  );
}

export default MoviePage;
