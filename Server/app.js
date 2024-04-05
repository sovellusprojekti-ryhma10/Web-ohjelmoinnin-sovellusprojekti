require('dotenv').config();


const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const upload = multer({dest: 'uploads/'});



const groups = require('./routes/group');
const pgPool = require('./database/pg_connection');

const jwt_secret = 'sdfdsdsfu8sdf87df78'

const app = express()
app.use(express.static('public'));
app.use(cors())
app.use(upload.none());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const port = 3001

app.use('/group', groups);

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



