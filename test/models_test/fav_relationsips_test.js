const assert = require("power-assert")
const Fav_Relationships = require('../../models/fav_relationships')

after(()=>{Fav_Relationships.sync({force: true})})

it("fav_relationshipsに登録できる", (done) => {
  Fav_Relationships.create({
    anime_id: 1,
    user_id: 1
  }).then((fav_relationship)=>{
    assert(fav_relationship, "fav_relationshipsに登録できませんでした")
    done()
  }).catch(()=>{
    assert.fail("fav_relationshipsに登録できませんでした")
  })
})

it("fav_relationshipsにanime_idがないと登録できない", (done) => {
  Fav_Relationships.create({user_id: 1})
    .then(()=>{
      assert.fail("fav_relationshipsにuser_idなしで登録できてしまいました")
      done()})
    .catch(()=>{done()})
})

it("fav_relationshipsにuser_idがないと登録できない", (done) => {
  Fav_Relationships.create({
    anime_id: 1
  }).then(()=> {
    assert.fail("fav_relationshipsにuser_idなしで登録できてしまいました")
    done()
  }).catch(()=>{done()})
})
