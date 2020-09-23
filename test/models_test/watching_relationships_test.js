const assert = require("power-assert")
const Watching_relationships_test = require('../../models/watching_relationships')

after(()=>{Watching_relationships_test.sync({force:true})})

it("watching_relationshipsに登録できる", (done) => {
  Watching_relationships_test.create({
    anime_id: 1,
    user_id: 1
  }).then((watching_relationships)=>{
    assert(watching_relationships, "watched_relationshipsへの登録ができませんでした")
  }).catch(()=>{
    assert.fail("watched_relationshipsへの登録ができませんでした")
  }).finally(()=>done())
})

it("watching_relationshipsにanime_idがないと登録できない", (done) => {
  Watching_relationships_test.create({
    user_id: 1
  }).then((watching_relationships)=>{
    assert.fail("watching_relationshipsにanime_idがなしで登録できてしまっている")
  }).finally(()=> done())
})

it("watching_relationshipsにuser_idがないと登録できない", (done) => {
  Watching_relationships_test.create({
    anime_id: 1
  }).then((watching_relationships)=> {
    assert(watching_relationships, "watching_relationshipsにuser_idなしで登録できてしまいました")
  }).finally(()=>{done()})
})
