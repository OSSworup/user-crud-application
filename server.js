const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('./auth');
const userRoute = require('./routes/userRoutes');
require('dotenv').config();
const db = require('./db');

const app = express();


app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 


app.use(session({
    secret: process.env.SECRET_KEY,  
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl:process.env.MONGODB_URL,
        collectionName: 'sessions'
    }),
    cookie: { secure: false } // Set to true if using HTTPS
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});


app.use('/user', userRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
