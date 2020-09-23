let express = require('express')
let router = express.Router()
const Watched_Relationships = require('../models/watched_relationships')
const app = express()

function envMustBeDevelopment(req, res, next){
  if(app.get("env") === "development") next();
  else res.status(403).send("Sorry. You are not allowed to access.")
}

router.post('/create', envMustBeDevelopment, (req, res)=>{
  Watched_Relationships.create(req.body.watched_relationship)
    .then((watched_relationship) => {
      res.send({message: "create a relation succeeded!", watched_relationship: watched_relationship})
    }).catch(()=>{res.send({message: "failed to create a relation"})})
})

router.get('/', (req, res)=>{
  res.send({message: "yay"})
})

module.exports = router

