const {
    getMovieRatings,
    addMovieRating,
  } = require("../database/movie_ratings_db");
  const express = require("express");
  const router = express.Router();
  const { auth } = require("../middleware/auth");
  
  router.get("/:movieId", async (req, res) => {
    const movieId = req.params.movieId;
  
    const data = await getMovieRatings(movieId);
    console.log(
      JSON.stringify(data) + "Arvostelut"
    );
    res.json(data);
  });

  router.post("/:movieId/add_rating", auth, async (req, res) => {
    const { username, rating, review } = req.body;
    const movieId = req.params.movieId;
  
    try {
      // Add rating to the database
      await addMovieRating(username, rating, review, new Date(), movieId);
      res.status(201).json({ message: "Rating added successfully" });
    } catch (error) {
      console.error("Error adding rating:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  module.exports = router;