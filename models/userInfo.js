const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const UserInfo = loader.database.define('user_info', {
  profile: {
    type: Sequelize.STRING(510)
  },
  twitter_id_str: {
    type: Sequelize.STRING(25)
  },
  age: {
    type: Sequelize.INTEGER
  },
  gender: {
    type: Sequelize.STRING(10)
  },
  user_id: {
    type: Sequelize.INTEGER,
    unique: true
  }
}, {
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      fields: ['id']
    }
  ]
});

UserInfo.get = (user)=> {
  return new Promise((resolve, reject)=>{
    UserInfo.findOne({where: {user_id: user.id}}).then( user => {
      if(user) return resolve(user)
      else return reject()
    })
  })
}



module.exports = UserInfo