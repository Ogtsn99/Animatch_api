const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const API_ROOT = process.env.API_ROOT || 'http://127.0.0.1:3000'
const CLIENT_ROOT = process.env.CLIENT_ROOT || 'http://localhost:4000'

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: true, // should be CLIENT_URL when deploying
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ['x-auth-token']
  })
);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

passport.use(new TwitterTokenStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET
  },
  function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }
));

app.use('/api/v1/auth', authRouter);
app.use('/', indexRouter);
app.use('/success', usersRouter);
app.use('/logout', (req, res)=> {
  req.logout()
  res.redirect('/')
})

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