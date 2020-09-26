let express = require('express')
let router = express.Router()
const User = require('../models/users')
const app = express()

function envMustBeDevelopment(req, res, next){
  if(app.get("env") === "development") next();
  else res.status(403).send("Sorry. You are not allowed to access.")
}

router.get('/', function(req, res, next) {
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

// ユーザーが帰ってくる
router.get('/me', async (req, res)=>{
  let user = await User.findCurrentUser(req)
  if(user) res.send({user: user})
  else res.send({user: null, message: "Authentication Failed"})
})

router.get('/:id(\\d+)/', findUserById)

function findUserById(req, res) {
  User.findByPk(req.params.id, {attributes: ["id", "name", "profile", "createdAt", "updatedAt"]}).then(user => {
    if (user) res.send({user: user})
    else res.send({user: null, message: "No user found."})
  })
}


module.exports = router;
