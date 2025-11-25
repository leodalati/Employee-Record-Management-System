// Load .env in development so process.env.MONGODB_URI is available
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
let DB = require('./db');
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');
let cors = require('cors');
let userModel = require('../models/user');
let User = userModel.User;
var app = express();
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
let employeeRouter = require('../routes/employee_record'); 




// Test database connection
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection error'));
mongoDB.once('open', () => {
  console.log('Connected to the MongoDB');
});

// Setup express session
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: false,
  resave: false
}));  

// Initialize Passport and flash messages
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// User authentication & Serialize and deserialize user info
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/employee_records', employeeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
