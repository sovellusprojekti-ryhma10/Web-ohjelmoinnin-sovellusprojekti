const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const pgPool = require("../database/pg_connection");

// Route for creating a new favorite list
router.post("/favorite-lists", auth, async (req, res) => {
  const { favorite_list_name } = req.body;
  const { accountId } = res.locals;

  try {
    // Insert the favorite list name into the personal_pages table
    const result = await pgPool.query(
      "INSERT INTO personal_pages (favorite_list_name, account_id) VALUES ($1, $2) RETURNING id, favorite_list_name",
      [favorite_list_name, accountId]
    );
    res.json(result.rows[0]); // Return the inserted list details
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for fetching all favorite lists for the authenticated user
router.get("/favorite-lists", auth, async (req, res) => {
  const { accountId } = res.locals;

  try {
    const result = await pgPool.query(
      "SELECT id, favorite_list_name FROM personal_pages WHERE account_id = $1",
      [accountId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for deleting a specific favorite list
router.delete("/favorite-lists/:listId", auth, async (req, res) => {
  const { listId } = req.params;

  try {
    // Delete the list from the database
    const result = await pgPool.query(
      "DELETE FROM personal_pages WHERE id = $1 RETURNING *",
      [listId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "List not found" });
    }
    res.json({ message: "List deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for fetching a specific favorite list
router.get("/favorite-lists/:listId", auth, async (req, res) => {
  const { listId } = req.params;

  try {
    const result = await pgPool.query(
      "SELECT * FROM favorite_list_content WHERE list_id = $1",
      [listId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "List not found" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for adding content to a specific favorite list
router.post("/favorite-lists/:listId/content", auth, async (req, res) => {
  const { listId } = req.params;
  const { list_content } = req.body;

  try {
    // Convert list_content to JSON if it's not already in JSON format
    const contentJSON = JSON.stringify(list_content);

    // Insert content into favorite_list_content table
    const result = await pgPool.query(
      "INSERT INTO favorite_list_content (list_id, list_content) VALUES ($1, $2) RETURNING *",
      [listId, contentJSON]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
