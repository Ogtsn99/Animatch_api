const assert = require("power-assert")
const User = require('../../models/users')

after(()=>{User.sync({force: true})})

it("users: ユーザーを登録できる", (done) => {
  User.create({twitter_id:"1111", name:"test_user", profile: "test"})
    .then((test_user) => {
      assert.ok(test_user)
      done()
    }).catch(()=>{
      assert.fail("users: ユーザー登録に失敗したようです")
      done()
    })
})

it("users: twitter_idがないと登録できない", (done) => {
    User.create({name: "test_user", profile: "test"})
      .then(()=>{
        assert.fail("twitter_idがなしで登録できている")
        done()})
      .catch(()=>{done()})
})




