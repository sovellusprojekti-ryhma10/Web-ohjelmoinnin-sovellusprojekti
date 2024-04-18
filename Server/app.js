//app.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyCredentials } = require("./database/auth_db");
const { auth } = require("./middleware/auth");
const pgPool = require("./database/pg_connection");
const favoriteListsRouter = require("./routes/FavoriteLists");
const groupRouter = require("./routes/group");
const ratingsRouter = require("./routes/movie_ratings")

const app = express(); // Define the app variable before using it
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to match your client's origin
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the favoriteListsRouter as middleware
app.use("/api", favoriteListsRouter);
app.use("/group", groupRouter);
app.use("/movie_ratings", ratingsRouter);

const port = 3001;

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { isAuth, accountId } = await verifyCredentials(username, password);

    if (isAuth) {
      // Include the account ID in the JWT payload
      const token = jwt.sign(
        { username: username, accountId: accountId },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token: token });
    } else {
      res.status(401).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await pgPool.query(
      "SELECT * FROM accounts WHERE username = $1",
      [username]
    );

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pgPool.query(
      "INSERT INTO accounts (username, password_hash) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/protected", auth, (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
