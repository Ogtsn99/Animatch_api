const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//const session = require('express-session');
const request = require('request')
const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
//const TwitterStrategy = require('passport-twitter').Strategy;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
expressJwt = require('express-jwt')
const cors = require('cors')
require('dotenv').config();

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const API_ROOT = process.env.API_ROOT || 'http://127.0.0.1:3000'
const CLIENT_ROOT = process.env.CLIENT_ROOT || 'http://localhost:4000'

console.log("api -> ", API_ROOT)
console.log("client ->", CLIENT_ROOT)

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
app.use(
  cors({
    origin: true, // should be CLIENT_URL when deploying
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ['x-auth-token']
  })
);

app.get('/health-check', (req, res) => {
  res.json({greeting: "Hello World"})
})

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// ユーザ情報をセッションに保存するので初期化
/*app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  HttpOnly: false,
  cookie: {secure: "auto"}
}));*/

//app.use(passport.initialize());

// passport-twitterの設定
passport.use(new TwitterTokenStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: API_ROOT + '/auth/twitter/callback'
  },
  // 認証後の処理
  function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }
));

function createToken(auth){
  return jwt.sign({
      id: auth.id
    }, 'my-secret',
    {
      expiresIn: 60 * 120
    });
}

function generateToken (req, res, next) {
  req.token = createToken(req.auth);
  return next();
}

function sendToken(req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
}

app.post('/auth/twitter/reverse', (req, res) => {
  request.post({
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
      oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET
    }
}, (err, r, body) => {
    if (err) {
      return res.send(500, { message: err.message });
    }
    var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    res.send(JSON.parse(jsonStr));
  });
});

app.post('/auth/twitter', (req, res, next) => {
  request.post({
    url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
    oauth: {
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      token: req.query.oauth_token
    },
    form: { oauth_verifier: req.query.oauth_verifier }
  }, function (err, r, body) {
    if (err) {
      return res.send(500, { message: err.message });
    }

    console.log("yay", body);
    const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    const parsedBody = JSON.parse(bodyString);

    req.body['oauth_token'] = parsedBody.oauth_token;
    req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
    req.body['user_id'] = parsedBody.user_id;

    next();
  });
}, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }

  // prepare token for API
  req.auth = {
    id: req.user.id
  };

  return next();
}, generateToken, sendToken);

var authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  algorithms: ['RS256']
});

function getCurrentUser(req, res, next){
  if(req.user) {
    res.json({state: "has user", user: req.user})
  }else res.json({state: "No user"})
}
app.get('/auth/me', authenticate, getCurrentUser)

/*app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/?auth_failed' }),
  function (req, res) {
    console.log(req.user)
    res.redirect(CLIENT_ROOT);
  });*/


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