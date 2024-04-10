const { get } = require('../routes/account');
const pgPool = require('./pg_connection');

const sql = {
    GET_ALL_USERS: 'SELECT * FROM accounts',
    GET_USER: 'SELECT id, username FROM accounts WHERE username=$1',
    GET_TEST: 'SELECT id, username FROM accounts WHERE username=testi'
}


async function getAccounts(){
    let result = await pgPool.query(sql.GET_ALL_USERS);
    return result.rows;
}

async function getUser(username){
    let result = await pgPool.query(sql.GET_USER, [username]);
    return result.rows[0];
}
async function getTesti() {
    let result = await pgPool.query(sql.GET_TEST);
    return result.rows[0];
}


module.exports = {getAccounts,getUser,getTesti};