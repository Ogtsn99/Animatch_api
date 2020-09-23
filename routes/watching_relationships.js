let express = require('express')
let router = express.Router()
const Watching_Relationships = require('../models/watching_relationships')
const app = express()

function envMustBeDevelopment(req, res, next){
  if(app.get("env") === "development") next();
  else res.status(403).send("Sorry. You are not allowed to access.")
}

router.post('/create', envMustBeDevelopment, (req, res)=>{
  Watching_Relationships.create(req.body.watching_relationship)
    .then((watching_relationship) => {
      res.send({message: "create a relation succeeded!", watching_relationship: watching_relationship})
    }).catch(()=>{res.send({message: "failed to create a relation"})})
})

router.get('/', (req, res)=>{
  res.send({message: "yay"})
})

module.exports = router

