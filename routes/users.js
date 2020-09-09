var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/me', (req, res)=>{
  if(req.user) res.send({ name: req.user.displayName})
  else res.send({message: "not logged in"})
})

module.exports = router;
