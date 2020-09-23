const fs = require('fs')
const Anime = require('./models/anime');
let anime = JSON.parse(fs.readFileSync('./allAnime.json', 'utf-8'));

let nashi = []
anime.map(e=>{
  Anime.findOne({where: {title: e.title}}).then(user => {
    if(!user) nashi.push(e.title)
  })
})

function showNashi(){
  console.log(nashi)
}

setTimeout(showNashi, 25000)