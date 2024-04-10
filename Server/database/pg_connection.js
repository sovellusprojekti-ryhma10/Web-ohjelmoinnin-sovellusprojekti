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
    host: 'dpg-cnssoq6n7f5s73dd4gng-a.frankfurt-postgres.render.com',
    port: 5432,
    database: 'sovellusprojekti',
    user: 'sovellusprojekti_user',
    password: 'rFEgeqp4t31oyRDxi4RphyLBp3NDgna2',
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