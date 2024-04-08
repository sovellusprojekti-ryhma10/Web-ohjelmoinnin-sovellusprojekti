const pgPool = require('./pg_connection');

const sql = {
    GET_ALL_USERS: 'SELECT id, username FROM accounts',
    GET_USER: 'SELECT id, username FROM accounts WHERE username=$1',
}


async function getAccounts(){
    let result = await pgPool.query(sql.GET_ALL_USERS);
    return result.rows;
}

async function getUser(username){
    let result = await pgPool.query(sql.GET_USER, [username]);
    return result.rows[0];
}

// async function addNote(username, msg){
//     try{
//         await pgPool.query(sql.ADD_NOTE, [msg, username]);
//     }catch(err){
//         throw new Error("Username not found!")
//     }
// }

module.exports = {getAccounts, getUser};