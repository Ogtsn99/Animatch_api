const express = require('express')
const router = express.Router()
const Anime = require('../models/anime')

function envMustBeDevelopment(req, res, next){
  if(process.env.NODE_ENV === "development") next()
  else res.status(403).send("Sorry. You are not allowed to access.")
}

router.get('/', function(req, res, next) {
  Anime.findAll().then((allAnime) => {
    res.send({anime: allAnime})
  })
})

router.get('/:id(\\d+)/', (req, res) =>{
    Anime.findByPk(req.params.id)
      .then((anime) => {
        if(anime) res.send({anime:anime})
        else res.send({anime: null, message: "No anime found."})
      })
  }
)

module.exports = router
