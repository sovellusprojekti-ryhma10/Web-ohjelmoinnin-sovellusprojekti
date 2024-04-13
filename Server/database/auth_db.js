const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pgPool = require("./pg_connection");

async function verifyCredentials(username, password) {
  const result = await pgPool.query(
    "SELECT password_hash, id FROM accounts WHERE username = $1",
    [username]
  );

  if (result.rowCount > 0) {
    const isAuth = await bcrypt.compare(password, result.rows[0].password_hash);
    if (isAuth) {
      // Return both the authentication result and the account ID
      return { isAuth, accountId: result.rows[0].id };
    }
  }

  return { isAuth: false };
}

module.exports = { verifyCredentials };
