let express = require('express')
let router = express.Router()
const Fav_Relationships = require('../models/fav_relationships')
const app = express()

function envMustBeDevelopment(req, res, next){
  if(app.get("env") === "development") next();
  else res.status(403).send("Sorry. You are not allowed to access.")
}

router.post('/create', envMustBeDevelopment, (req, res)=>{
  Fav_Relationships.create(req.body.fav_relationship)
    .then((fav_relation) => {
        res.send({message: "create a relation succeeded!"})
    }).catch(()=>{res.send({message: "failed to create a relation"})})
})

router.get('/', (req, res)=>{
  res.send({message: "yay"})
})

module.exports = router

