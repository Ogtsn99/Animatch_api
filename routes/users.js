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

router.get('/:id(\\d+)/', (req, res) => {
  User.findByPk(req.params.id, {attributes: ["id", "name", "createdAt", "updatedAt"]}).then(user => {
    if (user) res.send({user: user})
    else res.send({user: null, message: "No user found."})
  })
})

router.get('/showInfo/:id(\\d+)/', async (req, res) => {
  const userInfo = await User.findByPk(req.params.id, {include: UserInfo})
  res.send({user: userInfo})
})

async function addUserToReq(req, res, next){
  let user
  try{ user = await User.findCurrentUser(req)}
  catch{ return res.send({error: "User Not Found"})}
  req.user = user
  next()
}

async function addUserAndUserInfoToReq(req, res, next){
  let user
  try{ user = await User.findCurrentUser(req)}
  catch{ return res.send({error: "User Not Found"})}
  const userInfo = await UserInfo.get(user)
  req.user = user
  req.userInfo = userInfo
  next()
}

router.put('/edit/name/:id(\\d+)', authentication, addUserToReq, async (req, res)=>{
  const user = req.user
  let newName = req.body.name
  if(user.id.toString() !== req.params.id) return res.send({error: "You aren't allowed"})
  if(newName !== "" && newName.length <= 25)
    user.name = newName
  await user.save()
  res.send({message: "Name was changed successfully!"})
})

router.put('/edit/age/:id(\\d+)', authentication, addUserAndUserInfoToReq, async (req, res)=>{
  if(req.user.id.toString() !== req.params.id) return res.send({error: "You aren't allowed"})
  const userInfo = req.userInfo
  let age = parseInt(req.body.age)
  if(isNaN(age)) userInfo.age = null
  else userInfo.age = age
  await userInfo.save()
  res.send({message: "Age was changed successfully!"})
})

router.put('/edit/twitter_id/:id(\\d+)', authentication, addUserAndUserInfoToReq, async (req, res)=>{
  if(req.user.id.toString() !== req.params.id) return res.send({error: "You aren't allowed"})
  const userInfo = req.userInfo
  userInfo.twitter_id_str = req.body.twitterIdStr
  await userInfo.save()
  res.send({message: "twitter id was set successfully"})
})

router.put('/edit/gender/:id(\\d+)', authentication, addUserAndUserInfoToReq, async (req, res)=>{
  if(req.user.id.toString() !== req.params.id) return res.send({error: "You aren't allowed"})
  const userInfo = req.userInfo
  userInfo.gender = req.body.gender
  await userInfo.save()
  res.send({message: "gender was changed successfully"})
})

router.put('/edit/profile/:id(\\d+)', authentication, addUserAndUserInfoToReq, async (req, res)=>{
  if(req.user.id.toString() !== req.params.id) return res.send({error: "You aren't allowed"})
  const userInfo = req.userInfo
  userInfo.profile = req.body.profile
  await userInfo.save()
  res.send({message: "gender was changed successfully"})
})

module.exports = router;
