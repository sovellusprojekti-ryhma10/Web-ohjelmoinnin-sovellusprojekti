const pgPool = require('./pg_connection');

const sql = {
    REGISTER: 'INSERT INTO accounts VALUES ($1,$2)',
    GET_PW: 'SELECT pw FROM accounts WHERE username=$1'
}

async function register(username, pwHash){
    await pgPool.query(sql.REGISTER, [username, pwHash]);
}

async function getPw(username){
    const result = await pgPool.query(sql.GET_PW, [username]);

    return result.rowCount > 0 ? result.rows[0].pw : null;

}

module.exports = {register, getPw};