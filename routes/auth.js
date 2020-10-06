const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const request = require('request')
const passport = require('passport')
const expressJwt = require('express-jwt')
const User = require('../models/users')
const UserInfo = require('../models/userInfo')
const app = express()

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET

function getRequestTokenAndParseToJson(req, res) {
  let oauth_callback
  if(app.get('env') === "development")
    oauth_callback = "http%3A%2F%2Flocalhost%3A4000%2Ftwitter-callback"
  else
    oauth_callback = "https%3A%2F%2Fanimatch-nyan.herokuapp.com%2Ftwitter-callback"
  request.post({
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
      oauth_callback: oauth_callback,
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET
    }
  }, function (err, r, body) {
    if (err) {
      return res.send(500, { message: err.message });
    }

    let jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    res.send(JSON.parse(jsonStr));
  });
}

function TwitterAuthorization(req, res, next){
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
    try{
      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      next();
    }catch (err) {
      res.send(err)
    }
  });
}

function createUser(req, res, next){
  if (!req.user) return res.send(401, 'Failed to Authorization')
  User.findOne({
    where: {twitter_id: req.user.id}
  }).then(async (user)=>{
    if(!user) user = await User.create({
      twitter_id: req.user.id,
      name: req.user.displayName
    })
    UserInfo.create({
      profile: "",
      user_id: user.id
    })
    return next()
  }).catch(e => res.send(e))
}

function setTwitterIdForGenerateToken(req, res, next) {
  //　userのtwitter_idがトークンにセットされるための設定
  req.auth = {
    id: req.user.id
  }
  return next()
}

function generateToken(req, res, next) {
  req.token = jwt.sign({
      id: req.auth.id
    }, 'my-secret',
    {
      expiresIn: '365d'
    });
  return next();
}

function sendToken (req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
}

let authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  algorithms: ['HS256'],
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token']
    }
    return null
  }
})

// Twitterにリクエストトークンを発行してもらうためのエンドポイント
router.post('/twitter/reverse', getRequestTokenAndParseToJson)

// Twitterに認可してもらうためのエンドポイント。成功すればreq.userにはTwitterのユーザー情報が入る
// また、ここでuserを作る
router.post('/twitter',TwitterAuthorization,
  passport.authenticate('twitter-token', {session: false}, null),
  createUser, setTwitterIdForGenerateToken, generateToken, sendToken)

// 状態確認用
router.get('/yay', (req, res, next) => {
  res.send("yay")
})

module.exports = router;