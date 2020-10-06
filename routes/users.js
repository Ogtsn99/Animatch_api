let express = require('express')
let router = express.Router()
const User = require('../models/users')
const UserInfo = require('../models/userInfo')
const app = express()
const expressJwt = require('express-jwt')

function envMustBeDevelopment(req, res, next){
  if(app.get("env") === "development") next();
  else res.status(403).send("Sorry. You are not allowed to access.")
}

let authentication = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  algorithms: ['HS256'],
  getToken: function (req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
})

router.get('/', function(req, res) {
  if(app.get("env") === "development")
    User.findAll.then(users=> res.send(users)).catch(e=>{res.send(e)})
  else User.findAll({attributes: ["id", "name", "profile", "createdAt", "updatedAt"]})
    .then(users => res.send(users)).catch(e=>{res.send(e)})
})

router.post('/create', envMustBeDevelopment, (req, res) => {
  User.create(req.body.user).then((user)=>{
    res.send({user: user, message: "user created successfully!"})
  })
})

// /meにいく前にauthenticationを実行する
router.use('/me', authentication)

// ユーザーが帰ってくる
router.get('/me', async (req, res)=>{
  let user = await User.findCurrentUser(req)
  console.log(user)
  if(user) res.send({user: user})
  else res.send({user: null, message: "Authentication Failed"})
})

router.get('/:id(\\d+)/', findUserById)

function findUserById(req, res) {
  User.findByPk(req.params.id, {attributes: ["id", "name", "createdAt", "updatedAt"]}).then(user => {
    if (user) res.send({user: user})
    else res.send({user: null, message: "No user found."})
  })
}

router.get('/showInfo/:id(\\d+)/', findUserWithInfo)

async function findUserWithInfo(req, res) {
  const userInfo = await User.findByPk(req.params.id, {include: UserInfo})
  res.send({user: userInfo})
}

module.exports = router;
