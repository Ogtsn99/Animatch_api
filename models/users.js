const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const UserInfo = require('../models/userInfo')

const User = loader.database.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  twitter_id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING(25),
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
        fields: ['id']
    },
    {
        fields: ['twitter_id']
    }
  ]
});

User.findCurrentUser = (req, withoutInfo)=> {
  let option = {where: {twitter_id: req.auth.id}, include: UserInfo}
  if(withoutInfo) option = {where: {twitter_id: req.auth.id}}
  return new Promise((resolve, reject)=>{
    if (req.auth) {
      User.findOne(option).then( user => {
        if(user) return resolve(user)
        else return reject()
      })
    }else return reject()
  })
}


module.exports = User;