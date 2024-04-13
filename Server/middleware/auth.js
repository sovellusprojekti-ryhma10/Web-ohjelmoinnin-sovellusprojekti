// auth.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.username = payload.username;
    res.locals.accountId = payload.accountId; // Extract the account ID
    next();
  } catch (err) {
    res.status(403).json({ error: "Access forbidden." });
  }
}

module.exports = { auth };
