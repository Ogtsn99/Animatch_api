const assert = require("power-assert")
const Watched_relationships_test = require('../../models/watched_relationships')

after(()=>{Watched_relationships_test.sync({force:true})})

it("watched_relationshipsに登録できる", (done) => {
  Watched_relationships_test.create({
    anime_id: 1,
    user_id: 1
  }).then((watched_relationship)=>{
    assert(watched_relationship, "watched_relationshipsへの登録ができませんでした")
  }).catch(()=>{
    assert.fail("watched_relationshipsへの登録ができませんでした")
  }).finally(()=>done())
})

it("watched_relationshipsにanime_idがないと登録できない", (done) => {
  Watched_relationships_test.create({
    user_id: 1
  }).then((watched_relationships)=>{
    assert.fail("watched_relationshipsにanime_idがなしで登録できてしまっている")
  }).finally(()=> done())
})

it("watched_relationshipsにuser_idがないと登録できない", (done) => {
  Watched_relationships_test.create({
    anime_id: 1
  }).then((watched_relationships)=> {
    assert(watched_relationships, "watched_relationshipsにuser_idなしで登録できてしまいました")
  }).finally(()=>{done()})
})
