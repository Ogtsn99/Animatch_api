const fs = require('fs')
const Anime = require('./models/anime');
let anime = JSON.parse(fs.readFileSync('./allAnime.json', 'utf-8'));
/*
Anime.create({
  title: anime[1].title,
  company: anime[1].company,
  broad: anime[1].broad,
  number_of_episodes: anime[1].numOfEpisodes,
  begin_date: anime[1].beginDate,
  end_date: anime[1].endDate
})*/

anime.map(e=> {
  let title = e.title
  let company = e.company
  let broad = e.broad
  let number_of_episodes = e.numOfEpisodes
  let begin_date = e.beginDate
  let end_date = e.endDate
  let status = e.status
  if(begin_date === "") begin_date = null
  if(end_date === "") end_date = null


  Anime.create({
    title: title,
    company: company,
    broad: broad,
    number_of_episodes: number_of_episodes,
    begin_date: begin_date,
    end_date: end_date,
    status: status
  })
})
