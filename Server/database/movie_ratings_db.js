const pgPool = require("./pg_connection");

const sql = {
  GET_ALL_REVIEWS_BY_ID:
  "SELECT username, rating, review, submission_date FROM user_movie_ratings WHERE movie_id = ($1);",
  
  ADD_REVIEW:
    "INSERT INTO user_movie_ratings (username, rating, review, submission_date, movie_id) VALUES ($1, $2, $3, $4, $5)",
};

async function getMovieRatings(movieId) {
    try {
      console.log(movieId);
      const result = await pgPool.query(sql.GET_ALL_REVIEWS_BY_ID, [movieId]);  
      return {
        ratings: result.rows,
      };
    } catch (error) {
      console.error("Error getting ratings:", error);
      throw error;
    }
  }


module.exports = {
  getMovieRatings
};
