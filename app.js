const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const API_ROOT = process.env.API_ROOT || 'http://127.0.0.1:3000'
const CLIENT_ROOT = process.env.CLIENT_ROOT || 'http://localhost:4000/'

console.log("api -> ", API_ROOT)
console.log("client ->", CLIENT_ROOT)

// ユーザ情報をセッションに保存するので初期化
app.use(session({
  secret: 'secret-key',
  resave: true,
  saveUninitialized: false,
  HttpOnly: false,
  Domain: CLIENT_ROOT
}));

// セッションに保存
passport.serializeUser(function(user, done) {
  done(null, user);
});

// セッションから復元 routerのreq.userから利用可能
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());

// passport-twitterの設定
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: API_ROOT + '/auth/twitter/callback'
  },
  // 認証後の処理
  function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/?auth_failed' }),
  function (req, res) {
    console.log(req.user)
    res.redirect('/success');
  });


app.use('/', indexRouter);
app.use('/success', usersRouter);

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