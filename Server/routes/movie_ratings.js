const {
    getMovieRatings,
  } = require("../database/movie_ratings_db");
  const express = require("express");
  const router = express.Router();
  
  
  router.get("/:movieId", async (req, res) => {
    const movieId = req.params.movieId;
  
    const data = await getMovieRatings(movieId);
    console.log(
      JSON.stringify(data) + "Arvostelut"
    );
    res.json(data);
  });
  
  module.exports = router;
  