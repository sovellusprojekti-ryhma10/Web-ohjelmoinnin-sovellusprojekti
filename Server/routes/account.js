const { getUser, getTesti} = require('../database/account_db');
const { auth } = require('../middleware/auth');

const router = require('express').Router();

router.get('/all', async (req, res) => {
    console.log(req);

    const accounts = await getAccounts();
    console.log(accounts);
    res.json(accounts);
});

router.get('/', async (req,res) => {
     const user = await getUser(req.query.username);
     console.log(user);
     res.json(user);
});


router.get('/testi', async (req,res) => {
    const user = await getTesti();
    console.log(user);
    res.json(user);
});


module.exports = {router};