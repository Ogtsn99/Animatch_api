const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const request = require('request')
const passport = require('passport');
const expressJwt = require('express-jwt')

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET

function getRequestTokenAndParseToJson(req, res) {
  request.post({
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
      oauth_callback: "http%3A%2F%2Flocalhost%3A4000%2Ftwitter-callback",// CLIENT_URLに差し替える
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

function setTwitterIdForGenerateToken(req, res, next) {
  if (!req.user) return res.send(401, 'Failed to Authorization');
  //　userのtwitter_idがトークンにセットされるための設定
  req.auth = {
    id: req.user.id
  };
  return next();
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
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

//// 未完成 ////
//// req.auth.idはTwitterIdであり、 TwitterIdが一致するユーザーのIdを返す
//// req.auth
function getCurrentUser(req, res, next) {
  if(req.auth){
    console.log(req.auth)
    let TwitterId = req.auth.id
    //idをsendする
    res.send({message: "success authenticate!"})
  }else res.send({message: "failed to authenticate"})
}

// Twitterにリクエストトークンを発行してもらうためのエンドポイント
router.post('/twitter/reverse', getRequestTokenAndParseToJson);

// Twitterに認可してもらうためのエンドポイント。成功すればreq.userにはTwitterのユーザー情報が入る
router.post('/twitter',TwitterAuthorization,
  passport.authenticate('twitter-token', {session: false}, null),
  setTwitterIdForGenerateToken , generateToken, sendToken);

// httpヘッダーにトークンを含めて使う必要がある。認証に成功すればユーザーのidが帰ってくる
router.get('/me', authenticate, getCurrentUser);

// 状態確認用
router.get('/yay', (req, res, next) => {
  res.send("yay")
})

module.exports = router;