require('dotenv').config();


const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const account = require('./routes/account');
const groups = require('./routes/group');
const pgPool = require('./database/pg_connection');

const jwt_secret = process.env.JWT_SECRET

const app = express()
app.use(express.static('public'));
app.use(cors())
app.use(upload.none());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const port = 3001
console.log('jwt_secret', jwt_secret)
// app.use('/group', groups);

app.use('/group', groups);
app.use('/account', account);

app.post("/login",(req,res) => {
  const { user, password } = req.body
  if (user === 'admin' && password === 'admin') {
    const token = jwt.sign({user: user},jwt_secret)
    res.status(200).json({token:token})
  } else {
    res.status(401).json({message: 'Invalid credentials!'})
  }
})

app.listen(port,() => {
  console.log(`App is running on port ${port}`)
})