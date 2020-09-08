var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  if(req.user) res.json({state: "ログイン中"})
  else res.json({state: "ログアウト中"})
});

module.exports = router;
