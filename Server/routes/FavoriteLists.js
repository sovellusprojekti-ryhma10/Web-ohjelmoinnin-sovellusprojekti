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

// Route for creating a public version of a favorite list
router.post("/favorite-lists/:listId/share", auth, async (req, res) => {
  console.log("Received request for sharing list:", req.params.listId); // Log the received request
  const { listId } = req.params;

  try {
    // Fetch the list content from the private list
    const result = await pgPool.query(
      "SELECT list_content FROM favorite_list_content WHERE list_id = $1",
      [listId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "List not found" });
    }
    const listContent = result.rows[0].list_content;

    // Log the retrieved list content
    console.log("Retrieved list content:", listContent);

    // Insert the list content into the public_favorite_lists table
    const insertResult = await pgPool.query(
      "INSERT INTO public_favorite_lists (list_content) VALUES ($1) RETURNING id",
      [listContent]
    );

    // Return the ID of the new public list
    console.log("Inserted new public list with ID:", insertResult.rows[0].id);
    res.json({ publicListId: insertResult.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for fetching the content of a specific public favorite list by its ID
router.get("/public-favorite-lists/:listId/content", async (req, res) => {
  try {
    // Extract the list ID from the request parameters
    const { listId } = req.params;

    // Query the database for the specific public list
    const result = await pgPool.query(
      "SELECT list_content FROM public_favorite_lists WHERE id = $1",
      [listId]
    );

    // Check if the list was found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Public list not found" });
    }

    // Send the list content to the client
    res.json(result.rows[0].list_content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
