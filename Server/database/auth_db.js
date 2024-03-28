const pgPool = require('./pg_connection');

const sql = {
    REGISTER: 'INSERT INTO student VALUES ($1,$2,$3,$4)',
    GET_PW: 'SELECT pw FROM student WHERE username=$1'
}

async function register(fname, lname, username, pwHash){
    await pgPool.query(sql.REGISTER, [fname, lname, username, pwHash]);
}

async function getPw(username){
    const result = await pgPool.query(sql.GET_PW, [username]);

    return result.rowCount > 0 ? result.rows[0].pw : null;

}

module.exports = {register, getPw};