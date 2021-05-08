const express = require('express');
const { success, error } = require('consola');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const { DB, PORT } = require('./config')
var cookieParser = require('cookie-parser')
var session = require('express-session')
const app = express();
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json({ extended: false, limit: '10mb' }));
app.use(express.static('public'));
app.use(cors());
app.use(passport.initialize());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

require('./middleweres/passport')(passport);

const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(cookieParser());
//home route
const homeRoute = require('./routes/home');
app.use('/', homeRoute);

//Auth route
const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

//conneting the Database

const startApp = async () => {
    try {
        await mongoose.connect(DB, { useUnifiedTopology: true, useFindAndModify: true, useNewUrlParser: true });
        success({ message: `Connected To Mongoose Database \n${DB}`, badge: true });
        app.listen(PORT, () => success({ message: `Server Started on PORT ${PORT}`, badge: true }))
    } catch (err) {
        error({ message: `Unable to connect To Mongoose Database \n${err}`, badge: true });
    }

}
startApp();