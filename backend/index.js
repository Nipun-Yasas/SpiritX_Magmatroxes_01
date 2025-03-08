const express = require('express')
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello! b')
})

const signupRoute = require('./routes/signup'); 
const loginRoute = require('./routes/login');


app.use(bodyParser.json());

//MONGODB CONNECTION
const mongoose = require('mongoose');
const dbURI = process.env.DB_URL;

mongoose.connect(dbURI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

module.exports = mongoose;

app.use('/auth', signupRoute);
app.use('/auth', loginRoute);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})