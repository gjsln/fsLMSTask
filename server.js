const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const userAuth = require('./routes/api/userAuth');

// DB Config

const db = require('./config/dbConfig').mongoURI;

// Connect to mongoDB 

mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log(err));

const app = express();

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Body parser middleware

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

//Use Routes
app.use('/api/userAuth', userAuth);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));