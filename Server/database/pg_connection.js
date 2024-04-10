require('dotenv').config();
const {Pool} = require('pg');
const { get } = require('../routes/account');

const sql = {
    GET_ALL_USERS: 'SELECT id, username FROM accounts',
    GET_USER: 'SELECT id, username FROM accounts WHERE username=$1',
    GET_TEST: 'SELECT * FROM accounts WHERE id=1'
}



async function getTesti() {
    let result = await pgPool.query(sql.GET_TEST);
    return result.rows[0];
}

const router = require('express').Router();
const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_UNAME,
    password: process.env.PG_PW,
    ssl: true
});



router.get('/all', async (req, res) => {
    console.log(req);

    const accounts = await getAccounts();
    console.log(accounts);
    res.json(accounts);
});

console.log(process.env.PG_HOST);
pgPool.connect( (err) => {
    if(err){
        console.log(err.message);
    }else{
        console.log("Postgre connection ready");
    }
});

console.log(getTesti());

module.exports = pgPool;