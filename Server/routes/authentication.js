require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { register, getPw } = require('../database/auth_db');
const jwt = require('jsonwebtoken');

router.post('/register',async (req, res) => {
    const username = req.body.username;
    const pw =req.body.pw;
    console.log(req);
    // const hashPw = await bcrypt.hash(pw, 10);

    await register(username, pw);

    res.end();

});

router.post('/login', async (req,res)=>{
    const uname = req.body.username;
    const pw = req.body.pw;
    console.log(req);

    const db_pw = await getPw(uname);

    if(db_pw){
        const isAuth = await bcrypt.compare(pw, db_pw);
        if(isAuth){
            //luodaan token
            const token = jwt.sign({username: uname }, process.env.JWT_SECRET);
            res.status(200).json({jwtToken: token},);
        }else{
            res.status(401).json({error: 'Wrong password'});
        }
    }else{
        res.status(404).json({error: 'User not found'});
    }
});

module.exports = router;